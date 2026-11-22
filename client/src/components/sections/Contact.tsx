import { ArrowUpRight, CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { LazyHeroScene } from '@/components/motion/LazyHeroScene'
import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/button'
import { profile } from '@/content/profile'
import { ApiError, api } from '@/lib/api'
import { mailtoHref, validateContact, type ContactDraft } from '@/lib/contact'
import { cn } from '@/lib/utils'

const fieldClass =
  'w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-fg placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none'

export function Contact() {
  const empty: ContactDraft = { name: '', email: '', message: '' }
  const [draft, setDraft] = useState<ContactDraft>(empty)
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [honeypot, setHoneypot] = useState('')

  const update = (k: keyof ContactDraft) => (e: { target: { value: string } }) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }))

  // Move focus to the first invalid field so keyboard and screen-reader users land on the problem.
  const focusFirstError = (errs: Partial<Record<keyof ContactDraft, string>>) => {
    const first = (['name', 'email', 'message'] as const).find((k) => errs[k])
    if (first) document.getElementById(`contact-${first}`)?.focus()
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validateContact(draft)
    setErrors(errs)
    if (Object.keys(errs).length) return focusFirstError(errs)
    setStatus('sending')
    try {
      await api('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ ...draft, website: honeypot }),
      })
      setStatus('sent')
      setDraft(empty)
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && err.fields) {
        const fieldErrors = Object.fromEntries(
          Object.entries(err.fields).map(([k, v]) => [k, v?.[0]]),
        ) as typeof errs
        setErrors(fieldErrors)
        focusFirstError(fieldErrors)
        setStatus('idle')
      } else setStatus('error')
    }
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
      className: cn(fieldClass, err && 'border-red-600 dark:border-red-400'),
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
          <p id={`${id}-err`} className="mt-1.5 text-sm text-red-700 dark:text-red-300">
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
      <LazyHeroScene className="top-1/2 left-[8%] size-[34rem] -translate-y-1/2" />
      <div className="mx-auto grid max-w-content gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-6" data-reveal>
          <p className="eyebrow">08 · Contact</p>
          <h2
            id="contact-title"
            className="slant mt-3 text-[clamp(3rem,2rem+4.6vw,6.5rem)]"
            data-tilt
          >
            Let&apos;s build
            <br />
            <span className="text-accent-fg">it together.</span>
          </h2>
          <p className="mt-5 max-w-md text-lead text-muted">
            A job, freelance work, or a question about something on this page: send it here, or
            email me directly.
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
          aria-busy={status === 'sending'}
          className="relative space-y-5 rounded-card border border-border bg-surface p-6 sm:p-8 lg:col-span-6"
          data-reveal
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {field('name', 'Name', 'input')}
            {field('email', 'Email', 'input', 'email')}
          </div>
          {field('message', 'Message', 'textarea')}
          {/* Honeypot: hidden from people and assistive tech, bots tend to fill it */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button type="submit" size="lg" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <Loader2 className="animate-spin" aria-hidden />
                ) : (
                  <Send aria-hidden />
                )}
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </Button>
            </Magnetic>
            <p role="status" aria-live="polite" className="text-sm">
              <AnimatePresence mode="wait">
                {status === 'sent' && (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-2 text-fg"
                  >
                    <CheckCircle2 className="size-4 text-accent-fg" aria-hidden /> Thanks! Your
                    message is on its way.
                  </motion.span>
                )}
                {status === 'error' && (
                  <motion.span
                    key="err"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-600 dark:text-red-300"
                  >
                    Couldn't send right now.{' '}
                    <a
                      href={mailtoHref(profile.email, draft)}
                      className="underline underline-offset-4"
                    >
                      Email me instead
                    </a>
                    .
                  </motion.span>
                )}
              </AnimatePresence>
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
