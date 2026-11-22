import { Command } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { navLinks } from '@/content/profile'
import { useHeaderScroll } from '@/hooks/useHeaderScroll'
import { useHydrated } from '@/hooks/useHydrated'
import { DUR, EASE, SPRING, STAGGER } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { usePalette } from '@/providers/palette-context'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const palette = usePalette()
  // Server/hydration render says Ctrl K; Apple devices switch to ⌘K once hydrated.
  const isMac = useHydrated() && /Mac|iPhone|iPad/.test(navigator.platform)
  const { scrolled, hidden, active } = useHeaderScroll(
    navLinks.map((l) => l.id),
    pathname === '/',
  )

  // Close the mobile menu on navigation (React-recommended "adjust state on prop change" pattern).
  const [lastLoc, setLastLoc] = useState(pathname + hash)
  if (lastLoc !== pathname + hash) {
    setLastLoc(pathname + hash)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={cn(
        // Scroll-aware: slides away while reading down, returns on any scroll up or keyboard focus.
        'fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-out-expo focus-within:translate-y-0 sm:px-4',
        hidden && !open && '-translate-y-[130%]',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-content items-center justify-between gap-4 rounded-pill border py-1.5 pr-1.5 pl-1.5 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-500 sm:pl-2',
          scrolled
            ? 'border-border bg-bg/80 shadow-[0_10px_40px_-18px_rgb(0_0_0/0.6)] supports-[backdrop-filter]:bg-bg/65'
            : 'border-border/60 bg-bg/50 supports-[backdrop-filter]:bg-bg/30',
        )}
      >
        <Link to="/" className="flex items-center gap-2.5 pr-2 text-fg">
          <span
            className="grid size-11 place-items-center rounded-full bg-accent font-display text-lg text-accent-ink shadow-[0_0_24px_-4px_var(--color-accent)]"
            aria-hidden
          >
            SC
          </span>
          <span
            className="hidden font-display text-lg tracking-wide uppercase sm:inline"
            aria-hidden
          >
            Shridhar
          </span>
          <span className="sr-only">Shridhar Chavan, home</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                {l.id === 'contact' ? (
                  <a
                    href={`/#${l.id}`}
                    aria-current={active === l.id ? 'true' : undefined}
                    className="ml-1 inline-block rounded-pill bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-[filter,transform] duration-200 hover:-translate-y-px hover:brightness-110 active:translate-y-0"
                  >
                    {l.label}
                  </a>
                ) : (
                  <a
                    href={`/#${l.id}`}
                    aria-current={active === l.id ? 'true' : undefined}
                    className={cn(
                      'group/nav relative inline-block rounded-pill px-3 py-2 text-sm transition-colors duration-200',
                      active === l.id ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {/* Active-section pill glides between links (shared layoutId). */}
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-pill bg-surface-2"
                        transition={{ type: 'spring', ...SPRING.soft }}
                        aria-hidden
                      />
                    )}
                    {l.label}
                    {/* Underline reveal on hover */}
                    <span
                      className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out-expo group-hover/nav:scale-x-100"
                      aria-hidden
                    />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => palette.setOpen(true)}
            className="hidden h-11 items-center gap-2 rounded-pill border border-border px-3 text-sm text-muted transition-colors hover:text-fg sm:inline-flex"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Command className="size-4" aria-hidden />
            <span className="sr-only">Open command palette, shortcut </span>
            <kbd className="font-mono text-xs whitespace-nowrap">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {/* Two bars that morph into an X */}
            <span className="relative block h-3 w-4.5" aria-hidden>
              <span
                className={cn(
                  'absolute left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-300 ease-out-expo',
                  open ? 'top-[5px] rotate-45' : 'top-0.5',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-300 ease-out-expo',
                  open ? 'top-[5px] -rotate-45' : 'top-2',
                )}
              />
            </span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="mx-auto mt-2 max-w-content origin-top rounded-card border border-border bg-bg lg:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: DUR.ui, ease: EASE.out },
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.98,
              transition: { duration: DUR.micro, ease: EASE.in },
            }}
          >
            <ul className="mx-auto max-w-content px-4 py-4">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * STAGGER.tight, duration: DUR.ui, ease: EASE.out }}
                >
                  <a
                    href={`/#${l.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === l.id ? 'true' : undefined}
                    className="flex items-center justify-between py-3 font-display text-3xl uppercase aria-[current]:text-accent-fg"
                  >
                    {l.label}
                    <span className="font-mono text-xs text-muted" aria-hidden>
                      0{i + 1}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
