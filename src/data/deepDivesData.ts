import { DeepDiveFeature } from '../types';

export const DEEP_DIVE_FEATURES: DeepDiveFeature[] = [
  {
    id: 'decorators',
    number: 1,
    title: 'Decorators & Function Wrapping',
    tagline: 'Higher-order function transformation vs C# Attributes and Aspect-Oriented Programming',
    csharpEquivalent: 'C# Attributes combined with Castle DynamicProxy / PostSharp AOP or Roslyn Source Generators',
    whyItMatters: 'In C#, attributes are metadata tags inspected via reflection at runtime. In Python, decorators are executable higher-order functions that actually wrap, alter, or replace the target function at module import time.',
    csharpApproach: 'Define an Attribute class, decorate the method, and write an interceptor middleware or reflection scanner to execute behavior.',
    pythonApproach: 'A decorator accepts a callable, defines an inner wrapper function using *args and **kwargs, calls functools.wraps to preserve metadata, and returns the wrapper.',
    csharpCode: `// C# Aspect / ActionFilter approach
public class AuditLogAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext ctx)
    {
        Console.WriteLine($"Invoking {ctx.ActionDescriptor.DisplayName}");
    }
}

[AuditLog]
public IActionResult ProcessPayment(PaymentDto dto)
{
    // Business logic
    return Ok();
}`,
    pythonCode: `from functools import wraps
import time

def audit_log(func):
    """Wraps execution, logs duration and args."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        print(f"Calling {func.__name__} with {args}, {kwargs}")
        try:
            result = func(*args, **kwargs)
            return result
        finally:
            elapsed = time.perf_counter() - start
            print(f"{func.__name__} executed in {elapsed:.4f}s")
    return wrapper

@audit_log
def process_payment(amount: float, currency: str = "USD"):
    # @audit_log on process_payment is equivalent to:
    # process_payment = audit_log(process_payment)
    return {"status": "success", "amount": amount}`,
    underTheHood: 'When Python encounters `@decorator def func(): ...`, it compiles `func`, executes `decorator(func)`, and binds the return value back to the name `func`. If parameterized `@retry(times=3)`, Python first evaluates `retry(3)` which must return the actual decorator function.',
    pitfalls: [
      'Forgetting `@functools.wraps(func)`: strips original `__name__`, `__doc__`, and signature.',
      'Decorating class methods without passing `self` into the wrapper `*args`.',
      'Over-decorating functions, creating deeply nested call stacks that hinder stack trace debugging.'
    ],
    bestPractices: [
      'Always use `@wraps(func)` from functools to preserve introspection and docstrings.',
      'Prefer explicit composition over decorators when behavior does not represent cross-cutting concerns (logging, auth, retry, metrics).',
      'For complex stateful decorators, implement a class with `__call__` method.'
    ]
  },
  {
    id: 'dunder-protocols',
    number: 2,
    title: 'Dunder Protocols & The Data Model',
    tagline: 'Special methods enabling objects to participate in language syntax and operators',
    csharpEquivalent: 'C# Operator Overloading, IComparable<T>, IEnumerable<T>, and ToString()',
    whyItMatters: 'Python achieves elegance because language syntax is completely decentralized. When you write `len(x)`, `a + b`, `x in c`, or `for i in obj:`, Python translates them into calls to dunder (double underscore) methods like `__len__`, `__add__`, `__contains__`, and `__iter__`.',
    csharpApproach: 'Implement interfaces like `IComparable`, `IEquatable`, or explicit `operator +` method overloads.',
    pythonApproach: 'Implement designated special methods on your class. Python runtime delegates operator syntax directly to these methods.',
    csharpCode: `// C# Operator and Interface Implementation
public record Money(decimal Amount, string Currency) : IComparable<Money>
{
    public static Money operator +(Money a, Money b)
    {
        if (a.Currency != b.Currency)
            throw new InvalidOperationException("Currency mismatch");
        return new Money(a.Amount + b.Amount, a.Currency);
    }

    public int CompareTo(Money? other) => 
        other == null ? 1 : Amount.CompareTo(other.Amount);

    public override string ToString() => $"{Amount} {Currency}";
}`,
    pythonCode: `from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    amount: float
    currency: str

    def __add__(self, other: "Money") -> "Money":
        """Invoked by: total = m1 + m2"""
        if self.currency != other.currency:
            raise ValueError(f"Cannot add {self.currency} to {other.currency}")
        return Money(self.amount + other.amount, self.currency)

    def __lt__(self, other: "Money") -> bool:
        """Invoked by: if m1 < m2:"""
        if self.currency != other.currency:
            raise ValueError("Currency mismatch in comparison")
        return self.amount < other.amount

    def __repr__(self) -> str:
        """Developer inspection representation"""
        return f"Money({self.amount:.2f}, {self.currency!r})"

    def __str__(self) -> str:
        """User-friendly display representation"""
        return f"{self.amount:.2f} {self.currency}"`,
    underTheHood: 'Python uses slot tables (`tp_as_number`, `tp_as_sequence`, `tp_as_mapping`) in the `PyTypeObject` struct in C. When CPython executes an opcode like `BINARY_OP_ADD`, it checks the type pointer of the operand, looks up the slot corresponding to `__add__`, and invokes it directly without runtime reflection lookup.',
    pitfalls: [
      'Returning boolean values from `__cmp__` (deprecated in Python 3; use rich comparisons `__lt__`, `__le__`, `__eq__`).',
      'Confusing `__repr__` (unambiguous, for developers) with `__str__` (readable, for end users).',
      'Modifying immutable objects inside `__hash__` or having objects with `__eq__` but unhashable types.'
    ],
    bestPractices: [
      'Always implement `__repr__` on custom classes; `__str__` falls back to `__repr__` if omitted.',
      'Use `@functools.total_ordering` if you define `__eq__` and `__lt__` to auto-generate `__le__`, `__gt__`, and `__ge__`.',
      'If an object represents an immutable domain entity, implement `__hash__` alongside `__eq__`.'
    ]
  },
  {
    id: 'descriptors',
    number: 3,
    title: 'Descriptors: The Machinery Behind Properties',
    tagline: 'Low-level attribute access protocol powering @property, methods, and ORMs',
    csharpEquivalent: 'C# Auto-Properties, backing fields, and Roslyn property getters/setters',
    whyItMatters: 'In C#, properties (`get; set;`) are built-in syntax sugar. In Python, `@property` is just one specific implementation of a much more powerful generic protocol called the "Descriptor Protocol". Descriptors power all class methods, static methods, and SQLAlchemy/Django ORM column bindings.',
    csharpApproach: 'Compiler generates a hidden private backing field and `get_Property()` / `set_Property()` methods in the MSIL.',
    pythonApproach: 'Any class implementing `__get__`, `__set__`, or `__delete__` is a descriptor. When placed as a class attribute on another class, accessing that attribute delegates to the descriptor.',
    csharpCode: `// C# Validated Property
public class Order
{
    private decimal _price;
    public decimal Price
    {
        get => _price;
        set
        {
            if (value <= 0) 
                throw new ArgumentException("Price must be positive");
            _price = value;
        }
    }
}`,
    pythonCode: `class PositiveNumber:
    """Reusable descriptor for positive numeric attributes."""
    def __set_name__(self, owner, name):
        # Automatically capture the attribute name ("price", "quantity")
        self.storage_name = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self  # Accessed on the class: Order.price
        return getattr(instance, self.storage_name, 0.0)

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError(f"{self.storage_name[1:]} must be positive")
        setattr(instance, self.storage_name, value)

class Order:
    price = PositiveNumber()     # Descriptor instance
    quantity = PositiveNumber()  # Descriptor instance

    def __init__(self, price: float, quantity: int):
        self.price = price       # Triggers PositiveNumber.__set__
        self.quantity = quantity`,
    underTheHood: 'Attribute lookup in Python (`obj.attr`) follows a strict precedence: Data Descriptors (defining `__set__` or `__delete__`) -> Instance Dictionary (`obj.__dict__`) -> Non-Data Descriptors (defining only `__get__`, like regular functions) -> Class Dictionary -> `__getattr__`.',
    pitfalls: [
      'Storing instance state directly on `self` inside the descriptor instead of on `instance.__dict__` or a named private attribute. This causes all instances of the owner class to share the same value!',
      'Confusing data descriptors with non-data descriptors.'
    ],
    bestPractices: [
      'Use `__set_name__(self, owner, name)` (introduced in Python 3.6) to cleanly discover the owner property name.',
      'Prefer `@property` for single-use attribute encapsulation; reserve custom descriptor classes for cross-cutting reusable domain validators or ORM fields.'
    ]
  },
  {
    id: 'metaclasses',
    number: 4,
    title: 'Metaclasses: The Class Factory Protocol',
    tagline: 'Classes that instantiate classes — the engine behind Pydantic, Django, and ABCs',
    csharpEquivalent: 'C# Roslyn Source Generators and Reflection.Emit / TypeBuilder',
    whyItMatters: 'In Python, classes are themselves first-class objects created at runtime. The "type" of an object is its class; the "type" of a class is a Metaclass. By defining a custom metaclass, you can intercept class creation, validate inheritance schemas, and auto-register plugins before any instance is ever constructed.',
    csharpApproach: 'Use Roslyn Source Generators at compile-time to inspect syntax trees and generate companion code.',
    pythonApproach: 'Subclass `type`, override `__new__` to intercept class namespace and methods, or use Python 3.6+ `__init_subclass__`.',
    csharpCode: `// In C#, class construction is fixed by Roslyn compiler.
// Developers use Source Generators:
[Generator]
public class AutoRegisterGenerator : ISourceGenerator
{
    public void Execute(GeneratorExecutionContext context)
    {
        // Generates registration dictionary at compile time
    }
}`,
    pythonCode: `# Metaclass approach: Auto-registering API handlers
class PluginRegistryMeta(type):
    registry: dict[str, type] = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        # Avoid registering the base abstract class itself
        if bases:
            endpoint = namespace.get("endpoint", name.lower())
            mcs.registry[endpoint] = cls
            print(f"Registered plugin: {endpoint} -> {name}")
        return cls

class BasePlugin(metaclass=PluginRegistryMeta):
    pass

class PaymentPlugin(BasePlugin):
    endpoint = "pay"
    def execute(self): return "Paid"

class InvoicePlugin(BasePlugin):
    endpoint = "invoice"
    def execute(self): return "Invoiced"

# PluginRegistryMeta.registry now automatically contains {"pay": PaymentPlugin, ...}`,
    underTheHood: 'When Python evaluates `class Foo(Base, metaclass=Meta): ...`, it creates a namespace dictionary, executes the class body inside it, and calls `Meta.__new__(Meta, "Foo", bases, namespace)`. The result becomes the class object bound to `Foo`.',
    pitfalls: [
      'Writing metaclasses when `__init_subclass__` or decorators would suffice. Metaclass conflicts occur if inheriting from two classes with different custom metaclasses.',
      'Overcomplicating domain models with unnecessary dynamic class generation.'
    ],
    bestPractices: [
      'Prefer `__init_subclass__(cls, **kwargs)` for 90% of class registration and validation needs in modern Python 3.6+.',
      'Reserve full metaclasses for framework-level architectures (like Pydantic ModelMetaclass or SQLAlchemy DeclarativeMeta).'
    ]
  },
  {
    id: 'context-managers',
    number: 5,
    title: 'Context Managers & Resource Scopes',
    tagline: 'Deterministic cleanup beyond using/IDisposable via __enter__ and __exit__',
    csharpEquivalent: 'C# using statements, using declarations, and the IDisposable / IAsyncDisposable interface',
    whyItMatters: 'Both C# and Python reject manual try/finally for resource acquisition and release. While C# uses `IDisposable.Dispose()`, Python uses the Context Manager protocol (`__enter__` and `__exit__`), which can also suppress exceptions, mutate scopes, or measure durations.',
    csharpApproach: 'Implement `IDisposable` with standard dispose pattern; consume with `using var resource = ...;`.',
    pythonApproach: 'Implement `__enter__` and `__exit__` on a class, or use the `@contextmanager` generator decorator from `contextlib`.',
    csharpCode: `// C# IDisposable pattern
public sealed class DatabaseTransaction : IDisposable
{
    private readonly IDbTransaction _tx;
    public DatabaseTransaction(IDbTransaction tx) => _tx = tx;

    public void Commit() => _tx.Commit();

    public void Dispose()
    {
        _tx.Rollback();
        _tx.Dispose();
    }
}

// Usage:
using (var tx = new DatabaseTransaction(connection.BeginTransaction()))
{
    // execute queries
    tx.Commit();
}`,
    pythonCode: `from contextlib import contextmanager

# Approach 1: Protocol implementation
class DatabaseTransaction:
    def __init__(self, connection):
        self.conn = connection
        self.committed = False

    def __enter__(self):
        self.conn.begin()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            # Exception occurred, rollback
            self.conn.rollback()
            # Return False so exception propagates up
            return False
        if not self.committed:
            self.conn.commit()
        return True

# Approach 2: Lightweight generator idiom
@contextmanager
def temporary_lock(lock_name: str):
    print(f"Acquiring lock: {lock_name}")
    try:
        yield lock_name  # Execution returns to with block
    finally:
        print(f"Releasing lock: {lock_name}")

# Usage:
with temporary_lock("order-sync") as name:
    print(f"Holding {name} safely")`,
    underTheHood: 'The `with` statement calls `__enter__`. If an exception occurs inside the block, Python passes `(exc_type, exc_val, exc_tb)` to `__exit__`. If `__exit__` returns a truthy value (`True`), the exception is swallowed; if it returns `False` or `None`, Python re-raises the exception.',
    pitfalls: [
      'Accidentally returning `True` from `__exit__` when an unhandled exception occurred, which silently swallows all application crashes.',
      'Assuming resources are freed when out of scope without a `with` statement in non-refcounted runtimes.'
    ],
    bestPractices: [
      'Use `@contextlib.contextmanager` for simple setup/teardown pairs to avoid class boilerplate.',
      'Use `async with` and `__aenter__` / `__aexit__` for asynchronous network/database resources.'
    ]
  },
  {
    id: 'generators',
    number: 6,
    title: 'Generators, Yield, & Streaming Pipelines',
    tagline: 'Memory-efficient lazy streaming versus C# IEnumerable<T> and yield return',
    csharpEquivalent: 'C# IEnumerable<T>, IEnumerator<T>, and yield return / yield break',
    whyItMatters: 'In C#, loading 50GB of log files into memory crashes the process. C# developers use `IEnumerable<T>` and `yield return` to stream elements one by one. Python generators behave identically: functions containing `yield` compile into lazy state machines that compute values on demand without allocating giant lists.',
    csharpApproach: 'Declare method returning `IEnumerable<T>`, use `yield return` to produce items sequentially.',
    pythonApproach: 'Define a function containing `yield`. Calling it returns a generator object supporting `__next__()` and the iterator protocol.',
    csharpCode: `// C# Streaming Generator
public static IEnumerable<string> ReadAuditLogs(string filePath)
{
    using var reader = new StreamReader(filePath);
    string? line;
    while ((line = reader.ReadLine()) != null)
    {
        if (line.Contains("[ERROR]"))
        {
            yield return line.Trim();
        }
    }
}

// Consumed lazily:
foreach (var err in ReadAuditLogs("app.log").Take(5))
{
    Console.WriteLine(err);
}`,
    pythonCode: `from typing import Iterator

def read_audit_logs(file_path: str) -> Iterator[str]:
    """Memory-efficient streaming: processes files gigabyte by gigabyte."""
    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            if "[ERROR]" in line:
                yield line.strip()

# Composing streaming pipelines (like LINQ chaining):
errors = read_audit_logs("production.log")
critical_errors = (err.upper() for err in errors if "FATAL" in err)

# Lazy consumption: only reads until 5 items are found
for idx, error in enumerate(critical_errors):
    if idx >= 5:
        break
    print(f"Alert {idx + 1}: {error}")`,
    underTheHood: 'When Python sees `yield`, the function is flagged as `CO_GENERATOR` in its code object. Calling it creates a `PyGenObject` wrapping the stack frame. Calling `next()` resumes bytecode execution from `f_lasti` (last instruction pointer) until the next `YIELD_VALUE` opcode.',
    pitfalls: [
      'Re-iterating a generator: generators are single-pass streams. Once exhausted, calling `next()` raises `StopIteration`.',
      'Using list comprehensions `[x for x in ...]` when memory-lazy generator expressions `(x for x in ...)` are appropriate.'
    ],
    bestPractices: [
      'Use generator expressions `(...)` instead of `[...]` when passing streams directly into functions like `sum()`, `max()`, `any()`, `all()`.',
      'Use `yield from sub_generator` (analogous to delegating sub-streams) for composing complex hierarchical streams.'
    ]
  },
  {
    id: 'asyncio',
    number: 7,
    title: 'Asyncio, Coroutines, & Concurrency',
    tagline: 'Single-threaded cooperative event loop vs C# multi-threaded ThreadPool Task model',
    csharpEquivalent: 'C# async/await, Task, Task.WhenAll, CancellationToken, and SynchronizationContext',
    whyItMatters: 'Both languages use async and await syntax, but their runtimes differ fundamentally. C# `Task` runs on a multi-threaded OS ThreadPool where awaiting a task may resume on a different thread. Python asyncio runs on a SINGLE-THREADED cooperative event loop (inspired by epoll/kqueue). Python code will NEVER experience multi-threaded race conditions inside pure async code unless it yields with `await`.',
    csharpApproach: 'C# compiler transforms async methods into a state machine struct scheduled across ThreadPool threads.',
    pythonApproach: 'Python coroutine functions (`async def`) return coroutine objects executed cooperatively by `asyncio.run()` event loop.',
    csharpCode: `// C# Task Parallel Library (TPL)
public async Task<UserDashboard> GetDashboardAsync(int userId)
{
    // Tasks execute concurrently across OS ThreadPool threads
    var profileTask = _userRepo.GetProfileAsync(userId);
    var ordersTask = _orderRepo.GetRecentOrdersAsync(userId);

    await Task.WhenAll(profileTask, ordersTask);

    return new UserDashboard(await profileTask, await ordersTask);
}`,
    pythonCode: `import asyncio

async def fetch_profile(user_id: int) -> dict:
    await asyncio.sleep(0.05)  # Simulating async network I/O
    return {"id": user_id, "name": "Aditya"}

async def fetch_orders(user_id: int) -> list:
    await asyncio.sleep(0.08)  # Non-blocking I/O
    return [{"order_id": 101, "total": 249.99}]

async def get_dashboard(user_id: int) -> dict:
    # Modern Python 3.11+ TaskGroup (structured concurrency):
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch_profile(user_id))
        task2 = tg.create_task(fetch_orders(user_id))
    
    # Both tasks guaranteed finished here; exceptions grouped cleanly
    return {"profile": task1.result(), "orders": task2.result()}

# Execution entry point:
# asyncio.run(get_dashboard(42))`,
    underTheHood: 'Python coroutines are specialized generators. `await x` pauses the coroutine, yielding control back to the event loop (`asyncio.SelectorEventLoop`), which uses the OS `epoll` or `kqueue` kernel multiplexer to sleep until network sockets become readable/writable.',
    pitfalls: [
      'Calling blocking synchronous code (e.g. `time.sleep()`, `requests.get()`) inside an async function. This freezes the entire event loop and blocks ALL concurrent requests!',
      'Using legacy `asyncio.gather()` instead of modern structured concurrency `asyncio.TaskGroup()`.',
      'Forgetting to await a coroutine: creates a "coroutine was never awaited" warning.'
    ],
    bestPractices: [
      'For blocking CPU or synchronous legacy I/O, offload to worker threads using `await asyncio.to_thread(blocking_func, arg)`.',
      'Adopt structured concurrency with `async with asyncio.TaskGroup() as tg:` introduced in Python 3.11.',
      'Use `uvloop` (C-based event loop using libuv) in production for 2x–4x throughput speedups.'
    ]
  },
  {
    id: 'pattern-matching',
    number: 8,
    title: 'Structural Pattern Matching (PEP 634)',
    tagline: 'Deep shape decomposition and guard conditions vs C# switch expressions',
    csharpEquivalent: 'C# 8+ switch expressions with property and positional patterns',
    whyItMatters: 'Introduced in Python 3.10 via PEP 634, `match/case` is not just a glorified if/else switch statement. It destructures nested data structures, checks types, matches dictionary keys, binds extracted variables, and evaluates Boolean guards in a single expressive syntax.',
    csharpApproach: 'Use `switch (obj) { CasePattern => ... }` with relational and property pattern matching.',
    pythonApproach: 'Use `match expr:` with `case` patterns (literal, capture, sequence, mapping, class patterns) and optional `if` guards.',
    csharpCode: `// C# Pattern Matching Switch Expression
public static string HandleCommand(object command) => command switch
{
    MoveCommand { X: var x, Y: var y } when x != 0 || y != 0 => 
        $"Move to ({x}, {y})",
    SetColorCommand { Color: "red" or "blue" } c => 
        $"Color set to {c.Color}",
    int[] { Length: 0 } => "Empty list",
    int[] [var first, ..] => $"First element: {first}",
    _ => "Unknown command"
};`,
    pythonCode: `from dataclasses import dataclass

@dataclass
class Move:
    x: int
    y: int

def handle_event(event) -> str:
    match event:
        # Class pattern with attribute binding and guard
        case Move(x=x, y=y) if x != 0 or y != 0:
            return f"Moving to coordinates ({x}, {y})"
        
        # Mapping / dictionary pattern
        case {"type": "set_color", "color": ("red" | "blue") as color}:
            return f"Theme color changed to {color}"
        
        # Sequence pattern with slice/rest unpacking
        case [first, *rest]:
            return f"Sequence starting with {first} followed by {len(rest)} items"
        
        # Wildcard default
        case _:
            return "Unrecognized event payload"`,
    underTheHood: 'Python compiles pattern matches into optimized bytecode branches. Mapping patterns check `isinstance(obj, collections.abc.Mapping)` and probe keys using fast slot lookups; class patterns verify type identity and check either `__match_args__` or named attributes.',
    pitfalls: [
      'Thinking `case x:` matches a variable named x. In Python, an unadorned identifier in a case clause acts as a CAPTURE pattern, binding the value to x!',
      'To match an existing enum or constant, use dotted names like `case Status.ACTIVE:`.'
    ],
    bestPractices: [
      'Define `__match_args__ = ("x", "y")` on non-dataclass classes to enable positional pattern matching `case Point(x, y):`.',
      'Use `as alias` within patterns to capture complex matched subtrees.'
    ]
  },
  {
    id: 'protocols-typing',
    number: 9,
    title: 'Modern Typing, Generics, & Structural Protocols',
    tagline: 'Static verification with dynamic duck-typing flexibility vs C# Nominal Interfaces',
    csharpEquivalent: 'C# Interfaces, Generics (`<T> where T : class`), and Duck Typing in dynamic',
    whyItMatters: 'In C#, a class MUST explicitly inherit an interface (`class File : IClosable`). If a third-party class implements `Close()` but does NOT declare `IClosable`, C# refuses to compile without an Adapter. Python solves this via `typing.Protocol` (PEP 544): structural subtyping (static duck typing). If it walks like a duck and quacks like a duck, static type checkers (mypy/pyright) accept it without inheritance!',
    csharpApproach: 'Explicit nominal interfaces: `public class Dog : IAnimal`.',
    pythonApproach: 'Define a `class Duck(Protocol):`. Any class with matching signatures satisfies the protocol without subclassing it.',
    csharpCode: `// C# Nominal Interface
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task SaveAsync(T entity);
}

// Concrete class must declare inheritance:
public class UserRepository : IRepository<User>
{
    public async Task<User?> GetByIdAsync(int id) => ...;
    public async Task SaveAsync(User entity) => ...;
}`,
    pythonCode: `from typing import Protocol, TypeVar

T = TypeVar("T")

# Structural Protocol: no inheritance required by implementations!
class Repository(Protocol[T]):
    def get_by_id(self, item_id: int) -> T | None: ...
    def save(self, entity: T) -> None: ...

# Modern Python 3.12+ Generic Syntax:
# class Repository[T](Protocol):
#     def get_by_id(self, item_id: int) -> T | None: ...

# Unaffiliated third-party class that happens to match the signature:
class ExternalUserStore:
    def get_by_id(self, item_id: int) -> dict | None:
        return {"id": item_id, "name": "Aditya"}
    def save(self, entity: dict) -> None:
        pass

# Mypy and Pyright verify this succeeds structurally!
def sync_data(repo: Repository[dict], record_id: int):
    data = repo.get_by_id(record_id)
    if data:
        repo.save(data)`,
    underTheHood: 'At runtime, type annotations in Python are stored in `__annotations__` dictionaries and ignored by CPython’s execution engine. Static analysis tools (pyright, mypy, Ruff) parse these AST nodes and perform Milner-Damas Hindley-style structural type checking.',
    pitfalls: [
      'Expecting Python to throw compile-time type errors at runtime. Type hints alone do NOT prevent invalid types at runtime unless paired with Pydantic or Beartype!',
      'Over-annotating simple internal script functions where duck typing is sufficiently obvious.'
    ],
    bestPractices: [
      'Use `Protocol` for boundary contracts, test doubles, and dependency inversion.',
      'Use `Pydantic` for runtime validation at system boundaries (API request bodies, database queries, environment configs).'
    ]
  },
  {
    id: 'slots-memory',
    number: 10,
    title: 'Memory Optimization: __slots__ & Weakref',
    tagline: 'Stripping __dict__ overhead for high-density collections and zero memory leaks',
    csharpEquivalent: 'C# Structs vs Classes, Memory<T>, and WeakReference<T>',
    whyItMatters: 'By default, every Python object stores its attributes inside an internal dictionary called `__dict__`. While this permits dynamically adding new properties at runtime, each `__dict__` consumes 150–200 bytes. When storing 10 million telemetry nodes, this wastes gigabytes of RAM. `__slots__` tells CPython to allocate a fixed-size C array of pointers instead, slashing memory by 60%–70% and accelerating attribute access.',
    csharpApproach: 'Use `readonly struct` or value tuples to eliminate managed object heap overhead.',
    pythonApproach: 'Define `__slots__ = ("x", "y", "timestamp")` on the class to eliminate `__dict__` and `__weakref__`.',
    csharpCode: `// C# High-density struct
public readonly struct GeoPoint
{
    public double Latitude { get; }
    public double Longitude { get; }

    public GeoPoint(double lat, double lon)
    {
        Latitude = lat;
        Longitude = lon;
    }
}
// 10 million GeoPoints in an array consume ~160 MB`,
    pythonCode: `import sys

# Standard class: has dynamic __dict__
class StandardPoint:
    def __init__(self, lat: float, lon: float):
        self.lat = lat
        self.lon = lon

# Optimized class: fixed C pointer array, no __dict__
class SlottedPoint:
    __slots__ = ("lat", "lon")
    def __init__(self, lat: float, lon: float):
        self.lat = lat
        self.lon = lon

p1 = StandardPoint(12.9716, 77.5946)
p2 = SlottedPoint(12.9716, 77.5946)

# Standard point: ~152 bytes (object) + ~112 bytes (__dict__) = 264+ bytes
# Slotted point: ~48 bytes total (pointer array directly in PyObject)
# Result: 65% memory reduction across millions of instances!`,
    underTheHood: 'Without `__slots__`, accessing `self.lat` queries the descriptor, fails, and checks `self.__dict__["lat"]`. With `__slots__`, CPython compiles member descriptors that compute an immediate byte offset directly into the `PyObject` C struct, mimicking C++ struct field offsets.',
    pitfalls: [
      'Subclasses of a slotted class automatically re-introduce `__dict__` unless the subclass ALSO explicitly defines `__slots__ = ()`.',
      'Cannot add arbitrary dynamic attributes to a slotted instance at runtime.'
    ],
    bestPractices: [
      'Apply `__slots__` to high-frequency domain value objects (e.g. data points, coordinates, parsed tokens).',
      'In Python 3.10+, you can declare slotted dataclasses with `@dataclass(slots=True)`.'
    ]
  }
];
