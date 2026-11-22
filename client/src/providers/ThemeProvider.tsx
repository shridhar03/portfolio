import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { THEME_STORAGE_KEY, nextTheme, resolveInitialTheme, type Theme } from '@/lib/theme'
import { ThemeContext } from './theme-context'

function readSaved(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return null
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme(readSaved()))

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#09090a' : '#f4f1ec')
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* storage unavailable: theme still works for this visit */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => nextTheme(t)), [])
  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
