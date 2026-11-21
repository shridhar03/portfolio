import { lazy, Suspense, useEffect, useState } from 'react'
import { useTheme } from '@/providers/theme-context'
import { onIdle } from '@/lib/idle'
import { prefersReducedMotion } from '@/lib/motion'

const HeroScene = lazy(() => import('./HeroScene'))

/** Loads three.js only after the page is idle, only on wide screens with motion allowed and WebGL. */
export function LazyHeroScene() {
  const { theme } = useTheme()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(min-width: 768px)').matches) return
    if (!document.createElement('canvas').getContext('webgl2')) return
    return onIdle(() => setReady(true), 2500)
  }, [])

  if (!ready) return null
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full animate-[fade-in_1.2s_ease-out] opacity-70 lg:w-[58%]"
      aria-hidden
    >
      <Suspense fallback={null}>
        <HeroScene color={theme === 'dark' ? '#ffa31a' : '#c56a00'} />
      </Suspense>
    </div>
  )
}
