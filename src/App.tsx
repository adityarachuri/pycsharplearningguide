import { lazy, Suspense, useState, useEffect, type ReactElement } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NavSectionId, AppTheme } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { DailyTeacherModal } from './components/DailyTeacherModal';
import { BackgroundSyncDrawer } from './components/BackgroundSyncDrawer';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { InteractiveSandboxModal } from './components/InteractiveSandboxModal';
import { Footer } from './components/Footer';
import { dbService } from './services/dbIntegrationService';
import { LandingView } from './views/LandingView';

const InfographicsView = lazy(() => import('./views/InfographicsView').then(module => ({ default: module.InfographicsView })));
const ChallengesHubView = lazy(() => import('./views/ChallengesHubView').then(module => ({ default: module.ChallengesHubView })));
const LanguageAnalogyView = lazy(() => import('./views/LanguageAnalogyView').then(module => ({ default: module.LanguageAnalogyView })));
const ArtPedagogyView = lazy(() => import('./views/ArtPedagogyView').then(module => ({ default: module.ArtPedagogyView })));
const FundamentalsView = lazy(() => import('./views/FundamentalsView').then(module => ({ default: module.FundamentalsView })));
const ArchitectureView = lazy(() => import('./views/ArchitectureView').then(module => ({ default: module.ArchitectureView })));
const DeepDivesView = lazy(() => import('./views/DeepDivesView').then(module => ({ default: module.DeepDivesView })));
const BatteriesView = lazy(() => import('./views/BatteriesView').then(module => ({ default: module.BatteriesView })));
const DsaPythonView = lazy(() => import('./views/DsaPythonView').then(module => ({ default: module.DsaPythonView })));
const WorkstationSetupView = lazy(() => import('./views/WorkstationSetupView').then(module => ({ default: module.WorkstationSetupView })));
const ComparisonMatrixView = lazy(() => import('./views/ComparisonMatrixView').then(module => ({ default: module.ComparisonMatrixView })));
const AdvancedConceptsView = lazy(() => import('./views/AdvancedConceptsView').then(module => ({ default: module.AdvancedConceptsView })));
const WebAppProjectView = lazy(() => import('./views/WebAppProjectView').then(module => ({ default: module.WebAppProjectView })));
const AimlProjectView = lazy(() => import('./views/AimlProjectView').then(module => ({ default: module.AimlProjectView })));
const FintechDomainView = lazy(() => import('./views/FintechDomainView').then(module => ({ default: module.FintechDomainView })));
const FintechProjectView = lazy(() => import('./views/FintechProjectView').then(module => ({ default: module.FintechProjectView })));
const HealthtechDomainView = lazy(() => import('./views/HealthtechDomainView').then(module => ({ default: module.HealthtechDomainView })));
const HealthtechProjectView = lazy(() => import('./views/HealthtechProjectView').then(module => ({ default: module.HealthtechProjectView })));
const StdlibDeepDiveView = lazy(() => import('./views/StdlibDeepDiveView').then(module => ({ default: module.StdlibDeepDiveView })));
const WebFrameworksView = lazy(() => import('./views/WebFrameworksView').then(module => ({ default: module.WebFrameworksView })));
const TestingDeploymentView = lazy(() => import('./views/TestingDeploymentView').then(module => ({ default: module.TestingDeploymentView })));
const PythonInternalsView = lazy(() => import('./views/PythonInternalsView').then(module => ({ default: module.PythonInternalsView })));
const UseCasesView = lazy(() => import('./views/UseCasesView').then(module => ({ default: module.UseCasesView })));
const GlossaryView = lazy(() => import('./views/GlossaryView').then(module => ({ default: module.GlossaryView })));
const AimlFundamentalsView = lazy(() => import('./views/AimlFundamentalsView').then(module => ({ default: module.AimlFundamentalsView })));
const AimlView = lazy(() => import('./views/AimlView').then(module => ({ default: module.AimlView })));
const DeepLearningView = lazy(() => import('./views/DeepLearningView').then(module => ({ default: module.DeepLearningView })));
const TransitionView = lazy(() => import('./views/TransitionView').then(module => ({ default: module.TransitionView })));
const ResearchersView = lazy(() => import('./views/ResearchersView').then(module => ({ default: module.ResearchersView })));
const FutureView = lazy(() => import('./views/FutureView').then(module => ({ default: module.FutureView })));
const CareerView = lazy(() => import('./views/CareerView').then(module => ({ default: module.CareerView })));
const ConclusionView = lazy(() => import('./views/ConclusionView').then(module => ({ default: module.ConclusionView })));

const SECTIONS_ORDER: { id: NavSectionId; name: string }[] = [
  { id: 'fundamentals', name: '1. Fundamentals & Creator' },
  { id: 'architecture', name: '2. Architecture Deep Dive' },
  { id: 'deep-dives', name: '3. Core Deep Dives (10)' },
  { id: 'libraries-batteries', name: '4. Libraries & Batteries' },
  { id: 'dsa-python', name: '5. Data Structures & Algorithms' },
  { id: 'workstation-setup', name: '6. Workstation Setup' },
  { id: 'comparison-matrix', name: '7. C# vs Python Matrix' },
  { id: 'advanced-concepts', name: '8. Production Lectures' },
  { id: 'web-app-project', name: '9. Project: Full-Stack Web App' },
  { id: 'aiml-project', name: '10. Project: Production AI/ML App' },
  { id: 'fintech-domain', name: '11. FinTech: Business Context' },
  { id: 'fintech-project', name: '12. FinTech: Technical Implementation' },
  { id: 'healthtech-domain', name: '13. HealthTech: Business Context' },
  { id: 'healthtech-project', name: '14. HealthTech: Technical Implementation' },
  { id: 'stdlib-deep-dive', name: '15. Standard Library Deep Dive' },
  { id: 'web-frameworks', name: '16. Web & API Frameworks' },
  { id: 'testing-deployment', name: '17. Testing, Packaging & Deployment' },
  { id: 'python-internals', name: '18. Python Internals & CPython' },
  { id: 'use-cases', name: '19. Real-World Case Studies' },
  { id: 'glossary', name: '20. Terminology Glossary' },
  { id: 'aiml-fundamentals', name: '21. Python for AI/ML Fundamentals' },
  { id: 'aiml-context', name: '22. AI/ML Engineering Stack' },
  { id: 'deep-learning', name: '23. Deep Learning: Engineer to Researcher' },
  { id: 'transition', name: '24. C# to Python Roadmap' },
  { id: 'researchers', name: '25. Citations & Researchers' },
  { id: 'future', name: '26. Future of Python' },
  { id: 'career-compass', name: '27. Career Compass' },
  { id: 'conclusion', name: '28. Synthesis & Certification' }
];

export default function App(): ReactElement {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [sandboxPresetId, setSandboxPresetId] = useState<string>('comprehension');
  const [sandboxCustomCode, setSandboxCustomCode] = useState<string | undefined>(undefined);
  const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());

  // Persistent progress & study notes via dbService repository
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    return dbService.getProgress();
  });

  // Persistent Theme: 'slate' (Deep Slate Dark Mode), 'idle' (Python IDLE Light Mode) or 'reading' (Warm Sepia)
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('python_csharp_theme');
      if (saved === 'idle' || saved === 'slate' || saved === 'reading') return saved as AppTheme;
      return 'slate';
    } catch {
      return 'slate';
    }
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    return dbService.getNotes();
  });

  // Apply and synchronize theme preference with document and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('python_csharp_theme', theme);
    } catch {}

    // Reset classes
    document.documentElement.classList.remove('theme-idle', 'theme-reading', 'dark');
    document.body.classList.remove('theme-idle', 'theme-reading', 'bg-slate-950');

    if (theme === 'idle') {
      document.documentElement.classList.add('theme-idle');
      document.documentElement.setAttribute('data-theme', 'idle');
      document.body.classList.add('theme-idle');
    } else if (theme === 'reading') {
      document.documentElement.classList.add('theme-reading');
      document.documentElement.setAttribute('data-theme', 'reading');
      document.body.classList.add('theme-reading');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'slate');
      document.body.classList.add('bg-slate-950');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => {
      if (prev === 'slate') return 'idle';
      if (prev === 'idle') return 'reading';
      return 'slate';
    });
  };

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('python_csharp_completed', JSON.stringify(completedChapters));
    } catch {}
  }, [completedChapters]);

  useEffect(() => {
    try {
      localStorage.setItem('python_csharp_notes', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  // Register background service worker
  useEffect(() => {
    // Only register in production builds. Vite's dev server serves modules from the same
    // origin the service worker cache-first-caches as "static assets" — registering it in
    // dev causes it to serve stale cached JS chunks across dev-server restarts/HMR updates,
    // which shows up as bizarre "Invalid hook call" / null-React errors as modules go stale.
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .catch(err => {
          console.warn('[App] ServiceWorker registration skipped:', err);
        });
    }

    // Global keyboard shortcut: Cmd+K / Ctrl+K opens search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsTeacherOpen(false);
        setIsSandboxOpen(false);
        setIsSyncDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Periodic simulated sync heartbeat every 60s
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleChapter = (chapterId: string) => {
    setCompletedChapters(prev => {
      const next = prev.includes(chapterId)
        ? prev.filter(c => c !== chapterId)
        : [...prev, chapterId];
      dbService.saveProgress(next);
      return next;
    });
  };

  const handleSaveNote = (chapterId: string, note: string) => {
    dbService.saveNote(chapterId, note);
    setNotes(prev => ({ ...prev, [chapterId]: note }));
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    dbService
      .syncStateWithBackend()
      .catch(err => {
        console.warn('[App] Background sync failed:', err);
      })
      .finally(() => {
        setIsSyncing(false);
        setLastSyncTime(new Date().toLocaleTimeString());
      });
  };

  // Previous & Next Chapter navigation
  const currentIndex = SECTIONS_ORDER.findIndex(s => s.id === activeSection);
  const prevSection = currentIndex > 0 ? SECTIONS_ORDER[currentIndex - 1] : null;
  const nextSection = currentIndex < SECTIONS_ORDER.length - 1 ? SECTIONS_ORDER[currentIndex + 1] : null;

  const isCurrentChapterCompleted = completedChapters.includes(activeSection);

  const viewLoadingState = (
    <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
      <div className="flex items-center gap-3 text-sm text-slate-400" role="status" aria-live="polite">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        Loading curriculum module...
      </div>
    </div>
  );

  // Render current chapter view
  const renderView = () => {
    switch (activeSection) {
      case 'home':
        return (
          <LandingView
            onNavigate={id => {
              setActiveSection(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'infographics':
        return <InfographicsView />;
      case 'challenges':
        return <ChallengesHubView />;
      case 'pedagogy-language':
        return <LanguageAnalogyView />;
      case 'pedagogy-art':
        return <ArtPedagogyView />;
      case 'fundamentals':
        return (
          <FundamentalsView
            onNavigate={id => {
              setActiveSection(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'architecture':
        return <ArchitectureView />;
      case 'deep-dives':
        return <DeepDivesView />;
      case 'libraries-batteries':
        return <BatteriesView />;
      case 'dsa-python':
        return (
          <DsaPythonView
            onOpenSandboxWithCode={() => {
              setSandboxPresetId('heapq-priority-queue');
              setIsSandboxOpen(true);
            }}
          />
        );
      case 'workstation-setup':
        return <WorkstationSetupView />;
      case 'comparison-matrix':
        return (
          <ComparisonMatrixView
            onOpenSandboxWithCode={code => {
              setSandboxCustomCode(code);
              setIsSandboxOpen(true);
            }}
          />
        );
      case 'advanced-concepts':
        return <AdvancedConceptsView />;
      case 'web-app-project':
        return <WebAppProjectView />;
      case 'aiml-project':
        return <AimlProjectView />;
      case 'fintech-domain':
        return <FintechDomainView />;
      case 'fintech-project':
        return <FintechProjectView />;
      case 'healthtech-domain':
        return <HealthtechDomainView />;
      case 'healthtech-project':
        return <HealthtechProjectView />;
      case 'stdlib-deep-dive':
        return <StdlibDeepDiveView />;
      case 'web-frameworks':
        return <WebFrameworksView />;
      case 'testing-deployment':
        return <TestingDeploymentView />;
      case 'python-internals':
        return <PythonInternalsView />;
      case 'use-cases':
        return <UseCasesView />;
      case 'glossary':
        return <GlossaryView />;
      case 'aiml-fundamentals':
        return <AimlFundamentalsView />;
      case 'aiml-context':
        return <AimlView />;
      case 'deep-learning':
        return <DeepLearningView />;
      case 'transition':
        return <TransitionView />;
      case 'researchers':
        return <ResearchersView />;
      case 'future':
        return <FutureView />;
      case 'career-compass':
        return <CareerView />;
      case 'conclusion':
        return (
          <ConclusionView
            completedChapters={completedChapters}
            onToggleChapter={handleToggleChapter}
            totalChapters={SECTIONS_ORDER.length}
            allSections={SECTIONS_ORDER}
          />
        );
      default:
        return (
          <LandingView
            onNavigate={id => {
              setActiveSection(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
    }
  };

  return (
    <div
      id="app-root-container"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        theme === 'idle'
          ? 'theme-idle bg-[#f8fafc] text-[#0f172a] selection:bg-[#fde68a] selection:text-[#78350f]'
          : theme === 'reading'
          ? 'theme-reading bg-[#fdf6e3] text-[#302418] selection:bg-[#e6d5b8] selection:text-[#302418]'
          : 'bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>

      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTeacher={() => setIsTeacherOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onNavigateToMindmap={() => {
          setActiveSection('comparison-matrix');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToSection={id => {
          setActiveSection(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSyncDrawer={() => setIsSyncDrawerOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onNavigateHome={() => {
          setActiveSection('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        completedCount={completedChapters.length}
        totalChapters={SECTIONS_ORDER.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={id => {
            setActiveSection(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          completedChapters={completedChapters}
        />

        {/* Content Main Area */}
        <main id="main-content" className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Persistent Quick-Jump Bar for Hands-On Project Blueprints */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 rounded-2xl border border-amber-500/30 bg-linear-to-r from-amber-500/10 via-purple-500/10 to-slate-900/80 px-4 py-3 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">
                III. Hands-On Project Blueprints:
              </span>
              <span className="hidden md:inline text-slate-300 text-xs">
                Real workstation setups with video studios &amp; live simulators
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveSection('web-app-project');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                  activeSection === 'web-app-project'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-900/90 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                }`}
              >
                <span>9. FastAPI Web App</span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('aiml-project');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                  activeSection === 'aiml-project'
                    ? 'bg-purple-500 text-white font-bold shadow-xs'
                    : 'bg-slate-900/90 border border-purple-500/40 text-purple-300 hover:bg-purple-500/20'
                }`}
              >
                <span>10. PyTorch RAG System</span>
              </button>
            </div>
          </div>

          {/* Active Chapter View */}
          <Suspense fallback={viewLoadingState}>{renderView()}</Suspense>

          {/* Interactive Sandbox Embedded Section */}
          <div className="mt-12">
            <InteractiveSandbox
              initialPresetId={sandboxPresetId}
              onExpandToModal={() => setIsSandboxOpen(true)}
            />
          </div>

          {/* Chapter Navigation Footer */}
          <div className="mt-12 mb-8 flex flex-col items-stretch gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleToggleChapter(activeSection)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border transition-all ${
                  isCurrentChapterCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    isCurrentChapterCompleted ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span>
                  {isCurrentChapterCompleted
                    ? 'Chapter Mastered!'
                    : 'Mark Chapter as Mastered'}
                </span>
              </button>

              <button
                onClick={() => setIsTeacherOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Daily Practice</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {prevSection && (
                <button
                  onClick={() => {
                    setActiveSection(prevSection.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev: {prevSection.name.split('.')[1]?.trim()}</span>
                </button>
              )}

              {nextSection && (
                <button
                  onClick={() => {
                    setActiveSection(nextSection.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-colors"
                >
                  <span>Next: {nextSection.name.split('.')[1]?.trim()}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Standard Disclaimer Footer */}
          <Footer
            onNavigate={id => {
              setActiveSection(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSyncDrawer={() => setIsSyncDrawerOpen(true)}
            onOpenSandbox={() => setIsSandboxOpen(true)}
          />
        </main>
      </div>

      {/* Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={id => {
          setActiveSection(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <DailyTeacherModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
        completedChapters={completedChapters}
        onToggleChapter={handleToggleChapter}
        notes={notes}
        onSaveNote={handleSaveNote}
        activeChapterId={activeSection}
      />

      <BackgroundSyncDrawer
        isOpen={isSyncDrawerOpen}
        onClose={() => setIsSyncDrawerOpen(false)}
        lastSyncTime={lastSyncTime}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
      />

      {/* Interactive Sandbox Modal */}
      <InteractiveSandboxModal
        isOpen={isSandboxOpen}
        onClose={() => {
          setIsSandboxOpen(false);
          setSandboxCustomCode(undefined);
        }}
        initialPresetId={sandboxPresetId}
        customCode={sandboxCustomCode}
      />
    </div>
  );
}
