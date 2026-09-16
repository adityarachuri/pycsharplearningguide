import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Terminal,
  ShieldCheck,
  Menu,
  CheckCircle2,
  Sun,
  Moon,
  BrainCircuit,
  FolderGit2,
  Globe,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { NavSectionId, AppTheme } from '../types';
import { SiteLogo } from './SiteLogo';

interface NavbarProps {
  activeSection: NavSectionId;
  onOpenSearch: () => void;
  onOpenTeacher: () => void;
  onOpenSandbox: () => void;
  onNavigateToMindmap?: () => void;
  onNavigateToSection?: (id: NavSectionId) => void;
  onOpenSyncDrawer: () => void;
  onToggleSidebar: () => void;
  onNavigateHome: () => void;
  completedCount: number;
  totalChapters: number;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onOpenSearch,
  onOpenTeacher,
  onOpenSandbox,
  onNavigateToMindmap,
  onNavigateToSection,
  onOpenSyncDrawer,
  onToggleSidebar,
  onNavigateHome,
  completedCount,
  totalChapters,
  theme,
  onToggleTheme
}) => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 md:px-6 backdrop-blur-md">
      {/* Left: Mobile menu toggle + Creative Unique Site Logo with Homepage Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Homepage Navigation Link */}
        <button
          onClick={onNavigateHome}
          id="header-homepage-link"
          className="group flex items-center rounded-xl p-1 -m-1 hover:bg-slate-900/60 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 transition-all text-left"
          title="PyCSharp - Return to Homepage (Fundamentals & Zen of Python)"
          aria-label="PyCSharp Homepage"
        >
          {/* Icon emblem always shown; brand text fades in from sm+ (handled inside SiteLogo) */}
          <SiteLogo size="md" showText={true} />
        </button>
      </div>

      {/* Middle/Right Action Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span>Quick Search...</span>
          <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Daily Teacher Challenge Button */}
        <button
          onClick={onOpenTeacher}
          className="hidden xl:flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
          title="Open Daily Teacher & Practice"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">Daily Teacher</span>
          <span className="hidden sm:inline rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300">
            7-Day
          </span>
        </button>

        {/* Hands-On Project Blueprints Direct Menu */}
        {onNavigateToSection && (
          <div className="relative">
            <button
              onClick={() => setIsProjectsOpen(prev => !prev)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                activeSection === 'web-app-project' || activeSection === 'aiml-project'
                  ? 'border-amber-400 bg-amber-500/25 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-amber-500/50 hover:text-white'
              }`}
              title="III. Hands-On Project Blueprints"
            >
              <FolderGit2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline font-bold">Projects</span>
              <span className="hidden lg:inline rounded bg-linear-to-r from-amber-500/30 to-purple-500/30 border border-amber-400/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-amber-300">
                2 BLUEPRINTS
              </span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProjectsOpen && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setIsProjectsOpen(false)}
                />
                <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 sm:w-84 rounded-2xl border border-amber-500/40 bg-slate-950/95 p-3 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                  <div className="px-2 py-1.5 border-b border-slate-800/80 mb-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center justify-between">
                      <span>III. Hands-On Project Blueprints</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">COMPLETE WORKSTATIONS</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Full-code production repositories with animated IDE workstation video studio and live in-browser testers.
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        onNavigateToSection('web-app-project');
                        setIsProjectsOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                        activeSection === 'web-app-project'
                          ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200'
                          : 'hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">9. Full-Stack Web App</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            FastAPI &bull; uv
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          SQLAlchemy 2.0 Async, Alembic, Docker &amp; Live Swagger UI Simulator
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateToSection('aiml-project');
                        setIsProjectsOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                        activeSection === 'aiml-project'
                          ? 'bg-purple-500/20 border border-purple-500/50 text-purple-200'
                          : 'hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 shrink-0 mt-0.5 border border-purple-500/30">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">10. Production AI/ML App</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            PyTorch &bull; RAG
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Sentence-Transformers, ChromaDB vector store, 2D visualizer &amp; SSE
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Interactive Mindmap Quick Action */}
        {onNavigateToMindmap && (
          <button
            onClick={onNavigateToMindmap}
            className={`hidden lg:flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSection === 'comparison-matrix'
                ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                : 'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
            title="Open C# vs Python Mindmap Visualizer"
          >
            <BrainCircuit className="h-3.5 w-3.5 text-amber-400" />
            <span>Mindmap</span>
          </button>
        )}

        {/* Interactive Python Sandbox */}
        <button
          onClick={onOpenSandbox}
          className="hidden xl:flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Open Python Sandbox"
        >
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span>Sandbox</span>
        </button>

        {/* Background Service Worker Status Pill */}
        <button
          onClick={onOpenSyncDrawer}
          className="hidden lg:flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10 transition-colors"
          title="Background Content Sync Status"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 hidden sm:inline" />
          <span className="hidden sm:inline text-[11px] font-mono">Sync Verified</span>
        </button>

        {/* Persistent Theme Toggle: Deep Slate vs Python IDLE Light Mode vs Reading Mode */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all select-none ${
            theme === 'idle'
              ? 'border-blue-500/50 bg-[#eff6ff] text-[#172554] shadow-xs hover:bg-[#dbeafe] hover:border-[#2563eb]'
              : theme === 'reading'
              ? 'border-[#d6bba0] bg-[#f4e8d1] text-[#302418] shadow-xs hover:bg-[#ebd5b3] hover:border-[#c5a687]'
              : 'border-slate-700 bg-slate-900/90 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800 hover:text-amber-300'
          }`}
          title={
            theme === 'idle'
              ? 'Active: Python IDLE Light. Click for Reading Mode.'
              : theme === 'reading'
              ? 'Active: Reading Mode. Click for Deep Slate Dark.'
              : 'Active: Deep Slate Dark. Click for Python IDLE Light.'
          }
          aria-label="Toggle theme"
        >
          {theme === 'idle' ? (
            <>
              <Sun className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
              <span className="hidden sm:inline font-mono font-bold tracking-tight text-[#1e3a8a] text-xs">
                Python IDLE
              </span>
              <span className="rounded bg-[#bfdbfe]/90 px-1 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-[#1e40af] hidden md:inline-block">
                Light
              </span>
            </>
          ) : theme === 'reading' ? (
            <>
              <BookOpen className="h-3.5 w-3.5 text-[#b85900]" />
              <span className="hidden sm:inline font-mono font-bold tracking-tight text-[#302418] text-xs">
                Sepia
              </span>
              <span className="rounded bg-[#ebd5b3] px-1 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-[#453322] border border-[#d6bba0] hidden md:inline-block">
                Reading
              </span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono font-bold tracking-tight text-slate-200 text-xs">
                Deep Slate
              </span>
              <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 border border-slate-700 hidden md:inline-block">
                Dark
              </span>
            </>
          )}
        </button>

        {/* Mastery Progress Badge */}
        <div className="hidden xl:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>
            <strong className="text-white">{completedCount}</strong>/{totalChapters}
          </span>
        </div>
      </div>
    </header>
  );
};

