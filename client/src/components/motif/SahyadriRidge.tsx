import { cn } from '@/lib/utils'

/**
 * The repeating Sahyadri motif: two ridges of flat-topped Deccan plateaus with steep scarps, one
 * crest picked out in turmeric. Decorative. Stretches to its container's width.
 */
export function SahyadriRidge({
  className,
  crest = true,
}: {
  className?: string
  crest?: boolean
}) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
      className={cn('pointer-events-none block h-auto w-full', className)}
    >
      <path
        d="M0 118 76 112 138 72 262 66 302 92 362 88 424 52 562 46 604 80 682 84 742 60 862 57 904 94 982 97 1044 64 1182 60 1222 88 1302 91 1362 70 1440 72V200H0Z"
        className="fill-ridge-far"
      />
      <path
        d="M0 152 118 147 168 118 302 113 342 141 472 145 522 112 642 107 692 141 822 147 872 121 1012 116 1062 147 1182 151 1232 125 1342 120 1392 145 1440 147V200H0Z"
        className="fill-ridge-near"
      />
      {crest && (
        <path
          d="M424 52 562 46"
          className="stroke-accent"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  )
}
