import { AnimatePresence, LayoutGroup } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { CommandPaletteHost } from '@/components/CommandPaletteHost'
import { CustomCursor } from '@/components/motion/CustomCursor'
import { ScrollTrigger } from '@/lib/motion'
import { useLenis } from '@/providers/lenis-context'
import { PageTransition } from './PageTransition'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/** Keeps the outgoing route's element alive while it animates out. */
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

export function RootLayout() {
  const location = useLocation()
  const lenis = useLenis()

  // After each route swap: jump to the hash target or the top, then re-measure scroll triggers.
  const onEnterDone = () => {
    const target = location.hash ? document.querySelector(location.hash) : null
    if (target) {
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -72 })
      else target.scrollIntoView()
    }
    ScrollTrigger.refresh()
  }

  // Marks the app as live (hydrated, listeners attached). Used by the e2e smoke tests.
  useEffect(() => {
    document.documentElement.dataset.ready = ''
  }, [])

  useEffect(() => {
    if (location.hash) return
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-pill bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <LayoutGroup>
          <AnimatePresence mode="wait" initial={false} onExitComplete={onEnterDone}>
            <PageTransition key={location.pathname}>
              <FrozenOutlet />
            </PageTransition>
          </AnimatePresence>
        </LayoutGroup>
      </main>
      {location.pathname !== '/chat' && <SiteFooter />}
      <ChatWidget />
      <CommandPaletteHost />
      <CustomCursor />
      <div className="grain" aria-hidden />
    </>
  )
}
