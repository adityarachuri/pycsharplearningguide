import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Lightbulb, Check } from 'lucide-react';
import { DAILY_CHALLENGES } from '../data/dailyChallengesData';
import { CodeBlock } from './CodeBlock';
import { useEscapeToClose } from '../hooks/useEscapeToClose';

const NOTE_SAVED_RESET_MS = 2000;

interface DailyTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedChapters: string[];
  onToggleChapter: (chapterId: string) => void;
  notes: Record<string, string>;
  onSaveNote: (chapterId: string, note: string) => void;
  activeChapterId: string;
}

export const DailyTeacherModal: React.FC<DailyTeacherModalProps> = ({
  isOpen,
  onClose,
  completedChapters,
  onToggleChapter,
  notes,
  onSaveNote,
  activeChapterId
}) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeTab, setActiveTab] = useState<'challenge' | 'notes'>('challenge');
  const [showSolution, setShowSolution] = useState(false);
  const [currentNote, setCurrentNote] = useState(notes[activeChapterId] || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const challenge = DAILY_CHALLENGES.find(c => c.dayNumber === selectedDay) || DAILY_CHALLENGES[0];

  const handleSaveCurrentNote = () => {
    onSaveNote(activeChapterId, currentNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), NOTE_SAVED_RESET_MS);
  };

  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Daily Teacher & Practice"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Daily Teacher & Study Companion
              </h2>
              <p className="text-xs text-slate-400">
                Daily interactive bite-sized micro-challenges designed for busy C# developers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close daily teacher modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('challenge')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'challenge'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            Daily Challenge ({challenge.dayNumber}/7)
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'notes'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            My Study Notes & Chapter Progress
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'challenge' ? (
            <div className="space-y-6">
              {/* Day Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {DAILY_CHALLENGES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedDay(c.dayNumber);
                      setShowSolution(false);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                      selectedDay === c.dayNumber
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Day {c.dayNumber}
                  </button>
                ))}
              </div>

              {/* Challenge Details */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Day {challenge.dayNumber} Challenge
                  </span>
                  <span className="text-xs text-slate-400">5-minute practice</span>
                </div>
                <h3 className="mt-1 text-base font-bold text-white">
                  {challenge.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {challenge.prompt}
                </p>
              </div>

              {/* C# Starting Point vs Starter Python */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CodeBlock
                  language="csharp"
                  code={challenge.csharpCode}
                  title="Familiar C# Implementation"
                />
                <CodeBlock
                  language="python"
                  code={challenge.starterPython}
                  title="Python Challenge Task"
                />
              </div>

              {/* Solution Toggle & Explanation */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Need the idiomatic solution?</h4>
                    <p className="text-xs text-slate-400">
                      Inspect Pythonic syntax and the architectural rationale.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
                  >
                    {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                  </button>
                </div>

                {showSolution && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
                    <CodeBlock
                      language="python"
                      code={challenge.solutionPython}
                      title="Idiomatic Python Solution"
                    />
                    <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4 text-xs leading-relaxed text-sky-200">
                      <strong className="font-bold text-sky-300">Why this is Pythonic: </strong>
                      {challenge.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Study Notes for active chapter */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Personal Study Notes for: <strong className="text-amber-400 capitalize">{activeChapterId.replace('-', ' ')}</strong></span>
                  {noteSaved && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      Saved
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Record personal observations, syntax mnemonics, or enterprise questions. Persisted in browser storage.
                </p>
                <textarea
                  value={currentNote}
                  onChange={e => setCurrentNote(e.target.value)}
                  placeholder="e.g., Remember to use structural Protocol instead of abstract interface classes in our microservice..."
                  rows={6}
                  className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleSaveCurrentNote}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              {/* Curriculum Progress Checklist */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">
                  Curriculum Mastery Tracker ({completedChapters.length}/13 completed)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'fundamentals', name: '1. Fundamentals & History' },
                    { id: 'architecture', name: '2. Architecture Deep Dive' },
                    { id: 'deep-dives', name: '3. Deep Dives (10 Features)' },
                    { id: 'comparison-matrix', name: '4. C# vs Python Matrix' },
                    { id: 'advanced-concepts', name: '5. Production Lectures' },
                    { id: 'use-cases', name: '6. Real-World Case Studies' },
                    { id: 'glossary', name: '7. Terminology Glossary' },
                    { id: 'aiml-context', name: '8. AI/ML Engineering Stack' },
                    { id: 'transition', name: '9. C# to Python Roadmap' },
                    { id: 'researchers', name: '10. Citations & Researchers' },
                    { id: 'future', name: '11. Future of Python' },
                    { id: 'career-compass', name: '12. Career Compass (India)' },
                    { id: 'conclusion', name: '13. Synthesis & Certification' }
                  ].map(chap => {
                    const isDone = completedChapters.includes(chap.id);
                    return (
                      <button
                        key={chap.id}
                        onClick={() => onToggleChapter(chap.id)}
                        className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                          isDone
                            ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                            : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-medium">{chap.name}</span>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            isDone
                              ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                              : 'border-slate-700 bg-slate-950'
                          }`}
                        >
                          {isDone && <Check className="h-3 w-3 stroke-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
