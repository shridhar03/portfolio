/**
 * Splits a score such as "GPA 8.74 / 10" or "93.20%" around its first number, so the number
 * can roll like an odometer while the words around it stay plain text.
 */
export function splitScore(score: string): { before: string; number: string; after: string } {
  const m = /\d+(?:\.\d+)?/.exec(score)
  if (!m) return { before: score, number: '', after: '' }
  return {
    before: score.slice(0, m.index),
    number: m[0],
    after: score.slice(m.index + m[0].length),
  }
}
