import { describe, expect, it } from 'vitest'
import { counterAt, shouldShowPreloader } from './preloader'

describe('preloader', () => {
  it('shows on first visit only', () => {
    expect(shouldShowPreloader({ visited: null, reducedMotion: false })).toBe(true)
    expect(shouldShowPreloader({ visited: '1', reducedMotion: false })).toBe(false)
  })
  it('never shows with reduced motion', () => {
    expect(shouldShowPreloader({ visited: null, reducedMotion: true })).toBe(false)
  })
  it('counts 0 → 100 and clamps', () => {
    expect(counterAt(0, 1000)).toBe(0)
    expect(counterAt(1000, 1000)).toBe(100)
    expect(counterAt(5000, 1000)).toBe(100)
    expect(counterAt(-5, 1000)).toBe(0)
    expect(counterAt(500, 1000)).toBeGreaterThan(50)
  })
})
