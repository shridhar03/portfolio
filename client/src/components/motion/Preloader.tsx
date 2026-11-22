import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { counterAt } from '@/lib/preloader'

const NAME = 'SHRIDHAR'
const COUNT_MS = 950 // letters + counter
const WIPE_MS = 500 // curtain; total stays under 1.5s

/** First-visit intro: letters assemble, counter 0→100, curtain wipes up into the hero. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const raf = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      setCount(counterAt(elapsed, COUNT_MS))
      if (elapsed < COUNT_MS) raf.current = requestAnimationFrame(step)
      else setLeaving(true)
    }
    raf.current = requestAnimationFrame(step)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(raf.current)
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      role="presentation"
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
      initial={{ y: 0 }}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: WIPE_MS / 1000, ease: [0.83, 0, 0.17, 1] }}
      onAnimationComplete={() => leaving && onDone()}
      style={{ willChange: 'transform' }}
    >
      <div
        className="absolute size-[min(36rem,90vw)] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_40%,transparent),transparent)]"
        aria-hidden
      />
      <div className="slant relative flex overflow-hidden font-display text-[clamp(3rem,12vw,8rem)] uppercase">
        {NAME.split('').map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch}
          </motion.span>
        ))}
        <motion.span
          className="text-accent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: NAME.length * 0.05, type: 'spring', stiffness: 400, damping: 15 }}
        >
          .
        </motion.span>
      </div>
      <div className="relative mt-6 flex w-[min(18rem,70vw)] items-center gap-4 font-mono text-sm text-muted">
        <div className="h-px flex-1 overflow-hidden bg-border">
          <div
            className="h-full origin-left bg-accent"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
        <span className="w-10 text-right tabular-nums">{count}</span>
      </div>
    </motion.div>
  )
}
