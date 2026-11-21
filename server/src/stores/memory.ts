import { randomUUID } from 'node:crypto'
import type { Project } from '../lib/projectsData.js'
import type { SavedMessage, Stores } from './types.js'

export function createMemoryStores(seed: Project[]): Stores & { _messages: SavedMessage[] } {
  const projects = [...seed].sort((a, b) => a.order - b.order)
  const messages: SavedMessage[] = []
  return {
    kind: 'memory',
    _messages: messages,
    projects: {
      list: async () => projects,
      get: async (slug) => projects.find((p) => p.slug === slug) ?? null,
    },
    messages: {
      create: async (m) => {
        const saved = { ...m, id: randomUUID(), emailed: false, createdAt: new Date() }
        messages.push(saved)
        return saved
      },
      markEmailed: async (id) => {
        const m = messages.find((x) => x.id === id)
        if (m) m.emailed = true
      },
    },
  }
}
