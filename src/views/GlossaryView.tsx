import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  Layers,
  Filter,
  Code2,
  ExternalLink
} from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { CodeBlock } from '../components/CodeBlock';

export const GlossaryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'idiom', 'syntax', 'runtime', 'concurrency', 'typing', 'tooling'];

  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.csharpAnalogy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 07
          </span>
          <span className="text-xs text-slate-400">Developer Vocabulary</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Python Developer Terminology & Jargon Glossary
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          Decode the daily slang, community idioms (EAFP, Pythonic, Dunder, BDFL), and runtime mechanisms used by senior Python engineers—fully translated into familiar C# concepts.
        </p>

        {/* Search & Category Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 border-t border-slate-800/80 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter terms (e.g. Dunder, EAFP, MRO, GIL, Walrus)..."
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

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 text-xs">
            No terms found matching &quot;{searchQuery}&quot;. Try adjusting your search query or category filter.
          </div>
        ) : (
          filteredTerms.map(item => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400 border border-amber-500/20">
                      {item.category}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white flex items-center gap-2">
                      {item.term}
                      {item.pronunciation && (
                        <span className="text-xs font-mono text-slate-400 font-normal">
                          [{item.pronunciation}]
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {item.definition}
                </p>

                {/* C# Analogy */}
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    C# .NET Analogy:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.csharpAnalogy}
                  </p>
                </div>

                {/* Example Snippet */}
                {item.exampleSnippet && (
                  <CodeBlock
                    language="python"
                    code={item.exampleSnippet}
                    title="Code Example"
                    showLineNumbers={false}
                  />
                )}
              </div>

              <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Ref: <strong className="text-slate-300">{item.officialRef}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
