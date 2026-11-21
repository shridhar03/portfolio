/**
 * Video slots (v2 spec). Each is optional: with no file, the site shows the still instead, and
 * every video also falls back to its still under reduced motion, Data Saver or a slow connection.
 *
 * To add one: export the clip (H.264 MP4, muted, ≤ 2 MB; WebM optional) to client/public/video/
 * and fill in its entry below. Source clips belong in assets-raw/video/.
 */
export type Clip = {
  sources: { src: string; type: 'video/mp4' | 'video/webm' }[]
  /** Still frame shown before playback and as the fallback. */
  poster?: string
}

export const media: {
  /** Looping hero background, made in Canva from your own photos and clips. */
  heroLoop: Clip | null
  /** About section: scroll scrubs from the Satara hills to the stage. */
  aboutScrub: Clip | null
} = {
  heroLoop: null,
  aboutScrub: null,
}
