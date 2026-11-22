import { describe, expect, it } from 'vitest'
import { withBase } from './base'

describe('withBase', () => {
  it('prefixes public paths with the base', () => {
    expect(withBase('/', '/img/a.jpg')).toBe('/img/a.jpg')
    expect(withBase('/portfolio/', '/img/a.jpg')).toBe('/portfolio/img/a.jpg')
    expect(withBase('/portfolio/', 'bg/code.svg')).toBe('/portfolio/bg/code.svg')
  })
  it('leaves absolute URLs and hashes alone', () => {
    expect(withBase('/portfolio/', 'https://x.dev/a.png')).toBe('https://x.dev/a.png')
    expect(withBase('/portfolio/', 'mailto:a@b.c')).toBe('mailto:a@b.c')
    expect(withBase('/portfolio/', '#about')).toBe('#about')
  })
})
