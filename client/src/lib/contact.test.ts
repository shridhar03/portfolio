import { describe, expect, it } from 'vitest'
import { mailtoHref, validateContact } from './contact'

describe('validateContact', () => {
  it('flags every empty field', () => {
    expect(Object.keys(validateContact({ name: '', email: '', message: '' }))).toEqual([
      'name',
      'email',
      'message',
    ])
  })
  it('accepts a valid draft', () => {
    expect(
      validateContact({ name: 'Asha', email: 'a@b.co', message: 'Hello there, nice site!' }),
    ).toEqual({})
  })
})

describe('mailtoHref', () => {
  it('encodes subject and body', () => {
    const href = mailtoHref('me@x.com', { name: 'A B', email: 'a@b.co', message: 'Hi & bye' })
    expect(href).toContain('mailto:me@x.com?subject=Portfolio%20enquiry%20from%20A%20B')
    expect(href).toContain('Hi%20%26%20bye')
  })
})
