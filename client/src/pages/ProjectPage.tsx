import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { getProject, isTodo } from '@/content/projects'
import { NotFoundPage } from './NotFoundPage'

export function ProjectPage() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  if (!project || project.status === 'coming-soon' || !project.caseStudy) return <NotFoundPage />

  const { caseStudy: cs, links } = project
  const blocks = [
    ['Problem', cs.problem],
    ['Approach', cs.approach],
    ['Outcome', cs.outcome],
  ] as const

  return (
    <article className="relative isolate overflow-hidden">
      <div className="blob -top-40 right-0 -z-10 size-[30rem]" aria-hidden />
      <div className="mx-auto max-w-content px-4 pt-32 pb-section sm:px-6">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden /> All projects
        </Link>
        <p className="eyebrow mt-10">{project.category}</p>
        <h1 className="mt-4 text-h1 font-bold">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-lead text-muted">{project.summary}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {!isTodo(links.live) && (
            <Button asChild>
              <a href={links.live} target="_blank" rel="noreferrer">
                Live site <ArrowUpRight aria-hidden />
              </a>
            </Button>
          )}
          {!isTodo(links.repo) && (
            <Button asChild variant="outline">
              <a href={links.repo} target="_blank" rel="noreferrer">
                Source <ArrowUpRight aria-hidden />
              </a>
            </Button>
          )}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            {blocks.map(([h, body]) => (
              <section key={h}>
                <h2 className="text-h3 font-semibold">{h}</h2>
                <p
                  className={
                    isTodo(body)
                      ? 'mt-3 font-mono text-sm text-muted italic'
                      : 'mt-3 text-lead text-muted'
                  }
                >
                  {body}
                </p>
              </section>
            ))}
            <section>
              <h2 className="text-h3 font-semibold">Screenshots</h2>
              <div className="mt-4 grid aspect-video place-items-center rounded-card border border-dashed border-border font-mono text-sm text-muted">
                TODO: add screenshots
              </div>
            </section>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-card border border-border bg-surface p-6 lg:sticky lg:top-28">
              <h2 className="eyebrow">Stack</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s} className="rounded-pill bg-surface-2 px-3 py-1 font-mono text-xs">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
