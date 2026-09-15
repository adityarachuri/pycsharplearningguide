export interface TransitionPhase {
  phase: number;
  timeframe: string;
  title: string;
  focus: string;
  csharpAnalogy: string;
  actionItems: string[];
  recommendedReading: string[];
}

export const TRANSITION_ROADMAP: TransitionPhase[] = [
  {
    phase: 1,
    timeframe: 'Week 1 (Days 1–7)',
    title: 'Unlearning Ceremony & The Dynamic Mental Shift',
    focus: 'Dynamic object binding, Python indentation rules, truthiness, EAFP, names vs memory slots.',
    csharpAnalogy: 'Leaving the compiler security blanket behind: shifting from "How do I declare this type hierarchy?" to "What is the simplest protocol that satisfies this behavior?"',
    actionItems: [
      'Read "The Zen of Python" (import this) and internalize "Readability counts".',
      'Stop writing getters and setters; use plain attributes and promote to @property only when logic is added.',
      'Practice truthiness and idiomatic null-checking: always "if x is None:" instead of "if x == null".',
      'Understand mutable default arguments and why "def add(item, lst=[])" is a fatal bug in Python.'
    ],
    recommendedReading: ['Fluent Python (Part I)', 'PEP 8 Style Guide']
  },
  {
    phase: 2,
    timeframe: 'Week 2 (Days 8–14)',
    title: 'Collections, Idiomatic Comprehensions, & The Data Model',
    focus: 'Lists, dicts, sets, tuples, unpacking, list/dict comprehensions (LINQ equivalents), and dunder methods.',
    csharpAnalogy: 'Translating all your fluent LINQ .Where().Select().ToDictionary() instincts into Pythonic comprehensions and itertools.',
    actionItems: [
      'Master list, set, and dictionary comprehensions.',
      'Implement custom classes with dunder methods: __repr__, __eq__, __len__, __iter__.',
      'Adopt dataclasses (with frozen=True and slots=True) as your primary C# record replacement.',
      'Learn collections module: defaultdict, Counter, deque.'
    ],
    recommendedReading: ['Python Data Model Reference (docs.python.org)']
  },
  {
    phase: 3,
    timeframe: 'Week 3 (Days 15–21)',
    title: 'Modern Tooling, Virtual Environments, & Packaging',
    focus: 'pyproject.toml, uv (the blazing fast Rust package manager), ruff, virtual environments, and workspace layout.',
    csharpAnalogy: 'Replacing .csproj, .sln, NuGet, and MSBuild with the unified modern Python packaging ecosystem.',
    actionItems: [
      'Install `uv` (astral.sh/uv) and use it for python versions, virtualenvs, and dependencies.',
      'Configure `pyproject.toml` using standard PEP 621 metadata.',
      'Adopt `ruff` for 100x faster linting and formatting (replaces Black, Flake8, and isort).',
      'Set up strict type checking using `pyright` or `mypy` in VS Code / PyCharm / Cursor.'
    ],
    recommendedReading: ['Packaging Python Projects (packaging.python.org)', 'Astral uv documentation']
  },
  {
    phase: 4,
    timeframe: 'Week 4 (Days 22–30)',
    title: 'Asynchronous Programming & Concurrency Models',
    focus: 'asyncio, coroutines, TaskGroups (Python 3.11+), uvloop, and ProcessPoolExecutor for CPU work.',
    csharpAnalogy: 'Understanding why Python async is NOT the C# ThreadPool: single-threaded event loop mechanics vs multi-threaded TAP.',
    actionItems: [
      'Build an async scraper or API client using `httpx` and `asyncio.TaskGroup()`.',
      'Learn the danger of blocking code in async functions: never call time.sleep or requests.get inside async def!',
      'Use `asyncio.to_thread` for non-async I/O and `ProcessPoolExecutor` for CPU-intensive computations.',
      'Understand the CPython GIL, its history, and PEP 703 free-threaded builds in Python 3.13+.'
    ],
    recommendedReading: ['Python Asyncio Documentation', 'PEP 654 (Exception Groups), PEP 703 (No-GIL)']
  },
  {
    phase: 5,
    timeframe: 'Weeks 5–6 (Days 31–45)',
    title: 'Production Web Services & Clean Architecture',
    focus: 'FastAPI, Pydantic v2, SQLAlchemy 2.0 async, pytest, and Clean Architecture (Ports & Adapters).',
    csharpAnalogy: 'Building production microservices that match your ASP.NET Core Web API + EF Core standards in velocity and clean separation.',
    actionItems: [
      'Build a REST/JSON microservice with FastAPI and Pydantic v2 schemas.',
      'Configure async database sessions with SQLAlchemy 2.0 and Alembic migrations.',
      'Structure code using Ports and Adapters with typing.Protocol instead of tight framework couplings.',
      'Write exhaustive test suites using `pytest` fixtures, parametrize, and testcontainers.'
    ],
    recommendedReading: ['Architecture Patterns with Python (Cosmic Python)', 'FastAPI Official Tutorial']
  },
  {
    phase: 6,
    timeframe: 'Weeks 7–8 (Days 46–60)',
    title: 'AI/ML Engineering, High Performance, & Polyglot Mastery',
    focus: 'PyTorch, Polars, Hugging Face, LLM orchestration with LangGraph, and Rust extensions (PyO3).',
    csharpAnalogy: 'Unlocking Python’s greatest strategic advantage: becoming an AI/ML and modern data systems architect.',
    actionItems: [
      'Build an end-to-end RAG application with Qdrant vector database and Sentence-Transformers.',
      'Benchmark data transformations comparing legacy Pandas vs Polars with Apache Arrow.',
      'Profile application performance using `cProfile` and `py-spy` flamegraphs.',
      'Synthesize your C# distributed systems expertise with Python’s AI velocity: you are now a high-value Polyglot Architect!'
    ],
    recommendedReading: ['Designing Machine Learning Systems (Chip Huyen)', 'Polars User Guide']
  }
];

export const TOOLING_TRANSLATION_MATRIX = [
  {
    category: 'IDE / Editor',
    csharpTool: 'Visual Studio Enterprise / JetBrains Rider',
    pythonTool: 'VS Code (with Pylance/Pyright) / JetBrains PyCharm Professional / Cursor',
    notes: 'VS Code with the official Python and Pylance extensions provides a world-class experience comparable to Rider.'
  },
  {
    category: 'Build & Project File',
    csharpTool: '.csproj / .sln (MSBuild)',
    pythonTool: 'pyproject.toml (PEP 621)',
    notes: 'pyproject.toml centralizes dependencies, build system, tool configurations (ruff, pytest, mypy) in one file.'
  },
  {
    category: 'Package Manager',
    csharpTool: 'NuGet (`dotnet add package`)',
    pythonTool: 'uv (`uv add`, `uv run`) or Poetry / Pip',
    notes: '`uv` by Astral is written in Rust and resolves dependencies 10x–100x faster than traditional pip, mimicking dotnet CLI speed.'
  },
  {
    category: 'Runtime SDK Manager',
    csharpTool: '.NET SDK installer / global.json',
    pythonTool: 'uv (`uv python install 3.13`) / pyenv',
    notes: 'uv manages multiple Python interpreter versions automatically without system sudo permissions.'
  },
  {
    category: 'Web API Framework',
    csharpTool: 'ASP.NET Core Web API (Minimal APIs)',
    pythonTool: 'FastAPI / Litestar',
    notes: 'FastAPI auto-generates OpenAPI (Swagger) documentation based on type hints, identical to Swashbuckle in .NET.'
  },
  {
    category: 'Object-Relational Mapper',
    csharpTool: 'Entity Framework Core (EF Core)',
    pythonTool: 'SQLAlchemy 2.0 (Async) / SQLModel',
    notes: 'SQLAlchemy 2.0 cleanly separates Core (SQL expression language) from ORM (Unit of Work), with Alembic for migrations.'
  },
  {
    category: 'Testing Framework',
    csharpTool: 'xUnit / NUnit',
    pythonTool: 'pytest',
    notes: 'Pytest eliminates test class boilerplate; fixtures and plain `assert` statements provide superior ergonomics.'
  },
  {
    category: 'Mocking Library',
    csharpTool: 'Moq / NSubstitute',
    pythonTool: 'unittest.mock / pytest-mock',
    notes: 'Built-in `unittest.mock.MagicMock` leverages Python’s dynamic nature to mock any method or attribute with zero setup.'
  },
  {
    category: 'Validation & DTOs',
    csharpTool: 'FluentValidation + System.Text.Json',
    pythonTool: 'Pydantic v2',
    notes: 'Pydantic v2 executes validation in Rust core; combines schema definition, parsing, and validation in one declaration.'
  },
  {
    category: 'Structured Logging',
    csharpTool: 'Serilog',
    pythonTool: 'structlog',
    notes: 'structlog formats structured JSON context with zero allocation overhead for cloud log aggregators.'
  }
];

export const CSHARP_TO_PYTHON_PITFALLS = [
  {
    pitfall: '1. Writing Java/C# Getters and Setters',
    description: 'Writing `def get_name(self): return self._name` and `def set_name(self, v): self._name = v`.',
    fix: 'Use plain public attributes (`self.name = name`). In Python, if you ever need validation later, you can convert it to a `@property` without breaking public callers!'
  },
  {
    pitfall: '2. The Mutable Default Argument Trap',
    description: 'Writing `def add_item(item, items=[]): items.append(item); return items`. Default arguments are evaluated once at function definition time, so every caller shares the SAME list!',
    fix: 'Always use None as default: `def add_item(item, items=None): if items is None: items = []`.'
  },
  {
    pitfall: '3. Range-Len Loop Counter Anti-Pattern',
    description: 'Writing `for i in range(len(my_list)): val = my_list[i]`.',
    fix: 'Iterate directly: `for item in my_list:`. If you need the index, use `for idx, item in enumerate(my_list):`.'
  },
  {
    pitfall: '4. Believing Type Annotations Enforce Runtime Safety',
    description: 'Assuming `def add(a: int, b: int)` will prevent a caller from passing strings at runtime.',
    fix: 'Python does not enforce type annotations at runtime. Use Pydantic or Beartype if runtime schema enforcement is required.'
  },
  {
    pitfall: '5. Blocking the Async Event Loop',
    description: 'Calling `time.sleep()`, synchronous `requests.get()`, or heavy CPU algorithms directly inside `async def` functions.',
    fix: 'Use `await asyncio.sleep()`, `httpx.AsyncClient()`, or wrap blocking calls in `await asyncio.to_thread(func)`.'
  },
  {
    pitfall: '6. Using `is` for Value Equality',
    description: 'Writing `if count is 1000:`. In CPython, small integers (-5 to 256) are interned singletons, but larger numbers are distinct objects, causing `is` to unpredictably fail.',
    fix: 'Use `==` for value comparison; reserve `is` strictly for singletons like `if val is None:` or `if flag is True:`.'
  },
  {
    pitfall: '7. Forgetting that Modules are Executable Code',
    description: 'Placing top-level connection logic or print statements directly in the file root. They execute the moment any file imports the module!',
    fix: 'Guard executable code with `if __name__ == "__main__":`.'
  },
  {
    pitfall: '8. Swallowing Exceptions with Bare `except:`',
    description: 'Writing `try: ... except: pass`. This catches KeyboardInterrupt (Ctrl+C) and SystemExit, making the process impossible to kill!',
    fix: 'Always specify the exception type: `except ValueError: ...` or at least `except Exception: ...`.'
  },
  {
    pitfall: '9. Over-Engineering with Factory-Factory-Singletons',
    description: 'Creating multiple abstract factories and interface adapters for a simple 30-line script.',
    fix: 'Follow the Zen of Python: "Simple is better than complex." Start procedural or with simple functions; promote to classes when state demands it.'
  },
  {
    pitfall: '10. Modifying a List While Iterating Over It',
    description: 'Calling `items.remove(x)` inside `for x in items:`. The internal iterator index skips elements!',
    fix: 'Use a list comprehension to construct a filtered copy: `items = [x for x in items if not should_remove(x)]`.'
  }
];
