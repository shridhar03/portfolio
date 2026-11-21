import { ArrowUp } from 'lucide-react'
import { SahyadriRidge } from '@/components/motif/SahyadriRidge'
import { profile } from '@/content/profile'

export function SiteFooter() {
  return (
    <footer>
      <SahyadriRidge className="-mb-px h-20 sm:h-28" />
      <div className="bg-ridge-near">
        <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.shortName}.
            From {profile.location.split(',')[0]}, made with React, Express and Claude.
          </p>
          <a href="#main" className="inline-flex items-center gap-2 hover:text-fg">
            Back to top <ArrowUp className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}
