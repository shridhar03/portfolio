import { cn } from '@/lib/utils'

const marks = {
  underline: {
    box: '0 0 240 26',
    d: ['M4 15C62 7 142 4 236 10', 'M22 22C92 15 160 14 226 18'],
  },
  circle: {
    box: '0 0 220 100',
    d: ['M150 12C70 2 8 22 10 52c2 32 86 44 152 34 52-8 60-46 24-64-26-12-76-14-102-8'],
  },
  arrow: { box: '0 0 120 80', d: ['M8 10c22 50 62 62 100 52', 'M92 50l17 12-19 10'] },
  star: { box: '0 0 40 40', d: ['M20 4l2 13 14 3-14 3-2 13-2-13-14-3 14-3z'] },
} as const

/**
 * A hand-drawn mark (v2 spec: "a few hand-drawn marks"). With motion allowed it draws itself in
 * when scrolled into view ([data-draw], see useScrollAnimations); otherwise it is simply there.
 */
export function HandMark({
  kind,
  className,
  strokeWidth = 3.5,
  draw = 'scroll',
}: {
  kind: keyof typeof marks
  className?: string
  strokeWidth?: number
  /** 'scroll' draws when scrolled into view; 'hero' is drawn by the hero intro timeline. */
  draw?: 'scroll' | 'hero'
}) {
  const m = marks[kind]
  return (
    <svg
      viewBox={m.box}
      preserveAspectRatio={kind === 'star' ? undefined : 'none'}
      aria-hidden
      focusable="false"
      data-draw={draw}
      className={cn('pointer-events-none overflow-visible text-accent', className)}
      fill="none"
    >
      {m.d.map((d) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
