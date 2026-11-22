import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { DIST, DUR, EASE } from '@/lib/motion-tokens'

/** Route enter/exit. Opacity + transform only; MotionConfig turns transforms off for reduced motion. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: DIST.md }}
      animate={{ opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE.out } }}
      exit={{ opacity: 0, y: -DIST.sm, transition: { duration: DUR.ui, ease: EASE.in } }}
    >
      {children}
    </motion.div>
  )
}
