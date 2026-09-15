import React from 'react';
import { FUTURE_TRENDS } from '../data/futureData';

export const FutureView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 11
          </span>
          <span className="text-xs text-slate-400">Horizon & Evolution</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          The Future of Python: No-GIL, Native JIT, & The Rust Tooling Era
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          An honest, non-hyped technical appraisal of Python’s trajectory through 2030: PEP 703 multi-core scaling, the Copy-and-Patch JIT compiler, Rust-powered infrastructure, and client-side WebAssembly execution.
        </p>
      </div>

      {/* Future Trends List */}
      <div className="space-y-6">
        {FUTURE_TRENDS.map((trend, idx) => (
          <div
            key={trend.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-400 border border-amber-500/20">
                    {trend.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Horizon: {trend.timeframe}
                  </span>
                </div>
                <h2 className="mt-2 text-lg md:text-xl font-bold text-white">
                  {trend.title}
                </h2>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-200 leading-relaxed">
              {trend.summary}
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Technical Specification & Mechanism
              </h3>
              <div className="whitespace-pre-line text-xs text-slate-300 leading-relaxed font-mono">
                {trend.technicalDetails}
              </div>
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
                Strategic Takeaway for Enterprise Architects
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {trend.implicationsForArchitects}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
