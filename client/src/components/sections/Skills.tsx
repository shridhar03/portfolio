import { BrainCircuit, Cloud, Code2, Globe, Layers, Workflow, type LucideIcon } from 'lucide-react'
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

const spanClass = {
  wide: 'sm:col-span-2',
  tall: 'lg:row-span-2',
  normal: '',
} as const

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="02 · Skills"
      title="The toolkit"
      intro="Full-stack JavaScript at the core, with AI/ML and NLP layered on top."
    >
      <ul className="grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((g) => {
          const Icon = icons[g.title]
          return (
            <li
              key={g.title}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface p-6',
                spanClass[g.span],
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold">{g.title}</h3>
                <Icon className="size-7 text-accent-fg" aria-hidden />
              </div>
              <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                {g.items.map((s) => (
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
        })}
      </ul>
    </Section>
  )
}
