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

// Tech the resume lists (names come from simple-icons so the spelling is canonical).
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
    <ul className="flex shrink-0 items-center" data-dup={dup || undefined} aria-hidden={dup}>
      {tech.map((t) => (
        <li key={t.slug} className="flex items-center">
          <span className="slant px-6 font-display text-[clamp(1.75rem,1.3rem+1.6vw,3rem)] leading-none whitespace-nowrap text-fg uppercase transition-colors hover:text-accent-fg sm:px-8">
            {t.title}
          </span>
          <span className="size-2.5 rotate-45 bg-accent" aria-hidden />
        </li>
      ))}
    </ul>
  )
}

/** Infinite tech strip (CSS transform animation): big slanted names split by red diamonds.
 *  Pauses on hover/focus; static for reduced motion. */
export function TechMarquee() {
  return (
    <section
      aria-label="Technologies I work with"
      className="marquee relative overflow-hidden border-y border-accent/50 bg-surface py-5 sm:py-6"
    >
      <div className="marquee-track flex w-max animate-marquee">
        <Row />
        <Row dup />
      </div>
    </section>
  )
}
