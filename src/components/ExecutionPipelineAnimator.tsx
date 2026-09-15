import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Cpu,
  Layers,
  Sparkles,
  Database,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface Step {
  stage: string;
  stageName: string;
  color: string;
  badge: string;
  description: string;
  codeView: {
    title: string;
    content: string;
    lang: string;
  };
  stackState: string[];
  localsState: Record<string, string>;
  cpythonInternal: string;
  dotnetParallel: string;
}

const EXECUTION_STEPS: Step[] = [
  {
    stage: 'tokenize',
    stageName: '1. Lexical Tokenization',
    color: 'border-blue-500 bg-blue-500/10 text-blue-400',
    badge: 'Lexer (Parser/lexer.c)',
    description: 'Raw UTF-8 source string is read by CPython peg-parser lexer and transformed into atomic lexical token stream with indent/dedent markers.',
    codeView: {
      title: 'Tokens Stream',
      content: `NAME "def"       [1, 0 -> 1, 3]
NAME "calc"      [1, 4 -> 1, 8]
LPAR "("         [1, 8 -> 1, 9]
NAME "x"         [1, 9 -> 1, 10]
RPAR ")"         [1, 10 -> 1, 11]
COLON ":"        [1, 11 -> 1, 12]
NEWLINE          [1, 12 -> 1, 13]
INDENT           [2, 0 -> 2, 4]
NAME "return"    [2, 4 -> 2, 10]
NAME "x"         [2, 11 -> 2, 12]
STAR "*"         [2, 13 -> 2, 14]
NUMBER "2"       [2, 15 -> 2, 16]
PLUS "+"         [2, 17 -> 2, 18]
NUMBER "1"       [2, 19 -> 2, 20]`,
      lang: 'tokens'
    },
    stackState: [],
    localsState: {},
    cpythonInternal: 'Uses CPython PEG parser (introduced in Python 3.9 replacing LL(1)). Handles arbitrary lookahead without infinite recursion.',
    dotnetParallel: 'Equivalent to Roslyn SyntaxTree tokenization (SyntaxToken in Microsoft.CodeAnalysis.CSharp.Syntax).'
  },
  {
    stage: 'ast',
    stageName: '2. Abstract Syntax Tree (AST)',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    badge: 'AST Builder (Python/ast.c)',
    description: 'Grammar rules parse token stream into a hierarchical Abstract Syntax Tree. Semantic symbols and scopes are verified.',
    codeView: {
      title: 'Python AST Node Hierarchy',
      content: `Module(
  body=[
    FunctionDef(
      name='calc',
      args=arguments(args=[arg(arg='x')]),
      body=[
        Return(
          value=BinOp(
            left=BinOp(
              left=Name(id='x', ctx=Load()),
              op=Mult(),
              right=Constant(value=2)
            ),
            op=Add(),
            right=Constant(value=1)
          )
        )
      ]
    )
  ]
)`,
      lang: 'python'
    },
    stackState: [],
    localsState: {},
    cpythonInternal: 'Nodes are allocated via Python/Python-ast.c. The compiler constructs a symbol table (symtable) to differentiate local vs global vs free closure variables.',
    dotnetParallel: 'Equivalent to Roslyn Compilation AST (SyntaxNode hierarchy with SemanticModel binding symbols).'
  },
  {
    stage: 'compile',
    stageName: '3. Bytecode Compilation (.pyc)',
    color: 'border-purple-500 bg-purple-500/10 text-purple-400',
    badge: 'Compiler (Python/compile.c)',
    description: 'AST is compiled into PyCodeObject containing linear bytecode instructions, constant tables (co_consts), and local variable names (co_varnames).',
    codeView: {
      title: 'Disassembled Bytecode (dis.dis)',
      content: `  2           0 RESUME                   0

              2 LOAD_FAST                0 (x)
              4 LOAD_CONST               1 (2)
              6 BINARY_OP                5 (*)
              8 LOAD_CONST               2 (1)
             10 BINARY_OP                0 (+)
             12 RETURN_VALUE`,
      lang: 'assembly'
    },
    stackState: [],
    localsState: { 'co_varnames[0]': 'x = 42' },
    cpythonInternal: 'Stored in PyCodeObject struct. Bytecode opcodes are 2 bytes in Python 3.11+: 1 byte opcode + 1 byte argument (16-bit wordcode format).',
    dotnetParallel: 'Equivalent to Roslyn compiling C# into CIL (Common Intermediate Language): ldarg.0, ldc.i4.2, mul, ldc.i4.1, add, ret.'
  },
  {
    stage: 'eval1',
    stageName: '4. Frame Init & LOAD_FAST',
    color: 'border-amber-500 bg-amber-500/10 text-amber-400',
    badge: 'VM Execution (Python/ceval.c)',
    description: 'A call creates an allocated PyFrameObject. The CPU begins executing the giant switch-case loop in _PyEval_EvalFrameDefault.',
    codeView: {
      title: 'Current Opcode: LOAD_FAST 0 (x)',
      content: `// Python/ceval.c loop:
TARGET(LOAD_FAST) {
    PyObject *value = GETLOCAL(oparg); // Fast C array index
    Py_INCREF(value);
    PUSH(value);
    DISPATCH();
}`,
      lang: 'c'
    },
    stackState: ['PyLong(42)'],
    localsState: { 'fastlocals[0]': '42 (refcnt: 4)' },
    cpythonInternal: 'LOAD_FAST bypasses dictionary lookup and indexes a contiguous C pointer array (f_localsplus) inside the PyFrameObject.',
    dotnetParallel: 'Equivalent to CIL ldarg.0 pushing argument onto CLR evaluation stack.'
  },
  {
    stage: 'eval2',
    stageName: '5. LOAD_CONST & BINARY_OP (*)',
    color: 'border-orange-500 bg-orange-500/10 text-orange-400',
    badge: 'Stack Math (*)',
    description: 'LOAD_CONST 1 pushes constant integer 2. BINARY_OP pops both items, checks type slots (nb_multiply), computes 42 * 2 = 84, and pushes result.',
    codeView: {
      title: 'Current Opcode: BINARY_OP 5 (*)',
      content: `// Stack before: [PyLong(42), PyLong(2)]
PyObject *rhs = POP(); // PyLong(2)
PyObject *lhs = TOP(); // PyLong(42)
PyObject *res = PyNumber_Multiply(lhs, rhs);
SET_TOP(res); // replaces stack top with PyLong(84)
Py_DECREF(rhs);
Py_DECREF(lhs);`,
      lang: 'c'
    },
    stackState: ['PyLong(84)'],
    localsState: { 'fastlocals[0]': '42' },
    cpythonInternal: 'Stack is pure LIFO C array. Integer arithmetic in Python produces arbitrary-precision PyLongObject (no 32-bit overflow wraps).',
    dotnetParallel: 'Equivalent to CIL mul instruction performing hardware CPU multiplication register operation.'
  },
  {
    stage: 'eval3',
    stageName: '6. LOAD_CONST 1 & BINARY_OP (+)',
    color: 'border-pink-500 bg-pink-500/10 text-pink-400',
    badge: 'Stack Math (+)',
    description: 'Pushes constant 1. Pops 84 and 1, invokes integer addition slot (long_add in Objects/longobject.c), and pushes 85 onto value stack.',
    codeView: {
      title: 'Current Opcode: BINARY_OP 0 (+)',
      content: `// Stack before: [PyLong(84), PyLong(1)]
PyObject *rhs = POP(); // PyLong(1)
PyObject *lhs = TOP(); // PyLong(84)
PyObject *res = PyNumber_Add(lhs, rhs);
SET_TOP(res); // [PyLong(85)]
Py_DECREF(rhs);
Py_DECREF(lhs);`,
      lang: 'c'
    },
    stackState: ['PyLong(85)'],
    localsState: { 'fastlocals[0]': '42' },
    cpythonInternal: 'Integer values from -5 to 256 are pre-allocated singletons in CPython (small_ints cache), avoiding heap allocations.',
    dotnetParallel: 'Equivalent to CIL add instruction.'
  },
  {
    stage: 'specialization',
    stageName: '7. PEP 659 Adaptive Specialization',
    color: 'border-cyan-500 bg-cyan-500/10 text-cyan-400',
    badge: 'Tier-1 Adaptive JIT (Python 3.11+)',
    description: 'After 8 executions with integer operands, the specializing adaptive interpreter mutates the bytecode at runtime into quickened specialized opcodes!',
    codeView: {
      title: 'Adaptive Quicken Bytecode Mutation',
      content: `// ORIGINAL BYTECODE:
2 LOAD_FAST                0 (x)
4 LOAD_CONST               1 (2)
6 BINARY_OP                5 (*)   // Generic dynamic dispatch

// SPECIALIZED ADAPTIVE BYTECODE (MUTATED IN-PLACE):
2 LOAD_FAST__LOAD_FAST     0, 1    // Super-instruction
6 BINARY_OP_MULTIPLY_INT           // Direct C integer fast path!
8 BINARY_OP_ADD_INT                // Direct fast path!
// Skips type checks, method table lookups, and slot inspections!`,
      lang: 'assembly'
    },
    stackState: ['PyLong(85)'],
    localsState: { 'fastlocals[0]': '42', 'adaptive_counter': 'WARM (Specialized)' },
    cpythonInternal: 'PEP 659 Quickening: Python modifies its own code array in memory to insert specialized inline caches without full JIT compilation overhead.',
    dotnetParallel: 'Analogous to .NET Tiered Compilation (Tier 0 Quick JIT -> Tier 1 PGO Profile Guided Optimization with loop unrolling and inline caches).'
  },
  {
    stage: 'return',
    stageName: '8. RETURN_VALUE & Frame Teardown',
    color: 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
    badge: 'Frame Teardown & Return',
    description: 'Pops return value 85, unwinds the PyFrameObject, decrements local variable references, and hands pointer back to caller frame.',
    codeView: {
      title: 'Result Passed to Caller',
      content: `PyObject *retval = POP(); // PyLong(85)
_PyFrame_ClearExceptCode(frame);
// If refcount of locals drops to 0, immediate deallocation occurs
return retval; // Result: 85`,
      lang: 'c'
    },
    stackState: [],
    localsState: { 'returned_value': '85' },
    cpythonInternal: 'CPython frame allocation uses a per-thread freelist cache to avoid malloc/free overhead on function calls.',
    dotnetParallel: 'Equivalent to CIL ret instruction, popping return value from evaluation stack and cleaning ESP/EBP stack frame.'
  }
];

const MIN_SCALE = 0.75;
const MAX_SCALE = 1.6;
const ZOOM_STEP = 0.15;

export const ExecutionPipelineAnimator: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(2000);
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleZoomIn = () => setScale(prev => Math.min(MAX_SCALE, Number((prev + ZOOM_STEP).toFixed(2))));
  const handleZoomOut = () => setScale(prev => Math.max(MIN_SCALE, Number((prev - ZOOM_STEP).toFixed(2))));
  const handleResetZoom = () => setScale(1);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= EXECUTION_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playSpeed]);

  const step = EXECUTION_STEPS[currentStepIndex];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Header with Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
              VM
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Interactive CPython Program Execution Pipeline
            </h3>
          </div>
          <p className="mt-1 text-xs md:text-sm text-slate-400">
            Step through source code, AST, bytecode generation, and virtual machine frame evaluation with live value stack visualizer.
          </p>
        </div>

        {/* Stepper & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Toolbar */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-400 hover:bg-amber-500/20 rounded transition-colors"
              title="Reset Zoom to 100%"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/20 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" /> Auto Play
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(prev => (prev < EXECUTION_STEPS.length - 1 ? prev + 1 : 0));
            }}
            className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Step Forward"
          >
            <SkipForward className="h-4 w-4" />
            <span>Next Step</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reset to Beginning"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pipeline Progress Breadcrumb Tracker */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 min-w-175">
          {EXECUTION_STEPS.map((s, idx) => {
            const isActive = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            return (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`group flex-1 flex flex-col items-start p-2 rounded-xl border transition-all text-left ${
                  isActive
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : isPassed
                    ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    : 'border-slate-800/40 bg-slate-950/40 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5 w-full">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive
                        ? 'bg-amber-400 animate-ping'
                        : isPassed
                        ? 'bg-emerald-400'
                        : 'bg-slate-700'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono font-bold truncate ${
                      isActive ? 'text-amber-300' : isPassed ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  >
                    Step {idx + 1}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold truncate mt-1 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {s.stageName.split('. ')[1] || s.stageName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-slate-700">
              {step.badge}
            </span>
            <h4 className="text-lg font-bold text-white">{step.stageName}</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Phase {currentStepIndex + 1} of {EXECUTION_STEPS.length}
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Two Column Layout: Code/Bytecode View & CPython VM Runtime Memory Stack */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 origin-top transition-transform duration-150"
        style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
      >
        {/* Left: Code / AST / Assembly representation (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{step.codeView.title}</span>
            <span className="font-mono text-amber-400 text-[11px]">
              target: def calc(x): return x * 2 + 1
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden font-mono text-xs shadow-inner">
            <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-950 px-4 py-2 text-[11px] text-slate-400">
              <span className="h-2 w-2 rounded-full bg-rose-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-500/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
              <span className="ml-2 text-slate-400">cpython_eval_frame.py</span>
            </div>
            <pre className="p-4 text-slate-200 overflow-x-auto leading-relaxed text-xs">
              {step.codeView.content}
            </pre>
          </div>

          {/* Under the Hood & Roslyn Parallel Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Cpu className="h-3.5 w-3.5" />
                <span>CPython VM Internals</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {step.cpythonInternal}
              </p>
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <Layers className="h-3.5 w-3.5" />
                <span>.NET CLR / Roslyn Parallel</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {step.dotnetParallel}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live CPython Value Stack & Fastlocals Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-amber-400" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  CPython Evaluation Value Stack (LIFO)
                </h5>
              </div>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                Depth: {step.stackState.length}
              </span>
            </div>

            {/* Visual Stack Chamber */}
            <div className="relative flex flex-col-reverse justify-start min-h-40 rounded-xl border-2 border-dashed border-slate-800 bg-slate-950/60 p-3 gap-2">
              {step.stackState.length === 0 ? (
                <div className="my-auto flex flex-col items-center justify-center text-center text-xs text-slate-500 space-y-1">
                  <span className="font-mono text-[11px]">[ Empty Stack ]</span>
                  <span className="text-[10px]">No operands currently pushed on evaluation frame</span>
                </div>
              ) : (
                step.stackState.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-amber-500/50 bg-linear-to-r from-amber-500/20 via-amber-500/10 to-slate-900 px-3 py-2 text-xs font-mono font-bold text-amber-300 shadow-md animate-pulse"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">TOP[{idx}]:</span>
                      <span>{val}</span>
                    </div>
                    <span className="rounded bg-amber-500/30 px-1.5 py-0.5 text-[9px] text-amber-200 uppercase font-sans">
                      PyObject*
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Fastlocals & Frame Registers */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Fastlocals Array (f_localsplus)</span>
                <span className="text-[10px] text-slate-500 font-mono">O(1) C array lookup</span>
              </div>

              {Object.keys(step.localsState).length === 0 ? (
                <div className="text-xs font-mono text-slate-500 py-1">
                  Uninitialized local scope
                </div>
              ) : (
                <div className="space-y-1.5">
                  {Object.entries(step.localsState).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-mono border border-slate-800"
                    >
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-emerald-400 font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick takeaway tip */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 text-xs text-slate-400 flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Senior Architect Insight:</strong> Unlike C# which JIT-compiles CIL directly to AMD64/ARM64 machine instructions at runtime, standard CPython is an interpreter evaluating C function calls. Python 3.11–3.13 introduces Tier-1 Quickening and Tier-2 copy-and-patch micro-op JIT to bridge this gap.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
