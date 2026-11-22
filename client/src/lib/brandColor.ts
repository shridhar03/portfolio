/** Relative luminance of a #rrggbb colour (WCAG 2). */
export function luminance(hex: string) {
  const n = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/**
 * A brand colour that stays visible on a dark surface: mixes the colour toward white until it reaches
 * `min` contrast against `bg` (3:1, the WCAG level for graphics). Bright brand colours come back unchanged.
 */
export function brandOn(hex: string, bg: string, min = 3) {
  const base = hex.replace('#', '').toLowerCase()
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(base.slice(i, i + 2), 16))
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const mix = [r, g, b].map((c) => Math.round(c + (255 - c) * t))
    const out = '#' + mix.map((c) => c.toString(16).padStart(2, '0')).join('')
    if (contrast(out, bg) >= min) return out
  }
  return '#ffffff'
}
