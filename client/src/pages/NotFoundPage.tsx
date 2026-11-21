import { motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { Sun } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

/** Playful 404: digits drop in, and the "0" is a sun you can drag around the hills. */
export function NotFoundPage() {
  const reduced = useReducedMotion()
  const bounds = useRef<HTMLDivElement>(null)

  const drop = (i: number) => ({
    initial: { y: reduced ? 0 : -160, opacity: 0, rotate: reduced ? 0 : (i - 1) * 12 },
    animate: { y: 0, opacity: 1, rotate: 0 },
    transition: { type: 'spring' as const, stiffness: 260, damping: 14, delay: 0.1 + i * 0.12 },
  })

  return (
    <section className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-40 text-center sm:px-6">
      {/* Rolling hills, a nod to the hero photo */}
      <svg
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 w-full text-surface-2"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="currentColor" d="M0 224 C240 140 420 140 640 200 S1080 300 1440 180 V320 H0Z" />
        <path
          className="text-surface"
          fill="currentColor"
          d="M0 280 C300 220 520 240 760 270 S1200 300 1440 250 V320 H0Z"
        />
      </svg>

      <p className="eyebrow">Error 404</p>
      <div
        ref={bounds}
        className="mt-6 flex items-center justify-center font-display text-[clamp(7rem,28vw,18rem)] leading-none font-bold"
        aria-label="404"
        role="img"
      >
        <motion.span {...drop(0)}>4</motion.span>
        <motion.span
          {...drop(1)}
          drag={!reduced}
          dragConstraints={bounds}
          dragElastic={0.4}
          dragSnapToOrigin
          whileDrag={{ scale: 1.1 }}
          whileHover={reduced ? undefined : { rotate: 20 }}
          className="mx-[0.06em] inline-grid size-[0.72em] cursor-grab touch-none place-items-center rounded-full bg-accent text-accent-ink shadow-[0_0_80px_-10px_var(--color-accent)] active:cursor-grabbing"
          title="Drag me"
        >
          <Sun className="size-[45%]" strokeWidth={2.25} aria-hidden />
        </motion.span>
        <motion.span {...drop(2)}>4</motion.span>
      </div>
      <h1 className="mt-6 text-h2 font-bold">
        Lost in the <span className="text-accent-fg">hills</span>.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        This page wandered off the trail. Drag the sun around while you're here, or head back home.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/">Take me home</Link>
      </Button>
    </section>
  )
}
