import { z } from 'zod'

// Phase 1 only needs the basics. Later phases add MONGODB_URI, RESEND_API_KEY, ANTHROPIC_API_KEY.
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
})

export type Env = z.infer<typeof EnvSchema>

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(source)
  if (!parsed.success) {
    console.error('Invalid environment variables:', z.treeifyError(parsed.error))
    throw new Error('Invalid environment variables')
  }
  return parsed.data
}
