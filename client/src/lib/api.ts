// Base URL for the API. Empty in dev (Vite proxies /api); set VITE_API_URL in production.
// `none` builds a static-only site (GitHub Pages without the server): no requests are made, the
// bundled projects are used, chat says it's offline and the contact form offers email instead.
const RAW = import.meta.env.VITE_API_URL ?? ''
export const API_ENABLED = RAW !== 'none'
export const API_BASE = API_ENABLED ? RAW.replace(/\/$/, '') : ''

export class ApiError extends Error {
  status: number
  fields?: Record<string, string[] | undefined>
  constructor(status: number, message: string, fields?: Record<string, string[] | undefined>) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

export async function api<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  if (!API_ENABLED) throw new ApiError(503, 'The API is not part of this deployment')
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), init?.timeoutMs ?? 10_000)
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: init?.signal ?? ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new ApiError(res.status, body.error ?? res.statusText, body.fields)
    return body as T
  } finally {
    clearTimeout(timer)
  }
}
