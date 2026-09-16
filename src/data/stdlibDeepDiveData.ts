import { DeepDiveFeature } from '../types';

export interface StdlibVerdictPoint {
  id: string;
  claim: string;
  reality: string;
}

export const STDLIB_VERDICT =
  '"Batteries included" is not a slogan — it\'s an architectural promise: itertools, functools, asyncio, dataclasses, and pathlib are C-accelerated, zero-dependency building blocks that make most third-party micro-packages (and a surprising amount of custom C# infrastructure code) unnecessary.';

export const STDLIB_VERDICT_POINTS: StdlibVerdictPoint[] = [
  {
    id: 'itertools-lazy',
    claim: '"Isn\'t writing your own loop simpler than importing itertools?"',
    reality:
      "A hand-written loop allocates the full result eagerly and re-implements iteration-protocol edge cases (StopIteration, exhaustion) by hand. `itertools.groupby`, `itertools.chain`, `itertools.islice` are lazy, C-implemented, and composable — they read like LINQ's deferred-execution model (`IEnumerable<T>`), except every itertools function is a generator under the hood, not a compiler-synthesized state machine."
  },
  {
    id: 'dataclasses-vs-poco',
    claim: '"Do dataclasses actually replace a hand-written C# POCO/record?"',
    reality:
      '`@dataclass` generates `__init__`, `__repr__`, and `__eq__` at class-definition time via `exec()`’d source — conceptually identical to what the C# compiler synthesizes for a `record`. The difference: Python dataclasses are opt-in per-field (`frozen=True`, `field(default_factory=list)`) and inspectable at runtime via `dataclasses.fields()`, since Python has no distinct compile-time step to hide the generation from.'
  },
  {
    id: 'pathlib-vs-string-paths',
    claim: '"Isn\'t manual os.path string joining fine for simple scripts?"',
    reality:
      "`os.path.join(base, 'a', 'b')` returns a plain string with no path-aware methods. `pathlib.Path` overloads `/` (`Path(base) / 'a' / 'b'`) via `__truediv__`, returning an OS-aware object with `.exists()`, `.glob()`, `.read_text()` methods attached — the direct analogue of C#'s `System.IO.Path` + `FileInfo`/`DirectoryInfo` merged into one type."
  },
  {
    id: 'asyncio-vs-task',
    claim: '"Is asyncio just Python\'s async/await, or something more?"',
    reality:
      "`async`/`await` syntax is shared with C#, but the runtime underneath differs fundamentally: .NET's `Task` runs on a thread-pool-backed scheduler capable of true OS-thread parallelism for CPU-bound work wrapped in `Task.Run`. `asyncio` runs everything — CPU-bound or not — on a single OS thread via a cooperative event loop; concurrency comes from I/O-bound tasks yielding control at each `await`, never from parallel execution."
  }
];

export const STDLIB_CONCEPTS: DeepDiveFeature[] = [
  {
    id: 'itertools-functools',
    number: 1,
    title: 'itertools & functools: Lazy, Composable Iteration',
    tagline: 'C-implemented lazy iterator algebra and function composition primitives',
    csharpEquivalent: 'System.Linq deferred-execution extension methods (`.Where()`, `.GroupBy()`, `.Aggregate()`, `.Chunk()`)',
    whyItMatters: "LINQ's `IEnumerable<T>` deferred execution and `itertools`/`functools` solve the same problem — build a pipeline of lazy transformations that only materializes when iterated — but Python exposes the primitives as standalone composable functions rather than extension methods on a single interface, so you reach for `itertools.chain(a, b)` instead of `a.Concat(b)`.",
    csharpApproach: 'Chain LINQ extension methods directly on any `IEnumerable<T>`: `source.Where(predicate).Select(selector).Aggregate(seed, func)`.',
    pythonApproach: 'Compose free functions from `itertools`/`functools` around any iterable: `itertools.chain(a, b)`, `itertools.groupby(sorted_data, key=keyfunc)`, `functools.reduce(func, iterable, initial)`.',
    csharpCode: `// C#: LINQ deferred execution — nothing runs until enumerated
var report = orders
    .Where(o => o.Status == OrderStatus.Shipped)
    .GroupBy(o => o.Region)
    .Select(g => new { Region = g.Key, Total = g.Sum(o => o.Amount) })
    .OrderByDescending(r => r.Total)
    .Take(5);

foreach (var row in report)   // execution actually happens here
{
    Console.WriteLine($"{row.Region}: {row.Total:C}");
}`,
    pythonCode: `from itertools import groupby
from functools import reduce
from operator import attrgetter

shipped = (o for o in orders if o.status == "shipped")  # lazy generator, like Where()

# groupby REQUIRES pre-sorted input — unlike LINQ's GroupBy, this is a
# streaming single-pass grouper, not a full hash-based grouping
by_region = groupby(sorted(shipped, key=attrgetter("region")), key=attrgetter("region"))

report = sorted(
    ((region, sum(o.amount for o in group)) for region, group in by_region),
    key=lambda row: row[1],
    reverse=True,
)[:5]

for region, total in report:      # generators fully consumed here
    print(f"{region}: {total:,.2f}")`,
    underTheHood: "LINQ's `GroupBy` builds an internal hash lookup keyed by the grouping function — input order doesn't matter. `itertools.groupby` is a streaming, single-pass C iterator that only starts a *new* group when the key changes between consecutive elements; feeding it unsorted data silently produces multiple groups with the same key instead of one, which is the single most common itertools bug for engineers coming from LINQ's GroupBy semantics.",
    pitfalls: [
      'Calling `itertools.groupby()` on unsorted data, expecting LINQ-style full grouping — it silently produces fragmented groups instead of raising an error.',
      'Iterating an `itertools` generator (or a `groupby` group) twice — unlike a LINQ `IEnumerable` re-query, a consumed Python generator is permanently exhausted and yields nothing the second time.',
      "Forgetting that `itertools.islice(gen, 5)` still fully evaluates every skipped element from a non-slicing-aware generator underneath — it's syntactic sugar for lazy slicing, not a magic index jump."
    ],
    bestPractices: [
      'Always `sorted(data, key=...)` immediately before `itertools.groupby(data, key=...)` — treat the two as one inseparable unit.',
      'Materialize a generator into a `list()` explicitly the moment you need to iterate it more than once, the same discipline as calling `.ToList()` to pin down a LINQ query.',
      'Reach for `functools.reduce` only when there is no built-in accumulator (`sum`, `max`, `"".join()`) — those are C-implemented and faster than a Python-level `reduce` callback.'
    ]
  },
  {
    id: 'dataclasses',
    number: 2,
    title: 'dataclasses: Declarative Value Objects',
    tagline: 'Auto-generated __init__/__repr__/__eq__ from type-annotated class bodies',
    csharpEquivalent: 'C# `record` types (positional or with `init` properties)',
    whyItMatters: 'Before dataclasses (Python 3.7+), a value-object class required hand-writing `__init__`, `__repr__`, and `__eq__` — exactly the boilerplate C# `record` types eliminated at the language level. `@dataclass` is a class decorator, not new syntax, so it can be layered with `frozen=True` for immutability (like a C# `record` with `init`-only properties) or left mutable, field by field.',
    csharpApproach: 'Declare a `record` (or `record struct` for value-type semantics) with positional or `init`-only properties — the compiler synthesizes `Equals`, `GetHashCode`, `ToString`, and a `with`-expression copy constructor.',
    pythonApproach: 'Annotate a class body with typed fields and apply `@dataclass` (optionally `frozen=True`, `slots=True`); use `dataclasses.replace()` for the `with`-expression equivalent.',
    csharpCode: `// C#: record — compiler-synthesized value semantics
public record OrderLine(string Sku, int Quantity, decimal UnitPrice)
{
    public decimal Total => Quantity * UnitPrice;
}

var line = new OrderLine("SKU-1", 3, 19.99m);
var discounted = line with { UnitPrice = 14.99m };  // non-destructive copy
Console.WriteLine(line == discounted);  // False — structural equality`,
    pythonCode: `from dataclasses import dataclass, field, replace

@dataclass(frozen=True, slots=True)
class OrderLine:
    sku: str
    quantity: int
    unit_price: float

    @property
    def total(self) -> float:
        return self.quantity * self.unit_price

line = OrderLine("SKU-1", 3, 19.99)
discounted = replace(line, unit_price=14.99)   # "with"-expression equivalent
print(line == discounted)   # False — dataclasses generate structural __eq__`,
    underTheHood: '`@dataclass` inspects `__annotations__` on the class at decoration time and `exec()`’s dynamically generated source strings for `__init__`, `__repr__`, and `__eq__` into the class namespace — genuinely running a small code-generation step at import time, which is conceptually the closest thing Python has to what the Roslyn compiler does for `record` types at compile time. `slots=True` (3.10+) additionally replaces the per-instance `__dict__` with fixed `__slots__`, closing most of the memory-overhead gap versus a C# `record struct`.',
    pitfalls: [
      'Using a mutable default like `field: list = []` instead of `field: list = field(default_factory=list)` — Python evaluates default arguments once at class-definition time, so every instance would silently share the same list.',
      'Assuming `frozen=True` prevents mutating an attribute that itself holds a mutable object (a frozen dataclass holding a `list` field can still have that list’s contents mutated in place).',
      'Forgetting `eq=True` is the default but `order=True` (for `<`, `>` comparisons) is not — unlike a C# `record`, sortability isn’t automatic.'
    ],
    bestPractices: [
      'Default to `frozen=True` for anything modeling a value (money, coordinates, an API DTO) — it’s the direct behavioral match for a C# `record`.',
      'Add `slots=True` on 3.10+ for any dataclass created in bulk (e.g. one per CSV row) — meaningfully cuts per-instance memory.',
      'Use `field(default_factory=...)` for every mutable default without exception, not just when you remember to.'
    ]
  },
  {
    id: 'pathlib',
    number: 3,
    title: 'pathlib: Object-Oriented Filesystem Paths',
    tagline: 'Path objects with overloaded operators, replacing os.path string concatenation',
    csharpEquivalent: '`System.IO.Path` (static string helpers) plus `FileInfo`/`DirectoryInfo` (instance-based I/O), merged into one type',
    whyItMatters: "Legacy Python filesystem code (`os.path.join`, `os.path.exists`) treats paths as plain strings passed to free functions — exactly the pre-`System.IO.Path`-object style of manipulation. `pathlib.Path` is the idiomatic modern replacement: an object with `/` overloaded for joining and I/O methods attached directly, unifying what C# splits between static `Path` helpers and instance `FileInfo`/`DirectoryInfo` methods.",
    csharpApproach: 'Combine `Path.Combine(a, b, c)` for string joining with a separate `new FileInfo(path)` or `new DirectoryInfo(path)` instance when you need `.Exists`, `.Length`, or enumeration methods.',
    pythonApproach: 'Construct one `pathlib.Path` and use it for both joining (`base_path / "sub" / "file.txt"`) and I/O (`.exists()`, `.read_text()`, `.glob("*.py")`) — the same object does both jobs.',
    csharpCode: `// C#: string-joining helper is separate from the I/O-capable type
string configPath = Path.Combine(baseDir, "config", "settings.json");

var fileInfo = new FileInfo(configPath);
if (fileInfo.Exists)
{
    string contents = File.ReadAllText(configPath);
}

// Enumerate matching files
var pyFiles = Directory.GetFiles(baseDir, "*.py", SearchOption.AllDirectories);`,
    pythonCode: `from pathlib import Path

# "/" is overloaded via __truediv__ — joins AND stays a Path object
config_path = Path(base_dir) / "config" / "settings.json"

if config_path.exists():
    contents = config_path.read_text()

# Same object type provides recursive globbing directly
py_files = list(Path(base_dir).rglob("*.py"))`,
    underTheHood: "`pathlib.Path` dispatches to `PosixPath` or `WindowsPath` at construction time (selected via `os.name`), so `/`-joining and glob-pattern matching behave correctly per-OS without any `if sys.platform ==` branching in your code — the same cross-platform abstraction goal `System.IO.Path`'s `DirectorySeparatorChar` handling serves in .NET, just expressed as operator overloading and polymorphism instead of a single static helper class.",
    pitfalls: [
      'Mixing `os.path` string functions and `pathlib.Path` objects in the same codebase — most `os.path` functions accept a `Path` (via `os.fspath()`), but the reverse isn’t always true without an explicit `Path(str_path)` wrap.',
      'Calling `.resolve()` (which touches the filesystem to resolve symlinks) when you only meant `.absolute()` (pure string manipulation, no I/O) — easy to reach for the wrong one and add unnecessary syscalls in a hot path.',
      'Assuming `Path.glob("**/*.py")` and `Path.rglob("*.py")` always return results in the same order as `Directory.GetFiles` — both are filesystem-order-dependent, not alphabetically sorted, on either platform.'
    ],
    bestPractices: [
      'Accept `str | Path` in function signatures and immediately normalize with `Path(path)` inside — mirrors accepting `string` in a C# method that immediately wraps it in a `FileInfo`.',
      'Prefer `.read_text()` / `.write_text()` / `.read_bytes()` over manually opening a file handle for simple whole-file operations — they handle open/close/encoding in one call.',
      'Use `Path.is_relative_to()` (3.9+) instead of manual string-prefix checks when validating that a path stays within an expected directory — a common security-relevant check (path traversal prevention).'
    ]
  },
  {
    id: 'asyncio',
    number: 4,
    title: 'asyncio: The Single-Threaded Event Loop',
    tagline: 'Cooperative concurrency for I/O-bound work — the same async/await syntax, a completely different runtime',
    csharpEquivalent: '`async`/`await` over `Task` — but backed by the thread-pool-based `TaskScheduler`, not a single-threaded loop',
    whyItMatters: "C# and Python share `async`/`await` syntax almost token-for-token, which is exactly why the runtime difference catches engineers off guard: a .NET `Task` can genuinely run in parallel across thread-pool threads. An `asyncio` coroutine runs on ONE OS thread, full stop — concurrency comes purely from cooperative yielding at `await` points during I/O waits, never from parallel CPU execution. A CPU-bound `async def` function that never awaits will block the entire event loop, stalling every other coroutine.",
    csharpApproach: '`await Task.WhenAll(tasks)` schedules work onto the thread pool; CPU-bound work wrapped in `Task.Run()` genuinely executes on a separate OS thread in parallel.',
    pythonApproach: '`await asyncio.gather(*coros)` schedules coroutines onto the single-threaded event loop; CPU-bound work must be explicitly offloaded via `loop.run_in_executor()` (a real thread/process pool) or it blocks everything.',
    csharpCode: `// C#: Task.WhenAll genuinely parallelizes I/O-bound HTTP calls
// across thread-pool threads
async Task<List<string>> FetchAllAsync(HttpClient client, string[] urls)
{
    var tasks = urls.Select(url => client.GetStringAsync(url));
    string[] results = await Task.WhenAll(tasks);
    return results.ToList();
}`,
    pythonCode: `import asyncio
import aiohttp

async def fetch_all(urls: list[str]) -> list[str]:
    async with aiohttp.ClientSession() as session:
        async def fetch_one(url: str) -> str:
            async with session.get(url) as resp:
                return await resp.text()

        # Concurrent, but on ONE thread: while one request awaits network
        # I/O, the event loop switches to another — no parallel CPU work.
        return await asyncio.gather(*(fetch_one(u) for u in urls))

# A CPU-bound function accidentally defined as "async def" with no
# real await inside still blocks this same single thread completely —
# there is no implicit escape to a worker thread the way Task.Run() gives you.`,
    underTheHood: '`asyncio`’s event loop is fundamentally a single-threaded `select()`/`epoll()`-driven dispatcher: each `await` on an I/O operation registers a callback and yields control back to the loop, which then resumes whichever other coroutine has become ready. This is why the GIL is largely irrelevant to `asyncio` performance — there’s only ever one thread running Python bytecode at a time regardless. .NET’s `Task` scheduler, by contrast, genuinely dispatches continuations across multiple thread-pool threads, so two awaited `Task`s can have their *continuations* running truly simultaneously on different cores.',
    pitfalls: [
      'Calling a blocking, synchronous library function (e.g. `requests.get()`, `time.sleep()`) inside an `async def` — it blocks the entire event loop for every other coroutine, with no compiler warning.',
      'Assuming `asyncio.gather()` parallelizes CPU-bound work the way `Task.WhenAll` + `Task.Run` does — it only helps I/O-bound coroutines; CPU-bound work needs `run_in_executor()` or `multiprocessing` instead.',
      'Forgetting to `await` a coroutine call — `fetch_one(url)` without `await` silently creates a coroutine object and does nothing, generating only a `RuntimeWarning`, not an error, in older Python versions.'
    ],
    bestPractices: [
      'Treat "does this call touch the network, disk, or a subprocess?" as the litmus test for whether a function belongs inside `async def` at all.',
      'Use `asyncio.to_thread()` (3.9+) to offload a blocking call from inside async code, the direct equivalent of wrapping blocking work in `Task.Run()`.',
      'Use `asyncio.TaskGroup` (3.11+) over raw `gather()` for structured concurrency — it correctly cancels sibling tasks if one raises, closer to how an unhandled exception in `Task.WhenAll` behaves.'
    ]
  }
];

export interface StdlibModule {
  id: string;
  module: string;
  role: string;
  csharpAnalogue: string;
}

export const STDLIB_MODULE_TABLE: StdlibModule[] = [
  { id: 'collections', module: 'collections', role: '`Counter`, `defaultdict`, `deque`, `namedtuple` — specialized container types beyond `list`/`dict`.', csharpAnalogue: 'No single equivalent; closest are `Dictionary<K, List<V>>` patterns, `LinkedList<T>` (for `deque`), and anonymous types (for `namedtuple`).' },
  { id: 'contextlib', module: 'contextlib', role: '`@contextmanager` decorator, `ExitStack`, `suppress()` — building/composing context managers without a full class.', csharpAnalogue: '`using` statement works only with `IDisposable`; no direct decorator-based shortcut for ad-hoc `using` blocks.' },
  { id: 'typing', module: 'typing', role: 'Static type hint constructs: `Protocol`, `TypedDict`, `Generic[T]`, `overload`, `TypeVar` — checked by Pyright/mypy, erased at runtime.', csharpAnalogue: 'Interfaces, generics (`<T>`), and method overloading — but C#’s versions are enforced by the compiler and preserved in IL, not erased.' },
  { id: 'concurrent-futures', module: 'concurrent.futures', role: '`ThreadPoolExecutor`/`ProcessPoolExecutor` — a unified `.submit()`/`Future` API over threads or separate processes.', csharpAnalogue: '`Task.Run()` for the thread-pool case; `System.Diagnostics.Process` (no built-in process-pool abstraction) for the process case.' },
  { id: 'enum', module: 'enum', role: '`Enum`, `IntEnum`, `Flag`, `StrEnum` (3.11+) — named constant groups with methods and iteration support.', csharpAnalogue: '`enum` keyword — conceptually near-identical, though C# enums are always integer-backed value types.' },
  { id: 'logging', module: 'logging', role: 'Hierarchical logger namespaces, handlers, formatters — configured once, used via `logging.getLogger(__name__)` everywhere.', csharpAnalogue: '`Microsoft.Extensions.Logging` — a very close structural match (providers/handlers, log levels, scoped categories).' }
];
