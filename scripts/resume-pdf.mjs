// `npm run resume`: renders client/public/Shridhar_Chavan_Resume.pdf (the hero "Resume" button) from
// shared/profile.json + shared/projects.json, in the site's Monsoon Sahyadri style (light, print-safe).
// Facts come only from those files. No phone number, by design.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const font = (pkg, file) =>
  readFile(path.join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).then(
    (b) => `data:font/woff2;base64,${b.toString('base64')}`,
  )
const [display, body, mono] = await Promise.all([
  font('bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2'),
  font('geist', 'geist-latin-wght-normal.woff2'),
  font('geist-mono', 'geist-mono-latin-wght-normal.woff2'),
])
const data = JSON.parse(await readFile(path.join(root, 'shared/profile.json'), 'utf8'))
const projects = JSON.parse(await readFile(path.join(root, 'shared/projects.json'), 'utf8'))
  .filter((p) => p.status !== 'coming-soon')
  .sort((a, b) => a.order - b.order)
const { profile, experience, education, skillGroups, certifications, leadership } = data
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)
const linkedin = profile.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: D; src: url(${display}); font-weight: 200 800; }
@font-face { font-family: B; src: url(${body}); font-weight: 100 900; }
@font-face { font-family: M; src: url(${mono}); font-weight: 100 900; }
@page { size: A4; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: B; color: #0f1d17; background: #fffdf6; font-size: 9.6pt; line-height: 1.45; }
header { background: #0a1410; color: #e8efe9; padding: 26px 40px 0; position: relative; }
header h1 { font-family: D; font-weight: 800; font-size: 30pt; letter-spacing: -.02em; line-height: 1; }
header .tag { color: #9db3a6; margin-top: 6px; font-size: 10.5pt; }
header .contact { font-family: M; font-size: 8pt; letter-spacing: .04em; color: #f0b85a; margin-top: 10px; display: flex; gap: 18px; }
header svg { display: block; width: 100%; height: 44px; margin-top: 14px; }
main { padding: 18px 40px 28px; display: grid; grid-template-columns: 1fr 200px; gap: 26px; }
h2 { font-family: M; font-size: 8pt; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #8a4b00; margin: 14px 0 6px; padding-bottom: 4px; border-bottom: 1px solid #d6cfbb; }
section:first-child h2 { margin-top: 0; }
h3 { font-family: D; font-weight: 700; font-size: 11pt; }
.meta { color: #475a50; font-size: 8.8pt; }
.item { margin-bottom: 8px; }
ul.pts { margin: 3px 0 0 14px; }
.chips { color: #475a50; font-family: M; font-size: 7.6pt; margin-top: 2px; }
aside p, aside li { font-size: 8.8pt; }
aside ul { list-style: none; }
aside li { margin-bottom: 3px; }
.score { font-family: D; font-weight: 700; color: #8a4b00; }
</style></head><body>
<header>
  <h1>${esc(profile.name)}</h1>
  <p class="tag">${esc(profile.tagline)}</p>
  <p class="contact"><span>${esc(profile.location)}</span><span>${esc(profile.email)}</span><span>${esc(linkedin)}</span></p>
  <svg viewBox="0 0 1440 200" preserveAspectRatio="none"><path d="M0 118 76 112 138 72 262 66 302 92 362 88 424 52 562 46 604 80 682 84 742 60 862 57 904 94 982 97 1044 64 1182 60 1222 88 1302 91 1362 70 1440 72V200H0Z" fill="#dfe3d3"/><path d="M0 152 118 147 168 118 302 113 342 141 472 145 522 112 642 107 692 141 822 147 872 121 1012 116 1062 147 1182 151 1232 125 1342 120 1392 145 1440 147V200H0Z" fill="#fffdf6"/><path d="M424 52 562 46" stroke="#e8a33a" stroke-width="6" stroke-linecap="round"/></svg>
</header>
<main>
  <div>
    <section><h2>Profile</h2><p>${profile.about.map(esc).join(' ')}</p></section>
    <section><h2>Experience</h2>${experience
      .map(
        (e) =>
          `<div class="item"><h3>${esc(e.role)} · ${esc(e.company)}</h3><p class="meta">${esc(e.place)} · ${esc(e.period)}</p><ul class="pts">${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`,
      )
      .join('')}</section>
    <section><h2>Projects</h2>${projects
      .map(
        (p) =>
          `<div class="item"><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><p class="chips">${p.stack.map(esc).join(' · ')}</p></div>`,
      )
      .join('')}</section>
    <section><h2>Education</h2>${education
      .map(
        (e) =>
          `<div class="item"><h3>${esc(e.degree)} · <span class="score">${esc(e.score)}</span></h3><p class="meta">${esc(e.school)} · ${esc(e.period)}</p>${e.detail ? `<p class="meta">${esc(e.detail)}</p>` : ''}</div>`,
      )
      .join('')}</section>
  </div>
  <aside>
    <section><h2>Skills</h2>${skillGroups
      .map(
        (g) =>
          `<div class="item"><h3 style="font-size:9.5pt">${esc(g.title)}</h3><p>${g.items.map(esc).join(', ')}</p></div>`,
      )
      .join('')}</section>
    <section><h2>Certifications</h2><ul>${certifications.map((c) => `<li>${esc(c.name)} <span class="meta">· ${esc(c.issuer)}</span></li>`).join('')}</ul></section>
    <section><h2>Leadership & more</h2><ul>${leadership.map((l) => `<li>${esc(l.title)} <span class="meta">· ${esc(l.meta)}</span></li>`).join('')}</ul></section>
    <section><h2>Languages</h2><p>${profile.languages.map(esc).join(', ')}</p></section>
  </aside>
</main></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
const out = path.join(root, 'client/public/Shridhar_Chavan_Resume.pdf')
await page.pdf({ path: out, format: 'A4', printBackground: true })
await browser.close()
console.log(`[resume] ${path.relative(root, out)}`)
