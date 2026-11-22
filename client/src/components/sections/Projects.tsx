import { Spotlight } from '@/components/motion/Spotlight'
import { ProjectCard } from '@/components/ProjectCard'
import { useProjects } from '@/hooks/useProjects'

export function Projects() {
  const projects = useProjects()
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative isolate scroll-mt-20 overflow-hidden py-section"
    >
      <Spotlight className="-z-10" size={720} />
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow" data-reveal>
              04 · Projects
            </p>
            <h2 id="projects-title" className="slant mt-3 text-h2" data-tilt>
              Things I&apos;ve <span className="text-accent-fg">shipped.</span>
            </h2>
          </div>
          <p className="text-lead text-muted lg:col-span-4" data-reveal>
            From a maths optimiser to e-commerce to this site. Open one for the case study.
          </p>
        </div>
        <ul className="mt-10 border-b border-border sm:mt-14" data-reveal-stagger>
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
