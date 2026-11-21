import type { RefObject } from 'react'
import { useIsoLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { onIdle } from '@/lib/idle'
import { DESKTOP, gsap, MOTION_OK, ScrollTrigger } from '@/lib/motion'

/**
 * Page-wide scroll choreography, scoped to `root`. Markup opts in with data attributes:
 *  - [data-reveal]           fade + slide up when it enters
 *  - [data-reveal-stagger]   its direct children reveal one after another
 *  - [data-timeline]         education timeline: [data-timeline-line] draws, [data-timeline-node] pops
 *  - [data-pin="experience"] pinned story on desktop; [data-step] items light up in turn
 *  - [data-hscroll]          pinned horizontal strip on desktop; [data-hscroll-track] is the scroll viewport, its first child moves
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
              { y: 40, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.9,
                ease: 'expo.out',
                stagger: 0.08,
                overwrite: true,
              },
            ),
        })
        gsap.set('[data-reveal]', { autoAlpha: 0 })
      }),
      step(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
          gsap.from(group.children, {
            y: 48,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          })
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
