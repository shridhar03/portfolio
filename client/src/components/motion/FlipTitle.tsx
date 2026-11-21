import { motion } from 'motion/react'
import { useHydrated } from '@/hooks/useHydrated'

/**
 * Page title whose words flip up in 3D (rotateX) when a route mounts after a client-side
 * navigation. A prerendered first load shows the title as-is (no hidden text before JS), and
 * MotionConfig turns the rotation off for reduced motion.
 */
export function FlipTitle({ text }: { text: string }) {
  const hydrated = useHydrated()
  return (
    <span className="inline-block [perspective:900px]">
      {text.split(' ').map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block origin-bottom whitespace-pre"
          initial={hydrated ? { rotateX: -90, opacity: 0 } : false}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
        >
          {i > 0 ? ` ${word}` : word}
        </motion.span>
      ))}
    </span>
  )
}
