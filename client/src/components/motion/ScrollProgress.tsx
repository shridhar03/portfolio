import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { SPRING } from '@/lib/motion-tokens'

/** Thin red reading-progress bar along the top edge (transform: scaleX). Decorative. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, SPRING.snappy)
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-accent"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  )
}
