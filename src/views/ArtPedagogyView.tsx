import { type ReactElement } from 'react';
import { Music, Info } from 'lucide-react';
import { ART_PEDAGOGY_VERDICT, ART_ANALOGIES } from '../data/artPedagogyData';
import { CodeBlock } from '../components/CodeBlock';

export function ArtPedagogyView(): ReactElement {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-purple-500/10 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
            Innovative Learning
          </span>
          <span className="text-xs text-slate-400">An Alternative Lens on the Same Material</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Music className="h-7 w-7 text-purple-400" />
          Python as Art: Code, Poetry &amp; Music
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Rhythm, motif, structure, and improvisation-within-form aren&rsquo;t just musical ideas &mdash; they describe real properties of well-written code. This chapter uses that shared vocabulary as a second way to see the same concepts from the rest of the curriculum.
        </p>

        <div className="mt-6 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-purple-300 shrink-0 mt-0.5" />
          <p className="text-xs text-purple-200/90 leading-relaxed">
            <strong className="text-purple-300">Why this analogy is more than decoration:</strong> {ART_PEDAGOGY_VERDICT}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {ART_ANALOGIES.map((pair, idx) => (
          <div key={pair.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 font-mono text-xs font-bold text-purple-300">
                {idx + 1}
              </span>
              <h2 className="text-lg font-bold text-white">
                {pair.artConcept} <span className="text-slate-500">&rarr;</span> {pair.pythonConcept}
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
