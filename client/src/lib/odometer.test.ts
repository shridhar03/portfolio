import { describe, expect, it } from 'vitest'
import { splitScore } from './odometer'

describe('splitScore', () => {
  it('finds the number inside a GPA line', () => {
    expect(splitScore('GPA 8.74 / 10')).toEqual({ before: 'GPA ', number: '8.74', after: ' / 10' })
  })
  it('handles percentages', () => {
    expect(splitScore('93.20%')).toEqual({ before: '', number: '93.20', after: '%' })
  })
  it('leaves text without numbers alone', () => {
    expect(splitScore('Distinction')).toEqual({ before: 'Distinction', number: '', after: '' })
  })
})
