import { lazy, Suspense, useEffect, useState } from 'react'
import { useTheme } from '@/providers/theme-context'
import { onIdle } from '@/lib/idle'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/motion'

const HeroScene = lazy(() => import('./HeroScene'))

/** The glowing particle sphere (used beside Contact). Loads three.js only after the page is idle, only on wide screens with motion allowed and WebGL. */
export function LazyHeroScene({ className }: { className?: string }) {
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
      className={cn(
        'pointer-events-none absolute -z-10 animate-[fade-in_1.2s_ease-out] opacity-80',
        className ?? 'inset-y-0 right-0 w-full lg:w-[58%]',
      )}
      aria-hidden
    >
      <Suspense fallback={null}>
        <HeroScene color={theme === 'dark' ? '#ff4b3a' : '#c81f17'} />
      </Suspense>
    </div>
  )
}
