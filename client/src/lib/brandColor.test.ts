import { describe, expect, it } from 'vitest'
import { brandOn, contrast } from './brandColor'

const TILE = '#141416'

describe('brandOn', () => {
  it('keeps bright brand colours as they are', () => {
    expect(brandOn('#61DAFB', TILE)).toBe('#61dafb')
  })
  it('lifts dark brand colours until they read on the dark tile', () => {
    const out = brandOn('#000000', TILE)
    expect(out).not.toBe('#000000')
    expect(contrast(out, TILE)).toBeGreaterThanOrEqual(3)
  })
  it('reaches the requested contrast for a mid-dark blue', () => {
    expect(contrast(brandOn('#00599C', TILE), TILE)).toBeGreaterThanOrEqual(3)
  })
})
