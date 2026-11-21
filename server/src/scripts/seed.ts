/**
 * Seeds the projects collection from shared/projects.json (upsert by slug).
 *   npm run seed -w server            upsert
 *   npm run seed -w server -- --prune also delete projects no longer in the file
 */
import mongoose from 'mongoose'
import { loadEnv } from '../config/env.js'
import { loadSeedProjects } from '../lib/projectsData.js'
import { ProjectModel } from '../models/Project.js'
import { connectMongo } from '../stores/mongo.js'

const env = loadEnv()
if (!env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Add it to server/.env first.')
  process.exit(1)
}

const projects = loadSeedProjects()
await connectMongo(env.MONGODB_URI)
await ProjectModel.syncIndexes()

const res = await ProjectModel.bulkWrite(
  projects.map((p) => ({
    updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true },
  })),
)
console.log(
  `Upserted ${res.upsertedCount}, updated ${res.modifiedCount} of ${projects.length} projects`,
)

if (process.argv.includes('--prune')) {
  const del = await ProjectModel.deleteMany({ slug: { $nin: projects.map((p) => p.slug) } })
  console.log(`Pruned ${del.deletedCount} stale projects`)
}

await mongoose.disconnect()
