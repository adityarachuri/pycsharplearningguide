export interface Infographic {
  id: string;
  title: string;
  purpose: string;
  chart: string;
}

export const INFOGRAPHICS: Infographic[] = [
  {
    id: 'execution-pipeline',
    title: 'CPython Execution Pipeline',
    purpose: 'Shows the four stages source code passes through before it runs, and why Python still needs a compile step despite being "interpreted".',
    chart: `flowchart LR
    A["Source Code\n(.py file)"] --> B["Parser\nAST (Abstract Syntax Tree)"]
    B --> C["Compiler\nBytecode (.pyc)"]
    C --> D["Frame Evaluation\nceval.c interpreter loop"]
    D --> E["Program Output"]
    style A fill:#1e293b,stroke:#f59e0b,color:#f8fafc
    style B fill:#1e293b,stroke:#38bdf8,color:#f8fafc
    style C fill:#1e293b,stroke:#34d399,color:#f8fafc
    style D fill:#1e293b,stroke:#a78bfa,color:#f8fafc
    style E fill:#1e293b,stroke:#f43f5e,color:#f8fafc`
  },
  {
    id: 'gil-thread-contention',
    title: 'The GIL: One Thread at a Time',
    purpose: 'Illustrates why multiple Python threads take turns executing bytecode rather than running truly in parallel, and where the C# CLR differs.',
    chart: `sequenceDiagram
    participant T1 as Thread 1
    participant GIL as GIL (single token)
    participant T2 as Thread 2
    T1->>GIL: Acquire
    activate T1
    Note over T1: Executes Python bytecode
    T1-->>GIL: Release (after switch interval)
    deactivate T1
    T2->>GIL: Acquire
    activate T2
    Note over T2: Executes Python bytecode
    T2-->>GIL: Release
    deactivate T2
    Note over T1,T2: Only ONE thread runs Python bytecode at any instant — true parallelism needs multiprocessing or a C-extension that releases the GIL`
  },
  {
    id: 'sync-vs-async',
    title: 'Sync Threads vs. Async Event Loop',
    purpose: 'Contrasts .NET’s thread-pool-based concurrency with Python asyncio’s single-threaded cooperative event loop.',
    chart: `flowchart TB
    subgraph DOTNET [".NET Task Concurrency"]
      direction LR
      TA["Task A"] -.->|"thread pool"| CoreA["CPU Core 1"]
      TB["Task B"] -.->|"thread pool"| CoreB["CPU Core 2"]
    end
    subgraph PYTHON ["Python asyncio"]
      direction LR
      Loop["Event Loop\n(single thread)"] --> CA["Coroutine A\nawaits I/O"]
      Loop --> CB["Coroutine B\nawaits I/O"]
      Loop --> CC["Coroutine C\nawaits I/O"]
    end
    style DOTNET fill:#0f172a,stroke:#38bdf8
    style PYTHON fill:#0f172a,stroke:#f59e0b`
  },
  {
    id: 'package-management-timeline',
    title: 'The Python Packaging Timeline',
    purpose: 'Traces how Python dependency management evolved from plain pip to today’s uv, giving context for why the tooling landscape looks fragmented at first glance.',
    chart: `timeline
    title Python Packaging Evolution
    2008 : pip introduced
    2011 : virtualenv widely adopted
    2016 : pipenv (Pipfile + lock)
    2018 : poetry (pyproject.toml + lock)
    2021 : PEP 621 standardizes pyproject.toml metadata
    2024 : uv (Rust-based, all-in-one) reaches broad adoption`
  },
  {
    id: 'refcounting-vs-gc',
    title: 'Two-Layer Memory Reclamation',
    purpose: 'Visualizes how CPython combines immediate reference counting with a periodic generational collector, and how that differs from .NET’s single tracing GC.',
    chart: `flowchart TD
    A["Object created"] --> B{"ob_refcnt reaches 0?"}
    B -->|Yes, immediately| C["Freed deterministically\n(Py_DECREF)"]
    B -->|No — part of a cycle| D["Stays alive despite\nbeing unreachable"]
    D --> E["Generational gc module\nruns periodically"]
    E --> F["Cycle detected & collected"]
    style A fill:#1e293b,stroke:#94a3b8,color:#f8fafc
    style C fill:#1e293b,stroke:#34d399,color:#f8fafc
    style D fill:#1e293b,stroke:#f43f5e,color:#f8fafc
    style E fill:#1e293b,stroke:#a78bfa,color:#f8fafc
    style F fill:#1e293b,stroke:#34d399,color:#f8fafc`
  },
  {
    id: 'learning-roadmap',
    title: 'Your Learning Roadmap Through This Platform',
    purpose: 'A bird’s-eye map of how the curriculum groups connect, for orienting new learners on where to start and where each path leads.',
    chart: `flowchart LR
    A["I. Foundations\n& Architecture"] --> B["II. Synthesis\n& Comparative Pedagogy"]
    B --> C["III. Hands-On\nProject Blueprints"]
    C --> D["IV. Industry Vertical\nBlueprints"]
    D --> E["V. Engineering\n& Systems Practice"]
    E --> F["VI. Reference\n& AI/ML Frontier"]
    F --> G["VII. Industry Realities\n& Destiny"]
    A -.->|"practice anytime"| H["Programming Challenges\n& Coding Lab"]
    style A fill:#1e293b,stroke:#f59e0b,color:#f8fafc
    style H fill:#1e293b,stroke:#34d399,color:#f8fafc`
  }
];
