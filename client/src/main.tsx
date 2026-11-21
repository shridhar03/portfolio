import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'motion/react'
import { RouterProvider } from 'react-router'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@/styles/index.css'
import { IntroProvider } from '@/providers/IntroProvider'
import { SmoothScroll } from '@/providers/SmoothScroll'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { router } from '@/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        {/* reducedMotion="user": Motion drops transform animations when the OS asks for less motion */}
        <MotionConfig reducedMotion="user">
          <SmoothScroll>
            <IntroProvider>
              <RouterProvider router={router} />
            </IntroProvider>
          </SmoothScroll>
        </MotionConfig>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
