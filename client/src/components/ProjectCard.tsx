import { ArrowUpRight } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router'
import { getProject, type Project } from '@/content/projects'
import { useCanPlayVideo } from '@/hooks/useCanPlayVideo'
import { SPRING } from '@/lib/motion-tokens'

const statusLabel: Record<Project['status'], string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  'coming-soon': 'Coming soon',
}

/** Subtle 3D tilt toward the pointer (max a few degrees). Mouse only; MotionConfig handles reduced motion. */
function useTilt(max = 6) {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING.follow)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING.follow)
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }
  return { style: { rotateX, rotateY, transformPerspective: 900 }, onPointerMove, reset }
}

/**
 * One project as a full-width row: number, big slanted name, summary and stack, with a cover
 * thumbnail on the right (it shares a layoutId with the case-study cover). A red wash sweeps in
 * behind the row on hover (transform only).
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  const tilt = useTilt()
  const video = useRef<HTMLVideoElement>(null)
  const canPlay = useCanPlayVideo()
  // API data may lag the bundled JSON; the demo path comes from the bundle.
  const demo = canPlay ? (project.demo ?? getProject(project.slug)?.demo) : undefined
  const play = () => void video.current?.play().catch(() => {})
  const stop = () => video.current?.pause()

  if (project.status === 'coming-soon') {
    return (
      <article className="grid items-center gap-3 border-t border-dashed border-border py-7 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-6">
        <span className="font-mono text-sm text-muted">{num}</span>
        <div>
          <h3 className="slant font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-none text-muted uppercase">
            {project.category} project
          </h3>
          <p className="mt-2 text-muted">Next up. It&apos;s in the works.</p>
        </div>
        <span className="w-fit rounded-pill border border-dashed border-border px-3 py-1 font-mono text-xs text-muted">
          {statusLabel[project.status]}
        </span>
      </article>
    )
  }

  return (
    <article
      onPointerEnter={demo ? play : undefined}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={(e) => {
        tilt.reset()
        if (demo && e.pointerType === 'mouse') stop()
      }}
      onFocus={demo ? play : undefined}
      onBlur={demo ? stop : undefined}
      data-cursor-label="View project"
      className="group relative isolate grid items-center gap-5 border-t border-border py-8 sm:grid-cols-[4rem_minmax(0,1fr)] lg:grid-cols-[4rem_minmax(0,1fr)_16rem] lg:gap-8"
    >
      <span
        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent)] transition-transform duration-700 ease-out-expo group-focus-within:scale-x-100 group-hover:scale-x-100"
        aria-hidden
      />
      <span className="font-mono text-sm text-accent-fg">{num}</span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span className="rounded-pill bg-surface-2 px-3 py-1">{project.category}</span>
          <span className="flex items-center gap-1.5 rounded-pill border border-border px-3 py-1">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            {statusLabel[project.status]}
          </span>
        </div>
        <h3 className="slant mt-3 font-display text-[clamp(2.25rem,1.4rem+3.4vw,4.5rem)] leading-[0.95] uppercase">
          <Link
            to={`/projects/${project.slug}`}
            viewTransition={false}
            className="after:absolute after:inset-0"
          >
            <motion.span
              layoutId={`project-title-${project.slug}`}
              className="inline-block transition-colors duration-300 group-hover:text-accent-fg"
            >
              {project.title}
            </motion.span>
          </Link>
        </h3>
        <p className="mt-3 max-w-xl text-muted">{project.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li key={s} className="rounded-pill border border-border px-3 py-1 font-mono text-xs">
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Cover: placeholder art until real screenshots exist; plays the demo clip on hover. */}
      <motion.div
        className="relative hidden transition-[translate] duration-500 ease-out-expo group-focus-within:-translate-y-1.5 group-hover:-translate-y-1.5 lg:block"
        style={tilt.style}
      >
        <motion.div
          layoutId={`project-cover-${project.slug}`}
          className="relative aspect-[4/3] overflow-hidden rounded-card border border-border bg-surface shadow-[0_24px_60px_-30px_rgb(0_0_0/0.7)] transition-[border-color] duration-500 group-hover:border-accent/60"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,var(--color-surface-2),var(--color-bg))] transition-transform duration-700 ease-out-expo group-hover:scale-110">
            <span className="slant absolute inset-0 grid place-items-center font-display text-[7rem] leading-none text-accent/35">
              {project.title.charAt(0)}
            </span>
          </div>
          {demo && (
            <video
              ref={video}
              src={demo}
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
            />
          )}
        </motion.div>
        <span
          className="absolute -top-3 -right-3 grid size-11 place-items-center overflow-hidden rounded-full bg-accent text-accent-ink"
          aria-hidden
        >
          {/* Arrow exits top-right while a second one slides in from bottom-left */}
          <ArrowUpRight className="size-5 transition-transform duration-500 ease-out-expo group-focus-within:translate-x-6 group-focus-within:-translate-y-6 group-hover:translate-x-6 group-hover:-translate-y-6" />
          <ArrowUpRight className="absolute size-5 -translate-x-6 translate-y-6 transition-transform duration-500 ease-out-expo group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      </motion.div>
    </article>
  )
}
