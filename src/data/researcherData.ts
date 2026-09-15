import { ResearchPaper } from '../types';

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-guido-cwi',
    title: 'An Overview of the Python Programming Language',
    authors: ['Guido van Rossum', 'Jelke de Boer'],
    year: 1995,
    venueOrSource: 'Centrum Wiskunde & Informatica (CWI) Technical Report CS-R9527',
    doiOrUrl: 'https://ir.cwi.nl/pub/5007',
    category: 'language',
    abstract: 'Describes the design philosophy, syntax, and implementation of Python as an interpreted, interactive, object-oriented programming language bridging the gap between C system programming and shell scripting.',
    impactOnPython: 'The foundational architectural description of Python’s dynamic type system, exception handling, and extensible C-API.',
    relevanceForEngineers: 'Explains why Python was built around protocol hooks and extensibility rather than rigid compiler enforcement.'
  },
  {
    id: 'paper-numpy-nature',
    title: 'Array Programming with NumPy',
    authors: ['Charles R. Harris', 'K. Jarrod Millman', 'Stéfan J. van der Walt', 'Travis E. Oliphant', 'et al.'],
    year: 2020,
    venueOrSource: 'Nature 585, 357–362',
    doiOrUrl: 'https://doi.org/10.1038/s41586-020-2649-2',
    category: 'scientific',
    abstract: 'NumPy is the fundamental package for scientific computing in Python. It provides a multidimensional array object, various derived objects, and an assortment of routines for fast operations on arrays, including mathematical, logical, shape manipulation, sorting, selecting, I/O, and discrete Fourier transforms.',
    impactOnPython: 'Turned Python into the global standard for data science, physics, biology, and machine learning by providing C-speed contiguous memory buffers.',
    relevanceForEngineers: 'Essential reading to understand why Python outperforms compiled languages in vector operations: execution happens in optimized C/Fortran SIMD kernels.'
  },
  {
    id: 'paper-wes-pandas',
    title: 'Data Structures for Statistical Computing in Python',
    authors: ['Wes McKinney'],
    year: 2010,
    venueOrSource: 'Proceedings of the 9th Python in Science Conference (SciPy 2010)',
    doiOrUrl: 'https://doi.org/10.25080/Majora-92bf1924-003',
    category: 'scientific',
    abstract: 'Introduces Pandas and the DataFrame data structure, addressing the need for high-performance, flexible data structures with integrated indexing, alignment, and relational group-by operations in Python for quantitative finance and analytics.',
    impactOnPython: 'Democratized tabular data processing; established Python as the dominant language for quantitative finance on Wall Street and data analytics worldwide.',
    relevanceForEngineers: 'Demonstrates how custom index alignment algorithms and labeled ndarrays bridge raw mathematical matrices and relational SQL operations.'
  },
  {
    id: 'paper-norvig-patterns',
    title: 'Design Patterns in Dynamic Languages',
    authors: ['Peter Norvig'],
    year: 1996,
    venueOrSource: 'ACM OOPSLA Tutorial / Google Research',
    doiOrUrl: 'https://norvig.com/design-patterns/',
    category: 'language',
    abstract: 'Analyzes the 23 Gang of Four (GoF) object-oriented design patterns in the context of dynamic languages. Norvig demonstrates that 16 of the 23 patterns (including Strategy, Command, Iterator, Template Method, and Decorator) are either built-in language primitives, simplified into first-class functions, or rendered invisible.',
    impactOnPython: 'Shaped the modern Python ethos of avoiding bureaucratic class hierarchies in favor of first-class callables, protocols, and closures.',
    relevanceForEngineers: 'Crucial reading for C# engineers who over-engineer Python with Factory-of-Factories patterns.'
  },
  {
    id: 'paper-timsort',
    title: 'Timsort: An Adaptive, Stable, Natural Merge Sort Algorithm',
    authors: ['Tim Peters'],
    year: 2002,
    venueOrSource: 'Python Software Foundation / cpython/Objects/listsort.txt',
    doiOrUrl: 'https://bugs.python.org/file4451/timsort.txt',
    category: 'performance',
    abstract: 'Presents Timsort, a hybrid sorting algorithm derived from merge sort and insertion sort designed to perform exceptionally well on real-world data containing pre-existing ordered sequences ("runs"). Achieves O(N) best-case time and O(N log N) worst-case time with strict O(N) space stability.',
    impactOnPython: 'Became the default sorting algorithm for Python in 2.3. Its mathematical brilliance led to its adoption by Java (SE 7+ Arrays.sort), Android, Rust, and the V8 JavaScript engine.',
    relevanceForEngineers: 'Highlights that Python core developers contribute deep algorithmic breakthroughs adopted across all modern software runtimes.'
  },
  {
    id: 'paper-pep703-samgross',
    title: 'PEP 703: Making the Global Interpreter Lock Optional in CPython',
    authors: ['Sam Gross'],
    year: 2023,
    venueOrSource: 'Python Enhancement Proposals (PEP 703)',
    doiOrUrl: 'https://peps.python.org/pep-0703/',
    category: 'performance',
    abstract: 'Specifies the architectural changes to CPython to remove the Global Interpreter Lock (GIL) and allow multi-threaded Python programs to utilize multiple CPU cores in parallel. Details biased reference counting, immortal objects, and mimalloc integration.',
    impactOnPython: 'The most consequential architectural change to Python in its 35-year history, unblocking native multi-threaded CPU parallel execution in Python 3.13+.',
    relevanceForEngineers: 'Directly addresses the primary performance critique historically cited by C# and Java enterprise architects.'
  },
  {
    id: 'paper-pep659-fastercpython',
    title: 'PEP 659: Specializing Adaptive Interpreter',
    authors: ['Mark Shannon'],
    year: 2020,
    venueOrSource: 'Python Enhancement Proposals (PEP 659) & Microsoft Faster CPython Project',
    doiOrUrl: 'https://peps.python.org/pep-0659/',
    category: 'performance',
    abstract: 'Proposes an adaptive bytecode interpreter that monitors opcode types at runtime and selectively rewires bytecode to execute specialized, monomorphic C code with inline type caching, delivering significant speedups with zero breaking changes to the C-API.',
    impactOnPython: 'Powered Python 3.11’s 10%–60% speed increase and established the foundation for Python 3.13’s Tier-2 copy-and-patch JIT.',
    relevanceForEngineers: 'Reveals how modern Python achieves JIT-like adaptive specialization without losing dynamic safety.'
  },
  {
    id: 'paper-pep484-typing',
    title: 'PEP 484: Type Hints for Python',
    authors: ['Guido van Rossum', 'Jukka Lehtosalo', 'Łukasz Langa'],
    year: 2014,
    venueOrSource: 'Python Enhancement Proposals (PEP 484)',
    doiOrUrl: 'https://peps.python.org/pep-0484/',
    category: 'typing',
    abstract: 'Introduces a standardized syntax for type annotations in Python, laying the foundation for static analysis tools like mypy, pyright, and IDE auto-completion while strictly leaving runtime semantics unaffected.',
    impactOnPython: 'Enabled massive million-line codebases at Dropbox, Instagram, Meta, and Google to remain maintainable, safe, and refactorable.',
    relevanceForEngineers: 'Allows C# engineers to retain strong static typing guarantees in large-scale Python systems.'
  }
];
