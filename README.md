# PyCSharp

> **Polyglot Systems & Technical Rosetta Stone**  
> *Learning Python from a C# developer's perspective.*

[![CI & Quality Gates](https://gitlab.com/adityarachuri/pycsharp/badges/main/pipeline.svg)](https://gitlab.com/adityarachuri/pycsharp/-/pipelines)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0.1-61dafb.svg)](https://react.dev)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.x_Strict-3178c6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.1-38bdf8.svg)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-10b981.svg)](public/manifest.json)
[![Code Owner](https://img.shields.io/badge/Code_Owner-adityarachuri%40outlook.com-blue.svg)](CODEOWNERS)

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

The platform is structured into **18 comprehensive, production-grade views**:

1. **Foundations, History & Creator's Ethos**: Guido van Rossum's origins at CWI, ABC language heritage, PEP 20 Zen of Python, and philosophical differences from Anders Hejlsberg's C# designs.
2. **CPython vs. CLR Runtime Internals**: Deep dive into the stack evaluation loop, frame evaluation (`PyEval_EvalFrameDefault`), bytecode disassembly (`dis`), and opcode dispatch.
3. **Core Language Deep Dives**: 10 essential systems deep dives covering Generators (`yield` vs `IEnumerable<T>`), Context Managers (`__enter__`/`__exit__` vs `IDisposable`), Decorators vs C# Attributes, and Dunder methods.
4. **Batteries Included Standard Library**: Comprehensive 1-to-1 comparison of standard libraries (`collections`, `itertools`, `functools`, `concurrent.futures`, `dataclasses`, `pathlib`, `json`).
5. **Data Structures & Algorithmic Performance**: Time and space complexity trade-offs between `list` (amortized dynamic arrays), `dict` (compact hash tables with collision probe), `set`, and C# collections (`List<T>`, `Dictionary<TKey, TValue>`).
6. **Workstation Setup & Enterprise Toolchain**: Modern Python development ecosystem configured with `uv`, `Ruff` (linter/formatter in Rust), `Pyright`, `.devcontainer`, and VS Code settings.
7. **Side-by-Side Rosetta Stone Matrix**: Searchable dictionary matching every C# idiom, pattern, LINQ query, async flow, and exception pattern to idiomatic Python equivalents.
8. **Advanced Concepts & Metaprogramming**: Metaclasses, `__new__` vs `__init__`, descriptor protocol, structural pattern matching (PEP 634), and async event loops (`asyncio`).
9. **Real-World Architectural Use Cases**: Microservices (FastAPI vs ASP.NET Core Minimal APIs), distributed job queues (Celery vs MassTransit/Hangfire), and CLI tooling.
10. **Technical Glossary & Disambiguation**: Exhaustive cross-language terminology disambiguating Pythonisms from .NET terminology.
11. **AI, Machine Learning & Data Engineering**: The Python AI ecosystem (NumPy, PyTorch, Hugging Face, LangChain) vs .NET ML.NET and Semantic Kernel.
12. **Transition Strategy & Enterprise Migration**: A structured 30-day playbook for .NET engineering organizations onboarding Python microservices and data pipelines.
13. **Researchers, PEP Citations & References**: Annotated directory of foundational PEPs (Python Enhancement Proposals), design notes, and academic benchmark papers.
14. **Future Horizons: Python 3.13 & Beyond**: Free-threaded Python without GIL (PEP 703), Tier-2 JIT compiler (PEP 744), subinterpreters (PEP 554/684), and modern performance milestones.
15. **Career & Polyglot Architect Positioning**: Strategic leadership guidance on positioning polyglot dual-stack C# and Python expertise in enterprise technology leadership.
16. **Interactive Synthesis & Final Assessment**: Comprehensive knowledge certification with interactive code challenges and competency tracking.

---

## ⚙️ Interactive Simulators & Visualizers

PyCSharp includes custom interactive simulations engineered with high visual precision:

- **Interactive GIL Concurrency Simulator**: Real-time simulation of OS threads contending for the CPython Global Interpreter Lock token, core utilization readouts, throughput counters, and zoomable thread state visualizers.
- **PyObject Memory Anatomy Inspector**: Interactive memory struct explorer exposing `PyObject_HEAD`, 64-bit reference counter, type pointers, cyclic GC dual-linked list (`PyGC_Head`), memory addresses, and zoom/pan controls.
- **Execution Pipeline Animator**: Step-by-step visualizer tracing Python code through Lexical Tokenizer, AST Parser, Bytecode Assembler (`ceval.c`), and execution outcomes.
- **Relational C# to Python Mindmap**: Interactive graph visualizer mapping .NET mental paradigms to Python constructs with touch gestures, panning, zoom in/out, and SVG exports.
- **Local Python Execution Sandbox**: Optional local development endpoint for testing syntax and exploring built-in functions. It is disabled by default and must never be exposed directly in production.

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
git clone https://github.com/adityarachuri/pycsharp.git
cd pycsharp

# Install dependencies
npm install

# Start local development server (binds to http://127.0.0.1:3000)
npm run dev

# Enable the optional local Python executor in a separate PowerShell session
$env:ENABLE_PYTHON_EXECUTION = "true"
npm run dev
```

---

## Usage

Once `npm run dev` is running, open `http://127.0.0.1:3000` and use the sidebar to jump between the 18 curriculum modules. Each module is a standalone React view — chapter completion, notes, and theme preference persist to `localStorage` via `src/services/dbIntegrationService.ts`. Press `Ctrl+K` / `Cmd+K` to open the searchable command palette, or use the floating action button to open the Interactive Python Sandbox.

---

## API

The Vite dev/preview server exposes a small set of local-only endpoints (see `vite.config.ts`), used by the in-app sandbox and sync drawer:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/execute-python` | `POST` | Runs a short Python snippet in a sandboxed subprocess. Disabled unless `ENABLE_PYTHON_EXECUTION=true` is set; never enable in a shared/production deployment. |
| `/api/db/status` | `GET` | Returns a simulated backend-database handshake payload (driver, schema version, compatible adapters). |
| `/api/db/sync` | `POST` | Accepts a JSON payload and echoes back a simulated sync acknowledgement; no data leaves the browser. |

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

## 👤 Code Owner & Maintainer

- **Author & Maintainer**: Aditya Rachuri  
- **Email**: [adityarachuri@outlook.com](mailto:adityarachuri@outlook.com)  
- **GitHub**: [@adityarachuri](https://github.com/adityarachuri)  
- **Repository**: [https://gitlab.com/adityarachuri/pycsharp](https://gitlab.com/adityarachuri/pycsharp)

---

## License 📄

This project is open-source software licensed under the [MIT License](LICENSE).
