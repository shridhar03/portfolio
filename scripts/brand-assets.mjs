// `npm run brand`: renders the Open Graph card (client/public/og.jpg, 1200×630), the app icons and
// site.webmanifest with Playwright, using the real fonts and tokens so they match the site.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'client/public')
const font = (pkg, file) =>
  readFile(path.join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).then(
    (b) => `data:font/woff2;base64,${b.toString('base64')}`,
  )
const [display, body, mono, photo] = await Promise.all([
  font('bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2'),
  font('geist', 'geist-latin-wght-normal.woff2'),
  font('geist-mono', 'geist-mono-latin-wght-normal.woff2'),
  readFile(path.join(pub, 'img/profile-720.jpg')).then(
    (b) => `data:image/jpeg;base64,${b.toString('base64')}`,
  ),
])
const profile = JSON.parse(await readFile(path.join(root, 'shared/profile.json'), 'utf8')).profile

const base = `
@font-face { font-family: D; src: url(${display}); font-weight: 200 800; }
@font-face { font-family: B; src: url(${body}); font-weight: 100 900; }
@font-face { font-family: M; src: url(${mono}); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { background: #070b16; color: #e9edf6; font-family: B; overflow: hidden; }
.accent { color: #ffa31a; }`

const og = `<style>${base}
body { width: 1200px; height: 630px; position: relative; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .45; }
.copy { position: absolute; left: 72px; top: 0; bottom: 0; width: 640px; display: flex; flex-direction: column; justify-content: center; }
.eyebrow { font-family: M; font-size: 20px; letter-spacing: .2em; text-transform: uppercase; color: #ffb547; }
h1 { font-family: D; font-weight: 800; font-size: 112px; line-height: .92; letter-spacing: -.03em; margin-top: 24px; }
p { font-size: 28px; color: #9aa6c2; margin-top: 32px; line-height: 1.35; text-wrap: balance; }
.photo { position: absolute; right: 72px; top: 56px; width: 380px; height: 520px; border-radius: 999px 999px 28px 28px; overflow: hidden; border: 2px solid #233152; }
.photo img { width: 100%; height: 100%; object-fit: cover; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: #ffa31a; }
</style>
<div class="blob" style="width:520px;height:520px;left:-160px;top:-200px;background:#ffa31a"></div>
<div class="blob" style="width:620px;height:620px;right:-220px;bottom:-260px;background:#2b4c9a"></div>
<div class="copy">
  <div class="eyebrow">${profile.location}</div>
  <h1>Shridhar<br>Chavan<span class="accent">.</span></h1>
  <p>${profile.tagline}</p>
</div>
<div class="photo"><img src="${photo}" alt=""></div>
<div class="bar"></div>`

const icon = (size) => `<style>${base}
body { width: ${size}px; height: ${size}px; display: grid; place-items: center; }
span { font-family: D; font-weight: 800; font-size: ${size * 0.44}px; letter-spacing: -.04em; }
</style><span>SC<span class="accent">.</span></span>`

const browser = await chromium.launch()
const page = await browser.newPage()
const shot = async (html, width, height, file) => {
  await page.setViewportSize({ width, height })
  await page.setContent(html)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({
    path: path.join(pub, file),
    ...(file.endsWith('.jpg') ? { type: 'jpeg', quality: 86 } : { type: 'png' }),
  })
  console.log(`[brand] ${file}`)
}
await shot(og, 1200, 630, 'og.jpg')
await shot(icon(180), 180, 180, 'apple-touch-icon.png')
await shot(icon(192), 192, 192, 'icon-192.png')
await shot(icon(512), 512, 512, 'icon-512.png')
await browser.close()

await writeFile(
  path.join(pub, 'site.webmanifest'),
  JSON.stringify(
    {
      name: profile.shortName,
      short_name: 'Shridhar',
      start_url: '/',
      display: 'standalone',
      background_color: '#070b16',
      theme_color: '#070b16',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log('[brand] site.webmanifest')
