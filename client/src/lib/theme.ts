export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'sc-theme'

/** Dark-first: only an explicit saved choice of "light" switches the default. */
export function resolveInitialTheme(saved: string | null): Theme {
  return saved === 'light' ? 'light' : 'dark'
}

export function nextTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark'
}
