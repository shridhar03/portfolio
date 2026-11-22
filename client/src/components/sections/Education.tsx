import { Section } from '@/components/Section'
import { Odometer } from '@/components/motion/Odometer'
import { education } from '@/content/profile'
import { splitScore } from '@/lib/odometer'

/** The real score from the resume; its number rolls up like an odometer. */
function Score({ score }: { score: string }) {
  const { before, number, after } = splitScore(score)
  return (
    <p className="mt-3 flex items-baseline gap-1.5">
      {before && <span className="font-mono text-xs text-muted uppercase">{before.trim()}</span>}
      {number && (
        <Odometer value={number} className="font-display text-h3 font-bold text-accent-fg" />
      )}
      {after && <span className="font-mono text-xs text-muted">{after.trim()}</span>}
    </p>
  )
}

export function Education() {
  return (
    <Section
      id="education"
      eyebrow="05 · Education"
      title={
        <>
          Economics first, <span className="text-accent-fg">then code.</span>
        </>
      }
    >
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
            <Score score={e.score} />
            {e.detail && <p className="mt-3 max-w-xl text-muted">{e.detail}</p>}
          </li>
        ))}
      </ol>
    </Section>
  )
}
