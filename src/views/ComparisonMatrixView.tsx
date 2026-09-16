import React, { useState } from 'react';
import { Table, BrainCircuit, Filter } from 'lucide-react';
import {
  COMPARISON_MATRIX_ITEMS,
  COMPARISON_CATEGORIES
} from '../data/comparisonMatrixData';
import { CodeBlock } from '../components/CodeBlock';
import { MindmapVisualizer } from '../components/MindmapVisualizer';

interface ComparisonMatrixViewProps {
  onOpenSandboxWithCode?: (code: string) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  onOpenSandboxWithCode
}) => {
  const [activeTab, setActiveTab] = useState<'mindmap' | 'matrix'>('mindmap');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems =
    selectedCategory === 'all'
      ? COMPARISON_MATRIX_ITEMS
      : COMPARISON_MATRIX_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
              Chapter 07
            </span>
            <span className="text-xs text-slate-400">Comparative Pedagogy &amp; Mental Models</span>
          </div>

          {/* Primary Tab Navigation: Mindmap vs Matrix */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'mindmap'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Interactive Mindmap</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[9px] font-mono ${
                  activeTab === 'mindmap' ? 'bg-black/20 text-[#ffffff]' : 'bg-slate-900/80 text-amber-300'
                }`}
              >
                Visual
              </span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="h-4 w-4" />
              <span>Rosetta Stone Matrix</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[9px] font-mono ${
                  activeTab === 'matrix' ? 'bg-black/20 text-[#ffffff]' : 'bg-slate-900/80 text-amber-300'
                }`}
              >
                {COMPARISON_MATRIX_ITEMS.length}
              </span>
            </button>
          </div>
        </div>

        <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          C# vs Python Mental Map &amp; Comparison Matrix
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Direct relational mappings and mental models bridging CLR constructs to CPython equivalents. Explore the interactive radial mindmap, trace cognitive pathways from nominal types to duck typing, and compare syntax in the Rosetta Stone modules.
        </p>
      </div>

      {/* VIEW CONTENT */}
      {activeTab === 'mindmap' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-l-2 border-amber-500/40 pl-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Relational Mental Model Canvas</span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                  Interactive
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Select any conceptual domain or leaf node to explore cognitive rewiring, gotchas, and live executable code
              </p>
            </div>
            <button
              onClick={() => setActiveTab('matrix')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <span>View Tabular Cards</span>
              <Table className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Embedded Mindmap Visualizer Component */}
          <MindmapVisualizer onLaunchSandbox={onOpenSandboxWithCode} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Category Filter Pills for Matrix */}
          <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 mr-2">
              <Filter className="h-3.5 w-3.5 text-amber-400" />
              Filter by Category:
            </span>
            {COMPARISON_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-l-2 border-amber-500/40 pl-4">
            <div>
              <h2 className="text-lg font-bold text-white">Comparative Modules</h2>
              <p className="text-xs text-slate-400">
                Showing {filteredItems.length} comparative modules
              </p>
            </div>
            <button
              onClick={() => setActiveTab('mindmap')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>Back to Visual Mindmap</span>
            </button>
          </div>

          {/* Comparisons Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-400 border border-amber-500/20">
                      {item.category}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-white">
                      {item.concept}
                    </h3>
                  </div>
                </div>

                {/* Side-by-Side Code Blocks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <CodeBlock language="csharp" code={item.csharpCode} title="C# Syntax" />
                  <CodeBlock language="python" code={item.pythonCode} title="Pythonic Syntax" />
                </div>

                {/* Mental Shift & Philosophies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      C# Philosophy:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.csharpPhilosophy}
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Python Philosophy:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.pythonPhilosophy}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="text-xs text-slate-300">
                    <strong className="text-amber-400">The Architect's Mental Shift: </strong>
                    {item.mentalShift}
                  </div>
                  <div className="border-t border-slate-800/80 pt-2 text-xs text-emerald-300">
                    <strong className="text-emerald-400">Key Takeaway: </strong>
                    {item.keyTakeaway}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
