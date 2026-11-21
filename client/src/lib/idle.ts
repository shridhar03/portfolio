/** Runs `cb` when the main thread is idle (or after `timeout` ms at the latest). Returns a cancel function. */
export function onIdle(cb: () => void, timeout = 1000): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(cb, { timeout })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(cb, Math.min(timeout, 300))
  return () => window.clearTimeout(id)
}
