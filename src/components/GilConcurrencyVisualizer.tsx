import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Cpu,
  Layers,
  Zap,
  Activity,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export const GilConcurrencyVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'gil_cpu' | 'gil_io' | 'pep703_nogil' | 'dotnet_clr'>('gil_cpu');
  const [isRunning, setIsRunning] = useState(true);
  const [activeThread, setActiveThread] = useState<1 | 2>(1);
  const [coreLoads, setCoreLoads] = useState<number[]>([98, 4, 2, 3]);
  const [throughput, setThroughput] = useState(100);
  const [zoomScale, setZoomScale] = useState<number>(1);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'gil_cpu') {
          // GIL switches back and forth between Thread 1 and Thread 2 on single core
          setActiveThread(prev => (prev === 1 ? 2 : 1));
          setCoreLoads([95 + Math.floor(Math.random() * 5), 3, 2, 2]);
          setThroughput(100);
        } else if (mode === 'gil_io') {
          // During C-extension / IO, GIL is released, both run!
          setActiveThread(1);
          setCoreLoads([92 + Math.floor(Math.random() * 8), 91 + Math.floor(Math.random() * 8), 4, 3]);
          setThroughput(195);
        } else if (mode === 'pep703_nogil') {
          // PEP 703 Free threaded Python: 4 threads across 4 cores!
          setCoreLoads([94 + Math.floor(Math.random() * 6), 92 + Math.floor(Math.random() * 8), 90 + Math.floor(Math.random() * 9), 93 + Math.floor(Math.random() * 7)]);
          setThroughput(385);
        } else if (mode === 'dotnet_clr') {
          // .NET CLR ThreadPool: full multi-core preemptive scheduling
          setCoreLoads([96 + Math.floor(Math.random() * 4), 95 + Math.floor(Math.random() * 5), 94 + Math.floor(Math.random() * 5), 95 + Math.floor(Math.random() * 4)]);
          setThroughput(395);
        }
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
              GIL
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Interactive GIL & Multi-Core Concurrency Simulator
            </h3>
          </div>
          <p className="mt-1 text-xs md:text-sm text-slate-400">
            Compare Python GIL bottleneck, C-extension unlock, PEP 703 Free-Threaded execution, and the .NET CLR ThreadPool.
          </p>
        </div>

        {/* Play/Pause & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => setZoomScale(prev => Math.max(0.75, Number((prev - 0.15).toFixed(2))))}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(1)}
              className="px-2 py-0.5 text-[11px] font-mono font-bold text-amber-300 hover:bg-amber-500/20 rounded transition-colors"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              onClick={() => setZoomScale(prev => Math.min(1.5, Number((prev + 0.15).toFixed(2))))}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(1)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Reset"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              isRunning
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" /> Pause Simulation
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" /> Resume Simulation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Selection Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          {
            id: 'gil_cpu',
            title: '1. CPython GIL (Pure Python)',
            subtitle: 'CPU-bound thread serialization',
            icon: Lock,
            color: 'border-amber-500/40 text-amber-300'
          },
          {
            id: 'gil_io',
            title: '2. GIL Released (NumPy / I/O)',
            subtitle: 'Py_BEGIN_ALLOW_THREADS native C',
            icon: Unlock,
            color: 'border-blue-500/40 text-blue-300'
          },
          {
            id: 'pep703_nogil',
            title: '3. PEP 703 Free-Threaded',
            subtitle: 'Python 3.13+ True No-GIL multicore',
            icon: Zap,
            color: 'border-emerald-500/40 text-emerald-300'
          },
          {
            id: 'dotnet_clr',
            title: '4. .NET CLR ThreadPool',
            subtitle: 'Preemptive multi-core scheduler',
            icon: Layers,
            color: 'border-purple-500/40 text-purple-300'
          }
        ].map(m => {
          const Icon = m.icon;
          const isSelected = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-white">{m.title}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{m.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Visual Simulation Canvas with Interactive Zoom */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center origin-top transition-transform duration-150"
        style={{ transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined }}
      >
        {/* Left: Threads & Mutex Token (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Thread Concurrency & Mutex State
            </span>
            <span className="text-xs font-mono text-amber-400">
              {mode === 'gil_cpu'
                ? 'GIL: LOCKED (Mutually Exclusive)'
                : mode === 'gil_io'
                ? 'GIL: RELEASED for C Extension'
                : mode === 'pep703_nogil'
                ? 'GIL: DISABLED (Biased Refcount)'
                : 'CLR: Preemptive Kernel Threads'}
            </span>
          </div>

          {/* Threads Visual Box */}
          <div className="space-y-3">
            {/* Thread 1 */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                mode === 'gil_cpu'
                  ? activeThread === 1
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950 opacity-50'
                  : 'border-emerald-500 bg-emerald-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    mode === 'gil_cpu' && activeThread !== 1
                      ? 'bg-slate-600'
                      : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                <div>
                  <div className="text-xs font-bold text-white">OS Thread 1 (Worker A)</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {mode === 'gil_cpu' && activeThread !== 1
                      ? 'BLOCKED on pthread_mutex_lock(&gil)'
                      : 'EXECUTING Python bytecode / C code'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {mode === 'gil_cpu' && activeThread !== 1 ? 'WAITING' : 'RUNNING'}
              </span>
            </div>

            {/* Central GIL Mutex Badge (Shows only in GIL modes) */}
            {(mode === 'gil_cpu' || mode === 'gil_io') && (
              <div className="flex justify-center py-1">
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold transition-all ${
                    mode === 'gil_cpu'
                      ? 'border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-500/20'
                      : 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {mode === 'gil_cpu' ? (
                    <>
                      <Lock className="h-3.5 w-3.5 text-amber-400" />
                      <span>GIL Held by Thread {activeThread}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                      <span>GIL Voluntarily Released (Parallelism Active)</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Thread 2 */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                mode === 'gil_cpu'
                  ? activeThread === 2
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950 opacity-50'
                  : 'border-emerald-500 bg-emerald-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    mode === 'gil_cpu' && activeThread !== 2
                      ? 'bg-slate-600'
                      : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                <div>
                  <div className="text-xs font-bold text-white">OS Thread 2 (Worker B)</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {mode === 'gil_cpu' && activeThread !== 2
                      ? 'BLOCKED on pthread_mutex_lock(&gil)'
                      : 'EXECUTING Python bytecode / C code'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {mode === 'gil_cpu' && activeThread !== 2 ? 'WAITING' : 'RUNNING'}
              </span>
            </div>

            {/* Extra Threads 3 & 4 (Active in No-GIL & CLR) */}
            {(mode === 'pep703_nogil' || mode === 'dotnet_clr') && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs">
                  <div className="font-bold text-white">OS Thread 3</div>
                  <div className="text-[10px] text-emerald-400 font-mono">RUNNING (Core 2)</div>
                </div>
                <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs">
                  <div className="font-bold text-white">OS Thread 4</div>
                  <div className="text-[10px] text-emerald-400 font-mono">RUNNING (Core 3)</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: 4-Core CPU Utilization Meters (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Multi-Core CPU Utilization
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 font-bold">
              <Activity className="h-3.5 w-3.5" />
              <span>Throughput: {throughput}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {coreLoads.map((load, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 h-40"
              >
                <span className="text-[11px] font-mono font-bold text-slate-300">
                  CPU {idx}
                </span>

                {/* Vertical Bar Meter */}
                <div className="relative w-8 h-24 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex flex-col justify-end">
                  <div
                    className={`w-full transition-all duration-500 ${
                      load > 80
                        ? 'bg-gradient-to-t from-emerald-500 to-amber-400'
                        : 'bg-slate-700'
                    }`}
                    style={{ height: `${load}%` }}
                  />
                </div>

                <span
                  className={`text-xs font-mono font-bold ${
                    load > 80 ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {load}%
                </span>
              </div>
            ))}
          </div>

          {/* Architectural Summary Callout */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-400">
              {mode === 'gil_cpu' && '⚠ The CPython GIL Trap:'}
              {mode === 'gil_io' && '✓ How High-Performance Python Bypasses the GIL:'}
              {mode === 'pep703_nogil' && '🚀 PEP 703 Free-Threaded Future:'}
              {mode === 'dotnet_clr' && '🔷 The .NET CLR Native Advantage:'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {mode === 'gil_cpu' &&
                'In pure Python CPU-bound code, two threads do NOT run twice as fast. They run slightly slower than a single thread due to mutex acquisition thrashing. CPU utilization is strictly capped at 100% of 1 core.'}
              {mode === 'gil_io' &&
                'NumPy, PyTorch, Polars, and C-extensions call Py_BEGIN_ALLOW_THREADS before heavy computation, releasing the GIL to the OS so multiple CPU cores can compute in true C-level parallelism!'}
              {mode === 'pep703_nogil' &&
                'Python 3.13 free-threaded builds replace global reference count increments with thread-local mimalloc arenas and biased locking, finally enabling true multi-core pure Python scaling.'}
              {mode === 'dotnet_clr' &&
                'C# and the CLR have never had a GIL. Managed threads are directly multiplexed across preemptive OS threads by the ThreadPool Hill-Climbing algorithm.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
