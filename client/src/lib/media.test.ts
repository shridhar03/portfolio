import { describe, expect, it } from 'vitest'
import { canAutoplayVideo } from './media'

describe('canAutoplayVideo', () => {
  it('plays on a normal connection with motion allowed', () => {
    expect(canAutoplayVideo({ reducedMotion: false })).toBe(true)
    expect(canAutoplayVideo({ reducedMotion: false, connection: { effectiveType: '4g' } })).toBe(
      true,
    )
  })
  it('falls back to the still for reduced motion', () => {
    expect(canAutoplayVideo({ reducedMotion: true })).toBe(false)
  })
  it('falls back to the still for Data Saver and slow connections', () => {
    expect(canAutoplayVideo({ reducedMotion: false, connection: { saveData: true } })).toBe(false)
    for (const effectiveType of ['slow-2g', '2g', '3g'])
      expect(canAutoplayVideo({ reducedMotion: false, connection: { effectiveType } })).toBe(false)
  })
})
