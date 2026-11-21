import { PointMaterial, Points } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Points as ThreePoints } from 'three'

const COUNT = 1400

/** Deterministic PRNG (mulberry32) so the field is generated once, purely, at module load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Points on a slightly fuzzy sphere shell.
const POSITIONS = (() => {
  const rand = mulberry32(2026)
  const arr = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const u = rand() * 2 - 1
    const t = rand() * Math.PI * 2
    const r = 2.2 + rand() * 0.5
    const s = Math.sqrt(1 - u * u)
    arr.set([r * s * Math.cos(t), r * s * Math.sin(t), r * u], i * 3)
  }
  return arr
})()

function Field({ color }: { color: string }) {
  const ref = useRef<ThreePoints>(null)
  useFrame((state, delta) => {
    const p = ref.current
    if (!p) return
    // Slow spin plus a lean toward the cursor (pointer is -1..1).
    p.rotation.y += delta * 0.06
    p.rotation.x += (state.pointer.y * 0.35 - p.rotation.x) * 0.04
    p.rotation.z += (-state.pointer.x * 0.25 - p.rotation.z) * 0.04
  })

  return (
    <Points ref={ref} positions={POSITIONS} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}

/** Lazy-loaded hero particle field. Rendered only on capable, motion-OK devices. */
export default function HeroScene({ color }: { color: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <Field color={color} />
    </Canvas>
  )
}
