import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { CSSProperties, PointerEvent } from 'react'
import type { SimpleIcon } from 'simple-icons'
import { brandOn } from '@/lib/brandColor'
import { SPRING } from '@/lib/motion-tokens'

const TILE = '#141416' // tile face colour (tiles are dark in both themes)
const LAYERS = 8 // extrusion slices behind the face, 1.5px apart

/**
 * A technology logo as a small 3D object: a glossy dark tile extruded in CSS 3D (stacked slices),
 * the official logo shape raised off its face in the brand colour. It rests at a slight angle,
 * floats gently, and tilts toward the mouse. Pure CSS/Motion: no WebGL, no images.
 * Decorative; the visible name next to it carries the meaning.
 */
export function TechIcon3D({ icon, index }: { icon: SimpleIcon; index: number }) {
  const brand = brandOn(`#${icon.hex}`, TILE)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [26, -2]), SPRING.follow)
  const rotateY = useSpring(useTransform(px, [0, 1], [-30, 6]), SPRING.follow)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div
      className="group/tile relative grid place-items-center [perspective:600px]"
      style={{ '--brand': brand } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={reset}
      aria-hidden
    >
      {/* Soft contact shadow, coloured by the brand */}
      <span className="tile3d-shadow" />
      <div
        className="animate-float motion-reduce:animate-none"
        style={{ animationDelay: `${index * -0.45}s` }}
      >
        <motion.div className="tile3d" style={{ rotateX, rotateY }}>
          {Array.from({ length: LAYERS }, (_, i) => (
            <span
              key={i}
              className="tile3d-layer"
              style={{ transform: `translateZ(${-(i + 1) * 1.5}px)` }}
            />
          ))}
          <span className="tile3d-face" />
          <svg viewBox="0 0 24 24" className="tile3d-logo">
            <path d={icon.path} />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
