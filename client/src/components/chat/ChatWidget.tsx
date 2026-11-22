import { Maximize2, MessageCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { lazy, Suspense, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { useChat } from '@/providers/chat-context'
import { asset } from '@/lib/base'

const ChatPanel = lazy(() => import('./ChatPanel').then((m) => ({ default: m.ChatPanel })))

/** Floating launcher that morphs (shared layoutId) into the chat panel. Hidden on /chat. */
export function ChatWidget() {
  const { open, setOpen } = useChat()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  if (pathname === '/chat') return null

  return (
    <div className="fixed right-4 bottom-4 z-[80] sm:right-6 sm:bottom-6">
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <motion.section
            key="panel"
            layoutId="chat-shell"
            role="dialog"
            aria-label="Ask Shridhar chat"
            className="flex h-[min(36rem,calc(100dvh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-card border border-border bg-surface shadow-2xl shadow-black/40 sm:w-[24rem]"
            style={{ borderRadius: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <motion.header
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              className="flex items-center justify-between gap-3 border-b border-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={asset('/img/profile-360.webp')}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover object-top"
                />
                <div>
                  <p className="font-display font-semibold">Ask Shridhar</p>
                  <p className="text-xs text-muted">Answers from his resume</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/chat"
                  onClick={() => setOpen(false)}
                  className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
                  aria-label="Open full-screen chat"
                >
                  <Maximize2 className="size-4" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
                  aria-label="Close chat"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </motion.header>
            <Suspense
              fallback={
                <p className="grid flex-1 place-items-center text-sm text-muted" role="status">
                  Loading chat…
                </p>
              }
            >
              <ChatPanel autoFocus />
            </Suspense>
          </motion.section>
        ) : (
          <motion.button
            key="launcher"
            layoutId="chat-shell"
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-accent py-3 pr-5 pl-4 font-medium text-accent-ink shadow-lg shadow-black/30"
            style={{ borderRadius: 999 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-haspopup="dialog"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <MessageCircle className="size-5" aria-hidden />
            <span>Ask Shridhar</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
