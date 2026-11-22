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
│     ├─ routes.tsx    route table (Home eager, other pages lazy); router.tsx = createBrowserRouter(routes)
│     ├─ AppProviders.tsx  every provider, shared by main.tsx and entry-server.tsx
│     ├─ entry-server.tsx  build-time render(path) used by the prerender
│     └─ main.tsx      entry: fonts, CSS; hydrates the prerendered HTML (createRoot in dev)
│  └─ scripts/     prerender.mjs (static HTML per route + sitemap/robots), serve.mjs (`preview`)
├─ server/         Express 5 + TypeScript (ESM, nodenext)
│  └─ src/
│     ├─ config/env.ts   Zod-validated env (add new vars here + .env.example)
│     ├─ app.ts          createApp(env): helmet, CORS (locked to CLIENT_ORIGIN), rate limit, routes
│     ├─ routes/         one Router per resource (health; later projects, contact, chat)
│     ├─ middleware/     error + 404 handlers
│     └─ index.ts        listen()
├─ shared/         projects.json (seeds MongoDB) + profile.json (resume facts for the UI and the chatbot)
├─ scripts/        optimize-images.mjs (`npm run images`): assets-raw → client/public/img AVIF/WebP/JPEG;
│                  brand-assets.mjs (`npm run brand`): og.jpg, app icons, site.webmanifest via Playwright
├─ e2e/            Playwright smoke tests + axe (playwright.config.ts at the root)
└─ assets-raw/     source photos (profile-hills.jpg, speaking.jpg). Optimised copies go to client/public/img in Phase 2
```

## Commands

`npm install` · `npm run dev` (client :5173 + API :4000; Vite proxies `/api`) · `npm run lint` ·
`npm run typecheck` · `npm test` · `npm run format` · `npm run build` · `npm run e2e` (builds, starts
fresh servers on :4100/:4174, runs desktop + mobile) · `npm run preview -w client` (serves dist like
the static host, :4173 → API :4000) · `npm run brand` (regenerate OG image and icons)

## Design tokens (client/src/styles/tokens.css)

Raw values are CSS variables on `[data-theme]`; Tailwind utilities map to them via `@theme inline`,
so always use the semantic utilities (`bg-surface`, `text-muted`, `text-accent-fg`…), never hex.

| Token      | Dark      | Light     | Use                                                             |
| ---------- | --------- | --------- | --------------------------------------------------------------- |
| bg         | `#09090a` | `#f4f1ec` | page background                                                 |
| surface    | `#141416` | `#ffffff` | cards (`.panel`)                                                |
| surface-2  | `#1d1d20` | `#ebe6df` | hover, raised, chips                                            |
| border     | `#2b2b30` | `#d9d1c6` | hairlines                                                       |
| fg         | `#f5f2ef` | `#141212` | body text                                                       |
| muted      | `#a9a4a0` | `#57514c` | secondary text                                                  |
| accent     | `#d92b20` | `#c81f17` | fills: buttons, dots, the red band, giant name, grid floor      |
| accent-ink | `#ffffff` | `#ffffff` | text on an accent fill                                          |
| accent-fg  | `#ff6a5c` | `#b3170f` | accent used as **text**; passes AA on bg, surface and surface-2 |
| mist       | `#6b120c` | `#f2b8ae` | secondary glow blob                                             |
| ridge-far  | `#1a0d0c` | `#e6ddd3` | Sahyadri motif, back ridge                                      |
| ridge-near | `#110909` | `#dcd1c4` | Sahyadri motif, front ridge (and footer background)             |
| grid       | red 55%   | red 35%   | hero perspective floor lines                                    |

Measured contrast (v3): dark fg/bg 17.8:1, muted 8.1 (bg) / 7.5 (card), accent-fg 7.1 / 6.5, white on
accent 4.9; light fg/bg 16.6, muted 6.9 / 7.8, accent-fg 6.1 / 6.9, white on accent 5.7.
Re-check if you change a value; WCAG AA is a hard requirement.

**Palette: "Ember"** (v3): near-black with a signal-red accent. The owner asked for this look from a
reference YouTube Short (a black/red "cinematic" portfolio template); we rebuilt the style with the owner's own
content and photos, copying no assets or copy. It replaces v2's "Monsoon Sahyadri" green + turmeric.

**Type:** display = **Anton** (heavy condensed, uppercase; `h1`/`h2` get it by default, self-hosted
subset `client/public/fonts/anton-subset.woff2`, 11 KB, preloaded; declared for weights 100–900 so bold never
fakes it; `.slant` gives the synthetic oblique), heading = Bricolage Grotesque Variable (`font-heading`, `h3`/`h4`
and card titles), body = Geist
Variable, mono = Geist Mono Variable (eyebrows, labels, code), all via `@fontsource-variable`.
Handwriting = Caveat Bold (`font-hand`, currently unused) and the Marathi place name = Kalam (`font-marathi`), both
self-hosted **subsets** in `client/public/fonts/` (made with pyftsubset; 17 KB + 3 KB) so they never
compete with the LCP image. Adding new handwritten glyphs or Devanagari words means re-subsetting. Fluid scale with `clamp()` tuned for 375→1440px:
`text-body`, `text-lead`, `text-h3`, `text-h2`, `text-h1`, `text-display`, `text-mega` (giant hero name).

**Other tokens:** `rounded-card` (0.875rem), `rounded-pill`, `ease-out-expo`, `ease-in-out-quint`,
`max-w-content` (76rem), `--spacing-section`. Component classes in index.css: `.grain` (fixed
film-grain overlay), `.blob` (blurred gradient-mesh circle, colour via `--blob`), `.eyebrow`, and v3's
`.panel` (dark card with a red edge glow on hover), `.slant`, `.ember-text` (red gradient text fill),
`.grid-floor` (hero perspective grid).

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
- Animate only `transform` and `opacity`. Exceptions, all one-off: clip-path for the About iris reveal, and a
  short blur-to-sharp filter on the hero copy (cleared afterwards). Never scrub a filter or clip-path.

## API (Phase 4)

- `createApp({ env, stores, mailer })` takes its dependencies, so tests inject in-memory stores and a fake mailer. Storage lives behind `stores/types.ts` (`Stores`): `stores/mongo.ts` (Mongoose) in prod, `stores/memory.ts` for tests and DB-less local dev.
- Collections: `projects` (seeded from `shared/projects.json` with `npm run seed -w server`, upsert by slug, `--prune` to delete removed ones), `messages` (contact form, with `sentiment {label, score}` and `emailed`), `chatLogs` (Phase 5, anonymised, 90-day TTL).
- Endpoints: `GET /api/health` (reports storage + email mode), `GET /api/projects`, `GET /api/projects/:slug`, `POST /api/contact` (Zod-validated, honeypot field `website`, 5 per 15 min per IP, wink-nlp sentiment, Resend email with reply-to = visitor; email failure never fails the request).
- Client reads projects through `hooks/useProjects.ts`: bundled JSON for first paint, then the API. All fetches go through `lib/api.ts` (`VITE_API_URL` base, timeout, `ApiError` with field errors).

## Chatbot + command palette (Phase 5)

- Resume facts live in `shared/profile.json` (client `content/profile.ts` re-exports it; the server builds the chatbot system prompt from it with `lib/resumeContext.ts`). Edit facts there once.
- `POST /api/chat` body `{ messages: [{role, content}] }` (≤12 turns, ≤1000 chars each, last from user). Response is server-sent events over the POST: `meta {intent, mode}` → `delta {text}`… → `done` (or `error`). 20 requests / 10 min per IP.
- Intent detection (`lib/intent.ts`, wink-nlp lemmas + stems + keyword sets): `resume | projects | contact | off-topic`. Off-topic and prompt-injection attempts get a fixed polite refusal with **no** model call; the system prompt also tells the model to stay on topic.
- Model call (`lib/llm.ts`): Anthropic SDK, `client.beta.messages.stream`, model `CHAT_MODEL` (default `claude-opus-5-5`), `output_config.effort` = `CHAT_EFFORT` (default low), cached system prompt, server-side refusal fallback (`fallbacks: "default"`, beta `server-side-fallback-2026-07-01`). Without `ANTHROPIC_API_KEY` the offline provider streams fixed resume answers so the UI still works. The key never reaches the client.
- `chatLogs` are anonymised: emails/phones/URLs scrubbed, IP replaced by a daily-rotating salted hash (`LOG_SALT`).
- Client: `providers/ChatProvider.tsx` holds one conversation shared by the floating `ChatWidget` (launcher morphs into the panel via a shared `layoutId`) and the `/chat` page; `lib/sse.ts` parses the stream; `components/chat/RichText.tsx` renders a safe markdown subset (no HTML injection).
- Command palette: `components/CommandPalette.tsx` (cmdk), ⌘K / Ctrl+K or the header button; sections, projects, theme toggle, chat, resume, contact. Scroll containers inside modals carry `data-lenis-prevent`.

## Performance, SEO, accessibility (Phase 6)

- **Prerender + hydrate.** `npm run build -w client` = `vite build` → SSR build of `entry-server.tsx` → `scripts/prerender.mjs`, which writes `dist/index.html`, `chat/index.html`, `projects/<slug>/index.html` (non-coming-soon) and `404.html`, plus `sitemap.xml` and `robots.txt` from `VITE_SITE_URL`. The host must serve clean URLs (`/chat` → `chat/index.html`) and `404.html` for misses; `client/scripts/serve.mjs` does exactly that locally.
- The prerender replaces Vite's entry `<script>` with a small boot script that imports the app **after the hero portrait's LCP entry** (2 s cap; decode + next frame on browsers without LCP entries). Content is readable as plain HTML before JS.
- **Hydration must match the prerender.** Anything that depends on the visitor (theme, fine pointer, reduced motion, first visit, platform) is gated on `useHydrated()` (`hooks/useHydrated.ts`) so the first client render equals the server one. No `Date`/random output in render (footer year uses `suppressHydrationWarning`). New lazy routes are fine: `main.tsx` waits for `router.state.initialized` before hydrating.
- **Pre-paint classes** from the inline script in `index.html`: `motion-ok` (hides `[data-hero]` copy until GSAP reveals it, with a 4 s CSS failsafe) and `intro-pending` (first visit: a bg-coloured cover until the preloader has played). The portrait is never hidden (only moved), so it stays the LCP element.
- **Head tags:** pages render `<Seo title description path [noindex] [jsonLd]>` (`components/Seo.tsx`, React 19 native `<title>/<meta>/<link>` hoisting; no Helmet). The prerender moves them into `<head>` with `data-prerender`; `main.tsx` removes those before React takes over, so each route owns its tags. JSON-LD `Person` on the home page comes from `lib/seo.ts` (resume facts only, no phone).
- **Code splitting:** routes other than Home, the command palette (`CommandPaletteHost` owns ⌘K and loads cmdk on first open), the chat panel and the 3D scene are separate chunks. Scroll choreography is set up in idle steps (`lib/idle.ts`), immediately only when the URL has a `#hash`.
- **Lighthouse (mobile, simulated):** home 96–97 performance (v3), 100 accessibility / best practices / SEO; project and chat pages 99–100. Re-measure against `npm run preview -w client`, not `vite preview` (no clean URLs).
- **A11y rules checked by `e2e/smoke.spec.ts` (axe, WCAG 2.2 AA, both themes):** icon buttons are 44px (`size-11`), visible text is part of each accessible name, `scroll-padding` keeps focus clear of the header and chat launcher, the role rotator has a pause button and pauses on hover, contact errors use red-700/red-300 and focus moves to the first invalid field. RootLayout sets `html[data-ready]` once hydrated (tests wait on it).

## Deploy (Phase 7)

- **Site → Vercel** via root `vercel.json` (repo root as Root Directory, `npm ci`, `npm run build -w client`, output `client/dist`, `cleanUrls`, security + cache headers). Build-time env: `VITE_SITE_URL`, `VITE_API_URL`.
- **API → Render** via `render.yaml` (free plan, Singapore, `npm ci --include=dev && npm run build -w server`, `npm run start -w server`, health check `/api/health`). Secrets are `sync: false` and entered in the dashboard; `LOG_SALT` is generated. The server reads `shared/*.json` at runtime, so deploy the whole repo, not just `server/`.
- `CLIENT_ORIGIN` accepts a comma-separated list; `TRUST_PROXY` (default 1) sets Express proxy hops; SIGTERM/SIGINT close the server and Mongo cleanly.
- **CSP:** the prerender adds a `<meta http-equiv="Content-Security-Policy">` to every page, allowing inline scripts only by sha256 hash and `connect-src` only to self + the `VITE_API_URL` origin. Changing the inline theme/boot script is fine (hashes are recomputed per build); adding a third-party script, font or API host needs a CSP change in `client/scripts/prerender.mjs`. Header-only rules (`X-Frame-Options`, etc.) live in `vercel.json`.
- **CI:** `.github/workflows/ci.yml` runs lint, format check, typecheck, unit/API tests, build, then the Playwright suite.
- The full setup and deploy guide for humans is `README.md`; keep it in sync when env vars or commands change.

## v2 spec: video, 3D text, personal look

- **Video slots** (`content/media.ts`, `components/media/AmbientVideo.tsx`, `lib/media.ts`): `heroLoop` (hero
  background), `aboutScrub` (About: scroll drives `video.currentTime`, [data-scrub]), and `demo` on a project in
  `shared/projects.json` (plays on card hover/focus). All are `null`/absent until real clips exist; then the
  stills are used. Video only plays after hydration and never under reduced motion, Data Saver or 2g/3g
  (`canAutoplayVideo`). The About fallback slides the stage photo over the hills photo with scroll.
- **3D text:** hero name letters flip up (SplitText chars, rotateX); `RoleRotator` is a box turning a
  quarter per role (pause button kept); section `h2`s carry `[data-tilt]` and stand upright on scroll
  (transform only, always readable); `Button` rolls its label on hover (`.roll`, aria-hidden copy, opt out
  with `roll={false}`); routed page titles use `FlipTitle` (only animates after client navigation, so the
  prerender is never hidden); scores use `Odometer` (`[data-odometer]`, final value in the markup).
- **Personal layer:** the repeating motif is `components/motif/SahyadriRidge.tsx` (hero bottom, the divider
  before Projects, footer, OG image). Hand-drawn marks are `HandMark` (`underline | circle | arrow | star`,
  `draw="scroll"` or `"hero"`) and `HandNote`; keep them few. Site copy in the owner's voice lives in
  `profile.story` and `profile.personal` (shared/profile.json); `profile.about` stays neutral for the chatbot.
- **Anti-"AI look" rules** (audit every section when copy changes): no purple/violet gradients, no 👋 or
  emoji openers, no "passionate", "leverage", "cutting-edge", "seamless" or similar filler, no invented
  numbers or stats (only resume facts), real photos only.

## v3 "Ember" look (from the owner's reference video)

- **Hero:** giant `SHRIDHAR` (`[data-mega]`, decorative, letters rise on load) behind the cut-out portrait
  (`assets-raw/profile-cutout.png`, background removed with rembg `u2net_human_seg`; `npm run images` makes
  `cutout-*.avif|webp|png`, preloaded in `index.html`, the LCP element). Left: name `h1`, role box, lead,
  buttons. Right: "Right now" panel (`profile.now`) and three highlight tiles (`profile.highlights`, real
  resume facts only). Red glow + `.grid-floor` + a faint Sahyadri ridge on the horizon. On phones the
  portrait comes first.
- **Header** is a floating pill with a red `SC` monogram and a red Contact pill.
- **Section titles** are uppercase Anton, `.slant`, with the closing word in `text-accent-fg` and a period.
- **TechMarquee** is a slanted text strip split by red diamonds; **Projects** are full-width rows
  (`ProjectCard`) with a red wash on hover; **Manifesto** is a full-bleed red band quoting `profile.motto`;
  **Contact** ("Let's build it together.") has the particle sphere (`LazyHeroScene`, desktop only).
- The hand-drawn layer (HandMark/HandNote) is no longer used on the home page; the components remain.

## Motion system + polish pass (v3.1)

- **Tokens:** `lib/motion-tokens.ts` (re-exported by `lib/motion.ts`) is the single source for timing:
  `DUR` (micro .18 / ui .32 / reveal .75 / cinematic 1.1 s), `EASE` (Motion beziers) + `GSAP_EASE`,
  `SPRING` (snappy / soft / follow / magnetic / pop), `DIST`, `STAGGER`, `BLUR`, `SCRUB`. New animation code
  uses these, never ad-hoc numbers. It imports no library, so Motion-only components stay GSAP-free.
- **Hero:** cinematic timeline (stage → giant name → portrait → letter flip → blur-to-sharp copy), layers
  tagged `data-depth` move at different rates on scroll-out (half on phones), breathing glow (`animate-breathe`,
  CSS), `<Spotlight>` (pointer light, mouse only), and a decorative scroll cue (`[data-scroll-cue]`,
  aria-hidden, tabIndex -1). The blur on hero copy is a one-off filter that is cleared afterwards.
- **New scroll attributes** (useScrollAnimations): `[data-parallax="0.2"]` (decorative depth), `[data-iris]`
  (circle clip-path reveal, once; About figure), `[data-drift]` (big type sliding sideways; Manifesto).
  Image reveals are deliberately varied: hero rise, About iris, project cover tilt/zoom, case-study cover
  zoom-out + red curtain (ProjectPage, Motion).
- **Header** (`hooks/useHeaderScroll.ts`): hides while scrolling down past 160px, returns on scroll up or
  focus; glass deepens once scrolled; active-section pill (`layoutId="nav-active"`, IntersectionObserver) with
  `aria-current`; hover underline; mobile menu animates in with staggered links and a bars→X icon. The full
  nav shows from `lg` (1024px); below that the menu button is used (the pill overflowed at 768px).
- **Cursor labels:** any element with `data-cursor-label="…"` turns the custom cursor into a red pill with
  that text (project rows say "View project"). `ScrollProgress` is the 2px red bar at the very top.
- **Micro-interactions:** Button lifts 2px with a soft accent shadow and presses down on click; project row
  arrow swaps out diagonally; contact fields get a red focus ring; footer signature rises in on view.

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
