import type { profile as Profile } from '@/content/profile'

/** Public origin for canonical/OG URLs, from VITE_SITE_URL (no trailing slash). */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'http://localhost:4173').replace(
  /\/+$/,
  '',
)
export const SITE_NAME = 'Shridhar Chavan'
export const OG_IMAGE = '/og.jpg'

export function absoluteUrl(path: string, origin = SITE_URL) {
  if (/^https?:\/\//.test(path)) return path
  return `${origin.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

/** "Page · Shridhar Chavan", or the bare site title for the home page. */
export function pageTitle(title?: string, fallback = `${SITE_NAME} · MERN Developer`) {
  return title ? `${title} · ${SITE_NAME}` : fallback
}

/** schema.org Person built only from resume facts (no phone number, by design). */
export function personJsonLd(p: typeof Profile, origin = SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    alternateName: p.shortName,
    jobTitle: p.roles[0],
    description: p.tagline,
    url: absoluteUrl('/', origin),
    image: absoluteUrl('/img/profile-720.jpg', origin),
    email: `mailto:${p.email}`,
    sameAs: [p.linkedin],
    address: { '@type': 'PostalAddress', addressLocality: p.location },
    knowsLanguage: p.languages.map((l) => l.replace(/\s*\(.*\)$/, '')),
  }
}
