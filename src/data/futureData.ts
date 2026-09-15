export interface FutureTrend {
  id: string;
  title: string;
  timeframe: string;
  status: 'In Progress' | 'Active Rollout' | 'Emerging' | 'Transformative';
  summary: string;
  technicalDetails: string;
  implicationsForArchitects: string;
}

export const FUTURE_TRENDS: FutureTrend[] = [
  {
    id: 'free-threaded-cpython',
    title: 'PEP 703: Free-Threaded CPython (No-GIL Era)',
    timeframe: '2024–2027 (Python 3.13 → 3.16)',
    status: 'Active Rollout',
    summary: 'The removal of the Global Interpreter Lock from CPython, unlocking true multi-core CPU scaling for multi-threaded Python programs.',
    technicalDetails: `Sam Gross's PEP 703 architecture uses mimalloc thread-safe memory allocations, biased reference counting, and immortal objects.
- Python 3.13 introduced experimental builds (e.g. \`python3.13t\`).
- Ecosystem packages (NumPy, SciPy, PyTorch, Polars) are currently shipping \`free-threaded\` wheel binaries.
- Once single-threaded performance overhead drops below ~5%, the Steering Council plans to transition free-threaded CPython to the universal default.`,
    implicationsForArchitects: 'Eliminates the historic architectural compromise of multiprocessing vs multithreading. C# architects can soon deploy thread-pool CPU concurrency in Python just like in .NET.'
  },
  {
    id: 'tier2-jit',
    title: 'Tier-2 Copy-and-Patch JIT Compiler',
    timeframe: '2024–2026 (Python 3.13+)',
    status: 'In Progress',
    summary: 'CPython’s native Just-In-Time compiler compiling bytecode traces into native machine code without the heavy compilation latency of LLVM.',
    technicalDetails: `Developed as part of the Microsoft-sponsored Faster CPython project led by Mark Shannon and Guido van Rossum.
- Tier 1: Specializing adaptive interpreter identifies hot bytecode loops and traces execution.
- Trace Optimizer: Deconstructs standard opcodes into fine-grained micro-operations (uops) and optimizes them (dead code removal, constant propagation, redundant check elimination).
- Copy-and-Patch JIT: Stitches pre-compiled machine code snippets together at runtime, generating native x86-64/ARM64 machine instructions with sub-millisecond compilation overhead.`,
    implicationsForArchitects: 'Continues closing the raw compute speed gap between interpreted Python and JIT-compiled runtimes like .NET Core and Java.'
  },
  {
    id: 'rust-tooling-revolution',
    title: 'The Rust-Accelerated Toolchain Renaissance',
    timeframe: '2023–Present',
    status: 'Transformative',
    summary: 'The rewriting of Python’s developer ecosystem (linting, formatting, package management, DataFrame engines) in high-performance Rust.',
    technicalDetails: `- **uv (Astral)**: Written in Rust, resolves and installs packages 10x–100x faster than pip, manages virtual environments, and installs Python interpreters natively.
- **Ruff (Astral)**: Replaces Flake8, Black, isort, and bandit with a single Rust binary executing in <50ms.
- **Polars**: Multi-threaded DataFrame engine written in Rust on top of Apache Arrow memory layout.
- **Pydantic v2**: Rebuilt on \`pydantic-core\` in Rust, accelerating JSON validation 5x–50x.
- **PyO3 & Maturin**: Frictionless bindings that make writing Rust extensions for Python feel as natural as writing native modules.`,
    implicationsForArchitects: 'Delivers the best of both worlds: Python’s unmatched expressiveness and API elegance on top, backed by Rust’s zero-cost abstractions and memory safety below.'
  },
  {
    id: 'webassembly-pyodide',
    title: 'WebAssembly (Wasm) & Client-Side Pyodide',
    timeframe: '2025–2028',
    status: 'Emerging',
    summary: 'Running the full CPython interpreter and scientific stack directly inside browser tabs and edge workers via WebAssembly.',
    technicalDetails: `Pyodide and Emscripten compile CPython to Wasm.
- Users can run NumPy, Pandas, Scikit-Learn, and pure Python algorithms directly in the browser with zero server infrastructure.
- Enables rich offline data applications, interactive educational platforms, and sandboxed plugin execution in SaaS platforms without container overhead.`,
    implicationsForArchitects: 'Enables client-side data analytics and offline web apps where compute happens on the user’s device, reducing cloud server compute bills.'
  },
  {
    id: 'ai-orchestration-moat',
    title: 'Python’s Indomitable AI Operating System Moat',
    timeframe: 'Current & Long-Term',
    status: 'Transformative',
    summary: 'Why Python will remain the universal orchestrator for artificial intelligence despite newer contenders (Mojo, Julia, Zig).',
    technicalDetails: `While languages like Mojo attempt to blend Python syntax with systems performance, Python’s moat is not syntax—it is a 30-year ecosystem of millions of C/C++ bindings, CUDA kernels, Hugging Face model cards, and scientific libraries.
- Python has become the "POSIX" of modern AI: the ubiquitous, standard coordination layer that orchestrates GPUs, vector databases, and neural models.`,
    implicationsForArchitects: 'Investing deeply in Python skills provides enduring career protection. Senior engineers who command both systems architecture and Python AI orchestration represent the most sought-after talent.'
  }
];
