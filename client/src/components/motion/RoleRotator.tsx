import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

/** Cycles role words. Screen readers get the full list once; the animated word is aria-hidden. */
export function RoleRotator({
  roles,
  interval = 2200,
}: {
  roles: readonly string[]
  interval?: number
}) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), interval)
    return () => clearInterval(id)
  }, [reduced, roles.length, interval])

  return (
    <span className="inline-flex items-baseline gap-2">
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
    </span>
  )
}
