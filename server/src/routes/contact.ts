import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import type { Mailer } from '../lib/mailer.js'
import { tagSentiment } from '../lib/sentiment.js'
import type { Stores } from '../stores/types.js'

export const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(200),
  message: z.string().trim().min(10, 'Message should be at least 10 characters.').max(5000),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot: real users leave it empty
})

export function contactRouter(stores: Stores, mailer: Mailer) {
  const r = Router()

  r.post(
    '/',
    rateLimit({
      windowMs: 15 * 60_000,
      limit: 5,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    }),
    async (req, res) => {
      // Bots that fill the honeypot get a normal-looking success and nothing is stored.
      if (typeof req.body?.website === 'string' && req.body.website.length > 0) {
        return void res.status(201).json({ ok: true })
      }
      const parsed = ContactSchema.safeParse(req.body)
      if (!parsed.success) {
        const fields = z.flattenError(parsed.error).fieldErrors
        return void res.status(400).json({ error: 'Validation failed', fields })
      }

      const { name, email, message } = parsed.data
      const sentiment = tagSentiment(message)
      const saved = await stores.messages.create({ name, email, message, sentiment })

      try {
        const emailed = await mailer.sendContactNotification(saved)
        if (emailed) await stores.messages.markEmailed(saved.id)
      } catch (err) {
        console.error('Contact email failed:', err) // message is saved; don't fail the request
      }

      res.status(201).json({ ok: true })
    },
  )

  return r
}
