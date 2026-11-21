import { describe, expect, it } from 'vitest'
import { createSseParser, type ChatEvent } from './sse'

describe('createSseParser', () => {
  it('handles events split across chunks', () => {
    const got: ChatEvent[] = []
    const feed = createSseParser((e) => got.push(e))
    feed('data: {"type":"meta","intent":"resume","mode":"offline"}\n\ndata: {"type":"del')
    feed('ta","text":"Hi"}\n')
    feed('\ndata: {"type":"done"}\n\n')
    expect(got).toEqual([
      { type: 'meta', intent: 'resume', mode: 'offline' },
      { type: 'delta', text: 'Hi' },
      { type: 'done' },
    ])
  })
  it('skips malformed events', () => {
    const got: ChatEvent[] = []
    createSseParser((e) => got.push(e))('data: {oops\n\ndata: {"type":"done"}\n\n')
    expect(got).toEqual([{ type: 'done' }])
  })
})
