import { defineConfig, devices } from '@playwright/test'

/**
 * Smoke tests against the production build (prerendered HTML + hydration) and a real API in
 * offline mode: in-memory storage, no email, no Claude key, so a run never costs anything.
 * `npm run e2e` (add `-- --headed` to watch). Fresh servers on their own ports (API 4100, site
 * 4174) every run, so rate limits and dev servers never leak into results.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4174', trace: 'off' },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      // No --env-file: a local ANTHROPIC_API_KEY / MONGODB_URI is never picked up by tests.
      command: 'npx tsx server/src/index.ts',
      url: 'http://localhost:4100/api/health',
      env: { PORT: '4100', CLIENT_ORIGIN: 'http://localhost:4174' },
    },
    {
      command: 'npm run build -w client && npm run preview -w client',
      url: 'http://localhost:4174',
      env: { PORT: '4174', API_PROXY: 'http://localhost:4100' },
      timeout: 240_000,
    },
  ],
})
