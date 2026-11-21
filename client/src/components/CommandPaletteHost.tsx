import { lazy, Suspense, useEffect, useState } from 'react'
import { usePalette } from '@/providers/palette-context'

const CommandPalette = lazy(() =>
  import('./CommandPalette').then((m) => ({ default: m.CommandPalette })),
)

/** Owns the ⌘K / Ctrl+K shortcut and only downloads the palette (cmdk) the first time it opens. */
export function CommandPaletteHost() {
  const { open, setOpen } = usePalette()
  const [loaded, setLoaded] = useState(false)
  if (open && !loaded) setLoaded(true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  if (!loaded) return null
  return (
    <Suspense fallback={null}>
      <CommandPalette />
    </Suspense>
  )
}
