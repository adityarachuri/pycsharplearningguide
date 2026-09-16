# PyCSharp – Comprehensive Prompt Book
> **A complete prompt engineering and architecture playbook for building the PyCSharp Polyglot Platform.**  
> *Repository:* [https://gitlab.com/adityarachuri/pycsharplearningguide](https://gitlab.com/adityarachuri/pycsharplearningguide)

---

## 📖 Introduction

This **Prompt Book** captures the complete conceptual, architectural, and design prompts used to build **PyCSharp** — the interactive Rosetta Stone and systems engineering curriculum for C#/.NET engineers learning Python.

Each prompt is structured with:
- **Role & Persona**
- **Objective & Scope**
- **Technical Specifications**
- **Expected Deliverables & Code Artifacts**
- **Verification & Quality Gates**

---

## 📑 Table of Prompts

### Phase I — Original Platform Genesis

1. [Prompt 1: Project Genesis & Polyglot Vision](#prompt-1-project-genesis--polyglot-vision)
2. [Prompt 2: CPython vs .NET CLR Deep Dive Curriculum](#prompt-2-cpython-vs-net-clr-deep-dive-curriculum)
3. [Prompt 3: Interactive GIL Concurrency Simulator](#prompt-3-interactive-gil-concurrency-simulator)
4. [Prompt 4: PyObject C-Struct Memory Anatomy Inspector](#prompt-4-pyobject-c-struct-memory-anatomy-inspector)
5. [Prompt 5: Execution Pipeline Animator (Lexer to Eval Loop)](#prompt-5-execution-pipeline-animator)
6. [Prompt 6: C# to Python Relational Mindmap Visualizer](#prompt-6-c-to-python-relational-mindmap-visualizer)
7. [Prompt 7: Batteries Included & Standard Library 1:1 Mapping](#prompt-7-batteries-included--standard-library-11-mapping)
8. [Prompt 8: Enterprise Toolchain & Workstation (uv, Ruff, Pyright)](#prompt-8-enterprise-toolchain--workstation)
9. [Prompt 9: In-Browser Python Sandbox & Execution REPL](#prompt-9-in-browser-python-sandbox--execution-repl)
10. [Prompt 10: PWA Offline Capabilities & Security Hardening](#prompt-10-pwa-offline-capabilities--security-hardening)
11. [Prompt 11: Production Quality Gates & GitHub CI Automation](#prompt-11-production-quality-gates--github-ci-automation)

### Phase II — "Online Python Bible" Curriculum Expansion

12. [Prompt 12: Systems & Engineering Practice Chapters](#prompt-12-systems--engineering-practice-chapters)
13. [Prompt 13: Industry Vertical Blueprints (FinTech & HealthTech)](#prompt-13-industry-vertical-blueprints-fintech--healthtech)
14. [Prompt 14: AI/ML Fundamentals Chapter](#prompt-14-aiml-fundamentals-chapter)

### Phase III — Final Engineering & Production Readiness Specification

15. [Prompt 15: Educational Disclaimer, Attribution Removal & Landing Page](#prompt-15-educational-disclaimer-attribution-removal--landing-page)
16. [Prompt 16: Visual Learning — Infographics & Expanded Mind Maps](#prompt-16-visual-learning--infographics--expanded-mind-maps)
17. [Prompt 17: Innovative Pedagogy — Language Analogy & Art/Poetry/Music](#prompt-17-innovative-pedagogy--language-analogy--artpoetrymusic)
18. [Prompt 18: Coding Lab — Challenges & Secure Browser-Based Python Sandbox](#prompt-18-coding-lab--challenges--secure-browser-based-python-sandbox)
19. [Prompt 19: Progress Tracking, Case Studies & Multi-Generational UX Review](#prompt-19-progress-tracking-case-studies--multi-generational-ux-review)
20. [Prompt 20: External Link Audit, Responsive Design, Web Standards & Accessibility](#prompt-20-external-link-audit-responsive-design-web-standards--accessibility)
21. [Prompt 21: Security Hardening, Performance Optimization & Documentation Refresh](#prompt-21-security-hardening-performance-optimization--documentation-refresh)
22. [Prompt 22: Test Strategy, Requirements Coverage Matrix & Readiness Declaration](#prompt-22-test-strategy-requirements-coverage-matrix--readiness-declaration)

### Phase IV — Independent QA Engagement & New Chapter

23. [Prompt 23: Deep Learning Chapter & Independent End-to-End QA Pass](#prompt-23-deep-learning-chapter--independent-end-to-end-qa-pass)

### Phase V — UI/UX Refinement & Project Finalization

24. [Prompt 24: Fixed App Shell, Mindmap Redesign & Certificate Styling](#prompt-24-fixed-app-shell-mindmap-redesign--certificate-styling)
25. [Prompt 25: Documentation Overhaul, Content Proofreading & Final Release Gate](#prompt-25-documentation-overhaul-content-proofreading--final-release-gate)

---

## Prompt 1: Project Genesis & Polyglot Vision

```markdown
You are a Principal Polyglot Systems Architect with deep expertise in Microsoft .NET (C#) runtime internals (CLR, RyuJIT, Roslyn) and the Python ecosystem (CPython, PEPs, GIL, Tier-2 JIT).

Objective:
Architect a modern single-page application named "PyCSharp" with the tagline:
"Polyglot Systems & Technical Rosetta Stone - Learning Python from a C# developer's perspective".

Requirements:
1. Avoid treating Python as a beginner scripting language; approach it from a senior systems engineering perspective.
2. Build an interactive curriculum comparing language runtimes, memory management, garbage collection, concurrency, type systems, and ecosystem tooling.
3. Use modern React 19, TypeScript (strict mode), Vite, Tailwind CSS v4, Motion, and Recharts.
4. Establish a dark, high-contrast, terminal-inspired design system with amber and slate accents, crisp typography (Fira Code, Space Grotesk, Plus Jakarta Sans), and zero visual clutter.
5. Create a modular architecture splitting curriculum datasets, interactive visualizers, navigation sidebars, and chapter views.
```

---

## Prompt 2: CPython vs .NET CLR Deep Dive Curriculum

```markdown
Design a rigorous technical module comparing the internal execution pipelines of CPython and the .NET Common Language Runtime (CLR).

Topics to cover in detail:
1. Compilation & Execution:
   - C# Roslyn compilation to CIL (Common Intermediate Language) vs Python compilation to bytecode (.pyc).
   - RyuJIT dynamic tiered compilation (Tier 0, Tier 1, Dynamic PGO) vs CPython stack evaluation loop (PyEval_EvalFrameDefault) and Python 3.13 Tier-2 JIT (PEP 744).
2. Opcode Disassembly:
   - Provide real side-by-side disassembly: IL instructions (ldarg.0, add, ret) vs Python dis opcodes (LOAD_FAST, BINARY_OP, RETURN_VALUE).
3. Memory Representation:
   - C# Object Header (MethodTable pointer + SyncBlockIndex) + fields vs CPython PyObject (ob_refcnt 64-bit + ob_type pointer).
   - Explain why an integer in Python takes 28 bytes while a C# int is 4 bytes.
4. Concurrency Model:
   - .NET preemptive multi-threading on true OS threads vs CPython Global Interpreter Lock (GIL) and free-threaded Python (PEP 703).
```

---

## Prompt 3: Interactive GIL Concurrency Simulator

```markdown
Build an interactive visual simulator demonstrating how the CPython Global Interpreter Lock (GIL) impacts multi-threaded CPU-bound performance vs I/O-bound performance.

Specifications:
1. Visual Canvas:
   - Render 2 or more threads competing for the single GIL mutex token.
   - Display state machine for each thread: RUNNING (holding GIL), WAITING (blocked on mutex), or SLEEPING (I/O wait).
2. CPU Core Allocation:
   - Render 4 CPU cores. In CPU-bound mode, show Core 1 pegged at ~98-100% while Cores 2-4 idle at 2-5%, despite multiple threads running.
3. Mode Toggle:
   - CPU-bound simulation (heavy numeric loops, GIL thrashing, zero multi-core speedup).
   - I/O-bound simulation (GIL released during sleep/socket/file operations, achieving concurrent concurrency).
   - PEP 703 Free-Threaded mode (GIL disabled, all 4 cores saturated with ~95% throughput).
4. Controls:
   - Start / Pause execution.
   - Step speed adjustment.
   - Zoom controls (Zoom In, Zoom Out, percentage readout, and Reset).
```

---

## Prompt 4: PyObject C-Struct Memory Anatomy Inspector

```markdown
Engineer an interactive memory layout inspector showing how Python represents objects in C memory (`PyObject` and `PyVarObject`).

Requirements:
1. C-Struct Representation:
   - Render the memory block with byte offsets (0x00 to 0x18+):
     - `uint64_t ob_refcnt` (Reference count)
     - `PyTypeObject* ob_type` (Pointer to type descriptor)
     - `PyGC_Head` (Dual-linked list pointers `_gc_next`, `_gc_prev` for cyclic GC)
     - Value payload (e.g., long digits array for `int`, UTF-8 data for `str`).
2. Interactive Controls:
   - "Add Alias / Reference" button -> increments `ob_refcnt` dynamically.
   - "Delete Alias / Variable" button -> decrements `ob_refcnt`.
   - "Create Cyclic Reference" button -> creates `a.cycle = a`, demonstrating circular graphs where `ob_refcnt` never hits 0.
   - "Trigger Generational GC" button -> visualizes cyclic detection algorithm freeing isolated graphs.
   - Zoom in/out controls with percentage indicator.
```

---

## Prompt 5: Execution Pipeline Animator

```markdown
Create an animated step-by-step pipeline component illustrating how Python source code executes:

Pipeline Stages:
1. Source Code Input (Python snippet).
2. Tokenizer / Lexer (Lexical tokens: NAME, OP, NUMBER, NEWLINE).
3. Parser & AST (Abstract Syntax Tree generation via Python PEG parser).
4. Bytecode Compiler (Compilation into PyCodeObject with opcodes, co_consts, co_names).
5. Evaluation Loop (CPython ceval.c stack virtual machine / Python 3.13 Tier-2 copy-and-patch JIT).

Features:
- Step-by-step advancement with next/previous controls.
- Active stage highlighting with architectural explanations for each phase.
```

---

## Prompt 6: C# to Python Relational Mindmap Visualizer

```markdown
Develop an interactive topological mindmap showing how mental paradigms map between .NET and Python.

Clusters:
1. Type System (C# nominal static typing -> Python dynamic duck typing & Protocols).
2. Memory & Lifecycles (C# IDisposable/using -> Python context managers with __enter__/__exit__).
3. Concurrency (C# Task Parallel Library/async -> Python asyncio and ProcessPoolExecutor).
4. Functional & Collections (C# LINQ/IEnumerable<T> -> Python list comprehensions & generators).
5. OOP (C# Interfaces & Virtual Methods -> Python Abstract Base Classes & Dunder methods).
6. Toolchain (C# .csproj & NuGet -> Python pyproject.toml & uv).

Capabilities:
- Pinch-to-zoom, pan, touch gestures, and keyboard navigation.
- Node inspection modal displaying syntax comparisons and architectural tips.
- SVG export functionality.
```

---

## Prompt 7: Batteries Included & Standard Library 1:1 Mapping

```markdown
Create a comprehensive reference module matching Python's standard library modules directly against .NET BCL (Base Class Library) namespaces:

Mappings:
- `collections.defaultdict` / `Counter` <-> `System.Collections.Generic.Dictionary<TKey, TValue>`
- `itertools` <-> `System.Linq.Enumerable`
- `concurrent.futures` <-> `System.Threading.Tasks.Task`
- `dataclasses` <-> C# `record` types
- `pathlib` <-> `System.IO.Path` / `FileInfo`
- `asyncio` <-> `async`/`await` + `TaskCompletionSource`
- `unittest` / `pytest` <-> `xUnit` / `NUnit`

Each entry must include:
- Conceptual bridge.
- Side-by-side syntax comparison.
- Performance characteristics & caveats.
```

---

## Prompt 8: Enterprise Toolchain & Workstation

```markdown
Generate an enterprise workstation setup guide replicating a professional .NET developer experience in Python:

Tooling:
1. Package Manager: `uv` (Astral's Rust-based drop-in replacement for pip/poetry, delivering sub-second resolution).
2. Linter & Formatter: `Ruff` (replacing Black, Flake8, isort with 10-100x performance in Rust).
3. Type Checker: `Pyright` (Microsoft's high-performance static type engine matching Roslyn's developer feedback loop).
4. VS Code configuration: `.vscode/settings.json`, recommended extensions, and `.devcontainer/devcontainer.json`.
5. Configuration files: Production-ready `pyproject.toml` with strict ruff and pyright settings.
```

---

## Prompt 9: In-Browser Python Sandbox & Execution REPL

```markdown
Build a built-in interactive Python sandbox modal allowing users to test code snippets directly within the browser:

Features:
1. Code Editor: Syntax-highlighted input with tabs for quick templates (Generators, Context Managers, Dunder Methods, Async).
2. REPL Output Console: Monospace terminal simulation with stdout/stderr capture and execution timing.
3. Reset, Clear, and Copy actions.
4. Pre-populated educational snippets demonstrating Python paradigms for C# developers.
```

---

## Prompt 10: PWA Offline Capabilities & Security Hardening

```markdown
Implement enterprise-grade progressive web app (PWA) offline capabilities and security configurations:

Requirements:
1. Service Worker (`public/service-worker.js`):
   - Pre-caching of core application shells and icons.
   - Stale-While-Revalidate caching strategy for network resilience.
   - Offline fallback support.
2. Web App Manifest (`public/manifest.json`):
   - Standalone display mode, dark background theme, custom shortcuts, and maskable icons.
3. Security Headers:
   - Content Security Policy (CSP) authorizing safe Google fonts, styles, and iframe embedding.
   - HTTP Strict Transport Security (HSTS).
   - RFC 9116 security declaration (`.well-known/security.txt`).
   - Anti-MIME sniffing (`X-Content-Type-Options: nosniff`).
```

---

## Prompt 11: Production Quality Gates & GitHub CI Automation

```markdown
Configure the repository for continuous integration and automated quality validation:

Workflows:
1. `.github/workflows/ci.yml`:
   - Runs on push to `main` and pull requests.
   - Executes TypeScript compiler check (`tsc --noEmit`).
   - Verifies automated documentation scripts.
   - Executes Vite production build (`vite build`) and validates artifacts.
2. `.github/workflows/documentation.yml`:
   - Automatically runs `node scripts/generate-docs.mjs` on code changes.
   - Commits and pushes synchronized module catalogs.
3. Repository Governance:
   - `.github/CODEOWNERS`: Global code ownership defined per repository policy.
   - `LICENSE`: MIT License.
   - `README.md`: Exhaustive architectural documentation with live badges.
```

> **Note on CI provider:** the pipeline was later migrated from GitHub Actions to GitLab CI
> (`.gitlab-ci.yml`) when the repository's canonical remote moved to GitLab — see Prompt 21.
> The job responsibilities described above (typecheck, coverage, build, doc-sync verification)
> carried over unchanged; only the YAML dialect and hosting platform changed.

---

# Phase II — "Online Python Bible" Curriculum Expansion

With the original 16-chapter platform stable, the next phase deliberately expanded scope: rather
than remaining a focused C#-to-Python comparison guide, the platform was directed to become a
comprehensive, standalone Python reference — "an online Python bible" — while preserving the
existing Rosetta Stone comparison format as the connective thread through every new chapter.

## Prompt 12: Systems & Engineering Practice Chapters

```markdown
Add four new chapters covering the parts of professional Python engineering the existing
curriculum had not yet reached: the standard library in depth, web/API frameworks, the
testing/packaging/deployment lifecycle, and CPython's own internals.

Requirements:
1. Standard Library Deep Dive — itertools, dataclasses, pathlib, asyncio, and other
   "batteries included" modules not already covered by the earlier Libraries & Batteries
   chapter, each with a C# BCL comparison.
2. Web & API Frameworks — FastAPI and ASGI internals contrasted with ASP.NET Core Minimal
   APIs and Kestrel; SQLAlchemy 2.0 async patterns contrasted with EF Core.
3. Testing, Packaging & Deployment — pytest fixtures/parametrization/mocking contrasted with
   xUnit/NUnit; uv-based packaging; multi-stage Docker builds.
4. Python Internals & CPython — bytecode, the import system, the descriptor protocol, and
   garbage collection internals, going deeper than the existing Architecture Deep Dive chapter.

Each new chapter must follow the established view/data-file split (one `src/data/*.ts` dataset,
one `src/views/*View.tsx` component), wire into `SECTIONS_ORDER`, `NAV_GROUPS`, and the `PageId`
union, and pass the existing quality gates (`tsc --noEmit`, `vitest run`, `vite build`) before
being considered complete.
```

## Prompt 13: Industry Vertical Blueprints (FinTech & HealthTech)

```markdown
Extend the existing two hands-on project blueprints (Full-Stack Web App, Production AI/ML App)
with domain-specific industry verticals, each demonstrating an end-to-end Python stack applied to
real business processes and workflows in a regulated industry.

Scope decision (resolved via direct user confirmation): cover FinTech and HealthTech, two pages
per domain — a Business Context page (core business processes, compliance constraints, workflow
narrative) and a Technical Implementation page (the actual Python architecture solving that
domain's problems).

Requirements:
1. FinTech: payments, fraud scoring, ledgers, and compliance from the industry perspective
   (Business Context), then idempotent charge processing, ONNX-based fraud scoring, and
   reconciliation pipelines (Technical Implementation).
2. HealthTech: FHIR, de-identification, and HIPAA audit trails from the industry perspective
   (Business Context), then a FHIR API implementation, Safe Harbor de-identification logic, and
   audit middleware (Technical Implementation).
3. Both verticals must carry an explicit, prominent disclaimer that the content is an
   architectural teaching example, not legal/compliance/financial/medical advice and does not
   represent an audited or certified implementation of any real regulation.
```

## Prompt 14: AI/ML Fundamentals Chapter

```markdown
Before the existing AI/ML Engineering Stack chapter (frameworks, GPU orchestration, GenAI
tooling), add a foundational chapter covering the vectorization/broadcasting mental model every
engineer needs before touching a tensor — the layer underneath the frameworks, not the
frameworks themselves.

Requirements:
1. "Why Python Wins" — debunk the "Python is slow" objection specifically for numeric/ML
   workloads: vectorization dispatches into compiled C, the GIL doesn't block C-extension
   kernels, and the ecosystem-gravity argument (NumPy's array protocol as the de facto standard).
2. Core concepts, each with a C# comparison: vectorization vs. explicit loops, NumPy
   broadcasting rules, Pandas DataFrames vs. LINQ-over-collections, and fixed-width dtypes vs.
   Python's normally-dynamic typing.
3. The scientific Python toolchain — Jupyter, NumPy, Pandas, SciPy, Matplotlib, Scikit-Learn —
   each with an honest C#/.NET analogue assessment (including where no close analogue exists).
```

---

# Phase III — Final Engineering & Production Readiness Specification

The platform's authors issued a single, comprehensive 31-section specification
(`docs/Python Learning Platform — Final Engineering & Production Readiness Prompt.md`) covering
everything from a landing page and new pedagogy experiences through a full production-readiness
audit. It was executed as one continuous engagement; the prompts below group its sections into
the order they were actually implemented and verified.

## Prompt 15: Educational Disclaimer, Attribution Removal & Landing Page

```markdown
1. Ensure a clear, prominent educational disclaimer exists site-wide: independent/non-commercial
   status, no PSF/Microsoft affiliation, trademark notices, a warranty disclaimer on benchmark
   claims, and an explicit "not legal/compliance/financial/medical advice" notice covering the
   regulated-industry chapters.
2. Remove personal attribution throughout the codebase and its generated documentation — replace
   individual-name references with organizational/placeholder attribution in metadata, JSON-LD,
   the footer, and sample data files — while preserving the LICENSE's copyright holder.
3. Build a dedicated landing/home page: hero section, "who this is for / why it exists / what
   makes it different," a map of all seven curriculum groups, a 4-step "how the learning journey
   works" walkthrough, a showcase of the three innovative learning approaches, and a "where to
   start" call to action. Wire it as the app's default route.

Never fabricate facts, statistics, citations, or claims anywhere in this work.
```

## Prompt 16: Visual Learning — Infographics & Expanded Mind Maps

```markdown
1. Add a dedicated Infographics page: standalone Mermaid-diagram visual references for
   mechanics already covered in depth elsewhere in the curriculum (the CPython execution
   pipeline, GIL thread contention, sync vs. async, the packaging-tooling timeline, reference
   counting vs. GC, and a learning-roadmap overview diagram).
2. Expand the existing relational mindmap with new domains and nodes covering material not yet
   represented there: first-class functions & closures, decorators, testing/mocking frameworks,
   static type checking, and the web request lifecycle / DataFrame-vs-LINQ / ML training loop
   triad.
```

## Prompt 17: Innovative Pedagogy — Language Analogy & Art/Poetry/Music

```markdown
Design two alternative, non-C#-comparison learning experiences as parallel on-ramps for readers
who don't think in terms of an existing programming language:

1. "Learn Python Like a Language" — map Python concepts onto natural-language structure
   (vocabulary → keywords, grammar → syntax rules, nouns → variables, verbs → functions,
   sentences → statements, conversation → program flow), each pairing with real, runnable code.
2. "Python as Art" — map Python concepts onto artistic composition (motifs, rhythm,
   choreography, visual composition, poetic patterns, improvisation).

Both must carry an explicit, unmissable disclaimer that the analogy is a learning aid, not a
technical equivalence, plus a per-analogy "where this breaks down" caveat — an analogy that
overclaims is worse than no analogy.
```

## Prompt 18: Coding Lab — Challenges & Secure Browser-Based Python Sandbox

```markdown
Build a real programming-challenges experience backed by genuine, client-side Python execution —
not a simulated or server-executed sandbox.

Sandbox requirements:
1. Run actual CPython via Pyodide (WebAssembly) inside a dedicated Web Worker. No server-side
   execution endpoint of any kind — code never leaves the browser.
2. Enforce a hard execution timeout (Worker.terminate(), the only reliable way to stop a
   synchronous infinite loop) and an output-size cap.
3. Self-host the Pyodide runtime rather than loading it from a third-party CDN, to keep the
   site's strict same-origin CSP intact.

Challenge requirements:
1. At least three difficulty tiers (Beginner/Intermediate/Advanced) spanning fundamentals, DSA,
   OOP, error handling, real-world scenarios, debugging, and refactoring.
2. Each challenge ships hidden test cases (not visible to the learner), a progressive hint
   system, and a reference solution with complexity analysis revealed only after passing.
3. Evaluation must run the learner's real code against the real hidden tests inside the same
   sandbox and report genuine pass/fail results — never fabricate or hardcode a "passed" state.
```

## Prompt 19: Progress Tracking, Case Studies & Multi-Generational UX Review

```markdown
1. Persist chapter-completion state and challenge-attempt history client-side (localStorage),
   surfaced as an overall course-progress indicator and a per-chapter completion toggle.
2. Add an Enterprise Use Cases chapter covering real-world architectural scenarios (FinTech
   quantitative risk, GenAI/RAG knowledge graphs, Big Data with Polars, scientific computing)
   distinct from the FinTech/HealthTech project blueprints.
3. Review the platform for comfort across learner age groups and experience levels: typography,
   contrast, spacing, navigation, content density, and terminology support (a dedicated glossary
   chapter) — without infantilizing any audience. The design must stay professional and
   intellectually engaging throughout.
```

## Prompt 20: External Link Audit, Responsive Design, Web Standards & Accessibility

```markdown
1. Enumerate every external URL and academic citation in the codebase and validate each one by
   an actual HTTP request (not an assumption). Fix or honestly flag anything broken — including
   checking the project's own repository links against its real git remote, not just an assumed
   URL.
2. Validate responsive behavior across small-mobile through large-desktop viewports with
   documented evidence (not a bare "it's responsive" claim) — fix any real horizontal-overflow
   defects found, and record the root cause of each.
3. Audit semantic HTML, ARIA usage, form labeling, keyboard operability (including Escape-to-close
   on every modal and a skip-to-content link), and metadata/SEO fundamentals.
4. Audit accessibility against WCAG guidance: heading hierarchy, color contrast, focus indicators,
   reduced-motion support, and touch targets. Record actual audit results and any exceptions —
   never claim coverage without evidence.
```

## Prompt 21: Security Hardening, Performance Optimization & Documentation Refresh

```markdown
1. Run a dependency vulnerability scan and review the CSP/security-header configuration for both
   the local dev server and any real production static-hosting target (the dev-server-only
   header middleware does not protect a real deployment by itself).
2. Measure real Core Web Vitals-adjacent metrics (CLS, initial payload size) against the actual
   production build — not the dev server — and fix any genuine regressions found, backed by
   before/after measurements.
3. Refresh every piece of documentation (README, architecture spec, agent-facing conventions
   doc) to match the platform's current, real state — chapter counts, module counts, and
   architectural descriptions must be re-verified against the codebase, not carried forward from
   memory.
4. Migrate the CI/CD pipeline from GitHub Actions to GitLab CI to match the project's actual
   canonical remote, and fix every documentation reference that still pointed at the old,
   nonexistent GitHub location.
```

## Prompt 22: Test Strategy, Requirements Coverage Matrix & Readiness Declaration

```markdown
1. Execute a comprehensive test strategy: functional navigation, the coding sandbox's execution
   boundary (timeouts, resource limits, invalid code, infinite loops, excessive output), the DSA
   challenge evaluator (correct/incorrect/edge-case/hidden-test behavior), responsive behavior,
   accessibility, security, and the production build.
2. Target 100% test success. If anything fails: identify the root cause, fix the implementation,
   re-run the relevant tests, then the complete suite, and record the result. Never delete a
   failing test to obtain a green build, disable validation, or reduce coverage to pass.
3. Produce a requirements-to-evidence coverage matrix — every requirement in this specification
   must have implementation status, test status, and evidence before being marked complete.
4. Compile an evidence and audit trail (test reports, measurements, validation records, build
   results) and issue a final, explicit classification: either 🟢 PRODUCTION READY or
   🔴 NOT PRODUCTION READY. Do not declare readiness based on subjective judgment — every claim
   must trace to a command or script that was actually run.

Standing constraint for this entire engagement: never git commit, push, or create a pull request.
```

---

# Phase IV — Independent QA Engagement & New Chapter

## Prompt 23: Deep Learning Chapter & Independent End-to-End QA Pass

```markdown
1. Fix a specific, user-reported regression: a Mermaid sequence diagram on the Infographics page
   still fails to render. Investigate the actual root cause (don't just reapply the same fix) and
   harden it against recurrence, then sweep the codebase for the same risk pattern elsewhere.

2. Add a new chapter: "Deep Learning with Python — From ML Engineer to ML Researcher," covering
   neural-network foundations (perceptron→MLP, backpropagation as reverse-mode autodiff, gradient
   descent/Adam, each with a C#/TorchSharp comparison matching the established Rosetta Stone
   format), the three foundational architecture families (CNN, RNN/LSTM, Transformer), and a full
   comparison of the ML Engineer and ML Researcher career tracks across career-relevant
   dimensions, plus how each track actually works day to day (research practice vs. engineering
   practice).

3. Test the entire application end-to-end as an independent third-party testing agency would:
   build fresh automated tooling (not a re-assertion of earlier findings), cover every page's
   navigation, every interactive surface (search, sandbox, challenges, simulators, modals), color
   contrast against the actual WCAG formula in every theme, and an accessibility-tree/keyboard
   proxy check. Fix every real defect found, retest, and produce a detailed report with severity,
   root cause, fix, and retest evidence for each finding — then issue an updated, honestly-scoped
   production-readiness determination.
```

---

# Phase V — UI/UX Refinement & Project Finalization

## Prompt 24: Fixed App Shell, Mindmap Redesign & Certificate Styling

```markdown
1. The mindmap visualizer renders its full node graph at a fixed pixel size larger than its
   container, requiring a scrollbar to see the whole map. Redesign it to auto-fit the entire
   graph inside its container at all times — no scrolling required to see the complete mindmap —
   while preserving the existing zoom/pan controls and node-inspection interaction.

2. The printed/exported completion certificate is visually flat (plain white background, thin
   gray border). Redesign it with a professional color-coded theme suitable for a real
   certificate — while keeping the underlying print-isolation behavior (only the certificate
   prints, not the surrounding page) intact.

3. The page header (including the site logo) and the left navigation sidebar currently scroll
   away with the page content. Restructure the app shell so the header and sidebar are fixed in
   place and only the main content area scrolls internally. Move the "Overall Course Progress"
   indicator from the sidebar footer to the top of the content area, and make it stick to the top
   of that scrolling region as well.

Re-verify the full accessibility/contrast/heading-hierarchy/navigation regression suite from
Prompt 23 after these changes — a purely visual refactor can still introduce real regressions.
```

## Prompt 25: Documentation Overhaul, Content Proofreading & Final Release Gate

```markdown
1. Generate and maintain a detailed prompt book documenting the project's full history — every
   phase of work, structured the same way as the original genesis prompts (role, objective,
   requirements, deliverables) — so a new contributor or a future engagement can understand how
   the platform reached its current state without re-deriving it from the codebase alone.

2. Update every project document and generated artifact (README, architecture specification,
   agent-facing conventions doc, the auto-generated module catalog, the production-readiness
   audit trail) to reflect the current, real state of the codebase — re-verified, not carried
   forward.

3. Proofread the platform's content for accuracy: re-check factual claims, version numbers, and
   counts that are cheap to verify mechanically or against authoritative sources; be explicit
   about the boundary between what was actually re-verified in this pass and what was authored
   with care earlier but not re-checked line-by-line in this pass.

4. Test end-to-end including the CI/CD pipeline itself (not just the app) — validate the pipeline
   configuration actually reflects the project's real toolchain and canonical remote, and that
   every job it runs (typecheck, coverage, build, doc-sync verification) genuinely passes.

5. Clean up the project structure and leave the repository in a state that is genuinely ready
   for a commit and production deployment — every quality gate green, every known issue either
   fixed or explicitly documented as a deferred decision, and nothing committed, pushed, or
   opened as a pull request during the engagement itself.
```
