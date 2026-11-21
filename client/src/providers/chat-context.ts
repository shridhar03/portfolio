import { createContext, useContext } from 'react'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

export type ChatContextValue = {
  messages: ChatMessage[]
  streaming: boolean
  /** true between sending and the first streamed token: drives the typing indicator */
  waiting: boolean
  offline: boolean
  open: boolean
  setOpen: (open: boolean) => void
  send: (text: string) => void
  stop: () => void
  reset: () => void
}

export const ChatContext = createContext<ChatContextValue | null>(null)

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>')
  return ctx
}
