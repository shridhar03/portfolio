// `npm run preview -w client`: serves dist/ like the production static host would — clean URLs
// (/chat → chat/index.html), the prerendered 404.html with a 404 status, gzip, immutable assets —
// and proxies /api to the Express server (API_PROXY, default http://localhost:4000).
import { readFile, stat } from 'node:fs/promises'
import { createServer, request } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')
const port = Number(process.env.PORT ?? 4173)
const api = new URL(process.env.API_PROXY ?? 'http://localhost:4000')
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
}
const compressible = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt', '.svg'])
const isFile = (p) =>
  stat(p).then(
    (s) => s.isFile(),
    () => false,
  )

async function send(req, res, file, status = 200) {
  const ext = path.extname(file)
  let body = await readFile(file)
  const headers = {
    'content-type': types[ext] ?? 'application/octet-stream',
    'cache-control': file.includes(`${path.sep}assets${path.sep}`)
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  }
  if (compressible.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body)
    headers['content-encoding'] = 'gzip'
  }
  res.writeHead(status, headers).end(body)
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  if (url.pathname.startsWith('/api/')) {
    const upstream = request(
      {
        host: api.hostname,
        port: api.port,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (r) => {
        res.writeHead(r.statusCode ?? 502, r.headers)
        r.pipe(res)
      },
    )
    upstream.on('error', () => res.writeHead(502).end('API unavailable'))
    return req.pipe(upstream)
  }
  const target = path.join(dist, decodeURIComponent(url.pathname))
  if (target.startsWith(dist)) {
    for (const file of [target, path.join(target, 'index.html'), `${target}.html`]) {
      if (await isFile(file)) return send(req, res, file)
    }
  }
  return send(req, res, path.join(dist, '404.html'), 404)
}).listen(port, () => console.log(`Serving client/dist on http://localhost:${port}`))
