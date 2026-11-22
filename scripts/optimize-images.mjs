// Generates responsive AVIF/WebP (+ JPEG fallback) from assets-raw/ into client/public/img/.
// Run: npm run images
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'client/public/img')

const jobs = [
  // Hero portrait, cropped to 4:5 around the upper body.
  {
    src: 'profile-hills.jpg',
    name: 'profile',
    crop: { left: 0, top: 180, width: 720, height: 900 },
    widths: [360, 540, 720],
  },
  { src: 'speaking.jpg', name: 'speaking', widths: [480, 800, 1179] },
  // v3 hero: the same portrait with the background removed (rembg, u2net_human_seg), so it can
  // stand in front of the giant name. Transparent, so the fallback is PNG, not JPEG.
  { src: 'profile-cutout.png', name: 'cutout', widths: [320, 480, 645], alpha: true },
]

await mkdir(outDir, { recursive: true })
for (const job of jobs) {
  for (const w of job.widths) {
    let img = sharp(path.join(root, 'assets-raw', job.src))
    if (job.crop) img = img.extract(job.crop)
    img = img.resize({ width: w, withoutEnlargement: true })
    await Promise.all([
      img
        .clone()
        .avif({ quality: 55, effort: 6 })
        .toFile(path.join(outDir, `${job.name}-${w}.avif`)),
      img
        .clone()
        .webp({ quality: 78 })
        .toFile(path.join(outDir, `${job.name}-${w}.webp`)),
      job.alpha
        ? img
            .clone()
            .png({ palette: true, quality: 85, effort: 10 })
            .toFile(path.join(outDir, `${job.name}-${w}.png`))
        : img
            .clone()
            .jpeg({ quality: 80, mozjpeg: true })
            .toFile(path.join(outDir, `${job.name}-${w}.jpg`)),
    ])
  }
  console.log('✓', job.name)
}
