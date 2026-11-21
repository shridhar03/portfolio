import Anthropic from '@anthropic-ai/sdk'
import type { Env } from '../config/env.js'
import type { Intent } from './intent.js'
import type { ProfileData } from './profileData.js'

export type ChatTurn = { role: 'user' | 'assistant'; content: string }
export type ReplyChunk = { text: string }

/** Anything that can stream a reply. Anthropic in prod; an offline responder when no key is set. */
export interface ChatProvider {
  kind: 'anthropic' | 'offline'
  streamReply(args: {
    system: string
    messages: ChatTurn[]
    intent: Intent
    signal: AbortSignal
  }): AsyncIterable<ReplyChunk>
}

export const REFUSAL_TEXT =
  "Sorry, I can't help with that one. I can tell you about Shridhar's skills, experience, projects, education, or how to get in touch."

export function createAnthropicProvider(env: Env & { ANTHROPIC_API_KEY: string }): ChatProvider {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 2, timeout: 60_000 })
  return {
    kind: 'anthropic',
    async *streamReply({ system, messages, signal }) {
      const stream = client.beta.messages.stream(
        {
          model: env.CHAT_MODEL,
          max_tokens: 2048,
          // Chat is a short-answer route: low effort keeps latency and cost down.
          output_config: { effort: env.CHAT_EFFORT },
          // On a safety decline, the API retries on a fallback model it picks by category.
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          // Stable system prompt is cached across visitors.
          system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
          messages,
        },
        { signal },
      )
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield { text: event.delta.text }
        }
      }
      const final = await stream.finalMessage()
      if (final.stop_reason === 'refusal') yield { text: `\n\n${REFUSAL_TEXT}` }
      else if (final.stop_reason === 'max_tokens') yield { text: '…' }
    },
  }
}

/**
 * No-API-key fallback: answers common questions from the resume with fixed templates, so the
 * widget still works in local dev and if the key is missing in production.
 */
export function createOfflineProvider(p: ProfileData): ChatProvider {
  const me = p.profile
  const first = me.name.split(' ')[0]
  const answers: Record<Intent, string> = {
    resume: [
      `${first} is a ${me.tagline.split(' · ')[0]} based in ${me.location}.`,
      `He holds an ${p.education[0].degree} from ${p.education[0].school} (${p.education[0].score}) and worked as a ${p.experience[0].role} at ${p.experience[0].company}.`,
      `Core skills: ${p.skillGroups
        .slice(0, 2)
        .flatMap((g) => g.items)
        .slice(0, 7)
        .join(', ')}.`,
    ].join(' '),
    projects:
      'Highlights include **Optimal Solutionizer** (a maths optimiser on Node.js, deployed on Vercel), an **Online Shopping System** (PHP + MySQL), and this portfolio (MERN + AI chatbot + NLP). Open any project card for the case study.',
    contact: `You can email ${first} at ${me.email}, connect on LinkedIn (${me.linkedin}), or use the contact form at the bottom of this page.`,
    'off-topic': REFUSAL_TEXT,
  }
  return {
    kind: 'offline',
    async *streamReply({ intent, signal }) {
      const text = `${answers[intent]}\n\n_(The AI assistant is offline right now, so this is a quick summary.)_`
      // Stream word by word so the UI behaves the same as with the live model.
      for (const word of text.split(/(?<=\s)/)) {
        if (signal.aborted) return
        yield { text: word }
        await new Promise((r) => setTimeout(r, 12))
      }
    },
  }
}
