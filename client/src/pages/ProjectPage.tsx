import { Link, useParams } from 'react-router'

// Phase 1 stub. Case-study layout arrives in Phase 2, data from the API in Phase 4.
export function ProjectPage() {
  const { slug } = useParams()
  return (
    <section className="mx-auto max-w-content px-4 pt-32 pb-16 sm:px-6">
      <p className="eyebrow">Project</p>
      <h1 className="mt-4 text-h1 font-bold">{slug}</h1>
      <p className="mt-6 text-muted">Case study coming in a later phase.</p>
      <Link to="/" className="mt-8 inline-block text-accent-fg underline underline-offset-4">
        Back home
      </Link>
    </section>
  )
}
