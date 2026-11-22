import { profile } from '@/content/profile'
import { Seo } from '@/components/Seo'
import { personJsonLd } from '@/lib/seo'
import { useRef } from 'react'
import { About } from '@/components/sections/About'
import { Certifications } from '@/components/sections/Certifications'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Leadership } from '@/components/sections/Leadership'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { TechMarquee } from '@/components/sections/TechMarquee'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'
import { Manifesto } from '@/components/sections/Manifesto'

export function HomePage() {
  const root = useRef<HTMLDivElement>(null)
  useScrollAnimations(root)

  return (
    <div ref={root}>
      <Seo
        description={`${profile.shortName}: ${profile.tagline}. MCA graduate from ${profile.location}.`}
        path="/"
        jsonLd={personJsonLd(profile)}
      />
      <Hero />
      <TechMarquee />
      <About />
      <Skills />
      <Experience />
      <Manifesto />
      <Projects />
      <Education />
      <Certifications />
      <Leadership />
      <Contact />
    </div>
  )
}
