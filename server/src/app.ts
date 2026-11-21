import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import type { Env } from './config/env.js'
import type { Mailer } from './lib/mailer.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { contactRouter } from './routes/contact.js'
import { healthRouter } from './routes/health.js'
import { projectsRouter } from './routes/projects.js'
import type { Stores } from './stores/types.js'

export type AppDeps = { env: Env; stores: Stores; mailer: Mailer }

export function createApp({ env, stores, mailer }: AppDeps) {
  const app = express()

  app.disable('x-powered-by')
  app.set('trust proxy', 1) // behind Render/Railway proxy, so rate limits see the real IP
  app.use(helmet())
  app.use(cors({ origin: env.CLIENT_ORIGIN }))
  app.use(express.json({ limit: '32kb' }))
  app.use(
    '/api',
    rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }),
  )

  app.use('/api/health', healthRouter({ stores, mailer }))
  app.use('/api/projects', projectsRouter(stores))
  app.use('/api/contact', contactRouter(stores, mailer))

  app.use(notFound)
  app.use(errorHandler)
  return app
}
