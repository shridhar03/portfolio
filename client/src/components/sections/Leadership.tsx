import { HandMark } from '@/components/motif/HandMark'
import { Section } from '@/components/Section'
import { leadership } from '@/content/profile'

export function Leadership() {
  return (
    <Section
      id="leadership"
      eyebrow="07 · Off the keyboard"
      title={
        <>
          Boxing gloves, a microphone,{' '}
          <span className="relative inline-block text-accent-fg">
            Olympiads
            <HandMark
              kind="underline"
              className="absolute -bottom-[0.18em] left-0 h-[0.25em] w-full"
            />
          </span>
        </>
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
        {leadership.map((l) => (
          <li key={l.title} className="rounded-card border border-border bg-surface p-5">
            <p className="font-mono text-[0.7rem] tracking-wider text-accent-fg uppercase">
              {l.kind}
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold">{l.title}</h3>
            <p className="mt-1 text-sm text-muted">{l.meta}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
