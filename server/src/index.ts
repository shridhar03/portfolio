import { createApp } from './app.js'
import { loadEnv } from './config/env.js'
import { createAnthropicProvider, createOfflineProvider } from './lib/llm.js'
import { createMailer } from './lib/mailer.js'
import { loadProfile } from './lib/profileData.js'
import { buildSystemPrompt } from './lib/resumeContext.js'
import { loadSeedProjects } from './lib/projectsData.js'
import { createMemoryStores } from './stores/memory.js'
import { connectMongo, createMongoStores, disconnectMongo } from './stores/mongo.js'
import type { Stores } from './stores/types.js'

const env = loadEnv()

let stores: Stores
if (env.MONGODB_URI) {
  await connectMongo(env.MONGODB_URI)
  stores = createMongoStores()
  console.log('Connected to MongoDB')
} else {
  stores = createMemoryStores(loadSeedProjects())
  console.warn('MONGODB_URI not set: using in-memory storage (projects from shared/projects.json)')
}

const mailer = createMailer(env)
if (!mailer.enabled)
  console.warn('RESEND_API_KEY / CONTACT_TO_EMAIL not set: contact emails disabled')

const profile = loadProfile()
const system = buildSystemPrompt(profile, await stores.projects.list())
const provider = env.ANTHROPIC_API_KEY
  ? createAnthropicProvider({ ...env, ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY })
  : createOfflineProvider(profile)
if (provider.kind === 'offline')
  console.warn('ANTHROPIC_API_KEY not set: chatbot runs in offline mode')
if (env.NODE_ENV === 'production' && env.LOG_SALT === 'dev-salt')
  console.warn('Set LOG_SALT in production')

const server = createApp({ env, stores, mailer, chat: { provider, system } }).listen(
  env.PORT,
  () => {
    console.log(`API listening on http://localhost:${env.PORT}`)
  },
)

// Hosts stop instances with SIGTERM on every deploy: finish in-flight requests, then close the DB.
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.once(signal, () => {
    console.log(`${signal} received, shutting down`)
    server.close(async () => {
      if (stores.kind === 'mongo') await disconnectMongo()
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000).unref()
  })
}
