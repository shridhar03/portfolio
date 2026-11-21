import type { RouteObject } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/pages/HomePage'

// Home ships in the main bundle; every other route is its own chunk.
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    HydrateFallback: () => null,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/projects/:slug',
        lazy: () => import('@/pages/ProjectPage').then((m) => ({ Component: m.ProjectPage })),
      },
      {
        path: '/chat',
        lazy: () => import('@/pages/ChatPage').then((m) => ({ Component: m.ChatPage })),
      },
      {
        path: '*',
        lazy: () => import('@/pages/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })),
      },
    ],
  },
]
