import React, { useState } from 'react';
import { Layers, Lock, Workflow, CheckCircle2, Server } from 'lucide-react';
import {
  CLR_VS_CPYTHON,
  CPYTHON_VM_STEPS,
  GIL_DEEP_DIVE,
  PYTHON_IMPLEMENTATIONS
} from '../data/architectureData';
import { MermaidViewer } from '../components/MermaidViewer';
import { ExecutionPipelineAnimator } from '../components/ExecutionPipelineAnimator';
import { GilConcurrencyVisualizer } from '../components/GilConcurrencyVisualizer';
import { MemoryPyObjectVisualizer } from '../components/MemoryPyObjectVisualizer';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'runtime' | 'pipeline' | 'gil' | 'implementations'>('runtime');

  const ARCHITECTURE_COMPARISON_MERMAID = `flowchart TB
    subgraph DOTNET [".NET Common Language Runtime (CLR)"]
      CS["C# Source Code (.cs)"]
      ROS["Roslyn Compiler (csc)"]
      CIL["Common Intermediate Language (CIL)"]
      JIT["RyuJIT (Tier 0 -> Tier 1 PGO)"]
      NATIVE["Native Machine Code (AMD64 / ARM64)"]
      GC_CLR[".NET GC (Generations 0, 1, 2 + LOH)"]
      TP["Preemptive ThreadPool (Multi-Core)"]

      CS --> ROS
      ROS --> CIL
      CIL --> JIT
      JIT --> NATIVE
      NATIVE -.-> GC_CLR
      NATIVE -.-> TP
    end

    subgraph CPYTHON ["CPython Reference Virtual Machine"]
      PY["Python Source Code (.py)"]
      PEG["PEG Parser (Tokenizer & AST)"]
      COMP["Bytecode Compiler"]
      PYC["Python 16-bit Wordcode (.pyc)"]
      EVAL["_PyEval_EvalFrameDefault (ceval.c)"]
      TIER1["Tier-1 Adaptive Specializer (PEP 659)"]
      REF["Deterministic RefCount + Cyclic GC"]
      GIL["Global Interpreter Lock (Mutex)"]

      PY --> PEG
      PEG --> COMP
      COMP --> PYC
      PYC --> EVAL
      EVAL <--> TIER1
      EVAL -.-> REF
      EVAL -.-> GIL
    end

    classDef dotnet fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef cpython fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#f8fafc;

    style DOTNET fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    style CPYTHON fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#f8fafc;`;

  const PIPELINE_FLOW_MERMAID = `flowchart TD
    A["1. Source Code (.py)"] -->|"Parser/lexer.c"| B["2. Lexical Tokens (Indent/Dedent)"]
    B -->|"Parser/peg.c"| C["3. Abstract Syntax Tree (AST)"]
    C -->|"Python/symtable.c"| D["4. Symbol Table (Local vs Global vs Free)"]
    D -->|"Python/compile.c"| E["5. Bytecode PyCodeObject (co_code)"]
    E -->|"Python/ceval.c"| F["6. Frame Evaluation Loop"]
    F -->|"8 Executions (Warm)"| G["7. PEP 659 Quickening: Specialized Opcode"]
    G -->|"Fast Path"| H["8. Direct C Function Dispatch"]

    classDef step fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef opt fill:#701a75,stroke:#f472b6,stroke-width:2px,color:#f8fafc;

    class A,B,C,D,E,F step;
    class G,H opt;`;

  const GIL_SEQUENCE_MERMAID = `sequenceDiagram
    autonumber
    participant T1 as OS Thread 1 (Python Code)
    participant GIL as Global Interpreter Lock (Mutex)
    participant T2 as OS Thread 2 (Python Code)
    participant C_EXT as NumPy / C Extension

    T1->>GIL: Acquire GIL
    activate T1
    Note over T1: Executes bytecode on CPU Core 0
    T2->>GIL: Request GIL (Blocked!)
    activate T2
    Note over T2: Sleeping on pthread_mutex_lock

    rect rgb(30, 27, 75)
      Note over T1: 5ms Switch Interval Reached
      T1->>GIL: Drop GIL
      deactivate T1
      GIL-->>T2: Grant GIL to Thread 2
      deactivate T2
      activate T2
      Note over T2: Executes bytecode on CPU Core 0
    end

    rect rgb(20, 83, 45)
      Note over T2,C_EXT: Matrix Multiplication (BLAS / LAPACK)
      T2->>GIL: Py_BEGIN_ALLOW_THREADS (Release GIL!)
      Note over T1,T2: TRUE MULTI-CORE PARALLELISM!
      T1->>GIL: Acquire GIL (Runs on Core 0)
      T2->>C_EXT: Runs Heavy SIMD Math on Core 1
      Note over C_EXT: Finishes Native Compute
      T2->>GIL: Py_END_ALLOW_THREADS (Re-acquire GIL)
    end`;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 02
          </span>
          <span className="text-xs text-slate-400">Systems & Runtime Internals</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Architecture Deep Dive: CPython vs .NET CLR
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          An engineering breakdown of the CPython C-interpreter virtual machine, the Global Interpreter Lock (GIL), bytecode evaluation loops, and reference-counted generational memory vs the .NET Common Language Runtime.
        </p>

        {/* Tab Controls */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {([
            { id: 'runtime', label: '1. CPython vs CLR Matrix & Memory', icon: Layers },
            { id: 'pipeline', label: '2. Bytecode Pipeline & Execution', icon: Workflow },
            { id: 'gil', label: '3. The GIL & Concurrency Simulation', icon: Lock },
            { id: 'implementations', label: '4. Alternative Runtimes', icon: Server }
          ] as const).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: CPython vs CLR Comparison & Memory Visualizer */}
      {activeTab === 'runtime' && (
        <div className="space-y-8">
          {/* Architecture Comparison Diagram */}
          <div className="space-y-3">
            <div className="border-l-2 border-amber-500/40 pl-4">
              <h2 className="text-lg font-bold text-white">High-Level Virtual Machine Architecture Comparison</h2>
              <p className="text-xs text-slate-400">
                Visualizing the structural execution topologies of .NET CLR (JIT-compiled) and CPython (Interpreted with Specialization).
              </p>
            </div>

            <MermaidViewer
              title="CPython vs .NET CLR System Architecture Diagram"
              chart={ARCHITECTURE_COMPARISON_MERMAID}
              caption="Comparison between .NET RyuJIT native execution pipeline and CPython bytecode evaluation loop with GIL."
            />
          </div>

          {/* Interactive Memory Visualizer */}
          <MemoryPyObjectVisualizer />

          {/* Runtime Matrix Table */}
          <div className="space-y-4">
            <div className="border-l-2 border-amber-500/40 pl-4">
              <h2 className="text-lg font-bold text-white">Runtime Architecture Matrix</h2>
              <p className="text-xs text-slate-400">
                Low-level contrasts between the .NET CLR and standard CPython execution models.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-slate-800 bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-4">Architectural Dimension</th>
                      <th className="p-4 text-purple-300">.NET CLR (Common Language Runtime)</th>
                      <th className="p-4 text-amber-400">CPython (Reference VM)</th>
                      <th className="p-4">Architectural Implication</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {CLR_VS_CPYTHON.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-white whitespace-nowrap">
                          {item.dimension}
                        </td>
                        <td className="p-4 text-slate-300 leading-relaxed font-mono text-[11px]">
                          {item.dotnetClr}
                        </td>
                        <td className="p-4 text-slate-200 leading-relaxed font-mono text-[11px]">
                          {item.cpython}
                        </td>
                        <td className="p-4 text-slate-400 leading-relaxed">
                          {item.architecturalImpact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bytecode Pipeline & Interactive Execution Animator */}
      {activeTab === 'pipeline' && (
        <div className="space-y-8">
          {/* Interactive Execution Pipeline Animator */}
          <ExecutionPipelineAnimator />

          {/* Mermaid Pipeline Diagram */}
          <div className="space-y-3">
            <div className="border-l-2 border-amber-500/40 pl-4">
              <h2 className="text-lg font-bold text-white">Compilation & Evaluation Sequence Flow</h2>
              <p className="text-xs text-slate-400">
                Dataflow diagram tracing from raw characters to adaptive opcode specialization.
              </p>
            </div>

            <MermaidViewer
              title="CPython Compilation & Execution Pipeline Flow"
              chart={PIPELINE_FLOW_MERMAID}
              caption="Visual execution pipeline from PEG tokenization through bytecode evaluation and PEP 659 quickening."
            />
          </div>

          {/* Detailed Pipeline Steps */}
          <div className="space-y-4">
            <div className="border-l-2 border-amber-500/40 pl-4">
              <h2 className="text-lg font-bold text-white">CPython 5-Stage Execution Pipeline Details</h2>
              <p className="text-xs text-slate-400">
                In-depth breakdown of each compilation phase with .NET Roslyn parallels.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {CPYTHON_VM_STEPS.map(step => (
                <div
                  key={step.step}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 font-mono text-xs font-bold text-amber-300">
                        0{step.step}
                      </span>
                      <h3 className="text-base font-bold text-white">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-xs text-purple-300">
                    <strong>C# / Roslyn Parallel: </strong>
                    {step.csharpParallel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: The GIL & Interactive Simulator */}
      {activeTab === 'gil' && (
        <div className="space-y-8">
          {/* Interactive Concurrency Simulator */}
          <GilConcurrencyVisualizer />

          {/* Mermaid Sequence Diagram */}
          <div className="space-y-3">
            <div className="border-l-2 border-amber-500/40 pl-4">
              <h2 className="text-lg font-bold text-white">GIL Mutex Contention & C-Extension Release Sequence</h2>
              <p className="text-xs text-slate-400">
                Sequence diagram showing how OS threads battle for the lock and how NumPy/C libraries unlock true multi-core throughput.
              </p>
            </div>

            <MermaidViewer
              title="CPython GIL Contention & Native C Release Protocol"
              chart={GIL_SEQUENCE_MERMAID}
              caption="Sequence diagram of CPython GIL contention, switch interval, and Py_BEGIN_ALLOW_THREADS bypass."
            />
          </div>

          {/* GIL Deep Dive Content */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg md:text-xl font-bold text-white">
                {GIL_DEEP_DIVE.title}
              </h2>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs md:text-sm text-slate-300 leading-relaxed">
              <strong className="text-amber-400">Definition: </strong>
              {GIL_DEEP_DIVE.whatIsIt}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Why Guido van Rossum Implemented the GIL in 1992
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {GIL_DEEP_DIVE.whyItWasCreated}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Practical Concurrency Implications for Architects
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {GIL_DEEP_DIVE.practicalImplications.map((imp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                PEP 703 Breakthrough: Free-Threaded CPython (No-GIL)
              </h3>
              <div className="whitespace-pre-line text-xs text-slate-300 leading-relaxed font-mono">
                {GIL_DEEP_DIVE.pep703Breakthrough}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Implementations */}
      {activeTab === 'implementations' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">The Python Implementation Landscape</h2>
            <p className="text-xs text-slate-400">
              Beyond CPython: PyPy, IronPython for .NET interop, RustPython for Wasm, and GraalPy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PYTHON_IMPLEMENTATIONS.map((impl, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{impl.name}</h3>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-amber-400">
                    Host: {impl.language}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {impl.description}
                </p>

                <div className="border-t border-slate-800 pt-2 text-xs text-emerald-400">
                  <strong>Best For: </strong>
                  <span className="text-slate-300">{impl.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

