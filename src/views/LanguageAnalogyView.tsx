import { type ReactElement } from 'react';
import { Languages, Info } from 'lucide-react';
import { LANGUAGE_ANALOGY_VERDICT, ANALOGY_PAIRS } from '../data/languageAnalogyData';
import { CodeBlock } from '../components/CodeBlock';

export function LanguageAnalogyView(): ReactElement {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Innovative Learning
          </span>
          <span className="text-xs text-slate-400">An Alternative Lens on the Same Material</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Languages className="h-7 w-7 text-amber-400" />
          Learn Python Like a Human Language
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Every human language has vocabulary, grammar, and structure. So does Python. Mapping one onto the other gives you a second mental hook for the same concepts you&rsquo;re learning throughout this curriculum.
        </p>

        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300">Analogy is a learning aid, not a technical equivalence.</strong> {LANGUAGE_ANALOGY_VERDICT}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {ANALOGY_PAIRS.map((pair, idx) => (
          <div key={pair.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 font-mono text-xs font-bold text-amber-300">
                {idx + 1}
              </span>
              <h2 className="text-lg font-bold text-white">
                {pair.humanConcept} <span className="text-slate-500">&rarr;</span> {pair.pythonConcept}
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{pair.explanation}</p>
            <CodeBlock language="python" code={pair.pythonCode} />
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Where the Analogy Breaks Down</span>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">{pair.caveat}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
