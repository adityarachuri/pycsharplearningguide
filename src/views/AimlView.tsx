import React, { useState } from 'react';
import { BrainCircuit, Cpu, Layers } from 'lucide-react';
import {
  AIML_STACK_LAYERS,
  CSHARP_VS_PYTHON_AIML,
  CODE_EXAMPLES_AIML
} from '../data/aimlData';
import { CodeBlock } from '../components/CodeBlock';

export const AimlView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stack' | 'comparison' | 'code'>('stack');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 08
          </span>
          <span className="text-xs text-slate-400">The Modern AI Frontier</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          AI & Machine Learning: The Full-Stack Python Architecture
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          An exhaustive full-stack breakdown of the 6-layer modern AI ecosystem: from hardware CUDA kernels (Triton) and tensor engines (PyTorch, JAX) to GenAI orchestration (vLLM, LangGraph) and Vector DBs.
        </p>

        {/* Tab Selection */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {([
            { id: 'stack', label: 'The 6-Layer AI Stack', icon: Layers },
            { id: 'comparison', label: 'C# vs Python AI Reality', icon: BrainCircuit },
            { id: 'code', label: 'Hands-On Tensor & RAG Code', icon: Cpu }
          ] as const).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
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

      {/* Tab 1: 6-Layer AI Stack */}
      {activeTab === 'stack' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">The 6 Architectural Layers of Modern AI</h2>
            <p className="text-xs text-slate-400">
              How Python serves as the universal orchestration plane connecting raw silicon to deployed foundation models.
            </p>
          </div>

          <div className="space-y-4">
            {AIML_STACK_LAYERS.map(layer => (
              <div
                key={layer.layerNumber}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 font-mono text-xs font-bold text-amber-300">
                      L0{layer.layerNumber}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">{layer.layerName}</h3>
                      <span className="text-[11px] text-amber-400 font-medium">
                        {layer.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {layer.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-mono font-medium text-emerald-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {layer.role}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      C# .NET Alternative:
                    </span>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      {layer.csharpAlternative}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Engineering Deep Dive:
                    </span>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {layer.engineeringDetails}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Comparison */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Architectural Verdict
            </h2>
            <p className="mt-2 text-sm md:text-base font-semibold text-white leading-relaxed">
              &ldquo;{CSHARP_VS_PYTHON_AIML.verdict}&rdquo;
            </p>
          </div>

          <div className="space-y-4">
            {CSHARP_VS_PYTHON_AIML.keyDifferences.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3"
              >
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px] text-amber-400">
                    {idx + 1}
                  </span>
                  {item.aspect}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Python Reality
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.pythonReality}
                    </p>
                  </div>

                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      C# .NET Reality
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.csharpReality}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Code Examples */}
      {activeTab === 'code' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Production AI Implementation Examples</h2>
            <p className="text-xs text-slate-400">
              Inspect how PyTorch calculates automatic derivatives and how modern RAG queries vector embeddings.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                1. PyTorch Autograd & Computational Graph
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                Dynamic backpropagation with gradient accumulation across mathematical tensors.
              </p>
              <CodeBlock
                language="python"
                code={CODE_EXAMPLES_AIML.pytorchTensor}
                title="PyTorch Autograd"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                2. Semantic RAG Search with Sentence-Transformers & Cosine Similarity
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                Encoding documents into dense vector spaces and retrieving matches with zero-copy vector math.
              </p>
              <CodeBlock
                language="python"
                code={CODE_EXAMPLES_AIML.ragPipeline}
                title="RAG Vector Pipeline"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
