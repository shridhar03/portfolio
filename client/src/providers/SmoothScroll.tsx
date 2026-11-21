import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect, useState, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/motion'
import { LenisContext } from './lenis-context'

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. Off for reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: false })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expose the instance once created
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
