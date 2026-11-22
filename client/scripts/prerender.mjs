// Build step: renders each public route to static HTML (dist/<route>/index.html) and writes
// sitemap.xml + robots.txt. Run after `vite build` and the SSR build (see package.json "build").
import { createHash } from 'node:crypto'
import { readFile, rm, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const env = { ...loadEnv('production', root, 'VITE_'), ...process.env }
const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '')
if (!siteUrl) {
  console.warn(
    '[prerender] VITE_SITE_URL is not set: canonical/OG URLs and the sitemap use localhost.',
  )
}
const origin = siteUrl || 'http://localhost:4173'
const apiOrigin = /^https?:\/\//.test(env.VITE_API_URL ?? '')
  ? new URL(env.VITE_API_URL).origin
  : ''

/**
 * Content-Security-Policy as a <meta> tag, so it ships with the static files on any host. Inline
 * scripts (theme + boot) are allowed by hash only; JSON-LD is data, not script, so CSP skips it.
 * style-src keeps 'unsafe-inline' for the style attributes React and the animation libraries set.
 */
function csp(html) {
  const hashes = [
    ...html.matchAll(
      /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map(([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`)
  const directives = [
    `default-src 'self'`,
    `script-src 'self' ${hashes.join(' ')}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `connect-src 'self'${apiOrigin ? ` ${apiOrigin}` : ''}`,
    `worker-src 'self' blob:`,
    `manifest-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    ...(origin.startsWith('https://') ? ['upgrade-insecure-requests'] : []),
  ]
  return `<meta http-equiv="Content-Security-Policy" content="${directives.join('; ')}" />`
}

const projects = JSON.parse(await readFile(path.join(root, '../shared/projects.json'), 'utf8'))
const projectRoutes = projects
  .filter((p) => p.status !== 'coming-soon' && p.caseStudy)
  .map((p) => `/projects/${p.slug}`)

const pages = [
  { route: '/', file: 'index.html', priority: '1.0' },
  { route: '/chat', file: 'chat/index.html', priority: '0.5' },
  ...projectRoutes.map((route) => ({
    route,
    file: `${route.slice(1)}/index.html`,
    priority: '0.8',
  })),
  { route: '/404', file: '404.html', sitemap: false },
]

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const built = await readFile(path.join(dist, 'index.html'), 'utf8')

// The prerendered HTML can paint on its own, so start the app only after the first frame:
// a parser-inserted module script would run its (long) evaluation before that first paint.
const entry = built.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
if (!entry) throw new Error('[prerender] could not find the entry <script> in dist/index.html')
/**
 * Starts the app once the hero portrait (the LCP image) has painted, so hydration never competes
 * with first paint. Browsers without LCP entries wait for the image to decode; 2 s is the cap.
 */
const bootScript = (src) =>
  [
    `let started = false`,
    `const start = () => { if (!started) { started = true; import('${src}') } }`,
    `const img = document.querySelector('[data-hero-photo] img')`,
    `if (img && PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {`,
    `  new PerformanceObserver((list) => list.getEntries().some((e) => e.element === img) && start()).observe({ type: 'largest-contentful-paint', buffered: true })`,
    `  setTimeout(start, 2000)`,
    `} else {`,
    `  await img?.decode().catch(() => {})`,
    `  requestAnimationFrame(() => setTimeout(start))`,
    `}`,
  ].join('\n')

const template = built
  .replace(entry[0], '')
  .replace(/\s*<link rel="modulepreload"[^>]*>/g, '')
  .replace('</body>', `  <script type="module">${bootScript(entry[1])}</script>\n  </body>`)

for (const page of pages) {
  const rendered = await render(page.route)
  // React 19 emits a page's <title>/<meta>/<link> first; they belong in <head>.
  const lead = rendered.match(/^(?:<(?:title>[^<]*<\/title|meta [^>]*|link [^>]*)>)+/)?.[0] ?? ''
  const head = lead.replace(/<(title|meta|link)/g, '<$1 data-prerender').replace(/></g, '>\n    <')
  const html = rendered.slice(lead.length)
  // Only the home page shows the portrait above the fold, so only it keeps the image preload.
  const base =
    page.route === '/'
      ? template
      : template.replace(/\s*<link\s+rel="preload"\s+as="image"[^>]*>/, '')
  const out = base
    .replace(/<title[^>]*>[\s\S]*?<\/title>\s*/, '')
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const final = out.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${csp(out)}`)
  const file = path.join(dist, page.file)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, final)
  console.log(
    `[prerender] ${page.route} → dist/${page.file} (${(final.length / 1024).toFixed(1)} kB)`,
  )
}

const today = new Date().toISOString().slice(0, 10)
const urls = pages
  .filter((p) => p.sitemap !== false)
  .map(
    (p) =>
      `  <url><loc>${origin}${p.route}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`,
  )
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
)
await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`,
)
console.log(`[prerender] sitemap.xml (${urls.length} URLs) + robots.txt for ${origin}`)

await rm(ssrDir, { recursive: true, force: true })
