import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { projects as bundled, type Project } from '@/content/projects'

/**
 * Projects come from GET /api/projects (MongoDB). The bundled copy of shared/projects.json is used
 * for the first paint and as an offline fallback, so the page never waits on the API.
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(bundled)
  useEffect(() => {
    let alive = true
    api<{ projects: Project[] }>('/api/projects')
      .then((r) => alive && r.projects.length && setProjects(r.projects))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  return projects
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | undefined>(() =>
    bundled.find((p) => p.slug === slug),
  )
  const [lastSlug, setLastSlug] = useState(slug)
  if (lastSlug !== slug) {
    setLastSlug(slug)
    setProject(bundled.find((p) => p.slug === slug))
  }
  useEffect(() => {
    let alive = true
    api<{ project: Project }>(`/api/projects/${encodeURIComponent(slug)}`)
      .then((r) => alive && setProject(r.project))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [slug])
  return project
}
