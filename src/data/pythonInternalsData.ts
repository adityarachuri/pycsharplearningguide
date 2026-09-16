import { DeepDiveFeature } from '../types';

export interface InternalsVerdictPoint {
  id: string;
  claim: string;
  reality: string;
}

export const PYTHON_INTERNALS_VERDICT =
  'CPython is not "just an interpreter" in the naive sense — since 3.11 it compiles to bytecode, specializes hot bytecode instructions adaptively at runtime (PEP 659), and increasingly JIT-compiles from 3.13 onward, converging toward the same tiered-compilation strategy the CLR has used with RyuJIT for years.';

export const PYTHON_INTERNALS_VERDICT_POINTS: InternalsVerdictPoint[] = [
  {
    id: 'bytecode-not-source',
    claim: '"Does Python re-parse the .py source file every single run?"',
    reality:
      'No — CPython compiles source to bytecode (`.pyc` files, cached under `__pycache__/`) once, then the interpreter’s evaluation loop (`PyEval_EvalFrameDefault` in `ceval.c`) executes that bytecode. This is architecturally the same two-step shape as C# compiling to IL, then the CLR JITting that IL — Python’s bytecode step just isn’t further JIT-compiled to native machine code by default (prior to the experimental 3.13 JIT).'
  },
  {
    id: 'import-system-caching',
    claim: '"Why does modifying a running module’s file sometimes not take effect until restart?"',
    reality:
      "Python's import system caches every imported module in `sys.modules` keyed by name; a second `import foo` anywhere in the process returns the cached module object instantly rather than re-executing `foo.py` — conceptually similar to how an assembly, once loaded into an `AppDomain`, isn't re-JITted on a second reference. This is exactly why edited module source has no effect on an already-running process without an explicit `importlib.reload()` or process restart."
  },
  {
    id: 'descriptors-power-properties',
    claim: '"Is @property just Python\'s version of a C# auto-property?"',
    reality:
      'Under the hood, `@property` is a thin, built-in application of the *descriptor protocol* — any object implementing `__get__`/`__set__`/`__delete__` can intercept attribute access on a class, which is also how `@staticmethod`, `@classmethod`, and even plain instance methods (bound method creation) work internally. C#’s properties are a language/compiler feature with no equivalent user-extensible protocol; Python exposes the *general mechanism* properties are built from.'
  },
  {
    id: 'pymalloc-vs-gc',
    claim: '"Since Python has a GC, is memory management basically the same as .NET\'s?"',
    reality:
      "CPython's primary reclamation strategy is deterministic reference counting — an object is freed the instant its refcount hits zero, not at some later collector pass. The `gc` module's generational collector only exists to catch reference *cycles* (objects that reference each other and would never reach refcount zero otherwise); it complements refcounting rather than replacing it. .NET's GC, by contrast, is the *sole* reclamation mechanism — there's no reference counting layer underneath it at all."
  }
];

export const PYTHON_INTERNALS_CONCEPTS: DeepDiveFeature[] = [
  {
    id: 'bytecode-compilation',
    number: 1,
    title: 'Source → AST → Bytecode → Frame Evaluation',
    tagline: "CPython's compilation pipeline, inspectable at every stage from your own code",
    csharpEquivalent: 'Roslyn compiling C# source to IL, which the CLR JITs to native machine code at method-call time',
    whyItMatters: "C# developers already think in two stages (compile-to-IL, then JIT-to-native) because the tooling makes both visible. Python's equivalent pipeline (source → AST → bytecode) is just as real, but stays invisible unless you deliberately inspect it — which is worth doing once, because it demystifies why certain Python idioms (unpacking, comprehensions, `with` blocks) compile to specific, sometimes surprisingly efficient, bytecode sequences.",
    csharpApproach: 'Use `ildasm`/`dotnet-ildasm` (or ILSpy) to inspect the IL a C# method compiles to; the JIT’s further native-code output is normally invisible without a profiler or `DOTNET_JitDisasm`.',
    pythonApproach: 'Use the built-in `dis` module to disassemble any function’s bytecode directly, or `ast.dump(ast.parse(source))` to inspect the parsed syntax tree one stage earlier.',
    csharpCode: `// C#: inspect IL for a simple method
public static int Square(int x) => x * x;

// dotnet-ildasm MyAssembly.dll
// Relevant IL:
//   IL_0000: ldarg.0
//   IL_0001: ldarg.0
//   IL_0002: mul
//   IL_0003: ret
// The JIT then compiles this IL to native x86-64/ARM64 machine code
// the first time Square() is actually called.`,
    pythonCode: `import dis

def square(x: int) -> int:
    return x * x

dis.dis(square)
# 2           0 RESUME                   0
#              2 LOAD_FAST                0 (x)
#              4 LOAD_FAST                0 (x)
#              6 BINARY_OP                5 (*)
#             10 RETURN_VALUE
#
# LOAD_FAST pushes a local variable onto the frame's value stack;
# BINARY_OP dispatches to the specialized multiply path (PEP 659,
# 3.11+) after the first few calls warm it up — CPython's own
# lightweight analogue of a JIT noticing a hot, type-stable call site.`,
    underTheHood: '`PyEval_EvalFrameDefault` in `ceval.c` is CPython’s central bytecode-dispatch loop — a giant `switch` (compiled to a computed-goto jump table on most platforms) over opcode values, executing one bytecode instruction per iteration against a per-call-frame value stack. Since 3.11, PEP 659’s "specializing adaptive interpreter" rewrites generic opcodes like `BINARY_OP` into type-specialized variants (`BINARY_OP_ADD_INT`) after observing the same types repeatedly at that call site, then falls back to the generic path if the types ever change — a lightweight, interpreter-level echo of the CLR’s tiered JIT promoting a hot method to a more optimized compilation.',
    pitfalls: [
      'Assuming `.pyc` bytecode caching means Python "compiles once and runs at native speed forever" the way an AOT-compiled binary does — it’s cached *bytecode*, still executed by the interpreter loop every run, not machine code.',
      'Expecting bytecode-level micro-optimizations (specialized opcodes) to close the gap with genuinely JIT-compiled languages for CPU-bound numeric loops — they help real-world code meaningfully, but a tight pure-Python loop is still far slower than the equivalent JITted C# loop.',
      'Editing a `.py` file and expecting the corresponding cached `.pyc` in `__pycache__/` to be used unchanged — CPython invalidates the cache automatically via a source mtime/hash check, but relying on stale bytecode from a manually copied `__pycache__/` directory is a real, if rare, deployment footgun.'
    ],
    bestPractices: [
      'Reach for `dis.dis()` when a specific line’s performance is genuinely unclear, not as a habitual first step — the specialized-opcode behavior changes between Python versions, so conclusions from disassembly can go stale.',
      'Treat `python -m compileall` (pre-warming `__pycache__/`) as a deployment optimization for cold-start latency, not a correctness requirement — CPython regenerates missing/stale `.pyc` files automatically regardless.',
      'When genuinely CPU-bound Python code needs to go faster than bytecode specialization can achieve, reach for `numba`/`Cython`/a C extension rather than trying to hand-tune bytecode-level behavior.'
    ]
  },
  {
    id: 'import-system',
    number: 2,
    title: 'The Import System: sys.modules as a Process-Wide Cache',
    tagline: 'How `import` resolves, executes, and caches modules — and why circular imports break the way they do',
    csharpEquivalent: 'Assembly loading into an `AppDomain`, cached by the CLR so a referenced assembly is loaded (and its static constructors run) only once',
    whyItMatters: "A C# developer rarely thinks about \"when does an assembly get loaded\" — the CLR handles it, and static constructors run once, lazily, on first use. Python's `import` statement is far more visible and immediate: the *entire* module body executes top-to-bottom the first time it's imported (not just class/function definitions — module-level code genuinely runs), and the resulting module object is cached in `sys.modules`. Understanding this exactly is what makes circular-import errors and import-time side effects debuggable instead of mysterious.",
    csharpApproach: 'Reference an assembly via `<PackageReference>`/project reference; the CLR loads it into the `AppDomain` on first actual use and runs any static constructors (`static Foo() { ... }`) lazily, once, thread-safely.',
    pythonApproach: '`import foo` checks `sys.modules["foo"]` first; on a cache miss, it locates the source file, executes the *entire module body* top-to-bottom (defining every class/function and running every module-level statement), stores the resulting module object in `sys.modules`, then binds the name locally.',
    csharpCode: `// C#: static constructor runs once, lazily, on first access —
// invisible unless you specifically reason about it
public static class Config
{
    public static readonly Dictionary<string, string> Settings;

    static Config()   // CLR guarantees: runs at most once, thread-safe
    {
        Console.WriteLine("Loading config...");
        Settings = LoadFromDisk();
    }
}
// First access to Config.Settings anywhere triggers the static ctor.`,
    pythonCode: `# config.py
print("Loading config...")           # this line ACTUALLY RUNS on import
SETTINGS = load_from_disk()          # module-level code, executes immediately

# main.py
import config          # "Loading config..." prints HERE, once
import config          # prints NOTHING — sys.modules["config"] cache hit
from config import SETTINGS   # also a cache hit, just binds the name locally

print(config is sys.modules["config"])  # True — genuinely the same object`,
    underTheHood: 'A circular import (`a.py` imports `b.py` which imports `a.py`) fails or half-works specifically because of *when* `sys.modules["a"]` gets populated: Python inserts the (still partially empty) module object into `sys.modules` *before* executing its body, specifically to detect and short-circuit cycles — but if `b.py` tries to access a name from `a` that’s defined *after* the `import b` line in `a.py`, that name simply doesn’t exist on the partially-initialized module object yet, raising `ImportError`/`AttributeError`. This is a direct consequence of "module body = ordinary sequential code," with no equivalent concept in the CLR’s assembly-loading model, where type definitions themselves are not order-dependent executable statements.',
    pitfalls: [
      'Putting expensive I/O (network calls, large file reads) directly at module level, expecting it to behave like lazy static-constructor initialization — it runs unconditionally the instant the module is first imported anywhere, even in contexts (like test collection) where you didn’t intend it to.',
      'Restructuring two modules that import each other and being surprised the fix depends on *where* in each file the problematic import/usage sits, not just that a cycle exists — moving an import statement later in the file is a legitimate, common fix.',
      'Assuming `importlib.reload(module)` fully "resets" a module the way restarting a process would — it re-executes the module body but existing references to old objects held elsewhere in the program are untouched, often producing subtly inconsistent state.'
    ],
    bestPractices: [
      'Keep module-level code limited to definitions (functions, classes, constants) and defer genuinely expensive initialization into an explicit `init()`/`setup()` function called deliberately, not implicitly on import.',
      'Break circular imports by moving the shared dependency into a third module both sides import, rather than importing directly between the two — the same "extract a shared interface/base module" fix used for circular project references in C#.',
      'Use `if TYPE_CHECKING:` guarded imports (from `typing`) for type-hint-only imports that would otherwise create a real circular dependency at runtime — Pyright/mypy see them, but they never execute.'
    ]
  },
  {
    id: 'descriptors-metaclasses',
    number: 3,
    title: 'Descriptors & Metaclasses: The Protocol Behind Properties and ORMs',
    tagline: 'The general attribute-access-interception mechanism that @property, ORMs, and dataclasses are all built on',
    csharpEquivalent: 'No direct equivalent — closest conceptual cousins are custom `Attribute` + reflection-based interception, or Roslyn source generators',
    whyItMatters: "C# properties are a fixed, compiler-level language feature — you can't define your own new kind of \"property-like\" attribute-interception behavior without a source generator or reflection-heavy AOP framework. Python's descriptor protocol (`__get__`/`__set__`/`__delete__` on a class whose *instances* are used as class attributes) is the general-purpose mechanism `@property` is built from, and library authors use that same protocol directly to build things like SQLAlchemy's `Mapped[]` column attributes or Django's model fields — which is why those libraries can validate/transform attribute access with plain-looking `model.name = value` syntax.",
    csharpApproach: 'Use auto-properties (`public string Name { get; set; }`) for simple cases; for cross-cutting attribute-access behavior (validation, change notification), implement `INotifyPropertyChanged` explicitly or reach for a source generator / AOP framework.',
    pythonApproach: 'Implement a reusable descriptor class with `__get__`/`__set__` once, then attach *instances* of it as class attributes anywhere that validation/transformation behavior is needed — reusable across many unrelated classes without repeating boilerplate.',
    csharpCode: `// C#: validation logic repeated per-property, or via a source
// generator / reflection-based AOP layer — no built-in reusable
// "attribute interceptor" object you attach directly to a field
public class Product
{
    private decimal _price;
    public decimal Price
    {
        get => _price;
        set => _price = value >= 0
            ? value
            : throw new ArgumentException("Price must be non-negative");
    }
}
// The same validate-on-set pattern must be hand-repeated per property,
// or extracted into an AOP interceptor with its own separate machinery.`,
    pythonCode: `class PositiveNumber:
    """A reusable descriptor — attach it to ANY class attribute."""
    def __set_name__(self, owner, name):
        self._name = f"_{name}"

    def __get__(self, obj, objtype=None):
        return getattr(obj, self._name, None)

    def __set__(self, obj, value):
        if value < 0:
            raise ValueError(f"{self._name} must be non-negative")
        setattr(obj, self._name, value)

class Product:
    price = PositiveNumber()     # same descriptor, reused

class Order:
    total = PositiveNumber()     # reused again, zero duplication

p = Product()
p.price = 19.99      # calls PositiveNumber.__set__ transparently
p.price = -5          # raises ValueError — same enforcement, no per-class code`,
    underTheHood: "When Python resolves `instance.attr`, it doesn't just check `instance.__dict__` — it first checks whether `type(instance).attr` is a \"data descriptor\" (defines both `__get__` and `__set__`), and if so, calls its `__get__`/`__set__` *instead of* touching the instance dictionary directly, deferring to the instance dict only for non-descriptor attributes. `@property`, `@staticmethod`, `@classmethod`, and even ordinary function-to-bound-method conversion on instances are all implemented as builtin descriptors using exactly this same protocol — there's no separate special-cased language feature for `@property`, it's just a builtin, general-purpose descriptor class shipped in `builtins`.",
    pitfalls: [
      'Confusing a metaclass (`class Meta(type): ...`, controls how a *class itself* is constructed) with a descriptor (controls how *attribute access on instances* of a class behaves) — they solve different problems and are frequently conflated when first encountered.',
      'Forgetting `__set_name__` (3.6+) exists specifically to let a descriptor learn the attribute name it was assigned to, and manually hardcoding storage attribute names instead — breaks the moment the descriptor is reused under a different name.',
      'Reaching for a metaclass to solve a problem a simpler tool (a class decorator, `__init_subclass__`, or a plain descriptor) would solve with far less cognitive overhead — metaclasses are genuinely rarely the right first tool.'
    ],
    bestPractices: [
      'Use `@property` for simple, single-class getter/setter logic; reach for a standalone descriptor class only when the same validation/transformation behavior needs to be reused across multiple unrelated classes.',
      'Prefer `__init_subclass__` over a full custom metaclass for "run some logic whenever a subclass is defined" use cases — it solves the majority of metaclass use cases with a plain classmethod hook, no metaclass required.',
      'When reading an unfamiliar library’s source (SQLAlchemy, Django ORM) and encountering `Mapped[int]`-style class attributes, look for the descriptor protocol first — it explains nearly all "how does plain attribute assignment trigger validation/DB writes" magic in the Python ecosystem.'
    ]
  },
  {
    id: 'memory-management',
    number: 4,
    title: 'Reference Counting + Cyclic GC: Two Layers, Not One',
    tagline: 'Deterministic refcounting for the common case, a generational collector only for reference cycles',
    csharpEquivalent: '.NET’s generational, tracing, compacting GC — the sole reclamation mechanism, with no reference-counting layer underneath',
    whyItMatters: "Seeing Python has a `gc` module and assuming memory management works \"basically like .NET\" skips the actually-important architectural difference: CPython's PRIMARY reclamation mechanism is reference counting — every `PyObject` carries an `ob_refcnt` field, incremented on each new reference and decremented when a reference goes away; the object is freed the *instant* that count hits zero, no collector pass required. The `gc` module's generational collector exists purely to catch reference *cycles* (`a.child = b; b.parent = a`) that refcounting alone can never resolve, since each object in a cycle always has at least one reference from within the cycle itself.",
    csharpApproach: 'All heap objects are reclaimed by the generational, tracing, compacting GC — there’s no reference count on a managed object at all; the GC periodically traces live-object reachability from GC roots and reclaims everything unreachable, including cycles, uniformly.',
    pythonApproach: 'Most objects are freed immediately and deterministically when their reference count reaches zero (`del obj`, a variable going out of scope, a container being cleared). The generational `gc` module runs periodically, specifically to detect and collect cyclic garbage refcounting can’t reach on its own.',
    csharpCode: `// C#: no refcount exists on this object at all — reclamation
// timing is entirely up to the GC's next collection pass
public class Node
{
    public Node? Child;
    public Node? Parent;
}

var a = new Node();
var b = new Node();
a.Child = b;
b.Parent = a;     // a cycle — GC handles this exactly like any other object

a = null;
b = null;
// Both nodes become eligible for collection whenever the GC next runs
// a gen-0/1/2 collection that traces reachability from roots —
// there's no "immediate" reclamation moment to point to.`,
    pythonCode: `import sys, gc

class Node:
    def __init__(self):
        self.child = None
        self.parent = None

a = Node()
print(sys.getrefcount(a) - 1)   # 1 (subtract the temporary getrefcount arg ref)

b = Node()
a.child = b
b.parent = a       # cycle: a and b now each hold >=1 ref from inside the cycle

del a
del b
# NEITHER node's refcount reached zero — each is still referenced by
# the other. They are genuinely leaked until the generational gc.collect()
# cycle-detector runs (periodically, automatically, or gc.collect() explicitly)
# and identifies+breaks the unreachable cycle.`,
    underTheHood: "Every `PyObject` header is `ob_refcnt` (a signed integer reference count) plus `ob_type` (a pointer to its type object). Simple assignment (`x = y`), argument passing, and appending to a list all go through `Py_INCREF`/`Py_DECREF` macros in the C API, and `Py_DECREF` frees the object immediately via its type's deallocator the instant the count reaches zero — this is why closing a file object or database connection via `del conn` (with no other references) tends to release the OS resource deterministically and immediately in CPython, a guarantee a pure tracing GC (Python's `gc` module included, and .NET's GC) cannot make on its own for non-refcounted objects, which is exactly why `with` blocks (context managers) are still the *correct*, non-refcounting-dependent way to guarantee resource cleanup.",
    pitfalls: [
      'Relying on refcounting’s "immediate reclamation" behavior as a *design guarantee* for resource cleanup instead of using `with`/context managers — refcounting is a CPython implementation detail (PyPy, for instance, does not refcount), not a language-level promise.',
      'Creating large object graphs with parent/child back-references (a common cause of cycles) and being surprised memory usage grows before a `gc.collect()` pass runs — cyclic garbage is real, transient memory pressure, not a leak that never resolves.',
      'Calling `gc.disable()` to "improve performance" without understanding that any reference cycles created afterward will never be collected at all until re-enabled — appropriate only for short-lived scripts that exit before cycles would matter.'
    ],
    bestPractices: [
      'Use `weakref` (the `weakref` module) for back-references in parent/child object graphs (e.g. a child’s `.parent` pointer) specifically to avoid creating reference cycles in the first place, rather than relying on the cyclic collector to clean them up.',
      'Always use `with` blocks for anything holding an OS resource (files, sockets, DB connections, locks) — don’t depend on refcount-triggered deallocation timing, even though it usually "just works" in CPython specifically.',
      'Reach for `gc.collect()` explicitly only when profiling has shown cyclic-garbage-driven memory pressure in a long-running process (e.g. right after a large batch job completes) — not as a routine, unexamined performance habit.'
    ]
  }
];

export interface InternalsTopic {
  id: string;
  topic: string;
  detail: string;
  csharpAnalogue: string;
}

export const PYTHON_INTERNALS_TOPICS: InternalsTopic[] = [
  { id: 'gil', topic: 'The Global Interpreter Lock (GIL)', detail: 'A single mutex ensuring only one thread executes Python bytecode at a time; PEP 703 (3.13+, experimental) introduces an opt-in free-threaded build without it.', csharpAnalogue: 'No direct equivalent — the CLR has always allowed true multi-threaded execution of managed code across cores.' },
  { id: 'frame-objects', topic: 'Frame Objects', detail: 'Each function call creates a `PyFrameObject` holding the local variable stack, instruction pointer, and back-reference to the caller’s frame — what a traceback is built from.', csharpAnalogue: 'The CLR’s call stack + stack frames, surfaced indirectly via `StackTrace`/`StackFrame` reflection APIs.' },
  { id: 'pyc-cache', topic: '__pycache__ & .pyc Files', detail: 'Compiled bytecode cached per-module, invalidated automatically when the source file’s hash/mtime changes.', csharpAnalogue: 'Roughly analogous in spirit to incremental build caching (`obj/` directory), though .NET’s IL isn’t cached the same way at the language-runtime level.' },
  { id: 'c-extension-abi', topic: 'The C Extension ABI', detail: 'Native modules (`numpy`, `psycopg2`) implement the CPython C API directly, compiled per-platform/per-Python-version into `.so`/`.pyd` files.', csharpAnalogue: 'P/Invoke into a native library, or a C++/CLI interop layer — conceptually similar "cross the managed/native boundary" mechanisms.' },
  { id: 'sys-intern', topic: 'String Interning', detail: 'CPython automatically interns short identifier-like strings (and all string literals in compiled code objects) so `a is b` can be true for equal short strings without an explicit intern call.', csharpAnalogue: '`string.Intern()` — available but opt-in; the CLR does not intern most strings automatically the way CPython does for identifier-shaped literals.' },
  { id: 'peps', topic: 'PEPs (Python Enhancement Proposals)', detail: 'The formal design-and-review process for language/stdlib changes — PEP 8 (style), PEP 484 (type hints), PEP 703 (free-threading) are all PEPs.', csharpAnalogue: 'The `dotnet/csharplang` proposal process and Language Design Meetings — the same "public design doc → community review → accepted/rejected" governance model.' }
];
