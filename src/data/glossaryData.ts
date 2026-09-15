import { GlossaryTerm } from '../types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'pythonic',
    term: 'Pythonic',
    category: 'idiom',
    definition: 'An idea or piece of code that closely follows the most natural, readable idioms of the Python language, rather than implementing code using concepts introduced in other languages.',
    csharpAnalogy: 'Writing idiomatic modern C# with pattern matching, LINQ, records, and async/await rather than C++ style pointers or Java-style VerboseServiceFactory.',
    exampleSnippet: `# Un-pythonic (C# style index loop):
for i in range(len(items)):
    print(i, items[i])

# Pythonic:
for i, item in enumerate(items):
    print(i, item)`,
    officialRef: 'PEP 20 - The Zen of Python'
  },
  {
    id: 'eafp',
    term: 'EAFP (Easier to Ask Forgiveness than Permission)',
    category: 'idiom',
    definition: 'A Python programming style that assumes valid keys or attributes exist and catches exceptions if the assumption proves false. This contrasts with LBYL (Look Before You Leap).',
    csharpAnalogy: 'In C#, exceptions are expensive, so C# favors LBYL (e.g. TryGetValue, TryParse). In Python, exceptions are fast and EAFP avoids Time-Of-Check to Time-Of-Use (TOCTOU) race conditions.',
    exampleSnippet: `# EAFP:
try:
    val = mapping[key]
except KeyError:
    val = default_val`,
    officialRef: 'Python Glossary - docs.python.org'
  },
  {
    id: 'lbyl',
    term: 'LBYL (Look Before You Leap)',
    category: 'idiom',
    definition: 'A programming style that explicitly tests pre-conditions before making calls or lookups (e.g. `if key in mapping:` or `if hasattr(obj, "attr"):`).',
    csharpAnalogy: 'The standard C# approach (`if (dict.ContainsKey(key)) { ... }` or `int.TryParse(...)`).',
    exampleSnippet: `# LBYL in Python:
if key in mapping:
    val = mapping[key]
else:
    val = default_val`,
    officialRef: 'Python Glossary'
  },
  {
    id: 'dunder',
    term: 'Dunder (Double Underscore)',
    category: 'syntax',
    pronunciation: 'DUN-der',
    definition: 'Shorthand for "Double Underscore". Refers to special methods and attributes like `__init__`, `__repr__`, `__len__`, or `__enter__` that power Python’s object data model protocols.',
    csharpAnalogy: 'C# magic methods and operator overloads (`operator +`, `ToString()`, `Dispose()`, `GetEnumerator()`).',
    exampleSnippet: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)`,
    officialRef: 'Python Data Model Documentation'
  },
  {
    id: 'bdfl',
    term: 'BDFL (Benevolent Dictator For Life)',
    category: 'runtime',
    definition: 'The title historically held by Guido van Rossum as the ultimate decision-maker for Python development from 1989 until his stepping down in July 2018 (triggered by PEP 572). Python is now governed by an elected 5-member Steering Council.',
    csharpAnalogy: 'Similar to Anders Hejlsberg / Mads Torgersen presiding over C# language design at Microsoft, though BDFL was an open-source community title.',
    officialRef: 'PEP 13 - Python Language Governance'
  },
  {
    id: 'duck-typing',
    term: 'Duck Typing',
    category: 'typing',
    definition: 'A programming style where an object’s suitability is determined by the presence of certain methods and properties, rather than by inheritance from a specific class ("If it walks like a duck and quacks like a duck, it is a duck").',
    csharpAnalogy: 'C# foreach loop duck-typing (any class with a public `GetEnumerator()` method can be foreach-ed, even without implementing `IEnumerable<T>`), or C# `dynamic`.',
    exampleSnippet: `def print_length(obj):
    # Works for list, str, dict, or custom class with __len__
    print(len(obj))`,
    officialRef: 'Python Glossary'
  },
  {
    id: 'monkey-patching',
    term: 'Monkey Patching',
    category: 'runtime',
    definition: 'Dynamic modification of a class or module at runtime (adding, altering, or replacing attributes or methods after module execution). Widely used in testing frameworks to mock external services.',
    csharpAnalogy: 'Harmony library in .NET, or Microsoft Fakes / Castle DynamicProxy runtime IL interception.',
    exampleSnippet: `import payment_service
# Dynamically swap method during testing
def mock_charge(amount): return "Mocked Success"
payment_service.charge = mock_charge`,
    officialRef: 'Software Engineering Terminology'
  },
  {
    id: 'gil',
    term: 'GIL (Global Interpreter Lock)',
    category: 'concurrency',
    definition: 'A mutex used by CPython to prevent multiple native OS threads from executing Python bytecode simultaneously, preserving CPython’s reference counting and memory safety.',
    csharpAnalogy: 'No equivalent in C#/.NET, which has true free-threading on all CPU cores. PEP 703 in Python 3.13+ makes the GIL optional.',
    exampleSnippet: `# To bypass GIL for CPU-intensive work:
from multiprocessing import Pool
with Pool(4) as p:
    p.map(cpu_crunch_function, data)`,
    officialRef: 'PEP 703 & Python C-API'
  },
  {
    id: 'mro',
    term: 'MRO (Method Resolution Order)',
    category: 'runtime',
    definition: 'The deterministic order in which Python searches base classes when resolving an attribute or method in the presence of multiple inheritance, computed using the C3 Linearization algorithm.',
    csharpAnalogy: 'C# forbids multiple class inheritance to avoid the "Diamond Problem" (though default interface methods have resolution rules). Python permits multiple inheritance and resolves conflicts with MRO.',
    exampleSnippet: `class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass
print(D.__mro__) # (D, B, C, A, object)`,
    officialRef: 'The Python 2.3 Method Resolution Order Paper'
  },
  {
    id: 'descriptor',
    term: 'Descriptor',
    category: 'runtime',
    definition: 'An object attribute with "binding behavior", whose attribute access has been overridden by methods in the descriptor protocol: `__get__`, `__set__`, and `__delete__`. Underpins `@property`, static methods, and ORMs.',
    csharpAnalogy: 'C# Property getter/setter IL methods (`get_X` and `set_X`) combined with custom backing fields.',
    officialRef: 'Descriptor HowTo Guide - docs.python.org'
  },
  {
    id: 'walrus-operator',
    term: 'Walrus Operator (:=)',
    category: 'syntax',
    definition: 'Assignment expressions introduced in Python 3.8 (PEP 572). Allows assigning values to variables inside an expression while returning the value.',
    csharpAnalogy: 'C# inline assignment `if ((line = reader.ReadLine()) != null)` or C# `is` pattern expressions `if (obj is string s)`.',
    exampleSnippet: `if (n := len(data)) > 100:
    print(f"Data has {n} items, exceeds threshold")`,
    officialRef: 'PEP 572 - Assignment Expressions'
  },
  {
    id: 'generator',
    term: 'Generator',
    category: 'concurrency',
    definition: 'A function that produces a sequence of values lazily using the `yield` keyword. Calling a generator function returns an iterator without executing the function body until `next()` is called.',
    csharpAnalogy: 'C# iterator methods returning `IEnumerable<T>` with `yield return`.',
    exampleSnippet: `def count_up():
    n = 1
    while True:
        yield n
        n += 1`,
    officialRef: 'PEP 255 - Simple Generators'
  },
  {
    id: 'comprehension',
    term: 'Comprehension',
    category: 'syntax',
    definition: 'A compact syntax for constructing a new list, set, or dictionary from an iterable while filtering and transforming elements.',
    csharpAnalogy: 'C# LINQ Query Syntax (`from x in xs where p(x) select f(x)`).',
    exampleSnippet: `squares = {x: x * x for x in range(10) if x % 2 == 0}`,
    officialRef: 'PEP 202 (List Comprehensions), PEP 274 (Dict Comprehensions)'
  },
  {
    id: 'context-manager',
    term: 'Context Manager',
    category: 'idiom',
    definition: 'An object that defines runtime context to be established when entering a `with` statement and cleaned up when exiting it, implementing `__enter__` and `__exit__`.',
    csharpAnalogy: 'The C# `using` statement and `IDisposable` interface.',
    exampleSnippet: `with open("log.txt", "w") as f:
    f.write("entry")`,
    officialRef: 'PEP 343 - The "with" Statement'
  },
  {
    id: 'slots',
    term: '__slots__',
    category: 'runtime',
    definition: 'A class-level declaration that restricts the permitted attributes to a fixed set, replacing the instance `__dict__` with a fixed-size C array of pointers to save memory and accelerate access.',
    csharpAnalogy: 'C# `struct` (compact contiguous memory without dictionary overhead).',
    exampleSnippet: `class Coordinate:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y`,
    officialRef: 'Python Data Model - Slots'
  },
  {
    id: 'metaclass',
    term: 'Metaclass',
    category: 'runtime',
    definition: 'The class of a class. While regular classes define how instances behave, metaclasses define how classes themselves are constructed and initialized.',
    csharpAnalogy: 'C# Roslyn Source Generators or `System.Reflection.Emit.TypeBuilder`.',
    officialRef: 'PEP 3115 - Metaclasses in Python 3000'
  },
  {
    id: 'asgi-wsgi',
    term: 'ASGI / WSGI',
    category: 'concurrency',
    definition: 'WSGI (Web Server Gateway Interface) is the synchronous specification connecting Python web frameworks to HTTP servers. ASGI (Asynchronous Server Gateway Interface) is its modern asynchronous successor supporting async/await, WebSockets, and HTTP/2.',
    csharpAnalogy: 'OWIN (Open Web Interface for .NET) and the ASP.NET Core Request Delegate pipeline (`RequestDelegate`).',
    officialRef: 'ASGI Specification & PEP 3333'
  },
  {
    id: 'protocol',
    term: 'Protocol (PEP 544)',
    category: 'typing',
    definition: 'Structural subtyping in Python’s static type system. A class satisfies a Protocol if it provides the required attributes and methods, without needing to inherit from the Protocol.',
    csharpAnalogy: 'Structural interfaces (like in Go or TypeScript) as opposed to C# nominal `interface IFoo`.',
    officialRef: 'PEP 544 - Protocols: Structural subtyping'
  },
  {
    id: 'wheel',
    term: 'Wheel (.whl) & PyPI',
    category: 'tooling',
    definition: 'PyPI (Python Package Index) is the official third-party software repository. Wheel is the built-package binary distribution format that installs without running setup scripts.',
    csharpAnalogy: 'NuGet (`nuget.org`) and `.nupkg` package archives.',
    officialRef: 'PEP 427 - The Wheel Binary Package Format 1.0'
  },
  {
    id: 'uv-ruff',
    term: 'uv & Ruff',
    category: 'tooling',
    definition: 'Modern, high-performance developer tools written in Rust by Astral. `ruff` replaces flake8, black, isort, and bandit; `uv` is an ultra-fast pip, pip-tools, and virtual environment manager (10x–100x faster than pip).',
    csharpAnalogy: 'The high-speed Roslyn compiler and `dotnet` CLI unified tooling.',
    officialRef: 'Astral Tooling (astral.sh)'
  }
];
