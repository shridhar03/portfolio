import { z } from 'zod'

const optional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
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
