import { Router } from 'express'
import type { Mailer } from '../lib/mailer.js'
import type { Stores } from '../stores/types.js'

export function healthRouter({ stores, mailer }: { stores: Stores; mailer: Mailer }) {
  const r = Router()
  r.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.round(process.uptime()),
      storage: stores.kind,
      email: mailer.enabled ? 'enabled' : 'disabled',
      timestamp: new Date().toISOString(),
    })
  })
  return r
}
