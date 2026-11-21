import { MotionConfig } from 'motion/react'
import { StrictMode, type ReactNode } from 'react'
import { ChatProvider } from '@/providers/ChatProvider'
import { IntroProvider } from '@/providers/IntroProvider'
import { PaletteProvider } from '@/providers/PaletteProvider'
import { SmoothScroll } from '@/providers/SmoothScroll'
import { ThemeProvider } from '@/providers/ThemeProvider'

/** Every app-wide provider, shared by the browser entry and the build-time prerender. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <ThemeProvider>
        {/* reducedMotion="user": Motion drops transform animations when the OS asks for less motion */}
        <MotionConfig reducedMotion="user">
          <SmoothScroll>
            <IntroProvider>
              <ChatProvider>
                <PaletteProvider>{children}</PaletteProvider>
              </ChatProvider>
            </IntroProvider>
          </SmoothScroll>
        </MotionConfig>
      </ThemeProvider>
    </StrictMode>
  )
}
