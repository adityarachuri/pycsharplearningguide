import { ComparisonItem } from '../types';

export const COMPARISON_CATEGORIES = [
  { id: 'all', label: 'All Comparisons' },
  { id: 'syntax', label: 'Syntax & Primitives' },
  { id: 'collections', label: 'LINQ vs Comprehensions' },
  { id: 'paradigm', label: 'Paradigms & Architecture' },
  { id: 'async', label: 'Async & Concurrency' },
  { id: 'memory', label: 'Memory & Resources' },
  { id: 'typing', label: 'Type Systems' }
];

export const COMPARISON_MATRIX_ITEMS: ComparisonItem[] = [
  {
    id: 'comp-variables',
    concept: 'Variable Declaration & Typing',
    category: 'syntax',
    csharpCode: `// C#: Explicit type or var (statically inferred at compile time)
int age = 42;
string name = "Alex";
var active = true;

// Reassignment to different type causes compile-time error
// age = "forty-two"; // Error CS0029`,
    pythonCode: `# Python: Dynamic binding to heap objects
age = 42
name = "Alex"
active = True

# Type annotations (optional, for static linters):
count: int = 100

# Name can refer to any type dynamically:
age = "forty-two" # Valid at runtime`,
    mentalShift: 'In C#, variables are typed storage bins. In Python, variables are tag names pointing to heap-allocated objects.',
    csharpPhilosophy: 'Type safety guaranteed before running code; compiler prevents unexpected mutations.',
    pythonPhilosophy: 'Maximum development velocity and flexibility; enforce boundaries via tests, linters, and Pydantic.',
    keyTakeaway: 'Python names are pointers, not fixed-type memory slots.'
  },
  {
    id: 'comp-null-none',
    concept: 'Nullability & Absence of Value',
    category: 'syntax',
    csharpCode: `// C# Nullable Reference Types and null-coalescing
string? nickname = null;
string displayName = nickname ?? "Guest";
int length = nickname?.Length ?? 0;

// Explicit null checks:
if (nickname == null) { /* ... */ }`,
    pythonCode: `# Python: NoneType singleton 'None'
nickname = None
display_name = nickname if nickname is not None else "Guest"
# Or using truthiness fallback:
display_name = nickname or "Guest"

# Idiomatic check uses 'is' operator (identity):
if nickname is None:
    pass`,
    mentalShift: 'Never use `== None` in Python. Always use `is None` or `is not None` because `None` is a unique heap singleton.',
    csharpPhilosophy: 'Compiler tracks null-state flow via Nullable Reference Types (? annotations).',
    pythonPhilosophy: 'None is a first-class object singleton of type NoneType; falsy in boolean contexts.',
    keyTakeaway: 'Always write `if val is None:` instead of `if val == None:`.'
  },
  {
    id: 'comp-linq-where-select',
    concept: 'LINQ (Where & Select) vs Comprehensions',
    category: 'collections',
    csharpCode: `// C# LINQ Fluent Syntax
var result = numbers
    .Where(n => n % 2 == 0)
    .Select(n => n * n)
    .ToList();

// Query Expression Syntax:
var query = from n in numbers
            where n % 2 == 0
            select n * n;`,
    pythonCode: `# Python List Comprehension:
# [transform(x) for x in iterable if condition(x)]
result = [n * n for n in numbers if n % 2 == 0]

# For lazy streaming (like IEnumerable without .ToList()):
# Generator expression:
lazy_stream = (n * n for n in numbers if n % 2 == 0)`,
    mentalShift: 'Python list comprehensions directly mirror C# LINQ query syntax: `[select for from where]`. Generator expressions provide lazy streaming.',
    csharpPhilosophy: 'Composable delegate pipelines (Func<T, bool>) evaluated lazily via IEnumerable.',
    pythonPhilosophy: 'Native, built-in comprehension syntax baked into the grammar for lists, sets, and dictionaries.',
    keyTakeaway: 'Comprehensions are the single most important Python idiom for C# developers.'
  },
  {
    id: 'comp-linq-aggregates',
    concept: 'LINQ Aggregates (Sum, Max, Any, All)',
    category: 'collections',
    csharpCode: `// C# LINQ Aggregates
bool hasAdmin = users.Any(u => u.IsAdmin);
bool allActive = users.All(u => u.IsActive);
int totalPoints = users.Sum(u => u.Score);
var topScorer = users.MaxBy(u => u.Score);`,
    pythonCode: `# Python Built-in Generator Aggregates
has_admin = any(u.is_admin for u in users)
all_active = all(u.is_active for u in users)
total_points = sum(u.score for u in users)
top_scorer = max(users, key=lambda u: u.score)`,
    mentalShift: 'Instead of fluent methods on the collection, Python passes generator expressions into global built-in functions: `any()`, `all()`, `sum()`, `max()`.',
    csharpPhilosophy: 'Extension methods extending IEnumerable<T> with lambda predicates.',
    pythonPhilosophy: 'Universal built-ins accepting any object supporting the iteration protocol.',
    keyTakeaway: 'Pass generator expressions without brackets directly to `any()`, `sum()`, etc.'
  },
  {
    id: 'comp-linq-groupby',
    concept: 'LINQ GroupBy vs itertools.groupby & DefaultDict',
    category: 'collections',
    csharpCode: `// C# LINQ GroupBy
var grouped = orders
    .GroupBy(o => o.CustomerId)
    .ToDictionary(
        g => g.Key, 
        g => g.ToList()
    );`,
    pythonCode: `from collections import defaultdict

# Approach 1: defaultdict (Most common & idiomatic in Python)
grouped = defaultdict(list)
for order in orders:
    grouped[order.customer_id].append(order)

# Approach 2: itertools.groupby (requires prior sorting by key!)
# from itertools import groupby
# sorted_orders = sorted(orders, key=lambda o: o.customer_id)
# grouped = {k: list(g) for k, g in groupby(sorted_orders, key=lambda o: o.customer_id)}`,
    mentalShift: 'CRITICAL PITFALL: `itertools.groupby()` in Python only groups CONSECUTIVE items (like Unix uniq). Real-world grouping usually uses `collections.defaultdict(list)`.',
    csharpPhilosophy: 'Full hash-based partition of sequence into IGrouping<TKey, TElement>.',
    pythonPhilosophy: 'Explicit dictionary accumulation with defaultdict for linear O(N) performance.',
    keyTakeaway: 'Use `collections.defaultdict(list)` for grouping, not `itertools.groupby` unless sorted.'
  },
  {
    id: 'comp-records-dataclasses',
    concept: 'C# Records vs Python Dataclasses',
    category: 'paradigm',
    csharpCode: `// C# 9+ Positional Record
public record UserRecord(int Id, string Name, string Email)
{
    // Auto-generates: constructor, value equality, 
    // ToString, Deconstruct, with-expressions:
    // var u2 = u1 with { Name = "New" };
}`,
    pythonCode: `from dataclasses import dataclass, replace

# Python 3.7+ Dataclass
@dataclass(frozen=True, slots=True)
class UserRecord:
    id: int
    name: str
    email: str

# Auto-generates __init__, __eq__, __repr__, __hash__
u1 = UserRecord(1, "Alex", "alex@example.com")

# Equivalent of C# with-expression:
u2 = replace(u1, name="New")`,
    mentalShift: 'Python `@dataclass` gives you the exact same boilerplate elimination as C# `record`. Adding `frozen=True` makes it immutable and hashable.',
    csharpPhilosophy: 'Compiler emits init-only properties, synthesized Equals, GetHashCode, and Clone method.',
    pythonPhilosophy: 'Decorator inspects class type annotations and generates dunder methods dynamically.',
    keyTakeaway: 'Use `@dataclass(frozen=True, slots=True)` for domain value objects and DTOs.'
  },
  {
    id: 'comp-interfaces-protocols',
    concept: 'Interfaces vs Duck Typing & Protocols',
    category: 'typing',
    csharpCode: `// C# Nominal Interface
public interface IMessageSender
{
    void Send(string message);
}

// Concrete class MUST explicitly declare inheritance:
public class EmailService : IMessageSender
{
    public void Send(string message) => Console.WriteLine(message);
}`,
    pythonCode: `from typing import Protocol

# Structural Subtyping (PEP 544 Protocol)
class MessageSender(Protocol):
    def send(self, message: str) -> None: ...

# Notice NO inheritance here! Duck typing in action:
class EmailService:
    def send(self, message: str) -> None:
        print(message)

# Static checkers (mypy/pyright) accept EmailService 
# everywhere MessageSender is requested!`,
    mentalShift: 'C# uses nominal typing (classes must name interfaces). Python uses structural typing (classes just need the matching method signatures).',
    csharpPhilosophy: 'Rigid interface implementation contracts enforced by CLR vtable dispatch.',
    pythonPhilosophy: '"If it walks like a duck and quacks like a duck, it is a duck."',
    keyTakeaway: 'Protocols eliminate unnecessary Adapter classes when integrating third-party code.'
  },
  {
    id: 'comp-async-task',
    concept: 'Async/Await: Task Parallelism vs Event Loop',
    category: 'async',
    csharpCode: `// C# Task-based Asynchronous Pattern (TAP)
public async Task<int> ComputeAsync()
{
    // Awaiting releases the thread to the ThreadPool
    var data = await _httpClient.GetStringAsync("https://api.test");
    // Resumes on any available ThreadPool worker thread
    return data.Length;
}`,
    pythonCode: `import httpx

async def compute_async() -> int:
    # Awaiting yields control back to the single-threaded event loop
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.test")
    # Resumes on the SAME thread when socket I/O is ready
    return len(response.text)`,
    mentalShift: 'In C#, multiple async operations can execute on different OS threads simultaneously. In Python asyncio, all coroutines run on ONE thread cooperating at `await` points.',
    csharpPhilosophy: 'Preemptive OS thread pool scheduling with multi-core parallelism.',
    pythonPhilosophy: 'Single-threaded cooperative event loop (epoll) eliminating shared-memory locking.',
    keyTakeaway: 'Async Python has no multi-thread race conditions, but blocking code freezes everything.'
  },
  {
    id: 'comp-disposable-with',
    concept: 'Resource Scopes: using vs with statement',
    category: 'memory',
    csharpCode: `// C# IDisposable and using statement
using (var stream = new FileStream("data.bin", FileMode.Open))
{
    // Stream.Dispose() is guaranteed called on scope exit
    Process(stream);
}

// C# 8+ using declaration:
using var reader = new StreamReader("log.txt");`,
    pythonCode: `# Python Context Manager and with statement
with open("data.bin", "rb") as stream:
    # stream.__exit__() is guaranteed called on exit
    process(stream)

# Multiple resources:
with open("in.txt") as src, open("out.txt", "w") as dst:
    dst.write(src.read())`,
    mentalShift: 'Python `with` statement calls `__enter__` and `__exit__`. In addition to closing resources, `__exit__` can inspect, modify, or suppress exceptions.',
    csharpPhilosophy: 'IDisposable contract cleans up unmanaged memory handles and OS handles deterministically.',
    pythonPhilosophy: 'Context manager protocol scopes any stateful boundary (locks, DB transactions, mocking).',
    keyTakeaway: 'Python `with` is conceptually identical to C# `using`, but more versatile.'
  },
  {
    id: 'comp-error-handling',
    concept: 'Exceptions: LBYL vs EAFP',
    category: 'paradigm',
    csharpCode: `// C# Look Before You Leap (LBYL)
// Idiom: Check conditions first to avoid expensive exceptions
if (dictionary.TryGetValue(key, out var val))
{
    Process(val);
}
else
{
    HandleMissing();
}`,
    pythonCode: `# Python Easier to Ask Forgiveness than Permission (EAFP)
# Idiom: Attempt the action and handle the exception cleanly
try:
    val = dictionary[key]
    process(val)
except KeyError:
    handle_missing()

# Python dictionary also supports .get() with fallback:
val = dictionary.get(key, default_value)`,
    mentalShift: 'In C#, exceptions are computationally expensive (stack unwinding). In Python, exceptions are extremely lightweight and standard control flow.',
    csharpPhilosophy: 'Avoid exceptions for expected control flow; use TryParse/TryGetValue patterns.',
    pythonPhilosophy: 'EAFP avoids race conditions (TOCTOU: Time Of Check to Time Of Use) and simplifies happy path.',
    keyTakeaway: 'Embrace `try/except KeyError` in Python without feeling guilty about performance.'
  },
  {
    id: 'comp-linq-zip-enumerate',
    concept: 'Index Iteration: for (int i) vs enumerate & zip',
    category: 'syntax',
    csharpCode: `// C# Index-based iteration
for (int i = 0; i < names.Count; i++)
{
    Console.WriteLine($"{i}: {names[i]}");
}

// Combining two lists:
var pairs = names.Zip(scores, (n, s) => $"{n} scored {s}");`,
    pythonCode: `# Python enumerate (replaces indexed counter loops)
for i, name in enumerate(names):
    print(f"{i}: {name}")

# Python zip (combines parallel sequences in lockstep)
for name, score in zip(names, scores):
    print(f"{name} scored {score}")`,
    mentalShift: 'Python rarely uses `range(len(items))`. If you need an index, use `enumerate()`. If you need to iterate two lists together, use `zip()`.',
    csharpPhilosophy: 'Traditional indexed for-loops or LINQ Zip extensions.',
    pythonPhilosophy: 'First-class iterator combinators generating lightweight tuples on each iteration.',
    keyTakeaway: 'Never write `for i in range(len(items)):`. Always use `for i, item in enumerate(items):`.'
  },
  {
    id: 'comp-lambdas-functions',
    concept: 'First-Class Functions vs Func<T> & Action<T>',
    category: 'paradigm',
    csharpCode: `// C# Delegates and Lambdas
Func<int, int, int> add = (a, b) => a + b;
Action<string> logger = msg => Console.WriteLine(msg);

// Passing method groups as delegates:
ProcessNumbers(numbers, Math.Abs);`,
    pythonCode: `# Python Functions are first-class runtime objects
def add(a: int, b: int) -> int:
    return a + b

# Anonymous lambda (single-expression only in Python):
double = lambda x: x * 2

# Passing functions directly by name:
import math
transformed = list(map(math.fabs, numbers))`,
    mentalShift: 'All Python functions are instances of `<class \'function\'>`. Unlike C# where lambdas can have multi-line block bodies, Python lambdas are restricted to a single expression. For multi-line logic, define a local inner `def`.',
    csharpPhilosophy: 'Strongly-typed delegate signatures verified at compile-time.',
    pythonPhilosophy: 'Universal callable protocol (`__call__`) permitting functions, methods, and classes to interchange.',
    keyTakeaway: 'If a lambda exceeds one line in Python, define a regular `def` function.'
  }
];
