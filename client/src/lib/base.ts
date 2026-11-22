/**
 * The path the site is served under: `/` on Vercel or a custom domain, `/portfolio/` on GitHub
 * Pages. Set at build time with `VITE_BASE` (see vite.config.ts). Router paths are relative to it;
 * files in `public/` must go through `asset()` so they resolve under it too.
 */
export const BASE = import.meta.env.BASE_URL

/** Pure join, tested: withBase('/portfolio/', '/img/a.jpg') → '/portfolio/img/a.jpg'. */
export function withBase(base: string, p: string) {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(p)) return p
  return `${base.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`
}

/** A file in `public/` under the current base: asset('/bg/code.svg'). */
export const asset = (p: string) => withBase(BASE, p)

/** React Router basename (no trailing slash; `/` when served at the root). */
export const ROUTER_BASENAME = BASE.replace(/\/+$/, '') || '/'
