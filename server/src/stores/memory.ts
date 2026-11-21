import { randomUUID } from 'node:crypto'
import type { Project } from '../lib/projectsData.js'
import type { NewChatLog, SavedMessage, Stores } from './types.js'

export function createMemoryStores(
  seed: Project[],
): Stores & { _messages: SavedMessage[]; _chatLogs: NewChatLog[] } {
  const projects = [...seed].sort((a, b) => a.order - b.order)
  const messages: SavedMessage[] = []
  const chatLogs: NewChatLog[] = []
  return {
    kind: 'memory',
    _messages: messages,
    _chatLogs: chatLogs,
    chatLogs: {
      create: async (l) => {
        chatLogs.push(l)
      },
    },
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
