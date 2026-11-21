import raw from '../../../shared/projects.json'

// Same JSON seeds MongoDB in Phase 4; until then the client reads it directly.
export type Project = {
  slug: string
  title: string
  summary: string
  category: string
  status: 'shipped' | 'in-progress' | 'coming-soon'
  order: number
  stack: string[]
  caseStudy: { problem: string; approach: string; outcome: string } | null
  links: { live?: string; repo?: string }
}

export const projects = (raw as Project[]).toSorted((a, b) => a.order - b.order)

export const isTodo = (v?: string) => !v || v.startsWith('TODO')

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
