# Claude Code Prompt — Animated Developer Portfolio for Shridhar Chavan

> Paste everything below into Claude Code from an empty project folder. Put the two photos in `./assets-raw/` first (`profile-hills.jpg` and `speaking.jpg`).

---

## ROLE

You are a senior UI/UX engineer and full-stack developer. Build a production-grade, animated personal portfolio for **Shridhar Sudam Chavan** that feels current for late 2026: fluid motion, kinetic typography, scroll-driven storytelling, and a live AI feature that proves the stack rather than just listing it.

Work in phases. After each phase: run the dev server, check for console errors, and show me a short summary before moving on. Ask me before adding any paid service or API key.

## SETUP — SKILLS, PLUGINS & MCP

Before writing UI code:

1. Install and load the **frontend-design** plugin/skill from Anthropic's official plugin marketplace (use `/plugin` to browse). Follow its guidance on a distinctive aesthetic direction — no generic templated look.
2. If available, connect these MCP servers:
   - **Playwright MCP** — take screenshots at 375px, 768px and 1440px after each phase and fix layout bugs you see.
   - **Context7** (or similar docs MCP) — pull current docs for Motion, GSAP, Tailwind v4 and React Three Fiber instead of relying on memory.
   - **Figma MCP** (optional) — only if I share a Figma link.
3. Create a `CLAUDE.md` in the repo recording the design tokens, folder structure and coding conventions you choose, so later sessions stay consistent.

## TECH STACK

**Frontend (MERN — React side)**

- React 19 + Vite + TypeScript
- Tailwind CSS v4 + shadcn/ui primitives
- **Motion** (Framer Motion) for component/layout animations and page transitions
- **GSAP + ScrollTrigger** for scroll-driven timelines and text reveals
- **Lenis** for smooth scrolling
- **React Three Fiber + drei** for one lightweight 3D hero element (lazy-loaded)
- React Router for routes; `react-helmet-async` for SEO meta

**Backend (MERN — Express/Node/Mongo side)**

- Node.js + Express + TypeScript
- MongoDB Atlas + Mongoose (collections: `projects`, `messages`, `chatLogs`)
- Zod validation, `express-rate-limit`, Helmet, CORS locked to the frontend origin
- Resend (or Nodemailer) to notify me of contact-form submissions

**AI / ML / NLP**

- "Ask Shridhar" chatbot: Express endpoint that calls an LLM API (Claude API) with my resume as structured context; stream responses to the UI. API key stays server-side only.
- NLP touches: intent detection on chat input (resume / projects / contact / off-topic) and simple sentiment tagging on contact messages — use a lightweight library (e.g. `wink-nlp` or `compromise`) so it runs without extra cost.

**Tooling**

- ESLint + Prettier, Vitest for utils, Playwright for a smoke test
- Deploy: frontend on Vercel, API on Render/Railway, DB on MongoDB Atlas free tier
- `.env.example` for every secret; never commit keys

## CONTENT (from my resume — do not invent facts)

**Name:** Shridhar Sudam Chavan
**Tagline:** "MERN Developer · AI/ML & NLP Enthusiast · Vibe Coder"
**Location:** Satara, Maharashtra, India
**Email:** shridharchavan03@gmail.com
**LinkedIn:** https://www.linkedin.com/in/shridhar-chavan/
**Phone:** keep out of the public page; show email + LinkedIn + contact form instead.

**About:** Computer Science (MCA) graduate with a solid foundation in programming, web development and data structures. Passionate about building efficient, user-friendly software, now focused on the MERN stack, AI/ML and NLP, and AI-assisted "vibe coding" workflows. Quick learner and team player; UGC NET qualified (Jan 2025).

**Experience**

- Trainee Frontend Developer — CodexLabz Technologies, Sangli (Jan 2024 – Jun 2024)
  - Built a responsive web application with HTML, CSS and JavaScript
  - Worked with the backend team to integrate data flow and dynamic content
  - Fixed cross-browser compatibility issues

**Education** (render as an animated vertical timeline)

- MCA — Government College of Engineering, Karad (2022–2024) · GPA 8.74/10 · Data Structures, Computer Networks, DBMS, Cloud Computing
- BA Economics — Shivaji University, Kolhapur (2019–2022) · GPA 8.4/10 · Indian Economy, Stock Market (BSE)
- HSC — Maharashtra State Board (2019) · 68.92%
- SSC — Maharashtra State Board (2017) · 93.20%

**Projects** (store in MongoDB, seed from a JSON file)

1. **Optimal Solutionizer** — mathematical calculator that finds optimal solutions to complex problems. JavaScript/CSS frontend, Node.js backend, Git, deployed on Vercel.
2. **Online Shopping System** — interactive e-commerce app. HTML/CSS/JS frontend, PHP backend, MySQL database.
3. **This Portfolio** — MERN + AI chatbot + NLP; describe it as a case study.
4. Two empty "Coming soon" cards labelled AI/ML and NLP — leave `TODO` placeholders for me to fill; do not invent project details or metrics.

**Skills** (bento grid, grouped)

- MERN: MongoDB, Express.js, React, Node.js
- AI/ML & NLP: Machine Learning fundamentals, NLP, LLM integration, Google Cloud ML, Azure ML
- Languages: JavaScript, TypeScript, C++, C, Java
- Web: HTML, CSS, Bootstrap, Tailwind
- Data & Cloud: MySQL, MongoDB, Google Cloud
- Workflow: Git, Vercel, Vibe Coding with Claude Code

**Certifications:** Google Cloud Foundation · Google Cloud Professional Machine Learning · Microsoft Azure ML Fundamentals · Bootstrap Framework

**Leadership & Achievements:** UGC NET Qualified (Jan 2025) · Aptitude Coordinator, TPO 2024 (MCA) · Organizer, TECH-Manch (Avishkar 2024), GCEK · General Secretary, Chh. Shivaji College, Satara (2022) · National-level Boxing participant (2020) · Science Olympiad (2016), Maths Olympiad (2018), LIC Student of the Year (2016)

**Languages:** Marathi (native), Hindi, English

**Photos**

- `profile-hills.jpg` — outdoor portrait on a hilltop. Use in the hero. Remove/soften the background or place it in a rounded mask with a subtle parallax.
- `speaking.jpg` — speaking at a mic at a tech event. Use in the Leadership/About section to back up the "speaker & organizer" story.
- Convert both to AVIF/WebP at several sizes; add meaningful alt text.

## DESIGN DIRECTION

- **Aesthetic:** dark-first "midnight navy" (echo the navy jacket in the hero photo) with one electric accent (cyan or saffron — pick one and justify it in `CLAUDE.md`). Light mode toggle included.
- **Type:** an expressive display font for headings (e.g. Clash Display, Satoshi or General Sans) + a clean body font. Fluid type with `clamp()`.
- **Texture:** subtle film-grain noise overlay and soft gradient mesh blobs behind sections.
- **Layout:** asymmetric hero, bento-grid skills, sticky-scroll projects section, horizontal-scroll certifications strip.

## ANIMATIONS (the "trending" checklist)

1. **Preloader** — name letters assemble, counter 0→100, then a curtain wipe into the hero (max 1.5s, skip on repeat visits).
2. **Hero** — split-text reveal of the name, rotating role words (MERN Developer → AI/ML Explorer → NLP Builder → Vibe Coder), small 3D object or particle field reacting to the cursor.
3. **Custom cursor** — dot + trailing ring that grows on links; disable on touch devices.
4. **Magnetic buttons** on CTAs.
5. **Scroll reveals** — GSAP ScrollTrigger staggered fade/slide; pinned section for the experience story.
6. **Projects** — cards with 3D tilt on hover, image zoom, and shared-layout transition into a project detail view.
7. **Timeline** — line draws itself as you scroll; nodes pop in.
8. **Skills bento** — hover spotlight effect following the cursor; skill icons float gently.
9. **Marquee** of tech logos that pauses on hover.
10. **Page transitions** between routes with Motion `AnimatePresence`.
11. **Command palette** (⌘K / Ctrl+K) to jump to sections, toggle theme, or open the chatbot.
12. **Chatbot widget** — floating button that morphs into a chat panel; typing indicator; streamed replies.

**Motion rules:** respect `prefers-reduced-motion` (fall back to simple fades); animate only `transform` and `opacity`; lazy-load the 3D scene; no animation should block reading the content.

## PAGES & SECTIONS

`/` — Preloader → Hero → About → Skills (bento) → Experience → Projects → Education timeline → Certifications strip → Leadership & Achievements → Contact
`/projects/:slug` — project case study (problem, approach, stack, screenshots, links)
`/chat` — full-screen version of "Ask Shridhar"
`404` — playful animated page

## API ENDPOINTS

- `GET /api/projects`, `GET /api/projects/:slug`
- `POST /api/contact` — validate, run sentiment tag, save to `messages`, email me
- `POST /api/chat` — intent detection → LLM call with resume context → stream reply; refuse off-topic requests politely; rate-limit per IP; log anonymised Q&A to `chatLogs`
- `GET /api/health`

## QUALITY BAR

- Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO (mobile)
- WCAG AA contrast, full keyboard navigation, visible focus states
- No layout shift from fonts or images; LCP image preloaded
- Open Graph image + meta tags, sitemap, robots.txt
- Downloadable resume PDF button (I'll add the file at `/public/Shridhar_Chavan_Resume.pdf`)
- Fix typos from the source resume ("Fronted" → "Frontend", etc.)

## BUILD PHASES

1. Scaffold monorepo (`/client`, `/server`), tooling, `CLAUDE.md`, design tokens, theme toggle.
2. Static sections with real content, responsive layout — screenshot at 3 widths.
3. Animation layer (preloader, hero, scroll, cursor, transitions) + reduced-motion fallback.
4. Express + MongoDB: projects API, seed script, contact form with email + sentiment.
5. AI chatbot with intent detection and streaming; command palette.
6. Performance, accessibility and SEO pass; Playwright smoke test.
7. Deployment configs + README with setup steps and env variables.

Start with Phase 1 now.
