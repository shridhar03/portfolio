import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from './app.js'
import { loadEnv } from './config/env.js'
import type { ChatProvider } from './lib/llm.js'
import type { Mailer } from './lib/mailer.js'
import { loadSeedProjects } from './lib/projectsData.js'
import { createMemoryStores } from './stores/memory.js'

const env = loadEnv({ NODE_ENV: 'test' })

const echoProvider: ChatProvider = {
  kind: 'offline',
  async *streamReply({ messages }) {
    yield { text: 'You asked: ' }
    yield { text: messages.at(-1)!.content }
  },
}

function setup(
  mailer: Mailer = { enabled: false, sendContactNotification: async () => false },
  provider: ChatProvider = echoProvider,
) {
  const stores = createMemoryStores(loadSeedProjects())
  return {
    app: createApp({ env, stores, mailer, chat: { provider, system: 'test system' } }),
    stores,
    mailer,
  }
}

/** Parses an SSE body into its JSON events. */
const events = (body: string) =>
  body
    .split('\n\n')
    .filter((c) => c.startsWith('data: '))
    .map((c) => JSON.parse(c.slice(6)))

describe('health', () => {
  it('GET /api/health returns ok + config summary', async () => {
    const res = await request(setup().app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      status: 'ok',
      storage: 'memory',
      email: 'disabled',
      chat: 'offline',
    })
  })
  it('locks CORS to the client origin', async () => {
    const res = await request(setup().app).get('/api/health').set('Origin', 'http://localhost:5173')
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173')
  })
  it('allows each origin in a comma-separated CLIENT_ORIGIN and nothing else', async () => {
    const multi = loadEnv({
      NODE_ENV: 'test',
      CLIENT_ORIGIN: 'https://shridhar.dev, https://portfolio.vercel.app/',
    })
    expect(multi.CLIENT_ORIGIN).toEqual(['https://shridhar.dev', 'https://portfolio.vercel.app'])
    const app = createApp({
      env: multi,
      stores: createMemoryStores(loadSeedProjects()),
      mailer: { enabled: false, sendContactNotification: async () => false },
      chat: { provider: echoProvider, system: 'test' },
    })
    const ok = await request(app).get('/api/health').set('Origin', 'https://portfolio.vercel.app')
    expect(ok.headers['access-control-allow-origin']).toBe('https://portfolio.vercel.app')
    const bad = await request(app).get('/api/health').set('Origin', 'https://evil.example')
    expect(bad.headers['access-control-allow-origin']).toBeUndefined()
  })
  it('rejects a malformed CLIENT_ORIGIN', () => {
    expect(() => loadEnv({ NODE_ENV: 'test', CLIENT_ORIGIN: 'not a url' })).toThrow()
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

describe('chat', () => {
  const ask = (app: ReturnType<typeof setup>['app'], content: string) =>
    request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content }] })
      .buffer(true)
      .parse((res, cb) => {
        let data = ''
        res.on('data', (c: Buffer) => (data += c.toString()))
        res.on('end', () => cb(null, data))
      })

  it('streams meta, deltas and done as server-sent events', async () => {
    const ctx = setup()
    const res = await ask(ctx.app, 'What projects has he built?')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/event-stream')
    const ev = events(res.body as string)
    expect(ev[0]).toEqual({ type: 'meta', intent: 'projects', mode: 'offline' })
    expect(
      ev
        .filter((e) => e.type === 'delta')
        .map((e) => e.text)
        .join(''),
    ).toBe('You asked: What projects has he built?')
    expect(ev.at(-1)).toEqual({ type: 'done' })
  })

  it('refuses off-topic requests without calling the model', async () => {
    const provider = { kind: 'anthropic' as const, streamReply: vi.fn() }
    const ctx = setup(undefined, provider as unknown as ChatProvider)
    const res = await ask(ctx.app, 'Write me a poem about the sea')
    const ev = events(res.body as string)
    expect(ev[0].intent).toBe('off-topic')
    expect(ev[1].text).toMatch(/can't help/)
    expect(provider.streamReply).not.toHaveBeenCalled()
  })

  it('logs anonymised Q&A', async () => {
    const ctx = setup()
    await ask(ctx.app, 'Can I email him at me@corp.com?')
    await new Promise((r) => setTimeout(r, 10))
    const [log] = ctx.stores._chatLogs
    expect(log.question).toBe('Can I email him at [email]?')
    expect(log.sessionHash).toHaveLength(16)
    expect(log.intent).toBe('contact')
  })

  it('sends an error event if the provider fails mid-stream', async () => {
    const failing: ChatProvider = {
      kind: 'anthropic',
      // eslint-disable-next-line require-yield
      async *streamReply() {
        throw new Error('boom')
      },
    }
    const res = await ask(setup(undefined, failing).app, 'Tell me about his skills')
    expect(events(res.body as string).at(-1).type).toBe('error')
  })

  it.each([
    [{ messages: [] }],
    [{ messages: [{ role: 'assistant', content: 'hi' }] }],
    [{ messages: [{ role: 'user', content: 'x'.repeat(1001) }] }],
    [{ messages: Array.from({ length: 13 }, () => ({ role: 'user', content: 'hi' })) }],
  ])('rejects invalid payloads', async (body) => {
    expect((await request(setup().app).post('/api/chat').send(body)).status).toBe(400)
  })

  it('rate-limits after 20 questions', async () => {
    const ctx = setup()
    for (let i = 0; i < 20; i++) await ask(ctx.app, 'hi')
    expect((await ask(ctx.app, 'hi')).status).toBe(429)
  })
})
