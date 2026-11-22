import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useHydrated } from '@/hooks/useHydrated'
import { DUR, EASE, hasFinePointer, prefersReducedMotion, SPRING } from '@/lib/motion'

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="grow"]'

/**
 * Dot + trailing ring. The ring grows over interactive elements, and over anything with
 * `data-cursor-label="View project"` it becomes a red pill showing that label. Purely visual:
 * pointer-events none, native clicks and text selection untouched. Mouse-only, off for reduced motion.
 */
export function CustomCursor() {
  const [canShow] = useState(() => hasFinePointer() && !prefersReducedMotion())
  const enabled = useHydrated() && canShow
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, SPRING.follow)
  const ry = useSpring(y, SPRING.follow)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const t = e.target as Element | null
      setHover(!!t?.closest?.(INTERACTIVE))
      setLabel(t?.closest?.<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel ?? null)
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
        animate={{ opacity: visible && !label ? 1 : 0, scale: hover ? 0 : 1 }}
        transition={{ duration: DUR.micro }}
      />
      <motion.div
        className="absolute top-0 left-0 size-9 rounded-full border border-accent"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible && !label ? (hover ? 0.9 : 0.5) : 0,
          scale: hover ? 1.8 : 1,
        }}
        transition={{ type: 'spring', ...SPRING.snappy }}
      />
      {/* Hover label (e.g. "View project") */}
      <motion.div
        className="absolute top-0 left-0 grid size-24 place-items-center rounded-full bg-accent px-3 text-center font-mono text-[0.65rem] leading-tight tracking-[0.12em] text-accent-ink uppercase"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        initial={false}
        animate={{ opacity: visible && label ? 1 : 0, scale: visible && label ? 1 : 0.3 }}
        transition={{ duration: DUR.ui, ease: EASE.out }}
      >
        {label}
      </motion.div>
    </div>
  )
}
