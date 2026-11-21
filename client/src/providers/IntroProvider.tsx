import { useCallback, useMemo, useState, type ReactNode } from 'react'
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
  const [showPreloader] = useState(() =>
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

  const value = useMemo(() => ({ introDone, finishIntro }), [introDone, finishIntro])
  return (
    <IntroContext.Provider value={value}>
      {showPreloader && !introDone && <Preloader onDone={finishIntro} />}
      {children}
    </IntroContext.Provider>
  )
}
