import type { Project } from '../lib/projectsData.js'
import type { Sentiment } from '../lib/sentiment.js'

export type NewMessage = { name: string; email: string; message: string; sentiment: Sentiment }
export type NewChatLog = {
  sessionHash: string
  intent: 'resume' | 'projects' | 'contact' | 'off-topic'
  question: string
  answer: string
}
export type SavedMessage = NewMessage & { id: string; emailed: boolean; createdAt: Date }

/** Storage boundary: Mongo in prod, in-memory for tests and DB-less local dev. */
export interface Stores {
  kind: 'mongo' | 'memory'
  projects: {
    list(): Promise<Project[]>
    get(slug: string): Promise<Project | null>
  }
  chatLogs: {
    create(l: NewChatLog): Promise<void>
  }
  messages: {
    create(m: NewMessage): Promise<SavedMessage>
    markEmailed(id: string): Promise<void>
  }
}
