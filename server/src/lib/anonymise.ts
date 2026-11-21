import { createHash } from 'node:crypto'

const EMAIL = /[\w.+-]+@[\w-]+(\.[\w-]+)+/g
const PHONE = /(\+?\d[\d\s().-]{7,}\d)/g
const URL_RE = /https?:\/\/\S+/g

/** Strips emails, phone numbers and URLs before anything is logged. */
export function scrub(text: string) {
  return text.replace(EMAIL, '[email]').replace(PHONE, '[phone]').replace(URL_RE, '[url]')
}

/** Daily-rotating, salted hash of the client IP: groups a visit's questions without storing the IP. */
export function sessionHash(ip: string, salt: string, now = new Date()) {
  const day = now.toISOString().slice(0, 10)
  return createHash('sha256').update(`${salt}:${day}:${ip}`).digest('hex').slice(0, 16)
}
