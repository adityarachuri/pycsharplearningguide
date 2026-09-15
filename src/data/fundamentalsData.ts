export interface TimelineEvent {
  year: string;
  version: string;
  milestone: string;
  description: string;
  impactForDev: string;
}

export const PROGRAMMING_TIMELINE: TimelineEvent[] = [
  {
    year: '1989',
    version: 'Inception',
    milestone: 'Christmas Project at CWI Amsterdam',
    description: 'Guido van Rossum conceives Python as a hobby project during Christmas week at Centrum Wiskunde & Informatica (CWI) in the Netherlands, seeking a scripting language with ABC-like elegance and Unix system access.',
    impactForDev: 'Originates Python’s core focus: developer ergonomics over raw compiler ceremony.'
  },
  {
    year: '1991',
    version: 'Python 0.9.0',
    milestone: 'First Public Release on alt.sources',
    description: 'First public code release featuring classes with inheritance, exception handling with try/except, functions, and the core data types: list, dict, str.',
    impactForDev: 'Proved an interpreted object-oriented language could be both lightweight and expressive.'
  },
  {
    year: '1994',
    version: 'Python 1.0',
    milestone: 'Functional Tools & Module System',
    description: 'Python 1.0 introduces functional programming primitives (lambda, map, filter, reduce), keyword arguments, and support for complex numbers.',
    impactForDev: 'Blends procedural, object-oriented, and functional paradigms into a single unified syntax.'
  },
  {
    year: '2000',
    version: 'Python 2.0',
    milestone: 'Cycle-detecting GC & List Comprehensions',
    description: 'Introduces list comprehensions (borrowed from Haskell), a full cycle-detecting garbage collector alongside reference counting, and transitioned development to an open-source community process.',
    impactForDev: 'Comprehensions become the signature Pythonic idiom, directly predating C# LINQ query syntax.'
  },
  {
    year: '2008',
    version: 'Python 3.0',
    milestone: 'The Great Clean-Up (PEP 3000)',
    description: 'A backwards-incompatible overhaul fixing fundamental early design flaws: text strings became strictly Unicode (str) vs raw binary (bytes), print became a function, iterators replaced memory-eager lists across built-ins, and integer division became true float division (/).',
    impactForDev: 'Taught the software industry critical lessons about migration paths, multi-version deprecation, and backwards compatibility.'
  },
  {
    year: '2015',
    version: 'Python 3.5',
    milestone: 'Async/Await & Type Hints (PEP 484 / 492)',
    description: 'Introduces native async and await keywords (familiar to C# async/await developers) and standardized gradual typing annotations via the typing module.',
    impactForDev: 'Elevated Python from scripting to industrial enterprise systems with static type checkers (mypy/pyright).'
  },
  {
    year: '2018',
    version: 'Python 3.7',
    milestone: 'Dataclasses & Governance Shift',
    description: 'PEP 557 introduces dataclasses (mirroring C# 9+ records and boilerplate-free POCOs). Guido van Rossum steps down as BDFL; PEP 13 establishes the 5-member elected Steering Council.',
    impactForDev: 'Modern, immutable, and typed domain modeling becomes native standard library.'
  },
  {
    year: '2021',
    version: 'Python 3.10',
    milestone: 'Structural Pattern Matching (PEP 634)',
    description: 'Introduces match/case structural pattern matching, matching sequences, mappings, and class instances with guard expressions (comparable to C# pattern matching switch expressions).',
    impactForDev: 'Drastically clarifies state machine, parser, and polymorphic dispatch code.'
  },
  {
    year: '2022',
    version: 'Python 3.11',
    milestone: 'Faster CPython Initiative & PEP 659',
    description: 'Under Mark Shannon and Guido van Rossum at Microsoft, the Faster CPython project delivers 10%–60% speedups via the Specializing Adaptive Interpreter (PEP 659) and optimized frame allocations.',
    impactForDev: 'CPython begins narrowing the performance gap with JIT-compiled runtimes.'
  },
  {
    year: '2024–2026',
    version: 'Python 3.13+',
    milestone: 'Free-Threaded CPython (PEP 703) & JIT',
    description: 'Groundbreaking milestone: optional removal of the Global Interpreter Lock (GIL) enabling true multi-threaded multi-core CPU scaling, alongside an experimental copy-and-patch Tier-2 JIT compiler.',
    impactForDev: 'Removes the primary historical limitation compared to the .NET CLR multithreading model.'
  }
];

export const CREATOR_PROFILE = {
  name: 'Guido van Rossum',
  title: 'Creator of Python & Former BDFL',
  birthYear: '1956',
  nationality: 'Dutch',
  currentRole: 'Distinguished Engineer at Microsoft (Faster CPython Team)',
  background: `Guido van Rossum graduated with a Master’s in Mathematics and Computer Science from the University of Amsterdam in 1982. During the mid-1980s at CWI (Centrum Wiskunde & Informatica), he worked on the ABC programming language. ABC was designed to teach non-programmers with syntax inspired by plain English and indentation-based block structuring. However, ABC lacked extensibility, direct file system access, and raw performance.

In December 1989, seeking a tool to assist with distributed system management on Amoeba OS, Guido created Python. He borrowed ABC’s clean indentation syntax and exceptional data types while ensuring it was fully extensible via C and had complete POSIX/operating system access.`,
  bdflStory: `For nearly 30 years, Guido held the community title "Benevolent Dictator For Life" (BDFL), serving as the ultimate arbiter of PEPs (Python Enhancement Proposals).

In July 2018, following passionate community polarization over PEP 572 (which introduced the assignment expression / walrus operator :=), Guido announced his retirement as BDFL:
"Now that PEP 572 is done, I don't ever want to have to fight so hard for a PEP and learn that so many people despise my decisions... I am completely stepping down from the BDFL role."

Following his resignation, the community authored and voted on PEP 13, establishing a formal democratic governance model governed by an annually elected 5-member Steering Council. This proved the resilience, maturity, and decentralized strength of Python’s governance.`,
  currentWork: `In late 2020, Guido came out of retirement to join Microsoft's Developer Division. Leading the "Faster CPython" project alongside Mark Shannon and Eric Snow, he dedicated his efforts to optimizing CPython bytecode specialization, reducing memory overhead, and architecting the experimental JIT compilation pipeline.`
};

export const ZEN_OF_PYTHON = [
  { principle: 'Beautiful is better than ugly.', context: 'Express intent with clarity rather than dense obscurity.' },
  { principle: 'Explicit is better than implicit.', context: 'Favor clear references and parameters over magic variables or hidden reflection.' },
  { principle: 'Simple is better than complex.', context: 'Solve the problem directly before adding abstractions.' },
  { principle: 'Complex is better than complicated.', context: 'If a domain is inherently complex, partition it cleanly without convoluted wiring.' },
  { principle: 'Flat is better than nested.', context: 'Avoid deep inheritance trees and excessive nested blocks.' },
  { principle: 'Sparse is better than dense.', context: 'Let code breathe with consistent whitespace.' },
  { principle: 'Readability counts.', context: 'Code is read 10x more often than it is written.' },
  { principle: 'Special cases aren\'t special enough to break the rules.', context: 'Maintain structural consistency throughout APIs.' },
  { principle: 'Although practicality beats purity.', context: 'Pragmatic production utility outweighs ideological perfection.' },
  { principle: 'Errors should never pass silently.', context: 'Do not swallow exceptions with empty except blocks.' },
  { principle: 'Unless explicitly silenced.', context: 'Silence only when explicitly handling known boundary conditions.' },
  { principle: 'In the face of ambiguity, refuse the temptation to guess.', context: 'Raise errors or enforce contracts rather than coercing unpredictably.' },
  { principle: 'There should be one-- and preferably only one --obvious way to do it.', context: 'Avoid multiple redundant idioms for identical operations (unlike Perl/Ruby).' },
  { principle: 'Although that way may not be obvious at first unless you\'re Dutch.', context: 'A self-deprecating nod to Guido van Rossum’s Dutch pragmatic aesthetic.' },
  { principle: 'Now is better than never.', context: 'Ship working software.' },
  { principle: 'Although never is often better than *right* now.', context: 'Think through API design before committing to public interfaces.' },
  { principle: 'If the implementation is hard to explain, it\'s a bad idea.', context: 'Complexity is often an architectural smell.' },
  { principle: 'If the implementation is easy to explain, it may be a good idea.', context: 'Simplicity correlates with robust systems.' },
  { principle: 'Namespaces are one honking great idea -- let\'s do more of those!', context: 'Use modules and packages to partition domains clearly.' }
];

export const FUNDAMENTALS_COMPARISON = [
  {
    topic: 'Variables & Names',
    csharpConcept: 'Variables are typed memory storage locations. Value types live on stack/inline; reference types hold pointers to heap.',
    pythonConcept: 'Variables are NOT storage locations; they are names (tags) bound to heap objects. All values in Python are heap-allocated PyObject pointers.',
    codeExample: `# C#: int x = 10; x = "hello"; // Compile Error!
# Python:
x = 10       # 'x' references int object 10
x = "hello"  # 'x' now references str object "hello"`
  },
  {
    topic: 'Truthiness & Boolean Coercion',
    csharpConcept: 'Strict type checking. Only booleans (bool) evaluate in if statements. Must write: if (list.Count > 0)',
    pythonConcept: 'Every object implements the bool() protocol via __bool__() or __len__(). Empty collections, 0, None are falsy.',
    codeExample: `# C#: if (users != null && users.Any()) { ... }
# Python idiomatic check:
if users:
    print("Has active users")`
  },
  {
    topic: 'Division & Power Operators',
    csharpConcept: 'int / int performs integer floor division. Math.Pow(x, 2) needed for exponents.',
    pythonConcept: '/ performs true float division. // performs floor division. ** is the native exponentiation operator.',
    codeExample: `# C#: 7 / 2 -> 3 (integer division)
# Python:
true_div = 7 / 2     # 3.5 (float)
floor_div = 7 // 2   # 3 (int)
power = 2 ** 10      # 1024`
  },
  {
    topic: 'Equality vs Identity',
    csharpConcept: '== invokes operator overload; ReferenceEquals(a, b) checks memory address identity.',
    pythonConcept: '== calls __eq__() for value equality. "is" checks PyObject pointer identity. Idiomatic: "x is None".',
    codeExample: `# Check identity with None singleton:
if result is None:
    handle_missing()

# Value equality:
if a == b:
    print("Values are identical")`
  }
];
