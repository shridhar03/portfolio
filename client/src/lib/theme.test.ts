import { describe, expect, it } from 'vitest'
import { nextTheme, resolveInitialTheme } from './theme'

describe('theme helpers', () => {
  it('defaults to dark when nothing is saved', () => {
    expect(resolveInitialTheme(null)).toBe('dark')
    expect(resolveInitialTheme('garbage')).toBe('dark')
  })
  it('respects a saved light choice', () => {
    expect(resolveInitialTheme('light')).toBe('light')
  })
  it('toggles', () => {
    expect(nextTheme('dark')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
  })
})
