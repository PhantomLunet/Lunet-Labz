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
- Hero with R3F canvas: floating ghost mascot, mouse parallax, sparkle particles, soft halo shader
- Mouse-tracked 3D animation + scroll-linked Framer Motion reveals
- Lenis smooth scroll
- Projects bento grid (1 large featured + 5 cards) with Open/Download/Source buttons
- Features section (4 alternating-offset cards)
- How It Works 3-step timeline
- Buy us a coffee section with floating ceramic cup
- Footer with infinite marquee
- Waitlist email signup with Sonner toast feedback

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
