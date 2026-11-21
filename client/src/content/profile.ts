// Resume content lives in shared/profile.json so the server's chatbot uses the exact same facts.
// Source: PORTFOLIO_PROMPT.md. Do not invent facts.
import data from '../../../shared/profile.json'

type Span = 'wide' | 'tall' | 'normal'

export const profile = data.profile
export const experience = data.experience
export const education = data.education as {
  degree: string
  school: string
  period: string
  score: string
  detail?: string
}[]
export const skillGroups = data.skillGroups as { title: string; items: string[]; span: Span }[]
export const certifications = data.certifications
export const leadership = data.leadership

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]
