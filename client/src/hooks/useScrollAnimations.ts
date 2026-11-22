import type { RefObject } from 'react'
import { useIsoLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { onIdle } from '@/lib/idle'
import {
  DESKTOP,
  DIST,
  DUR,
  GSAP_EASE,
  gsap,
  MOBILE,
  MOTION_OK,
  SCRUB,
  STAGGER,
  ScrollTrigger,
} from '@/lib/motion'

/**
 * Page-wide scroll choreography, scoped to `root`. Markup opts in with data attributes:
 *  - [data-reveal]           fade + slide up when it enters
 *  - [data-reveal-stagger]   its direct children reveal one after another
 *  - [data-timeline]         education timeline: [data-timeline-line] draws, [data-timeline-node] pops
 *  - [data-pin="experience"] pinned story on desktop; [data-step] items light up in turn
 *  - [data-hscroll]          pinned horizontal strip on desktop; [data-hscroll-track] is the scroll viewport, its first child moves
 *  - [data-tilt]             heading tilted back in 3D that stands upright as it scrolls in (stays readable)
 *  - [data-draw="scroll"]    hand-drawn SVG mark that draws its strokes when it enters
 *  - [data-odometer]         digits ([data-odo-digit]) roll up from 0 to their value
 *  - [data-scrub]            About story: a video scrubbed by scroll, or the stage still sliding up
 *  - [data-parallax="0.2"]   decorative layer drifting at its own depth (half strength on phones)
 *  - [data-iris]             image revealed by a circle opening from its centre (one-off clip-path)
 *  - [data-drift]            a big line of type sliding sideways as it crosses the viewport
 * Timings, easings and distances come from lib/motion-tokens.ts.
 * Nothing is hidden unless motion is allowed, so content is always readable without JS.
 * Setup waits for an idle moment (everything it touches starts below the fold), which keeps
 * ScrollTrigger's layout reads off the critical path. With a #hash in the URL it runs at once.
 */
export function useScrollAnimations(root: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useIsoLayoutEffect(() => {
    const contexts: gsap.MatchMedia[] = []
    // Each step gets its own matchMedia context and idle slot, so no single task runs long.
    const step = (query: string, fn: () => void) => () => {
      const mm = gsap.matchMedia(root)
      mm.add(query, fn)
      contexts.push(mm)
    }
    const steps = [
      step(MOTION_OK, () => {
        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 88%',
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { y: DIST.md, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: DUR.reveal,
                ease: GSAP_EASE.out,
                stagger: STAGGER.base,
                overwrite: true,
              },
            ),
        })
        gsap.set('[data-reveal]', { autoAlpha: 0 })
      }),
      step(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
          gsap.from(group.children, {
            y: DIST.lg,
            autoAlpha: 0,
            duration: DUR.reveal,
            ease: GSAP_EASE.out,
            stagger: STAGGER.base,
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          })
        })
      }),
      step(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((el) => {
          gsap.fromTo(
            el,
            { rotateX: 38, y: 28, transformPerspective: 900, transformOrigin: '50% 100%' },
            {
              rotateX: 0,
              y: 0,
              ease: GSAP_EASE.scrub,
              scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 62%', scrub: SCRUB },
            },
          )
        })
        gsap.utils.toArray<SVGElement>('[data-draw="scroll"]').forEach((svg) => {
          gsap.fromTo(
            svg.querySelectorAll('path'),
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 1,
              ease: 'power2.inOut',
              stagger: 0.15,
              scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
            },
          )
        })
        gsap.utils.toArray<HTMLElement>('[data-odometer]').forEach((odo) => {
          odo.querySelectorAll<HTMLElement>('[data-odo-digit]').forEach((col, i) => {
            gsap.fromTo(
              col,
              { yPercent: 0, y: 0 },
              {
                yPercent: -Number(col.dataset.odoDigit) * 10,
                duration: 1.6 + i * 0.25,
                ease: 'power3.out',
                scrollTrigger: { trigger: odo, start: 'top 88%', once: true },
              },
            )
          })
        })
      }),
      step(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-scrub]').forEach((fig) => {
          const trigger = { trigger: fig, start: 'top 80%', end: 'bottom 30%', scrub: 0.5 }
          const video = fig.querySelector<HTMLVideoElement>('video[data-scrub-video]')
          if (video) {
            // Video 2: scroll position drives the playhead (hills → stage).
            ScrollTrigger.create({
              ...trigger,
              onUpdate: ({ progress }) => {
                if (video.duration) video.currentTime = progress * video.duration
              },
            })
          } else {
            gsap.fromTo(
              fig.querySelector('[data-scrub-end]'),
              { yPercent: 100 },
              { yPercent: 0, ease: 'none', scrollTrigger: trigger },
            )
            gsap.fromTo(
              fig.querySelector('[data-scrub-start] img'),
              { scale: 1 },
              { scale: 1.12, ease: 'none', scrollTrigger: trigger },
            )
          }
          gsap.fromTo(
            fig.querySelector('[data-scrub-progress]'),
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', scrollTrigger: trigger },
          )
        })
      }),
      step(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-timeline]').forEach((tl) => {
          gsap.fromTo(
            tl.querySelector('[data-timeline-line]'),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
            },
          )
          tl.querySelectorAll('[data-timeline-node]').forEach((node) => {
            gsap.from(node, {
              scale: 0,
              duration: 0.6,
              ease: 'back.out(3)',
              scrollTrigger: {
                trigger: node,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            })
          })
        })
      }),
      step(MOTION_OK, () => {
        // Depth: decorative layers drift at their own speed. Phones get half the travel.
        const mobile = window.matchMedia(MOBILE).matches
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const depth = Number(el.dataset.parallax) * (mobile ? 0.5 : 1)
          gsap.fromTo(
            el,
            { yPercent: -depth * 50 },
            {
              yPercent: depth * 50,
              ease: GSAP_EASE.scrub,
              scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
        // Iris: a circle opens from the centre of the image (clip-path, once).
        gsap.utils.toArray<HTMLElement>('[data-iris]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'circle(12% at 50% 45%)' },
            {
              clipPath: 'circle(75% at 50% 45%)',
              duration: DUR.cinematic,
              ease: GSAP_EASE.inOut,
              clearProps: 'clipPath',
              scrollTrigger: { trigger: el, start: 'top 80%', once: true },
            },
          )
        })
        // Kinetic type: the line slides sideways while it crosses the screen (always readable).
        gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: 4 },
            {
              xPercent: -4,
              ease: GSAP_EASE.scrub,
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: SCRUB },
            },
          )
        })
      }),
      step(`${MOTION_OK} and ${DESKTOP}`, () => {
        gsap.utils.toArray<HTMLElement>('[data-pin="experience"]').forEach((sec) => {
          const steps = sec.querySelectorAll('[data-step]')
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sec,
              start: 'top top',
              end: () => `+=${steps.length * 320}`,
              pin: true,
              scrub: 0.5,
            },
          })
          steps.forEach((step, i) => {
            // Upcoming steps stay slightly dimmed but readable (WCAG AA contrast at 0.85).
            tl.fromTo(step, { opacity: 0.85, x: 24 }, { opacity: 1, x: 0, duration: 1 }, i)
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-hscroll]').forEach((sec) => {
          const viewport = sec.querySelector<HTMLElement>('[data-hscroll-track]')
          const track = viewport?.firstElementChild as HTMLElement | null
          if (!viewport || !track) return
          const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
          if (distance() < 8) return
          gsap.set(viewport, { overflow: 'visible' }) // reverted with the matchMedia context
          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: sec,
              start: 'center center',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
        })
      }),
      // Pins add spacers and fonts can shift layout: recompute every trigger once all exist.
      () =>
        void document.fonts?.ready.then(() => {
          ScrollTrigger.refresh()
          document.documentElement.dataset.scrollReady = '' // e2e tests wait for this
        }),
    ]
    const revert = () => {
      contexts.forEach((mm) => mm.revert())
      delete document.documentElement.dataset.scrollReady
    }

    if (window.location.hash) {
      steps.forEach((run) => run())
      return revert
    }
    let cancel = () => {}
    const next = (i: number) => {
      if (i < steps.length)
        cancel = onIdle(() => {
          steps[i]()
          next(i + 1)
        }, 1200)
    }
    next(0)
    return () => {
      cancel()
      revert()
    }
  }, deps)
}
