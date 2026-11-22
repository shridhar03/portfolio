/**
 * The motion design system: one set of timings, easings, springs, distances and staggers shared by
 * GSAP (scroll choreography), Motion (components, routes) and CSS (`--ease-*` in tokens.css).
 * No library imports here, so any component can use it without pulling GSAP in.
 *
 * Tiers (seconds): micro 0.12–0.22 · ui 0.22–0.45 · reveal 0.45–0.8 · cinematic 0.7–1.2.
 */

export const DUR = {
  /** hover, press, toggles */
  micro: 0.18,
  /** menus, panels, header show/hide, route exit */
  ui: 0.32,
  /** content entering the viewport */
  reveal: 0.75,
  /** hero sequence, image reveals, route enter */
  cinematic: 1.1,
} as const

/** Cubic-bezier arrays for Motion; GSAP names for timelines. Keep the two columns in step. */
export const EASE = {
  /** decelerate: everything that enters */
  out: [0.16, 1, 0.3, 1] as const, // ≈ expo.out
  /** symmetric: wipes and things that travel across */
  inOut: [0.83, 0, 0.17, 1] as const, // ≈ quint.inOut
  /** accelerate: things that leave */
  in: [0.7, 0, 0.84, 0] as const, // ≈ expo.in
} as const

export const GSAP_EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  in: 'expo.in',
  /** scroll-linked motion follows the scroll exactly */
  scrub: 'none',
} as const

/**
 * Spring presets (stiffness / damping / mass). Use as `useSpring(v, SPRING.follow)` or as a Motion
 * transition with `{ type: 'spring', ...SPRING.snappy }`.
 */
export const SPRING = {
  /** buttons, toggles, header: quick with no wobble */
  snappy: { stiffness: 420, damping: 32, mass: 0.6 },
  /** panels and layout moves (chat launcher, active nav pill) */
  soft: { stiffness: 380, damping: 32, mass: 0.8 },
  /** pointer followers (cursor ring, spotlight) */
  follow: { stiffness: 300, damping: 28, mass: 0.5 },
  /** magnetic pull: loose, a little give */
  magnetic: { stiffness: 200, damping: 15, mass: 0.3 },
  /** playful pop for small accents */
  pop: { stiffness: 400, damping: 15, mass: 1 },
}

/** Travel distances in px. */
export const DIST = { sm: 16, md: 32, lg: 48 } as const

export const STAGGER = { tight: 0.04, base: 0.07, loose: 0.12 } as const

/** Blur used for blur-to-sharp reveals (px). One-off entrances only, never scrubbed. */
export const BLUR = 10

/** Scroll-linked smoothing (seconds of lag) for GSAP `scrub`. */
export const SCRUB = 0.6
