import React, { useState } from 'react';
import { Calendar, Layers, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';
import {
  TRANSITION_ROADMAP,
  TOOLING_TRANSLATION_MATRIX,
  CSHARP_TO_PYTHON_PITFALLS
} from '../data/transitionData';

export const TransitionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tooling' | 'pitfalls'>('roadmap');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 09
          </span>
          <span className="text-xs text-slate-400">Career Migration Playbook</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          C# to Python Transition Roadmap for Experienced Professionals
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          A phased, actionable 60-day curriculum tailored for senior, lead, and architect .NET engineers to transition smoothly into high-performance Python environments.
        </p>

        {/* Tab Controls */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {([
            { id: 'roadmap', label: '6-Phase 60-Day Roadmap', icon: Calendar },
            { id: 'tooling', label: 'Tooling Translation Matrix', icon: Layers },
            { id: 'pitfalls', label: '10 Unforgivable Pitfalls', icon: AlertTriangle }
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

      {/* Tab 1: 6-Phase Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">60-Day Architectural Migration Phases</h2>
            <p className="text-xs text-slate-400">
              Designed to preserve your distributed systems intuition while dismantling unnecessary ceremony.
            </p>
          </div>

          <div className="space-y-6">
            {TRANSITION_ROADMAP.map(phase => (
              <div
                key={phase.phase}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 font-mono text-xs font-bold text-amber-300">
                      P{phase.phase}
                    </span>
                    <div>
                      <span className="text-[11px] font-mono text-amber-400 font-medium">
                        {phase.timeframe}
                      </span>
                      <h3 className="text-base font-bold text-white">{phase.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 text-xs text-purple-200">
                  <strong className="text-purple-300">The C# Architect Shift: </strong>
                  {phase.csharpAnalogy}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Actionable Sprints & Tasks
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                    {phase.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                  <span>Authoritative Reading:</span>
                  {phase.recommendedReading.map((book, bIdx) => (
                    <span
                      key={bIdx}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300"
                    >
                      {book}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tooling Matrix */}
      {activeTab === 'tooling' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Tooling Translation Matrix</h2>
            <p className="text-xs text-slate-400">
              Direct equivalents from MSBuild, Visual Studio, and NuGet to the modern Python ecosystem.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-4">Discipline</th>
                    <th className="p-4 text-purple-300">.NET / C# Toolchain</th>
                    <th className="p-4 text-amber-400">Modern Python Standard</th>
                    <th className="p-4">Architectural Guidance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {TOOLING_TRANSLATION_MATRIX.map((tool, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {tool.category}
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        {tool.csharpTool}
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-300">
                        {tool.pythonTool}
                      </td>
                      <td className="p-4 text-slate-400 leading-relaxed">
                        {tool.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pitfalls */}
      {activeTab === 'pitfalls' && (
        <div className="space-y-6">
          <div className="border-l-2 border-rose-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">10 Unforgivable Pitfalls C# Devs Make in Python</h2>
            <p className="text-xs text-slate-400">
              Subtle traps where valid C# habits produce bugs or anti-patterns in Python.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CSHARP_TO_PYTHON_PITFALLS.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-rose-500/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <h3 className="text-sm font-bold text-white">{item.pitfall}</h3>
                </div>
                <div className="rounded-lg bg-rose-500/5 border border-rose-500/10 p-3 text-xs text-rose-200/90 leading-relaxed font-mono">
                  {item.description}
                </div>
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 text-xs text-emerald-300 leading-relaxed">
                  <strong className="text-emerald-400">The Pythonic Fix: </strong>
                  {item.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
