import { createRoot, hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@/styles/index.css'
import { AppProviders } from '@/AppProviders'
import { router } from '@/router'

// Static head tags from the prerender give way to the ones React manages per route.
document.querySelectorAll('[data-prerender]').forEach((el) => el.remove())

const container = document.getElementById('root')!
const app = (
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
)

if (container.hasChildNodes()) {
  // Production: hydrate the prerendered HTML (scripts/prerender.mjs) once a lazy route's code is in.
  const start = () => hydrateRoot(container, app)
  if (router.state.initialized) start()
  else {
    const stop = router.subscribe((state) => {
      if (!state.initialized) return
      stop()
      start()
    })
  }
} else {
  createRoot(container).render(app)
}
