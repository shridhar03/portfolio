import { ProjectCard } from '@/components/ProjectCard'
import { projects } from '@/content/projects'

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative scroll-mt-20 py-section"
    >
      <div className="mx-auto grid max-w-content gap-10 px-4 sm:px-6 lg:grid-cols-12">
        {/* Sticky intro column; cards scroll past it on large screens */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow" data-reveal>
              04 · Projects
            </p>
            <h2 id="projects-title" className="mt-3 text-h2 font-bold" data-reveal>
              Selected work
            </h2>
            <p className="mt-4 text-lead text-muted" data-reveal>
              From a maths optimiser to e-commerce to this site. Open a card for the case study.
            </p>
          </div>
        </div>
        <ul className="grid gap-5 lg:col-span-8" data-reveal-stagger>
          {projects.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard project={p} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
