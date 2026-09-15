import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Terminal,
  FileCode2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  Clock,
  Radio,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export interface WorkflowScene {
  id: number;
  title: string;
  duration: string;
  sceneTitle: string;
  sdlcStage?: string;
  sdlcPhaseName?: string;
  description: string;
  csharpParallel: {
    concept: string;
    dotnetEquivalent: string;
    keyDifference: string;
  };
  terminalCommands: {
    cmd: string;
    output: string[];
  }[];
  activeFile: string;
  fileContent: string;
  language: string;
  keyTakeaways: string[];
  proTip: string;
}

interface WorkstationVideoPlayerProps {
  projectName: string;
  projectBadge: string;
  scenes: WorkflowScene[];
  activeSceneId: number;
  onSelectScene: (sceneId: number) => void;
  accentColor?: 'amber' | 'emerald' | 'blue' | 'purple';
}

export function WorkstationVideoPlayer({
  projectName,
  projectBadge,
  scenes,
  activeSceneId,
  onSelectScene,
  accentColor = 'amber'
}: WorkstationVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'terminal' | 'editor' | 'split'>('split');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [isTheater, setIsTheater] = useState<boolean>(false);
  const [simulatedTime, setSimulatedTime] = useState<number>(0);

  const activeIndex = scenes.findIndex(s => s.id === activeSceneId);
  const currentScene = scenes[activeIndex >= 0 ? activeIndex : 0];

  // Auto-advance timer when playing
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const intervalMs = (6000 / playbackSpeed);
      timer = setInterval(() => {
        onSelectScene(
          activeSceneId < scenes.length ? activeSceneId + 1 : 1
        );
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, activeSceneId, playbackSpeed, scenes.length, onSelectScene]);

  // Handle keyboard shortcut for spacebar play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentScene.fileContent);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const colorClasses = {
    amber: {
      badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      activeBorder: 'border-amber-500',
      activeBg: 'bg-amber-500/20 text-white shadow-md shadow-amber-500/10',
      btnPlay: 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20',
      progress: 'bg-amber-500',
      text: 'text-amber-400',
      ring: 'focus:ring-amber-400'
    },
    emerald: {
      badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      activeBorder: 'border-emerald-500',
      activeBg: 'bg-emerald-500/20 text-white shadow-md shadow-emerald-500/10',
      btnPlay: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20',
      progress: 'bg-emerald-500',
      text: 'text-emerald-400',
      ring: 'focus:ring-emerald-400'
    },
    blue: {
      badge: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      activeBorder: 'border-blue-500',
      activeBg: 'bg-blue-500/20 text-white shadow-md shadow-blue-500/10',
      btnPlay: 'bg-blue-500 text-white hover:bg-blue-400 shadow-blue-500/20',
      progress: 'bg-blue-500',
      text: 'text-blue-400',
      ring: 'focus:ring-blue-400'
    },
    purple: {
      badge: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      activeBorder: 'border-purple-500',
      activeBg: 'bg-purple-500/20 text-white shadow-md shadow-purple-500/10',
      btnPlay: 'bg-purple-500 text-white hover:bg-purple-400 shadow-purple-500/20',
      progress: 'bg-purple-500',
      text: 'text-purple-400',
      ring: 'focus:ring-purple-400'
    }
  }[accentColor];

  return (
    <div
      id="workstation-video-player"
      className={`rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl transition-all duration-300 ${
        isTheater ? 'fixed inset-4 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl' : ''
      }`}
    >
      {/* Studio Monitor Top Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-3 gap-3">
        <div className="flex items-center gap-3">
          {/* OS Window Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80 border border-rose-600" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80 border border-amber-600" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80 border border-emerald-600" />
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Project Title & Live Broadcast Badge */}
          <div className="flex items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 text-xs font-mono font-bold ${colorClasses.badge}`}>
              {projectBadge}
            </span>
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
              {projectName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Studio Status Indicator */}
          <div className="flex items-center gap-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 px-2.5 py-1 text-[11px] text-rose-300 font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span>{isPlaying ? 'RECORDING • LIVE SIM' : 'WORKSTATION STUDIO'}</span>
          </div>

          <span className="hidden md:inline-block rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-slate-400 border border-slate-700/60">
            4K UHD • 60 FPS
          </span>

          {/* View Mode Toggle: Split / Terminal / Editor */}
          <div className="hidden lg:flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                activeTab === 'split' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                activeTab === 'terminal' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Terminal
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                activeTab === 'editor' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Source Code
            </button>
          </div>

          {/* Theater Mode Button */}
          <button
            onClick={() => setIsTheater(prev => !prev)}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isTheater ? 'Exit Full Screen' : 'Full Screen Studio'}
          >
            {isTheater ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Active Scene Banner & SDLC Phase Indicator */}
      <div className="bg-slate-900/70 border-b border-slate-800/80 px-4 py-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* SDLC Milestone Badge */}
            {currentScene.id === 1 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                🌱 SDLC STEP 1: DEVELOPER WORKSTATION SETUP
              </span>
            ) : currentScene.id === scenes.length ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                🚀 FINAL STEP OF SDLC: PRODUCTION DEPLOYMENT &amp; OBSERVABILITY
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-bold ${colorClasses.badge}`}>
                {currentScene.sdlcStage || `SDLC STEP ${currentScene.id} OF ${scenes.length}`}
              </span>
            )}

            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {currentScene.sceneTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>Scene {currentScene.id}/{scenes.length} ({currentScene.duration})</span>
          </div>
        </div>

        {/* SDLC Scene Context Summary */}
        <p className="text-xs text-slate-300/90 leading-relaxed">
          {currentScene.description}
        </p>
      </div>

      {/* Main Workstation Stage Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] bg-slate-950 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
        {/* Left / Top Panel: Interactive Animated Terminal */}
        {(activeTab === 'split' || activeTab === 'terminal') && (
          <div className={`${activeTab === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col`}>
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between bg-slate-900/70 px-4 py-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span>~/workspace/{projectName.toLowerCase().replace(/\s+/g, '-')}</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400">git:(main)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                uv runtime
              </span>
            </div>

            {/* Terminal Viewport */}
            <div className="p-4 font-mono text-xs text-slate-300 space-y-4 overflow-y-auto max-h-[400px] flex-1">
              {currentScene.terminalCommands.map((tc, idx) => (
                <div key={idx} className="space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-slate-100">
                    <span className="text-emerald-400 font-bold">$</span>
                    <span className="font-semibold text-emerald-300">{tc.cmd}</span>
                  </div>
                  {tc.output.length > 0 && (
                    <div className="pl-4 border-l-2 border-slate-800 space-y-0.5 text-slate-400">
                      {tc.output.map((line, lIdx) => (
                        <div
                          key={lIdx}
                          className={
                            line.includes('PASSED') || line.includes('Installed') || line.includes('healthy') || line.includes('True')
                              ? 'text-emerald-400'
                              : line.includes('INFO') || line.includes('Generating')
                              ? 'text-amber-300/90'
                              : line.includes('ERROR') || line.includes('failed')
                              ? 'text-rose-400'
                              : 'text-slate-400'
                          }
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Flashing prompt cursor */}
              <div className="flex items-center gap-2 pt-1 text-slate-500">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="h-4 w-2 bg-emerald-400 animate-pulse inline-block" />
              </div>
            </div>
          </div>
        )}

        {/* Right / Bottom Panel: Source Code Editor */}
        {(activeTab === 'split' || activeTab === 'editor') && (
          <div className={`${activeTab === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col bg-slate-950`}>
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between bg-slate-900/70 px-4 py-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <FileCode2 className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-semibold">{currentScene.activeFile}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-md bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-mono"
              >
                {copiedFile ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedFile ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="p-2 overflow-y-auto max-h-[400px] flex-1">
              <CodeBlock code={currentScene.fileContent} language={currentScene.language} />
            </div>
          </div>
        )}
      </div>

      {/* Video Studio Control Deck & Timeline Scrubber */}
      <div className="border-t border-slate-800 bg-slate-900/90 p-4 space-y-4">
        {/* Step-by-Step Interactive Timeline Scrubber */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">SDLC Progression:</span>
              <span className="text-amber-400 font-bold">Step {currentScene.id} of {scenes.length}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-semibold">{currentScene.sdlcPhaseName || currentScene.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{currentScene.duration}</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400">
                {currentScene.id === 1
                  ? 'Start: Setup'
                  : currentScene.id === scenes.length
                  ? 'Final SDLC Step'
                  : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Timeline track (responsive up to 8 SDLC scenes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {scenes.map((s, idx) => {
              const isActive = s.id === currentScene.id;
              const isPast = s.id < currentScene.id;
              const isFirst = s.id === 1;
              const isLast = s.id === scenes.length;

              return (
                <button
                  key={s.id}
                  onClick={() => onSelectScene(s.id)}
                  className={`group text-left p-2 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between min-h-[70px] ${
                    isActive
                      ? `${colorClasses.activeBorder} ${colorClasses.activeBg}`
                      : isPast
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:border-emerald-500'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 w-full">
                    <span className="text-[10px] font-mono font-bold truncate">
                      {isFirst ? '01 SETUP' : isLast ? '08 FINAL' : `0${s.id} ${s.sdlcPhaseName ? s.sdlcPhaseName.split(' ')[0].toUpperCase() : ''}`}
                    </span>
                    <span className="text-[9px] font-mono opacity-80 shrink-0">{s.duration}</span>
                  </div>
                  <div className="text-[11px] font-semibold truncate leading-tight w-full" title={s.title}>
                    {s.title}
                  </div>
                  {/* Active playing indicator line */}
                  {isActive && isPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div className={`h-full ${colorClasses.progress} animate-pulse w-full`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            {/* Previous Scene */}
            <button
              onClick={() => onSelectScene(activeSceneId > 1 ? activeSceneId - 1 : scenes.length)}
              className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="Previous Scene (Left Arrow)"
            >
              <Rewind className="h-4 w-4" />
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying(prev => !prev)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md ${
                isPlaying
                  ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20'
                  : colorClasses.btnPlay
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isPlaying ? 'Pause Studio' : 'Play Presentation'}</span>
            </button>

            {/* Next Scene */}
            <button
              onClick={() => onSelectScene(activeSceneId < scenes.length ? activeSceneId + 1 : 1)}
              className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="Next Scene (Right Arrow)"
            >
              <FastForward className="h-4 w-4" />
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setIsPlaying(false);
                onSelectScene(1);
              }}
              className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              title="Restart from Scene 1"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Speed Selector & Spacebar Hint */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">
              [Press Space to Play/Pause]
            </span>

            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
              {[0.75, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded transition-colors ${
                    playbackSpeed === speed ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* C# Developer Architectural Radar & Rosetta Parallel */}
      <div className="p-4 sm:p-6 bg-slate-900/40 border-t border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-md border px-2 py-0.5 text-xs font-bold uppercase tracking-wider font-mono ${colorClasses.badge}`}>
            .NET / C# Architectural Parallel
          </span>
          <h4 className="text-sm font-bold text-white">
            {currentScene.csharpParallel.concept}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 font-mono">
              C# / .NET Equivalent
            </div>
            <div className="text-xs font-mono text-slate-200 bg-slate-950/60 p-2 rounded-md border border-slate-800/60">
              {currentScene.csharpParallel.dotnetEquivalent}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Systems Engineering Divergence
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentScene.csharpParallel.keyDifference}
            </p>
          </div>
        </div>

        {/* Key Takeaways & Pro Tip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Architectural Takeaways</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentScene.keyTakeaways.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1.5">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Production Pro-Tip</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentScene.proTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
