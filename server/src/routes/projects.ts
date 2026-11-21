import { Router } from 'express'
import type { Stores } from '../stores/types.js'

export function projectsRouter(stores: Stores) {
  const r = Router()

  r.get('/', async (_req, res) => {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600')
    res.json({ projects: await stores.projects.list() })
  })

  r.get('/:slug', async (req, res) => {
    const project = await stores.projects.get(req.params.slug)
    if (!project) return void res.status(404).json({ error: 'Project not found' })
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600')
    res.json({ project })
  })

  return r
}
