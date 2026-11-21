export type ChatEvent =
  | { type: 'meta'; intent: string; mode: 'anthropic' | 'offline' }
  | { type: 'delta'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

/** Incremental parser for `data: {json}\n\n` server-sent events arriving in arbitrary chunks. */
export function createSseParser(onEvent: (e: ChatEvent) => void) {
  let buffer = ''
  return (chunk: string) => {
    buffer += chunk
    let idx: number
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const raw = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 2)
      for (const line of raw.split('\n')) {
        if (!line.startsWith('data: ')) continue
        try {
          onEvent(JSON.parse(line.slice(6)) as ChatEvent)
        } catch {
          /* ignore malformed event */
        }
      }
    }
  }
}
