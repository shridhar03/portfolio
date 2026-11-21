import { GraduationCap, Languages, MapPin } from 'lucide-react'
import { Section } from '@/components/Section'
import { profile } from '@/content/profile'

const facts = [
  { icon: MapPin, label: 'Based in', value: profile.location },
  { icon: GraduationCap, label: 'Education', value: 'MCA · GCE Karad · UGC NET (Jan 2025)' },
  { icon: Languages, label: 'Speaks', value: profile.languages.join(', ') },
]

export function About() {
  return (
    <Section
      id="about"
      eyebrow="01 · About"
      title={
        <>
          Efficient, user-friendly software, <span className="text-accent-fg">built with care</span>
          .
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-5 text-lead text-muted lg:col-span-7">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <ul className="grid gap-3 self-start lg:col-span-5">
          {facts.map(({ icon: Icon, label, value }) => (
            <li
              key={label}
              className="flex items-start gap-4 rounded-card border border-border bg-surface p-5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-accent-fg">
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-mono text-xs tracking-wider text-muted uppercase">
                  {label}
                </span>
                <span className="mt-1 block text-fg">{value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
