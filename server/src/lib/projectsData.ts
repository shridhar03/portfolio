import { readFileSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string(),
  category: z.string(),
  status: z.enum(['shipped', 'in-progress', 'coming-soon']),
  order: z.number(),
  stack: z.array(z.string()),
  caseStudy: z
    .object({ problem: z.string(), approach: z.string(), outcome: z.string() })
    .nullable(),
  links: z.object({ live: z.string().optional(), repo: z.string().optional() }),
})
export type Project = z.infer<typeof ProjectSchema>

/** Reads and validates shared/projects.json: the seed source and the no-DB fallback. */
export function loadSeedProjects(
  file = path.resolve(import.meta.dirname, '../../../shared/projects.json'),
) {
  return z.array(ProjectSchema).parse(JSON.parse(readFileSync(file, 'utf8')))
}
