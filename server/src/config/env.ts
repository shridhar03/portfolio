import { z } from 'zod'

const optional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  // Site origin(s) allowed by CORS. Comma-separated for more than one, e.g. the production
  // domain plus its *.vercel.app URL.
  CLIENT_ORIGIN: z
    .string()
    .default('http://localhost:5173')
    .transform((v) =>
      v
        .split(',')
        .map((o) => o.trim().replace(/\/+$/, ''))
        .filter(Boolean),
    )
    .pipe(z.array(z.string().url()).min(1)),
  // Optional in dev: without it the API serves projects from shared/projects.json and keeps
  // messages in memory. Required in production.
  MONGODB_URI: optional,
  // Optional: without it contact submissions are saved but no email is sent.
  RESEND_API_KEY: optional,
  CONTACT_TO_EMAIL: z
    .string()
    .email()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  CONTACT_FROM_EMAIL: z.string().default('Portfolio <onboarding@resend.dev>'),
  // Optional: without it the chatbot answers from fixed resume templates (offline mode).
  ANTHROPIC_API_KEY: optional,
  CHAT_MODEL: z.string().default('claude-opus-5-5'),
  CHAT_EFFORT: z.enum(['low', 'medium', 'high']).default('low'),
  // Salt for the daily-rotating visitor hash in chat logs. Set a random value in production.
  LOG_SALT: z.string().default('dev-salt'),
  // Reverse proxies in front of the API (Render/Railway: 1), so rate limits see the visitor's IP.
  TRUST_PROXY: z.coerce.number().int().min(0).default(1),
})

export type Env = z.infer<typeof EnvSchema>

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(source)
  if (!parsed.success) {
    console.error('Invalid environment variables:', z.treeifyError(parsed.error))
    throw new Error('Invalid environment variables')
  }
  if (parsed.data.NODE_ENV === 'production' && !parsed.data.MONGODB_URI) {
    throw new Error('MONGODB_URI is required in production')
  }
  return parsed.data
}
