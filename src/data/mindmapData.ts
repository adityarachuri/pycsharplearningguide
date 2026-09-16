export interface MindmapNode {
  id: string;
  domainId: string;
  title: string;
  csharpConcept: string;
  pythonConcept: string;
  cognitiveShift: string;
  csharpCode: string;
  pythonCode: string;
  sandboxCode?: string;
  gotcha: string;
  difficulty: 'Fundamental' | 'Intermediate' | 'Architectural';
  tags: string[];
}

export interface MindmapDomain {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  accentBorder: string;
  accentBg: string;
  textColor: string;
  iconName: string;
}

export const MINDMAP_DOMAINS: MindmapDomain[] = [
  {
    id: 'types',
    name: 'Type Systems & Memory Model',
    shortName: 'Types & Memory',
    description: 'Nominal compiled allocations vs dynamic object references and pointer bindings',
    color: '#38bdf8', // sky-400
    accentBorder: 'border-sky-500/40',
    accentBg: 'bg-sky-500/10',
    textColor: 'text-sky-400',
    iconName: 'Cpu'
  },
  {
    id: 'collections',
    name: 'Collections & LINQ vs Comprehensions',
    shortName: 'Collections & LINQ',
    description: 'Deferred query pipelines vs bytecoded comprehensions and iterator generators',
    color: '#34d399', // emerald-400
    accentBorder: 'border-emerald-500/40',
    accentBg: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    iconName: 'Layers'
  },
  {
    id: 'control-flow',
    name: 'Control Flow & Error Handling',
    shortName: 'Flow & Errors',
    description: 'Defensive LBYL guarding vs idiomatic EAFP and structural pattern matching',
    color: '#fbbf24', // amber-400
    accentBorder: 'border-amber-500/40',
    accentBg: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    iconName: 'ShieldAlert'
  },
  {
    id: 'oop',
    name: 'OOP, Interfaces & Metaprogramming',
    shortName: 'OOP & Protocols',
    description: 'Nominal contracts & attributes vs Duck Typing, Protocols, Dunders & Decorators',
    color: '#a78bfa', // purple-400
    accentBorder: 'border-purple-500/40',
    accentBg: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    iconName: 'Boxes'
  },
  {
    id: 'concurrency',
    name: 'Concurrency, Async & Runtimes',
    shortName: 'Async & Concurrency',
    description: 'CLR ThreadPool & multi-core JIT vs asyncio single-threaded event loop and the GIL',
    color: '#f43f5e', // rose-500
    accentBorder: 'border-rose-500/40',
    accentBg: 'bg-rose-500/10',
    textColor: 'text-rose-400',
    iconName: 'Zap'
  },
  {
    id: 'tooling',
    name: 'Tooling, Packaging & Standards',
    shortName: 'Tooling & Ecosystem',
    description: 'csproj, MSBuild & NuGet vs pyproject.toml, uv, Ruff and Pyright linters',
    color: '#fb923c', // orange-400
    accentBorder: 'border-orange-500/40',
    accentBg: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    iconName: 'Terminal'
  },
  {
    id: 'functions',
    name: 'Functions, Closures & Decorators',
    shortName: 'Functions',
    description: 'Delegates & lambda expressions vs first-class functions, closures and decorator syntax',
    color: '#22d3ee', // cyan-400
    accentBorder: 'border-cyan-500/40',
    accentBg: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    iconName: 'FunctionSquare'
  },
  {
    id: 'testing',
    name: 'Testing & Quality Assurance',
    shortName: 'Testing & QA',
    description: 'xUnit/Moq/NSubstitute vs pytest fixtures, unittest.mock and static type checking',
    color: '#4ade80', // green-400
    accentBorder: 'border-green-500/40',
    accentBg: 'bg-green-500/10',
    textColor: 'text-green-400',
    iconName: 'ShieldCheck'
  },
  {
    id: 'web-data-ai',
    name: 'Web, Data & AI Ecosystem',
    shortName: 'Web & Data/AI',
    description: 'ASP.NET Core & EF Core vs FastAPI/Django/SQLAlchemy, and ML.NET vs PyTorch/scikit-learn',
    color: '#f472b6', // pink-400
    accentBorder: 'border-pink-500/40',
    accentBg: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    iconName: 'Globe'
  }
];

export const MINDMAP_NODES: MindmapNode[] = [
  // DOMAIN: TYPES & MEMORY
  {
    id: 'node-var-binding',
    domainId: 'types',
    title: 'Variable Declarations & Assignment',
    csharpConcept: 'Statically typed memory storage slot (stack or heap reference)',
    pythonConcept: 'Name tag bound to dynamic heap PyObject pointer',
    cognitiveShift: 'In C#, variables are boxes of a fixed type. In Python, variables are sticky labels you affix to objects in heap space.',
    csharpCode: `// C#: Variable has fixed type at compile time
int counter = 42;
// counter = "forty-two"; // Compile Error CS0029`,
    pythonCode: `# Python: Rebinding variable label to another heap object
counter = 42
counter = "forty-two"  # Valid: label moved to str object`,
    sandboxCode: `counter = 42
print("Type of 42:", type(counter), "id:", id(counter))
counter = "forty-two"
print("Type of str:", type(counter), "id:", id(counter))`,
    gotcha: 'Python does not copy by value on assignment; it assigns a reference pointer. Modifying a mutable object mutates all names pointing to it.',
    difficulty: 'Fundamental',
    tags: ['Variables', 'Memory', 'PyObject']
  },
  {
    id: 'node-null-none',
    domainId: 'types',
    title: 'Absence of Value (Null vs None)',
    csharpConcept: 'Nullable Reference Types (`string?`), `null`, `??`, `?.`',
    pythonConcept: '`None` (unique `NoneType` singleton instance)',
    cognitiveShift: 'Never check `== None` in Python! Always use identity comparison `is None` or `is not None` because None is a unique singleton.',
    csharpCode: `string? user = null;
string display = user ?? "Guest";
if (user == null) { /* ... */ }`,
    pythonCode: `user = None
display = user if user is not None else "Guest"
# Idiomatic identity check:
if user is None:
    print("No user active")`,
    sandboxCode: `val = None
print("Is NoneType singleton?", val is None)
print("None id in heap:", id(None))
print("Fallback value:", val or "Guest")`,
    gotcha: '`val or "default"` treats empty strings `""`, `0`, and `[]` as falsy, which can inadvertently overwrite legitimate zero/empty inputs.',
    difficulty: 'Fundamental',
    tags: ['Nullability', 'NoneType', 'Identity']
  },
  {
    id: 'node-struct-dataclass',
    domainId: 'types',
    title: 'Records / Structs vs Dataclasses',
    csharpConcept: '`record class` / `record struct` with value equality and `with` expressions',
    pythonConcept: '`@dataclass(frozen=True)` or `typing.NamedTuple`',
    cognitiveShift: 'Python dataclasses auto-generate `__init__`, `__repr__`, and `__eq__` without boilerplate, mimicking C# positional records.',
    csharpCode: `public record UserDto(int Id, string Email, bool IsActive);

var u1 = new UserDto(1, "a@b.com", true);
var u2 = u1 with { IsActive = false };`,
    pythonCode: `from dataclasses import dataclass, replace

@dataclass(frozen=True)
class UserDto:
    id: int
    email: str
    is_active: bool = True

u1 = UserDto(1, "a@b.com")
u2 = replace(u1, is_active=False)`,
    sandboxCode: `from dataclasses import dataclass, replace

@dataclass(frozen=True)
class Point:
    x: int
    y: int

p1 = Point(10, 20)
p2 = replace(p1, y=99)
print("p1:", p1)
print("p2:", p2)
print("Value equality:", p1 == Point(10, 20))`,
    gotcha: 'Mutable default arguments (like `tags: list = []`) in dataclasses cause shared state bugs. Always use `field(default_factory=list)`.',
    difficulty: 'Intermediate',
    tags: ['Data Structures', 'Immutability', 'Records']
  },
  {
    id: 'node-generics',
    domainId: 'types',
    title: 'Generics vs Gradual Typing',
    csharpConcept: 'Reified runtime generics (`List<T>`) preserved in CLR metadata with zero-cost value-type specialization',
    pythonConcept: 'Type erasure at runtime; `TypeVar` and `Generic[T]` inspected strictly by static linters (Pyright/Mypy)',
    cognitiveShift: 'In Python, types exist for static type analysis and developer ergonomics, but are erased at runtime without performance specialization.',
    csharpCode: `public class Repository<T> where T : IEntity {
    public T GetById(int id) => /* ... */;
}`,
    pythonCode: `from typing import TypeVar, Generic

T = TypeVar("T")

class Repository(Generic[T]):
    def get_by_id(self, entity_id: int) -> T:
        ...`,
    sandboxCode: `from typing import TypeVar, Generic

T = TypeVar("T")
class Stack(Generic[T]):
    def __init__(self):
        self._items: list[T] = []
    def push(self, item: T) -> None:
        self._items.append(item)
    def pop(self) -> T:
        return self._items.pop()

s = Stack[int]()
s.push(100)
s.push(200)
print("Stack pop:", s.pop())`,
    gotcha: 'Python runtime does NOT prevent you from passing wrong types unless you explicitly validate at boundaries using Pydantic or Beartype.',
    difficulty: 'Architectural',
    tags: ['Generics', 'TypeVar', 'Static Typing']
  },

  // DOMAIN: COLLECTIONS & LINQ
  {
    id: 'node-linq-comprehensions',
    domainId: 'collections',
    title: 'LINQ Query Syntax vs Comprehensions',
    csharpConcept: '`Where()`, `Select()`, `OrderBy()` returning deferred `IEnumerable<T>`',
    pythonConcept: 'List, Dict, and Set Comprehensions `[expr for x in seq if cond]`',
    cognitiveShift: 'List comprehensions compile down to specialized C-level bytecode loops, outperforming classic functional `map()` and `filter()`.',
    csharpCode: `var activeVips = users
    .Where(u => u.IsActive && u.Spent > 1000)
    .Select(u => u.Email.ToLower())
    .ToList();`,
    pythonCode: `active_vips = [
    u.email.lower()
    for u in users
    if u.is_active and u.spent > 1000
]`,
    sandboxCode: `users = [
    {"email": "ALICE@EXAMPLE.COM", "spent": 1200, "active": True},
    {"email": "BOB@EXAMPLE.COM", "spent": 400, "active": True},
    {"email": "CHARLIE@EXAMPLE.COM", "spent": 3500, "active": False}
]
vips = [u["email"].lower() for u in users if u["active"] and u["spent"] > 1000]
print("Filtered VIPs:", vips)`,
    gotcha: 'Square brackets `[...]` eagerly build the entire list in RAM. If processing millions of records, use parentheses `(...)` for a lazy generator.',
    difficulty: 'Fundamental',
    tags: ['LINQ', 'Comprehensions', 'Collections']
  },
  {
    id: 'node-dictionary-dict',
    domainId: 'collections',
    title: 'Dictionary vs Built-in dict & defaultdict',
    csharpConcept: '`Dictionary<TKey, TValue>` throwing `KeyNotFoundException` without `TryGetValue()`',
    pythonConcept: 'Built-in `dict` (compact insertion-ordered hash map) and `collections.defaultdict`',
    cognitiveShift: 'Python dicts guarantee insertion order since 3.7. Missing keys are safely handled via `.get(key, default)` or `defaultdict`.',
    csharpCode: `var lookup = new Dictionary<string, List<string>>();
if (!lookup.TryGetValue("admin", out var roles)) {
    roles = new List<string>();
    lookup["admin"] = roles;
}
roles.Add("SuperUser");`,
    pythonCode: `from collections import defaultdict

# Auto-instantiates missing keys with an empty list:
lookup = defaultdict(list)
lookup["admin"].append("SuperUser")`,
    sandboxCode: `from collections import defaultdict, Counter

words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
counts = Counter(words)
print("Most common:", counts.most_common(2))

grouped = defaultdict(list)
for w in words:
    grouped[len(w)].append(w)
print("Grouped by word length:", dict(grouped))`,
    gotcha: 'Accessing `d[key]` on a standard dict throws `KeyError`. Accessing `defaultdict[key]` silently creates the default entry in place.',
    difficulty: 'Fundamental',
    tags: ['Dictionary', 'Hash Table', 'defaultdict']
  },
  {
    id: 'node-priority-queue',
    domainId: 'collections',
    title: 'PriorityQueue vs heapq Module',
    csharpConcept: '`PriorityQueue<TElement, TPriority>` object instance with `.Enqueue()` and `.Dequeue()`',
    pythonConcept: '`heapq` procedural algorithm operating on a raw `list` in-place as a min-heap',
    cognitiveShift: 'Python does not have a `Heap` class; `heapq` is a set of zero-overhead functions that organize any standard `list` into a heap.',
    csharpCode: `var pq = new PriorityQueue<string, int>();
pq.Enqueue("Low Priority Task", 5);
pq.Enqueue("Critical Hotfix", 1);
string next = pq.Dequeue(); // "Critical Hotfix"`,
    pythonCode: `import heapq

pq = []
heapq.heappush(pq, (5, "Low Priority Task"))
heapq.heappush(pq, (1, "Critical Hotfix"))
_, next_task = heapq.heappop(pq)  # "Critical Hotfix"`,
    sandboxCode: `import heapq

tasks = [(3, "Write tests"), (1, "Fix prod crash"), (2, "Code review")]
heapq.heapify(tasks)
print("Heap state:", tasks)
print("Popped #1 priority:", heapq.heappop(tasks))
print("Popped #2 priority:", heapq.heappop(tasks))`,
    gotcha: '`heapq` is strictly a MIN-heap. To create a max-heap, invert the numeric priorities (e.g. multiply priority by -1).',
    difficulty: 'Intermediate',
    tags: ['DSA', 'Heap', 'PriorityQueue']
  },
  {
    id: 'node-deque-queue',
    domainId: 'collections',
    title: 'Queue / LinkedList vs collections.deque',
    csharpConcept: '`Queue<T>` (circular buffer) and `LinkedList<T>` (doubly linked node pointers)',
    pythonConcept: '`collections.deque` (doubly-linked fixed-size chunk blocks)',
    cognitiveShift: 'In Python, never use `list.pop(0)` because it requires O(N) memory copy of all trailing elements. Always use `deque.popleft()` for O(1).',
    csharpCode: `var queue = new Queue<string>();
queue.Enqueue("Job 1");
string first = queue.Dequeue();`,
    pythonCode: `from collections import deque

q = deque(maxlen=1000)
q.append("Job 1")
first = q.popleft()  # O(1) time complexity`,
    sandboxCode: `from collections import deque

dq = deque([10, 20, 30], maxlen=3)
dq.append(40) # Evicts 10 from the left!
print("Bounded ring buffer:", list(dq))
dq.appendleft(99) # Evicts 40 from the right!
print("After appendleft:", list(dq))`,
    gotcha: 'Arbitrary index access in a deque (`dq[500]`) is O(N) traversal. Use standard `list` for random indexing and `deque` for FIFO/LIFO queues.',
    difficulty: 'Intermediate',
    tags: ['DSA', 'Queue', 'Deque']
  },

  // DOMAIN: CONTROL FLOW & ERRORS
  {
    id: 'node-lbyl-eafp',
    domainId: 'control-flow',
    title: 'LBYL vs EAFP Error Handling',
    csharpConcept: 'Look-Before-You-Leap: check state (`File.Exists()`, `dict.ContainsKey()`) before invoking',
    pythonConcept: 'Easier-to-Ask-Forgiveness-than-Permission: execute directly inside `try...except`',
    cognitiveShift: 'In Python, exception handling is lightweight and idiomatic. EAFP prevents race conditions (Time-of-Check to Time-of-Use bugs).',
    csharpCode: `// C# LBYL: Defensive checks avoid expensive CLR exceptions
if (File.Exists(path)) {
    var content = File.ReadAllText(path);
}`,
    pythonCode: `# Python EAFP: Execute directly and catch specific exception
try:
    with open(path) as f:
        content = f.read()
except FileNotFoundError:
    content = ""`,
    sandboxCode: `def parse_age(payload: dict) -> int:
    # EAFP style:
    try:
        return int(payload["age"])
    except (KeyError, ValueError):
        return 0

print("Valid age:", parse_age({"age": "28"}))
print("Missing key:", parse_age({"name": "Sam"}))
print("Invalid text:", parse_age({"age": "unknown"}))`,
    gotcha: 'Never use bare `except:` because it catches system signals like `KeyboardInterrupt` and `SystemExit`. Always catch specific exceptions.',
    difficulty: 'Fundamental',
    tags: ['Exceptions', 'EAFP', 'LBYL']
  },
  {
    id: 'node-context-disposable',
    domainId: 'control-flow',
    title: 'IDisposable & using vs Context Managers',
    csharpConcept: '`IDisposable` and `using` statements generating try/finally blocks calling `.Dispose()`',
    pythonConcept: '`with` statement triggering dunder methods `__enter__()` and `__exit__()` or `@contextmanager`',
    cognitiveShift: 'Context managers are not just for files. They are first-class architectural hooks for transactions, telemetry spans, and locks.',
    csharpCode: `using (var connection = new SqlConnection(connStr)) {
    connection.Open();
    // Database work
}`,
    pythonCode: `from contextlib import contextmanager

@contextmanager
def db_transaction():
    print("BEGIN TRANSACTION")
    try:
        yield
        print("COMMIT")
    except Exception:
        print("ROLLBACK")
        raise

with db_transaction():
    print("Executing query...")`,
    sandboxCode: `from contextlib import contextmanager
import time

@contextmanager
def timer_span(label: str):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = (time.perf_counter() - start) * 1000
        print(f"[{label}] elapsed: {elapsed:.2f}ms")

with timer_span("Heavy Calculation"):
    total = sum(i * i for i in range(100_000))
print("Done calculation.")`,
    gotcha: 'If `__exit__` returns `True`, it swallows any exception that occurred inside the block. Returning `False` (or None) re-raises it.',
    difficulty: 'Intermediate',
    tags: ['Context Manager', 'IDisposable', 'Resource Management']
  },
  {
    id: 'node-pattern-matching',
    domainId: 'control-flow',
    title: 'Switch Expressions vs Match/Case (PEP 634)',
    csharpConcept: 'C# 8.0+ switch expressions with type patterns and property sub-patterns',
    pythonConcept: 'Python 3.10+ `match...case` structural pattern matching with sequence unpacking',
    cognitiveShift: 'Python `match/case` does not just check values; it unpacks data structures, binds matched sub-components, and checks types simultaneously.',
    csharpCode: `var description = response switch {
    { StatusCode: 200, Body: var b } => $"OK: {b}",
    { StatusCode: 404 } => "Not Found",
    _ => "Unknown status"
};`,
    pythonCode: `match response:
    case {"status": 200, "data": [first, *rest]}:
        print(f"Success with {len(rest) + 1} items: {first}")
    case {"status": 404}:
        print("Resource not found")
    case _:
        print("Fallback handler")`,
    sandboxCode: `def handle_command(cmd):
    match cmd.split():
        case ["quit" | "exit"]:
            return "Terminating application"
        case ["load", filename]:
            return f"Loading file: {filename}"
        case ["resize", int(w), int(h)]:
            return f"Resizing canvas to {w}x{h}"
        case _:
            return "Unrecognized command"

print(handle_command("resize 1920 1080"))
print(handle_command("load dataset.csv"))
print(handle_command("quit"))`,
    gotcha: 'Writing `case x:` without wildcards or constants will bind any value to the variable `x`. Use `case _:` for catch-all fallbacks.',
    difficulty: 'Intermediate',
    tags: ['Pattern Matching', 'PEP 634', 'Control Flow']
  },

  // DOMAIN: OOP & METAPROGRAMMING
  {
    id: 'node-interfaces-protocols',
    domainId: 'oop',
    title: 'Interfaces vs Protocols & Duck Typing',
    csharpConcept: 'Nominal inheritance: `class Car : IVehicle` must explicitly declare interface conformance',
    pythonConcept: 'Structural subtyping via `typing.Protocol` (PEP 544) or natural Duck Typing',
    cognitiveShift: 'In Python, if an object has the required methods, it is valid! Protocols allow static checkers to verify structural compatibility without subclassing.',
    csharpCode: `public interface ISerializable {
    string ToJson();
}
public class Report : ISerializable {
    public string ToJson() => "{}";
}`,
    pythonCode: `from typing import Protocol

class Serializable(Protocol):
    def to_json(self) -> str: ...

# Any class with to_json() satisfies Serializable automatically:
class Report:
    def to_json(self) -> str:
        return "{}"`,
    sandboxCode: `from typing import Protocol

class Greeter(Protocol):
    def greet(self) -> str: ...

class Human:
    def greet(self) -> str:
        return "Hello, Developer!"

class Robot:
    def greet(self) -> str:
        return "01001000 01101001"

def welcome(g: Greeter):
    print("Welcome output:", g.greet())

welcome(Human())
welcome(Robot())`,
    gotcha: 'Abstract Base Classes (`abc.ABC`) enforce inheritance check at instantiation time. Protocols enforce structural conformance at static lint time.',
    difficulty: 'Architectural',
    tags: ['OOP', 'Protocols', 'Duck Typing', 'Interfaces']
  },
  {
    id: 'node-properties',
    domainId: 'oop',
    title: 'Properties & Encapsulation',
    csharpConcept: '`public int Count { get; private set; }` with backing fields',
    pythonConcept: 'Public attributes by default; smoothly upgrade to `@property` with zero API break',
    cognitiveShift: 'Never write pointless `get_value()` and `set_value()` in Python! Start with a plain attribute `self.count = 0` and convert to `@property` only when logic is needed.',
    csharpCode: `public class BankAccount {
    private decimal _balance;
    public decimal Balance {
        get => _balance;
        set {
            if (value < 0) throw new ArgumentException();
            _balance = value;
        }
    }
}`,
    pythonCode: `class BankAccount:
    def __init__(self):
        self._balance = 0.0

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, value: float):
        if value < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = value`,
    sandboxCode: `class Temperature:
    def __init__(self, celsius: float):
        self.celsius = celsius

    @property
    def fahrenheit(self) -> float:
        return (self.celsius * 9/5) + 32

t = Temperature(25.0)
print(f"Celsius: {t.celsius}°C = Fahrenheit: {t.fahrenheit}°F")`,
    gotcha: 'Properties look like attributes but execute arbitrary code. Heavy computations in `@property` will secretly slow down callers.',
    difficulty: 'Fundamental',
    tags: ['OOP', 'Encapsulation', 'Properties']
  },
  {
    id: 'node-dunder-reflection',
    domainId: 'oop',
    title: 'Reflection & Attributes vs Dunder Magic Methods',
    csharpConcept: 'CLR Reflection (`typeof(T).GetMethods()`) and custom metadata attributes `[Authorize]`',
    pythonConcept: 'Dunder protocols (`__getitem__`, `__call__`, `__len__`, `__repr__`) and Decorators',
    cognitiveShift: 'Python gives you direct access to the object runtime via standard dunders. Implementing `__getitem__` turns your class into a bracket-accessible collection `obj[i]`.',
    csharpCode: `[Benchmark]
public void Calculate() { /* ... */ }

// C# custom indexer:
public string this[int index] => _items[index];`,
    pythonCode: `def benchmark(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@benchmark
def calculate():
    pass

class CustomDeck:
    def __getitem__(self, index):
        return f"Card #{index}"`,
    sandboxCode: `class Multiplier:
    def __init__(self, factor: int):
        self.factor = factor
    # Makes instance callable like a function!
    def __call__(self, x: int) -> int:
        return x * self.factor

triple = Multiplier(3)
print("Callable instance triple(7):", triple(7))`,
    gotcha: 'Decorators change the function signature unless wrapped with `@functools.wraps(func)` to preserve docstrings and names.',
    difficulty: 'Intermediate',
    tags: ['Metaprogramming', 'Dunders', 'Decorators']
  },

  // DOMAIN: CONCURRENCY & RUNTIMES
  {
    id: 'node-async-eventloop',
    domainId: 'concurrency',
    title: 'Thread Pool Tasks vs asyncio Event Loop',
    csharpConcept: '`Task.Run()` dispatched across OS threads on the CLR thread pool with work-stealing scheduling',
    pythonConcept: '`asyncio` cooperative multitasking executing coroutines on a single OS thread via an event loop',
    cognitiveShift: 'In C#, `async/await` can hop across different OS threads. In Python `asyncio`, code runs on ONE OS thread unless explicitly handed off to an executor.',
    csharpCode: `// C#: Task runs on CLR thread pool
public async Task<string> FetchDataAsync() {
    using var client = new HttpClient();
    return await client.GetStringAsync("https://api.com");
}`,
    pythonCode: `# Python: Coroutine yields execution back to single-threaded loop
import asyncio
import httpx

async def fetch_data():
    async with httpx.AsyncClient() as client:
        resp = await client.get("https://api.com")
        return resp.text`,
    sandboxCode: `import asyncio

async def worker(name: str, delay_steps: int):
    for i in range(delay_steps):
        print(f"Worker {name} step {i+1}")
        await asyncio.sleep(0.01) # Yields control
    return f"{name} complete"

async def main():
    results = await asyncio.gather(
        worker("A", 2),
        worker("B", 2)
    )
    print("All workers done:", results)

asyncio.run(main())`,
    gotcha: 'Calling a blocking synchronous function (like `time.sleep()` or `requests.get()`) inside an async Python function freezes the entire application event loop!',
    difficulty: 'Architectural',
    tags: ['Async', 'Concurrency', 'Event Loop', 'asyncio']
  },
  {
    id: 'node-gil-multiprocessing',
    domainId: 'concurrency',
    title: 'Multi-threaded CPU vs GIL & Multiprocessing',
    csharpConcept: 'True parallel CPU threads across all cores with shared memory barriers, locks, and `Parallel.ForEach`',
    pythonConcept: 'Global Interpreter Lock (GIL) serializes bytecode; CPU parallelism requires `multiprocessing` or Free-Threaded 3.13+',
    cognitiveShift: 'For CPU-heavy work in Python, don\'t use `threading.Thread`. Use `concurrent.futures.ProcessPoolExecutor` to spawn separate OS processes with isolated heaps.',
    csharpCode: `Parallel.ForEach(images, img => {
    ProcessImage(img); // Utilizes 100% of all CPU cores
});`,
    pythonCode: `from concurrent.futures import ProcessPoolExecutor
import os

with ProcessPoolExecutor(max_workers=os.cpu_count()) as executor:
    results = list(executor.map(process_image, images))`,
    sandboxCode: `import os
print("Available CPU cores for multiprocessing:", os.cpu_count())
print("CPython free-threading PEP 703 is rolling out in Python 3.13+")`,
    gotcha: 'Data passed between processes in `multiprocessing` must be serialized (pickled), which incurs an IPC memory copy overhead.',
    difficulty: 'Architectural',
    tags: ['GIL', 'Multiprocessing', 'CPU Bound', 'PEP 703']
  },

  // DOMAIN: TOOLING & ECOSYSTEM
  {
    id: 'node-packaging-project',
    domainId: 'tooling',
    title: 'csproj & NuGet vs pyproject.toml & uv',
    csharpConcept: '`.csproj` XML configuration + `dotnet add package` managing global NuGet cache',
    pythonConcept: 'Modern `pyproject.toml` standard (PEP 621) + `uv` (Rust-powered ultra-fast package resolver)',
    cognitiveShift: 'Python has moved away from scattered `setup.py` and `requirements.txt`. Modern projects declare all metadata, dependencies, and tools in a single `pyproject.toml`.',
    csharpCode: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  </ItemGroup>
</Project>`,
    pythonCode: `[project]
name = "enterprise-service"
version = "0.1.0"
dependencies = [
    "fastapi>=0.110.0",
    "pydantic>=2.7.0",
    "uvicorn>=0.29.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"`,
    sandboxCode: `# uv commands for C# developers:
# dotnet new console  --> uv init my-app
# dotnet add package  --> uv add fastapi
# dotnet run          --> uv run main.py
# dotnet test         --> uv run pytest
print("Modern Python standard: pyproject.toml + uv")`,
    gotcha: 'Never install packages into your global system Python environment. Always isolate per-project virtual environments (`uv venv` or `.venv`).',
    difficulty: 'Fundamental',
    tags: ['Tooling', 'uv', 'pyproject.toml', 'NuGet']
  },
  {
    id: 'node-linters-analyzers',
    domainId: 'tooling',
    title: 'Roslyn Analyzers vs Ruff & Pyright',
    csharpConcept: 'Roslyn compile-time analyzers and code fixes integrated directly into MSBuild / IDE',
    pythonConcept: '`Ruff` (extremely fast Rust-based linter and formatter) + `Pyright` (type engine powering Pylance)',
    cognitiveShift: 'Ruff runs in ~10 milliseconds across entire repositories, replacing flake8, isort, black, and autoflake in a single tool.',
    csharpCode: `// In .editorconfig / Directory.Build.props:
// <TreatWarningsAsErrors>true</TreatWarningsAsErrors>`,
    pythonCode: `# In pyproject.toml:
[tool.ruff]
line-length = 88
select = ["E", "F", "I", "UP", "B"]

[tool.pyright]
typeCheckingMode = "strict"`,
    sandboxCode: `print("Modern Python Toolchain Stack:")
print("1. Package Manager: uv (Rust)")
print("2. Linter & Formatter: Ruff (Rust)")
print("3. Static Type Engine: Pyright (Microsoft)")`,
    gotcha: 'Without a static type checker configured in your CI/CD pipeline, type annotations are never validated during deployment.',
    difficulty: 'Fundamental',
    tags: ['Tooling', 'Ruff', 'Pyright', 'Roslyn']
  },

  // DOMAIN: FUNCTIONS, CLOSURES & DECORATORS
  {
    id: 'node-first-class-functions',
    domainId: 'functions',
    title: 'First-Class Functions vs Delegates',
    csharpConcept: '`Func<T,TResult>` / `Action<T>` delegates and lambda expressions',
    pythonConcept: 'Functions are ordinary objects — pass, store, and return them like any value',
    cognitiveShift: 'C# needs a delegate type to treat a function as a value. In Python every function already IS a first-class object — no wrapper type required.',
    csharpCode: `Func<int, int, int> add = (a, b) => a + b;
int Apply(Func<int, int, int> op, int x, int y) => op(x, y);
Console.WriteLine(Apply(add, 2, 3)); // 5`,
    pythonCode: `add = lambda a, b: a + b

def apply(op, x, y):
    return op(x, y)

print(apply(add, 2, 3))  # 5`,
    sandboxCode: `def apply(op, x, y):
    return op(x, y)

print(apply(lambda a, b: a + b, 2, 3))
print(apply(max, 2, 3))
print(apply(lambda a, b: f"{a}-{b}", "py", "cs"))`,
    gotcha: 'A `lambda` body must be a single expression — no statements, no assignments. Reach for a named `def` the moment logic needs more than one line.',
    difficulty: 'Fundamental',
    tags: ['Functions', 'Lambda', 'Delegates']
  },
  {
    id: 'node-closures',
    domainId: 'functions',
    title: 'Closures & Captured Scope',
    csharpConcept: 'Lambda expressions capturing outer local variables by reference',
    pythonConcept: 'Nested functions capturing enclosing-scope names, `nonlocal` for rebinding',
    cognitiveShift: 'Both languages close over variables, not snapshots — but Python requires an explicit `nonlocal` keyword to *rebind* (not just read) a captured name from an inner function.',
    csharpCode: `Func<int> MakeCounter()
{
    int count = 0;
    return () => ++count; // captured by reference
}
var counter = MakeCounter();
Console.WriteLine(counter()); // 1`,
    pythonCode: `def make_counter():
    count = 0
    def increment():
        nonlocal count  # required to REBIND, not just read
        count += 1
        return count
    return increment

counter = make_counter()
print(counter())  # 1`,
    sandboxCode: `def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

c1 = make_counter()
c2 = make_counter()
print(c1(), c1(), c1())  # 1 2 3 — c1's own closure state
print(c2())              # 1 — independent closure`,
    gotcha: 'Forgetting `nonlocal` makes `count += 1` create a brand-new LOCAL variable inside the inner function, raising `UnboundLocalError` instead of mutating the outer one.',
    difficulty: 'Intermediate',
    tags: ['Closures', 'Scope', 'nonlocal']
  },
  {
    id: 'node-decorators-mindmap',
    domainId: 'functions',
    title: 'Decorators as Higher-Order Functions',
    csharpConcept: 'Attributes + AOP interceptors (Castle DynamicProxy, source generators)',
    pythonConcept: '`@decorator` syntax — a function that wraps another function',
    cognitiveShift: 'A C# attribute is inert metadata until something reflects on it. A Python decorator runs immediately at import time and can genuinely replace the function it decorates.',
    csharpCode: `[Obsolete("Use NewMethod instead")]
public void OldMethod() { }
// Attribute is metadata — needs reflection/AOP to add behavior`,
    pythonCode: `def deprecated(func):
    def wrapper(*args, **kwargs):
        print(f"Warning: {func.__name__} is deprecated")
        return func(*args, **kwargs)
    return wrapper

@deprecated
def old_method():
    pass

old_method()  # prints warning, then runs`,
    sandboxCode: `def deprecated(func):
    def wrapper(*args, **kwargs):
        print(f"Warning: {func.__name__} is deprecated")
        return func(*args, **kwargs)
    return wrapper

@deprecated
def old_method():
    print("doing the old thing")

old_method()`,
    gotcha: 'Forgetting `@functools.wraps(func)` inside the wrapper silently replaces the original function’s `__name__` and docstring, breaking introspection and some testing/logging tools.',
    difficulty: 'Intermediate',
    tags: ['Decorators', 'Higher-Order Functions', 'Metaprogramming']
  },

  // DOMAIN: TESTING & QUALITY ASSURANCE
  {
    id: 'node-test-frameworks',
    domainId: 'testing',
    title: 'Test Framework & Assertion Style',
    csharpConcept: 'xUnit `[Fact]`/`[Theory]` with `Assert.Equal(expected, actual)`',
    pythonConcept: 'pytest plain `assert` statements — no special assertion API needed',
    cognitiveShift: 'pytest rewrites plain `assert` expressions at collection time to produce rich failure diffs, so you never need a dedicated `Assert.*` API the way xUnit/NUnit require.',
    csharpCode: `[Fact]
public void Sum_AddsTwoNumbers()
{
    var result = Calculator.Add(2, 3);
    Assert.Equal(5, result);
}`,
    pythonCode: `def test_sum_adds_two_numbers():
    result = calculator.add(2, 3)
    assert result == 5  # plain assert — pytest rewrites it for rich diffs`,
    sandboxCode: `def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

test_add()
print("All assertions passed")`,
    gotcha: 'Running Python with the `-O` (optimize) flag strips ALL `assert` statements from the bytecode — never rely on production code paths executing an `assert` for anything safety-critical.',
    difficulty: 'Fundamental',
    tags: ['Testing', 'pytest', 'xUnit']
  },
  {
    id: 'node-mocking-mindmap',
    domainId: 'testing',
    title: 'Mocking Dependencies',
    csharpConcept: 'Moq/NSubstitute creating a fake behind an injected interface',
    pythonConcept: '`unittest.mock.patch()` replacing an object at its import path',
    cognitiveShift: 'C# mocking substitutes an interface implementation. Python mocking substitutes whatever object lives at a specific import path — no interface required, but the path must match exactly.',
    csharpCode: `var mockGateway = new Mock<IPaymentGateway>();
mockGateway.Setup(g => g.Charge(100)).Returns(true);
var service = new Checkout(mockGateway.Object);`,
    pythonCode: `from unittest.mock import patch

@patch("checkout_service.payment_gateway.charge")
def test_checkout(mock_charge):
    mock_charge.return_value = True
    result = checkout_service.complete(100)
    assert result is True`,
    sandboxCode: `from unittest.mock import MagicMock

gateway = MagicMock()
gateway.charge.return_value = True

def checkout(gw, amount):
    return gw.charge(amount)

print(checkout(gateway, 100))
gateway.charge.assert_called_once_with(100)
print("Mock verified")`,
    gotcha: 'Patching a function at its DEFINING module instead of where it’s IMPORTED and called silently does nothing — the calling code already bound a separate reference to the un-patched original.',
    difficulty: 'Intermediate',
    tags: ['Testing', 'Mocking', 'unittest.mock']
  },
  {
    id: 'node-type-checking-mindmap',
    domainId: 'testing',
    title: 'Static Type Checking',
    csharpConcept: 'Compiler-enforced static typing — mismatches fail the build',
    pythonConcept: 'Pyright/mypy analyze type hints separately — never enforced at runtime',
    cognitiveShift: 'A Python type error caught by Pyright is a *linter finding*, not a build failure — the exact same file runs fine even if the type checker is never invoked.',
    csharpCode: `int Add(int a, int b) => a + b;
Add("2", "3"); // Compile Error CS1503 — build fails`,
    pythonCode: `def add(a: int, b: int) -> int:
    return a + b

add("2", "3")  # Pyright/mypy flags this — but it RUNS anyway`,
    sandboxCode: `def add(a: int, b: int) -> int:
    return a + b

# Type hints are NOT enforced at runtime — this executes without error
print(add("2", "3"))  # "23" — string concatenation, not addition!`,
    gotcha: 'Type hints are pure documentation to the interpreter — always run a type checker (Pyright/mypy) as an explicit CI step; the interpreter itself will never catch a type mismatch.',
    difficulty: 'Fundamental',
    tags: ['Typing', 'Pyright', 'mypy', 'Static Analysis']
  },

  // DOMAIN: WEB, DATA & AI ECOSYSTEM
  {
    id: 'node-web-request-lifecycle',
    domainId: 'web-data-ai',
    title: 'Web Request Lifecycle',
    csharpConcept: 'ASP.NET Core middleware pipeline + model binding to a typed DTO',
    pythonConcept: 'FastAPI dependency injection + Pydantic request validation',
    cognitiveShift: 'Both frameworks validate the incoming request against a typed model before your handler runs — FastAPI just derives that model from ordinary Python type hints instead of a dedicated attributed class.',
    csharpCode: `[HttpPost("/orders")]
public IActionResult Create(CreateOrderRequest request)
{
    // [ApiController] already validated request via data annotations
    return Ok(orderService.Create(request));
}`,
    pythonCode: `@app.post("/orders")
def create_order(request: CreateOrderRequest):
    # FastAPI already validated request via Pydantic before this runs
    return order_service.create(request)`,
    sandboxCode: `# Simulated request validation, the way Pydantic/FastAPI do it
def validate_order(payload: dict) -> dict:
    if "amount" not in payload or payload["amount"] <= 0:
        raise ValueError("amount must be positive")
    return payload

print(validate_order({"amount": 49.99}))
try:
    validate_order({"amount": -5})
except ValueError as e:
    print("Rejected:", e)`,
    gotcha: 'FastAPI’s automatic type coercion (a `"42"` JSON string becomes `int 42`) is more permissive by default than ASP.NET Core’s stricter model binder — verify coercion behavior for anything precision-sensitive.',
    difficulty: 'Intermediate',
    tags: ['Web', 'FastAPI', 'ASP.NET Core']
  },
  {
    id: 'node-dataframe-linq',
    domainId: 'web-data-ai',
    title: 'DataFrames vs LINQ Collections',
    csharpConcept: 'LINQ over `IEnumerable<T>` — row-oriented, one delegate call per element',
    pythonConcept: 'pandas DataFrame — column-oriented, vectorized C operations',
    cognitiveShift: 'LINQ models a table as a sequence of row objects. pandas models it as a dict of typed columns — a `groupby().mean()` is one vectorized pass over a column, not N row-by-row delegate calls.',
    csharpCode: `var avgBySymbol = trades
    .GroupBy(t => t.Symbol)
    .Select(g => new { g.Key, Avg = g.Average(t => t.Price) });`,
    pythonCode: `import pandas as pd
avg_by_symbol = df.groupby("symbol")["price"].mean()  # vectorized, columnar`,
    sandboxCode: `# Illustrating the columnar mental model without pandas installed
trades = [
    {"symbol": "MSFT", "price": 410.2},
    {"symbol": "MSFT", "price": 411.0},
    {"symbol": "AAPL", "price": 189.5},
]
by_symbol: dict[str, list[float]] = {}
for t in trades:
    by_symbol.setdefault(t["symbol"], []).append(t["price"])

for symbol, prices in by_symbol.items():
    print(symbol, "avg:", sum(prices) / len(prices))`,
    gotcha: 'Iterating a DataFrame with `.iterrows()` out of `foreach` habit reconstructs a boxed Python object per row — dramatically slower than any vectorized column operation.',
    difficulty: 'Intermediate',
    tags: ['Data', 'pandas', 'LINQ']
  },
  {
    id: 'node-ml-training-loop',
    domainId: 'web-data-ai',
    title: 'ML Training Loop Anatomy',
    csharpConcept: 'ML.NET `MLContext` pipeline: `.Fit()` / `.Transform()`',
    pythonConcept: 'scikit-learn/PyTorch: forward pass → loss → backward pass → optimizer step',
    cognitiveShift: 'ML.NET wraps training behind one `.Fit()` call. PyTorch exposes every step of the loop explicitly — you write the gradient-descent iteration yourself, trading conciseness for full control.',
    csharpCode: `var pipeline = mlContext.Transforms
    .Concatenate("Features", "SepalLength", "SepalWidth")
    .Append(mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy());
var model = pipeline.Fit(trainingData); // training is one call`,
    pythonCode: `for epoch in range(epochs):
    predictions = model(inputs)          # forward pass
    loss = loss_fn(predictions, targets)
    loss.backward()                      # compute gradients
    optimizer.step()                     # apply gradient update
    optimizer.zero_grad()`,
    sandboxCode: `# Simplified gradient descent, no ML framework required
def loss_fn(w, x, y):
    return (w * x - y) ** 2

w, x, y, lr = 0.0, 2.0, 10.0, 0.05
for epoch in range(5):
    loss = loss_fn(w, x, y)
    grad = 2 * (w * x - y) * x  # d(loss)/dw
    w -= lr * grad
    print(f"epoch {epoch}: w={w:.3f} loss={loss:.3f}")`,
    gotcha: 'Forgetting `optimizer.zero_grad()` accumulates gradients across iterations instead of resetting them — PyTorch does NOT clear gradients automatically between steps.',
    difficulty: 'Architectural',
    tags: ['AI/ML', 'PyTorch', 'ML.NET']
  }
];
