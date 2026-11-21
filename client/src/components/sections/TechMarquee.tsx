import {
  siBootstrap,
  siClaude,
  siExpress,
  siGit,
  siGooglecloud,
  siJavascript,
  siMongodb,
  siMysql,
  siNodedotjs,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from 'simple-icons'

// Tech the resume lists. Logos are monochrome (currentColor) to stay on-palette.
const tech: SimpleIcon[] = [
  siMongodb,
  siExpress,
  siReact,
  siNodedotjs,
  siTypescript,
  siJavascript,
  siTailwindcss,
  siBootstrap,
  siMysql,
  siGooglecloud,
  siGit,
  siVercel,
  siClaude,
]

function Row({ dup }: { dup?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12"
      data-dup={dup || undefined}
      aria-hidden={dup}
    >
      {tech.map((t) => (
        <li
          key={t.slug}
          className="flex items-center gap-3 text-muted transition-colors hover:text-fg"
        >
          <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
            <path d={t.path} />
          </svg>
          <span className="font-display text-lg font-semibold whitespace-nowrap">{t.title}</span>
        </li>
      ))}
    </ul>
  )
}

/** Infinite logo marquee (CSS transform animation). Pauses on hover/focus; static for reduced motion. */
export function TechMarquee() {
  return (
    <section
      aria-label="Technologies I work with"
      className="marquee overflow-hidden border-y border-border py-6"
    >
      <div className="marquee-track flex w-max animate-marquee">
        <Row />
        <Row dup />
      </div>
    </section>
  )
}
