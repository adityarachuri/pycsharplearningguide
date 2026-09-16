import { useState, type ReactElement } from 'react';
import { Sigma, Layers, Package, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  STDLIB_VERDICT,
  STDLIB_VERDICT_POINTS,
  STDLIB_CONCEPTS,
  STDLIB_MODULE_TABLE
} from '../data/stdlibDeepDiveData';
import { DualCodeView } from '../components/CodeBlock';

export function StdlibDeepDiveView(): ReactElement {
  const [activeTab, setActiveTab] = useState<'why' | 'concepts' | 'modules'>('why');
  const [selectedConceptId, setSelectedConceptId] = useState<string>(STDLIB_CONCEPTS[0].id);

  const activeConcept =
    STDLIB_CONCEPTS.find(c => c.id === selectedConceptId) || STDLIB_CONCEPTS[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 11
          </span>
          <span className="text-xs text-slate-400">Engineering & Systems Practice</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Standard Library Deep Dive: Beyond the Basics
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          itertools, functools, dataclasses, pathlib, and asyncio &mdash; the &ldquo;batteries&rdquo; that replace what would otherwise be hand-rolled infrastructure code or a third-party NuGet package in C#.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {([
            { id: 'why', label: 'Why It Matters', icon: Sigma },
            { id: 'concepts', label: 'Core Concepts', icon: Layers },
            { id: 'modules', label: 'Module Reference', icon: Package }
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

      {activeTab === 'why' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              The Core Architectural Fact
            </h2>
            <p className="mt-2 text-sm md:text-base font-semibold text-white leading-relaxed">
              &ldquo;{STDLIB_VERDICT}&rdquo;
            </p>
          </div>

          <div className="space-y-4">
            {STDLIB_VERDICT_POINTS.map((point, idx) => (
              <div key={point.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px] text-amber-400">
                    {idx + 1}
                  </span>
                  {point.claim}
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed pl-7">{point.reality}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'concepts' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {STDLIB_CONCEPTS.map(concept => (
              <button
                key={concept.id}
                onClick={() => setSelectedConceptId(concept.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedConceptId === concept.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span className="font-mono text-[11px] opacity-75">0{concept.number}.</span>
                <span>{concept.title.split(':')[0].trim()}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400 font-mono">
                  Concept #{activeConcept.number}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{activeConcept.tagline}</span>
              </div>
              <h2 className="mt-2 text-xl md:text-2xl font-bold text-white">{activeConcept.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Why It Matters in Python</h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{activeConcept.whyItMatters}</p>
                <p className="text-xs text-slate-400 pt-1">
                  <strong className="text-slate-200">Python Approach: </strong>
                  {activeConcept.pythonApproach}
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">C# .NET Equivalence & Approach</h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-mono">{activeConcept.csharpEquivalent}</p>
                <p className="text-xs text-slate-300 pt-1">
                  <strong className="text-purple-200">C# Approach: </strong>
                  {activeConcept.csharpApproach}
                </p>
              </div>
            </div>

            <DualCodeView
              csharpCode={activeConcept.csharpCode}
              pythonCode={activeConcept.pythonCode}
              csharpTitle="C# / .NET Equivalent"
              pythonTitle="Idiomatic Python Standard Library"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="h-4 w-4" />
                  Under the Hood Execution
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{activeConcept.underTheHood}</p>
              </div>

              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4" />
                  C# Developer Pitfalls to Avoid
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  {activeConcept.pitfalls.map((pitfall, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                Architectural Best Practices
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {activeConcept.bestPractices.map((bp, bpIdx) => (
                  <div key={bpIdx} className="flex items-start gap-2 rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Standard Library Module Reference</h2>
            <p className="text-xs text-slate-400">
              Six frequently-reached-for modules, each mapped to its closest .NET/BCL equivalent.
            </p>
          </div>

          <div className="space-y-4">
            {STDLIB_MODULE_TABLE.map(mod => (
              <div key={mod.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 transition-colors">
                <h3 className="text-base font-bold text-white font-mono">{mod.module}</h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{mod.role}</p>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">C# .NET Analogue:</span>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{mod.csharpAnalogue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
