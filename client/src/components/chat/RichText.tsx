import { Fragment, type ReactNode } from 'react'

// Minimal, XSS-safe markdown for chat replies: **bold**, _italic_, [text](url), bare URLs/emails,
// and "- " bullet lists. Builds React nodes; never injects HTML.
const INLINE =
  /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>
    const md = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/)
    const href = md ? md[2] : /^https?:\/\//.test(part) ? part : null
    if (href)
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-accent-fg underline underline-offset-2"
        >
          {md ? md[1] : part}
        </a>
      )
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part))
      return (
        <a key={i} href={`mailto:${part}`} className="text-accent-fg underline underline-offset-2">
          {part}
        </a>
      )
    return <Fragment key={i}>{part}</Fragment>
  })
}

export function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/)
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        if (lines.every((l) => /^\s*[-*•] /.test(l)))
          return (
            <ul key={bi} className="my-2 list-disc space-y-1 pl-5">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-*•] /, ''))}</li>
              ))}
            </ul>
          )
        return (
          <p key={bi} className="my-2 first:mt-0 last:mb-0">
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}
