import type { ErrorRequestHandler, RequestHandler } from 'express'

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Not found' })
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  void _next
  // Malformed JSON bodies from express.json()
  if (err?.type === 'entity.parse.failed')
    return void res.status(400).json({ error: 'Invalid JSON' })
  if (err?.type === 'entity.too.large')
    return void res.status(413).json({ error: 'Payload too large' })
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
