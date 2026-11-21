import { Link } from 'react-router'
import { ThemeToggle } from '@/components/ThemeToggle'

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight text-fg"
          aria-label="Shridhar Chavan, home"
        >
          SC<span className="text-accent-fg">.</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
