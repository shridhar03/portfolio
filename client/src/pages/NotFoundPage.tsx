import { Link } from 'react-router'

// Phase 1 stub. Playful animated version arrives in Phase 3.
export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-dvh max-w-content flex-col justify-center px-4 sm:px-6">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-display font-bold">
        Lost in the <span className="text-accent">hills</span>.
      </h1>
      <Link to="/" className="mt-8 text-accent-fg underline underline-offset-4">
        Take me home
      </Link>
    </section>
  )
}
