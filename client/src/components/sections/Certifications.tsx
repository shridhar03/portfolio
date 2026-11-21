import { BadgeCheck } from 'lucide-react'
import { Section } from '@/components/Section'
import { certifications } from '@/content/profile'

export function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="06 · Certifications"
      title="Certified"
      data-hscroll
      className="overflow-x-clip"
    >
      {/* Native horizontal scroll everywhere; on desktop with motion, GSAP pins the section and
          scrubs the track sideways as you scroll down. */}
      <div
        className="-mx-4 snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 xl:mx-0 xl:scroll-px-0 xl:px-0"
        tabIndex={0}
        role="region"
        aria-label="Certifications, scroll horizontally"
        data-hscroll-track
      >
        <ul className="flex w-max gap-4" data-reveal-stagger>
          {certifications.map((c) => (
            <li
              key={c.name}
              className="flex w-72 shrink-0 snap-start flex-col justify-between gap-10 rounded-card border border-border bg-surface p-6 sm:w-80"
            >
              <BadgeCheck className="size-8 text-accent-fg" aria-hidden />
              <div>
                <p className="font-mono text-xs tracking-wider text-muted uppercase">{c.issuer}</p>
                <h3 className="mt-2 text-xl font-semibold">{c.name}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
