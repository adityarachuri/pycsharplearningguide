import { type ReactElement } from 'react';
import {
  BookOpen, Code2, Landmark, HeartPulse, Sigma, Sparkles, Layers,
  Trophy, TrendingUp, Languages, Music, Image, GitBranch, ArrowRight
} from 'lucide-react';
import type { NavSectionId } from '../types';

interface LandingViewProps {
  onNavigate: (id: NavSectionId) => void;
}

const LEARNING_GROUPS = [
  { icon: BookOpen, title: 'Foundations & Architecture', desc: 'History, CPython vs CLR internals, 10 core deep dives, standard library, DSA, and workstation tooling.', nav: 'fundamentals' as NavSectionId },
  { icon: Layers, title: 'Synthesis & Comparative Pedagogy', desc: 'A searchable Rosetta matrix and relational mind maps connecting every C# idiom to its Python equivalent.', nav: 'comparison-matrix' as NavSectionId },
  { icon: Code2, title: 'Hands-On Project Blueprints', desc: 'Two full production builds: a FastAPI web app and a local PyTorch RAG system, video-studio style.', nav: 'web-app-project' as NavSectionId },
  { icon: Landmark, title: 'Industry Vertical Blueprints', desc: 'FinTech and HealthTech: real business workflows, compliance constraints, and end-to-end implementations.', nav: 'fintech-domain' as NavSectionId },
  { icon: Sigma, title: 'Engineering & Systems Practice', desc: 'Standard library depth, web frameworks, testing & deployment, and CPython internals.', nav: 'stdlib-deep-dive' as NavSectionId },
  { icon: Sparkles, title: 'AI/ML & Reference', desc: 'From NumPy fundamentals through the full production AI/ML stack, plus case studies and a glossary.', nav: 'aiml-fundamentals' as NavSectionId },
  { icon: TrendingUp, title: 'Industry Realities & Destiny', desc: 'Research citations, where Python is headed, and career strategy for polyglot engineers.', nav: 'researchers' as NavSectionId }
];

const INNOVATIVE_APPROACHES = [
  { icon: Languages, title: 'Learn Python Like a Human Language', desc: 'Vocabulary, grammar, and conversation as memory hooks for keywords, syntax, and program flow.', nav: 'pedagogy-language' as NavSectionId },
  { icon: Music, title: 'Python as Art: Code, Poetry & Music', desc: 'Rhythm, motif, and composition as a second lens on functions, loops, and program structure.', nav: 'pedagogy-art' as NavSectionId },
  { icon: Image, title: 'Infographics', desc: 'Scalable visual references for execution pipelines, memory management, and concurrency models.', nav: 'infographics' as NavSectionId }
];

export function LandingView({ onNavigate }: LandingViewProps): ReactElement {
  return (
    <div className="space-y-12 animate-fadeIn pb-8">
      {/* Hero */}
      <section className="rounded-3xl border border-slate-800 bg-linear-to-b from-amber-500/10 via-slate-900/60 to-slate-950 p-6 sm:p-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-300">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          POLYGLOT SYSTEMS &amp; TECHNICAL ROSETTA STONE
        </span>
        <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Python, Explained for <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-emerald-300">C# &amp; .NET Engineers</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-slate-300">
          A free, self-paced technical reference and interactive curriculum that maps Python’s runtime, syntax, and ecosystem directly onto the .NET concepts you already know &mdash; from CPython internals to production AI/ML systems, with a real in-browser Python sandbox and original coding challenges along the way.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('fundamentals')}
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 text-sm font-bold transition-colors shadow-md shadow-amber-500/20"
          >
            Start with Chapter 1 <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onNavigate('challenges')}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <Code2 className="h-4 w-4" /> Jump into Coding Challenges
          </button>
        </div>
      </section>

      {/* Who / Why */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Who This Is For</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Primarily built for C#/.NET engineers, architects, and students moving into Python &mdash; but every concept is explained from first principles, so it’s equally usable if you’re new to programming entirely, with no prior C# knowledge assumed to follow along.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Why It Exists</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Most Python material assumes no programming background at all. Experienced engineers waste time wading through beginner pacing to find the parts that actually differ from what they know. This maps directly onto that existing mental model instead.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">What Makes It Different</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            A real, sandboxed Python interpreter running in your browser (not a simulation), original coding challenges with hidden tests, two industry-vertical project blueprints, and explicit &ldquo;where this differs from C#&rdquo; framing throughout.
          </p>
        </div>
      </section>

      {/* Major learning sections */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-amber-400" /> What You&rsquo;ll Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNING_GROUPS.map(group => {
            const Icon = group.icon;
            return (
              <button
                key={group.title}
                onClick={() => onNavigate(group.nav)}
                className="text-left rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">{group.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{group.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* How the journey works */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-amber-400" /> How the Learning Journey Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Read a Chapter', desc: 'Every concept is explained side-by-side with its C# equivalent, with real runnable code.' },
            { step: '2', title: 'Run It Yourself', desc: 'Every code sample opens directly in the in-browser Python sandbox — real CPython, no setup.' },
            { step: '3', title: 'Practice with Challenges', desc: 'Reinforce what you read with original exercises across difficulty levels, checked by hidden tests.' },
            { step: '4', title: 'Track Your Progress', desc: 'Mark chapters mastered and see your challenge completion — all stored locally in your browser.' }
          ].map(s => (
            <div key={s.step} className="space-y-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">{s.step}</span>
              <h3 className="text-xs font-bold text-white">{s.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Innovative approaches */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" /> Innovative Ways to Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INNOVATIVE_APPROACHES.map(a => {
            const Icon = a.icon;
            return (
              <button
                key={a.title}
                onClick={() => onNavigate(a.nav)}
                className="text-left rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2 hover:border-purple-500/40 transition-colors"
              >
                <Icon className="h-5 w-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">{a.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Where to start */}
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3 text-center">
        <Trophy className="h-6 w-6 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Not Sure Where to Start?</h2>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          New to Python entirely: start with <strong className="text-amber-300">Chapter 1</strong> and read in order. Already comfortable with basic syntax: jump to <strong className="text-amber-300">Chapter 2 (Architecture Deep Dive)</strong> or straight into the <strong className="text-amber-300">Coding Challenges</strong> to see where your gaps are.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={() => onNavigate('fundamentals')}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold transition-colors"
          >
            Chapter 1: Fundamentals
          </button>
          <button
            onClick={() => onNavigate('architecture')}
            className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-2 text-xs font-semibold transition-colors"
          >
            Chapter 2: Architecture
          </button>
          <button
            onClick={() => onNavigate('challenges')}
            className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-2 text-xs font-semibold transition-colors"
          >
            Coding Challenges
          </button>
        </div>
      </section>
    </div>
  );
}
