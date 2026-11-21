import { ArrowUp, RotateCcw, Square, WifiOff } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { useChat } from '@/providers/chat-context'
import { RichText } from './RichText'

const SUGGESTIONS = [
  "What's Shridhar's tech stack?",
  'Tell me about his projects',
  'Where did he study?',
  'How can I contact him?',
]

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-muted"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

/** The conversation UI, shared by the floating widget and the full-screen /chat page. */
export function ChatPanel({
  variant = 'widget',
  autoFocus,
}: {
  variant?: 'widget' | 'page'
  autoFocus?: boolean
}) {
  const { messages, streaming, waiting, offline, send, stop, reset } = useChat()
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // Keep the newest message in view while streaming.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight })
  }, [messages])

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (!draft.trim() || streaming) return
    send(draft)
    setDraft('')
  }
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) submit(e)
  }

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col',
        variant === 'page' && 'mx-auto w-full max-w-3xl',
      )}
    >
      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
        data-lenis-prevent
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col justify-end gap-4">
            <p className="text-muted">
              Hi! I'm an AI assistant that knows Shridhar's resume. Ask about his skills, projects,
              experience or how to reach him.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-pill border border-border bg-surface-2 px-3 py-1.5 text-left text-sm transition-colors hover:border-accent/60"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => {
            const isLast = i === messages.length - 1
            return (
              <motion.div
                key={m.id}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-br-md bg-accent text-accent-ink'
                      : 'rounded-bl-md border border-border bg-surface-2 text-fg',
                    m.error && 'border-red-400/60 text-red-700 dark:text-red-200',
                  )}
                >
                  <span className="sr-only">{m.role === 'user' ? 'You: ' : 'Assistant: '}</span>
                  {m.role === 'assistant' && isLast && waiting && !m.content ? (
                    <TypingDots />
                  ) : m.role === 'assistant' ? (
                    <RichText text={m.content} />
                  ) : (
                    m.content
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <form onSubmit={submit} className="border-t border-border p-3 sm:p-4">
        {offline && (
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[0.7rem] text-muted">
            <WifiOff className="size-3" aria-hidden /> Offline mode: answers come from a resume
            summary
          </p>
        )}
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface-2 p-1.5 focus-within:border-accent">
          <label htmlFor={`chat-input-${variant}`} className="sr-only">
            Ask a question about Shridhar
          </label>
          <textarea
            id={`chat-input-${variant}`}
            ref={inputRef}
            rows={1}
            maxLength={1000}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question…"
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-[0.95rem] text-fg placeholder:text-muted/80 focus:outline-none"
          />
          {messages.length > 0 && !streaming && (
            <button
              type="button"
              onClick={reset}
              className="grid size-10 place-items-center rounded-xl text-muted hover:text-fg"
              aria-label="Start a new conversation"
            >
              <RotateCcw className="size-4" aria-hidden />
            </button>
          )}
          {streaming ? (
            <button
              type="button"
              onClick={stop}
              className="grid size-10 place-items-center rounded-xl bg-fg text-bg"
              aria-label="Stop generating"
            >
              <Square className="size-3.5 fill-current" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!draft.trim()}
              className="grid size-10 place-items-center rounded-xl bg-accent text-accent-ink transition-opacity disabled:opacity-40"
              aria-label="Send"
            >
              <ArrowUp className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[0.7rem] text-muted">
          AI answers can be wrong. Questions are logged anonymously to improve answers.
        </p>
      </form>
    </div>
  )
}
