import { useMemo, useState, type ReactNode } from 'react'
import { PaletteContext } from './palette-context'

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ open, setOpen }), [open])
  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
}
