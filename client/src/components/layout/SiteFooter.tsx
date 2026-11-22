import { ArrowUp } from 'lucide-react'
import { motion } from 'motion/react'
import { SahyadriRidge } from '@/components/motif/SahyadriRidge'
import { profile } from '@/content/profile'
import { DUR, EASE } from '@/lib/motion-tokens'

export function SiteFooter() {
  return (
    <footer>
      <SahyadriRidge className="-mb-px h-20 sm:h-28" />
      <div className="relative overflow-hidden bg-ridge-near">
        {/* Signature: the name rises out of the bottom edge as the footer comes into view. */}
        <div className="mx-auto max-w-content overflow-hidden px-4 pt-6 sm:px-6" aria-hidden>
          <motion.p
            className="slant ember-text font-display text-[clamp(3.5rem,1rem+12vw,13rem)] leading-[0.82] whitespace-nowrap uppercase opacity-80 select-none"
            initial={{ y: '45%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: DUR.cinematic, ease: EASE.out }}
          >
            Shridhar Chavan
          </motion.p>
        </div>
        <div className="mx-auto flex max-w-content flex-col gap-4 border-t border-border/60 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.shortName}.
            From {profile.location.split(',')[0]}, made with React, Express and Claude.
          </p>
          <a
            href="#main"
            className="group inline-flex min-h-11 items-center gap-2 transition-colors hover:text-fg"
          >
            Back to top
            <ArrowUp
              className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-1"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
