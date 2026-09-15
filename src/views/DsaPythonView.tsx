import React, { useState } from 'react';
import { Binary, Cpu, Table, Zap, CheckCircle2, Play, Info } from 'lucide-react';
import { MermaidViewer } from '../components/MermaidViewer';

interface DsaPythonViewProps {
  onOpenSandboxWithCode?: (code: string) => void;
}

export const DsaPythonView: React.FC<DsaPythonViewProps> = ({
  onOpenSandboxWithCode
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'arrays' | 'maps' | 'heaps' | 'graphs' | 'patterns'>('arrays');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunInSandbox = (snippetCode: string) => {
    if (onOpenSandboxWithCode) {
      onOpenSandboxWithCode(snippetCode);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-8 lg:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 mb-4">
            <Binary className="h-3.5 w-3.5" />
            <span>Chapter 16: Systems-Level Algorithms & Collections</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Data Structures &amp; Algorithms in Python
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-3xl">
            A systems-level pedagogical guide for C# architects. Discover how Python&apos;s dynamic runtime, object layout, compact hash tables, and standard library modules compare with .NET&apos;s <code className="text-amber-300 font-mono">System.Collections.Generic</code>, value types, and cache-locality invariants.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Array Growth</span>
              <span className="text-lg font-bold text-amber-400 font-mono mt-1 block">~1.125x vs 2.0x</span>
              <span className="text-[10px] text-slate-500">CPython over-allocation</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Hash Tables</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">Compact (PEP 468)</span>
              <span className="text-[10px] text-slate-500">Deterministic insertion order</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Heap Invariant</span>
              <span className="text-lg font-bold text-blue-400 font-mono mt-1 block">heapq (In-Place)</span>
              <span className="text-[10px] text-slate-500">Zero node overhead</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Zero-Copy Slicing</span>
              <span className="text-lg font-bold text-purple-400 font-mono mt-1 block">memoryview</span>
              <span className="text-[10px] text-slate-500">Python&apos;s Span&lt;T&gt; equivalent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Memory Topography Comparison */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">1. Memory Topography: Value Types vs. PyObject Pointers</h2>
            <p className="text-xs text-slate-400">Understanding why raw algorithmic loops behave differently in CPython vs. the CLR</p>
          </div>
        </div>

        <div className="text-sm text-slate-300 leading-relaxed space-y-4">
          <p>
            In C#, when you instantiate <code className="text-amber-300 font-mono">int[] arr = new int[4];</code>, the runtime allocates a single contiguous block of 16 bytes of unboxed primitive data on the heap. Accessing <code className="text-amber-300 font-mono">arr[i]</code> loads the cache line directly into CPU L1 cache, allowing SIMD auto-vectorization.
          </p>
          <p>
            In CPython, <code className="text-amber-300 font-mono">arr = [1, 2, 3, 4]</code> allocates a dynamic array of pointers (<code className="text-amber-300 font-mono">PyObject** ob_item</code>). Each element is an address pointing to a full 28-byte <code className="text-amber-300 font-mono">PyLongObject</code> (containing reference count, type pointer, and digit array). This pointer indirection produces CPU cache misses during algorithmic traversals.
          </p>
        </div>

        {/* Visual Mermaid Architecture Diagram */}
        <div className="pt-2">
          <MermaidViewer
            id="dsa-memory-topography-diagram"
            title="Memory Layout: C# Contiguous Value Buffer vs. Python Pointer Indirection"
            chart={`flowchart TD
  subgraph CSharp_Memory["C# int[] Memory Layout (Contiguous)"]
    direction LR
    CS_Header["Object Header + MethodTable (16B)"] --> CS_Len["Length: 4 (4B)"]
    CS_Len --> CS_E0["Val: 10 (4B)"]
    CS_E0 --> CS_E1["Val: 20 (4B)"]
    CS_E1 --> CS_E2["Val: 30 (4B)"]
    CS_E2 --> CS_E3["Val: 40 (4B)"]
  end

  subgraph Python_Memory["CPython list Memory Layout (Pointer Array)"]
    direction TB
    Py_List["PyListObject: ob_refcnt + ob_type + ob_size"] --> Py_Ptrs["ob_item (Array of 64-bit Pointers)"]
    Py_Ptrs --> P0["*ptr_0"]
    Py_Ptrs --> P1["*ptr_1"]
    Py_Ptrs --> P2["*ptr_2"]
    Py_Ptrs --> P3["*ptr_3"]

    P0 -.-> O0["PyLongObject: 10 (28 Bytes on Heap)"]
    P1 -.-> O1["PyLongObject: 20 (28 Bytes on Heap)"]
    P2 -.-> O2["PyLongObject: 30 (28 Bytes on Heap)"]
    P3 -.-> O3["PyLongObject: 40 (28 Bytes on Heap)"]
  end`}
          />
        </div>
      </section>

      {/* Comprehensive Rosetta Matrix for Collections */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Table className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">2. Complete Collections Rosetta Matrix</h2>
            <p className="text-xs text-slate-400">Direct equivalencies, operations, and amortized Big-O guarantees</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300">
                <th className="p-3.5 font-bold uppercase tracking-wider">Abstract Concept</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-blue-400">C# .NET Generic</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-amber-400">Python Type / Module</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Access / Lookup</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Insert / Append</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Delete / Pop</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Architectural Nuance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/30">
                <td className="p-3.5 font-semibold text-white">Dynamic Array</td>
                <td className="p-3.5 font-mono text-blue-300">List&lt;T&gt;</td>
                <td className="p-3.5 font-mono text-amber-300">list</td>
                <td className="p-3.5 font-mono">O(1)</td>
                <td className="p-3.5 font-mono">O(1) amortized</td>
                <td className="p-3.5 font-mono">pop(): O(1) / pop(0): O(n)</td>
                <td className="p-3.5 text-slate-400">C# doubles capacity (2x); Python allocates ~1.125x + 6 elements.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-3.5 font-semibold text-white">Compact Hash Map</td>
                <td className="p-3.5 font-mono text-blue-300">Dictionary&lt;K, V&gt;</td>
                <td className="p-3.5 font-mono text-amber-300">dict</td>
                <td className="p-3.5 font-mono">O(1) avg</td>
                <td className="p-3.5 font-mono">O(1) avg</td>
                <td className="p-3.5 font-mono">O(1) avg</td>
                <td className="p-3.5 text-slate-400">Python compact dict guarantees insertion order since 3.7 (PEP 468).</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-3.5 font-semibold text-white">Hash Set</td>
                <td className="p-3.5 font-mono text-blue-300">HashSet&lt;T&gt;</td>
                <td className="p-3.5 font-mono text-amber-300">set / frozenset</td>
                <td className="p-3.5 font-mono">O(1) avg (contains)</td>
                <td className="p-3.5 font-mono">O(1) avg</td>
                <td className="p-3.5 font-mono">O(1) avg</td>
                <td className="p-3.5 text-slate-400">Python supports syntactic set algebra: |, &amp;, -, ^ operators.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-3.5 font-semibold text-white">Double-Ended Queue</td>
                <td className="p-3.5 font-mono text-blue-300">Queue&lt;T&gt; / LinkedList&lt;T&gt;</td>
                <td className="p-3.5 font-mono text-amber-300">collections.deque</td>
                <td className="p-3.5 font-mono">O(n) for middle</td>
                <td className="p-3.5 font-mono">O(1) both ends</td>
                <td className="p-3.5 font-mono">O(1) both ends</td>
                <td className="p-3.5 text-slate-400">Block-linked chunks of 64 items. Thread-safe pops/appends in GIL.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-3.5 font-semibold text-white">Binary Min-Heap</td>
                <td className="p-3.5 font-mono text-blue-300">PriorityQueue&lt;E, P&gt;</td>
                <td className="p-3.5 font-mono text-amber-300">heapq (module)</td>
                <td className="p-3.5 font-mono">O(1) for min (h[0])</td>
                <td className="p-3.5 font-mono">O(log n) heappush</td>
                <td className="p-3.5 font-mono">O(log n) heappop</td>
                <td className="p-3.5 text-slate-400">Functions operate in-place over standard list. heapify() is O(n).</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-3.5 font-semibold text-white">Binary Search</td>
                <td className="p-3.5 font-mono text-blue-300">Array.BinarySearch</td>
                <td className="p-3.5 font-mono text-amber-300">bisect (module)</td>
                <td className="p-3.5 font-mono">O(log n) search</td>
                <td className="p-3.5 font-mono">O(n) insort (shift)</td>
                <td className="p-3.5 font-mono">N/A</td>
                <td className="p-3.5 text-slate-400">bisect_left &amp; bisect_right handle duplicate boundary searches cleanly.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-3.5 font-semibold text-white">Contiguous Buffer</td>
                <td className="p-3.5 font-mono text-blue-300">Span&lt;T&gt; / Memory&lt;T&gt;</td>
                <td className="p-3.5 font-mono text-amber-300">memoryview / array.array</td>
                <td className="p-3.5 font-mono">O(1) unboxed</td>
                <td className="p-3.5 font-mono">O(1) append</td>
                <td className="p-3.5 font-mono">O(1)</td>
                <td className="p-3.5 text-slate-400">Zero-copy slicing over C-buffers without creating heap copies.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Tabs: Deep Dives & Practical Rosetta Code */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">3. Data Structures in Action: Python vs C# Rosetta Implementations</h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['arrays', 'maps', 'heaps', 'graphs', 'patterns'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'arrays' && 'Arrays & Slicing'}
                {tab === 'maps' && 'Compact Maps & Counters'}
                {tab === 'heaps' && 'Heaps & Deques'}
                {tab === 'graphs' && 'Trees & Graphs'}
                {tab === 'patterns' && 'Algorithm Patterns'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Arrays & Slicing */}
        {activeTab === 'arrays' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">C# .NET Span&lt;T&gt; &amp; List&lt;T&gt;</span>
                <span className="text-[10px] text-slate-500 font-mono">Zero-Copy vs Reallocation</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-blue-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`// C#: Span<T> provides a zero-allocation window
int[] data = { 10, 20, 30, 40, 50 };

// Slicing produces a ref struct (no heap allocation)
ReadOnlySpan<int> slice = data.AsSpan().Slice(1, 3);
// slice contains [20, 30, 40]

// List<T> growth: Doubles capacity when full
List<int> list = new(capacity: 4);
list.Add(1); list.Add(2); list.Add(3); list.Add(4);
list.Add(5); // Capacity jumps from 4 -> 8`}
              </pre>
              <p className="text-xs text-slate-400 leading-relaxed">
                In .NET, <code className="text-blue-300 font-mono">ReadOnlySpan&lt;T&gt;</code> allows sub-slice operations with zero allocations by referencing interior stack/heap memory.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">Python list Slicing &amp; memoryview</span>
                <button
                  onClick={() => handleRunInSandbox(`import sys

# 1. CPython dynamic array over-allocation formula
numbers = []
print("Growth step visualization:")
for i in range(12):
    numbers.append(i)
    print(f"Items: {len(numbers):2d} | Bytes: {sys.getsizeof(numbers):3d}")

# 2. Slicing creates a NEW list copy
original = [10, 20, 30, 40, 50]
copied_slice = original[1:4]
copied_slice[0] = 999
print("\\nOriginal remains untouched:", original)
print("Copied slice modified:    ", copied_slice)

# 3. memoryview: Zero-copy slicing on byte buffers (like Span<T>)
buffer = bytearray(b"Hello Polyglot World")
view = memoryview(buffer)[6:14]
print("\\nZero-copy memoryview:      ", bytes(view).decode())`)}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 transition-colors"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Test in Sandbox
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`# Python: Slicing allocates a BRAND NEW list: O(k)
original = [10, 20, 30, 40, 50]
copy_slice = original[1:4] # Allocates new list [20, 30, 40]

# For zero-copy slicing on byte buffers: use memoryview
raw_data = bytearray(b"HIGH_FREQUENCY_DATA")
view = memoryview(raw_data)[0:4] # O(1) zero-copy buffer`}
              </pre>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Architectural Warning:</strong> Writing <code className="text-amber-300 font-mono">for sub in arr[i:j]:</code> in tight loops allocates new lists on every iteration! Prefer <code className="text-amber-300 font-mono">itertools.islice</code> or index math.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Maps & Counters */}
        {activeTab === 'maps' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">C# Dictionary &amp; LINQ GroupBy</span>
                <span className="text-[10px] text-slate-500 font-mono">Bucket Chaining</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-blue-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`// C#: Dictionary requires GetValueOrDefault or TryGetValue
var counts = new Dictionary<string, int>();
string[] words = { "csharp", "python", "csharp", "rust" };

foreach (var w in words) {
    counts[w] = counts.GetValueOrDefault(w, 0) + 1;
}

// Or via LINQ GroupBy (causes multiple allocations):
var wordStats = words.GroupBy(w => w)
                     .ToDictionary(g => g.Key, g => g.Count());`}
              </pre>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">Python Counter &amp; Compact dict</span>
                <button
                  onClick={() => handleRunInSandbox(`from collections import Counter, defaultdict

words = ["csharp", "python", "csharp", "rust", "python", "csharp"]

# 1. Counter: O(n) multi-set frequency map
freq = Counter(words)
print("Frequencies:   ", freq)
print("Top 2 elements:", freq.most_common(2))

# 2. defaultdict: Eliminates key existence checking
grouping = defaultdict(list)
grouping["backend"].append("FastAPI")
grouping["backend"].append("ASP.NET Core")
print("\\nGrouping via defaultdict:", dict(grouping))`)}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 transition-colors"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Test in Sandbox
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`from collections import Counter, defaultdict

# Frequency multiset in a single O(n) line:
freq = Counter(["csharp", "python", "csharp", "rust"])
top_item = freq.most_common(1) # [('csharp', 2)]

# defaultdict for adjacency lists without KeyError:
graph = defaultdict(list)
graph["node_A"].append("node_B")`}
              </pre>
              <p className="text-xs text-slate-400 leading-relaxed">
                Python&apos;s <code className="text-amber-300 font-mono">Counter</code> implements multiset algebra: you can add (<code className="text-amber-300 font-mono">c1 + c2</code>), subtract, and find intersections (<code className="text-amber-300 font-mono">c1 &amp; c2</code>) directly!
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Heaps & Deques */}
        {activeTab === 'heaps' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">C# PriorityQueue&lt;T, P&gt; (.NET 6+)</span>
                <span className="text-[10px] text-slate-500 font-mono">Separate Class</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-blue-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`// C# 6+ PriorityQueue
var pq = new PriorityQueue<string, int>();

pq.Enqueue("Deploy v2", priority: 3);
pq.Enqueue("Hotfix DB Deadlock", priority: 1);
pq.Enqueue("Update Docs", priority: 4);

while (pq.TryDequeue(out string task, out int priority)) {
    Console.WriteLine($"[P{priority}] {task}");
}`}
              </pre>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">Python heapq (In-Place Array Heap)</span>
                <button
                  onClick={() => handleRunInSandbox(`import heapq

# In-place O(n) heap construction from existing list
raw_data = [42, 12, 88, 5, 23, 1, 67]
heapq.heapify(raw_data) # Transformed into min-heap in-place

print("Min-Heap array:", raw_data)
print("Smallest element (O(1)):", raw_data[0])

# Popping sorted elements in O(log n)
sorted_order = [heapq.heappop(raw_data) for _ in range(len(raw_data))]
print("Extracted ascending:    ", sorted_order)

# Python Max-Heap idiom: Negate the priority!
max_pq = []
heapq.heappush(max_pq, (-100, "High CPU Task"))
heapq.heappush(max_pq, (-10,  "Low Priority Log"))

neg_p, task = heapq.heappop(max_pq)
print(f"Max-Heap extracted: Priority {-neg_p} -> {task}")`)}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 transition-colors"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Test in Sandbox
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`import heapq

# In Python, any standard list is a heap!
tasks = []
heapq.heappush(tasks, (1, "Hotfix DB Deadlock"))
heapq.heappush(tasks, (3, "Deploy v2"))

priority, task = heapq.heappop(tasks)

# O(n) heapify transforms an existing list in-place:
data = [5, 2, 8, 1, 9]
heapq.heapify(data)`}
              </pre>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Min-Heap vs Max-Heap:</strong> Python only implements min-heaps. To create a max-heap, negate numbers: <code className="text-amber-300 font-mono">heapq.heappush(pq, (-val, val))</code> or use <code className="text-amber-300 font-mono">heapq.nlargest(k, iterable)</code>.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Trees & Graphs */}
        {activeTab === 'graphs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">C# Graph Adjacency List</span>
                <span className="text-[10px] text-slate-500 font-mono">Typed Classes</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-blue-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`public class Node<T> {
    public T Value { get; set; }
    public List<Node<T>> Neighbors { get; } = new();
    public Node(T val) => Value = val;
}

// Or adjacency dictionary:
var graph = new Dictionary<string, List<string>>();
void AddEdge(string u, string v) {
    if (!graph.ContainsKey(u)) graph[u] = new List<string>();
    graph[u].Add(v);
}`}
              </pre>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">Python Idiomatic Graph &amp; BFS</span>
                <button
                  onClick={() => handleRunInSandbox(`from collections import deque, defaultdict

# Adjacency list using defaultdict
graph = defaultdict(list)
edges = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "E"), ("D", "F")]
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u) # Undirected graph

def bfs_shortest_path(start, target):
    queue = deque([(start, [start])])
    visited = {start}

    while queue:
        current, path = queue.popleft()
        if current == target:
            return path
        for neighbor in graph[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return None

path = bfs_shortest_path("A", "F")
print("BFS Shortest Path A -> F:", " -> ".join(path))`)}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 transition-colors"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Test in Sandbox
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`from collections import deque, defaultdict

# Graph represented with zero class boilerplate:
graph = defaultdict(list)
graph["A"].extend(["B", "C"])

# BFS queue using collections.deque (O(1) popleft)
def bfs(start_node):
    queue = deque([start_node])
    visited = {start_node}
    while queue:
        curr = queue.popleft()
        for neighbor in graph[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`}
              </pre>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Crucial Rule:</strong> Never use <code className="text-amber-300 font-mono">list.pop(0)</code> as a queue in graph algorithms! It has $O(n)$ time complexity. Always import <code className="text-amber-300 font-mono">collections.deque</code> for $O(1)$ operations.
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: Canonical Patterns */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Dynamic Programming: Automatic Memoization (@functools.cache)</h3>
                  <p className="text-xs text-slate-400">Zero-boilerplate top-down DP with hash table caching vs manual C# ConcurrentDictionary</p>
                </div>
                <button
                  onClick={() => handleRunInSandbox(`import functools
import time

# Top-down DP for 0/1 Knapsack with memoization
weights = [2, 3, 4, 5]
values  = [3, 4, 5, 8]
capacity = 8

@functools.cache
def knapsack(idx: int, rem_capacity: int) -> int:
    if idx < 0 or rem_capacity <= 0:
        return 0
    # Option 1: Skip item
    best = knapsack(idx - 1, rem_capacity)
    # Option 2: Include item (if it fits)
    if weights[idx] <= rem_capacity:
        best = max(best, values[idx] + knapsack(idx - 1, rem_capacity - weights[idx]))
    return best

max_val = knapsack(len(weights) - 1, capacity)
print(f"Max knapsack value for capacity {capacity}: {max_val}")
print("Cache telemetry:", knapsack.cache_info())`)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl shadow-md transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Run Knapsack DP in Sandbox
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`import functools

@functools.cache
def knapsack(idx: int, rem_cap: int) -> int:
    if idx < 0 or rem_cap <= 0:
        return 0
    # Memoized automatically based on tuple arguments (idx, rem_cap)
    skip = knapsack(idx - 1, rem_cap)
    take = values[idx] + knapsack(idx - 1, rem_cap - weights[idx]) if weights[idx] <= rem_cap else 0
    return max(skip, take)`}
              </pre>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Sliding Window: Longest Substring Without Repeating Characters</h3>
                  <p className="text-xs text-slate-400">Classic interview &amp; systems algorithm implemented with $O(n)$ two-pointers</p>
                </div>
                <button
                  onClick={() => handleRunInSandbox(`def length_of_longest_substring(s: str) -> int:
    char_index_map = {}
    max_len = 0
    left = 0

    for right, char in enumerate(s):
        # If character was seen inside current window, shrink left boundary
        if char in char_index_map and char_index_map[char] >= left:
            left = char_index_map[char] + 1
        char_index_map[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len

test_strings = ["abcabcbb", "bbbbb", "pwwkew", "architect_rosetta"]
for text in test_strings:
    print(f"String: '{text:18}' -> Longest unique substring: {length_of_longest_substring(text)}")`)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl shadow-md transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Run Sliding Window in Sandbox
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed border border-slate-800/80">
{`def length_of_longest_substring(s: str) -> int:
    char_map = {}
    max_len = left = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`}
              </pre>
            </div>
          </div>
        )}
      </section>

      {/* Systems Engineering Summary for C# Architects */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <Info className="h-5 w-5" />
          <span>Architectural Summary: Best Practices for High-Performance Python DSA</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Avoid List Slicing in Loops:</strong> Slices like <code className="text-amber-300 font-mono">arr[i:j]</code> allocate new lists. Use indices or <code className="text-amber-300 font-mono">itertools.islice</code>.
            </div>
          </li>
          <li className="flex items-start gap-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Use deque for Queues &amp; BFS:</strong> Never use <code className="text-amber-300 font-mono">list.pop(0)</code> which is $O(n)$. <code className="text-amber-300 font-mono">deque.popleft()</code> is true $O(1)$.
            </div>
          </li>
          <li className="flex items-start gap-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Leverage bisect for Search:</strong> Binary search on sorted lists via <code className="text-amber-300 font-mono">bisect.bisect_left</code> avoids building expensive binary search trees.
            </div>
          </li>
          <li className="flex items-start gap-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Drop to NumPy for Numerical Arrays:</strong> For dense matrix multiplications and contiguous numeric buffers, switch to NumPy to regain C-speed SIMD vectorization.
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};
