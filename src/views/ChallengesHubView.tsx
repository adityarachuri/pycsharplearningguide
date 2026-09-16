import { useState, useEffect, useMemo, type ReactElement } from 'react';
import {
  Code2, Play, Loader2, CheckCircle2, XCircle, Lightbulb, ChevronRight,
  Trophy, Eye, RotateCcw, Terminal, ListChecks
} from 'lucide-react';
import { CHALLENGES, CHALLENGE_CATEGORIES } from '../data/challengesData';
import type { Challenge, ChallengeDifficulty } from '../types';
import { preloadSandbox, onSandboxReady, isSandboxReady } from '../services/pyodideSandboxService';
import { evaluateChallenge, type ChallengeEvaluation } from '../services/challengeEvaluationService';
import {
  getAllChallengeProgress,
  recordChallengeAttempt,
  recordHintUsed,
  getChallengeStats
} from '../services/challengeProgressService';

const DIFFICULTY_STYLES: Record<ChallengeDifficulty, string> = {
  beginner: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  intermediate: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  advanced: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
};

const ALL_CHALLENGE_IDS = CHALLENGES.map(c => c.id);

export function ChallengesHubView(): ReactElement {
  const [difficultyFilter, setDifficultyFilter] = useState<ChallengeDifficulty | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string>(CHALLENGES[0].id);
  const [code, setCode] = useState<string>(CHALLENGES[0].starterCode);
  const [runtimeReady, setRuntimeReady] = useState<boolean>(isSandboxReady());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<ChallengeEvaluation | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [progressVersion, setProgressVersion] = useState<number>(0);

  useEffect(() => {
    preloadSandbox();
    onSandboxReady(() => setRuntimeReady(true));
  }, []);

  const progress = useMemo(() => getAllChallengeProgress(), [progressVersion]);
  const stats = useMemo(() => getChallengeStats(ALL_CHALLENGE_IDS), [progressVersion]);

  const filteredChallenges = useMemo(() => {
    return CHALLENGES.filter(c => {
      if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      return true;
    });
  }, [difficultyFilter, categoryFilter]);

  const selected: Challenge = useMemo(
    () => CHALLENGES.find(c => c.id === selectedId) || CHALLENGES[0],
    [selectedId]
  );

  const selectChallenge = (challenge: Challenge) => {
    setSelectedId(challenge.id);
    setCode(challenge.starterCode);
    setEvaluation(null);
    setRevealedHints(0);
    setShowSolution(false);
  };

  const handleRunTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setEvaluation(null);
    const result = await evaluateChallenge(selected, code);
    setEvaluation(result);
    if (result.ranAtAll || result.outcomes.length > 0) {
      recordChallengeAttempt(selected.id, result.passedCount, result.totalCount || selected.testCases.length);
      setProgressVersion(v => v + 1);
    }
    setIsRunning(false);
  };

  const handleRevealHint = () => {
    if (revealedHints < selected.hints.length) {
      setRevealedHints(revealedHints + 1);
      recordHintUsed(selected.id);
      setProgressVersion(v => v + 1);
    }
  };

  const record = progress[selected.id];
  const allPassed = evaluation?.allPassed ?? false;
  const exampleTests = selected.testCases.filter(t => t.isExample);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Practice
          </span>
          <span className="text-xs text-slate-400">Programming Challenges &amp; Coding Lab</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Code2 className="h-7 w-7 text-amber-400" />
          Practice What You&rsquo;ve Learned
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Original exercises spanning fundamentals, DSA, OOP, error handling, real-world scenarios, debugging, and refactoring &mdash; each with hidden tests, progressive hints, and a full explanation once you pass. Every submission runs as real CPython, right here in your browser.
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span>
            <strong className="text-white">{stats.completed}</strong> of <strong className="text-white">{stats.total}</strong> challenges completed
            {stats.attempted > stats.completed && (
              <span className="text-slate-500"> &middot; {stats.attempted - stats.completed} in progress</span>
            )}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                difficultyFilter === level
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {level}
            </button>
          ))}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300"
          >
            <option value="all">All categories</option>
            {CHALLENGE_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Challenge list */}
        <div className="space-y-2">
          {filteredChallenges.map(c => {
            const isActive = c.id === selected.id;
            const r = progress[c.id];
            return (
              <button
                key={c.id}
                onClick={() => selectChallenge(c)}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  isActive
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${isActive ? 'text-amber-300' : 'text-white'}`}>{c.title}</span>
                  {r?.completed && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                </div>
                <span className={`mt-1.5 inline-block rounded-full border px-2 py-0.2 text-[10px] font-bold uppercase ${DIFFICULTY_STYLES[c.difficulty]}`}>
                  {c.difficulty}
                </span>
              </button>
            );
          })}
        </div>

        {/* Challenge detail */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{selected.title}</h2>
              <span className={`rounded-full border px-2 py-0.2 text-[10px] font-bold uppercase ${DIFFICULTY_STYLES[selected.difficulty]}`}>
                {selected.difficulty}
              </span>
              {record?.completed && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.2 text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{selected.learningObjective}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{selected.problemStatement}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="font-bold uppercase tracking-wider text-slate-500">Input</span>
                <p className="mt-1 text-slate-300">{selected.inputDescription}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="font-bold uppercase tracking-wider text-slate-500">Output</span>
                <p className="mt-1 text-slate-300">{selected.outputDescription}</p>
              </div>
            </div>

            {selected.constraints.length > 0 && (
              <div className="text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500">Constraints</span>
                <ul className="mt-1 space-y-0.5 text-slate-400">
                  {selected.constraints.map((c, i) => <li key={i}>&bull; {c}</li>)}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Examples</span>
              {selected.examples.map((ex, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] space-y-1">
                  <div><span className="text-amber-400">Input:</span> <span className="text-slate-300">{ex.input}</span></div>
                  <div><span className="text-emerald-400">Output:</span> <span className="text-slate-300">{ex.output}</span></div>
                  {ex.explanation && <div className="text-slate-500 not-italic">{ex.explanation}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3.5 py-2">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                solution.py
              </span>
              <button
                onClick={() => setCode(selected.starterCode)}
                className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-slate-300"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              aria-label="Challenge code editor"
              className="w-full min-h-65 p-4 bg-transparent font-mono text-xs text-amber-200/90 leading-relaxed resize-none focus:outline-hidden"
            />
            <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 bg-slate-900/40 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                {selected.hints.map((_, i) => (
                  <button
                    key={i}
                    disabled={i < revealedHints}
                    onClick={handleRevealHint}
                    title={i < revealedHints ? undefined : `Reveal hint ${i + 1}`}
                    className="text-slate-500 hover:text-amber-400 disabled:text-amber-500 disabled:hover:text-amber-500"
                  >
                    <Lightbulb className="h-4 w-4" />
                  </button>
                ))}
                <span className="text-[10px] text-slate-500">{revealedHints}/{selected.hints.length} hints used</span>
              </div>
              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isRunning ? 'Running...' : runtimeReady ? 'Run Tests' : 'Run Tests (loading runtime...)'}</span>
              </button>
            </div>
            {revealedHints > 0 && (
              <div className="border-t border-slate-800/80 bg-amber-500/5 px-3.5 py-2.5 space-y-1.5">
                {selected.hints.slice(0, revealedHints).map((hint, i) => (
                  <p key={i} className="text-[11px] text-amber-200/90 flex items-start gap-1.5">
                    <Lightbulb className="h-3 w-3 mt-0.5 text-amber-400 shrink-0" />
                    <span>{hint}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          {evaluation && (
            <div className={`rounded-xl border p-4 space-y-3 ${allPassed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/60'}`}>
              <div className="flex items-center gap-2">
                <ListChecks className={`h-4 w-4 ${allPassed ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-sm font-bold text-white">
                  Passed: {evaluation.passedCount}/{evaluation.totalCount || selected.testCases.length} tests
                </span>
                {allPassed && <span className="text-xs text-emerald-400 font-semibold">All tests passed! 🎉</span>}
              </div>

              {evaluation.crashMessage && (
                <pre className="text-[11px] font-mono text-rose-300 bg-slate-950 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                  {evaluation.crashMessage}
                </pre>
              )}

              {evaluation.outcomes.length > 0 && (
                <ul className="space-y-1.5 text-xs">
                  {evaluation.outcomes.map(o => (
                    <li key={o.id} className="flex items-start gap-2">
                      {o.passed
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        : <XCircle className="h-3.5 w-3.5 text-rose-400 mt-0.5 shrink-0" />}
                      <div>
                        <span className={o.passed ? 'text-slate-300' : 'text-rose-300'}>{o.description}</span>
                        {!o.passed && o.error && (
                          <div className="mt-0.5 font-mono text-[10px] text-rose-400/90">{o.error}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Post-completion reveal */}
          {(allPassed || showSolution) && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Explanation & Reference Solution</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{selected.explanation}</p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Complexity</span>
                <p className="mt-1 text-xs text-slate-300">{selected.complexityAnalysis}</p>
              </div>
              <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {selected.referenceSolution}
              </pre>
              <div className="flex flex-wrap gap-1.5">
                {selected.relatedConcepts.map((c, i) => (
                  <span key={i} className="rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[10px] text-slate-400">{c}</span>
                ))}
              </div>
              {selected.nextChallengeId && (
                <button
                  onClick={() => {
                    const next = CHALLENGES.find(c => c.id === selected.nextChallengeId);
                    if (next) selectChallenge(next);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold transition-colors"
                >
                  Next Challenge <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {!allPassed && !showSolution && exampleTests.length > 0 && !evaluation && (
            <button
              onClick={() => setShowSolution(true)}
              className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300"
            >
              <Eye className="h-3.5 w-3.5" /> Stuck? Reveal the explanation & reference solution
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
