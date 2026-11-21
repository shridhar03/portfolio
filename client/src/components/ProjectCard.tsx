import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import type { Project } from '@/content/projects'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0')

  if (project.status === 'coming-soon') {
    return (
      <article className="flex min-h-56 flex-col justify-between rounded-card border border-dashed border-border p-6 sm:p-8">
        <div className="flex items-center justify-between font-mono text-xs text-muted">
          <span>{num}</span>
          <span className="rounded-pill bg-surface-2 px-3 py-1">{project.category}</span>
        </div>
        <div>
          <Sparkles className="size-6 text-accent-fg" aria-hidden />
          <h3 className="mt-3 text-h3 font-semibold">Coming soon</h3>
          <p className="mt-1 text-muted">A new {project.category} project is in the works.</p>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative flex min-h-72 flex-col rounded-card border border-border bg-surface p-6 transition-colors hover:border-accent/60 sm:p-8">
      <div className="flex items-center justify-between font-mono text-xs text-muted">
        <span>{num}</span>
        <span className="rounded-pill bg-surface-2 px-3 py-1">{project.category}</span>
      </div>
      <h3 className="mt-8 text-h2 font-bold">
        <Link to={`/projects/${project.slug}`} className="after:absolute after:inset-0">
          {project.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-lg text-muted">{project.summary}</p>
      <div className="mt-auto flex items-end justify-between gap-4 pt-8">
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li key={s} className="rounded-pill border border-border px-3 py-1 font-mono text-xs">
              {s}
            </li>
          ))}
        </ul>
        <span
          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover:rotate-45"
          aria-hidden
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </article>
  )
}
