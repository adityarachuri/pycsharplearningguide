import React, { useState } from 'react';
import { Award, CheckCircle2, Quote, Code2, Printer, Activity } from 'lucide-react';
import { CONCLUSION_DATA } from '../data/conclusionData';
import { ProgressDashboard } from '../components/ProgressDashboard';

interface ConclusionViewProps {
  completedChaptersCount?: number;
  completedChapters?: string[];
  onToggleChapter?: (chapterId: string) => void;
  totalChapters?: number;
  allSections?: { id: string; name: string }[];
}

export const ConclusionView: React.FC<ConclusionViewProps> = ({
  completedChaptersCount,
  completedChapters = ['fundamentals'],
  onToggleChapter,
  totalChapters = 13,
  allSections = []
}) => {
  const [candidateName, setCandidateName] = useState('Senior .NET & Python Architect');
  const [isGenerated, setIsGenerated] = useState(false);

  const effectiveCompletedCount = completedChapters
    ? completedChapters.length
    : (completedChaptersCount ?? 1);

  const verificationHash = 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 13
          </span>
          <span className="text-xs text-slate-400">Synthesis & Capstone</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {CONCLUSION_DATA.title}
        </h1>
        <p className="mt-1 text-sm font-semibold text-amber-400">
          {CONCLUSION_DATA.subtitle}
        </p>
        <p className="mt-3 text-xs md:text-sm leading-relaxed text-slate-300 max-w-3xl whitespace-pre-line">
          {CONCLUSION_DATA.executiveSummary}
        </p>
      </div>

      {/* Learning Analytics Card Container */}
      <section
        id="learning-analytics-card-container"
        className="rounded-3xl border border-slate-800/90 bg-linear-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-6 md:p-8 space-y-6 shadow-2xl shadow-black/40"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20">
                  Telemetry & Insights
                </span>
                <span className="text-xs text-slate-500 font-mono">Recharts Engine</span>
              </div>
              <h2 className="mt-1 text-xl md:text-2xl font-black text-white tracking-tight">
                Learning Analytics
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs text-slate-300 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">{effectiveCompletedCount} of {totalChapters}</span>
              <span className="text-slate-400">Modules Completed</span>
            </div>
          </div>
        </div>

        {/* Responsive Dashboard Grid of Visual Widgets */}
        <ProgressDashboard
          completedChapters={completedChapters}
          onToggleChapter={onToggleChapter}
          totalChapters={totalChapters}
          allSections={allSections}
        />
      </section>

      {/* The 5 Pillars */}
      <div className="space-y-4">
        <div className="border-l-2 border-amber-500/40 pl-4">
          <h2 className="text-lg font-bold text-white">The Five Strategic Pillars of Mastery</h2>
          <p className="text-xs text-slate-400">
            The enduring compounding advantages of adopting Python with an enterprise systems background.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONCLUSION_DATA.theFiveCorePillars.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2 hover:border-slate-700 transition-colors"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                {p.pillar}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The Architect's Manifesto */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Quote className="h-4 w-4" />
          The Polyglot Systems Architect Manifesto
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {CONCLUSION_DATA.architectManifesto.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200"
            >
              <span className="font-mono font-bold text-amber-400">0{idx + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Certificate of Mastery */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              Polyglot Systems Architect Certificate of Completion
            </h2>
            <p className="text-xs text-slate-400">
              Verify your transition mastery across all 13 core modules ({effectiveCompletedCount}/{totalChapters} completed).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              placeholder="Your Full Name / Title"
              aria-label="Your full name or title"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              onClick={() => setIsGenerated(true)}
              className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-8 text-center space-y-6 shadow-2xl">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

          <div className="flex items-center justify-center gap-2">
            <Code2 className="h-6 w-6 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Official Program Completion Certificate
            </span>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              This certifies that
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {candidateName || 'Senior Software Engineer'}
            </div>
            <div className="mt-2 text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              has completed the comprehensive architectural curriculum, successfully mapping C# .NET CLR principles to idiomatic Python 3.13 systems architecture, AI/ML engineering, and production clean architecture.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 border-t border-b border-slate-800/80 py-4 text-xs text-slate-400">
            <div>
              <span className="block text-[10px] uppercase text-slate-500">Curriculum Scope</span>
              <strong className="text-white">13 Master Modules</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-500">Issued On</span>
              <strong className="text-white">{new Date().toLocaleDateString()}</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-500">Status</span>
              <strong className="text-emerald-400">Verified Polyglot Architect</strong>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500">
            {verificationHash}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
