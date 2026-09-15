# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

PyCSharp is a single-page React 19 + TypeScript + Vite app: an 18-module interactive
"Rosetta Stone" guide comparing Python (CPython) to C#/.NET for senior .NET engineers.
There is no real backend — `vite.config.ts` defines local-only dev/preview middleware
(`/api/execute-python`, `/api/db/status`, `/api/db/sync`) used by the in-app sandbox and
sync drawer. All user data (progress, notes, theme) persists client-side in `localStorage`
via `src/services/dbIntegrationService.ts`.

## Directory map

- `src/views/` — one file per curriculum module (18 total), lazy-loaded from `src/App.tsx`.
- `src/components/` — reusable UI, interactive visualizers/simulators, modals, nav.
- `src/data/` — static TypeScript datasets (curriculum content, code comparisons, quizzes).
- `src/services/` — client-side persistence and sync (`dbIntegrationService.ts`).
- `public/` — static assets, PWA manifest, `service-worker.js`.
- `scripts/` — `generate-docs.mjs`, an automated docs generator for `docs/MODULES_CATALOG.md`.
- `docs/` — `ARCHITECTURE.md`, `MODULES_CATALOG.md`, `PROMPT_BOOK.md`.

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
- The local Python execution endpoint (`/api/execute-python`) is gated behind
  `ENABLE_PYTHON_EXECUTION=true` and must never be assumed enabled or exposed publicly.
- Security headers/CSP are centralized in `vite.config.ts` (`SECURITY_HEADERS`) — keep any
  new external resource usage consistent with that policy rather than loosening it.
