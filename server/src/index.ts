import { createApp } from './app.js'
import { loadEnv } from './config/env.js'
import { createMailer } from './lib/mailer.js'
import { loadSeedProjects } from './lib/projectsData.js'
import { createMemoryStores } from './stores/memory.js'
import { connectMongo, createMongoStores } from './stores/mongo.js'
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

createApp({ env, stores, mailer }).listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`)
})
