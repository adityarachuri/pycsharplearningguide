# PyCSharp

> **Polyglot Systems & Technical Rosetta Stone**  
> *Learning Python from a C# developer's perspective.*

[![CI & Quality Gates](https://gitlab.com/adityarachuri/pycsharplearningguide/badges/main/pipeline.svg)](https://gitlab.com/adityarachuri/pycsharplearningguide/-/pipelines)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0.1-61dafb.svg)](https://react.dev)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.x_Strict-3178c6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.1-38bdf8.svg)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-10b981.svg)](public/manifest.json)

---

## 🧭 Overview

**PyCSharp** is an enterprise-grade interactive architectural guide, simulator, and technical Rosetta Stone designed specifically for senior **C# and .NET software engineers, systems architects, and technical leads** mastering the Python ecosystem.

Rather than treating Python as a beginner scripting language, PyCSharp deconstructs Python through the rigorous systems engineering lens of a .NET developer. It contrasts runtime execution models, memory allocations, concurrency constraints, type systems, and compiler internals between **CPython** and the **.NET Core Common Language Runtime (CLR)**.

---

## 🏛️ Architectural Comparison: CPython vs. .NET CLR

| Engineering Dimension | Microsoft .NET (C#) | Python (CPython) | Architectural Takeaway for C# Devs |
| :--- | :--- | :--- | :--- |
| **Compilation Model** | Ahead-of-Time / RyuJIT to native machine code | Bytecode compilation (`.pyc`) to stack evaluation loop | CPython compiles to bytecode, but historically evaluated instructions one-by-one; Python 3.13 introduces Tier-2 copy-and-patch JIT (PEP 744). |
| **Type Discipline** | Static, manifest, nominal typing checked by Roslyn compiler | Dynamic, duck-typed, gradual typing verified via Pyright / mypy | Types in Python are first-class runtime objects; annotations (`typing`) are metadata not enforced by CPython at runtime. |
| **Object Representation** | Object header (MethodTable ptr + SyncBlockIndex) + payload | `PyObject` (`ob_refcnt` + `ob_type` pointer) + payload | Every integer, float, and string is a heap-allocated `PyObject`; `sys.getsizeof(0)` is 28 bytes compared to a 4-byte C# `int`. |
| **Memory Reclamation** | Generational, tracing, compacting GC (Gen 0, 1, 2, LOH, POH) | Immediate Reference Counting + generational cyclic GC (`gc` module) | Immediate deterministic deallocation when refcount reaches 0; cyclic GC runs periodically to untangle circular object graphs. |
| **Concurrency & Threading** | Real OS threads running preemptively across multiple CPU cores | Global Interpreter Lock (GIL); optional free-threaded build (PEP 703) | Multi-threading in standard CPython does not scale CPU-bound work across multiple cores. Use `multiprocessing`, C-extensions, or PEP 703 free-threaded Python. |
| **Package Management** | NuGet, MSBuild, `.csproj` with centralized feed restore | Modern `uv` (Rust-based), `pyproject.toml` (PEP 517/518/621), virtual environments | `uv` provides instant deterministic package resolution akin to modern `dotnet restore`. |

---

## 📚 Curriculum & Architectural Modules

The platform is structured into **28 numbered curriculum chapters** across 7 thematic groups, plus
**5 standalone practice/reference pages** (Home, Coding Challenges, Infographics, and two pedagogy
experiences) — **33 views in total**. All 33 correspond 1:1 to a file in `src/views/` (see
[`docs/MODULES_CATALOG.md`](docs/MODULES_CATALOG.md), which is generated directly from that directory
and cannot drift out of sync — it's checked for staleness in CI).

**I. Foundations & Architecture** — 1. Fundamentals & Creator · 2. Architecture Deep Dive (CPython vs
CLR, GIL & Bytecode) · 3. Core Deep Dives (10 features: generators, context managers, decorators,
dunder methods) · 4. Libraries & Batteries (standard library) · 5. Data Structures & Algorithms ·
6. Workstation Setup (uv, Ruff, Pyright, Docker, WSL2)

**II. Synthesis & Comparative Pedagogy** — 7. Matrix & Mindmap (Rosetta Stone + relational visualizer)
· 8. Production Lectures (Clean Architecture, Pydantic, ASGI, pytest)

**III. Hands-On Project Blueprints** — 9. Full-Stack Web App (FastAPI, SQLAlchemy 2.0, Alembic,
Docker) · 10. Production AI/ML App (local RAG, PyTorch, ChromaDB, SSE)

**IV. Industry Vertical Blueprints** — 11–12. FinTech (business context + technical implementation) ·
13–14. HealthTech (business context + technical implementation)

**V. Engineering & Systems Practice** — 15. Standard Library Deep Dive · 16. Web & API Frameworks ·
17. Testing, Packaging & Deployment · 18. Python Internals & CPython

**VI. Reference & AI/ML Frontier** — 19. Real-World Case Studies · 20. Terminology Glossary ·
21. Python for AI/ML Fundamentals · 22. AI/ML Engineering Stack · 23. Deep Learning: Engineer to
Researcher (neural network foundations, CNN/RNN/Transformer architectures, and a full comparison of
the ML Engineer and ML Researcher career tracks) · 24. C# to Python Roadmap

**VII. Industry Realities & Destiny** — 25. Citations & Researchers · 26. Future & Possibilities
(PEP 703, Tier-2 JIT) · 27. Career Compass · 28. Synthesis & Conclusion

**Standalone practice & reference pages** — Home (landing overview), Coding Challenges (16 original
DSA/real-world exercises with hidden tests, run against a real Python sandbox), Infographics
(Mermaid-diagram visual references), Learn Python Like a Language, and Python as Art (two alternative
pedagogy experiences using language/art analogies, each with an explicit "analogy, not technical
equivalence" disclaimer).

---

## ⚙️ Interactive Simulators & Visualizers

PyCSharp includes custom interactive simulations engineered with high visual precision:

- **Interactive GIL Concurrency Simulator**: Real-time simulation of OS threads contending for the CPython Global Interpreter Lock token, core utilization readouts, throughput counters, and zoomable thread state visualizers.
- **PyObject Memory Anatomy Inspector**: Interactive memory struct explorer exposing `PyObject_HEAD`, 64-bit reference counter, type pointers, cyclic GC dual-linked list (`PyGC_Head`), memory addresses, and zoom/pan controls.
- **Execution Pipeline Animator**: Step-by-step visualizer tracing Python code through Lexical Tokenizer, AST Parser, Bytecode Assembler (`ceval.c`), and execution outcomes.
- **Relational C# to Python Mindmap**: Interactive graph visualizer mapping .NET mental paradigms to Python constructs with touch gestures, panning, zoom in/out, and SVG exports.
- **In-Browser Python Sandbox**: Runs real CPython entirely client-side via [Pyodide](https://pyodide.org) (WebAssembly) in a dedicated Web Worker — no server, no subprocess, code never leaves the browser. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#runtime-security-boundary) for the security model.
- **Coding Challenges Engine**: 16 original DSA and real-world exercises, each with hidden test cases evaluated against learner code inside the same Pyodide sandbox, progressive hints, and localStorage-persisted attempt history.

---

## 🛠️ Technology Stack

- **Runtime & Framework**: React 19, TypeScript 5.x (Strict Type Safety), Vite 6
- **Styling & Design System**: Tailwind CSS v4, Lucide Icons, Space Grotesk & Plus Jakarta Sans typography
- **Visualizations & Charts**: Recharts, Mermaid, D3-inspired SVG engines
- **Offline & PWA**: Service Worker with Stale-While-Revalidate caching, Web App Manifest, offline readiness
- **Security**: Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), RFC 9116 security contact

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation & Local Development

```bash
# Clone the repository
git clone https://gitlab.com/adityarachuri/pycsharplearningguide.git
cd pycsharplearningguide

# Install dependencies
npm install

# Start local development server (binds to http://127.0.0.1:3000)
npm run dev
```

The Interactive Sandbox runs real Python via [Pyodide](https://pyodide.org) (CPython compiled to WebAssembly) entirely in your browser — no setup or environment variable needed. The first run downloads and caches the runtime (~13 MB, one time).

---

## Usage

Once `npm run dev` is running, open `http://127.0.0.1:3000` and use the sidebar to jump between the 28 curriculum chapters and 5 practice/reference pages. Each module is a standalone React view — chapter completion, notes, and theme preference persist to `localStorage` via `src/services/dbIntegrationService.ts`. Press `Ctrl+K` / `Cmd+K` to open the searchable command palette, or use the floating action button to open the Interactive Python Sandbox.

---

## API

The Vite dev/preview server exposes a small set of local-only endpoints (see `vite.config.ts`), used by the in-app sandbox and sync drawer:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/db/status` | `GET` | Returns a simulated backend-database handshake payload (driver, schema version, compatible adapters). |
| `/api/db/sync` | `POST` | Accepts a JSON payload and echoes back a simulated sync acknowledgement; no data leaves the browser. |

Python code execution is **not** a server endpoint. The Interactive Sandbox runs real CPython client-side via Pyodide (WebAssembly) inside a dedicated Web Worker — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#runtime-security-boundary) for the security model.

These endpoints only exist in local dev/preview via Vite middleware — there is no deployed backend.

---

### Production Build & Verification

```bash
# Typecheck & Linting
npm run lint

# Generate Automated Module Documentation
npm run docs:generate

# Run the complete local quality gate
npm test

# Run tests with enforced 100% coverage for the persistence service
npm run test:coverage

# Build for Production
npm run build

# Preview Production Build locally
npm run preview
```

The coverage gate currently enforces 100% statements, branches, functions, and lines for `src/services/dbIntegrationService.ts`. Browser-heavy visualizers, lazy-loaded views, Vite middleware, and service-worker behavior still require browser or integration test suites before a whole-application 100% claim is possible.

---

## 📖 Automated Documentation & Prompt Book

- **Automated Modules Catalog**: [`docs/MODULES_CATALOG.md`](docs/MODULES_CATALOG.md)
- **Technical Architecture Specification**: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **Master Prompt Book & Curriculum Engineering**: [`docs/PROMPT_BOOK.md`](docs/PROMPT_BOOK.md)

---

## Contributing

This is primarily a personal learning-content project, but fixes and clarifications are welcome:

1. Fork the repository and create a feature branch.
2. Run `npm run lint` (TypeScript strict check) and `npm test` before opening a PR.
3. Keep new content consistent with the existing C#-vs-Python comparison format used across chapters.
4. Open a pull request describing the change and the reasoning behind it.

---

## 👤 Project Information

- **Repository**: [https://gitlab.com/adityarachuri/pycsharplearningguide](https://gitlab.com/adityarachuri/pycsharplearningguide)
- **Issues & Security Reports**: via the repository&rsquo;s issue tracker

---

## License 📄

This project is open-source software licensed under the [MIT License](LICENSE).
