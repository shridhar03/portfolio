/** Network hints from the Network Information API (Chromium only; absent elsewhere). */
export type ConnectionHints = { saveData?: boolean; effectiveType?: string } | null | undefined

/**
 * Whether a decorative video may autoplay. Videos are a bonus, never the content:
 * reduced motion, Data Saver and slow (2g/3g) connections all get the still poster instead.
 */
export function canAutoplayVideo(env: {
  reducedMotion: boolean
  connection?: ConnectionHints
}): boolean {
  if (env.reducedMotion) return false
  const c = env.connection
  if (c?.saveData) return false
  if (c?.effectiveType && /^(slow-2g|2g|3g)$/.test(c.effectiveType)) return false
  return true
}

/** Reads the visitor's environment. Browser only; call after hydration. */
export function readVideoEnv() {
  const nav = navigator as Navigator & { connection?: ConnectionHints }
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    connection: nav.connection,
  }
}
