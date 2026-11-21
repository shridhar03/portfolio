import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from './app.js'
import { loadEnv } from './config/env.js'
import type { Mailer } from './lib/mailer.js'
import { loadSeedProjects } from './lib/projectsData.js'
import { createMemoryStores } from './stores/memory.js'

const env = loadEnv({ NODE_ENV: 'test' })

function setup(mailer: Mailer = { enabled: false, sendContactNotification: async () => false }) {
  const stores = createMemoryStores(loadSeedProjects())
  return { app: createApp({ env, stores, mailer }), stores, mailer }
}

describe('health', () => {
  it('GET /api/health returns ok + config summary', async () => {
    const res = await request(setup().app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ status: 'ok', storage: 'memory', email: 'disabled' })
  })
  it('locks CORS to the client origin', async () => {
    const res = await request(setup().app).get('/api/health').set('Origin', 'http://localhost:5173')
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173')
  })
  it('returns JSON 404 for unknown routes', async () => {
    expect((await request(setup().app).get('/api/nope')).status).toBe(404)
  })
})

describe('projects', () => {
  it('lists projects in order', async () => {
    const res = await request(setup().app).get('/api/projects')
    expect(res.status).toBe(200)
    expect(res.body.projects.map((p: { slug: string }) => p.slug).slice(0, 2)).toEqual([
      'optimal-solutionizer',
      'online-shopping-system',
    ])
  })
  it('gets one project by slug', async () => {
    const res = await request(setup().app).get('/api/projects/this-portfolio')
    expect(res.status).toBe(200)
    expect(res.body.project.title).toBe('This Portfolio')
  })
  it('404s an unknown slug', async () => {
    expect((await request(setup().app).get('/api/projects/nope')).status).toBe(404)
  })
})

describe('contact', () => {
  const valid = {
    name: 'Asha',
    email: 'Asha@Example.com',
    message: 'Love the portfolio, great work!',
  }
  let ctx: ReturnType<typeof setup>
  const send = vi.fn(async () => true)

  beforeEach(() => {
    send.mockClear()
    ctx = setup({ enabled: true, sendContactNotification: send })
  })

  it('validates, tags sentiment, saves and emails', async () => {
    const res = await request(ctx.app).post('/api/contact').send(valid)
    expect(res.status).toBe(201)
    const [saved] = ctx.stores._messages
    expect(saved).toMatchObject({ name: 'Asha', email: 'asha@example.com', emailed: true })
    expect(saved.sentiment.label).toBe('positive')
    expect(send).toHaveBeenCalledOnce()
  })

  it('rejects invalid input with field errors', async () => {
    const res = await request(ctx.app)
      .post('/api/contact')
      .send({ name: 'A', email: 'x', message: 'hi' })
    expect(res.status).toBe(400)
    expect(Object.keys(res.body.fields).sort()).toEqual(['email', 'message', 'name'])
    expect(ctx.stores._messages).toHaveLength(0)
  })

  it('silently drops honeypot submissions', async () => {
    const res = await request(ctx.app)
      .post('/api/contact')
      .send({ ...valid, website: 'spam.biz' })
    expect(res.status).toBe(201)
    expect(ctx.stores._messages).toHaveLength(0)
    expect(send).not.toHaveBeenCalled()
  })

  it('still saves when the email provider fails', async () => {
    send.mockRejectedValueOnce(new Error('down'))
    const res = await request(ctx.app).post('/api/contact').send(valid)
    expect(res.status).toBe(201)
    expect(ctx.stores._messages[0].emailed).toBe(false)
  })

  it('rate-limits after 5 submissions', async () => {
    for (let i = 0; i < 5; i++) await request(ctx.app).post('/api/contact').send(valid)
    expect((await request(ctx.app).post('/api/contact').send(valid)).status).toBe(429)
  })

  it('rejects malformed JSON', async () => {
    const res = await request(ctx.app)
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send('{bad')
    expect(res.status).toBe(400)
  })
})
