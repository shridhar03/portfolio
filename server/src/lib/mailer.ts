import { Resend } from 'resend'
import type { Env } from '../config/env.js'
import type { SavedMessage } from '../stores/types.js'

export type Mailer = {
  enabled: boolean
  sendContactNotification(m: SavedMessage): Promise<boolean>
}

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )

const EMOJI = { positive: '🙂', neutral: '😐', negative: '🙁' } as const

export function renderContactEmail(m: SavedMessage) {
  const subject = `${EMOJI[m.sentiment.label]} New portfolio message from ${m.name}`
  const html = `
    <h2>New message from your portfolio</h2>
    <p><strong>${esc(m.name)}</strong> &lt;${esc(m.email)}&gt;</p>
    <p>Sentiment: <strong>${m.sentiment.label}</strong> (${m.sentiment.score})</p>
    <blockquote style="border-left:3px solid #e8a33a;padding-left:12px;white-space:pre-wrap">${esc(m.message)}</blockquote>`
  const text = `${m.name} <${m.email}>\nSentiment: ${m.sentiment.label} (${m.sentiment.score})\n\n${m.message}`
  return { subject, html, text }
}

/** Resend mailer. Without RESEND_API_KEY + CONTACT_TO_EMAIL it is a no-op that reports disabled. */
export function createMailer(env: Env): Mailer {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    return { enabled: false, sendContactNotification: async () => false }
  }
  const resend = new Resend(env.RESEND_API_KEY)
  const to = env.CONTACT_TO_EMAIL
  return {
    enabled: true,
    async sendContactNotification(m) {
      const { subject, html, text } = renderContactEmail(m)
      const { error } = await resend.emails.send({
        from: env.CONTACT_FROM_EMAIL,
        to,
        replyTo: m.email,
        subject,
        html,
        text,
      })
      if (error) {
        console.error('Resend error:', error.message)
        return false
      }
      return true
    },
  }
}
