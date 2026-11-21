import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  id: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ id, eyebrow, title, intro, children, className }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('relative scroll-mt-20 py-section', className)}
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-3 text-h2 font-bold">
          {title}
        </h2>
        {intro && <p className="mt-4 max-w-2xl text-lead text-muted">{intro}</p>}
        <div className="mt-10 sm:mt-14">{children}</div>
      </div>
    </section>
  )
}
