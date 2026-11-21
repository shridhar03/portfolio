import { ArrowDownRight, FileDown, MessageCircle } from 'lucide-react'
import { Link } from 'react-router'
import { Picture } from '@/components/Picture'
import { Button } from '@/components/ui/button'
import { profile } from '@/content/profile'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="blob -top-40 -left-32 -z-10 size-[30rem]" aria-hidden />
      <div
        className="blob top-1/4 -right-40 -z-10 size-[36rem] [--blob:var(--color-navy-glow)]"
        aria-hidden
      />

      <div className="mx-auto grid min-h-dvh max-w-content items-center gap-12 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="eyebrow">{profile.location}</p>
          <h1 id="hero-title" className="mt-5 text-display font-bold">
            Shridhar
            <br />
            <span className="lg:pl-[0.6em]">
              Chavan<span className="text-accent">.</span>
            </span>
          </h1>

          <p className="mt-6 font-mono text-sm text-muted">
            <span className="sr-only">Roles: </span>
            {profile.roles.map((r, i) => (
              <span key={r}>
                {i > 0 && (
                  <span className="mx-2 text-accent-fg" aria-hidden>
                    /
                  </span>
                )}
                <span className={i === 0 ? 'text-fg' : undefined}>{r}</span>
              </span>
            ))}
          </p>

          <p className="mt-6 max-w-xl text-lead text-muted">
            MCA graduate building with the MERN stack, exploring AI/ML and NLP, and shipping fast
            with AI-assisted vibe coding.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#contact">
                Get in touch <ArrowDownRight aria-hidden />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={profile.resumePdf} download>
                <FileDown aria-hidden /> Resume
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/chat">
                <MessageCircle aria-hidden /> Ask Shridhar
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-card border border-border bg-surface shadow-2xl shadow-black/30">
            <Picture
              name="profile"
              widths={[360, 540, 720]}
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 384px, 90vw"
              width={720}
              height={900}
              priority
              alt="Shridhar Chavan smiling on a hilltop above green valleys and a lake, wearing a navy jacket"
              className="aspect-[4/5] w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/80 to-transparent"
              aria-hidden
            />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-pill border border-border bg-surface/90 px-4 py-2 font-mono text-xs text-fg backdrop-blur sm:-left-6">
            <span className="mr-2 inline-block size-2 rounded-full bg-accent" aria-hidden />
            UGC NET qualified · 2025
          </div>
        </div>
      </div>
    </section>
  )
}
