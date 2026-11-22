import { TechIcon3D } from '@/components/motion/TechIcon3D'
import { techStack } from '@/content/tech'

/** The tech stack as a shelf of 3D icons, each with its name underneath. */
export function TechShelf() {
  return (
    <ul
      aria-label="Technologies I use"
      className="grid grid-cols-4 gap-x-3 gap-y-8 sm:grid-cols-8 sm:gap-x-4"
      data-reveal-stagger
    >
      {techStack.map((t, i) => (
        <li key={t.slug} className="flex flex-col items-center gap-3 text-center">
          <TechIcon3D icon={t} index={i} />
          <span className="font-mono text-[0.7rem] leading-tight text-muted">{t.title}</span>
        </li>
      ))}
    </ul>
  )
}
