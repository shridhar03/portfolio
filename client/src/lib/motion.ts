import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

/** Shared media queries. All GSAP motion runs inside gsap.matchMedia with MOTION_OK. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 1024px)'
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'

export * from './motion-tokens'
export const MOBILE = '(max-width: 1023px)'

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function hasFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia(FINE_POINTER).matches
}
