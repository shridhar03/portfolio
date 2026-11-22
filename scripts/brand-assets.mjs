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
  readFile(path.join(pub, 'fonts/anton-subset.woff2')).then(
    (b) => `data:font/woff2;base64,${b.toString('base64')}`,
  ),
  font('geist', 'geist-latin-wght-normal.woff2'),
  font('geist-mono', 'geist-mono-latin-wght-normal.woff2'),
  readFile(path.join(pub, 'img/cutout-645.png')).then(
    (b) => `data:image/png;base64,${b.toString('base64')}`,
  ),
])
const profile = JSON.parse(await readFile(path.join(root, 'shared/profile.json'), 'utf8')).profile

const base = `
@font-face { font-family: D; src: url(${display}); font-weight: 100 900; }
@font-face { font-family: B; src: url(${body}); font-weight: 100 900; }
@font-face { font-family: M; src: url(${mono}); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { background: #09090a; color: #f5f2ef; font-family: B; overflow: hidden; }
.accent { color: #d92b20; }`

const og = `<style>${base}
body { width: 1200px; height: 630px; position: relative; }
.glow { position: absolute; left: 600px; top: 330px; width: 900px; height: 900px; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(closest-side, rgba(217,43,32,.45), transparent); }
.mega { position: absolute; left: 50%; top: 18px; transform: translateX(-50%); font-family: D; font-size: 250px; line-height: .86; white-space: nowrap; background: linear-gradient(180deg, #ff4b3a, #d92b20 45%, #5a0b06); -webkit-background-clip: text; color: transparent; }
.photo { position: absolute; left: 50%; bottom: 0; width: 330px; transform: translateX(-50%); -webkit-mask-image: linear-gradient(black 75%, transparent); }
.copy { position: absolute; left: 64px; bottom: 64px; width: 360px; }
.eyebrow { font-family: M; font-size: 18px; letter-spacing: .2em; text-transform: uppercase; color: #ff6a5c; }
h1 { font-family: D; font-size: 84px; line-height: .95; text-transform: uppercase; margin-top: 14px; }
p { font-size: 22px; color: #a9a4a0; margin-top: 16px; line-height: 1.35; position: absolute; right: 64px; bottom: 64px; width: 300px; text-align: right; }
.ridge { position: absolute; left: 0; right: 0; bottom: 120px; width: 1200px; height: 110px; opacity: .6; }
</style>
<div class="glow"></div>
<div class="mega">SHRIDHAR</div>
<svg class="ridge" viewBox="0 0 1440 200" preserveAspectRatio="none"><path d="M0 118 76 112 138 72 262 66 302 92 362 88 424 52 562 46 604 80 682 84 742 60 862 57 904 94 982 97 1044 64 1182 60 1222 88 1302 91 1362 70 1440 72V200H0Z" fill="#1a0d0c"/><path d="M0 152 118 147 168 118 302 113 342 141 472 145 522 112 642 107 692 141 822 147 872 121 1012 116 1062 147 1182 151 1232 125 1342 120 1392 145 1440 147V200H0Z" fill="#110909"/></svg>
<img class="photo" src="${photo}" alt="">
<div class="copy">
  <div class="eyebrow">${profile.location.split(',')[0]} · India</div>
  <h1>Shridhar<br>Chavan<span class="accent">.</span></h1>
</div>
<p>${profile.tagline}</p>`

// LinkedIn profile banner (1584×396). LinkedIn covers the bottom-left with the profile photo, so
// the copy sits on the right half. Saved to assets/ (not served by the site).
const banner = `<style>${base}
body { width: 1584px; height: 396px; position: relative; }
.blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: .4; }
.copy { position: absolute; right: 96px; top: 70px; text-align: right; }
.eyebrow { font-family: M; font-size: 18px; letter-spacing: .22em; text-transform: uppercase; color: #ff6a5c; }
h1 { font-family: D; font-size: 84px; line-height: 1; text-transform: uppercase; margin-top: 14px; }
p { font-size: 24px; color: #a9a4a0; margin-top: 16px; }
.ridge { position: absolute; left: 0; right: 0; bottom: 0; width: 1584px; height: 120px; }
</style>
<div class="blob" style="width:520px;height:520px;right:-120px;top:-260px;background:#d92b20"></div>
<div class="blob" style="width:620px;height:520px;left:-200px;bottom:-300px;background:#6b120c"></div>
<div class="copy">
  <div class="eyebrow">${profile.location}</div>
  <h1>Shridhar Chavan</h1>
  <p>${profile.tagline}</p>
</div>
<svg class="ridge" viewBox="0 0 1440 200" preserveAspectRatio="none"><path d="M0 118 76 112 138 72 262 66 302 92 362 88 424 52 562 46 604 80 682 84 742 60 862 57 904 94 982 97 1044 64 1182 60 1222 88 1302 91 1362 70 1440 72V200H0Z" fill="#1a0d0c"/><path d="M0 152 118 147 168 118 302 113 342 141 472 145 522 112 642 107 692 141 822 147 872 121 1012 116 1062 147 1182 151 1232 125 1342 120 1392 145 1440 147V200H0Z" fill="#110909"/></svg>`

const icon = (size) => `<style>${base}
body { width: ${size}px; height: ${size}px; display: grid; place-items: center; background: #d92b20; }
span { font-family: D; font-size: ${size * 0.5}px; color: #fff; }
</style><span>SC</span>`

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
await shot(banner, 1584, 396, '../../assets/linkedin-banner.png')
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
      background_color: '#09090a',
      theme_color: '#09090a',
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
