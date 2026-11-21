import { Section } from '@/components/Section'
import { education } from '@/content/profile'

export function Education() {
  return (
    <Section id="education" eyebrow="05 · Education" title="Learning path">
      <ol className="relative ml-3 sm:ml-[9.5rem]" data-timeline>
        {/* Track + accent line that draws itself on scroll */}
        <span className="absolute top-0 bottom-0 -left-px w-0.5 bg-border" aria-hidden />
        <span
          className="absolute top-0 bottom-0 -left-px w-0.5 origin-top bg-accent"
          data-timeline-line
          aria-hidden
        />
        {education.map((e) => (
          <li key={e.degree} className="relative pb-12 pl-8 last:pb-0 sm:pl-10" data-reveal>
            <span
              className="absolute top-1.5 -left-[9px] size-4 rounded-full border-4 border-bg bg-accent"
              data-timeline-node
              aria-hidden
            />
            <p className="font-mono text-sm text-accent-fg sm:absolute sm:top-1 sm:-left-[9.5rem] sm:w-32 sm:text-right">
              {e.period}
            </p>
            <h3 className="mt-1 text-h3 font-semibold sm:mt-0">{e.degree}</h3>
            <p className="mt-1 text-fg">{e.school}</p>
            <p className="mt-2 inline-block rounded-pill bg-surface-2 px-3 py-1 font-mono text-xs">
              {e.score}
            </p>
            {e.detail && <p className="mt-3 max-w-xl text-muted">{e.detail}</p>}
          </li>
        ))}
      </ol>
    </Section>
  )
}
