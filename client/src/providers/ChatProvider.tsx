import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createSseParser } from '@/lib/sse'
import { ChatContext, type ChatMessage } from './chat-context'

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const MAX_HISTORY = 12 // matches the server limit
const uid = () => Math.random().toString(36).slice(2, 10)

/** One conversation shared by the floating widget and the full-screen /chat page. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [offline, setOffline] = useState(false)
  const [open, setOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const historyRef = useRef<ChatMessage[]>([])
  useEffect(() => {
    historyRef.current = messages
  }, [messages])

  const patchLast = (fn: (m: ChatMessage) => ChatMessage) =>
    setMessages((ms) => [...ms.slice(0, -1), fn(ms.at(-1)!)])

  const send = useCallback(async (text: string) => {
    const content = text.trim().slice(0, 1000)
    if (!content || abortRef.current) return
    const user: ChatMessage = { id: uid(), role: 'user', content }
    const assistant: ChatMessage = { id: uid(), role: 'assistant', content: '' }
    const history = [...historyRef.current.filter((m) => !m.error), user]
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content }))
    // The API needs the conversation to start with a user turn.
    while (history[0]?.role === 'assistant') history.shift()

    setMessages((ms) => [...ms, user, assistant])
    setStreaming(true)
    setWaiting(true)
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const fail = (msg: string) =>
      patchLast((m) => ({ ...m, content: m.content || msg, error: !m.content }))

    try {
      const res = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      })
      if (res.status === 429)
        return fail("You've asked a lot of questions! Please wait a few minutes.")
      if (!res.ok || !res.body)
        return fail('The assistant is unavailable right now. Please try again.')

      const decoder = new TextDecoder()
      const feed = createSseParser((e) => {
        if (e.type === 'meta') setOffline(e.mode === 'offline')
        else if (e.type === 'delta') {
          setWaiting(false)
          patchLast((m) => ({ ...m, content: m.content + e.text }))
        } else if (e.type === 'error') fail(e.message)
      })
      const reader = res.body.getReader()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        feed(decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError')
        fail("Couldn't reach the assistant. Check your connection.")
    } finally {
      abortRef.current = null
      setStreaming(false)
      setWaiting(false)
      // Drop an empty assistant bubble left by an aborted request.
      setMessages((ms) =>
        ms.at(-1)?.role === 'assistant' && !ms.at(-1)?.content ? ms.slice(0, -1) : ms,
      )
    }
  }, [])

  const stop = useCallback(() => abortRef.current?.abort(), [])
  const reset = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
  }, [])

  const value = useMemo(
    () => ({ messages, streaming, waiting, offline, open, setOpen, send, stop, reset }),
    [messages, streaming, waiting, offline, open, send, stop, reset],
  )
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
