# Safari Lab

A free, **non-server, local-first, mobile-first adaptive workout planner and tracker**.

> Built for the wild. Made for the strong.

Safari Lab has **no accounts, no cloud database, no subscriptions, no server-side
workout storage, no user uploads and no server-side AI.** All workout data lives
in the browser (IndexedDB) and is exported/imported as a user-owned `.slfit`
save file. It may be ad-funded, but ads never touch active gym-mode logging.

The full specification is the **v1.4 Conflict-Free Build Bible** (see the PDF in
this folder). Authority order when specs conflict: **v1.4 > v1.3 > v1.2 >
(legacy) v1.1 > v1.0**.

## Tech stack

- **Next.js 14 (App Router) in static-export mode** (`output: 'export'`) — no API
  routes, no server actions, no runtime server dependencies.
- **TypeScript** for all app logic and the canonical data models.
- **Plain CSS + CSS Modules** (no Tailwind); brand tokens in `styles/tokens.css`.
- **Self-hosted fonts** (Raleway / Montserrat) with system fallbacks — no font CDN.
- IndexedDB for local storage; custom SVG charts; PWA/service worker (later stage).

## Scripts

```bash
npm install
npm run dev        # local dev server
npm run build      # static export to ./out
npm run typecheck  # tsc --noEmit
npm run lint
```

## Project structure

```
app/                 Next.js App Router routes (+ globals.css)
components/ui/        Layout & UI primitives (Shell, Card, Button, Pill, ...)
lib/constants/        Doctrine guardrails, brand tokens, DB/schema constants
lib/models/           Canonical v1.4 TypeScript data models
styles/               tokens.css (brand tokens) + brand.css (global base)
```

## Staged build

The project is built in gated stages (Bible Section 24). Each stage stops for
review before the next begins.

- **Stage 0 — Scope lock** ✅ project scaffold, doctrine constants, v1.4 canonical
  schemas, no-server guardrails.
- **Stage 0.5 — Design scaffold** ✅ brand tokens, global theme, layout primitives,
  copy tokens. (`/` currently renders an internal design-scaffold preview, not the
  real homepage.)
- Stage 1 — Static shell (real homepage, nav, footer, privacy promise) — _next_.
- Stages 2–16 — brand UI, exercise data, generator, swap engine, local DB, program
  lock, gym mode, progression, adaptation, save files, charts, PWA, ads, SEO, QA.

## Doctrine (permanent, not feature flags)

See `lib/constants/doctrine.ts`. No authentication, server database, subscriptions,
checkout, product purchasing, user-data upload, server-side AI, or external font
CDN. If a change needs any of these, it is out of scope for Safari Lab.
