import { cn } from '@/lib/utils'

/** A short note in handwriting, slightly rotated, in the accent text colour. */
export function HandNote({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block -rotate-2 font-hand text-2xl leading-none font-bold text-accent-fg',
        className,
      )}
    >
      {children}
    </span>
  )
}
