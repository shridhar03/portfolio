import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { ChatPanel } from '@/components/chat/ChatPanel'

/** Full-screen "Ask Shridhar". Shares the conversation with the floating widget. */
export function ChatPage() {
  return (
    <section className="relative isolate flex h-dvh flex-col overflow-hidden pt-20">
      <div className="blob -top-40 left-1/4 -z-10 size-[30rem]" aria-hidden />
      <div className="mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden /> Back to portfolio
        </Link>
        <p className="eyebrow mt-6">AI assistant</p>
        <h1 className="mt-2 text-h2 font-bold">
          Ask <span className="text-accent-fg">Shridhar</span>
        </h1>
        <p className="mt-2 text-muted">
          Answers come from his resume, streamed live by Claude. Off-topic questions are politely
          declined.
        </p>
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col pb-2">
        <ChatPanel variant="page" autoFocus />
      </div>
    </section>
  )
}
