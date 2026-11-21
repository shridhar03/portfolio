import { ArrowUpRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Phase 1: foundation preview. Real sections (Hero → Contact) arrive in Phase 2.
const swatches = [
  ['bg', 'bg-bg'],
  ['surface', 'bg-surface'],
  ['surface-2', 'bg-surface-2'],
  ['border', 'bg-border'],
  ['muted', 'bg-muted'],
  ['fg', 'bg-fg'],
  ['accent', 'bg-accent'],
] as const

export function HomePage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="blob -top-32 -left-24 -z-10 size-[28rem]" aria-hidden />
      <div
        className="blob top-1/3 -right-32 -z-10 size-[34rem] [--blob:var(--color-navy-glow)]"
        aria-hidden
      />

      <div className="mx-auto flex min-h-dvh max-w-content flex-col justify-center gap-8 px-4 pt-28 pb-16 sm:px-6">
        <p className="eyebrow">Satara, Maharashtra · India</p>
        <h1 className="text-display font-bold">
          Shridhar
          <br />
          Chavan<span className="text-accent">.</span>
        </h1>
        <p className="max-w-xl text-lead text-muted">
          MERN Developer · AI/ML &amp; NLP Enthusiast · Vibe Coder
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="mailto:shridharchavan03@gmail.com">
              <Mail aria-hidden /> Get in touch
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="https://www.linkedin.com/in/shridhar-chavan/" target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight aria-hidden />
            </a>
          </Button>
        </div>

        <div className="mt-8 rounded-card border border-border bg-surface/70 p-5 backdrop-blur">
          <p className="eyebrow mb-4">Design tokens · phase 1 preview</p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {swatches.map(([name, cls]) => (
              <li key={name} className="flex items-center gap-3">
                <span className={`size-8 shrink-0 rounded-lg border border-border ${cls}`} />
                <span className="font-mono text-xs text-muted">{name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2">
            <p className="font-display text-h2 font-semibold">Display · Bricolage Grotesque</p>
            <p className="text-body">Body · Geist. Clean, neutral, built for long reading.</p>
            <p className="font-mono text-sm text-muted">Mono · Geist Mono · labels &amp; code</p>
          </div>
        </div>
      </div>
    </section>
  )
}
