import { Router } from 'express'
import type { ChatProvider } from '../lib/llm.js'
import type { Mailer } from '../lib/mailer.js'
import type { Stores } from '../stores/types.js'

export function healthRouter({
  stores,
  mailer,
  chat,
}: {
  stores: Stores
  mailer: Mailer
  chat: ChatProvider
}) {
  const r = Router()
  r.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.round(process.uptime()),
      storage: stores.kind,
      email: mailer.enabled ? 'enabled' : 'disabled',
      chat: chat.kind,
      timestamp: new Date().toISOString(),
    })
  })
  return r
}
