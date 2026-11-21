import { ArrowDownRight, FileDown, MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import { LazyHeroScene } from '@/components/motion/LazyHeroScene'
import { Magnetic } from '@/components/motion/Magnetic'
import { RoleRotator } from '@/components/motion/RoleRotator'
import { Picture } from '@/components/Picture'
import { Button } from '@/components/ui/button'
import { profile } from '@/content/profile'
import { useIsoLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap, MOTION_OK, SplitText } from '@/lib/motion'
import { useChat } from '@/providers/chat-context'
import { useIntro } from '@/providers/intro-context'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const { introDone } = useIntro()
  const chat = useChat()

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(MOTION_OK, () => {
      // Hide until the preloader finishes, then reveal.
      if (!introDone) {
        gsap.set('[data-hero]', { autoAlpha: 0 })
        return
      }
      const split = SplitText.create('#hero-title', { type: 'chars,lines', mask: 'lines' })
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.set('[data-hero]', { autoAlpha: 1 })
        .from(split.chars, { yPercent: 115, duration: 1.1, stagger: 0.035 })
        .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.25)
        .from(
          '[data-hero-photo]',
          { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08, duration: 1.3 },
          0.1,
        )
      // Subtle parallax on the portrait while scrolling out of the hero.
      gsap.to('[data-hero-photo] img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      return () => split.revert()
    })
    return () => mm.revert()
  }, [introDone])

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <LazyHeroScene />
      <div className="blob -top-40 -left-32 -z-10 size-[30rem]" aria-hidden />
      <div
        className="blob top-1/4 -right-40 -z-10 size-[36rem] [--blob:var(--color-navy-glow)]"
        aria-hidden
      />

      <div className="mx-auto grid min-h-dvh max-w-content items-center gap-12 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-24">
        <div className="lg:col-span-7" data-hero>
          <p className="eyebrow" data-hero-fade>
            {profile.location}
          </p>
          <h1 id="hero-title" className="mt-5 text-display font-bold">
            Shridhar
            <br />
            <span className="lg:pl-[0.6em]">
              Chavan<span className="text-accent">.</span>
            </span>
          </h1>

          <p className="mt-6 font-mono text-base text-muted" data-hero-fade>
            <span className="text-accent-fg" aria-hidden>
              ›{' '}
            </span>
            <RoleRotator roles={profile.roles} />
          </p>

          <p className="mt-6 max-w-xl text-lead text-muted" data-hero-fade>
            MCA graduate building with the MERN stack, exploring AI/ML and NLP, and shipping fast
            with AI-assisted vibe coding.
          </p>

          <div className="mt-9 flex flex-wrap gap-3" data-hero-fade>
            <Magnetic>
              <Button asChild size="lg">
                <a href="#contact">
                  Get in touch <ArrowDownRight aria-hidden />
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
            <Button size="lg" variant="ghost" onClick={() => chat.setOpen(true)}>
              <MessageCircle aria-hidden /> Ask Shridhar
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none" data-hero>
          <div
            data-hero-photo
            className="relative overflow-hidden rounded-t-[999px] rounded-b-card border border-border bg-surface shadow-2xl shadow-black/30"
          >
            <Picture
              name="profile"
              widths={[360, 540, 720]}
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 384px, 90vw"
              width={720}
              height={900}
              priority
              alt="Shridhar Chavan smiling on a hilltop above green valleys and a lake, wearing a navy jacket"
              className="aspect-[4/5] w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/80 to-transparent"
              aria-hidden
            />
          </div>
          <div
            data-hero-fade
            className="absolute -bottom-4 left-4 rounded-pill border border-border bg-surface/90 px-4 py-2 font-mono text-xs text-fg backdrop-blur sm:-left-6"
          >
            <span className="mr-2 inline-block size-2 rounded-full bg-accent" aria-hidden />
            UGC NET qualified · 2025
          </div>
        </div>
      </div>
    </section>
  )
}
