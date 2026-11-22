import { Command, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { navLinks } from '@/content/profile'
import { useHydrated } from '@/hooks/useHydrated'
import { usePalette } from '@/providers/palette-context'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const palette = usePalette()
  // Server/hydration render says Ctrl K; Apple devices switch to ⌘K once hydrated.
  const isMac = useHydrated() && /Mac|iPhone|iPad/.test(navigator.platform)

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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 rounded-pill border border-border bg-bg/70 py-1.5 pr-1.5 pl-1.5 backdrop-blur-md supports-[backdrop-filter]:bg-bg/55 sm:pl-2">
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

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  className={
                    l.id === 'contact'
                      ? 'rounded-pill bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110'
                      : 'rounded-pill px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg'
                  }
                >
                  {l.label}
                </a>
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
            <kbd className="font-mono text-xs">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="mx-auto mt-2 max-w-content rounded-card border border-border bg-bg md:hidden"
        >
          <ul className="mx-auto max-w-content px-4 py-4">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-3xl uppercase"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
