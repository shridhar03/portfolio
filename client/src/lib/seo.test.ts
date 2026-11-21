import { describe, expect, it } from 'vitest'
import { profile } from '@/content/profile'
import { absoluteUrl, pageTitle, personJsonLd } from './seo'

describe('seo helpers', () => {
  it('builds absolute URLs without double slashes', () => {
    expect(absoluteUrl('/chat', 'https://x.dev/')).toBe('https://x.dev/chat')
    expect(absoluteUrl('chat', 'https://x.dev')).toBe('https://x.dev/chat')
    expect(absoluteUrl('https://cdn.dev/a.png', 'https://x.dev')).toBe('https://cdn.dev/a.png')
  })

  it('suffixes page titles with the site name', () => {
    expect(pageTitle('Chat')).toBe('Chat · Shridhar Chavan')
    expect(pageTitle()).toContain('Shridhar Chavan')
  })

  it('describes the person from resume facts, never the phone number', () => {
    const ld = personJsonLd(profile, 'https://x.dev')
    expect(ld.name).toBe(profile.name)
    expect(ld.url).toBe('https://x.dev/')
    expect(ld.knowsLanguage).toContain('Marathi')
    expect(JSON.stringify(ld)).not.toMatch(/telephone|\+91/)
  })
})
