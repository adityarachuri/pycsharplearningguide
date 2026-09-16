# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

PyCSharp is a single-page React 19 + TypeScript + Vite app: a 28-chapter (plus 5 standalone
practice/reference pages) interactive "Rosetta Stone" guide comparing Python (CPython) to
C#/.NET for senior .NET engineers.
There is no real backend — `vite.config.ts` defines local-only dev/preview middleware
(`/api/db/status`, `/api/db/sync`) used by the sync drawer. All user data (progress, notes,
theme) persists client-side in `localStorage` via `src/services/dbIntegrationService.ts`.
The Interactive Sandbox runs real Python entirely client-side via Pyodide (CPython compiled
to WebAssembly) in a dedicated Worker — see `src/services/pyodideSandboxService.ts` and
`src/workers/pyodideWorker.ts`. There is no server-side code execution endpoint.

## Directory map

- `src/views/` — one file per view (33 total: 28 numbered curriculum chapters + 5
  practice/reference pages), lazy-loaded from `src/App.tsx` (except `LandingView`, which is
  imported eagerly since it's the default/first-paint page — see the CLS note in
  `docs/PRODUCTION_READINESS_AUDIT.md` §22 before changing that back to `lazy()`).
- `src/components/` — reusable UI, interactive visualizers/simulators, modals, nav.
- `src/hooks/` — small shared hooks (e.g. `useEscapeToClose`).
- `src/data/` — static TypeScript datasets (curriculum content, code comparisons, quizzes).
- `src/services/` — client-side persistence and sync (`dbIntegrationService.ts`), the Pyodide
  sandbox (`pyodideSandboxService.ts`), and challenge evaluation/progress tracking.
- `public/` — static assets, PWA manifest, `service-worker.js`.
- `scripts/` — `generate-docs.mjs`, an automated docs generator for `docs/MODULES_CATALOG.md`.
- `docs/` — `ARCHITECTURE.md`, `MODULES_CATALOG.md`, `PROMPT_BOOK.md`,
  `PRODUCTION_READINESS_AUDIT.md` (the evidence trail for the production-readiness review —
  read it before re-claiming something it documents as fixed or as a known gap).

## Commands

- `npm run dev` — start the dev server at `http://127.0.0.1:3000`.
- `npm run lint` — `tsc --noEmit` (this project's only linter; no ESLint config).
- `npm run test:unit` / `npm run test:coverage` — Vitest.
- `npm run build` — production build.
- `npm test` — full local gate: lint + coverage + build.
- `npm run docs:generate` — regenerate `docs/MODULES_CATALOG.md` from source.

Always run `npm run lint` after non-trivial TypeScript changes — it is the primary
correctness gate in this repo.

## Conventions

- Strict TypeScript (`strict: true`); avoid `any` — prefer precise types or `unknown` with
  narrowing.
- Components are function components using `React.FC<Props>` or explicit return types
  (`ReactElement`).
- Styling is Tailwind CSS v4 utility classes inline in JSX; no CSS modules.
- Content-only changes (curriculum text, comparisons) belong in `src/data/*.ts`, not inline
  in view/component files.
- Never reintroduce server-side execution of learner-submitted code (e.g. spawning a Python
  subprocess from the dev server). The sandbox's security model depends on execution staying
  entirely inside the Pyodide Worker, which has no filesystem, network, or host process access.
- Security headers/CSP are centralized in `vite.config.ts` (`SECURITY_HEADERS`) — keep any
  new external resource usage consistent with that policy rather than loosening it.
- The app shell (`App.tsx`) is intentionally height-constrained (`h-screen overflow-hidden`) so
  the header/sidebar stay fixed and only `<main>` scrolls internally. Don't revert the root
  container to `min-h-screen`, and don't add new `window.scrollTo(...)` calls — use the existing
  `scrollContentToTop()` helper (which scrolls `mainContentRef`) instead, since the window itself
  no longer scrolls.
