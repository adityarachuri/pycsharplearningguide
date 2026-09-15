import React, { useState } from 'react';
import {
  Layers,
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

const MIN_ZOOM_SCALE = 0.75;
const MAX_ZOOM_SCALE = 1.5;
const ZOOM_STEP = 0.15;

export const MemoryPyObjectVisualizer: React.FC = () => {
  const [refCount, setRefCount] = useState<number>(2);
  const [aliases, setAliases] = useState<string[]>(['data_record', 'cache_entry']);
  const [hasCycle, setHasCycle] = useState(false);
  const [gcRan, setGcRan] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(1);

  const addAlias = () => {
    if (refCount >= 6) return;
    const names = ['worker_ref', 'log_payload', 'session_ctx', 'observer'];
    const newName = names[aliases.length - 2] || `ref_${aliases.length + 1}`;
    setAliases([...aliases, newName]);
    setRefCount(prev => prev + 1);
  };

  const removeAlias = (idx: number) => {
    const updated = aliases.filter((_, i) => i !== idx);
    setAliases(updated);
    setRefCount(prev => Math.max(0, prev - 1));
  };

  const toggleCycle = () => {
    setHasCycle(!hasCycle);
    setGcRan(false);
  };

  const runCyclicGC = () => {
    setGcRan(true);
    if (hasCycle && aliases.length === 0) {
      setRefCount(0);
    }
  };

  const reset = () => {
    setRefCount(2);
    setAliases(['data_record', 'cache_entry']);
    setHasCycle(false);
    setGcRan(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
              MEM
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Interactive PyObject Anatomy & Dual GC Engine
            </h3>
          </div>
          <p className="mt-1 text-xs md:text-sm text-slate-400">
            CPython uses deterministic reference counting as its primary memory manager, backed by a 3-generation cyclic garbage collector.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => setZoomScale(prev => Math.max(MIN_ZOOM_SCALE, Number((prev - ZOOM_STEP).toFixed(2))))}
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
              onClick={() => setZoomScale(prev => Math.min(MAX_ZOOM_SCALE, Number((prev + ZOOM_STEP).toFixed(2))))}
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
            onClick={reset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset State</span>
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 origin-top transition-transform duration-150"
        style={{ transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined }}
      >
        {/* Left: Interactive PyObject C-Memory Block (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>PyObject Physical Memory Layout (C struct in heap)</span>
            <span className="font-mono text-amber-400 text-[11px]">
              Allocated via pymalloc arena (256KB pool)
            </span>
          </div>

          {/* C Struct Anatomy Card */}
          <div className="rounded-2xl border-2 border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl divide-y divide-slate-800/80">
            {/* 1. PyGC_Head (16 bytes, for cyclic GC) */}
            <div className="p-3.5 bg-purple-950/20 border-l-4 border-purple-500 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-purple-300">
                  PyGC_Head (16 bytes)
                </div>
                <div className="text-[11px] text-slate-400">
                  Doubly linked list pointers: <code className="text-purple-300">gc_next</code>, <code className="text-purple-300">gc_prev</code> (Cyclic Gen 0/1/2)
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                Containers Only
              </span>
            </div>

            {/* 2. ob_refcnt (8 bytes) */}
            <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-amber-300">
                  Py_ssize_t ob_refcnt (8 bytes / 64 bits)
                </div>
                <div className="text-[11px] text-slate-300">
                  Direct hardware reference counter. When this counter drops to 0, immediate deallocation occurs!
                </div>
              </div>
              <div className="text-center px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40">
                <div className="text-2xl font-black font-mono text-amber-300">
                  {refCount}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-amber-400 font-bold">
                  {refCount === 0 ? 'DEALLOCATED' : 'LIVE REFS'}
                </div>
              </div>
            </div>

            {/* 3. ob_type (8 bytes) */}
            <div className="p-3.5 bg-blue-950/20 border-l-4 border-blue-500 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-blue-300">
                  struct _typeobject *ob_type (8 bytes / 64-bit pointer)
                </div>
                <div className="text-[11px] text-slate-400">
                  Points to Type Descriptor Object (e.g., <code className="text-blue-300">&PyList_Type</code>, method slots, MRO table)
                </div>
              </div>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                RTTI Descriptor
              </span>
            </div>

            {/* 4. Value Payload */}
            <div className="p-4 bg-slate-950 border-l-4 border-emerald-500 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-emerald-300">
                  Type-Specific Value Payload (Array of PyObject pointers)
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  [ PyObject*(100), PyObject*(200), PyObject*(300) ]
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Heap Payload
              </span>
            </div>
          </div>

          {/* Status Alert Banner */}
          {refCount === 0 ? (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold">Immediate Deallocation Triggered!</p>
                <p className="text-[11px] text-rose-200 mt-0.5">
                  <code className="font-mono">tp_dealloc()</code> was called immediately when <code className="font-mono">ob_refcnt == 0</code>. Memory returned to pymalloc pool without waiting for GC sweep.
                </p>
              </div>
            </div>
          ) : hasCycle && aliases.length === 0 ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-300 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold">Cyclic Reference Memory Leak (Isolated Island)</p>
                <p className="text-[11px] text-amber-200 mt-0.5">
                  Object A and Object B hold pointers to each other, so refcnt = 1 even though both root variable names were deleted! Reference counting alone cannot free this. Run the Cyclic GC below.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Object is live in memory, safely referenced by active frame pointers.</span>
            </div>
          )}
        </div>

        {/* Right: Variable References & Interactive Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Variable References
              </span>
              <button
                onClick={addAlias}
                disabled={refCount >= 6}
                className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-40 transition-all"
              >
                <Plus className="h-3 w-3" />
                <span>Add Alias</span>
              </button>
            </div>

            {/* List of active aliases */}
            <div className="space-y-2">
              {aliases.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2">
                  No active root variable names referencing this object!
                </div>
              ) : (
                aliases.map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-950 px-3 py-2 border border-slate-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-200">{name}</span>
                    </div>
                    <button
                      onClick={() => removeAlias(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title={`del ${name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cyclic Reference & GC Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={toggleCycle}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  hasCycle
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{hasCycle ? 'Break Circular Cycle (A ⇄ B)' : 'Create Circular Cycle (A ⇄ B)'}</span>
              </button>

              {hasCycle && (
                <button
                  onClick={runCyclicGC}
                  className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/20"
                >
                  Trigger Cyclic GC (gc.collect())
                </button>
              )}
            </div>
          </div>

          {/* C# CLR Contrast Box */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <Layers className="h-4 w-4" />
              <span>.NET CLR Object Layout Contrast</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              In .NET, objects do <strong>not</strong> track their own reference count. Instead, objects have a 4-byte <code>SyncBlockIndex</code> and an 8-byte <code>MethodTable*</code> (TypeHandle). Memory recovery is handled purely by the generational Mark-and-Sweep tracing GC traversing root references (stack, CPU registers, static fields).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
