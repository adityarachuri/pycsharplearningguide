import React, { useState } from 'react';
import { Calendar, User, Quote, Layers, Sparkles, Globe, ArrowRight } from 'lucide-react';
import {
  PROGRAMMING_TIMELINE,
  CREATOR_PROFILE,
  ZEN_OF_PYTHON,
  FUNDAMENTALS_COMPARISON
} from '../data/fundamentalsData';
import { CodeBlock } from '../components/CodeBlock';
import { NavSectionId } from '../types';

interface FundamentalsViewProps {
  onNavigate?: (id: NavSectionId) => void;
}

export const FundamentalsView: React.FC<FundamentalsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'creator' | 'principles' | 'zen'>('timeline');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Featured Projects Callout Banner: Section III */}
      {onNavigate && (
        <div className="rounded-3xl border border-amber-500/40 bg-linear-to-r from-amber-500/15 via-purple-500/10 to-slate-900 p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-0.5 text-xs font-mono font-bold text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>SECTION III &bull; HANDS-ON PROJECT BLUEPRINTS</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Looking for Real Production Workstation Code &amp; Video Walkthroughs?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Explore complete, runnable production microservices with animated workstation timeline players and live in-browser simulators:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('web-app-project')}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-amber-500/20"
              >
                <Globe className="h-4 w-4" />
                <span>9. Full-Stack Web App (FastAPI)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onNavigate('aiml-project')}
                className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-purple-500/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>10. Production AI/ML (PyTorch RAG)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-400 font-mono">
              PyCSharp
            </span>
            <span className="text-xs font-semibold text-slate-300">
              Polyglot Systems &amp; Technical Rosetta Stone
            </span>
          </div>
          <span className="rounded-full bg-slate-800/80 border border-slate-700/60 px-3 py-1 text-xs text-amber-200 font-medium">
            Learning Python from a C# developer's perspective
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Chapter 01
          </span>
          <span className="text-xs text-slate-400">Foundations &amp; Origin Story</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Fundamentals, History, &amp; The Creator's Ethos
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          An architectural lens on why Guido van Rossum conceived Python in 1989, how it evolved through three major iterations, and how the core design tenets differ philosophically from Anders Hejlsberg’s statically typed C# design.
        </p>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {([
            { id: 'timeline', label: 'History & Timeline', icon: Calendar },
            { id: 'creator', label: 'Guido van Rossum (Creator)', icon: User },
            { id: 'principles', label: 'Language Fundamentals for C# Devs', icon: Layers },
            { id: 'zen', label: 'The Zen of Python (PEP 20)', icon: Quote }
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

      {/* Tab 1: Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Historical Chronology & Milestone PEPs</h2>
            <p className="text-xs text-slate-400">
              Trace Python’s evolution from an ABC successor at CWI Amsterdam to modern Python 3.13 with Tier-2 JIT and optional GIL.
            </p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {PROGRAMMING_TIMELINE.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-amber-400 bg-slate-950 group-hover:scale-125 transition-transform" />
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-amber-400">
                        {item.year}
                      </span>
                      <h3 className="text-base font-bold text-white">{item.version}</h3>
                    </div>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
                      {item.milestone}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>

                  <div className="rounded-lg bg-slate-950/80 p-2.5 border border-slate-800/80 text-xs text-amber-300/90">
                    <strong className="text-amber-400">Impact for Developers: </strong>
                    {item.impactForDev}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Creator Profile */}
      {activeTab === 'creator' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <User className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{CREATOR_PROFILE.name}</h2>
                  <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                    {CREATOR_PROFILE.title}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400">
                  Born {CREATOR_PROFILE.birthYear} ({CREATOR_PROFILE.nationality}) • Current Role: {CREATOR_PROFILE.currentRole}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Background & The Christmas Project
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {CREATOR_PROFILE.background}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  The BDFL Era & PEP 13 Council Transition
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {CREATOR_PROFILE.bdflStory}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Current Work: Microsoft Faster CPython
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {CREATOR_PROFILE.currentWork}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Language Fundamentals for C# */}
      {activeTab === 'principles' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">
              Fundamental Divergences: Python vs C# Conceptual Paradigm
            </h2>
            <p className="text-xs text-slate-400">
              Crucial mental model translations: moving from static CLR variable slots to dynamic reference labels.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {FUNDAMENTALS_COMPARISON.map((fund, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white">{fund.topic}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                      C# .NET Perspective:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {fund.csharpConcept}
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Python Reality:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {fund.pythonConcept}
                    </p>
                  </div>
                </div>

                <CodeBlock
                  language="python"
                  code={fund.codeExample}
                  title={`${fund.topic} Comparison`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Zen of Python */}
      {activeTab === 'zen' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-amber-300">PEP 20: The Zen of Python</h2>
              <p className="text-xs text-slate-300">
                Authored by Tim Peters in 1999; accessible inside any Python shell via <code className="text-amber-400">import this</code>.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400/80">19 Guiding Aphorisms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ZEN_OF_PYTHON.map((rule, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Aphorism #{idx + 1}
                  </span>
                  <span className="text-[11px] text-slate-500">PEP 20</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  &ldquo;{rule.principle}&rdquo;
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {rule.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
