import { createContext, useContext } from 'react'

/** true once the preloader has finished (or was skipped): hero animations wait for it. */
export const IntroContext = createContext<{ introDone: boolean; finishIntro: () => void }>({
  introDone: true,
  finishIntro: () => {},
})

export const useIntro = () => useContext(IntroContext)
