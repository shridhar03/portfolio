import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { AppProviders } from '@/AppProviders'
import { routes } from '@/routes'
import { BASE, ROUTER_BASENAME, withBase } from '@/lib/base'

/** Build-time only: renders one route to HTML (used by scripts/prerender.mjs). */
export async function render(path: string) {
  const handler = createStaticHandler(routes, { basename: ROUTER_BASENAME })
  const context = await handler.query(
    new Request(new URL(withBase(BASE, path), 'http://prerender.local')),
  )
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${path}`)
  const router = createStaticRouter(handler.dataRoutes, context)
  return renderToString(
    <AppProviders>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </AppProviders>,
  )
}
