import { useEffect, useState } from 'react'

/**
 * Scroll-aware header state: `scrolled` once the page moves, `hidden` while scrolling down past
 * the hero (shown again on any scroll up), and the id of the section in the middle of the screen.
 * One passive, rAF-throttled scroll listener + one IntersectionObserver; both cleaned up.
 * Starts as { false, false, null } so the first client render matches the prerender.
 */
export function useHeaderScroll(sectionIds: string[], trackSections: boolean) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const dy = y - lastY
      setScrolled(y > 24)
      if (y < 160) setHidden(false)
      else if (dy > 6) setHidden(true)
      else if (dy < -6) setHidden(false)
      if (Math.abs(dy) > 6) lastY = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const key = sectionIds.join(',')
  useEffect(() => {
    if (!trackSections) return
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    // A thin band across the middle of the viewport decides which section is "current".
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    const atTop = () => window.scrollY < 200 && setActive(null)
    window.addEventListener('scroll', atTop, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', atTop)
    }
  }, [key, trackSections])

  return { scrolled, hidden, active: trackSections ? active : null }
}
