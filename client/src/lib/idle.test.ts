import { afterEach, describe, expect, it, vi } from 'vitest'
import { onIdle } from './idle'

describe('onIdle', () => {
  afterEach(() => vi.useRealTimers())

  it('falls back to a timeout and can be cancelled', () => {
    vi.useFakeTimers()
    const ric = window.requestIdleCallback
    // @ts-expect-error simulate a browser without requestIdleCallback (Safari)
    window.requestIdleCallback = undefined
    const a = vi.fn()
    const b = vi.fn()
    onIdle(a, 200)
    onIdle(b, 200)()
    vi.advanceTimersByTime(250)
    expect(a).toHaveBeenCalledOnce()
    expect(b).not.toHaveBeenCalled()
    window.requestIdleCallback = ric
  })
})
