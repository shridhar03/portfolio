import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import type { Env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { healthRouter } from './routes/health.js'

export function createApp(env: Env) {
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

  app.use('/api/health', healthRouter)

  app.use(notFound)
  app.use(errorHandler)
  return app
}
