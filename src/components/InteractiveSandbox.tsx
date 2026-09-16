import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  ChevronDown,
  Copy,
  Check,
  Clock,
  Trash2,
  Maximize2,
  Loader2
} from 'lucide-react';
import { preloadSandbox, onSandboxReady, isSandboxReady, runInSandbox } from '../services/pyodideSandboxService';
import { COPY_RESET_MS } from '../constants';

interface PresetSnippet {
  id: string;
  name: string;
  category: string;
  code: string;
  description: string;
}

const PRESET_SNIPPETS: PresetSnippet[] = [
  {
    id: 'comprehension',
    name: '1. LINQ to List Comprehension',
    category: 'Collections',
    description: 'Transforming and filtering collections with list comprehensions vs. C# LINQ',
    code: `# C# LINQ Equivalent:
# var query = numbers.Where(n => n % 2 == 0).Select(n => n * n);

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [n * n for n in numbers if n % 2 == 0]

print("Original Numbers:", numbers)
print("Even Squares:    ", even_squares)
print("Sum of Squares:  ", sum(even_squares))`
  },
  {
    id: 'heapq-priority-queue',
    name: '2. PriorityQueue via heapq (DSA)',
    category: 'Algorithms',
    description: 'Binary min-heap priority queue implementation in Python vs. .NET 6 PriorityQueue',
    code: `import heapq

# In C#: PriorityQueue<string, int> pq = new();
# In Python: heapq maintains the min-heap invariant on standard lists in-place

tasks = []
heapq.heappush(tasks, (3, "Routine code review"))
heapq.heappush(tasks, (1, "CRITICAL: Fix production deadlocks"))
heapq.heappush(tasks, (2, "Review architecture RFC"))

print("Initial Min-Heap Array:", tasks)
print("\\n--- Dequeuing tasks by priority ---")

while tasks:
    priority, description = heapq.heappop(tasks)
    print(f"[Priority {priority}] Dispatched: {description}")`
  },
  {
    id: 'match-case',
    name: '3. Structural Pattern Matching (PEP 634)',
    category: 'Syntax',
    description: 'Type & shape destructuring matching C# switch expressions',
    code: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

def route_command(cmd):
    match cmd:
        case Point(x=0, y=0):
            return "Origin centered"
        case Point(x=x, y=0):
            return f"Horizontal axis at x={x}"
        case {"action": "alert", "severity": "critical"}:
            return "TRIGGERING SIREN: Critical alarm!"
        case [first, *middle, last]:
            return f"Sequence bounded by {first} and {last} ({len(middle)} inner items)"
        case _:
            return "Unknown command shape"

print(route_command(Point(0, 0)))
print(route_command(Point(42, 0)))
print(route_command({"action": "alert", "severity": "critical"}))
print(route_command([10, 20, 30, 40, 50]))`
  },
  {
    id: 'bisect-binary-search',
    name: '4. Binary Search & Slices (bisect)',
    category: 'Algorithms',
    description: 'Logarithmic lookup & sorted insertions vs Array.BinarySearch',
    code: `import bisect

# Sorted telemetry latency cutoffs (in milliseconds)
sla_thresholds = [10, 25, 50, 100, 250, 500]
sla_grades = ["A+", "A", "B", "C", "D", "F"]

def grade_latency(latency_ms: float) -> str:
    # bisect_right finds the insertion point in O(log n)
    idx = bisect.bisect_right(sla_thresholds, latency_ms)
    return sla_grades[min(idx, len(sla_grades) - 1)]

test_samples = [8.4, 25.0, 35.2, 110.5, 620.0]
for sample in test_samples:
    print(f"Latency: {sample:5.1f}ms -> SLA Grade: {grade_latency(sample)}")`
  },
  {
    id: 'lru-cache-memo',
    name: '5. DP & Memoization (@functools.cache)',
    category: 'Algorithms',
    description: 'Dynamic programming automatic memoization vs C# ConcurrentDictionary',
    code: `import functools
import time

# Automatic O(1) hash memoization table
@functools.cache
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

start = time.perf_counter()
fib_50 = fibonacci(50)
elapsed_us = (time.perf_counter() - start) * 1_000_000

print(f"Fibonacci(50) = {fib_50}")
print(f"Calculated in: {elapsed_us:.2f} microseconds via @functools.cache")
print("Cache Diagnostics:", fibonacci.cache_info())`
  },
  {
    id: 'context-mgr',
    name: '6. Context Manager (using / IDisposable)',
    category: 'Memory & Lifecycle',
    description: 'Deterministic resource cleanup with contextmanager',
    code: `from contextlib import contextmanager
import time

@contextmanager
def execution_timer(operation_name: str):
    print(f"--> [ENTER] {operation_name} scope")
    start = time.perf_counter()
    try:
        yield operation_name
    finally:
        elapsed = (time.perf_counter() - start) * 1000
        print(f"<-- [EXIT]  {operation_name} completed in {elapsed:.2f}ms")

with execution_timer("High-Volume Processing"):
    total = sum(i ** 2 for i in range(100000))
    print(f"    Computed mathematical summation: {total}")`
  },
  {
    id: 'dunder-protocols',
    name: '7. Dunder Protocols & Operator Overloading',
    category: 'Data Model',
    description: 'Implementing __add__, __repr__, and mathematical operators',
    code: `class Money:
    def __init__(self, amount: float, currency: str = "USD"):
        self.amount = round(amount, 2)
        self.currency = currency

    def __add__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError(f"Cannot add {self.currency} to {other.currency}")
        return Money(self.amount + other.amount, self.currency)

    def __repr__(self) -> str:
        return f"Money({self.amount:.2f}, {self.currency})"

m1 = Money(45.50, "USD")
m2 = Money(54.50, "USD")
total = m1 + m2

print("m1:   ", m1)
print("m2:   ", m2)
print("Total:", total)`
  },
  {
    id: 'batteries-collections',
    name: '8. Collections & Itertools',
    category: 'Standard Library',
    description: 'Counter, deque sliding windows, and combinations',
    code: `from collections import Counter, deque
import itertools

# 1. Counter: Multiset frequency counting in O(n)
words = ["python", "csharp", "python", "rust", "python", "csharp"]
print("Word Frequencies:", Counter(words))

# 2. Deque: O(1) sliding window eviction buffer
sliding_window = deque(maxlen=3)
for val in [10, 20, 30, 40, 50]:
    sliding_window.append(val)
print("Deque (evicted oldest in O(1)):", list(sliding_window))

# 3. Itertools combinations
print("Pair combinations of 3 services:", list(itertools.combinations(["API", "DB", "Cache"], 2)))`
  }
];

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  runtime: string;
}

export const InteractiveSandbox: React.FC<{
  initialPresetId?: string;
  customCode?: string;
  onExpandToModal?: () => void;
  isModalView?: boolean;
}> = ({
  initialPresetId = 'comprehension',
  customCode,
  onExpandToModal,
  isModalView = false
}) => {
  const initial = PRESET_SNIPPETS.find(p => p.id === initialPresetId) || PRESET_SNIPPETS[0];
  const [currentPreset, setCurrentPreset] = useState<PresetSnippet>(initial);
  const [code, setCode] = useState<string>(customCode || initial.code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runtimeReady, setRuntimeReady] = useState<boolean>(isSandboxReady());
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSandboxReady(() => setRuntimeReady(true));

    // Inside the full-screen modal, opening it IS the user's intent to run
    // code — preload immediately. Embedded inline on every chapter page,
    // the ~4MB Pyodide runtime would otherwise start downloading on every
    // single page view even for readers who never touch the sandbox, so
    // defer it until the sandbox actually scrolls into view instead.
    if (isModalView) {
      preloadSandbox();
      return;
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      preloadSandbox();
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          preloadSandbox();
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isModalView]);

  // When customCode or initialPresetId changes, update state
  useEffect(() => {
    if (customCode) {
      setCode(customCode);
      setResult(null);
      return;
    }
    const found = PRESET_SNIPPETS.find(p => p.id === initialPresetId);
    if (found) {
      setCurrentPreset(found);
      setCode(found.code);
      setResult(null);
    }
  }, [initialPresetId, customCode]);

  const handleSelectPreset = (p: PresetSnippet) => {
    setCurrentPreset(p);
    setCode(p.code);
    setResult(null);
  };

  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);

    // Real CPython, compiled to WebAssembly, executed entirely in a
    // dedicated Worker (see src/services/pyodideSandboxService.ts) — no
    // server round-trip, no host filesystem or network access from the
    // executed code, and a hard timeout that terminates the worker if the
    // code hangs. This is genuine execution, not a simulation.
    const outcome = await runInSandbox(code);

    setResult({
      stdout: outcome.stdout,
      stderr: outcome.stderr,
      exitCode: outcome.success ? 0 : 1,
      durationMs: outcome.durationMs,
      runtime: outcome.timedOut ? 'CPython (WebAssembly) — Timed Out' : 'CPython 3.14 (Pyodide / WebAssembly)'
    });
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(currentPreset.code);
    setResult(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_RESET_MS);
  };

  const handleClearTerminal = () => {
    setResult(null);
  };

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to execute
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
    }
  };

  return (
    <div ref={containerRef} className={`rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl ${isModalView ? 'h-full flex flex-col' : ''}`}>
      {/* Sandbox Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Interactive CPython 3.14 Sandbox</h2>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Kernel
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Edit and run real Python code directly in your browser via Pyodide (CPython compiled to WebAssembly) — no server, no account, nothing leaves your device.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <select
              value={currentPreset.id}
              onChange={e => {
                const p = PRESET_SNIPPETS.find(item => item.id === e.target.value);
                if (p) handleSelectPreset(p);
              }}
              className="w-[150px] sm:w-auto max-w-[60vw] sm:max-w-none truncate appearance-none rounded-xl border border-slate-700 bg-slate-900 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-200 hover:border-amber-500/50 focus:border-amber-500 focus:outline-hidden transition-colors"
            >
              {PRESET_SNIPPETS.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reset to default preset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Copy code */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Copy Python source"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Expand to modal button if available */}
          {onExpandToModal && !isModalView && (
            <button
              onClick={onExpandToModal}
              className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="Expand to Fullscreen Modal"
            >
              <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Expand</span>
            </button>
          )}

          {/* Run button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            title={
              runtimeReady
                ? 'Execute Code (⌘+Enter / Ctrl+Enter)'
                : 'Python runtime is still loading — first run will wait for it automatically'
            }
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>
              {isRunning ? 'Executing...' : runtimeReady ? 'Run Code' : 'Run Code (loading runtime...)'}
            </span>
            <kbd className="hidden sm:inline-block rounded bg-amber-600/30 px-1 py-0.2 text-[10px] text-amber-900 font-mono font-bold">
              ⌘↵
            </kbd>
          </button>
        </div>
        {!runtimeReady && (
          <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            Downloading the in-browser Python runtime (first visit only, then cached)&hellip;
          </p>
        )}
      </div>

      {/* Editor and Terminal Canvas */}
      <div className={`mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 ${isModalView ? 'flex-1 min-h-0' : ''}`}>
        {/* Left Column: Code Editor */}
        <div className="flex flex-col rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3.5 py-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              main.py
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Press ⌘+Enter to Run
            </span>
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            aria-label="Python code editor"
            className="w-full flex-1 min-h-65 p-4 bg-transparent font-mono text-xs text-amber-200/90 leading-relaxed resize-none focus:outline-hidden"
            placeholder="# Write Python 3 code here..."
          />
        </div>

        {/* Right Column: Interactive Terminal Output */}
        <div className="flex flex-col rounded-xl border border-slate-800/80 bg-slate-950 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3.5 py-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${result ? (result.exitCode === 0 ? 'bg-emerald-400' : 'bg-rose-400') : 'bg-slate-600'}`} />
              stdout & diagnostics
            </span>

            <div className="flex items-center gap-2">
              {result && (
                <>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400">
                    <Clock className="h-3 w-3 text-amber-400" />
                    {result.durationMs}ms
                  </span>
                  <span className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                    result.exitCode === 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    exit {result.exitCode}
                  </span>
                </>
              )}
              {result && (
                <button
                  onClick={handleClearTerminal}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Clear output"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-65 p-4 font-mono text-xs overflow-y-auto leading-relaxed">
            {isRunning ? (
              <div className="flex items-center gap-2 text-amber-400 py-6">
                <span className="h-3 w-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <span>Executing bytecode on CPython interpreter...</span>
              </div>
            ) : result ? (
              <div className="space-y-2">
                {result.stdout && (
                  <pre className="text-emerald-300/95 whitespace-pre-wrap font-mono">
                    {result.stdout}
                  </pre>
                )}
                {result.stderr && (
                  <pre className="text-rose-400 whitespace-pre-wrap font-mono bg-rose-950/20 p-2 rounded border border-rose-500/20">
                    {result.stderr}
                  </pre>
                )}
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Runtime: {result.runtime}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400 space-y-2 text-center">
                <Terminal className="h-7 w-7 text-slate-500" />
                <p className="text-xs">Terminal ready. Click <strong className="text-amber-400">Run Code</strong> or press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[11px] text-slate-300">⌘+Enter</kbd></p>
                <p className="text-[11px] text-slate-400">Supports standard library imports (math, itertools, collections, heapq, bisect)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
