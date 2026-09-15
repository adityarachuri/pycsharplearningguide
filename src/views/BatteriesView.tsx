import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Code2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { PYTHON_BATTERIES } from '../data/batteriesData';
import { DualCodeView } from '../components/CodeBlock';

interface BatteriesViewProps {
  initialBatteryId?: string;
}

export const BatteriesView: React.FC<BatteriesViewProps> = ({ initialBatteryId }) => {
  // State: Selected battery ID (null means overview catalog, string means individual dedicated page)
  const [selectedBatteryId, setSelectedBatteryId] = useState<string>(() => {
    return initialBatteryId || PYTHON_BATTERIES[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedImport, setCopiedImport] = useState(false);

  // Persistent tracked mastered batteries
  const [masteredBatteries, setMasteredBatteries] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('python_csharp_mastered_batteries');
      return saved ? JSON.parse(saved) : ['collections'];
    } catch {
      return ['collections'];
    }
  });

  // Quiz state for the active battery
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Save mastered batteries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('python_csharp_mastered_batteries', JSON.stringify(masteredBatteries));
    } catch {}
  }, [masteredBatteries]);

  // Reset quiz state when switching battery
  useEffect(() => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setCopiedImport(false);
  }, [selectedBatteryId]);

  const activeBattery = useMemo(() => {
    return PYTHON_BATTERIES.find(b => b.id === selectedBatteryId) || PYTHON_BATTERIES[0];
  }, [selectedBatteryId]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(PYTHON_BATTERIES.map(b => b.category)));
    return ['All', ...cats];
  }, []);

  const filteredBatteries = useMemo(() => {
    return PYTHON_BATTERIES.filter(b => {
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.dotNetEquivalent.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleMastery = (id: string) => {
    setMasteredBatteries(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const copyImportCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedImport(true);
    setTimeout(() => setCopiedImport(false), 2000);
  };

  // Next / Previous battery index
  const currentIndex = PYTHON_BATTERIES.findIndex(b => b.id === selectedBatteryId);
  const prevBattery = currentIndex > 0 ? PYTHON_BATTERIES[currentIndex - 1] : null;
  const nextBattery = currentIndex < PYTHON_BATTERIES.length - 1 ? PYTHON_BATTERIES[currentIndex + 1] : null;

  const isMastered = masteredBatteries.includes(activeBattery.id);
  const progressPercent = Math.round((masteredBatteries.length / PYTHON_BATTERIES.length) * 100);

  return (
    <div className="space-y-8 animate-fadeIn" id="batteries-view-root">
      {/* Hero Header */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
              Batteries Included
            </span>
            <span className="text-xs text-slate-400">
              Python Standard Library & Core Ecosystem
            </span>
          </div>

          {/* Mastery Counter */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs">
            <span className="text-slate-400">Mastery Progress:</span>
            <span className="font-mono font-bold text-amber-400">
              {masteredBatteries.length} / {PYTHON_BATTERIES.length}
            </span>
            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-slate-400">{progressPercent}%</span>
          </div>
        </div>

        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Box className="h-7 w-7 text-amber-400" />
          <span>Python Libraries & "Batteries Included" Deep Dives</span>
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Python’s famous philosophy is <strong className="text-white">"Batteries Included"</strong> — a comprehensive, C-accelerated standard library that provides enterprise-grade data structures, event loops, zero-copy I/O, and relational persistence without installing third-party packages.
        </p>

        {/* Quick battery selector tabs */}
        <div className="mt-6 border-t border-slate-800/80 pt-6">
          <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center justify-between">
            <span>Select a Battery / Library Page to Learn in Detail:</span>
            <span className="text-[11px] text-slate-500">{PYTHON_BATTERIES.length} modules available</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PYTHON_BATTERIES.map((battery) => {
              const isBatteryMastered = masteredBatteries.includes(battery.id);
              const isCurrent = battery.id === selectedBatteryId;
              return (
                <button
                  key={battery.id}
                  id={`select-battery-${battery.id}`}
                  onClick={() => {
                    setSelectedBatteryId(battery.id);
                    const el = document.getElementById('battery-detail-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50'
                      : isBatteryMastered
                      ? 'bg-slate-900 text-emerald-400 border border-emerald-500/30 hover:bg-slate-800'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {isBatteryMastered && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span>{battery.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* INDIVIDUAL BATTERY DEDICATED PAGE */}
      <section
        id="battery-detail-section"
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-8"
      >
        {/* Detail Page Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400">
                {activeBattery.category}
              </span>
              <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-300 font-mono">
                C# Analogy: {activeBattery.dotNetEquivalent.split('(')[0].trim()}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-mono">
              {activeBattery.name}
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
              {activeBattery.tagline}
            </p>
          </div>

          {/* Action buttons: Mark Mastered & Jump to Previous/Next */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="toggle-battery-mastery-btn"
              onClick={() => toggleMastery(activeBattery.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
                isMastered
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white'
              }`}
            >
              {isMastered ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Mastered Library</span>
                </>
              ) : (
                <>
                  <Square className="h-4 w-4 text-slate-500" />
                  <span>Mark as Mastered</span>
                </>
              )}
            </button>

            {prevBattery && (
              <button
                onClick={() => setSelectedBatteryId(prevBattery.id)}
                className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title={`Previous: ${prevBattery.name}`}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{prevBattery.name}</span>
              </button>
            )}

            {nextBattery && (
              <button
                onClick={() => setSelectedBatteryId(nextBattery.id)}
                className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title={`Next: ${nextBattery.name}`}
              >
                <span className="hidden sm:inline">{nextBattery.name}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Copyable Import Statement Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Canonical Import:
            </span>
            <code className="font-mono text-xs text-amber-300 whitespace-pre">
              {activeBattery.importStatement}
            </code>
          </div>
          <button
            onClick={() => copyImportCode(activeBattery.importStatement)}
            className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
          >
            {copiedImport ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Import</span>
              </>
            )}
          </button>
        </div>

        {/* Mental Model Shift & .NET Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              Mental Model Shift for C# Engineers
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {activeBattery.mentalModelShift}
            </p>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              .NET BCL Equivalence & Alignment
            </div>
            <p className="text-xs md:text-sm font-mono text-purple-200 leading-relaxed">
              {activeBattery.dotNetEquivalent}
            </p>
          </div>
        </div>

        {/* CPython C-Level Architecture & Internals */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="h-4 w-4" />
            Under The Hood: CPython C-Level Internals & Memory Layout
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {activeBattery.cpythonInternals}
          </p>
        </div>

        {/* Key Classes, Methods and Functions Reference */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Key Classes, Functions & Signatures
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono">
                <tr>
                  <th className="px-4 py-3 font-semibold">Component</th>
                  <th className="px-4 py-3 font-semibold">Signature</th>
                  <th className="px-4 py-3 font-semibold">Purpose & Runtime Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {activeBattery.keyClassesAndFunctions.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-amber-300 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-blue-300 whitespace-nowrap">
                      {item.signature}
                    </td>
                    <td className="px-4 py-3 text-slate-300 leading-relaxed">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side-by-side Comparative Rosetta Stone Code View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Rosetta Stone: C# Architecture vs Idiomatic Python Battery
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Interactive side-by-side comparative code
            </span>
          </div>

          <DualCodeView
            csharpCode={activeBattery.csharpExample}
            pythonCode={activeBattery.pythonExample}
            csharpTitle="C# / .NET Implementation"
            pythonTitle={`Python Battery (${activeBattery.name}) Implementation`}
          />
        </div>

        {/* Production Use Cases & Engineering Pitfalls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Production Use Cases */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              Enterprise Production Architecture Patterns
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {activeBattery.productionUseCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pitfalls & Gotchas */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              Critical Pitfalls & Anti-Patterns to Avoid
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {activeBattery.pitfalls.map((pitfall, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5">⚠</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Best Practices Checklist */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <CheckSquare className="h-4 w-4" />
            Senior Engineering Best Practices Checklist
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeBattery.bestPractices.map((bp, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 text-xs text-slate-300 leading-relaxed flex items-start gap-2"
              >
                <span className="font-mono text-amber-400 font-bold shrink-0">0{idx + 1}.</span>
                <span>{bp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Knowledge Verification Quiz */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              Knowledge Verification: {activeBattery.name}
            </div>
            <span className="text-[11px] text-slate-400">Mini-Quiz</span>
          </div>

          <p className="text-sm font-semibold text-white">
            {activeBattery.quiz.question}
          </p>

          <div className="space-y-2">
            {activeBattery.quiz.options.map((option, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = idx === activeBattery.quiz.correctIndex;
              let optionClass = 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900';

              if (isQuizSubmitted) {
                if (isCorrect) {
                  optionClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-200 font-medium';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'border-rose-500 bg-rose-500/15 text-rose-200';
                } else {
                  optionClass = 'border-slate-800 bg-slate-950/60 text-slate-500';
                }
              } else if (isSelected) {
                optionClass = 'border-amber-500 bg-amber-500/10 text-amber-200 font-medium';
              }

              return (
                <button
                  key={idx}
                  disabled={isQuizSubmitted}
                  onClick={() => setSelectedQuizOption(idx)}
                  className={`w-full text-left rounded-xl border p-3 text-xs transition-all flex items-center justify-between ${optionClass}`}
                >
                  <span>{option}</span>
                  {isQuizSubmitted && isCorrect && (
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            {!isQuizSubmitted ? (
              <button
                disabled={selectedQuizOption === null}
                onClick={() => setIsQuizSubmitted(true)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedQuizOption(null);
                  setIsQuizSubmitted(false);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </button>
            )}

            {isQuizSubmitted && (
              <span
                className={`text-xs font-semibold ${
                  selectedQuizOption === activeBattery.quiz.correctIndex
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {selectedQuizOption === activeBattery.quiz.correctIndex
                  ? '✓ Correct! Outstanding understanding.'
                  : '✗ Review the architectural explanation below.'}
              </span>
            )}
          </div>

          {isQuizSubmitted && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-400">Architectural Rationale: </strong>
              {activeBattery.quiz.explanation}
            </div>
          )}
        </div>

        {/* Page Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('all-batteries-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Browse All Batteries Catalog</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {prevBattery && (
              <button
                onClick={() => {
                  setSelectedBatteryId(prevBattery.id);
                  const el = document.getElementById('battery-detail-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev: {prevBattery.name}</span>
              </button>
            )}

            {nextBattery && (
              <button
                onClick={() => {
                  setSelectedBatteryId(nextBattery.id);
                  const el = document.getElementById('battery-detail-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-colors"
              >
                <span>Next: {nextBattery.name}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ALL BATTERIES CATALOG & FILTERABLE DIRECTORY */}
      <section id="all-batteries-catalog" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-400" />
              <span>Comprehensive Standard Library Catalog</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Search and filter across all standard library modules and their .NET equivalents
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by library or C# analogy..."
              aria-label="Filter by library or C# analogy"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Battery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatteries.map(battery => {
            const isBatteryMastered = masteredBatteries.includes(battery.id);
            const isCurrentlySelected = battery.id === selectedBatteryId;

            return (
              <div
                key={battery.id}
                id={`card-${battery.id}`}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isCurrentlySelected
                    ? 'border-amber-500/60 bg-amber-500/5 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-slate-700/80 bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                      {battery.category}
                    </span>
                    {isBatteryMastered ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        Mastered
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">To Study</span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white font-mono flex items-center justify-between">
                      <span>{battery.name}</span>
                    </h4>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {battery.tagline}
                    </p>
                  </div>

                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-2.5 py-1.5 text-[11px] font-mono text-purple-300">
                    <span className="text-[10px] text-purple-400 uppercase font-sans font-bold block">
                      .NET Analogy
                    </span>
                    <span className="line-clamp-1">{battery.dotNetEquivalent}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleMastery(battery.id)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {isBatteryMastered ? 'Mark unlearned' : 'Mark mastered'}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedBatteryId(battery.id);
                      const el = document.getElementById('battery-detail-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      isCurrentlySelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <span>Learn in Detail</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBatteries.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center text-slate-400">
            <p className="text-sm font-semibold text-slate-300">No libraries match your search.</p>
            <p className="mt-1 text-xs text-slate-500">Try changing your category or search term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
