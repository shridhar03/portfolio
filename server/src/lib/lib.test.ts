import { describe, expect, it } from 'vitest'
import { renderContactEmail } from './mailer.js'
import { loadSeedProjects } from './projectsData.js'
import { tagSentiment } from './sentiment.js'
import { ProjectModel } from '../models/Project.js'
import { MessageModel } from '../models/Message.js'

describe('tagSentiment', () => {
  it('labels positive, negative and neutral text', () => {
    expect(tagSentiment('I love your portfolio, great work!').label).toBe('positive')
    expect(tagSentiment('This is terrible and broken.').label).toBe('negative')
    expect(tagSentiment('Can we schedule a call next week?').label).toBe('neutral')
  })
})

describe('renderContactEmail', () => {
  it('escapes HTML from the visitor', () => {
    const { html } = renderContactEmail({
      id: '1',
      name: '<script>x</script>',
      email: 'a@b.co',
      message: '<img src=x onerror=alert(1)>',
      sentiment: { label: 'neutral', score: 0 },
      emailed: false,
      createdAt: new Date(),
    })
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img')
  })
})

describe('seed data + schemas', () => {
  it('shared/projects.json is valid and fits the Mongoose schema', () => {
    const projects = loadSeedProjects()
    expect(projects.length).toBeGreaterThanOrEqual(5)
    for (const p of projects) expect(new ProjectModel(p).validateSync()).toBeUndefined()
  })
  it('message schema enforces a sentiment label', () => {
    const err = new MessageModel({ name: 'A', email: 'a@b.co', message: 'hi' }).validateSync()
    expect(err?.errors['sentiment.label']).toBeDefined()
  })
})
