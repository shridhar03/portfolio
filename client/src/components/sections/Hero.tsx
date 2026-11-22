import { ArrowDownRight, FileDown, MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import { AmbientVideo } from '@/components/media/AmbientVideo'
import { SahyadriRidge } from '@/components/motif/SahyadriRidge'
import { Magnetic } from '@/components/motion/Magnetic'
import { Odometer } from '@/components/motion/Odometer'
import { RoleRotator } from '@/components/motion/RoleRotator'
import { Picture } from '@/components/Picture'
import { Button } from '@/components/ui/button'
import { media } from '@/content/media'
import { profile } from '@/content/profile'
import { useIsoLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap, MOTION_OK, SplitText } from '@/lib/motion'
import { useChat } from '@/providers/chat-context'
import { useIntro } from '@/providers/intro-context'

const MEGA = 'SHRIDHAR'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const { introDone } = useIntro()
  const chat = useChat()

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(MOTION_OK, () => {
      // Hide the copy until the preloader finishes, then reveal. The portrait is never hidden,
      // only moved, so it is the LCP element from the very first frame.
      if (!introDone) {
        gsap.set('[data-hero]', { autoAlpha: 0 })
        return
      }
      // 3D letter flip on the name: each letter turns up from lying flat on its baseline.
      const split = SplitText.create('#hero-title', { type: 'words,chars' })
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.set('[data-hero]', { autoAlpha: 1 })
        // The giant name rises letter by letter out of its own baseline (clipped by the row).
        .from('[data-mega-char]', { yPercent: 105, duration: 1.3, stagger: 0.05 }, 0)
        .from('[data-hero-photo]', { yPercent: 7, scale: 0.94, duration: 1.5 }, 0.05)
        .from('[data-hero-floor]', { autoAlpha: 0, yPercent: 20, duration: 1.4 }, 0)
        .from(
          split.chars,
          {
            rotateX: -100,
            yPercent: 20,
            autoAlpha: 0,
            transformOrigin: '50% 90%',
            duration: 1.1,
            stagger: 0.04,
          },
          0.3,
        )
        .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0.5)
      // Depth while scrolling out: the name sinks slower than the portrait.
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('[data-mega]', { yPercent: 30, ease: 'none', scrollTrigger: st })
      gsap.to('[data-hero-photo]', { yPercent: -6, ease: 'none', scrollTrigger: { ...st } })
      return () => split.revert()
    })
    return () => mm.revert()
  }, [introDone])

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Optional looping background clip. Nothing until a clip is added. */}
      <AmbientVideo clip={media.heroLoop} className="absolute inset-0 -z-20 size-full opacity-20" />
      {/* Stage light: a red glow behind the portrait, and a perspective floor under it. */}
      <div
        className="absolute top-[18%] left-1/2 -z-10 aspect-square w-[min(64rem,150vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_42%,transparent),transparent)] opacity-60"
        aria-hidden
      />
      <div className="grid-floor -z-10" data-hero-floor aria-hidden />
      <SahyadriRidge
        crest={false}
        className="absolute inset-x-0 bottom-[22%] -z-10 h-20 opacity-60 sm:h-28"
      />

      {/* The giant name behind the cut-out portrait. Decorative: the h1 carries the name. */}
      <p
        data-mega
        aria-hidden
        className="pointer-events-none absolute top-[5.75rem] left-1/2 flex -translate-x-1/2 overflow-hidden font-display text-mega leading-[0.86] whitespace-nowrap select-none lg:top-[6.5rem]"
      >
        {[...MEGA].map((ch, i) => (
          <span key={i} data-mega-char className="ember-text inline-block">
            {ch}
          </span>
        ))}
      </p>

      <div className="relative mx-auto grid min-h-dvh max-w-content gap-8 px-4 pt-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)_minmax(0,1fr)] lg:items-end lg:gap-6 lg:pt-24">
        {/* Copy */}
        <div className="relative z-20 lg:pb-20" data-hero>
          <p className="flex items-baseline gap-3" data-hero-fade>
            <span className="eyebrow">{profile.location}</span>
            <span lang="mr" className="font-marathi text-lg text-muted">
              सातारा
            </span>
          </p>
          <h1 id="hero-title" className="mt-4 text-[clamp(3rem,2rem+4vw,5.5rem)]">
            Shridhar
            <br />
            Chavan<span className="text-accent">.</span>
          </h1>
          <p
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-heading text-lg font-semibold text-muted"
            data-hero-fade
          >
            <span>I&apos;m a</span>
            <RoleRotator roles={profile.roles} />
          </p>
          <p className="mt-5 max-w-md text-muted" data-hero-fade>
            I studied Economics, then computers. Now I build web apps with MongoDB, Express, React
            and Node, and I&apos;m teaching them to read language with AI/ML and NLP.
          </p>
          <div className="mt-7 flex flex-wrap gap-3" data-hero-fade>
            <Magnetic>
              <Button asChild size="lg">
                <a href="#projects">
                  See my work <ArrowDownRight aria-hidden />
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline">
                <a href={profile.resumePdf} download>
                  <FileDown aria-hidden /> Resume
                </a>
              </Button>
            </Magnetic>
          </div>
        </div>

        {/* Stage: the cut-out portrait (first on phones, centre column on desktop) */}
        <div className="relative z-10 order-first mx-auto w-full max-w-[16rem] sm:max-w-[20rem] lg:order-none lg:max-w-none">
          <div data-hero-photo className="relative">
            <Picture
              name="cutout"
              widths={[320, 480, 645]}
              sizes="(min-width: 1024px) 25rem, (min-width: 640px) 20rem, 16rem"
              width={645}
              height={1010}
              priority
              alt="Shridhar Chavan smiling, hands in the pockets of a navy jacket"
              className="h-auto w-full [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
            />
          </div>
        </div>

        {/* Now + highlights */}
        <div className="relative z-20 pb-16 lg:pb-20" data-hero>
          <div className="panel p-5" data-hero-fade>
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-muted uppercase">
              <span className="size-2 rounded-full bg-accent" aria-hidden />
              Right now
            </p>
            <p className="mt-2 font-heading text-lg leading-snug font-semibold">{profile.now}</p>
            <button
              type="button"
              onClick={() => chat.setOpen(true)}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent-fg underline-offset-4 hover:underline"
            >
              <MessageCircle className="size-4" aria-hidden /> Ask Shridhar anything
            </button>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-3" data-hero-fade>
            {profile.highlights.map((h) => (
              <div
                key={h.label}
                className="panel flex flex-col-reverse justify-end gap-2 p-3 sm:p-4"
              >
                <dt className="text-xs leading-snug text-muted">{h.label}</dt>
                <dd>
                  <Odometer
                    value={h.value}
                    className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)]"
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
