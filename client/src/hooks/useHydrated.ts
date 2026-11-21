import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * false on the server and during hydration of the prerendered HTML, true afterwards. Gate any
 * output that depends on the visitor (theme, pointer, first visit) on it, so hydration matches.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
