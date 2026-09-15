import React, { useState } from 'react';
import { Workflow } from 'lucide-react';
import { USE_CASE_STUDIES } from '../data/useCasesData';

export const UseCasesView: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    USE_CASE_STUDIES[0].id
  );

  const activeCase =
    USE_CASE_STUDIES.find(c => c.id === selectedCaseId) || USE_CASE_STUDIES[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 06
          </span>
          <span className="text-xs text-slate-400">Industrial Case Studies</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Enterprise Use Cases: Python in Mission-Critical Systems
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Realistic customer and institutional architectural breakdowns: FinTech high-frequency payment routing, GenAI graph RAG, and Big Data telemetry processing.
        </p>

        {/* Case Selector Pills */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {USE_CASE_STUDIES.map(uc => (
            <button
              key={uc.id}
              onClick={() => setSelectedCaseId(uc.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs md:text-sm font-semibold transition-all ${
                selectedCaseId === uc.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">
                {uc.companyOrDomain.split('&')[0].trim()}
              </span>
              <span className="line-clamp-1">{uc.title.split('&')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Case Study Body */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-8">
        {/* Case Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                {activeCase.companyOrDomain}
              </span>
              <span className="text-xs text-slate-400">
                Scale: <strong className="text-white">{activeCase.scale}</strong>
              </span>
            </div>
            <h2 className="mt-2 text-xl md:text-2xl font-bold text-white">
              {activeCase.title}
            </h2>
          </div>
        </div>

        {/* Quantitative Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activeCase.performanceMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center space-y-1 hover:border-amber-500/30 transition-colors"
            >
              <div className="text-xl md:text-2xl font-black text-amber-400 font-mono">
                {metric.value}
              </div>
              <div className="text-xs font-bold text-white">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Problem Statement vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              The Enterprise Challenge
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {activeCase.problemStatement}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Python Architectural Solution
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {activeCase.pythonSolution}
            </p>
          </div>
        </div>

        {/* Architecture Pipeline Workflow */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            End-to-End Architectural Pipeline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeCase.architectureWorkflow.map(step => (
              <div
                key={step.step}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold mb-1">
                    <span>Step 0{step.step}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="border-t border-slate-800/80 pt-2 text-[10px] font-mono text-emerald-400">
                  {step.tech}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* C# Comparison & Key Takeaway */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              C# .NET Architectural Contrast
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {activeCase.csharpComparison}
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Lead Architect Takeaway
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {activeCase.keyTakeaway}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
