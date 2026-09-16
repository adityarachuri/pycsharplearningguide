import { DailyChallenge } from '../types';

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Refactor LINQ Where & Select to Idiomatic Comprehension',
    prompt: 'Transform a C# LINQ query filtering even numbers and squaring them into an idiomatic Python list comprehension.',
    csharpCode: `// C# LINQ
var evensSquared = numbers
    .Where(x => x % 2 == 0)
    .Select(x => x * x)
    .ToList();`,
    starterPython: `# Fill in the list comprehension:
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens_squared = ... # write comprehension here`,
    solutionPython: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens_squared = [x * x for x in numbers if x % 2 == 0]
print(evens_squared) # [4, 16, 36, 64, 100]`,
    explanation: 'List comprehensions follow the syntax [expression for item in iterable if condition]. They are compiled into specialized bytecode (LIST_APPEND) and run significantly faster than procedural loops with append().'
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'Spot and Fix the Mutable Default Argument Trap',
    prompt: 'Identify why this Python function behaves unpredictably when called multiple times, and fix it using the idiomatic None sentinel pattern.',
    csharpCode: `// In C#, default parameters must be compile-time constants:
public void AddItem(string item, List<string>? list = null)
{
    list ??= new List<string>();
    list.Add(item);
}`,
    starterPython: `# BUGGY CODE: Default argument evaluated once!
def add_to_history(action: str, history: list = []):
    history.append(action)
    return history`,
    solutionPython: `def add_to_history(action: str, history: list | None = None) -> list:
    if history is None:
        history = []
    history.append(action)
    return history

print(add_to_history("login"))      # ['login']
print(add_to_history("view_page"))  # ['view_page'] - Fresh list!`,
    explanation: 'In Python, default arguments are evaluated ONCE when the `def` statement executes, not on each invocation. Using a mutable object (list, dict, set) as a default parameter means every caller without an explicit argument shares the EXACT SAME memory instance in heap. Always use `None` as sentinel.'
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'Convert C# using (IDisposable) to Python with Statement',
    prompt: 'Implement a custom Python Context Manager using the `@contextmanager` generator decorator from contextlib to manage a temporary timer lock.',
    csharpCode: `// C# using statement
using (new AuditTimer("ComputeStats"))
{
    RunComputation();
}`,
    starterPython: `from contextlib import contextmanager
import time

@contextmanager
def audit_timer(label: str):
    # Setup timer before yield
    # yield to block
    # Teardown / print elapsed time in finally
    pass`,
    solutionPython: `from contextlib import contextmanager
import time

@contextmanager
def audit_timer(label: str):
    start = time.perf_counter()
    print(f"[{label}] Started...")
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"[{label}] Finished in {elapsed:.4f}s")

# Usage:
with audit_timer("MatrixMultiply"):
    sum(i * i for i in range(100_000))`,
    explanation: 'The `@contextmanager` decorator turns a generator into a Context Manager. Code before the `yield` runs on `__enter__`; code in the `finally` block executes on `__exit__`, guaranteeing cleanup even if exceptions are thrown.'
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'Refactor C# Switch Expression to Python match/case',
    prompt: 'Use PEP 634 Structural Pattern Matching to decompose an API response dictionary containing HTTP status and payload.',
    csharpCode: `// C# Pattern Matching
public static string FormatResponse(object res) => res switch
{
    Response { Status: 200, Data: var d } => $"Success: {d}",
    Response { Status: 404 } => "Not found",
    _ => "Error"
};`,
    starterPython: `def format_response(response: dict) -> str:
    # Use match/case to destructure response:
    match response:
        # Complete cases
        case _:
            return "Unknown"`,
    solutionPython: `def format_response(response: dict) -> str:
    match response:
        case {"status": 200, "data": data}:
            return f"Success: {data}"
        case {"status": 404}:
            return "Resource Not Found"
        case {"status": 500, "error": err}:
            return f"Server Error: {err}"
        case _:
            return "Unknown response payload"

print(format_response({"status": 200, "data": "Alex's Account"}))`,
    explanation: 'Python `match/case` supports mapping patterns. It verifies that `response` is a dict, checks if "status" and "data" exist, and binds the values to local variables in a single expressive statement.'
  },
  {
    id: 'day-5',
    dayNumber: 5,
    title: 'Implement Structural Subtyping with Protocol',
    prompt: 'Define a Python `Protocol` that checks for a `calculate_tax()` method without requiring inheritance.',
    csharpCode: `// C# requires explicit interface inheritance:
public interface ITaxable { decimal CalculateTax(); }
public class Invoice : ITaxable { public decimal CalculateTax() => 15m; }`,
    starterPython: `from typing import Protocol

# Define the Protocol:
class Taxable(Protocol):
    pass

class Product:
    def __init__(self, price: float):
        self.price = price
    def calculate_tax(self) -> float:
        return self.price * 0.18`,
    solutionPython: `from typing import Protocol

class Taxable(Protocol):
    def calculate_tax(self) -> float: ...

class Product:
    def __init__(self, price: float):
        self.price = price
    def calculate_tax(self) -> float:
        return self.price * 0.18

# Test function accepting anything that satisfies the protocol:
def compute_total_tax(items: list[Taxable]) -> float:
    return sum(item.calculate_tax() for item in items)

p = Product(100.0)
print(f"Tax: {compute_total_tax([p])}") # Works without Product inheriting Taxable!`,
    explanation: 'Python `typing.Protocol` enables static duck typing (PEP 544). A concrete class satisfies a protocol purely by implementing matching method signatures. No inheritance is required.'
  },
  {
    id: 'day-6',
    dayNumber: 6,
    title: 'Structured Concurrency with asyncio.TaskGroup',
    prompt: 'Use Python 3.11+ `asyncio.TaskGroup` to fetch user profile and permissions concurrently with structured exception handling.',
    csharpCode: `// C# Task.WhenAll
var t1 = GetProfileAsync(id);
var t2 = GetPermissionsAsync(id);
await Task.WhenAll(t1, t2);`,
    starterPython: `import asyncio

async def get_profile(user_id: int): await asyncio.sleep(0.01); return "Profile"
async def get_permissions(user_id: int): await asyncio.sleep(0.01); return ["read"]

async def load_user(user_id: int):
    # Use async with asyncio.TaskGroup()
    pass`,
    solutionPython: `import asyncio

async def get_profile(user_id: int):
    await asyncio.sleep(0.01)
    return {"id": user_id, "name": "Alex"}

async def get_permissions(user_id: int):
    await asyncio.sleep(0.01)
    return ["admin", "editor"]

async def load_user(user_id: int):
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(get_profile(user_id))
        t2 = tg.create_task(get_permissions(user_id))
    
    # Both tasks are guaranteed completed when exiting the with block!
    return {"profile": t1.result(), "permissions": t2.result()}

# asyncio.run(load_user(42))`,
    explanation: 'Introduced in Python 3.11, `asyncio.TaskGroup` provides structured concurrency. Unlike legacy `asyncio.gather()`, if one task fails, remaining tasks are automatically cancelled, and any unhandled errors are bundled into an ExceptionGroup.'
  },
  {
    id: 'day-7',
    dayNumber: 7,
    title: 'High-Performance Dataclass with __slots__',
    prompt: 'Create an immutable, slotted dataclass to represent a 3D Vector with zero `__dict__` memory overhead.',
    csharpCode: `// C# readonly struct record
public readonly record struct Vector3D(double X, double Y, double Z);`,
    starterPython: `from dataclasses import dataclass

# Complete the dataclass decorator with frozen and slots:
@dataclass(...)
class Vector3D:
    x: float
    y: float
    z: float`,
    solutionPython: `from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class Vector3D:
    x: float
    y: float
    z: float

v = Vector3D(1.0, 2.5, -4.0)
print(v)
# v.x = 99.0 # Raises FrozenInstanceError!
# v.__dict__ # Raises AttributeError because slots=True eliminated __dict__!`,
    explanation: '`frozen=True` makes the dataclass immutable (and generates `__hash__`), while `slots=True` eliminates the per-instance `__dict__`, reducing memory footprint by ~60% and enabling faster attribute access.'
  }
];
