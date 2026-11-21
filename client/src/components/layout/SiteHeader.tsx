import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { navLinks } from '@/content/profile'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-bg/70 backdrop-blur-md supports-[backdrop-filter]:bg-bg/55">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight text-fg"
          aria-label="Shridhar Chavan, home"
        >
          SC<span className="text-accent-fg">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  className="rounded-pill px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
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
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border bg-bg md:hidden">
          <ul className="mx-auto max-w-content px-4 py-4">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-2xl font-semibold"
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
