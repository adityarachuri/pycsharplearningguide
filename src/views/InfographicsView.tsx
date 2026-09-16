import { type ReactElement } from 'react';
import { Image } from 'lucide-react';
import { INFOGRAPHICS } from '../data/infographicsData';
import { MermaidViewer } from '../components/MermaidViewer';

export function InfographicsView(): ReactElement {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Visual Learning
          </span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Image className="h-7 w-7 text-amber-400" aria-hidden="true" />
          Infographics
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Quick visual references for the mechanics covered in depth throughout the curriculum &mdash; each diagram renders as scalable vector graphics, so it stays sharp and readable at any screen size.
        </p>
      </div>

      <div className="space-y-6">
        {INFOGRAPHICS.map(info => (
          <div key={info.id} className="space-y-2">
            <p className="text-xs text-slate-400 px-1">{info.purpose}</p>
            <MermaidViewer chart={info.chart} title={info.title} id={info.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
