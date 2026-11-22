import { motion, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useHydrated } from '@/hooks/useHydrated'
import { DUR, hasFinePointer, prefersReducedMotion, SPRING } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * A soft red light that follows the pointer across its parent (which must be `relative`).
 * Decorative, transform + opacity only. Mouse-only; nothing renders on touch or reduced motion.
 */
export function Spotlight({ size = 560, className }: { size?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [canShow] = useState(() => hasFinePointer() && !prefersReducedMotion())
  const enabled = useHydrated() && canShow
  const [on, setOn] = useState(false)
  const x = useSpring(0, SPRING.follow)
  const y = useSpring(0, SPRING.follow)

  useEffect(() => {
    const host = ref.current?.parentElement
    if (!enabled || !host) return
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = host.getBoundingClientRect()
      x.set(e.clientX - r.left)
      y.set(e.clientY - r.top)
      setOn(true)
    }
    const leave = () => setOn(false)
    host.addEventListener('pointermove', move, { passive: true })
    host.addEventListener('pointerleave', leave)
    return () => {
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={cn('pointer-events-none absolute top-0 left-0 rounded-full', className)}
      style={{
        width: size,
        height: size,
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        background:
          'radial-gradient(closest-side, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: DUR.ui }}
    />
  )
}
