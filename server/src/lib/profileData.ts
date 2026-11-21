import { readFileSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

const Profile = z.object({
  profile: z.object({
    name: z.string(),
    shortName: z.string(),
    tagline: z.string(),
    roles: z.array(z.string()),
    location: z.string(),
    email: z.string(),
    linkedin: z.string(),
    resumePdf: z.string(),
    about: z.array(z.string()),
    languages: z.array(z.string()),
  }),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      place: z.string(),
      period: z.string(),
      points: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      school: z.string(),
      period: z.string(),
      score: z.string(),
      detail: z.string().optional(),
    }),
  ),
  skillGroups: z.array(z.object({ title: z.string(), items: z.array(z.string()) })),
  certifications: z.array(z.object({ name: z.string(), issuer: z.string() })),
  leadership: z.array(z.object({ title: z.string(), meta: z.string(), kind: z.string() })),
})
export type ProfileData = z.infer<typeof Profile>

export function loadProfile(
  file = path.resolve(import.meta.dirname, '../../../shared/profile.json'),
) {
  return Profile.parse(JSON.parse(readFileSync(file, 'utf8')))
}
