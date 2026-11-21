import mongoose from 'mongoose'
import type { Project } from '../lib/projectsData.js'
import { MessageModel } from '../models/Message.js'
import { ProjectModel } from '../models/Project.js'
import type { Stores } from './types.js'

const PROJECTION = { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 } as const

export async function connectMongo(uri: string) {
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
  return mongoose.connection
}

export function createMongoStores(): Stores {
  return {
    kind: 'mongo',
    projects: {
      list: async () => ProjectModel.find({}, PROJECTION).sort({ order: 1 }).lean<Project[]>(),
      get: async (slug) => ProjectModel.findOne({ slug }, PROJECTION).lean<Project>(),
    },
    messages: {
      create: async (m) => {
        const doc = await MessageModel.create(m)
        return { ...m, id: doc.id as string, emailed: false, createdAt: doc.createdAt }
      },
      markEmailed: async (id) => {
        await MessageModel.updateOne({ _id: id }, { $set: { emailed: true } })
      },
    },
  }
}
