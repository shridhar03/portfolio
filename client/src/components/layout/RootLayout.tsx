import { Outlet } from 'react-router'
import { SiteHeader } from './SiteHeader'

export function RootLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-pill bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <div className="grain" aria-hidden />
    </>
  )
}
