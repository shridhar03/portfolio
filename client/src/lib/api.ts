// Base URL for the API. Empty in dev (Vite proxies /api); set VITE_API_URL in production.
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

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
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), init?.timeoutMs ?? 10_000)
  try {
    const res = await fetch(`${BASE}${path}`, {
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
