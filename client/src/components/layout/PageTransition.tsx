import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Route enter/exit. Opacity + transform only; MotionConfig turns transforms off for reduced motion. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] } }}
    >
      {children}
    </motion.div>
  )
}
