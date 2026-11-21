import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useHydrated } from '@/hooks/useHydrated'
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion'

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="grow"]'

/** Dot + trailing ring. Ring grows over interactive elements. Mouse-only, off for reduced motion. */
export function CustomCursor() {
  const [canShow] = useState(() => hasFinePointer() && !prefersReducedMotion())
  const enabled = useHydrated() && canShow
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      setHover(!!(e.target as Element | null)?.closest?.(INTERACTIVE))
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div
        className="absolute top-0 left-0 size-2 rounded-full bg-accent"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: hover ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="absolute top-0 left-0 size-9 rounded-full border border-accent"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? (hover ? 0.9 : 0.5) : 0, scale: hover ? 1.8 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </div>
  )
}
