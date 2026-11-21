export const VISITED_KEY = 'sc-visited'

/** Show the preloader only on a first visit, never when reduced motion is requested. */
export function shouldShowPreloader(opts: { visited: string | null; reducedMotion: boolean }) {
  return !opts.reducedMotion && opts.visited !== '1'
}

/** Ease-out counter value for elapsed/total, clamped to 0..100. */
export function counterAt(elapsed: number, total: number) {
  const t = Math.min(Math.max(elapsed / total, 0), 1)
  return Math.round((1 - Math.pow(1 - t, 3)) * 100)
}
