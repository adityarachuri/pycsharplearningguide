import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  Award,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { ADVANCED_CONCEPT_LECTURES } from '../data/advancedConceptsData';
import { CodeBlock } from '../components/CodeBlock';

export const AdvancedConceptsView: React.FC = () => {
  const [selectedLectureId, setSelectedLectureId] = useState<string>(
    ADVANCED_CONCEPT_LECTURES[0].id
  );

  const activeLecture =
    ADVANCED_CONCEPT_LECTURES.find(l => l.id === selectedLectureId) ||
    ADVANCED_CONCEPT_LECTURES[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 05
          </span>
          <span className="text-xs text-slate-400">Production Mastery</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Advanced Production Lectures: Enterprise Grade Python
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Full-blown masterclasses on production engineering: Clean Architecture (Hexagonal/Ports & Adapters), Pydantic v2 validation, Asyncio TaskGroups, ASGI servers, and industrial Pytest quality suites.
        </p>

        {/* Lecture Selector Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {ADVANCED_CONCEPT_LECTURES.map((lecture, idx) => (
            <button
              key={lecture.id}
              onClick={() => setSelectedLectureId(lecture.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                selectedLectureId === lecture.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span className="font-mono text-xs opacity-75">Lecture 0{idx + 1}</span>
              <span className="hidden sm:inline">•</span>
              <span className="line-clamp-1">{lecture.title.split('&')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Lecture Body */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold text-amber-400">
              {activeLecture.subtitle}
            </span>
            <h2 className="mt-1 text-xl md:text-2xl font-bold text-white">
              {activeLecture.title}
            </h2>
          </div>
        </div>

        {/* Relevance & C# Counterpart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Industry Relevance in Production
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {activeLecture.industryRelevance}
            </p>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              C# .NET Architectural Counterpart
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {activeLecture.csharpCounterpart}
            </p>
          </div>
        </div>

        {/* Lecture Modules */}
        <div className="space-y-6 pt-4">
          {activeLecture.modules.map((mod, mIdx) => (
            <div
              key={mIdx}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 space-y-4"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 font-mono text-xs font-bold text-amber-400">
                  {mIdx + 1}
                </span>
                {mod.heading}
              </h3>

              <div className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {mod.body}
              </div>

              {mod.codeExample && (
                <div>
                  {mod.codeExample.python && (
                    <CodeBlock
                      language="python"
                      code={mod.codeExample.python}
                      title={mod.codeExample.caption || 'Python Implementation'}
                    />
                  )}
                  {mod.codeExample.csharp && (
                    <div className="mt-3">
                      <CodeBlock
                        language="csharp"
                        code={mod.codeExample.csharp}
                        title="C# Equivalent"
                      />
                    </div>
                  )}
                </div>
              )}

              {mod.callout && (
                <div
                  className={`rounded-xl p-4 text-xs leading-relaxed border ${
                    mod.callout.type === 'warning'
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                      : mod.callout.type === 'insight'
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider mb-1">
                    {mod.callout.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                    ) : (
                      <Lightbulb className="h-4 w-4 text-amber-400" />
                    )}
                    <span>{mod.callout.type.toUpperCase()}</span>
                  </div>
                  <p>{mod.callout.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
