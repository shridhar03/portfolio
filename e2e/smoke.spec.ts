import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/** Returning visitor (no preloader) unless a test opts out; collects console errors. */
async function visit(
  page: Page,
  path: string,
  storage: Record<string, string> = { 'sc-visited': '1' },
) {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.addInitScript((s) => {
    for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v)
  }, storage)
  await page.goto(path)
  // The app boots after the hero paints; RootLayout marks <html data-ready> once hydrated.
  await page.waitForSelector('html[data-ready]', { state: 'attached' })
  // Let entrance animations settle so contrast is measured on final colours.
  await page.waitForFunction(() =>
    [...document.querySelectorAll<HTMLElement>('[data-hero], [data-hero-fade]')].every(
      (el) => getComputedStyle(el).opacity === '1' && getComputedStyle(el).visibility === 'visible',
    ),
  )
  return errors
}

async function axe(page: Page) {
  // Measure contrast on final colours: wait until nothing on screen is mid-fade (GSAP/Motion set
  // inline opacity).
  await page.waitForFunction(() =>
    [...document.querySelectorAll<HTMLElement>('[style*="opacity"]')].every((el) => {
      const o = Number(getComputedStyle(el).opacity)
      const r = el.getBoundingClientRect()
      const offscreen = r.bottom < 0 || r.top > innerHeight // e.g. scroll-scrubbed experience steps
      return offscreen || o === 0 || o === 1 || el.closest('[aria-hidden="true"]')
    }),
  )
  // The film grain and WebGL canvas are decorative; everything else must pass WCAG 2.2 AA.
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze()
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([])
}

test('prerendered HTML carries content and SEO tags without JavaScript', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('Shridhar')
  expect(html).toMatch(/<title[^>]*>Shridhar Chavan · MERN Developer<\/title>/)
  expect(html).toMatch(/<meta[^>]+name="description"/)
  expect(html).toMatch(/<link[^>]+rel="canonical"/)
  expect(html).toMatch(/<meta[^>]+property="og:image"/)
  expect(html).toContain('application/ld+json')
  expect(html).not.toMatch(/\+91|telephone/i) // phone number stays off the public site

  const project = await (await request.get('/projects/this-portfolio')).text()
  expect(project).toMatch(/<title[^>]*>This Portfolio · Shridhar Chavan<\/title>/)
  expect((await request.get('/robots.txt')).ok()).toBe(true)
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/projects/this-portfolio')
  expect((await request.get('/definitely-not-here')).status()).toBe(404)
})

test('home: first visit plays the intro, then the hero is readable and accessible', async ({
  page,
}) => {
  const errors = await visit(page, '/', {})
  await expect(page.getByRole('heading', { level: 1, name: /Shridhar\s*Chavan/ })).toBeVisible()
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/, { timeout: 5000 })
  await expect(page).toHaveTitle('Shridhar Chavan · MERN Developer')
  await axe(page)
  expect(errors).toEqual([])
})

test('home sections and contact form', async ({ page }) => {
  const errors = await visit(page, '/#contact')
  for (const id of ['about', 'skills', 'experience', 'projects', 'education', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeAttached()
  }
  const send = page.getByRole('button', { name: 'Send message' })
  await send.click()
  await expect(page.locator('#contact-name')).toBeFocused() // focus moves to the first error
  await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true')

  await page.locator('#contact-name').fill('Playwright Smoke')
  await page.locator('#contact-email').fill('smoke@example.com')
  await page
    .locator('#contact-message')
    .fill('Hello from the smoke test, this is a friendly message.')
  await send.click()
  const thanks = page.getByRole('status').filter({ hasText: 'Thanks!' })
  await expect(thanks).toBeVisible()
  await expect(thanks.locator('span').first()).toHaveCSS('opacity', '1') // fade-in finished
  await axe(page)
  expect(errors).toEqual([])
})

test('project card opens its case study', async ({ page }) => {
  const errors = await visit(page, '/#projects')
  await page.locator('a[href="/projects/this-portfolio"]').first().click()
  await expect(page).toHaveURL(/\/projects\/this-portfolio$/)
  await expect(page.getByRole('heading', { level: 1, name: 'This Portfolio' })).toBeVisible()
  await expect(page).toHaveTitle('This Portfolio · Shridhar Chavan')
  await axe(page)
  expect(errors).toEqual([])
})

test('theme toggle switches and persists', async ({ page }) => {
  await visit(page, '/')
  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await page.waitForSelector('html[data-ready]', { state: 'attached' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await axe(page) // light theme contrast
})

test('chat answers from the resume (offline mode)', async ({ page }) => {
  const errors = await visit(page, '/chat')
  await expect(page).toHaveTitle('Ask Shridhar · Shridhar Chavan')
  const input = page.getByLabel('Ask a question about Shridhar')
  await input.fill('What are his skills?')
  await input.press('Enter')
  await expect(page.getByText('What are his skills?')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start a new conversation' })).toBeVisible({
    timeout: 20_000,
  })
  await axe(page)
  expect(errors).toEqual([])
})

test('command palette opens with the keyboard and runs a command', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut is a desktop affordance')
  await visit(page, '/')
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog', { name: 'Command palette' })
  await expect(dialog).toBeVisible()
  await page.keyboard.type('toggle theme')
  await page.keyboard.press('Enter')
  await expect(dialog).toBeHidden()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('unknown routes show the 404 page', async ({ page }) => {
  await visit(page, '/no-such-page')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page).toHaveTitle(/Page not found/)
  await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible()
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('everything is visible without animation and nothing is hidden', async ({ page }) => {
    const errors = await visit(page, '/', {})
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('html')).not.toHaveClass(/intro-pending|motion-ok/)
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible()
    expect(errors).toEqual([])
  })
})
