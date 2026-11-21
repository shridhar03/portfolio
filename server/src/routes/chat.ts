import type { Request, Response } from 'express'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { scrub, sessionHash } from '../lib/anonymise.js'
import { detectIntent } from '../lib/intent.js'
import { REFUSAL_TEXT, type ChatProvider } from '../lib/llm.js'
import type { Stores } from '../stores/types.js'

const ChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(1000),
      }),
    )
    .min(1)
    .max(12)
    .refine((m) => m.at(-1)?.role === 'user', 'The last message must be from the user'),
})

type Deps = { stores: Stores; provider: ChatProvider; system: string; logSalt: string }

/** Server-sent events over a POST response: `data: {json}\n\n` per event. */
function sse(res: Response) {
  res.status(200).set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.flushHeaders()
  return (event: Record<string, unknown>) => res.write(`data: ${JSON.stringify(event)}\n\n`)
}

export function chatRouter({ stores, provider, system, logSalt }: Deps) {
  const r = Router()

  r.post(
    '/',
    rateLimit({
      windowMs: 10 * 60_000,
      limit: 20,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    }),
    async (req: Request, res: Response) => {
      const parsed = ChatSchema.safeParse(req.body)
      if (!parsed.success) return void res.status(400).json({ error: 'Invalid chat request' })

      const messages = parsed.data.messages
      const question = messages.at(-1)!.content
      const intent = detectIntent(question)
      const send = sse(res)
      send({ type: 'meta', intent, mode: provider.kind })

      const ctrl = new AbortController()
      res.on('close', () => ctrl.abort()) // visitor closed the panel or navigated away
      let answer = ''

      try {
        if (intent === 'off-topic') {
          // Polite refusal without spending an API call.
          answer = REFUSAL_TEXT
          send({ type: 'delta', text: answer })
        } else {
          for await (const chunk of provider.streamReply({
            system,
            messages,
            intent,
            signal: ctrl.signal,
          })) {
            answer += chunk.text
            send({ type: 'delta', text: chunk.text })
          }
        }
        send({ type: 'done' })
      } catch (err) {
        if (!ctrl.signal.aborted) {
          console.error('Chat stream failed:', err)
          send({
            type: 'error',
            message: 'The assistant is having trouble right now. Please try again.',
          })
        }
      } finally {
        res.end()
      }

      // Anonymised log: no IP, emails, phones or URLs. Failure to log never affects the visitor.
      stores.chatLogs
        .create({
          sessionHash: sessionHash(req.ip ?? 'unknown', logSalt),
          intent,
          question: scrub(question).slice(0, 2000),
          answer: scrub(answer).slice(0, 4000),
        })
        .catch((e) => console.error('chat log failed:', e))
    },
  )

  return r
}
