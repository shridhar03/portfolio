import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { useHydrated } from '@/hooks/useHydrated'
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion'

/** Pulls its child toward the pointer while hovered. Inert on touch / reduced motion. */
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [canPull] = useState(() => hasFinePointer() && !prefersReducedMotion())
  const enabled = useHydrated() && canPull
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 })

  const onMove = (e: PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  if (!enabled) return <div className="inline-block">{children}</div>
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
