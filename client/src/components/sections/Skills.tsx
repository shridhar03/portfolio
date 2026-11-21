import { BrainCircuit, Cloud, Code2, Globe, Layers, Workflow, type LucideIcon } from 'lucide-react'
import { motion, useMotionValue } from 'motion/react'
import { useState, type PointerEvent } from 'react'
import { Section } from '@/components/Section'
import { skillGroups } from '@/content/profile'
import { cn } from '@/lib/utils'

const icons: Record<string, LucideIcon> = {
  MERN: Layers,
  'AI/ML & NLP': BrainCircuit,
  Languages: Code2,
  Web: Globe,
  'Data & Cloud': Cloud,
  Workflow: Workflow,
}

const spanClass = { wide: 'sm:col-span-2', tall: 'lg:row-span-2', normal: '' } as const

type Group = (typeof skillGroups)[number]

function SkillCard({ group, index }: { group: Group; index: number }) {
  const Icon = icons[group.title]
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [active, setActive] = useState(false)

  // Spotlight follows the cursor; moved with transform only.
  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <li
      onPointerMove={onMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={cn(
        'group relative isolate flex flex-col overflow-hidden rounded-card border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/50',
        spanClass[group.span],
      )}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 -z-10 size-80 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent)_22%,transparent),transparent_65%)]"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold">{group.title}</h3>
        <Icon
          className="size-7 animate-float text-accent-fg motion-reduce:animate-none"
          style={{ animationDelay: `${index * -0.9}s` }}
          aria-hidden
        />
      </div>
      <ul className="mt-auto flex flex-wrap gap-2 pt-6">
        {group.items.map((s) => (
          <li
            key={s}
            className="rounded-pill border border-border bg-surface-2 px-3 py-1 text-sm text-fg"
          >
            {s}
          </li>
        ))}
      </ul>
    </li>
  )
}

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="02 · Skills"
      title="What I build with"
      intro="JavaScript across the whole stack, with AI/ML and NLP on top."
    >
      <ul
        className="grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4"
        data-reveal-stagger
      >
        {skillGroups.map((g, i) => (
          <SkillCard key={g.title} group={g} index={i} />
        ))}
      </ul>
    </Section>
  )
}
