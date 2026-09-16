import React from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  Box,
  Binary,
  Terminal,
  GraduationCap,
  Briefcase,
  HelpCircle,
  BrainCircuit,
  Compass,
  FileText,
  Rocket,
  TrendingUp,
  Award,
  CheckCircle2,
  X,
  Globe,
  Sparkles,
  Sigma,
  Package,
  Server,
  ShieldCheck,
  Landmark,
  HeartPulse,
  Home,
  Image,
  Code2,
  Languages,
  Music,
  Network
} from 'lucide-react';
import { NavSectionId } from '../types';

interface SidebarProps {
  activeSection: NavSectionId;
  onSelectSection: (sectionId: NavSectionId) => void;
  isOpen: boolean;
  onClose: () => void;
  completedChapters: string[];
}

interface NavGroup {
  label: string;
  items: {
    id: NavSectionId;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const UTILITY_NAV_ITEMS: NavGroup['items'] = [
  { id: 'home', label: 'Home', sublabel: 'Start here — platform overview', icon: Home },
  { id: 'challenges', label: 'Coding Challenges', sublabel: 'Original exercises with a real Python sandbox', icon: Code2, badge: 'Practice' },
  { id: 'infographics', label: 'Infographics', sublabel: 'Visual references for key mechanics', icon: Image },
  { id: 'pedagogy-language', label: 'Learn Python Like a Language', sublabel: 'Vocabulary, grammar & conversation analogies', icon: Languages },
  { id: 'pedagogy-art', label: 'Python as Art', sublabel: 'Code, poetry & music analogies', icon: Music }
];

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'I. Foundations & Architecture',
    items: [
      {
        id: 'fundamentals',
        label: '1. Fundamentals & Creator',
        sublabel: 'Guido, ABC history & Zen of Python',
        icon: BookOpen
      },
      {
        id: 'architecture',
        label: '2. Architecture Deep Dive',
        sublabel: 'CPython vs CLR, GIL & Bytecode',
        icon: Cpu,
        badge: 'Core'
      },
      {
        id: 'deep-dives',
        label: '3. Core Deep Dives (10)',
        sublabel: 'Generators, Contexts, Decorators',
        icon: Layers
      },
      {
        id: 'libraries-batteries',
        label: '4. Libraries & Batteries',
        sublabel: 'Standard library modules in detail',
        icon: Box,
        badge: 'Batteries'
      },
      {
        id: 'dsa-python',
        label: '5. Data Structures & Algorithms',
        sublabel: 'Pythonic DSA, Heaps, Deques & C# Contrasts',
        icon: Binary,
        badge: 'Algorithms'
      },
      {
        id: 'workstation-setup',
        label: '6. Workstation Setup',
        sublabel: 'uv, Ruff, Pyright, Docker, WSL2',
        icon: Terminal,
        badge: 'Setup'
      }
    ]
  },
  {
    label: 'II. Synthesis & Comparative Pedagogy',
    items: [
      {
        id: 'comparison-matrix',
        label: '7. Matrix & Mindmap',
        sublabel: 'Relational visualizer & Rosetta stone',
        icon: BrainCircuit,
        badge: 'Mindmap'
      },
      {
        id: 'advanced-concepts',
        label: '8. Production Lectures',
        sublabel: 'Clean Arch, Pydantic, ASGI, Pytest',
        icon: GraduationCap
      }
    ]
  },
  {
    label: 'III. Hands-On Project Blueprints',
    items: [
      {
        id: 'web-app-project',
        label: '9. Project: Full-Stack Web App',
        sublabel: 'FastAPI, SQLAlchemy 2.0, Alembic, Docker',
        icon: Globe,
        badge: 'Live Demo'
      },
      {
        id: 'aiml-project',
        label: '10. Project: Production AI/ML App',
        sublabel: 'Local RAG, PyTorch, ChromaDB, SSE',
        icon: Sparkles,
        badge: 'Video Studio'
      }
    ]
  },
  {
    label: 'IV. Industry Vertical Blueprints',
    items: [
      {
        id: 'fintech-domain',
        label: '11. FinTech: Business Context',
        sublabel: 'Payments, fraud scoring, ledgers & compliance',
        icon: Landmark,
        badge: 'New'
      },
      {
        id: 'fintech-project',
        label: '12. FinTech: Technical Implementation',
        sublabel: 'Idempotent charges, ONNX fraud scoring, reconciliation',
        icon: Landmark,
        badge: 'Video Studio'
      },
      {
        id: 'healthtech-domain',
        label: '13. HealthTech: Business Context',
        sublabel: 'FHIR, de-identification, HIPAA audit trails',
        icon: HeartPulse,
        badge: 'New'
      },
      {
        id: 'healthtech-project',
        label: '14. HealthTech: Technical Implementation',
        sublabel: 'FHIR API, Safe Harbor, audit middleware',
        icon: HeartPulse,
        badge: 'Video Studio'
      }
    ]
  },
  {
    label: 'V. Engineering & Systems Practice',
    items: [
      {
        id: 'stdlib-deep-dive',
        label: '15. Standard Library Deep Dive',
        sublabel: 'itertools, dataclasses, pathlib, asyncio',
        icon: Package,
        badge: 'New'
      },
      {
        id: 'web-frameworks',
        label: '16. Web & API Frameworks',
        sublabel: 'FastAPI, ASGI, SQLAlchemy vs ASP.NET Core',
        icon: Server,
        badge: 'New'
      },
      {
        id: 'testing-deployment',
        label: '17. Testing, Packaging & Deployment',
        sublabel: 'pytest, mocking, uv, Docker multi-stage',
        icon: ShieldCheck,
        badge: 'New'
      },
      {
        id: 'python-internals',
        label: '18. Python Internals & CPython',
        sublabel: 'Bytecode, import system, descriptors, GC',
        icon: Cpu,
        badge: 'New'
      }
    ]
  },
  {
    label: 'VI. Reference & AI/ML Frontier',
    items: [
      {
        id: 'use-cases',
        label: '19. Real-World Case Studies',
        sublabel: 'FinTech, Big Data, GenAI, Science',
        icon: Briefcase
      },
      {
        id: 'glossary',
        label: '20. Terminology Glossary',
        sublabel: 'Dunder, EAFP, Walrus, MRO, uv',
        icon: HelpCircle
      },
      {
        id: 'aiml-fundamentals',
        label: '21. Python for AI/ML Fundamentals',
        sublabel: 'NumPy, Pandas, vectorization & broadcasting',
        icon: Sigma
      },
      {
        id: 'aiml-context',
        label: '22. AI/ML Engineering Stack',
        sublabel: 'PyTorch, CUDA, vLLM, Qdrant & .NET',
        icon: BrainCircuit,
        badge: 'AI Stack'
      },
      {
        id: 'deep-learning',
        label: '23. Deep Learning: Engineer to Researcher',
        sublabel: 'Neural nets, Transformers, career spectrum',
        icon: Network,
        badge: 'New'
      },
      {
        id: 'transition',
        label: '24. C# to Python Roadmap',
        sublabel: '6 phases, tooling & 10 pitfalls',
        icon: Compass
      }
    ]
  },
  {
    label: 'VII. Industry Realities & Destiny',
    items: [
      {
        id: 'researchers',
        label: '25. Citations & Researchers',
        sublabel: 'Seminal papers by Guido, Travis, Wes',
        icon: FileText
      },
      {
        id: 'future',
        label: '26. Future & Possibilities',
        sublabel: 'PEP 703 No-GIL, Tier-2 JIT & Wasm',
        icon: Rocket
      },
      {
        id: 'career-compass',
        label: '27. Career Compass (India)',
        sublabel: 'Salaries, GCCs, startups & strategy',
        icon: TrendingUp
      },
      {
        id: 'conclusion',
        label: '28. Synthesis & Conclusion',
        sublabel: 'The Polyglot Systems Architect',
        icon: Award
      }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isOpen,
  onClose,
  completedChapters
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs sm:w-80 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 lg:static lg:translate-x-0 lg:w-80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 lg:hidden">
          <span className="text-sm font-bold text-white">Course Navigation</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav aria-label="Course navigation" className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Utility items: Home, Challenges, Infographics, pedagogy pages — not
              part of the numbered curriculum, so excluded from the Overall Course
              Progress bar's chapter count (App.tsx, computed from SECTIONS_ORDER). */}
          <div className="space-y-1 rounded-2xl border border-slate-800 bg-slate-900/40 p-2">
            {UTILITY_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    onClose();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{item.label}</span>
                        {item.badge && (
                          <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-bold uppercase text-amber-400">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.sublabel}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {NAV_GROUPS.map((group, groupIdx) => {
            const isProjectsGroup = group.label.includes('Hands-On');

            return (
              <div
                key={groupIdx}
                className={`space-y-1 ${
                  isProjectsGroup
                    ? 'rounded-2xl border border-amber-500/30 bg-amber-500/5 p-2'
                    : ''
                }`}
              >
                <div
                  className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center justify-between ${
                    isProjectsGroup
                      ? 'bg-linear-to-r from-amber-500/20 via-purple-500/15 to-transparent text-amber-300'
                      : 'text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isProjectsGroup && <Sparkles className="h-3 w-3 text-amber-400" />}
                    <span>{group.label}</span>
                  </span>
                  {isProjectsGroup && (
                    <span className="text-[9px] bg-amber-500/30 border border-amber-500/40 text-amber-200 px-1.5 py-0.2 rounded font-mono font-bold">
                      NEW
                    </span>
                  )}
                </div>

                <div className="mt-1 space-y-1">
                  {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const isCompleted = completedChapters.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectSection(item.id);
                        onClose();
                      }}
                      className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                        isActive
                          ? 'bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-amber-400'
                              : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{item.label}</span>
                            {item.badge && (
                              <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-bold uppercase text-amber-400">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.sublabel}
                          </p>
                        </div>
                      </div>

                      {isCompleted && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        </nav>
      </aside>
    </>
  );
};
