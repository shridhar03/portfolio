export type ContactDraft = { name: string; email: string; message: string }

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(d: ContactDraft) {
  const errors: Partial<Record<keyof ContactDraft, string>> = {}
  if (d.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(d.email.trim())) errors.email = 'Please enter a valid email address.'
  if (d.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

/** Fallback when the API is unreachable: open the visitor's mail app with the draft. */
export function mailtoHref(to: string, d: ContactDraft) {
  const subject = `Portfolio enquiry from ${d.name.trim()}`
  const body = `${d.message.trim()}\n\n${d.name.trim()} <${d.email.trim()}>`
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
