# CLAUDE.md — Shridhar Chavan portfolio

Read this before touching the code. It records the decisions later sessions must stay consistent with.
The full product spec is in `PORTFOLIO_PROMPT.md` (the owner's brief). Do not invent resume facts:
only use content from that spec. Unknown project details stay as `TODO`.

## Monorepo layout

```
/                  npm workspaces root: ESLint (flat config), Prettier, concurrently
├─ client/         React 19 + Vite 8 + TypeScript + Tailwind v4
│  └─ src/
│     ├─ styles/       tokens.css (design tokens), index.css (base + component classes)
│     ├─ lib/          pure helpers (utils.ts → cn(), theme.ts). Unit-tested with Vitest
│     ├─ providers/    React context providers (ThemeProvider + theme-context hook)
│     ├─ components/
│     │  ├─ ui/        shadcn/ui-style primitives (Button…), restyled with our tokens
│     │  ├─ layout/    RootLayout, SiteHeader, (later) SiteFooter
│     │  └─ sections/  (Phase 2) Hero, About, Skills, Experience, Projects, Education…
│     ├─ content/      profile.ts (resume content) + projects.ts (typed wrapper over shared/projects.json)
│     ├─ pages/        route components: HomePage, ProjectPage, ChatPage, NotFoundPage
│     ├─ router.tsx    createBrowserRouter route table
│     └─ main.tsx      entry: fonts, CSS, providers
├─ server/         Express 5 + TypeScript (ESM, nodenext)
│  └─ src/
│     ├─ config/env.ts   Zod-validated env (add new vars here + .env.example)
│     ├─ app.ts          createApp(env): helmet, CORS (locked to CLIENT_ORIGIN), rate limit, routes
│     ├─ routes/         one Router per resource (health; later projects, contact, chat)
│     ├─ middleware/     error + 404 handlers
│     └─ index.ts        listen()
├─ shared/         projects.json: single source for project data (client reads it now; seeds MongoDB in Phase 4)
├─ scripts/        optimize-images.mjs (`npm run images`): assets-raw → client/public/img AVIF/WebP/JPEG
└─ assets-raw/     source photos (profile-hills.jpg, speaking.jpg). Optimised copies go to client/public/img in Phase 2
```

## Commands

`npm install` · `npm run dev` (client :5173 + API :4000; Vite proxies `/api`) · `npm run lint` ·
`npm run typecheck` · `npm test` · `npm run format` · `npm run build`

## Design tokens (client/src/styles/tokens.css)

Raw values are CSS variables on `[data-theme]`; Tailwind utilities map to them via `@theme inline`,
so always use the semantic utilities (`bg-surface`, `text-muted`, `text-accent-fg`…), never hex.

| Token      | Dark      | Light     | Use                                                             |
| ---------- | --------- | --------- | --------------------------------------------------------------- |
| bg         | `#070b16` | `#f6f3ec` | page background                                                 |
| surface    | `#0d1426` | `#ffffff` | cards                                                           |
| surface-2  | `#141d35` | `#ece6da` | hover, raised, chips                                            |
| border     | `#233152` | `#d8d0c0` | hairlines                                                       |
| fg         | `#e9edf6` | `#0b1222` | body text                                                       |
| muted      | `#9aa6c2` | `#4b5672` | secondary text                                                  |
| accent     | `#ffa31a` | `#f29a12` | fills: buttons, dots, highlights (decorative / large)           |
| accent-ink | `#1a0f00` | `#1a0f00` | text on an accent fill                                          |
| accent-fg  | `#ffb547` | `#944a00` | accent used as **text**; passes AA on bg, surface and surface-2 |
| navy-glow  | `#2b4c9a` | `#9db4e8` | secondary gradient-mesh blob                                    |

Measured contrast: fg/bg ≈16.8:1, muted/bg ≥6.6:1, accent-fg ≥5.2:1 in light and ≥11:1 in dark,
accent-ink on accent ≥8.4:1. Re-check if you change a value; WCAG AA is a hard requirement.

**Why saffron, not cyan:** the hero photo's navy jacket has a gold/saffron piping stripe, so the
accent comes straight out of the photo and the palette feels personal rather than generic "dev
cyan". Saffron also nods to Maharashtra, reads warm against midnight navy, and keeps high contrast
with dark ink text on filled buttons.

**Type:** display = Bricolage Grotesque Variable (expressive, variable optical size), body = Geist
Variable, mono = Geist Mono Variable (eyebrows, labels, code). All self-hosted via `@fontsource-variable`
(no third-party font requests, no FOIT). Fluid scale with `clamp()` tuned for 375→1440px:
`text-body`, `text-lead`, `text-h3`, `text-h2`, `text-h1`, `text-display`.

**Other tokens:** `rounded-card` (1.25rem), `rounded-pill`, `ease-out-expo`, `ease-in-out-quint`,
`max-w-content` (76rem), `--spacing-section`. Component classes in index.css: `.grain` (fixed
film-grain overlay), `.blob` (blurred gradient-mesh circle, colour via `--blob`), `.eyebrow`.

## Theme

Dark-first. `data-theme` on `<html>` is set before paint by an inline script in `index.html`
(reads `localStorage['sc-theme']`), then owned by `ThemeProvider`. Tailwind `dark:` variant targets
`[data-theme=dark]`. Use `useTheme()` from `providers/theme-context.ts`.

## Motion layer (Phase 3)

- Libraries: **Motion** (`motion/react`) for component/route animation, **GSAP + ScrollTrigger + SplitText** for scroll choreography and text splitting (import them from `@/lib/motion`, which registers plugins), **Lenis** smooth scroll driven by the GSAP ticker (`providers/SmoothScroll.tsx`), **React Three Fiber + drei** for the hero particle field.
- Reduced motion: `MotionConfig reducedMotion="user"` covers Motion; every GSAP block lives in `gsap.matchMedia()` under `MOTION_OK`; Lenis, custom cursor, magnetic pull, preloader and the 3D scene are all skipped; a global CSS guard zeroes CSS animations.
- Scroll animations are declarative: add `data-reveal`, `data-reveal-stagger`, `data-timeline` (+`-line`/`-node`), `data-pin="experience"` (+`data-step`), or `data-hscroll` (+`data-hscroll-track`) and `hooks/useScrollAnimations.ts` picks them up. Elements are only hidden from JS, so content is readable without it.
- Preloader (`components/motion/Preloader.tsx`) runs once per browser (`localStorage['sc-visited']`), under 1.5s; hero waits on `useIntro().introDone`.
- 3D: `LazyHeroScene` imports three.js only after idle, on ≥768px screens with WebGL2 and motion allowed. Keep it in its own chunk.
- Custom cursor + `<Magnetic>` only with a fine pointer (`hasFinePointer()`). Add `data-cursor="grow"` to non-link elements that should grow the ring.
- Route transitions: `AnimatePresence mode="wait"` in `RootLayout`, keyed by pathname, with a frozen outlet. Project title/cover share `layoutId`s between card and case study.
- Animate only `transform` and `opacity` (clip-path on the hero photo reveal is the one exception, a one-off on load).

## API (Phase 4)

- `createApp({ env, stores, mailer })` takes its dependencies, so tests inject in-memory stores and a fake mailer. Storage lives behind `stores/types.ts` (`Stores`): `stores/mongo.ts` (Mongoose) in prod, `stores/memory.ts` for tests and DB-less local dev.
- Collections: `projects` (seeded from `shared/projects.json` with `npm run seed -w server`, upsert by slug, `--prune` to delete removed ones), `messages` (contact form, with `sentiment {label, score}` and `emailed`), `chatLogs` (Phase 5, anonymised, 90-day TTL).
- Endpoints: `GET /api/health` (reports storage + email mode), `GET /api/projects`, `GET /api/projects/:slug`, `POST /api/contact` (Zod-validated, honeypot field `website`, 5 per 15 min per IP, wink-nlp sentiment, Resend email with reply-to = visitor; email failure never fails the request).
- Client reads projects through `hooks/useProjects.ts`: bundled JSON for first paint, then the API. All fetches go through `lib/api.ts` (`VITE_API_URL` base, timeout, `ApiError` with field errors).

## Conventions

- TypeScript strict everywhere. Import client code via `@/…`. Server imports use `.js` suffixes (nodenext ESM).
- Named exports for components; one component per file, PascalCase filename. Hooks/contexts in separate files (react-refresh rule).
- Prettier: no semicolons, single quotes, trailing commas, width 100, Tailwind class sorting. Run `npm run format`.
- Motion rules (Phase 3+): animate only `transform`/`opacity`; every animation must have a
  `prefers-reduced-motion` fallback (a global CSS guard already exists); never block reading content;
  lazy-load the 3D scene.
- Accessibility: visible `:focus-visible` ring (accent), skip link, `aria-hidden` on decorative elements and icons, real alt text on photos.
- Secrets only in server `.env` (see `.env.example`). Client env vars must be `VITE_*` and non-secret.
- Phone number never appears on the public site.
- All visible resume content comes from `client/src/content/*` and `shared/projects.json`; edit there, not in components. Unknown details are `TODO` strings and render as placeholders.
- Photos go through `<Picture>` (AVIF → WebP → JPEG, explicit width/height to avoid layout shift). The hero image is preloaded in `index.html`.
- Add a Vitest test next to any new pure helper (`*.test.ts`) and a supertest test for each API route.
