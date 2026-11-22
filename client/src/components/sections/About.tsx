import { Picture } from '@/components/Picture'
import { Section } from '@/components/Section'
import { media } from '@/content/media'
import { profile } from '@/content/profile'
import { useCanPlayVideo } from '@/hooks/useCanPlayVideo'

/**
 * Video 2: scrolling through About scrubs a clip from the Satara hills to the stage. Until a clip
 * is added (content/media.ts), or when video is off, the two stills tell the same story: the stage
 * photo slides up over the hills as you scroll. Both photos are visible without JS.
 */
function HillsToStage() {
  const clip = media.aboutScrub
  const canPlay = useCanPlayVideo()
  return (
    <figure
      data-scrub
      data-iris
      className="relative self-start overflow-hidden rounded-card border border-border bg-surface lg:col-span-5"
    >
      {clip && canPlay ? (
        <video
          data-scrub-video
          className="aspect-[4/5] w-full object-cover"
          muted
          playsInline
          preload="auto"
          poster={clip.poster}
          aria-hidden
          tabIndex={-1}
        >
          {clip.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      ) : (
        <>
          <div data-scrub-start className="overflow-hidden">
            <Picture
              name="profile"
              widths={[360, 540, 720]}
              sizes="(min-width: 1024px) 30rem, 92vw"
              width={720}
              height={900}
              alt="Shridhar on a green hilltop in the Sahyadri, a lake in the valley behind him"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div data-scrub-end className="absolute inset-x-0 bottom-0 border-t border-border">
            <Picture
              name="speaking"
              widths={[480, 800, 1179]}
              sizes="(min-width: 1024px) 30rem, 92vw"
              width={1179}
              height={693}
              alt="Shridhar speaking into a microphone at a college tech event"
              className="aspect-[17/10] w-full object-cover"
            />
          </div>
        </>
      )}
      <span
        className="absolute inset-x-6 top-5 h-1 overflow-hidden rounded-full bg-bg/60"
        aria-hidden
      >
        <span data-scrub-progress className="block h-full origin-left rounded-full bg-accent" />
      </span>
      <figcaption className="sr-only">
        From the hills to the stage: Shridhar on a hilltop, then speaking at a college tech event.
      </figcaption>
    </figure>
  )
}

export function About() {
  return (
    <Section
      id="about"
      eyebrow="01 · About"
      title={
        <>
          From the hills <span className="text-accent-fg">to the stage.</span>
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <HillsToStage />
        <div className="lg:col-span-7">
          <div className="space-y-5 text-lead text-muted" data-reveal-stagger>
            {profile.story.map((p, i) => (
              <p key={p} className={i === 0 ? 'text-fg' : undefined}>
                {p}
              </p>
            ))}
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2" data-reveal-stagger>
            {profile.personal.map(({ label, value }) => (
              <li key={label} className="panel flex items-start gap-4 p-5">
                <span className="mt-2 size-2 shrink-0 rotate-45 bg-accent" aria-hidden />
                <span>
                  <span className="block font-mono text-xs tracking-wider text-muted uppercase">
                    {label}
                  </span>
                  <span className="mt-1 block text-fg">{value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
