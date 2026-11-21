import { Picture } from '@/components/Picture'
import { Section } from '@/components/Section'
import { leadership } from '@/content/profile'

export function Leadership() {
  return (
    <Section
      id="leadership"
      eyebrow="07 · Leadership & achievements"
      title={
        <>
          On stage, <span className="text-accent-fg">and off it</span>.
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <figure className="lg:col-span-6">
          <div className="overflow-hidden rounded-card border border-border">
            <Picture
              name="speaking"
              widths={[480, 800, 1179]}
              sizes="(min-width: 1024px) 38rem, 92vw"
              width={1179}
              height={693}
              alt="Shridhar speaking into a microphone at a college tech event, wearing a black event shirt"
              className="aspect-[17/10] w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 font-mono text-xs text-muted">
            Speaker &amp; organizer at college tech events
          </figcaption>
        </figure>
        <ul className="grid gap-3 self-start sm:grid-cols-2 lg:col-span-6">
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
      </div>
    </Section>
  )
}
