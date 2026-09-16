import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { DEEP_DIVE_FEATURES } from '../data/deepDivesData';
import { ADVANCED_CONCEPT_LECTURES } from '../data/advancedConceptsData';
import { PYTHON_BATTERIES } from '../data/batteriesData';
import { NavSectionId } from '../types';
import { useEscapeToClose } from '../hooks/useEscapeToClose';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: NavSectionId) => void;
}

const MAX_FILTERED_RESULTS = 8;
const MAX_DEFAULT_RESULTS = 6;

interface SearchResult {
  id: string;
  title: string;
  category: string;
  snippet: string;
  sectionId: NavSectionId;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  // Search items across glossary, deep dives, and advanced lectures
  const allSearchItems: SearchResult[] = [
    // Main Sections — kept in sync with SECTIONS_ORDER in App.tsx; every
    // numbered chapter should have an entry here so search coverage doesn't
    // silently fall behind as chapters are added.
    { id: 'sec-fund', title: '1. Fundamentals & History', category: 'Chapter', snippet: 'Guido van Rossum, ABC language history, and the 19 Zen of Python aphorisms.', sectionId: 'fundamentals' },
    { id: 'sec-arch', title: '2. Architecture Deep Dive', category: 'Chapter', snippet: 'CPython vs CLR, the Global Interpreter Lock (GIL), bytecode evaluation loop, and memory layout.', sectionId: 'architecture' },
    { id: 'sec-deep', title: '3. Deep Dives (10 Core Features)', category: 'Chapter', snippet: 'Generators, Context Managers, Decorators, Dataclasses, Type Hints, and Metaclasses.', sectionId: 'deep-dives' },
    { id: 'sec-batt', title: '4. Libraries & Batteries Included', category: 'Chapter', snippet: 'Deep dive into Python standard library: collections, itertools, asyncio, multiprocessing, pathlib, sqlite3, and decimal.', sectionId: 'libraries-batteries' },
    { id: 'sec-dsa', title: '5. Data Structures & Algorithms', category: 'Chapter', snippet: 'Pythonic DSA, heaps, deques, and complexity contrasts against C# collections.', sectionId: 'dsa-python' },
    { id: 'sec-work', title: '6. Developer Workstation Setup', category: 'Chapter', snippet: 'Modern Python toolchain: uv, Ruff, Pyright, VS Code / PyCharm, Docker multi-stage, and WSL2.', sectionId: 'workstation-setup' },
    { id: 'sec-comp', title: '7. C# vs Python Comparison Matrix', category: 'Chapter', snippet: 'Rosetta Stone syntax translation, LINQ vs Comprehensions, and exception philosophy.', sectionId: 'comparison-matrix' },
    { id: 'sec-adv', title: '8. Advanced Production Lectures', category: 'Chapter', snippet: 'Clean Architecture with Ports & Adapters, Pydantic v2, ASGI servers, and pytest.', sectionId: 'advanced-concepts' },
    { id: 'sec-web-proj', title: '9. Project Blueprint: Full-Stack Web App', category: 'Project Demo', snippet: 'FastAPI, SQLAlchemy 2.0 Async, Pydantic v2, Alembic migrations, uv, and multi-stage Docker.', sectionId: 'web-app-project' },
    { id: 'sec-aiml-proj', title: '10. Project Blueprint: Production AI/ML App', category: 'Project Demo', snippet: 'Local RAG pipeline with PyTorch, Sentence-Transformers embeddings, ChromaDB, and FastAPI SSE streaming.', sectionId: 'aiml-project' },
    { id: 'sec-fintech-domain', title: '11. FinTech: Business Context', category: 'Chapter', snippet: 'Payments, fraud scoring, ledgers, and compliance from the industry perspective.', sectionId: 'fintech-domain' },
    { id: 'sec-fintech-project', title: '12. FinTech: Technical Implementation', category: 'Chapter', snippet: 'Idempotent charges, ONNX fraud scoring, and reconciliation pipelines.', sectionId: 'fintech-project' },
    { id: 'sec-healthtech-domain', title: '13. HealthTech: Business Context', category: 'Chapter', snippet: 'FHIR, de-identification, and HIPAA audit trails from the industry perspective.', sectionId: 'healthtech-domain' },
    { id: 'sec-healthtech-project', title: '14. HealthTech: Technical Implementation', category: 'Chapter', snippet: 'FHIR API implementation, Safe Harbor de-identification, and audit middleware.', sectionId: 'healthtech-project' },
    { id: 'sec-stdlib', title: '15. Standard Library Deep Dive', category: 'Chapter', snippet: 'itertools, dataclasses, pathlib, and asyncio in depth.', sectionId: 'stdlib-deep-dive' },
    { id: 'sec-webframeworks', title: '16. Web & API Frameworks', category: 'Chapter', snippet: 'FastAPI, ASGI, and SQLAlchemy versus ASP.NET Core.', sectionId: 'web-frameworks' },
    { id: 'sec-testing', title: '17. Testing, Packaging & Deployment', category: 'Chapter', snippet: 'pytest, mocking, uv, and multi-stage Docker builds.', sectionId: 'testing-deployment' },
    { id: 'sec-internals', title: '18. Python Internals & CPython', category: 'Chapter', snippet: 'Bytecode, the import system, descriptors, and garbage collection.', sectionId: 'python-internals' },
    { id: 'sec-use', title: '19. Enterprise Use Cases', category: 'Chapter', snippet: 'FinTech quantitative risk, AI/RAG knowledge graph, Big Data with Polars, and Scientific computing.', sectionId: 'use-cases' },
    { id: 'sec-glossary-chapter', title: '20. Terminology Glossary', category: 'Chapter', snippet: 'Dunder methods, EAFP, the walrus operator, MRO, and uv — cross-language disambiguation.', sectionId: 'glossary' },
    { id: 'sec-aiml-fund', title: '21. Python for AI/ML Fundamentals', category: 'Chapter', snippet: 'NumPy, Pandas, vectorization, and broadcasting.', sectionId: 'aiml-fundamentals' },
    { id: 'sec-aiml', title: '22. AI/ML Engineering Stack', category: 'Chapter', snippet: 'PyTorch, CUDA, Hugging Face, vLLM, Qdrant vector databases, and C# vs Python AI comparison.', sectionId: 'aiml-context' },
    { id: 'sec-deep-learning', title: '23. Deep Learning: Engineer to Researcher', category: 'Chapter', snippet: 'Neural network foundations, CNN/RNN/Transformer architectures, and the ML Engineer vs. ML Researcher career spectrum.', sectionId: 'deep-learning' },
    { id: 'sec-trans', title: '24. Transition Roadmap for C# Devs', category: 'Chapter', snippet: '6-phase roadmap, tooling matrix (uv, ruff, pyproject.toml), and 10 critical pitfalls.', sectionId: 'transition' },
    { id: 'sec-researchers', title: '25. Citations & Researchers', category: 'Chapter', snippet: 'Seminal papers and PEP citations from Guido, Travis, Wes, and others.', sectionId: 'researchers' },
    { id: 'sec-future', title: '26. Future & Possibilities', category: 'Chapter', snippet: 'PEP 703 free-threading, the Tier-2 JIT, and WebAssembly.', sectionId: 'future' },
    { id: 'sec-career', title: '27. Career Compass (India & Global)', category: 'Chapter', snippet: 'Salary benchmarks (6 LPA to 1.5 Cr+), GCCs in Bengaluru/Hyderabad, and the C# architect edge.', sectionId: 'career-compass' },
    { id: 'sec-conclusion', title: '28. Synthesis & Conclusion', category: 'Chapter', snippet: 'The Polyglot Systems Architect — learning analytics, career pillars, and the completion certificate.', sectionId: 'conclusion' },
    // Utility / practice pages
    { id: 'sec-home', title: 'Home', category: 'Page', snippet: 'Platform overview and where to start.', sectionId: 'home' },
    { id: 'sec-challenges', title: 'Coding Challenges', category: 'Page', snippet: 'Original DSA and real-world exercises with hidden tests, run in a real Python sandbox.', sectionId: 'challenges' },
    { id: 'sec-infographics', title: 'Infographics', category: 'Page', snippet: 'Visual references for key Python mechanics — execution pipeline, GIL, async, and more.', sectionId: 'infographics' },
    { id: 'sec-pedagogy-language', title: 'Learn Python Like a Language', category: 'Page', snippet: 'Vocabulary, grammar, and conversation analogies for learning Python.', sectionId: 'pedagogy-language' },
    { id: 'sec-pedagogy-art', title: 'Python as Art', category: 'Page', snippet: 'Code, poetry, and music analogies for learning Python.', sectionId: 'pedagogy-art' },
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
      ).slice(0, MAX_FILTERED_RESULTS)
    : allSearchItems.slice(0, MAX_DEFAULT_RESULTS);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search site content"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="flex w-full max-w-2xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden"
      >
        {/* Search input header */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/90 px-4 py-3">
          <Search className="h-5 w-5 text-amber-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search syntax, concepts, C# mappings, PEPs, glossary..."
            aria-label="Search site content"
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
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
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 mt-1 transition-colors shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-900/40 px-4 py-2.5 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Navigate with mouse or click to jump directly</span>
          <span>28 Chapters • 30+ Terms • 10 Deep Dives</span>
        </div>
      </div>
    </div>
  );
};
