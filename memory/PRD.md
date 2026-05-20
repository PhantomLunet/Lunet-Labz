# Lunet Labz — PRD

## Original Problem Statement
Build a landing page for a website called "Lunet Labz" — a website for project deployment featuring a ghost figure with a `</>` code symbol around the mouth area. The landing page should have a 3D intro, 3D animations and 2D scroll features.

## User Clarifications
- Mood: Anything but cyberpunk/techy (chose Organic Apothecary)
- Showcase site, NOT a sales site — users can "buy us a coffee" if they want to support
- Projects section with download / web app / GitHub links per project
- 3D library: react-three-fiber
- Suggested 21st.dev-quality components for high-end feel
- Buy Me A Coffee URL: placeholder `#` for now

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async client)
  - `GET /api/projects` — seeded showcase list (6 projects)
  - `POST /api/waitlist` — email capture with dedup (409 on duplicate)
  - `GET /api/waitlist/count` — public counter
- **Frontend**: React 19 + react-three-fiber@9.6.1 + Framer Motion + Lenis smooth scroll
- **Design**: Cormorant Garamond + Outfit + JetBrains Mono fonts. Bone white #F4F1ED + sage + terracotta accents, parchment texture overlay, AI-generated 3D ghost mascot.
- **Critical fix**: Disabled `@emergentbase/visual-edits` in `craco.config.js` because its data-x-line-number / data-x-file-name props conflict with R3F's dashed-path prop convention.

## Implemented Features (Dec 2025)
- **Iteration 1**: Hero with R3F canvas, projects bento grid, features, how-it-works, coffee, footer marquee.
- **Iteration 2**: Replaced R3F hero with ScrollExpandMedia + tilted grid + Spline scaffolding.
- **Iteration 3 (current)**:
  - **Pinned-scroll Hero (300vh sticky)**: Phase A (`0 → 0.3`) — "Lunet" + "Labz" slide IN from outside viewport, settling on either side of the ghost at the **same height**, never crossing in front of the ghost. Phase B (`0.18 → 0.58`) — subtitle + waitlist form become interactive. Phase C (`0.6 → 1.0`) — ghost flips (rotateY 0→360°), shrinks, and drifts up-left while the "Meet the Mascot" copy fades in. Ghost opacity reduced to 0.55 so it sits BEHIND the text.
  - **Multi-route SPA**: `/`, `/projects` (full listing), `/projects/:id` (detail page with related projects), `/features` (8-principle manifesto + CTAs).
  - **ScrollTiltedGrid is clickable**: each tile is an anchor linking to its `/projects/:id`.
  - **"Show all projects" CTA**: positioned above the tilted grid on the home page.
  - **Critical CSS fix**: changed `overflow-x: hidden` → `overflow-x: clip` on html/body (the former breaks `position: sticky`).
  - **Hero motion bypass**: Hero uses manual `lerpRange` interpolation driven by `useMotionValueEvent` + React state instead of framer-motion's `useTransform → style` chain, which wasn't propagating to the DOM under React 19 + fm v12.

## P0/P1/P2 Backlog
- P1: Mobile responsiveness fine-tuning for ghost canvas
- P1: Real Buy Me A Coffee URL wiring
- P2: Project detail pages
- P2: RSS / blog feed
- P2: Admin dashboard to add projects without redeploy

## Tech Choices
- Why r3f@9.6.1 over latest: stable with React 19
- Why no drei: drei's camera-controls dep requires Node 22+ (env has 20)
- Why visual-edits disabled: see Architecture note above
