import { absoluteUrl, OG_IMAGE, pageTitle, SITE_NAME } from '@/lib/seo'

/**
 * Per-page <head>: title, description, canonical, Open Graph and Twitter card. React 19 hoists
 * these tags into <head> on the client; the prerender moves them there in the static HTML.
 */
export function Seo({
  title,
  description,
  path,
  noindex = false,
  jsonLd,
}: {
  title?: string
  description: string
  path: string
  noindex?: boolean
  jsonLd?: object
}) {
  const fullTitle = pageTitle(title)
  const url = absoluteUrl(path)
  const image = absoluteUrl(OG_IMAGE)
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
      <meta property="og:type" content={path === '/' ? 'profile' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Shridhar Chavan, MERN developer, smiling on a hilltop"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </>
  )
}
