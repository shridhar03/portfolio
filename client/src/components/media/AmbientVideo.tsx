import type { Clip } from '@/content/media'
import { useCanPlayVideo } from '@/hooks/useCanPlayVideo'
import { cn } from '@/lib/utils'

/**
 * Decorative looping video (muted, inline, no controls). Renders the poster still until the
 * page has hydrated and the visitor's settings allow video, so it never competes with the LCP.
 */
export function AmbientVideo({ clip, className }: { clip: Clip | null; className?: string }) {
  const ok = useCanPlayVideo()
  if (!clip) return null
  if (!ok)
    return clip.poster ? (
      <img src={clip.poster} alt="" aria-hidden className={cn('object-cover', className)} />
    ) : null
  return (
    <video
      className={cn('object-cover', className)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={clip.poster}
      aria-hidden
      tabIndex={-1}
    >
      {clip.sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  )
}
