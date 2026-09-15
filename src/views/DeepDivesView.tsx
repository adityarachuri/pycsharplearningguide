import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DEEP_DIVE_FEATURES } from '../data/deepDivesData';
import { DualCodeView } from '../components/CodeBlock';

export const DeepDivesView: React.FC = () => {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>(
    DEEP_DIVE_FEATURES[0].id
  );

  const activeFeature =
    DEEP_DIVE_FEATURES.find(f => f.id === selectedFeatureId) ||
    DEEP_DIVE_FEATURES[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 03
          </span>
          <span className="text-xs text-slate-400">Core Language Capabilities</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          10 Essential Python Features: Deep Dive for C# Developers
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Ten architectural building blocks that every C# engineer must master to write idiomatic, high-throughput Python instead of transliterated C#.
        </p>

        {/* Feature quick selector pills */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {DEEP_DIVE_FEATURES.map((feature, idx) => (
            <button
              key={feature.id}
              onClick={() => setSelectedFeatureId(feature.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedFeatureId === feature.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span className="font-mono text-[11px] opacity-75">
                {feature.number < 10 ? `0${feature.number}.` : `${feature.number}.`}
              </span>
              <span>{feature.title.split('&')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Content Detail */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400 font-mono">
                Feature #{activeFeature.number}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {activeFeature.tagline}
              </span>
            </div>
            <h2 className="mt-2 text-xl md:text-2xl font-bold text-white">
              {activeFeature.title}
            </h2>
          </div>
        </div>

        {/* Overview & C# Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Why It Matters in Python
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {activeFeature.whyItMatters}
            </p>
            <p className="text-xs text-slate-400 pt-1">
              <strong className="text-slate-200">Python Approach: </strong>
              {activeFeature.pythonApproach}
            </p>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              C# .NET Equivalence & Approach
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-mono">
              {activeFeature.csharpEquivalent}
            </p>
            <p className="text-xs text-slate-300 pt-1">
              <strong className="text-purple-200">C# Approach: </strong>
              {activeFeature.csharpApproach}
            </p>
          </div>
        </div>

        {/* Dual Code Block with side-by-side view */}
        <DualCodeView
          csharpCode={activeFeature.csharpCode}
          pythonCode={activeFeature.pythonCode}
          csharpTitle="C# Paradigm"
          pythonTitle="Idiomatic Python Equivalent"
        />

        {/* Under the hood & Pitfalls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="h-4 w-4" />
              Under the Hood Execution
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {activeFeature.underTheHood}
            </p>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              C# Developer Pitfalls to Avoid
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              {activeFeature.pitfalls.map((pitfall, pIdx) => (
                <li key={pIdx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Best Practices */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" />
            Architectural Best Practices
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            {activeFeature.bestPractices.map((bp, bpIdx) => (
              <div key={bpIdx} className="flex items-start gap-2 rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{bp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
