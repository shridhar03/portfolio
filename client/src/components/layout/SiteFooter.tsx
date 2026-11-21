import { ArrowUp } from 'lucide-react'
import { profile } from '@/content/profile'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.shortName}. Built with React, Express & a lot of
          vibe coding.
        </p>
        <a href="#main" className="inline-flex items-center gap-2 hover:text-fg">
          Back to top <ArrowUp className="size-4" aria-hidden />
        </a>
      </div>
    </footer>
  )
}
