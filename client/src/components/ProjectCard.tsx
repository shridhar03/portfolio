import { ArrowUpRight, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { PointerEvent } from 'react'
import { Link } from 'react-router'
import type { Project } from '@/content/projects'

/** 3D tilt following the pointer; Motion springs, transform only. Reduced motion handled by MotionConfig. */
function useTilt(max = 7) {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 })
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }
  return { style: { rotateX, rotateY, transformPerspective: 1000 }, onPointerMove, onPointerLeave }
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  const tilt = useTilt()

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
    <motion.article
      {...tilt}
      data-cursor="grow"
      className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-accent/60"
    >
      {/* Cover: zooms on hover. Placeholder art until real screenshots are added. */}
      <motion.div
        layoutId={`project-cover-${project.slug}`}
        className="relative h-40 overflow-hidden border-b border-border sm:h-48"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,var(--color-surface-2),var(--color-bg))] transition-transform duration-700 ease-out-expo group-hover:scale-110">
          <span className="absolute -right-4 -bottom-10 font-display text-[9rem] leading-none font-bold text-fg/[0.06]">
            {project.title.charAt(0)}
          </span>
          <span className="blob -top-10 -left-10 size-56 opacity-40" />
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between font-mono text-xs text-muted">
          <span>{num}</span>
          <span className="rounded-pill bg-surface-2 px-3 py-1">{project.category}</span>
        </div>
        <h3 className="mt-5 text-h2 font-bold">
          <Link
            to={`/projects/${project.slug}`}
            viewTransition={false}
            className="after:absolute after:inset-0"
          >
            <motion.span layoutId={`project-title-${project.slug}`} className="inline-block">
              {project.title}
            </motion.span>
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
      </div>
    </motion.article>
  )
}
