import { cn } from '@/lib/utils'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * A number whose digits roll up like an odometer when scrolled into view ([data-odometer] in
 * useScrollAnimations). The markup already shows the final value, so it reads correctly without
 * JS and under reduced motion. Screen readers get the plain number.
 */
export function Odometer({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn('inline-flex', className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex leading-none" data-odometer>
        {[...value].map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className="relative inline-block h-[1em] overflow-hidden">
              <span
                className="flex flex-col"
                data-odo-digit={ch}
                style={{ transform: `translateY(-${Number(ch) * 10}%)` }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="block h-[1em] tabular-nums">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i}>{ch}</span>
          ),
        )}
      </span>
    </span>
  )
}
