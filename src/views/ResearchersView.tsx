import React, { useState } from 'react';
import { ExternalLink, Users, Search } from 'lucide-react';
import { RESEARCH_PAPERS } from '../data/researcherData';

export const ResearchersView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'language', 'scientific', 'performance', 'typing'];

  const filteredPapers = RESEARCH_PAPERS.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 10
          </span>
          <span className="text-xs text-slate-400">Computer Science Heritage</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Authoritative Citations & Notable Research Papers
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Seminal peer-reviewed publications and technical specifications authored by eminent computer scientists (Guido van Rossum, Travis Oliphant, Wes McKinney, Peter Norvig, Tim Peters, Sam Gross) that established Python’s scientific and architectural hegemony.
        </p>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 border-t border-slate-800/80 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search paper title, author (Guido, Travis, Wes, Norvig), or keyword..."
              aria-label="Search research papers"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="space-y-6">
        {filteredPapers.map(paper => (
          <div
            key={paper.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400 border border-amber-500/20">
                    {paper.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Year: {paper.year}
                  </span>
                </div>
                <h2 className="mt-2 text-lg md:text-xl font-bold text-white">
                  {paper.title}
                </h2>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span>{paper.authors.join(', ')}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">
                  Published in: {paper.venueOrSource}
                </div>
              </div>

              {paper.doiOrUrl && (
                <a
                  href={paper.doiOrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:border-sky-500 transition-colors shrink-0"
                >
                  <span>Official Publication</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Abstract & Key Contribution
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {paper.abstract}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Historical Impact on Python:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {paper.impactOnPython}
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Relevance for C# System Architects:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {paper.relevanceForEngineers}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
