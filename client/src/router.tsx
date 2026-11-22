import { createBrowserRouter } from 'react-router'
import { routes } from '@/routes'
import { ROUTER_BASENAME } from '@/lib/base'

export const router = createBrowserRouter(routes, { basename: ROUTER_BASENAME })
