// Generates the technology-themed background art into client/public/bg/ (original work, no stock images):
//   circuit.svg  printed-circuit traces with pads and vias
//   code.svg     real source code from this repo (server/src/lib/llm.ts + intent.ts), as a texture
//   network.svg  a node graph, like a service map
// Deterministic (seeded), so re-running gives the same files. Run: npm run backgrounds
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'client/public/bg')
await mkdir(out, { recursive: true })

function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const GREY = '#8d8d93'
const RED = '#d92b20'
const r1 = (n) => Math.round(n * 10) / 10

// ---------- circuit board ----------
{
  const rand = rng(7)
  const W = 1440
  const H = 900
  const G = 24 // routing grid
  const paths = []
  const pads = []
  for (let i = 0; i < 70; i++) {
    let x = Math.floor(rand() * (W / G)) * G
    let y = Math.floor(rand() * (H / G)) * G
    const pts = [[x, y]]
    let dir = Math.floor(rand() * 4)
    const segs = 2 + Math.floor(rand() * 4)
    for (let s = 0; s < segs; s++) {
      const len = (2 + Math.floor(rand() * 8)) * G
      const dx = [1, 0, -1, 0][dir]
      const dy = [0, 1, 0, -1][dir]
      // 45° chamfer into the next straight run, like real PCB routing
      x += dx * len
      y += dy * len
      pts.push([x, y])
      const turn = rand() < 0.5 ? 1 : 3
      const ndir = (dir + turn) % 4
      const cx = [1, 0, -1, 0][ndir]
      const cy = [0, 1, 0, -1][ndir]
      x += (dx + cx) * G * 0.5
      y += (dy + cy) * G * 0.5
      pts.push([x, y])
      dir = ndir
    }
    const red = rand() < 0.14
    paths.push(
      `<path d="M${pts.map(([a, b]) => `${a} ${b}`).join('L')}" stroke="${red ? RED : GREY}" stroke-opacity="${red ? 0.9 : 0.55}"/>`,
    )
    const [ex, ey] = pts.at(-1)
    const [sx, sy] = pts[0]
    pads.push(`<circle cx="${sx}" cy="${sy}" r="3.2" fill="${red ? RED : GREY}"/>`)
    pads.push(
      `<circle cx="${ex}" cy="${ey}" r="5" fill="none" stroke="${red ? RED : GREY}" stroke-width="1.6"/>`,
    )
  }
  // a few chips (QFP packages) with pins
  const chips = []
  for (let i = 0; i < 5; i++) {
    const w = (4 + Math.floor(rand() * 4)) * G
    const x = Math.floor(rand() * ((W - w) / G)) * G
    const y = Math.floor(rand() * ((H - w) / G)) * G
    let pins = ''
    for (let p = G / 2; p < w; p += G / 2) {
      pins += `<path d="M${x + p} ${y - 8}v8M${x + p} ${y + w}v8M${x - 8} ${y + p}h8M${x + w} ${y + p}h8"/>`
    }
    chips.push(
      `<g stroke="${GREY}" stroke-opacity=".6"><rect x="${x}" y="${y}" width="${w}" height="${w}" rx="6" fill="none"/>${pins}</g>`,
    )
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><g fill="none" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${paths.join('')}</g>${chips.join('')}${pads.join('')}</svg>`
  await writeFile(path.join(out, 'circuit.svg'), svg)
  console.log('✓ circuit.svg', svg.length)
}

// ---------- code texture (this repo's own code) ----------
{
  const src = [
    await readFile(path.join(root, 'server/src/lib/intent.ts'), 'utf8'),
    await readFile(path.join(root, 'server/src/lib/llm.ts'), 'utf8'),
  ]
    .join('\n')
    .split('\n')
    // skip blank lines, long lines, comments and bare string-list entries: keep the code-shaped lines
    .filter(
      (l) =>
        l.trim() && l.length < 84 && !/^\s*(\/\/|\*|\/\*)/.test(l) && !/^\s*'[^']*',?$/.test(l),
    )
    .slice(0, 46)
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const KW = /\b(import|from|export|const|function|return|await|async|type|if|else|for|new)\b/g
  const lines = src.map((l, i) => {
    const body = esc(l).replace(KW, `<tspan fill="${RED}">$1</tspan>`)
    // fade out toward the bottom so the texture has no hard edge
    const fade = r1(1 - (i / (src.length - 1)) ** 1.6)
    return `<text x="40" y="${44 + i * 19}" fill-opacity="${fade}" xml:space="preserve">${body}</text>`
  })
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 920" width="820" height="920"><g font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="14" fill="${GREY}">${lines.join('')}</g></svg>`
  await writeFile(path.join(out, 'code.svg'), svg)
  console.log('✓ code.svg', svg.length)
}

// ---------- network graph ----------
{
  const rand = rng(42)
  const W = 1440
  const H = 900
  const nodes = Array.from({ length: 46 }, () => [r1(rand() * W), r1(rand() * H), rand()])
  const edges = []
  nodes.forEach(([x, y], i) => {
    const near = nodes
      .map(([a, b], j) => [Math.hypot(a - x, b - y), j])
      .filter(([, j]) => j !== i)
      .sort((p, q) => p[0] - q[0])
      .slice(0, 2)
    for (const [, j] of near) if (i < j) edges.push([i, j])
  })
  const lines = edges.map(([i, j]) => {
    const red = nodes[i][2] > 0.86 && nodes[j][2] > 0.5
    return `<path d="M${nodes[i][0]} ${nodes[i][1]}L${nodes[j][0]} ${nodes[j][1]}" stroke="${red ? RED : GREY}" stroke-opacity="${red ? 0.85 : 0.45}"/>`
  })
  const dots = nodes.map(([x, y, k]) =>
    k > 0.86
      ? `<circle cx="${x}" cy="${y}" r="5" fill="${RED}"/><circle cx="${x}" cy="${y}" r="12" fill="none" stroke="${RED}" stroke-opacity=".5"/>`
      : `<circle cx="${x}" cy="${y}" r="${k > 0.5 ? 3.5 : 2.4}" fill="${GREY}"/>`,
  )
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><g stroke-width="1.2">${lines.join('')}</g>${dots.join('')}</svg>`
  await writeFile(path.join(out, 'network.svg'), svg)
  console.log('✓ network.svg', svg.length)
}
