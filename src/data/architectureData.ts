export interface RuntimeComparison {
  dimension: string;
  dotnetClr: string;
  cpython: string;
  architecturalImpact: string;
}

export const CLR_VS_CPYTHON: RuntimeComparison[] = [
  {
    dimension: 'Compilation Pipeline',
    dotnetClr: 'C# source compiles to MSIL (Common Intermediate Language) via Roslyn compiler into .dll/.exe PE assemblies.',
    cpython: 'Python source (.py) compiles via PEG parser into an Abstract Syntax Tree (AST), then into platform-independent Python Bytecode stored in .pyc files.',
    architecturalImpact: 'C# compilation validates types and syntax upfront; Python bytecode generation is fast and lightweight, deferring type checks to runtime execution.'
  },
  {
    dimension: 'Execution Engine',
    dotnetClr: 'CLR JIT Compiler (RyuJIT) compiles MSIL directly to native machine instructions (x64/ARM64) at runtime (tiered JIT: Tier 0 quick JIT, Tier 1 optimized).',
    cpython: 'Stack-based virtual machine evaluating bytecode instructions in a C loop (Python/ceval.c). Python 3.11+ uses Specializing Adaptive Interpreter; 3.13+ adds experimental copy-and-patch Tier-2 JIT.',
    architecturalImpact: 'C# achieves near-C++ machine execution speed; CPython emphasizes dynamic adaptability, simplicity, and instant script startup time.'
  },
  {
    dimension: 'Memory Layout & Types',
    dotnetClr: 'Distinct Value Types (struct, int, bool, Span<T>) on stack/registers without boxing; Reference Types (class, object) on managed heap with 16-byte object header.',
    cpython: 'Universal PyObject pointer on heap for EVERYTHING (even ints, bools, and floats). Every PyObject carries ob_refcnt (8 bytes) + *ob_type (8 bytes) minimum overhead.',
    architecturalImpact: 'C# enables high-density contiguous memory arrays (SIMD/cache locality). Python sacrifices raw byte compactness for uniform object model dynamism.'
  },
  {
    dimension: 'Garbage Collection',
    dotnetClr: 'Tracing, generational, compaction Mark-and-Sweep GC (Generations 0, 1, 2, plus Large Object Heap and Pinned Object Heap). Non-deterministic deallocation.',
    cpython: 'Dual-tier memory management: Primary Reference Counting (deterministic, immediate deallocation upon refcount == 0) + Secondary Generational Cyclic GC (Gen 0, 1, 2) for circular references.',
    architecturalImpact: 'Python immediately frees file descriptors and memory buffers when references drop to 0, whereas C# relies on deterministic using/IDisposable pattern.'
  },
  {
    dimension: 'Concurrency & Threading',
    dotnetClr: 'True OS preemptive multi-threading across all CPU cores. ThreadPool, Task Parallel Library (TPL), async/await with SynchronizationContext, lock/Monitor.',
    cpython: 'OS threads exist, but are bounded by the Global Interpreter Lock (GIL) in standard CPython. Only one thread executes Python bytecode at any moment. PEP 703 enables experimental free-threading in 3.13+.',
    architecturalImpact: 'For CPU-bound tasks in standard Python, developers rely on multiprocessing, Celery, or native C/Rust extensions (NumPy/Polars) which release the GIL.'
  },
  {
    dimension: 'Type System Philosophy',
    dotnetClr: 'Static, strong, nominal typing. Type identity is enforced by CLR metadata. Generics are reified at runtime (List<int> is distinct compiled type from List<string>).',
    cpython: 'Dynamic, strong, protocol-oriented (duck typing). Type annotations (PEP 484) are erased at runtime; generics are purely for static tools (mypy/pyright).',
    architecturalImpact: 'Python eliminates compilation ceremony, permitting rapid prototyping and polymorphic protocols without explicit interface declarations.'
  },
  {
    dimension: 'Native Interoperability (FFI)',
    dotnetClr: 'P/Invoke, DllImport, NativeAOT, C#/C++ C++/CLI bridge with marshalling rules.',
    cpython: 'C-API, ctypes, cffi, Cython, and PyO3 (Rust). Python’s low-friction C-API is the singular architectural reason why NumPy, PyTorch, and TensorFlow adopted Python.',
    architecturalImpact: 'Python acts as the supreme orchestration language over high-performance C, C++, and CUDA engines.'
  }
];

export const CPYTHON_VM_STEPS = [
  {
    step: 1,
    title: 'Lexing & PEG Parsing',
    description: 'Since Python 3.9, CPython uses a modern PEG (Parsing Expression Grammar) parser. It reads the source code and generates a Concrete Parse Tree, avoiding the lookahead constraints of the historical LL(1) parser.',
    csharpParallel: 'Roslyn Syntax Tree Lexer & Parser (Microsoft.CodeAnalysis.CSharp)'
  },
  {
    step: 2,
    title: 'AST & Symbol Table Generation',
    description: 'The parser transforms syntax into an Abstract Syntax Tree (AST). The compiler creates symbol tables to distinguish local variables (accessed via fast array indices in bytecode) from global/builtin lookups.',
    csharpParallel: 'Roslyn Semantic Model & Symbol Binding'
  },
  {
    step: 3,
    title: 'Bytecode Compilation & .pyc Cache',
    description: 'The AST compiles into Python bytecode instructions. The result is written to __pycache__/*.pyc with a timestamp and magic number to skip recompilation in subsequent runs.',
    csharpParallel: 'Roslyn emits IL (Intermediate Language) inside .dll assemblies'
  },
  {
    step: 4,
    title: 'Evaluation Loop (Python/ceval.c)',
    description: 'The runtime instantiates a PyFrameObject representing the execution stack. The central loop in ceval.c continuously dispatches opcodes (LOAD_FAST, BINARY_OP, CALL) via a computed goto table.',
    csharpParallel: 'CLR Execution Engine (CoreCLR JIT / Tiered compilation)'
  },
  {
    step: 5,
    title: 'Specializing Adaptive Interpreter (PEP 659)',
    description: 'Introduced in Python 3.11, bytecode opcodes observe runtime types over initial executions. If an operation consistently receives ints, generic opcodes (e.g. BINARY_OP) mutate in-place into specialized opcodes (e.g. BINARY_OP_ADD_INT) with inline caching.',
    csharpParallel: 'Tiered JIT (Tier 0 to Tier 1) and dynamic PGO (Profile-Guided Optimization) in RyuJIT'
  }
];

export const GIL_DEEP_DIVE = {
  title: 'The Global Interpreter Lock (GIL) & PEP 703',
  whatIsIt: 'The GIL is a mutual exclusion lock used by the CPython interpreter to synchronize thread execution, ensuring that only one thread can execute Python bytecode at a time, even on multi-core processors.',
  whyItWasCreated: `When Guido designed Python in the early 1990s, operating system threads were non-standard, and memory was managed through reference counting. To make reference counts thread-safe without the GIL, every single pointer assignment, collection read, and variable increment would require fine-grained locks, crippling single-threaded performance by 30%–50%.

The GIL solved this elegantly: a single global mutex granted safe access to the entire interpreter state, making C-extension integration trivial for early scientific packages like Numeric (NumPy's ancestor).`,
  practicalImplications: [
    'I/O-Bound Operations (Network, Disk, Database): The GIL is immediately released by CPython before entering blocking system calls. Multi-threaded Python is fully efficient for I/O concurrency.',
    'CPU-Bound Operations (Math, Data Crunching, ML): Python threads fight for the GIL, resulting in 0% multi-core scaling. For CPU-bound tasks in standard Python, developers use the multiprocessing module (separate OS processes with independent GILs) or offload to C/Rust extensions.',
    'Native C/C++/Rust Extensions: Libraries like NumPy, PyTorch, and Polars explicitly release the GIL (Py_BEGIN_ALLOW_THREADS) before running matrix multiplications or parallel loops across all CPU cores via OpenMP/CUDA.'
  ],
  pep703Breakthrough: `PEP 703: "Making the Global Interpreter Lock Optional in CPython" (Authored by Sam Gross, funded by Meta):
- Python 3.13 introduces the official experimental build flag: --disable-gil.
- Replaces coarse-grained GIL with mimalloc (thread-safe memory allocator), biased reference counting (distinguishing thread-local from shared objects), and immortal objects.
- Roadmap: Experimental in 3.13, supported in 3.14, targeted to become the default in future releases (3.15+).
- C# Parallel: Brings CPython closer to the native multithreading capability that .NET developers have enjoyed since .NET Framework 1.0.`
};

export const PYTHON_IMPLEMENTATIONS = [
  {
    name: 'CPython',
    language: 'C',
    description: 'The reference implementation of Python maintained by the Python Software Foundation. Defines the language standard, has 100% ecosystem compatibility, and powers 95%+ of all production systems.',
    bestFor: 'Production microservices, AI/ML pipelines, general enterprise software.'
  },
  {
    name: 'PyPy',
    language: 'RPython (Restricted Python)',
    description: 'An alternative implementation featuring an advanced Tracing Just-In-Time (JIT) compiler. Often runs pure-Python algorithmic and numerical code 4x–7x faster than CPython.',
    bestFor: 'Long-running pure Python compute jobs, game server backends without heavy C-extension dependencies.'
  },
  {
    name: 'IronPython',
    language: 'C# / .NET',
    description: 'Python running on the .NET Dynamic Language Runtime (DLR). Can directly instantiate C# classes, inherit from .NET interfaces, and consume NuGet packages within Python scripts.',
    bestFor: 'Embedding scripting inside existing .NET WPF, WinForms, or enterprise C# backend applications.'
  },
  {
    name: 'RustPython',
    language: 'Rust',
    description: 'A modern, safe Python 3 interpreter written in Rust. Designed for embedding into Rust applications and compiling to WebAssembly (Wasm) for sandboxed client-side execution.',
    bestFor: 'Wasm runtimes, embedded sandboxes, Rust-based tooling.'
  },
  {
    name: 'GraalPy',
    language: 'Java / GraalVM',
    description: 'Oracle’s high-performance Python implementation on the GraalVM polyglot platform. Supports interop with Java, Scala, and R.',
    bestFor: 'Mixed Java/Python enterprise ecosystems requiring high-throughput JVM sharing.'
  }
];
