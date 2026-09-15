import React, { useState } from 'react';
import { Search, X, ChevronRight, BookOpen, Hash, ArrowRight } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { DEEP_DIVE_FEATURES } from '../data/deepDivesData';
import { ADVANCED_CONCEPT_LECTURES } from '../data/advancedConceptsData';
import { PYTHON_BATTERIES } from '../data/batteriesData';
import { NavSectionId } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: NavSectionId) => void;
}

interface SearchResult {
  id: string;
  title: string;
  category: string;
  snippet: string;
  sectionId: NavSectionId;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  // Search items across glossary, deep dives, and advanced lectures
  const allSearchItems: SearchResult[] = [
    // Main Sections
    { id: 'sec-fund', title: 'Fundamentals & History', category: 'Chapter', snippet: 'Guido van Rossum, ABC language history, and the 19 Zen of Python aphorisms.', sectionId: 'fundamentals' },
    { id: 'sec-arch', title: 'Architecture Deep Dive', category: 'Chapter', snippet: 'CPython vs CLR, the Global Interpreter Lock (GIL), bytecode evaluation loop, and memory layout.', sectionId: 'architecture' },
    { id: 'sec-deep', title: 'Deep Dives (10 Core Features)', category: 'Chapter', snippet: 'Generators, Context Managers, Decorators, Dataclasses, Type Hints, and Metaclasses.', sectionId: 'deep-dives' },
    { id: 'sec-batt', title: 'Libraries & Batteries Included', category: 'Chapter', snippet: 'Deep dive into Python standard library: collections, itertools, asyncio, multiprocessing, pathlib, sqlite3, and decimal.', sectionId: 'libraries-batteries' },
    { id: 'sec-work', title: 'Developer Workstation Setup', category: 'Chapter', snippet: 'Modern Python toolchain: uv, Ruff, Pyright, VS Code / PyCharm, Docker multi-stage, and WSL2.', sectionId: 'workstation-setup' },
    { id: 'sec-comp', title: 'C# vs Python Comparison Matrix', category: 'Chapter', snippet: 'Rosetta Stone syntax translation, LINQ vs Comprehensions, and exception philosophy.', sectionId: 'comparison-matrix' },
    { id: 'sec-adv', title: 'Advanced Production Lectures', category: 'Chapter', snippet: 'Clean Architecture with Ports & Adapters, Pydantic v2, ASGI servers, and pytest.', sectionId: 'advanced-concepts' },
    { id: 'sec-web-proj', title: 'Project Blueprint: Full-Stack Web App', category: 'Project Demo', snippet: 'FastAPI, SQLAlchemy 2.0 Async, Pydantic v2, Alembic migrations, uv, and multi-stage Docker.', sectionId: 'web-app-project' },
    { id: 'sec-aiml-proj', title: 'Project Blueprint: Production AI/ML App', category: 'Project Demo', snippet: 'Local RAG pipeline with PyTorch, Sentence-Transformers embeddings, ChromaDB, and FastAPI SSE streaming.', sectionId: 'aiml-project' },
    { id: 'sec-use', title: 'Enterprise Use Cases', category: 'Chapter', snippet: 'FinTech quantitative risk, AI/RAG knowledge graph, Big Data with Polars, and Scientific computing.', sectionId: 'use-cases' },
    { id: 'sec-aiml', title: 'AI/ML Engineering Stack', category: 'Chapter', snippet: 'PyTorch, CUDA, Hugging Face, vLLM, Qdrant vector databases, and C# vs Python AI comparison.', sectionId: 'aiml-context' },
    { id: 'sec-trans', title: 'Transition Roadmap for C# Devs', category: 'Chapter', snippet: '6-phase roadmap, tooling matrix (uv, ruff, pyproject.toml), and 10 critical pitfalls.', sectionId: 'transition' },
    { id: 'sec-career', title: 'Career Compass (India & Global)', category: 'Chapter', snippet: 'Salary benchmarks (6 LPA to 1.5 Cr+), GCCs in Bengaluru/Hyderabad, and the C# architect edge.', sectionId: 'career-compass' },
    // Deep dives
    ...DEEP_DIVE_FEATURES.map(f => ({
      id: f.id,
      title: f.title,
      category: 'Feature Deep Dive',
      snippet: `${f.tagline} - ${f.whyItMatters}`,
      sectionId: 'deep-dives' as NavSectionId
    })),
    // Standard Library Batteries
    ...PYTHON_BATTERIES.map(b => ({
      id: `batt-${b.id}`,
      title: `${b.name} (Battery Included)`,
      category: 'Standard Library',
      snippet: `${b.tagline} - C# Analogy: ${b.dotNetEquivalent}`,
      sectionId: 'libraries-batteries' as NavSectionId
    })),
    // Advanced lectures
    ...ADVANCED_CONCEPT_LECTURES.map(l => ({
      id: l.id,
      title: l.title,
      category: 'Production Lecture',
      snippet: `${l.subtitle} - ${l.industryRelevance}`,
      sectionId: 'advanced-concepts' as NavSectionId
    })),
    // Glossary terms
    ...GLOSSARY_TERMS.map(g => ({
      id: g.id,
      title: g.term,
      category: 'Glossary Term',
      snippet: g.definition,
      sectionId: 'glossary' as NavSectionId
    }))
  ];

  const filtered = query.trim()
    ? allSearchItems.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.snippet.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : allSearchItems.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Search input header */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/90 px-4 py-3">
          <Search className="h-5 w-5 text-amber-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search syntax, concepts, C# mappings, PEPs, glossary..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="ml-2 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching concepts or terms found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.sectionId);
                  onClose();
                }}
                className="group flex w-full items-start justify-between rounded-xl p-3 text-left hover:bg-slate-900/90 transition-colors"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400 border border-amber-500/20">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-amber-300">
                      {item.title}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 mt-1 transition-colors flex-shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-900/40 px-4 py-2.5 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Navigate with mouse or click to jump directly</span>
          <span>13 Chapters • 30+ Terms • 10 Deep Dives</span>
        </div>
      </div>
    </div>
  );
};
