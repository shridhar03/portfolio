import { Pause, Play } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useHydrated } from '@/hooks/useHydrated'

/**
 * Cycles role words. Screen readers get the full list once; the animated word is aria-hidden.
 * WCAG 2.2.2: rotation pauses on hover and has a pause/play button; reduced motion never rotates.
 */
export function RoleRotator({
  roles,
  interval = 2200,
}: {
  roles: readonly string[]
  interval?: number
}) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const hydrated = useHydrated()

  useEffect(() => {
    if (reduced || paused || hovered) return
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), interval)
    return () => clearInterval(id)
  }, [reduced, paused, hovered, roles.length, interval])

  return (
    <span
      className="inline-flex items-baseline gap-2"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden className="relative inline-grid overflow-hidden">
        {/* invisible longest word reserves width: no layout shift */}
        <span className="invisible col-start-1 row-start-1">
          {roles.reduce((a, b) => (b.length > a.length ? b : a))}
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={roles[i]}
            className="col-start-1 row-start-1 text-fg"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {roles[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      {hydrated && !reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label="Pause rotating roles"
          className="-my-3 grid size-11 shrink-0 place-items-center self-center rounded-full text-muted transition-colors hover:text-fg"
        >
          {paused ? (
            <Play className="size-3.5" aria-hidden />
          ) : (
            <Pause className="size-3.5" aria-hidden />
          )}
        </button>
      )}
    </span>
  )
}
