import { Section } from '@/components/Section'
import { experience } from '@/content/profile'

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="03 · Experience"
      title="Where I've worked"
      data-pin="experience"
      className="lg:flex lg:min-h-dvh lg:flex-col lg:justify-center"
    >
      <ol className="space-y-6">
        {experience.map((job) => (
          <li
            key={job.company}
            className="grid gap-6 rounded-card border border-border bg-surface p-6 sm:p-10 lg:grid-cols-12"
            data-reveal
          >
            <div className="lg:col-span-4">
              <p className="font-mono text-sm text-accent-fg">{job.period}</p>
              <h3 className="mt-3 text-h3 font-semibold">{job.role}</h3>
              <p className="mt-1 text-muted">
                {job.company} · {job.place}
              </p>
            </div>
            <ul className="space-y-4 lg:col-span-8">
              {job.points.map((pt, i) => (
                <li key={pt} className="flex gap-4 text-lead" data-step>
                  <span className="font-mono text-sm leading-[2] text-muted" aria-hidden>
                    0{i + 1}
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
