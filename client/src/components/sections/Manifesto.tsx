import { profile } from '@/content/profile'

/**
 * A full-bleed red band with one line in the owner's own words (profile.motto, taken from the
 * story). Loud on purpose: it breaks the page between Experience and Projects. The line drifts
 * sideways with scroll ([data-drift]); it never fades, so it is always readable.
 */
export function Manifesto() {
  return (
    <section aria-label="What I care about" className="relative isolate overflow-hidden bg-accent">
      <div
        className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,transparent_0_22px,rgb(0_0_0/0.07)_22px_23px)]"
        aria-hidden
      />
      <figure className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24" data-reveal>
        <blockquote>
          <p
            data-drift
            className="slant max-w-5xl font-display text-[clamp(2.5rem,1.6rem+4vw,6rem)] leading-[0.95] text-accent-ink uppercase"
          >
            {profile.motto}
          </p>
        </blockquote>
        <figcaption className="mt-6 font-mono text-xs tracking-[0.2em] text-accent-ink uppercase">
          Shridhar Chavan
        </figcaption>
      </figure>
    </section>
  )
}
