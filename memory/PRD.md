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
- **Iteration 2 (current)**:
  - Replaced R3F hero with `ScrollExpandMedia` — wheel/touch-driven image-grows-into-view intro using transparent-bg ghost PNG. Title splits into two H1s ("Lunet" + "Labz" terracotta italic).
  - Added `FloatingGhost` stage: transparent ghost PNG floating with motion + soft halo + optional Spline scene (`SPLINE_GHOST_SCENE` null until user provides scene URL).
  - Replaced Projects bento with `ScrollTiltedGrid` — cinematic tilted reel of project images that rise, focus, then tilt out as you scroll. Below it: an action shelf list with all project links.
  - rembg-generated `/public/ghost-transparent.png` (alpha cutout of Nano Banana ghost).
  - Anchor links in nav now auto-skip the scroll-expand intro.

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
