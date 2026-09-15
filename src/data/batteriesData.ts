export interface BatteryModule {
  id: string;
  name: string;
  importStatement: string;
  category: 'Containers & Algorithms' | 'Concurrency & Async' | 'Functional & Types' | 'I/O & Filesystem' | 'Storage & Serialization' | 'Reflection & Tooling' | 'Numerics & Science';
  tagline: string;
  dotNetEquivalent: string;
  mentalModelShift: string;
  cpythonInternals: string;
  keyClassesAndFunctions: {
    name: string;
    signature: string;
    description: string;
  }[];
  csharpExample: string;
  pythonExample: string;
  productionUseCases: string[];
  pitfalls: string[];
  bestPractices: string[];
  interactiveCodeSnippet: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const PYTHON_BATTERIES: BatteryModule[] = [
  {
    id: 'collections',
    name: 'collections',
    importStatement: 'import collections\nfrom collections import defaultdict, Counter, deque, namedtuple, ChainMap',
    category: 'Containers & Algorithms',
    tagline: 'High-performance specialized container datatypes beyond standard dict, list, set, and tuple.',
    dotNetEquivalent: 'System.Collections.Generic (ConcurrentQueue, LinkedList, KeyedCollection, Dictionary with custom factories)',
    mentalModelShift: 'In C#, you frequently build custom wrapper dictionaries or linq queries to group elements. In Python, collections gives you C-optimized data structures like defaultdict and Counter that eliminate boilerplate null/key-existence checks with zero overhead.',
    cpythonInternals: 'deque is implemented in C as a doubly linked list of fixed-size blocks (BLOCKLEN=64). It provides O(1) appends and pops from both ends, unlike Python list which is a dynamic array with O(n) left-side operations. Counter is a C-optimized dict subclass implementing multiset semantics with highly optimized C-accelerated subtraction and intersection.',
    keyClassesAndFunctions: [
      {
        name: 'defaultdict(default_factory)',
        signature: 'defaultdict(callable_or_type)',
        description: 'Dictionary subclass that calls a zero-argument callable factory whenever a missing key is accessed, preventing KeyError.'
      },
      {
        name: 'Counter([iterable_or_mapping])',
        signature: 'Counter(iterable=None, **kwds)',
        description: 'Dict subclass for counting hashable items. Supports arithmetic operations (+, -, &, |) and most_common(n) heap-based retrieval.'
      },
      {
        name: 'deque([iterable[, maxlen]])',
        signature: 'deque(iterable=(), maxlen=None)',
        description: 'Double-ended queue with thread-safe, memory-efficient O(1) appends and pops from either side. Bound maxlen acts as a circular ring buffer.'
      },
      {
        name: 'namedtuple(typename, field_names)',
        signature: 'namedtuple(typename, field_names, *, rename=False, defaults=None)',
        description: 'Factory function for creating tuple subclasses with named fields and dot-access, consuming identical memory to a raw tuple.'
      },
      {
        name: 'ChainMap(*maps)',
        signature: 'ChainMap(*maps)',
        description: 'Groups multiple dicts into a single updateable view without copying. Perfect for scoping layers (CLI flags -> env vars -> config file defaults).'
      }
    ],
    csharpExample: `// C#: Word frequency counting using LINQ or manual Dictionary
using System;
using System.Collections.Generic;
using System.Linq;

public class WordFrequency
{
    public static Dictionary<string, int> CountWords(string[] tokens)
    {
        var counts = new Dictionary<string, int>();
        foreach (var word in tokens)
        {
            if (counts.TryGetValue(word, out int current))
                counts[word] = current + 1;
            else
                counts[word] = 1;
        }
        return counts;
    }

    // Circular ring buffer requires custom LinkedList or Queue with manual dequeue
    public static Queue<int> CreateBoundedQueue(int capacity)
    {
        return new Queue<int>(capacity);
    }
}`,
    pythonExample: `from collections import defaultdict, Counter, deque, ChainMap

# 1. Counter: Multiset frequency analysis in one line
tokens = ["apple", "banana", "apple", "cherry", "banana", "apple"]
word_counts = Counter(tokens)
print(word_counts.most_common(2)) # [('apple', 3), ('banana', 2)]

# 2. defaultdict: Grouping without boilerplate 'if key not in dict'
grouped_by_len = defaultdict(list)
for word in tokens:
    grouped_by_len[len(word)].append(word)

# 3. deque: Fixed-size circular buffer for sliding telemetry
recent_latencies = deque(maxlen=3)
for latency in [12.4, 15.1, 9.8, 22.0]:
    recent_latencies.append(latency)
print(list(recent_latencies)) # [15.1, 9.8, 22.0] (oldest 12.4 was evicted in O(1))

# 4. ChainMap: Scoped layered config lookups
cli_args = {'timeout': 30}
env_vars = {'timeout': 60, 'host': 'api.internal'}
defaults = {'timeout': 10, 'host': 'localhost', 'retries': 3}

config = ChainMap(cli_args, env_vars, defaults)
print(config['timeout'])  # 30 (from CLI)
print(config['host'])     # 'api.internal' (from Env)
print(config['retries'])  # 3 (from Defaults)`,
    productionUseCases: [
      'Sliding window metrics aggregation in FastAPI microservices using bounded deque(maxlen=N).',
      'Token vocabulary builders in NLP / LLM preprocessing pipelines using Counter.most_common(vocab_size).',
      'Hierarchical configuration management in CLI engines via ChainMap (CLI args > Env vars > Config files).'
    ],
    pitfalls: [
      'defaultdict creates an entry when a missing key is accessed using read syntax (e.g. `val = d["missing"]`). Use `d.get("missing")` or `"missing" in d` if you do not want to trigger factory creation.',
      'deque does not have O(1) random index access (e.g. `d[50000]`); index lookups are O(n). Use standard list if random indexing is frequent.',
      'namedtuple is immutable; attempting to mutate attributes raises AttributeError. Use dataclasses if mutable record fields are needed.'
    ],
    bestPractices: [
      'Always specify maxlen on deque when buffering streaming logs to prevent unbounded memory growth.',
      'Use Counter addition (+) and subtraction (-) for inventory tracking and set-like arithmetic with multiplicity.',
      'Prefer collections.abc (Iterable, Mapping, Sequence) for type annotations rather than concrete classes.'
    ],
    interactiveCodeSnippet: `from collections import Counter, defaultdict, deque

# Test Counter multiset operations
c1 = Counter(apples=4, oranges=2)
c2 = Counter(apples=1, oranges=5, bananas=3)

combined = c1 + c2
diff = c2 - c1

print(f"Combined inventory: {combined}")
print(f"Surplus inventory: {diff}")
print(f"Top fruit: {combined.most_common(1)}")`,
    quiz: {
      question: 'What happens when you read a non-existent key from a defaultdict(int) using `val = my_dict["unknown_key"]`?',
      options: [
        'It raises a KeyError just like a regular dict.',
        'It returns None without modifying the dictionary.',
        'It calls int() to produce 0, inserts ("unknown_key", 0) into the dict, and returns 0.',
        'It throws an InvalidOperationException.'
      ],
      correctIndex: 2,
      explanation: 'defaultdict intercepts __missing__(key), executes the default_factory callable (int() returns 0), assigns the key-value pair into the dictionary, and returns the newly minted value.'
    }
  },
  {
    id: 'itertools',
    name: 'itertools',
    importStatement: 'import itertools\nfrom itertools import chain, islice, cycle, count, groupby, product, permutations, combinations',
    category: 'Containers & Algorithms',
    tagline: 'Functions creating iterators for efficient looping, combinatorics, and streaming pipelining.',
    dotNetEquivalent: 'System.Linq.Enumerable (SelectMany, Concat, Take, Skip, GroupBy, Zip, Range)',
    mentalModelShift: 'LINQ in C# provides deferred execution over IEnumerable<T>. Python itertools provides ultra-fast C-level generator building blocks that operate with O(1) memory complexity regardless of whether you are processing 10 items or 10 billion streaming items.',
    cpythonInternals: 'All itertools functions are implemented as C-extension types (written in pure C inside Modules/itertoolsmodule.c). They maintain internal C structs holding iterator pointers without instantiating intermediate Python objects until requested by the interpreter loop.',
    keyClassesAndFunctions: [
      {
        name: 'chain(*iterables)',
        signature: 'chain(*iterables) / chain.from_iterable(iterable)',
        description: 'Chains multiple iterables sequentially into a single continuous stream without memory allocation (like LINQ Concat).'
      },
      {
        name: 'islice(iterable, [start,] stop [, step])',
        signature: 'islice(iterable, stop) / islice(iterable, start, stop, step=1)',
        description: 'Lazy streaming slice over any generator or iterator without loading elements into memory (like LINQ Skip().Take()).'
      },
      {
        name: 'groupby(iterable, key=None)',
        signature: 'groupby(iterable, key=None)',
        description: 'Groups consecutive elements sharing a common key. Note: Data MUST be sorted beforehand!'
      },
      {
        name: 'product(*iterables, repeat=1)',
        signature: 'product(*iterables, repeat=1)',
        description: 'Cartesian product of input iterables. Replaces deeply nested for-loops with a single clean, lazy generator.'
      },
      {
        name: 'accumulate(iterable[, func, *, initial=None])',
        signature: 'accumulate(iterable, func=operator.add, *, initial=None)',
        description: 'Yields running cumulative reductions (cumulative sums, running maximums, compound interest).'
      }
    ],
    csharpExample: `// C#: LINQ streaming pipelines
using System;
using System.Collections.Generic;
using System.Linq;

public class LinqPipeline
{
    public static IEnumerable<int> CombineAndSlice(IEnumerable<int> first, IEnumerable<int> second)
    {
        // Concat + Skip + Take
        return first.Concat(second)
                    .Skip(5)
                    .Take(10);
    }

    public static IEnumerable<(string Color, string Size)> CartesianProduct(string[] colors, string[] sizes)
    {
        return from c in colors
               from s in sizes
               select (c, s);
    }
}`,
    pythonExample: `import itertools
import operator

# 1. chain: Flatten heterogeneous streams with zero memory overhead
log_batch_1 = ["2026-09-01: OK", "2026-09-02: WARN"]
log_batch_2 = ["2026-09-03: ERROR", "2026-09-04: OK"]
all_logs = itertools.chain(log_batch_1, log_batch_2)

# 2. islice: Stream page window without slicing the whole list
first_three = list(itertools.islice(all_logs, 3))
print("First 3:", first_three)

# 3. product: Cartesian cross-product without nested loops
regions = ['us-east', 'eu-central']
runtimes = ['python3.12', 'python3.13']
instances = ['c6i.large', 'm6i.xlarge']

matrix = list(itertools.product(regions, runtimes, instances))
print(f"Generated {len(matrix)} deployment permutations.")

# 4. accumulate: Running max / cumulative balance
transactions = [100, -20, 50, -40, 200]
running_balance = list(itertools.accumulate(transactions))
print("Running Balance:", running_balance) # [100, 80, 130, 90, 290]

# 5. batched (Python 3.12+ native batching!)
data = range(10)
batches = list(itertools.batched(data, n=3))
print("Batches:", batches) # [(0, 1, 2), (3, 4, 5), (6, 7, 8), (9,)]`,
    productionUseCases: [
      'Chunking large bulk SQL insertion queries or OpenAI embeddings calls using itertools.batched(records, 100).',
      'Grid search and hyperparameter tuning in machine learning pipelines using itertools.product(*param_grids).',
      'High-throughput real-time telemetry processing where memory constraints prohibit materializing arrays.'
    ],
    pitfalls: [
      'itertools.groupby only groups CONSECUTIVE items. If your data is not pre-sorted by the grouping key, items with the same key in separate locations will create separate groups.',
      'Iterators are single-pass only! Once consumed, you cannot re-iterate without reconstructing the generator or using itertools.tee().',
      'itertools.tee(it, n=2) buffers unconsumed items in memory. If one branch advances far ahead of the other, memory usage grows linearly.'
    ],
    bestPractices: [
      'Always pre-sort data with `sorted(data, key=...)` before calling `itertools.groupby`.',
      'Use `itertools.islice` instead of `list[:N]` when working with generators or database cursor queries.',
      'In Python 3.12+, prefer `itertools.batched()` over custom batching while loops.'
    ],
    interactiveCodeSnippet: `import itertools
import operator

# Generate running maximums
scores = [45, 78, 62, 89, 91, 85, 96, 74]
running_max = list(itertools.accumulate(scores, func=max))

print("Raw Scores:   ", scores)
print("Running Max:  ", running_max)

# Combinations without replacement
teams = ['DevOps', 'Backend', 'Security', 'QA']
pairings = list(itertools.combinations(teams, 2))
print(f"Total Cross-Team Audits ({len(pairings)}):", pairings)`,
    quiz: {
      question: 'How does itertools.groupby differ from C# LINQ Enumerable.GroupBy?',
      options: [
        'itertools.groupby requires an asynchronous task runner.',
        'itertools.groupby only groups adjacent matching elements; unsorted collections will produce fragmented duplicate groups.',
        'itertools.groupby stores all elements in an in-memory B-Tree index.',
        'There is no difference; both automatically sort and hash all items.'
      ],
      correctIndex: 1,
      explanation: 'Unlike LINQ GroupBy which hashes all elements into in-memory lookup buckets, itertools.groupby is a pure streaming C-level iterator that steps through elements and breaks groups whenever the key value changes.'
    }
  },
  {
    id: 'functools',
    name: 'functools & operator',
    importStatement: 'import functools\nfrom functools import lru_cache, cache, partial, wraps, singledispatch, total_ordering\nimport operator',
    category: 'Functional & Types',
    tagline: 'Higher-order functions, memoization, function adaptation, and generic function dispatching.',
    dotNetEquivalent: 'System.Func, System.Action, Expression Trees, MemoryCache, and Polymorphic Overloading',
    mentalModelShift: 'In C#, method overloading is resolved statically at compile time. In Python, functools provides @singledispatch for dynamic polymorphic dispatching based on argument types, plus transparent C-level LRU caching with @lru_cache.',
    cpythonInternals: 'functools.lru_cache is implemented in C with a circular doubly linked list and a hash table mapping arguments (as a hashed tuple) to results. It provides thread-safe, lock-protected O(1) cache hits. functools.wraps copies __name__, __doc__, and __annotations__ from wrapped functions, preserving introspection for debugging and APM tools.',
    keyClassesAndFunctions: [
      {
        name: '@lru_cache(maxsize=128, typed=False) / @cache',
        signature: '@lru_cache(maxsize=128) / @cache',
        description: 'Decorator that memoizes function return values up to maxsize using a Least-Recently-Used eviction policy. @cache is an unbounded fast shorthand.'
      },
      {
        name: 'partial(func, *args, **keywords)',
        signature: 'partial(func, *args, **keywords)',
        description: 'Returns a new partial object which freezes a portion of a function arguments, creating a new callable with a simpler signature.'
      },
      {
        name: '@wraps(wrapped)',
        signature: '@wraps(wrapped)',
        description: 'Vital helper for writing custom decorators; copies docstrings, name, module, and annotations from wrapped to wrapper.'
      },
      {
        name: '@singledispatch',
        signature: '@singledispatch def func(arg, ...)',
        description: 'Transforms a function into a generic function capable of dispatching to different implementations based on the first argument type.'
      },
      {
        name: '@total_ordering',
        signature: '@total_ordering class MyClass',
        description: 'Class decorator that generates all rich comparison methods (__le__, __gt__, __ge__) from just __eq__ and one order method (__lt__).'
      }
    ],
    csharpExample: `// C#: Method Overloading & Partial Function via Lambda
using System;

public class Calculator
{
    // Static Compile-Time Overloading
    public string Format(int value) => $"Int: {value:N0}";
    public string Format(double value) => $"Double: {value:F2}";
    public string Format(DateTime value) => $"Date: {value:yyyy-MM-dd}";

    // Currying / Partial Application
    public Func<int, int> MultiplyBy(int factor) => x => x * factor;
}`,
    pythonExample: `from functools import lru_cache, partial, wraps, singledispatch, total_ordering
import operator

# 1. @lru_cache: Microsecond in-memory memoization
@lru_cache(maxsize=256)
def expensive_db_query(tenant_id: str, query_hash: str) -> dict:
    # Simulated heavy computation
    return {"tenant": tenant_id, "hash": query_hash, "data": [1, 2, 3]}

# Inspect cache statistics
expensive_db_query("tenant_a", "h1")
expensive_db_query("tenant_a", "h1") # Instant cache hit!
print("Cache telemetry:", expensive_db_query.cache_info())

# 2. @singledispatch: Dynamic Polymorphic Overloading
@singledispatch
def serialize(data):
    raise NotImplementedError(f"Cannot serialize type: {type(data)}")

@serialize.register(int)
def _(data: int):
    return f"<int:{data}>"

@serialize.register(dict)
def _(data: dict):
    return f"<json:{len(data)} keys>"

print(serialize(42))
print(serialize({"name": "Atlas"}))

# 3. partial: Argument freezing for cleaner callback APIs
def send_notification(service: str, priority: int, message: str):
    return f"[{service.upper()}] P{priority}: {message}"

notify_security_ops = partial(send_notification, "security-gateway", 1)
print(notify_security_ops("Unauthorized SSH attempt detected"))

# 4. operator module: Avoid lambda overhead in sorting & mapping
people = [{'name': 'Guido', 'age': 68}, {'name': 'Anders', 'age': 64}]
people.sort(key=operator.itemgetter('age'))`,
    productionUseCases: [
      'Caching auth token validation or JWKS public keys in API gateways with @lru_cache(maxsize=16).',
      'Configuring standardized Celery task or FastAPI dependency callbacks using partial(db_session, read_only=True).',
      'Writing robust custom enterprise logging/metric decorators using @wraps to preserve function signatures for Datadog / OpenTelemetry.'
    ],
    pitfalls: [
      'Arguments to functions decorated with @lru_cache MUST be hashable. Passing a mutable dict or list will raise TypeError: unhashable type.',
      'If you decorate a method inside a class with @lru_cache, `self` is part of the cache key! This causes circular references preventing garbage collection unless weak references are used.',
      'Forgetting @wraps inside a decorator erases the function name, setting it to `wrapper`, breaking Sphinx documentation and stack traces.'
    ],
    bestPractices: [
      'Always pass typed=True to @lru_cache if 1 and 1.0 must be cached separately.',
      'Use `functools.cache` instead of `@lru_cache(maxsize=None)` in Python 3.9+ for clearer intent when caching unbounded pure functions.',
      'Use `operator.attrgetter` and `operator.itemgetter` instead of lambdas for 20-30% faster C-level key extraction.'
    ],
    interactiveCodeSnippet: `from functools import lru_cache

# Recursive Fibonacci demonstrating LRU cache speedup
@lru_cache(maxsize=64)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

# Calculate Fibonacci(50) instantly (would take years without cache)
val = fib(50)
print(f"Fibonacci(50) = {val}")
print(f"LRU Cache Stats: {fib.cache_info()}")`,
    quiz: {
      question: 'What is the primary architectural purpose of functools.wraps inside a custom decorator?',
      options: [
        'To compile the wrapped Python function into C machine code.',
        'To copy metadata (e.g. __name__, __doc__, __annotations__) from the original function onto the wrapper so reflection and stack traces remain intact.',
        'To make the function thread-safe across all GIL locks.',
        'To automatically serialize return values into JSON.'
      ],
      correctIndex: 1,
      explanation: 'Without @wraps, the decorated function takes on the wrapper function’s __name__ ("wrapper") and loses its docstring and type annotations, creating debugging nightmares in production monitoring and APM tools.'
    }
  },
  {
    id: 'asyncio',
    name: 'asyncio',
    importStatement: 'import asyncio\nfrom asyncio import TaskGroup, gather, Queue, Semaphore, sleep, run',
    category: 'Concurrency & Async',
    tagline: 'Asynchronous I/O, event loop runtime, coroutines, and structured concurrency.',
    dotNetEquivalent: 'System.Threading.Tasks (Task, Task.WhenAll, TaskCompletionSource, Channel<T>)',
    mentalModelShift: 'In C#, Tasks run on a multi-threaded ThreadPool by default. In Python, asyncio runs on a single thread with an Event Loop using cooperative multitasking. A coroutine never yields CPU execution until it hits an `await` expression!',
    cpythonInternals: 'CPython asyncio event loops use OS-level multiplexing (epoll on Linux, kqueue on macOS, I/O Completion Ports / Proactor on Windows via select/selectors). Coroutines are implemented as generator-based frames with an execution pointer stored in a PyCoroObject struct.',
    keyClassesAndFunctions: [
      {
        name: 'asyncio.run(coro)',
        signature: 'asyncio.run(coro, *, debug=None)',
        description: 'Creates a new event loop, runs the passed coroutine to completion, closes the loop, and cancels lingering tasks.'
      },
      {
        name: 'async with TaskGroup() as tg (Python 3.11+)',
        signature: 'async with asyncio.TaskGroup() as tg:',
        description: 'Structured concurrency manager. If any child task fails with an exception, all sibling tasks are automatically cancelled immediately!'
      },
      {
        name: 'asyncio.gather(*aws, return_exceptions=False)',
        signature: 'asyncio.gather(*coros_or_futures, return_exceptions=False)',
        description: 'Runs multiple awaitable objects concurrently and aggregates their results in order (like C# Task.WhenAll).'
      },
      {
        name: 'asyncio.Semaphore(value)',
        signature: 'asyncio.Semaphore(value=1)',
        description: 'Limits concurrent access to a resource (e.g. bounding concurrent outgoing API requests to 50).'
      },
      {
        name: 'asyncio.Queue(maxsize=0)',
        signature: 'asyncio.Queue(maxsize=0)',
        description: 'Async-aware FIFO queue for implementing producer-consumer pipelines across coroutines (like System.Threading.Channels).'
      }
    ],
    csharpExample: `// C#: Task.WhenAll and SemaphoreSlim
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public class AsyncEngine
{
    private static readonly SemaphoreSlim _throttle = new(5, 5);

    public static async Task<string> FetchWithThrottleAsync(string url, HttpClient client)
    {
        await _throttle.WaitAsync();
        try
        {
            return await client.GetStringAsync(url);
        }
        finally
        {
            _throttle.Release();
        }
    }
}`,
    pythonExample: `import asyncio
import time

async def fetch_record(record_id: int) -> dict:
    await asyncio.sleep(0.05) # Simulated async I/O socket read
    return {"id": record_id, "status": "active"}

# 1. Structured Concurrency with TaskGroup (Python 3.11+)
async def run_structured_pipeline():
    results = []
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch_record(i)) for i in range(5)]
    
    # All tasks have completed safely here
    results = [t.result() for t in tasks]
    print(f"TaskGroup finished {len(results)} tasks successfully.")

# 2. Concurrency Rate Limiting with Semaphore
async def limited_worker(sem: asyncio.Semaphore, item_id: int):
    async with sem:
        # At most 2 workers inside this block simultaneously
        await asyncio.sleep(0.02)
        return f"Processed {item_id}"

async def run_semaphore_demo():
    sem = asyncio.Semaphore(2)
    results = await asyncio.gather(*[limited_worker(sem, i) for i in range(6)])
    print(f"Semaphore processed {len(results)} items.")

# Execute event loop
async def main():
    await run_structured_pipeline()
    await run_semaphore_demo()

asyncio.run(main())`,
    productionUseCases: [
      'High-throughput web APIs handling 50,000+ concurrent connections in FastAPI / Starlette.',
      'Asynchronous web scrapers and crawlers fetching thousands of HTML pages with polite rate-limiting using Semaphore.',
      'Message broker listeners (Kafka / RabbitMQ) consuming events asynchronously via aio-pika / aiokafka.'
    ],
    pitfalls: [
      'Calling a blocking synchronous function (like `time.sleep()` or `requests.get()`) freezes the ENTIRE event loop! All concurrent tasks stall. Always use `asyncio.sleep()` or `asyncio.to_thread()`.',
      'Fire-and-forget tasks with `asyncio.create_task()` can be garbage collected mid-execution if no strong reference is retained! Store references in a set until done.',
      'Nested `asyncio.run()` calls are forbidden; calling `asyncio.run()` while an event loop is already active raises `RuntimeError: This event loop is already running`.'
    ],
    bestPractices: [
      'Use `asyncio.TaskGroup()` instead of raw `asyncio.gather()` in modern Python 3.11+ code for robust structured concurrency.',
      'Offload synchronous CPU-heavy or blocking I/O legacy code using `await asyncio.to_thread(blocking_func, arg)`.',
      'Set timeouts explicitly on external I/O using `async with asyncio.timeout(5.0):`.'
    ],
    interactiveCodeSnippet: `import asyncio

async def task_step(name: str, delay: float):
    print(f"Starting {name} (takes {delay}s)...")
    await asyncio.sleep(delay)
    print(f"Finished {name}!")
    return f"{name}_done"

async def orchestrate():
    # Run tasks concurrently
    t1 = asyncio.create_task(task_step("DB Query", 0.1))
    t2 = asyncio.create_task(task_step("Redis Cache", 0.05))
    
    res1, res2 = await asyncio.gather(t1, t2)
    print(f"Results: {res1}, {res2}")

asyncio.run(orchestrate())`,
    quiz: {
      question: 'What happens if a developer calls a synchronous blocking function like `time.sleep(10)` inside an asyncio coroutine?',
      options: [
        'The runtime spawns a background thread to handle the sleep automatically.',
        'The entire single-threaded event loop freezes for 10 seconds, stalling all other concurrent coroutines.',
        'An AsyncException is thrown immediately.',
        'The GIL releases and other coroutines take over on other CPU cores.'
      ],
      correctIndex: 1,
      explanation: 'asyncio relies on cooperative multitasking. When a thread executes synchronous blocking code, it never yields control back to the event loop, causing all concurrent tasks to freeze.'
    }
  },
  {
    id: 'multiprocessing',
    name: 'multiprocessing & concurrent.futures',
    importStatement: 'import multiprocessing as mp\nfrom concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed',
    category: 'Concurrency & Async',
    tagline: 'True multi-core CPU parallelism bypassing the GIL via OS processes and thread pools.',
    dotNetEquivalent: 'System.Threading.ThreadPool, Task.Run, and Parallel.ForEach',
    mentalModelShift: 'Because CPython has a Global Interpreter Lock (GIL), multi-threading only speeds up I/O-bound operations. For CPU-bound operations (math, image processing, ML inference), you must use multiprocessing to spawn independent OS processes with separate GIL instances.',
    cpythonInternals: 'multiprocessing spawns child processes using `fork` (Unix default), `spawn` (Windows and macOS default), or `forkserver`. Objects are serialized across process boundaries using pickle through Unix pipes or Windows named pipes. Python 3.8+ added `multiprocessing.shared_memory` which maps shared memory pages directly between processes without pickle serialization overhead.',
    keyClassesAndFunctions: [
      {
        name: 'ProcessPoolExecutor(max_workers=None)',
        signature: 'ProcessPoolExecutor(max_workers=None, mp_context=None)',
        description: 'High-level executor interface providing map() and submit() for parallel CPU-bound compute.'
      },
      {
        name: 'ThreadPoolExecutor(max_workers=None)',
        signature: 'ThreadPoolExecutor(max_workers=None, thread_name_prefix="")',
        description: 'High-level thread pool for I/O-bound operations where threads release the GIL during socket/disk waits.'
      },
      {
        name: 'mp.Queue() & mp.Pipe()',
        signature: 'mp.Queue(maxsize=0) / mp.Pipe(duplex=True)',
        description: 'Inter-process communication (IPC) channels with process-safe synchronization primitives.'
      },
      {
        name: 'multiprocessing.shared_memory.SharedMemory',
        signature: 'SharedMemory(name=None, create=False, size=0)',
        description: 'Direct zero-copy shared memory segment across separate processes for raw NumPy arrays or byte buffers.'
      }
    ],
    csharpExample: `// C#: Parallel.ForEach utilizing multi-core ThreadPool natively
using System;
using System.Linq;
using System.Threading.Tasks;

public class CpuParallel
{
    public static long[] ComputeSquares(int[] numbers)
    {
        var results = new long[numbers.Length];
        // Runs across all available CPU hardware cores
        Parallel.For(0, numbers.Length, i =>
        {
            results[i] = (long)numbers[i] * numbers[i];
        });
        return results;
    }
}`,
    pythonExample: `from concurrent.futures import ProcessPoolExecutor, as_completed
import os
import math

def cpu_heavy_hash(n: int) -> int:
    # CPU-bound computation running in an isolated OS process
    total = 0
    for i in range(1, 100_000):
        total += (i * n) % 997
    return total

if __name__ == '__main__':
    # CRITICAL: Always guard multiprocessing entry with if __name__ == '__main__'
    data = [10, 20, 30, 40, 50, 60]
    
    # ProcessPoolExecutor manages a pool of worker processes across all cores
    with ProcessPoolExecutor(max_workers=4) as executor:
        # Submit jobs and stream results as they finish
        future_to_num = {executor.submit(cpu_heavy_hash, x): x for x in data}
        
        for future in as_completed(future_to_num):
            num = future_to_num[future]
            try:
                res = future.result()
                print(f"Num {num} computed -> {res}")
            except Exception as exc:
                print(f"Error on {num}: {exc}")`,
    productionUseCases: [
      'Parallel image transformation and resizing pipelines across 32-core EC2 instances.',
      'Financial risk Monte Carlo simulations running 100,000 parallel trials across multi-core servers.',
      'Training ensemble models or running cross-validation in machine learning.'
    ],
    pitfalls: [
      'Objects passed to child processes MUST be picklable. Passing unpicklable objects (like open file handles, database connections, or lambdas) raises `PicklingError`.',
      'Forgetting `if __name__ == "__main__":` on Windows or macOS causes infinite recursive process spawning (fork bomb)!',
      'Inter-process communication has serialization and IPC latency overhead. Do not use multiprocessing for micro-tasks that take less than 1ms.'
    ],
    bestPractices: [
      'Prefer `concurrent.futures.ProcessPoolExecutor` over raw `multiprocessing.Process` for clean pool lifecycle management.',
      'Use `multiprocessing.shared_memory` when passing large NumPy arrays between processes to avoid multi-gigabyte pickle copy penalties.',
      'Choose `forkserver` or `spawn` start method explicitly on Linux if your application uses C-extensions or multi-threaded background workers.'
    ],
    interactiveCodeSnippet: `from concurrent.futures import ThreadPoolExecutor
import time

def worker(idx: int):
    # Simulated I/O task
    time.sleep(0.05)
    return f"Worker {idx} finished"

# ThreadPoolExecutor is lightweight and ideal for I/O bounds
with ThreadPoolExecutor(max_workers=3) as pool:
    results = list(pool.map(worker, range(3)))

print("Thread Pool Output:", results)`,
    quiz: {
      question: 'Why does CPU-bound parallel execution in CPython require `multiprocessing` instead of standard `threading`?',
      options: [
        'Python threads cannot access system RAM.',
        'The Global Interpreter Lock (GIL) serializes Python bytecode execution so only one thread executes Python code at any single instant.',
        'CPython does not support POSIX pthreads.',
        'The OS thread scheduler disables Python thread priorities.'
      ],
      correctIndex: 1,
      explanation: 'Due to the CPython GIL, multiple Python threads running CPU-bound code compete for the same interpreter lock, resulting in zero parallelism and often slower execution due to lock contention overhead.'
    }
  },
  {
    id: 'dataclasses',
    name: 'dataclasses & typing',
    importStatement: 'from dataclasses import dataclass, field, asdict, replace\nfrom typing import Optional, Union, Protocol, TypedDict, Literal, runtime_checkable',
    category: 'Functional & Types',
    tagline: 'Code generation for clean domain models, immutable records, and structural type systems.',
    dotNetEquivalent: 'C# 9+ record, struct, and Interface inheritance',
    mentalModelShift: 'In C#, types are strictly enforced at compile time. In Python, typing is structural (duck typing via Protocol) and validated at dev/lint time with mypy/pyright. @dataclass automatically generates __init__, __repr__, __eq__, and __hash__ with zero boilerplate.',
    cpythonInternals: 'dataclass inspects class annotations at import time and dynamically synthesizes Python bytecode methods (__init__, __repr__, etc.) attached directly to the class __dict__. Adding `slots=True` (Python 3.10+) replaces the per-instance __dict__ with compact C-level pointer slots, reducing memory footprint by ~60% and speeding up attribute access by ~20%.',
    keyClassesAndFunctions: [
      {
        name: '@dataclass(slots=True, frozen=True)',
        signature: '@dataclass(*, init=True, repr=True, eq=True, order=False, unsafe_hash=False, frozen=False, slots=False)',
        description: 'Generates rich boilerplate methods. `frozen=True` creates immutable records. `slots=True` creates memory-compact classes.'
      },
      {
        name: 'field(*, default=..., default_factory=...)',
        signature: 'field(*, default=MISSING, default_factory=MISSING, repr=True, hash=None, init=True, compare=True)',
        description: 'Customizes individual field generation. Crucial: mutable defaults (like list or dict) MUST use `default_factory=list`!'
      },
      {
        name: 'typing.Protocol (Duck Typing via Interface)',
        signature: 'class MyProtocol(Protocol):',
        description: 'Structural subtyping (static duck typing). Any class implementing the protocol methods satisfies the type without explicit inheritance!'
      },
      {
        name: 'typing.TypedDict',
        signature: 'class UserPayload(TypedDict):',
        description: 'Type hint for raw dictionaries with specific string keys and typed values (ideal for JSON payloads).'
      }
    ],
    csharpExample: `// C#: Immutable Record & Interface
using System;

public record UserDto(
    Guid Id,
    string Email,
    DateTime CreatedAt,
    bool IsActive = true
);

public interface IRepository
{
    void Save(UserDto user);
}`,
    pythonExample: `from dataclasses import dataclass, field, replace, asdict
from typing import Protocol, runtime_checkable
from datetime import datetime
import uuid

# 1. High-performance immutable domain record with slots
@dataclass(slots=True, frozen=True)
class UserRecord:
    id: uuid.UUID
    email: str
    created_at: datetime
    is_active: bool = True
    tags: list[str] = field(default_factory=list) # Safe mutable factory

# Instantiate
u1 = UserRecord(id=uuid.uuid4(), email="guido@python.org", created_at=datetime.utcnow())
print("Representation:", u1)

# Mutation is forbidden on frozen dataclasses
# u1.email = "new@python.org" -> Raises FrozenInstanceError!

# Functional non-destructive mutation (like C# 'with' expression)
u2 = replace(u1, email="anders@microsoft.com")
print("Replaced instance:", u2.email)

# 2. Structural Typing with Protocol (C# Interface without explicit inheritance)
@runtime_checkable
class Notifier(Protocol):
    def send(self, recipient: str, message: str) -> bool: ...

class SlackClient: # Note: Does NOT inherit from Notifier!
    def send(self, recipient: str, message: str) -> bool:
        print(f"[Slack] -> {recipient}: {message}")
        return True

# Structural compliance check
slack = SlackClient()
print("Does SlackClient satisfy Notifier protocol?", isinstance(slack, Notifier))`,
    productionUseCases: [
      'Clean domain entity modeling in Hexagonal / Clean Architecture applications.',
      'High-volume event processing where `@dataclass(slots=True)` saves gigabytes of RAM in telemetry workers.',
      'Decoupled interface contracts via `typing.Protocol` enabling dependency injection and effortless unit test mocking.'
    ],
    pitfalls: [
      'Never write `tags: list = []` as a field default! In Python, default values are evaluated once at class definition, sharing the same list across all instances. Always use `field(default_factory=list)`.',
      'Frozen dataclasses with mutable attributes (e.g. a frozen dataclass holding a normal list) are not truly immutable. The list contents can still be mutated.',
      'Subclassing dataclasses requires default-valued fields to only appear after non-default fields, unless kw_only=True is enabled.'
    ],
    bestPractices: [
      'Default to `@dataclass(slots=True, frozen=True)` for domain models and data transfer objects (DTOs).',
      'Use `typing.Protocol` rather than ABCs (Abstract Base Classes) when defining library interfaces to maximize interoperability.',
      'Use `dataclasses.asdict(obj)` for clean JSON serialization pipelines.'
    ],
    interactiveCodeSnippet: `from dataclasses import dataclass, field

@dataclass(slots=True)
class OrderItem:
    sku: str
    price: float
    quantity: int = 1

    @property
    def total_cost(self) -> float:
        return self.price * self.quantity

item = OrderItem(sku="BOOK-PY-01", price=49.99, quantity=3)
print(f"SKU: {item.sku}, Total: \${item.total_cost:.2f}")`,
    quiz: {
      question: 'What is the significant runtime benefit of adding `slots=True` to a Python 3.10+ `@dataclass`?',
      options: [
        'It automatically synchronizes all attribute changes to a SQLite database.',
        'It eliminates the instance `__dict__`, reducing per-object memory footprint by ~60% and speeding up attribute access.',
        'It makes the class automatically thread-safe across all GIL locks.',
        'It forces all attributes to become private.'
      ],
      correctIndex: 1,
      explanation: 'By default, every Python object stores its attributes in an internal dynamic dictionary (`__dict__`). `slots=True` allocates fixed C-level pointer slots instead, dramatically cutting memory usage and accelerating lookups.'
    }
  },
  {
    id: 'pathlib',
    name: 'pathlib & os',
    importStatement: 'from pathlib import Path\nimport os, sys, shutil',
    category: 'I/O & Filesystem',
    tagline: 'Object-oriented, cross-platform filesystem paths and file manipulation.',
    dotNetEquivalent: 'System.IO.Path, System.IO.DirectoryInfo, System.IO.FileInfo',
    mentalModelShift: 'In legacy Python and old scripts, path operations were string-based (`os.path.join()`). Pathlib introduces first-class `Path` objects where `/` is overloaded to build paths cross-platform (handling Windows backslashes and Linux forward slashes transparently).',
    cpythonInternals: 'Path instances wrap OS system calls (stat, open, unlink) through POSIX or Windows API bindings. Path objects are immutable and hashable, allowing them to be stored in sets or used as dictionary keys. In Python 3.12+, pathlib internal C acceleration handles stat caching and globbing.',
    keyClassesAndFunctions: [
      {
        name: 'Path.cwd() / Path.home()',
        signature: 'Path.cwd() / Path.home()',
        description: 'Returns Path objects representing current working directory or user home directory.'
      },
      {
        name: 'path / "subfolder" / "file.txt"',
        signature: 'Path.__truediv__(other)',
        description: 'Overloaded `/` division operator that concatenates path segments with platform-correct separators.'
      },
      {
        name: 'path.glob(pattern) / path.rglob(pattern)',
        signature: 'Path.glob(pattern) / Path.rglob(pattern)',
        description: 'Yields paths matching a glob pattern. `rglob()` searches recursively through all subdirectories.'
      },
      {
        name: 'path.read_text() / path.write_text()',
        signature: 'Path.read_text(encoding=None, errors=None)',
        description: 'Zero-boilerplate one-liners to read/write entire files with automatic resource cleanup.'
      },
      {
        name: 'path.resolve() / path.exists() / path.is_file()',
        signature: 'Path.resolve(strict=False)',
        description: 'Resolves symlinks, normalizes ".." segments, and verifies filesystem presence.'
      }
    ],
    csharpExample: `// C#: System.IO Path & FileInfo
using System;
using System.IO;

public class FileSystemOps
{
    public static void ProcessFiles(string rootDir)
    {
        string target = Path.Combine(rootDir, "configs", "app.json");
        if (File.Exists(target))
        {
            string content = File.ReadAllText(target);
            Console.WriteLine(content);
        }

        // Recursive directory search
        var files = Directory.EnumerateFiles(rootDir, "*.csv", SearchOption.AllDirectories);
    }
}`,
    pythonExample: `from pathlib import Path

# 1. Fluent path construction with overloaded '/' operator
base_dir = Path.cwd()
config_path = base_dir / "config" / "settings.json"

print("Constructed Path:", config_path)
print("Filename stem:   ", config_path.stem)    # "settings"
print("Extension:       ", config_path.suffix)  # ".json"
print("Parent dir:      ", config_path.parent)

# 2. Writing and reading text with zero boilerplate
tmp_file = Path("/tmp") / "telemetry.log" if Path("/tmp").exists() else base_dir / "telemetry.log"
tmp_file.write_text("status=healthy\\nlatency=14ms\\n", encoding="utf-8")

content = tmp_file.read_text(encoding="utf-8")
print("Read Content:\\n", content)

# 3. Recursive globbing (like FindFiles *.py)
src_dir = Path("src") if Path("src").exists() else Path.cwd()
py_files = list(src_dir.rglob("*.ts"))[:3]
print(f"Found source files: {[f.name for f in py_files]}")

# Clean up
if tmp_file.exists():
    tmp_file.unlink()`,
    productionUseCases: [
      'Locating project root anchors in Docker containers using `Path(__file__).resolve().parents[1]`.',
      'Automated batch ETL data ingest scanning incoming S3/EFS mounted folders using `Path(mount).glob("*.parquet")`.',
      'Cross-platform test fixture preparation in pytest suites using `tmp_path: Path` fixtures.'
    ],
    pitfalls: [
      'Path objects are not strings! Passing a `Path` to legacy C-extension libraries expecting `char*` could raise TypeError in Python <= 3.5. (Modern Python supports os.PathLike, but use `str(path)` if interfacing with archaic libraries).',
      '`Path.mkdir(parents=True, exist_ok=True)`: Forgetting `parents=True` or `exist_ok=True` causes FileNotFoundError or FileExistsError in concurrent multi-process environments.',
      'Always specify `encoding="utf-8"` when calling `read_text()` and `write_text()`; otherwise Python defaults to the OS locale (which might be cp1252 on Windows).'
    ],
    bestPractices: [
      'Always use `Path(__file__).resolve().parent` to anchor paths relative to the current script file, never relative to the process working directory.',
      'Always pass `encoding="utf-8"` explicitly to `read_text()` and `write_text()`.',
      'Prefer `path.is_file()` over `path.exists()` if you need to guarantee the target is not a directory.'
    ],
    interactiveCodeSnippet: `from pathlib import Path

p = Path("src/components/Navbar.tsx")
print("Path exists?       ", p.exists())
print("File name:         ", p.name)
print("Parent directory:  ", p.parent)
print("Suffix / Extension:", p.suffix)`,
    quiz: {
      question: 'What is the recommended way to reliably locate the directory containing the currently executing script in Python?',
      options: [
        'Path.cwd()',
        'Path(__file__).resolve().parent',
        'os.getenv("SCRIPT_DIR")',
        'Path("/")'
      ],
      correctIndex: 1,
      explanation: 'Path.cwd() returns the current working directory of the shell running Python, which can change depending on where the command was executed. `Path(__file__).resolve().parent` inspects the special `__file__` attribute of the script itself.'
    }
  },
  {
    id: 'contextlib',
    name: 'contextlib',
    importStatement: 'import contextlib\nfrom contextlib import contextmanager, asynccontextmanager, ExitStack, suppress, nullcontext',
    category: 'I/O & Filesystem',
    tagline: 'Utilities for the with statement, resource lifecycles, and exception shielding.',
    dotNetEquivalent: 'System.IDisposable, System.IAsyncDisposable, and using declarations',
    mentalModelShift: 'In C#, you implement IDisposable and write `using var resource = ...`. In Python, you do not need to write a class with __enter__ and __exit__; contextlib allows you to write a simple generator function with a `@contextmanager` decorator!',
    cpythonInternals: 'The `with` statement translates into SETUP_WITH and WITH_EXCEPT_START bytecode opcodes. `@contextmanager` wraps your generator: the code before `yield` executes in `__enter__`, and the code after `yield` executes in `__exit__` wrapped inside a try/finally block.',
    keyClassesAndFunctions: [
      {
        name: '@contextmanager',
        signature: '@contextmanager def my_resource(): yield',
        description: 'Turns a generator function into a context manager. Code before yield enters; code after yield cleans up.'
      },
      {
        name: '@asynccontextmanager',
        signature: '@asynccontextmanager async def my_async_res(): yield',
        description: 'Creates an async context manager (`async with`) for handling async connections and transactions.'
      },
      {
        name: 'suppress(*exceptions)',
        signature: 'suppress(*exceptions)',
        description: 'Shields against and silently ignores specified exceptions, avoiding ugly try/except pass blocks.'
      },
      {
        name: 'ExitStack() / AsyncExitStack()',
        signature: 'ExitStack() / AsyncExitStack()',
        description: 'Dynamically manages a variable number of context managers programmatically (e.g. opening N files at once).'
      },
      {
        name: 'nullcontext(enter_result=None)',
        signature: 'nullcontext(enter_result=None)',
        description: 'A no-op context manager useful as a fallback when an optional context is disabled.'
      }
    ],
    csharpExample: `// C#: IDisposable Pattern and using statement
using System;

public class DatabaseScope : IDisposable
{
    public DatabaseScope() => Console.WriteLine("Transaction BEGIN");

    public void Dispose()
    {
        Console.WriteLine("Transaction COMMIT or ROLLBACK");
    }
}

// Usage:
// using (var scope = new DatabaseScope()) { ... }`,
    pythonExample: `from contextlib import contextmanager, suppress, ExitStack
import time

# 1. Custom timing context manager in 6 lines of code!
@contextmanager
def execution_timer(label: str):
    start = time.perf_counter()
    print(f"[{label}] Starting...")
    try:
        yield start # Control passes to the 'with' block body
    finally:
        elapsed = (time.perf_counter() - start) * 1000
        print(f"[{label}] Finished in {elapsed:.2f}ms")

with execution_timer("Matrix Multiply"):
    total = sum(i * i for i in range(500_000))

# 2. suppress: Clean idiomatic removal of ignorable errors
with suppress(FileNotFoundError):
    import os
    os.remove("non_existent_cache.tmp")
    # No exception raised! Clean and readable.

# 3. ExitStack: Dynamically managing a variable number of contexts
def open_multiple_configs(paths: list[str]):
    with ExitStack() as stack:
        # Programmatically enter resources
        files = [stack.enter_context(open(p, 'w')) for p in paths]
        for f in files:
            f.write("initialized\\n")
    # All files are guaranteed cleanly closed here!`,
    productionUseCases: [
      'Database transaction boundaries in SQLAlchemy/FastAPI (`with db.begin(): ...`).',
      'Temporary environment variable or configuration overrides in integration tests.',
      'Distributed lock acquisition and renewal in Redis / etcd with automatic TTL cleanup on failure.'
    ],
    pitfalls: [
      'Inside a `@contextmanager` generator, you MUST wrap the `yield` inside a `try...finally` block; otherwise, if the caller raises an exception, the cleanup code after `yield` will NEVER execute!',
      'Using `suppress()` blindly can swallow critical bugs. Only suppress specific, expected exceptions (like `FileNotFoundError` or `KeyError`).',
      'Async context managers require `async with` and `@asynccontextmanager`; using normal `with` raises TypeError: object does not implement context manager protocol.'
    ],
    bestPractices: [
      'Always wrap the `yield` statement inside `try...finally` within `@contextmanager` to guarantee cleanup.',
      'Use `contextlib.nullcontext()` for conditional contexts (e.g. `with transaction if in_tx else nullcontext():`).',
      'Use `AsyncExitStack` when managing dynamic lists of network websockets or database connection pools.'
    ],
    interactiveCodeSnippet: `from contextlib import contextmanager

@contextmanager
def temporary_flag(store: dict, key: str, value):
    original = store.get(key)
    store[key] = value
    try:
        yield
    finally:
        if original is not None:
            store[key] = original
        else:
            store.pop(key, None)

flags = {"debug": False}
print("Before:", flags)
with temporary_flag(flags, "debug", True):
    print("Inside context:", flags)
print("After context:", flags)`,
    quiz: {
      question: 'Why is it mandatory to wrap the `yield` expression inside a `try...finally` block within a `@contextmanager` function?',
      options: [
        'Because Python bytecode requires at least three jump instructions.',
        'Because if an exception occurs inside the caller’s `with` block, any code after `yield` will not run unless shielded by `finally`.',
        'To speed up generator execution by preventing stack unwinding.',
        'To disable the Python garbage collector during context execution.'
      ],
      correctIndex: 1,
      explanation: 'When an exception occurs within the `with` block, Python re-raises that exception at the point of the `yield`. If there is no `try...finally`, the generator exits immediately without running cleanup code.'
    }
  },
  {
    id: 'sqlite3',
    name: 'sqlite3 & json',
    importStatement: 'import sqlite3\nimport json',
    category: 'Storage & Serialization',
    tagline: 'Zero-dependency embedded relational database and high-speed JSON serialization.',
    dotNetEquivalent: 'Microsoft.Data.Sqlite, System.Text.Json, and Dapper',
    mentalModelShift: 'Python includes a full, production-grade ACID relational SQL database (SQLite) built right into the standard library with zero external dependencies! Coupled with standard json, you have instant transactional persistence.',
    cpythonInternals: 'sqlite3 wraps the official SQLite C library directly, compiling SQL statements into SQLite VDBE (Virtual Database Engine) bytecode. Connections support WAL (Write-Ahead Logging) mode and in-memory databases (`:memory:`). The standard json module has a C acceleration layer (_json) providing high-throughput parsing.',
    keyClassesAndFunctions: [
      {
        name: 'sqlite3.connect(database)',
        signature: 'sqlite3.connect(database, timeout=5.0, detect_types=0, isolation_level="")',
        description: 'Opens a connection to a disk-based or in-memory (`:memory:`) SQLite database.'
      },
      {
        name: 'conn.row_factory = sqlite3.Row',
        signature: 'conn.row_factory = sqlite3.Row',
        description: 'Crucial setting: Enables dictionary-style column name access on query result rows (like Dapper/dynamic).'
      },
      {
        name: 'json.dumps() / json.loads()',
        signature: 'json.dumps(obj, *, default=None, indent=None) / json.loads(s)',
        description: 'Serializes Python data structures to JSON strings and deserializes JSON strings to Python objects.'
      },
      {
        name: 'cursor.executemany(sql, seq_of_params)',
        signature: 'cursor.executemany(sql, seq_of_parameters)',
        description: 'High-speed bulk parameterized insertion executing within a single transaction.'
      }
    ],
    csharpExample: `// C#: Microsoft.Data.Sqlite and System.Text.Json
using System;
using System.Text.Json;
using Microsoft.Data.Sqlite;

public class LocalDb
{
    public static void InsertRecord(string name, int score)
    {
        using var conn = new SqliteConnection("Data Source=:memory:");
        conn.Open();

        var cmd = conn.CreateCommand();
        cmd.CommandText = "CREATE TABLE Users (Id INTEGER PRIMARY KEY, Name TEXT, Score INT);";
        cmd.ExecuteNonQuery();

        cmd.CommandText = "INSERT INTO Users (Name, Score) VALUES ($name, $score);";
        cmd.Parameters.AddWithValue("$name", name);
        cmd.Parameters.AddWithValue("$score", score);
        cmd.ExecuteNonQuery();
    }
}`,
    pythonExample: `import sqlite3
import json

# 1. In-Memory transactional SQLite database with dictionary rows
conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row # Enable column-by-name access!

with conn:
    conn.execute("""
        CREATE TABLE audit_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL,
            payload_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

# 2. Bulk Parameterized Insertion (executemany)
events = [
    ("tenant-101", json.dumps({"action": "LOGIN", "ip": "192.168.1.1"})),
    ("tenant-102", json.dumps({"action": "DEPLOY", "app": "billing-api"})),
    ("tenant-101", json.dumps({"action": "LOGOUT", "ip": "192.168.1.1"}))
]

with conn:
    conn.executemany(
        "INSERT INTO audit_events (tenant_id, payload_json) VALUES (?, ?)",
        events
    )

# 3. Querying and parsing JSON payloads
cursor = conn.execute("SELECT tenant_id, payload_json FROM audit_events WHERE tenant_id = ?", ("tenant-101",))
for row in cursor.fetchall():
    payload = json.loads(row["payload_json"]) # Access by column name!
    print(f"Tenant {row['tenant_id']} did {payload['action']}")

conn.close()`,
    productionUseCases: [
      'Desktop and mobile edge applications (e.g. local cache for offline-first Electron / PySide apps).',
      'Fast automated test fixtures simulating relational storage without provisioning Docker PostgreSQL containers.',
      'Zero-dependency configuration caches and state stores in serverless CLI tools.'
    ],
    pitfalls: [
      'NEVER concatenate SQL strings (e.g. `f"SELECT * FROM users WHERE name = {name}"`); this causes severe SQL injection vulnerabilities. Always use parameterized queries with `?`.',
      'SQLite default mode uses a rollback journal which blocks readers during writes. In high-concurrency production, always enable WAL mode: `PRAGMA journal_mode=WAL;`.',
      'SQLite connections cannot be shared across different OS threads without setting `check_same_thread=False`.'
    ],
    bestPractices: [
      'Always set `conn.row_factory = sqlite3.Row` immediately after opening a connection.',
      'Use `with conn:` context manager for automatic COMMIT on success and ROLLBACK on exceptions.',
      'Enable WAL mode (`conn.execute("PRAGMA journal_mode=WAL;")`) for 10x higher write throughput.'
    ],
    interactiveCodeSnippet: `import sqlite3

# Quick in-memory DB test
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE metrics (name TEXT, value REAL)")
conn.execute("INSERT INTO metrics VALUES (?, ?)", ("cpu_usage", 42.8))
conn.commit()

val = conn.execute("SELECT value FROM metrics WHERE name = 'cpu_usage'").fetchone()[0]
print("Retrieved metric:", val)`,
    quiz: {
      question: 'Why should you configure `conn.row_factory = sqlite3.Row` on SQLite connections?',
      options: [
        'It compresses database pages on disk.',
        'It enables accessing query result columns by column name (e.g. row["email"]) in addition to integer indexes.',
        'It bypasses the CPython GIL during database reads.',
        'It turns SQLite into a NoSQL document database.'
      ],
      correctIndex: 1,
      explanation: 'By default, sqlite3 queries return raw tuples (`row[0]`, `row[1]`). Setting `row_factory = sqlite3.Row` enables dictionary-like column name access (`row["username"]`), making code vastly more maintainable.'
    }
  },
  {
    id: 'inspect-dis',
    name: 'inspect & dis',
    importStatement: 'import inspect\nimport dis',
    category: 'Reflection & Tooling',
    tagline: 'Runtime reflection, call stack analysis, live AST inspection, and bytecode disassembly.',
    dotNetEquivalent: 'System.Reflection, MethodBase, StackTrace, and ILGenerator / ILSpy',
    mentalModelShift: 'In C#, reflection is a heavy, structured subsystem (`typeof(T).GetMethods()`). In Python, everything is a live mutable object with accessible `__dict__` and `__code__` attributes. inspect and dis let you disassemble CPython bytecode opcodes and inspect stack frames on the fly.',
    cpythonInternals: 'Every Python function contains a `__code__` attribute holding a PyCodeObject. Inside sits `co_code` (raw bytecode bytes), `co_varnames` (local variables), `co_consts` (literals), and `co_flags`. `dis.dis()` parses these bytecode opcodes (LOAD_FAST, BINARY_OP, RETURN_VALUE) into human-readable assembly.',
    keyClassesAndFunctions: [
      {
        name: 'inspect.signature(callable)',
        signature: 'inspect.signature(callable, *, follow_wrapped=True)',
        description: 'Extracts parameter names, default values, and type annotations from any function, class, or method (used by FastAPI/Pydantic).'
      },
      {
        name: 'inspect.currentframe() / inspect.stack()',
        signature: 'inspect.currentframe() / inspect.stack(context=1)',
        description: 'Inspects caller call stack frames, variable states, and line numbers.'
      },
      {
        name: 'dis.dis(x)',
        signature: 'dis.dis(x=None, *, file=None, depth=None)',
        description: 'Disassembles Python functions, classes, or code strings into CPython bytecode instructions.'
      },
      {
        name: 'inspect.getsource(object)',
        signature: 'inspect.getsource(object)',
        description: 'Returns the raw Python source code string of a live running function or class!'
      }
    ],
    csharpExample: `// C#: Reflection via System.Reflection
using System;
using System.Reflection;

public class ReflectionDemo
{
    public static void InspectMethod(MethodInfo method)
    {
        Console.WriteLine($"Method: {method.Name}");
        foreach (var param in method.GetParameters())
        {
            Console.WriteLine($"  Param: {param.Name} ({param.ParameterType})");
        }
    }
}`,
    pythonExample: `import inspect
import dis

# 1. Reflection & Dependency Injection (How FastAPI works under the hood!)
def process_order(user_id: int, auth_token: str, dry_run: bool = False) -> dict:
    """Processes an order transaction."""
    return {"user": user_id, "dry_run": dry_run}

sig = inspect.signature(process_order)
print("Function Signature:", sig)
for param_name, param in sig.parameters.items():
    print(f"  Param: {param_name:10} | Type: {param.annotation} | Default: {param.default}")

# 2. Bytecode Disassembly with dis
def add_numbers(a, b):
    return a + b

print("\\nDisassembly of add_numbers:")
dis.dis(add_numbers)

# 3. Stack Frame Inspection (Debugging / Telemetry)
def inner_worker():
    caller_frame = inspect.currentframe().f_back
    caller_function_name = caller_frame.f_code.co_name
    print(f"I was invoked by function: '{caller_function_name}'")

def caller_service():
    inner_worker()

caller_service()`,
    productionUseCases: [
      'Building custom dependency injection containers and RPC routing engines (like FastAPI and Typer).',
      'Performance profiling and algorithmic optimization by comparing opcode count across implementations.',
      'Automatic test discovery and fixture injection in pytest and unittest.'
    ],
    pitfalls: [
      '`inspect.stack()` reconstructs entire stack frames and reads disk source lines, which is computationally expensive! Never call `inspect.stack()` inside tight production loops.',
      'Bytecode opcodes change between Python minor versions (e.g. Python 3.10 vs 3.11 vs 3.12). Never write code that relies on hardcoded opcode integer values.',
      'Functions defined dynamically or compiled in C extensions may not have accessible source code for `inspect.getsource()`.'
    ],
    bestPractices: [
      'Use `inspect.signature` with `follow_wrapped=True` to inspect functions decorated with `@wraps`.',
      'Use `dis.dis()` to verify whether an operation executes in a single atomic CPython opcode (thread-safe) or multiple opcodes.',
      'Avoid inspecting private `__code__` attributes directly; prefer high-level helpers in the `inspect` module.'
    ],
    interactiveCodeSnippet: `import dis

def loop_comp():
    return [x * 2 for x in range(5)]

print("Bytecode for list comprehension:")
dis.dis(loop_comp)`,
    quiz: {
      question: 'How do modern Python frameworks like FastAPI know which HTTP headers and query params to inject into endpoint functions?',
      options: [
        'They compile Python code to WebAssembly.',
        'They use `inspect.signature()` to analyze parameter names, default values, and type annotations at application boot time.',
        'They read hardcoded configuration files from disk.',
        'They invoke the C# Roslyn compiler.'
      ],
      correctIndex: 1,
      explanation: 'FastAPI uses `inspect.signature(endpoint_func)` to introspect parameter names and type annotations, mapping them to query parameters, headers, or request bodies dynamically.'
    }
  },
  {
    id: 're',
    name: 're',
    importStatement: 'import re',
    category: 'Storage & Serialization',
    tagline: 'High-performance regular expressions, named capture groups, and streaming text scanning.',
    dotNetEquivalent: 'System.Text.RegularExpressions.Regex',
    mentalModelShift: 'In C#, Regex options are set via `RegexOptions.Compiled`. In Python, you pre-compile patterns with `re.compile()`, use verbose mode `re.VERBOSE` to document complex regexes, and use named capture groups `(?P<name>...)` for self-documenting parsing.',
    cpythonInternals: 'CPython uses the SRE engine (written in C in Modules/_sre.c). The compiled pattern creates a sequence of SRE opcodes. In modern Python, the engine caches the last 512 regex strings internally, but explicit `re.compile()` remains best practice for production hot paths.',
    keyClassesAndFunctions: [
      {
        name: 're.compile(pattern, flags=0)',
        signature: 're.compile(pattern, flags=0)',
        description: 'Compiles a regex pattern into a reusable Pattern object for high-speed execution.'
      },
      {
        name: 'pattern.search(string) / pattern.match(string)',
        signature: 'pattern.search(string) / pattern.match(string)',
        description: 'search() scans throughout the entire string; match() checks strictly at the start of the string.'
      },
      {
        name: 'pattern.finditer(string)',
        signature: 'pattern.finditer(string)',
        description: 'Yields match objects lazily over the entire string without allocating a list of all matches into memory.'
      },
      {
        name: 're.VERBOSE / re.X',
        signature: 'flags=re.VERBOSE',
        description: 'Allows writing regexes formatted across multiple lines with whitespace and comments for maximum readability.'
      }
    ],
    csharpExample: `// C#: System.Text.RegularExpressions with Named Groups
using System;
using System.Text.RegularExpressions;

public class RegexParser
{
    private static readonly Regex LogRegex = new(
        @"^(?<date>\\d{4}-\\d{2}-\\d{2})\\s+\\[(?<level>\\w+)\\]\\s+(?<msg>.*)$",
        RegexOptions.Compiled
    );

    public static void ParseLog(string logLine)
    {
        var match = LogRegex.Match(logLine);
        if (match.Success)
        {
            Console.WriteLine($"Level: {match.Groups["level"].Value}");
        }
    }
}`,
    pythonExample: `import re

# 1. Clean, documented Regex with re.VERBOSE and Named Groups (?P<name>...)
LOG_PATTERN = re.compile(r"""
    ^
    (?P<timestamp>\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}) # ISO Timestamp
    \\s+
    \\[(?P<level>DEBUG|INFO|WARN|ERROR)\\]                      # Log Severity
    \\s+
    (?P<message>.*)                                            # Log Message
    $
""", re.VERBOSE)

log_entry = "2026-09-11 10:45:00 [ERROR] Connection refused to database primary"
match = LOG_PATTERN.search(log_entry)

if match:
    # Access groups as a dictionary directly!
    parsed = match.groupdict()
    print("Parsed Log:", parsed)
    print("Severity:", match.group("level"))

# 2. finditer: Lazy memory-efficient scanning
text = "Contact sales@python.org or support@company.com for inquiries."
email_pattern = re.compile(r'[\\w\\.-]+@[\\w\\.-]+\\.\\w+')

for email_match in email_pattern.finditer(text):
    print(f"Found email: {email_match.group()} at index {email_match.span()}")`,
    productionUseCases: [
      'Log parser agents in Kubernetes ELK / Promtail ingest pipelines.',
      'Data sanitation and regex routing in API request validators.',
      'Text tokenization and prompt sanitization in LLM pipelines.'
    ],
    pitfalls: [
      'Always use raw strings (`r"\\d+"`) when writing regexes in Python; otherwise Python will interpret backslashes as string escape sequences (e.g. `\\b` as backspace).',
      'Beware of catastrophic backtracking (ReDoS) with nested quantifiers (e.g. `(a+)+$`).',
      'Remember that `pattern.match()` anchors at the beginning of the string; use `pattern.search()` if the pattern can occur anywhere.'
    ],
    bestPractices: [
      'Always write complex regexes using `re.VERBOSE` flag to allow multi-line indentation and comments.',
      'Use `finditer()` instead of `findall()` when processing large files to avoid multi-megabyte list allocations.',
      'Use named groups `(?P<name>...)` and `.groupdict()` for clean dictionary conversion.'
    ],
    interactiveCodeSnippet: `import re

# Extract key-value pairs
text = "host=localhost port=5432 user=admin ssl=true"
kv_pattern = re.compile(r'(?P<key>\\w+)=(?P<val>\\w+)')

config = {m.group('key'): m.group('val') for m in kv_pattern.finditer(text)}
print("Extracted Config Dictionary:", config)`,
    quiz: {
      question: 'What is the syntax for defining a named capture group in Python regular expressions?',
      options: [
        '(?<name>pattern)',
        '(?P<name>pattern)',
        '(:name pattern)',
        '[%name:pattern%]'
      ],
      correctIndex: 1,
      explanation: 'Python uses the `(?P<name>pattern)` syntax for named capture groups, which allows accessing captured values via `match.group("name")` or `match.groupdict()`.'
    }
  },
  {
    id: 'logging-argparse',
    name: 'logging & argparse',
    importStatement: 'import logging\nimport argparse',
    category: 'Reflection & Tooling',
    tagline: 'Production-grade diagnostic telemetry, structured logging, and CLI argument parsing.',
    dotNetEquivalent: 'Microsoft.Extensions.Logging (ILogger), Serilog, and System.CommandLine',
    mentalModelShift: 'In C#, you configure dependency-injected ILogger instances. In Python, logging is a hierarchical tree where logger names match module names (`logging.getLogger(__name__)`), bubbling up events to root handlers.',
    cpythonInternals: 'The logging module maintains a singleton Manager hierarchy. Each logger delegates records up to its parent unless `propagate = False`. Log records are represented by LogRecord objects containing thread ID, timestamp, line number, and process ID.',
    keyClassesAndFunctions: [
      {
        name: 'logging.getLogger(__name__)',
        signature: 'logging.getLogger(name=None)',
        description: 'Returns a logger configured in the hierarchy corresponding to the dot-separated module path.'
      },
      {
        name: 'logging.basicConfig(**kwargs)',
        signature: 'logging.basicConfig(level=INFO, format=..., handlers=...)',
        description: 'One-time configuration setup for root logging handlers, formatters, and severity thresholds.'
      },
      {
        name: 'argparse.ArgumentParser(description=...)',
        signature: 'ArgumentParser(prog=None, usage=None, description=None)',
        description: 'Creates a full CLI parser with automatic --help, type validation, and flag support.'
      },
      {
        name: 'parser.add_argument(name, type=..., default=...)',
        signature: 'add_argument(*args, action=..., nargs=..., default=..., type=...)',
        description: 'Registers CLI arguments with automatic type casting and choice validation.'
      }
    ],
    csharpExample: `// C#: ILogger and System.CommandLine
using System;
using Microsoft.Extensions.Logging;

public class ServiceWorker
{
    private readonly ILogger<ServiceWorker> _logger;

    public ServiceWorker(ILogger<ServiceWorker> logger)
    {
        _logger = logger;
    }

    public void Run()
    {
        _logger.LogInformation("Job started at {Time}", DateTime.UtcNow);
    }
}`,
    pythonExample: `import logging
import argparse
import sys

# 1. Professional Logging Architecture
# Configure root formatter with ISO timestamps and module names
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s (line %(lineno)d): %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Standard practice: Name logger after current module
logger = logging.getLogger("payments.gateway")

logger.info("Initializing Stripe API client...")
logger.warning("Secondary webhook endpoint responded with high latency (>400ms)")

# 2. Production CLI Parser with argparse
def build_cli_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Production Data Migrator CLI",
        epilog="Example: python cli.py --env prod --batch-size 500"
    )
    parser.add_argument("--env", choices=["dev", "staging", "prod"], default="dev", help="Target environment")
    parser.add_argument("--batch-size", type=int, default=100, help="Number of records per batch")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without writing changes")
    return parser

# Test parser
parser = build_cli_parser()
args = parser.parse_args(["--env", "prod", "--batch-size", "250", "--dry-run"])
print(f"Parsed CLI Args: env={args.env}, batch={args.batch_size}, dry_run={args.dry_run}")`,
    productionUseCases: [
      'Structured JSON logging in Kubernetes clusters parsed by Datadog or FluentBit.',
      'Building professional CLI developer tools and devops deployment scripts.',
      'Audit logging of critical security events with custom logging Filters.'
    ],
    pitfalls: [
      'Never use `logging.info()` at module import level before `basicConfig()` or logging configuration is initialized; this defaults to a basic stderr logger that cannot be reconfigured easily.',
      'Never interpolate strings into loggers (e.g. `logger.info(f"User {uid}")`); pass arguments as parameters (`logger.info("User %s", uid)`) so formatting is deferred until after the log level filter checks.',
      'Forgetting `if __name__ == "__main__":` when calling `parser.parse_args()` in scripts imported as modules.'
    ],
    bestPractices: [
      'Always instantiate loggers using `logger = logging.getLogger(__name__)`.',
      'Use lazy formatting (`logger.info("Processed %d records", count)`) rather than f-strings to avoid string interpolation overhead on suppressed log levels.',
      'Use `structlog` or `python-json-logger` when deploying to enterprise cloud log collectors.'
    ],
    interactiveCodeSnippet: `import logging

# Set up logger
logger = logging.getLogger("Telemetry")
logger.setLevel(logging.INFO)

# Test logging
print("Testing logger dispatch:")
logger.info("System healthy, 0 errors reported")`,
    quiz: {
      question: 'Why should you prefer `logger.info("User %s logged in", username)` over `logger.info(f"User {username} logged in")`?',
      options: [
        'Because f-strings are forbidden in Python 3.12.',
        'Because lazy `%s` formatting avoids building the formatted string if the logger’s level is set to WARNING or higher (saving CPU cycles).',
        'Because `%s` automatically encrypts the string.',
        'Because `%s` bypasses the GIL.'
      ],
      correctIndex: 1,
      explanation: 'If the log level is filtered out (e.g. INFO is ignored because level is set to WARNING), an f-string still evaluates string concatenation and interpolation immediately. Passing `%s` arguments allows the logger to discard the call before doing any string work.'
    }
  },
  {
    id: 'decimal-math',
    name: 'decimal & math',
    importStatement: 'from decimal import Decimal, getcontext, ROUND_HALF_UP\nimport math, statistics',
    category: 'Numerics & Science',
    tagline: 'Exact arbitrary-precision decimal arithmetic for finance, and advanced mathematics.',
    dotNetEquivalent: 'System.Decimal, System.Math, and MathNet.Numerics',
    mentalModelShift: 'Standard binary floating-point (`0.1 + 0.2 == 0.30000000000000004`) causes devastating rounding bugs in finance. In C#, `decimal` is a 128-bit IEEE 754 type. In Python, `Decimal` supports user-configurable precision (e.g. 50 digits) and strict rounding modes.',
    cpythonInternals: 'Python decimal module is backed by `_decimal` (written in C using the libmpdec C library). It executes arbitrary-precision decimal calculations with C-level speed while allowing runtime modification of decimal contexts, precision limits, and exception traps.',
    keyClassesAndFunctions: [
      {
        name: 'Decimal("0.1")',
        signature: 'Decimal(value="0")',
        description: 'Constructs an exact decimal. Crucial: ALWAYS pass string literals (e.g. `Decimal("0.1")`), NEVER float literals!'
      },
      {
        name: 'getcontext().prec = 30',
        signature: 'getcontext().prec = 28',
        description: 'Sets global calculation precision in decimal digits for all arithmetic operations.'
      },
      {
        name: 'd.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)',
        signature: 'Decimal.quantize(exp, rounding=None)',
        description: 'Rounds a decimal to a specific decimal exponent (e.g. two decimal places for currency).'
      },
      {
        name: 'math.isclose(a, b, *, rel_tol=1e-09)',
        signature: 'math.isclose(a, b, *, rel_tol=1e-09, abs_tol=0.0)',
        description: 'Safe floating point equality comparison taking tolerance into account.'
      }
    ],
    csharpExample: `// C#: System.Decimal for Financial Precision
using System;

public class FinancialMath
{
    public static decimal CalculateTax(decimal amount, decimal taxRate)
    {
        // Exact decimal arithmetic
        decimal tax = amount * taxRate;
        return Math.Round(tax, 2, MidpointRounding.AwayFromZero);
    }
}`,
    pythonExample: `from decimal import Decimal, getcontext, ROUND_HALF_UP
import math

# 1. Float Trap vs Decimal Accuracy
f_sum = 0.1 + 0.2
print(f"Standard Float: 0.1 + 0.2 = {f_sum}") # 0.30000000000000004
print("Float Equality (0.1 + 0.2 == 0.3):", f_sum == 0.3) # False!

# 2. Decimal: Exact Financial Calculation
# ALWAYS instantiate Decimals with STRINGS, not floats!
d1 = Decimal("0.1")
d2 = Decimal("0.2")
d_sum = d1 + d2
print(f"Decimal Sum:    {d1} + {d2} = {d_sum}") # 0.3
print("Decimal Equality:", d_sum == Decimal("0.3")) # True!

# 3. Currency Quantization & Rounding
price = Decimal("199.995")
# Round to 2 decimal places using standard banker's or half-up rounding
cents = price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
print(f"Quantized Price: \${cents}") # 200.00

# 4. math.isclose for Safe Scientific Floats
x = 0.1 + 0.2
y = 0.3
print("math.isclose(x, y):", math.isclose(x, y)) # True!`,
    productionUseCases: [
      'High-frequency trading (HFT) risk calculations, order sizing, and pricing engines.',
      'E-commerce shopping carts, VAT/GST tax calculation, and payment gateway settlements.',
      'Scientific telemetry comparisons where sensor noise requires floating-point tolerances.'
    ],
    pitfalls: [
      'NEVER do `Decimal(0.1)`! Passing a float to `Decimal` captures the float’s already-corrupted binary representation (`0.1000000000000000055511151231...`). Always use string quotes: `Decimal("0.1")`.',
      'Do not mix `Decimal` and standard `float` in math operations (e.g. `Decimal("1.5") + 2.5`); Python will raise a `TypeError` to protect you from silent precision degradation.',
      'Setting `getcontext().prec` affects arithmetic operations, NOT the digits stored during construction.'
    ],
    bestPractices: [
      'Always instantiate Decimals from strings or integer pennies/cents.',
      'Use `Decimal.quantize()` explicitly whenever formatting money for API responses or database storage.',
      'Use `math.isclose()` whenever comparing float variables in unit tests.'
    ],
    interactiveCodeSnippet: `from decimal import Decimal, ROUND_HALF_UP

amount = Decimal("49.95")
tax_rate = Decimal("0.0825") # 8.25% sales tax

tax = (amount * tax_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
total = amount + tax

print(f"Subtotal: \${amount}")
print(f"Tax:      \${tax}")
print(f"Total:    \${total}")`,
    quiz: {
      question: 'Why does executing `d = Decimal(0.1)` violate Python financial best practices?',
      options: [
        'Because 0.1 is converted to integer 0.',
        'Because passing a float literal captures the float’s existing binary floating-point inaccuracy into the Decimal.',
        'Because Decimal cannot handle numbers smaller than 1.',
        'Because it raises an ImmediateOverflowError.'
      ],
      correctIndex: 1,
      explanation: 'Float literal 0.1 is already imprecise in binary IEEE 754 floating point before Decimal receives it. Passing `"0.1"` as a string ensures exact decimal parsing.'
    }
  }
];
