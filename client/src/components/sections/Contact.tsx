import { ArrowUpRight, Mail, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/button'
import { profile } from '@/content/profile'
import { mailtoHref, validateContact, type ContactDraft } from '@/lib/contact'
import { cn } from '@/lib/utils'

const fieldClass =
  'w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-fg placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none'

export function Contact() {
  const [draft, setDraft] = useState<ContactDraft>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({})

  const update = (k: keyof ContactDraft) => (e: { target: { value: string } }) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }))

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validateContact(draft)
    setErrors(errs)
    if (Object.keys(errs).length === 0) window.location.href = mailtoHref(profile.email, draft)
  }

  const field = (k: keyof ContactDraft, label: string, el: 'input' | 'textarea', type = 'text') => {
    const id = `contact-${k}`
    const err = errors[k]
    const common = {
      id,
      name: k,
      value: draft[k],
      onChange: update(k),
      'aria-invalid': !!err,
      'aria-describedby': err ? `${id}-err` : undefined,
      className: cn(fieldClass, err && 'border-red-400'),
    }
    return (
      <div>
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {label}
        </label>
        {el === 'input' ? (
          <input type={type} autoComplete={k === 'email' ? 'email' : 'name'} {...common} />
        ) : (
          <textarea rows={5} {...common} />
        )}
        {err && (
          <p id={`${id}-err`} className="mt-1.5 text-sm text-red-500 dark:text-red-300">
            {err}
          </p>
        )}
      </div>
    )
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate scroll-mt-20 overflow-hidden py-section"
    >
      <div className="blob -bottom-40 left-1/3 -z-10 size-[32rem]" aria-hidden />
      <div className="mx-auto grid max-w-content gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-6" data-reveal>
          <p className="eyebrow">08 · Contact</p>
          <h2 id="contact-title" className="mt-3 text-h1 font-bold">
            Let's build <span className="text-accent-fg">something</span>.
          </h2>
          <p className="mt-5 max-w-md text-lead text-muted">
            Have a role, a project or just a question? Send a note and I'll get back to you.
          </p>
          <ul className="mt-8 space-y-3">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-3 text-lg break-all hover:text-accent-fg"
              >
                <Mail className="size-5 shrink-0 text-accent-fg" aria-hidden /> {profile.email}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-lg hover:text-accent-fg"
              >
                <ArrowUpRight className="size-5 text-accent-fg" aria-hidden /> LinkedIn
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="space-y-5 rounded-card border border-border bg-surface p-6 sm:p-8 lg:col-span-6"
          data-reveal
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {field('name', 'Name', 'input')}
            {field('email', 'Email', 'input', 'email')}
          </div>
          {field('message', 'Message', 'textarea')}
          <Magnetic>
            <Button type="submit" size="lg">
              <Send aria-hidden /> Send message
            </Button>
          </Magnetic>
        </form>
      </div>
    </section>
  )
}
