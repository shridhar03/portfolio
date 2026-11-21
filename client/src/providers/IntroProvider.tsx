import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useHydrated } from '@/hooks/useHydrated'
import { Preloader } from '@/components/motion/Preloader'
import { prefersReducedMotion } from '@/lib/motion'
import { shouldShowPreloader, VISITED_KEY } from '@/lib/preloader'
import { IntroContext } from './intro-context'

function readVisited() {
  try {
    return sessionStorage.getItem(VISITED_KEY) ?? localStorage.getItem(VISITED_KEY)
  } catch {
    return null
  }
}

export function IntroProvider({ children }: { children: ReactNode }) {
  // Never during the build-time prerender: the static HTML is the content, not the intro.
  const [showPreloader] = useState(
    () =>
      typeof window !== 'undefined' &&
      shouldShowPreloader({ visited: readVisited(), reducedMotion: prefersReducedMotion() }),
  )
  const [introDone, setIntroDone] = useState(!showPreloader)

  const finishIntro = useCallback(() => {
    try {
      localStorage.setItem(VISITED_KEY, '1')
    } catch {
      /* ignore */
    }
    setIntroDone(true)
  }, [])

  // index.html covers the prerendered page with `intro-pending` on a first visit until the
  // preloader has played; lift it once the intro is over (or was never needed).
  useEffect(() => {
    if (introDone) document.documentElement.classList.remove('intro-pending')
  }, [introDone])

  const hydrated = useHydrated()
  const value = useMemo(() => ({ introDone, finishIntro }), [introDone, finishIntro])
  return (
    <IntroContext.Provider value={value}>
      {hydrated && showPreloader && !introDone && <Preloader onDone={finishIntro} />}
      {children}
    </IntroContext.Provider>
  )
}
