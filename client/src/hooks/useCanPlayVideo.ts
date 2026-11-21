import { useEffect, useState } from 'react'
import { canAutoplayVideo, readVideoEnv } from '@/lib/media'

/** False on the server and the first client render (prerender shows the still), then decides. */
export function useCanPlayVideo() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setOk(canAutoplayVideo(readVideoEnv()))
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return ok
}
