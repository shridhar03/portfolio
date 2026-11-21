import { ArrowDownRight, FileDown, MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import { AmbientVideo } from '@/components/media/AmbientVideo'
import { HandMark } from '@/components/motif/HandMark'
import { HandNote } from '@/components/motif/HandNote'
import { SahyadriRidge } from '@/components/motif/SahyadriRidge'
import { LazyHeroScene } from '@/components/motion/LazyHeroScene'
import { Magnetic } from '@/components/motion/Magnetic'
import { RoleRotator } from '@/components/motion/RoleRotator'
import { Picture } from '@/components/Picture'
import { Button } from '@/components/ui/button'
import { media } from '@/content/media'
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
      // Hide the copy until the preloader finishes, then reveal. The portrait stays painted
      // underneath a curtain, so it is the LCP element from the very first frame.
      if (!introDone) {
        gsap.set('[data-hero]', { autoAlpha: 0 })
        gsap.set('[data-hero-curtain]', { scaleY: 1 })
        return
      }
      // 3D letter flip: each letter turns up from lying flat (rotateX -100°) on its baseline.
      const split = SplitText.create('#hero-title', { type: 'words,chars' })
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.set('[data-hero]', { autoAlpha: 1 })
        .from(split.chars, {
          rotateX: -100,
          yPercent: 20,
          autoAlpha: 0,
          transformOrigin: '50% 90%',
          duration: 1.1,
          stagger: 0.045,
        })
        .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.3)
        .fromTo('[data-hero-curtain]', { scaleY: 1 }, { scaleY: 0, duration: 1.1 }, 0.1)
        .from('[data-hero-photo] img', { scale: 1.08, duration: 1.3 }, 0.1)
        .fromTo(
          '[data-draw="hero"] path',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.15 },
          0.9,
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
      {/* Video 1: looping background made in Canva. Still or nothing until a clip is added. */}
      <AmbientVideo clip={media.heroLoop} className="absolute inset-0 -z-20 size-full opacity-25" />
      {media.heroLoop && (
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/85 to-bg/40"
          aria-hidden
        />
      )}
      <LazyHeroScene />
      <div className="blob -top-40 -left-32 -z-10 size-[30rem]" aria-hidden />
      <div
        className="blob top-1/4 -right-40 -z-10 size-[36rem] [--blob:var(--color-mist)]"
        aria-hidden
      />

      <div className="mx-auto grid min-h-dvh max-w-content items-center gap-12 px-4 pt-28 pb-28 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-32">
        <div className="lg:col-span-7" data-hero>
          <p className="flex items-baseline gap-3" data-hero-fade>
            <span className="eyebrow">{profile.location}</span>
            <span lang="mr" className="font-marathi text-lg text-muted">
              सातारा
            </span>
          </p>
          <h1 id="hero-title" className="relative mt-5 text-display font-bold">
            Shridhar
            <br />
            <span className="relative inline-block lg:pl-[0.6em]">
              Chavan
              <HandMark
                kind="underline"
                draw="hero"
                className="absolute -bottom-[0.12em] left-0 h-[0.2em] w-full lg:left-[0.6em] lg:w-[calc(100%-0.6em)]"
              />
            </span>
          </h1>

          <p
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-h3 font-semibold text-muted"
            data-hero-fade
          >
            <span>I&apos;m a</span>
            <RoleRotator roles={profile.roles} />
          </p>

          <p className="mt-6 max-w-xl text-lead text-muted" data-hero-fade>
            I studied Economics, then computers. Now I build web apps with MongoDB, Express, React
            and Node, and I&apos;m teaching them to read language with AI/ML and NLP.
          </p>

          <div className="mt-9 flex flex-wrap gap-3" data-hero-fade>
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
            <Button size="lg" variant="ghost" onClick={() => chat.setOpen(true)}>
              <MessageCircle aria-hidden /> Ask Shridhar
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
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
            <div
              data-hero-curtain
              className="pointer-events-none absolute inset-0 origin-top bg-surface"
              aria-hidden
            />
          </div>
          <div className="absolute -right-2 -bottom-10 sm:-right-6" data-hero aria-hidden>
            <HandMark kind="circle" draw="hero" className="absolute -inset-x-4 -inset-y-3" />
            <HandNote className="relative px-3 py-2">me, up in the hills</HandNote>
          </div>
        </div>
      </div>
      <SahyadriRidge className="absolute inset-x-0 bottom-0 -z-10" />
    </section>
  )
}
