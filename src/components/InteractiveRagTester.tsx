import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BrainCircuit,
  Search,
  Play,
  RefreshCw,
  Send,
  CheckCircle2,
  ArrowRight,
  Layers,
  Cpu,
  ShieldCheck,
  Target,
  Zap,
  Info
} from 'lucide-react';

interface DocumentNode {
  id: string;
  title: string;
  shortTitle: string;
  x: number;
  y: number;
  text: string;
  category: 'gil' | 'jit' | 'memory' | 'typing';
  labelOffset?: { dx: number; dy: number };
}

const DOCUMENT_CORPUS: DocumentNode[] = [
  {
    id: 'doc_1',
    title: 'CPython GIL & Multithreading Mechanics',
    shortTitle: 'CPython GIL Mutex',
    x: 150,
    y: 95,
    text: 'The Global Interpreter Lock (GIL) is a mutual exclusion lock preventing multiple native threads from executing Python bytecodes simultaneously. In C#, the CLR uses true preemptive multithreading without a central lock.',
    category: 'gil',
    labelOffset: { dx: 14, dy: -4 }
  },
  {
    id: 'doc_2',
    title: 'PEP 703: Free-Threaded CPython (Python 3.13+)',
    shortTitle: 'PEP 703 No-GIL',
    x: 180,
    y: 190,
    text: 'PEP 703 introduces free-threaded CPython using mimalloc biased reference counting and immortal objects, enabling true multi-core parallel execution across CPU threads.',
    category: 'gil',
    labelOffset: { dx: 14, dy: 14 }
  },
  {
    id: 'doc_3',
    title: '.NET RyuJIT Tiered Compilation & OSR',
    shortTitle: 'RyuJIT Tiered',
    x: 550,
    y: 95,
    text: '.NET RyuJIT compiles CIL bytecode directly into optimized native x86_64/ARM64 machine instructions. Python 3.13 introduces an experimental Tier-2 copy-and-patch JIT compiler.',
    category: 'jit',
    labelOffset: { dx: -90, dy: -10 }
  },
  {
    id: 'doc_6',
    title: 'Python Tier-2 Copy-and-Patch Micro-Ops',
    shortTitle: 'Tier-2 Micro-Ops',
    x: 570,
    y: 185,
    text: 'Python 3.13 builds upon PEP 659 specializing adaptive interpreter by compiling high-frequency bytecode traces into machine code via copy-and-patch templates.',
    category: 'jit',
    labelOffset: { dx: -105, dy: 16 }
  },
  {
    id: 'doc_5',
    title: 'PyObject Ref Counting vs CLR Generational GC',
    shortTitle: 'PyObject RefCount',
    x: 170,
    y: 310,
    text: 'CPython reclaims memory immediately via ob_refcnt decrements, backed by a cyclic generational collector. .NET CLR utilizes an enterprise mark-sweep-compact generational garbage collector (Gen 0, 1, 2).',
    category: 'memory',
    labelOffset: { dx: 14, dy: 6 }
  },
  {
    id: 'doc_4',
    title: 'CLR Generic Reification vs Python Type Erasure',
    shortTitle: 'CLR Reification',
    x: 550,
    y: 310,
    text: 'C# preserves generic types at runtime with native machine code specialization (reification). In contrast, Python type hints are purely erased at runtime, serving Pyright and mypy static analyzers.',
    category: 'typing',
    labelOffset: { dx: -95, dy: 6 }
  }
];

export function InteractiveRagTester() {
  const [selectedQuery, setSelectedQuery] = useState<string>(
    'How does CPython GIL multithreading differ from .NET CLR threading?'
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [streamedText, setStreamedText] = useState<string>('');
  const [retrievedDocs, setRetrievedDocs] = useState<any[]>([]);
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number }>({ x: 260, y: 140 });
  const [hoveredDoc, setHoveredDoc] = useState<DocumentNode | null>(null);
  const [selectedDocDetail, setSelectedDocDetail] = useState<DocumentNode | null>(null);

  // Interval reference to safely manage and clear token streaming
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop any active stream timers on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const executePipeline = (queryToRun: string, manualCoords?: { x: number; y: number }) => {
    // Clear any active intervals immediately
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSelectedQuery(queryToRun);
    setIsProcessing(true);
    setStreamedText('');
    setRetrievedDocs([]);

    // Calculate simulated semantic coordinates with clear non-overlapping positioning
    let targetX = 260;
    let targetY = 140;
    let targetCategory: 'gil' | 'jit' | 'memory' | 'typing' = 'gil';

    if (manualCoords) {
      targetX = manualCoords.x;
      targetY = manualCoords.y;
      // Determine nearest category from coordinates
      if (targetX > 360 && targetY < 200) targetCategory = 'jit';
      else if (targetX > 360 && targetY >= 200) targetCategory = 'typing';
      else if (targetX <= 360 && targetY >= 200) targetCategory = 'memory';
      else targetCategory = 'gil';
    } else {
      const qLower = queryToRun.toLowerCase();
      if (qLower.includes('jit') || qLower.includes('compile') || qLower.includes('tier')) {
        targetX = 460;
        targetY = 140;
        targetCategory = 'jit';
      } else if (qLower.includes('type') || qLower.includes('generic') || qLower.includes('hint')) {
        targetX = 460;
        targetY = 270;
        targetCategory = 'typing';
      } else if (qLower.includes('memory') || qLower.includes('gc') || qLower.includes('garbage') || qLower.includes('count')) {
        targetX = 260;
        targetY = 270;
        targetCategory = 'memory';
      } else {
        // GIL / Threading
        targetX = 260;
        targetY = 140;
        targetCategory = 'gil';
      }
    }

    setQueryPoint({ x: targetX, y: targetY });

    // Simulate Vector Embedding & HNSW Cosine Similarity Search
    debounceTimerRef.current = setTimeout(() => {
      const scored = DOCUMENT_CORPUS.map(doc => {
        const dx = doc.x - targetX;
        const dy = doc.y - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Map Euclidean distance in projected 2D space to cosine score (0.50 to 0.96)
        const rawSim = 1 - (dist / 520);
        const similarity = Math.max(0.45, Math.min(0.965, +rawSim.toFixed(3)));
        return {
          ...doc,
          distance: Math.round(dist),
          similarity
        };
      })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 2);

      setRetrievedDocs(scored);
      if (scored.length > 0) {
        setSelectedDocDetail(scored[0]);
      }

      // Stream generated answer deterministically
      const answer =
        targetCategory === 'gil'
          ? 'CPython threads are constrained by the Global Interpreter Lock (GIL), meaning only one OS thread executes bytecode at any instant. In sharp contrast, the .NET CLR provides true preemptive multithreading with native OS threads running across distinct CPU cores concurrently without a global lock. PEP 703 in Python 3.13 introduces an experimental free-threaded build to bridge this gap.'
          : targetCategory === 'jit'
          ? 'The .NET CLR uses RyuJIT to compile CIL bytecode directly into optimized native x86_64/ARM64 machine instructions with Tiered Compilation and On-Stack Replacement (OSR). In contrast, CPython interprets bytecode sequentially through a C dispatch loop (PyEval_EvalFrameDefault), although Python 3.13 is introducing an experimental copy-and-patch Tier-2 JIT.'
          : targetCategory === 'typing'
          ? 'C# generics are fully reified in the CLR, creating specialized machine code for value types at runtime without boxing. In Python, type annotations are strictly erased at runtime (PEP 484) and exist purely for static analyzers like Pyright and runtime validators like Pydantic.'
          : 'CPython relies on deterministic reference counting (ob_refcnt) with immediate deallocation upon reaching zero, supported by a 3-generation cyclic garbage collector. The .NET CLR uses a high-throughput, mark-sweep-compact generational garbage collector (Gen 0, 1, 2, and LOH/POH) without reference counting.';

      const tokens = answer.split(' ');
      let currentIdx = 0;

      // Deterministic slicing prevents duplicate words or undefined in React StrictMode
      streamTimerRef.current = setInterval(() => {
        currentIdx++;
        if (currentIdx <= tokens.length) {
          const partial = tokens.slice(0, currentIdx).join(' ');
          setStreamedText(partial);
        } else {
          if (streamTimerRef.current) {
            clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
          }
          setIsProcessing(false);
        }
      }, 35);
    }, 350);
  };

  useEffect(() => {
    executePipeline(selectedQuery);
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - svgRect.left;
    const clickY = e.clientY - svgRect.top;

    // Scale to viewBox (720 x 380)
    const scaledX = Math.round((clickX / svgRect.width) * 720);
    const scaledY = Math.round((clickY / svgRect.height) * 380);

    executePipeline(`Vector projection query at (${scaledX}, ${scaledY})`, {
      x: Math.max(50, Math.min(670, scaledX)),
      y: Math.max(50, Math.min(340, scaledY))
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-xs font-mono font-bold text-purple-400">
              PYTORCH &bull; CHROMADB &bull; VECTOR SIMULATOR
            </span>
            <h3 className="text-lg font-bold text-white">
              Interactive 2D Vector Space &amp; RAG Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Observe high-dimensional embeddings mapped into 2D semantic space, HNSW similarity graph traversal, and token-by-token streaming synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2.5 py-1 rounded-full">
            384-dim (all-MiniLM-L6-v2)
          </span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Metric: Cosine Similarity
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-purple-400" />
            <span>Select an Architectural Query to Vectorize (or click on the 2D map):</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">Interactive Canvas: Click anywhere to re-anchor vector</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            'How does CPython GIL multithreading differ from .NET CLR threading?',
            'Compare .NET RyuJIT tiered compilation with Python Tier-2 JIT',
            'Explain C# CLR Generic reification vs Python type hint erasure',
            'Contrast CPython reference counting with .NET Generational GC'
          ].map(q => (
            <button
              key={q}
              onClick={() => executePipeline(q)}
              className={`rounded-xl border px-3 py-1.5 text-xs text-left transition-all ${
                selectedQuery === q
                  ? 'border-purple-400 bg-purple-500/20 text-purple-200 font-semibold shadow-xs'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Vector Visualization Canvas & RAG Output Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Projected Vector Space Canvas (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-purple-400" />
              <span>Semantic Latent Space (2D Projection)</span>
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Query
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-purple-500" /> Top-K Match
              </span>
            </div>
          </div>

          {/* SVG Vector Plotting Stage */}
          <div className="relative w-full h-[300px] sm:h-[320px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner cursor-crosshair">
            <svg
              className="w-full h-full select-none"
              viewBox="0 0 720 380"
              onClick={handleCanvasClick}
            >
              <defs>
                {/* Subtle Radial Aura Gradients */}
                <radialGradient id="gilClusterAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="jitClusterAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="memClusterAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="typeClusterAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="queryVectorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Quadrant Partition Dividers */}
              <line x1="0" y1="190" x2="720" y2="190" stroke="#1e293b" strokeDasharray="4,4" strokeWidth="1" />
              <line x1="360" y1="0" x2="360" y2="380" stroke="#1e293b" strokeDasharray="4,4" strokeWidth="1" />

              {/* Cluster Auras */}
              <circle cx="165" cy="140" r="100" fill="url(#gilClusterAura)" />
              <circle cx="560" cy="140" r="100" fill="url(#jitClusterAura)" />
              <circle cx="200" cy="310" r="95" fill="url(#memClusterAura)" />
              <circle cx="550" cy="310" r="95" fill="url(#typeClusterAura)" />

              {/* Quadrant Watermark Headers */}
              <text x="24" y="28" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="bold">
                QUADRANT I &bull; GIL &amp; CONCURRENCY
              </text>
              <text x="400" y="28" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="bold">
                QUADRANT II &bull; JIT &amp; EXECUTION ENGINE
              </text>
              <text x="24" y="214" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="bold">
                QUADRANT III &bull; MEMORY &amp; GC
              </text>
              <text x="400" y="214" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="bold">
                QUADRANT IV &bull; TYPE SYSTEM &amp; GENERICS
              </text>

              {/* Dynamic Similarity Vectors connecting Query to Top-K Document nodes */}
              {retrievedDocs.map(doc => {
                const midX = (queryPoint.x + doc.x) / 2;
                const midY = (queryPoint.y + doc.y) / 2;

                return (
                  <g key={`vector-line-${doc.id}`}>
                    <line
                      x1={queryPoint.x}
                      y1={queryPoint.y}
                      x2={doc.x}
                      y2={doc.y}
                      stroke="#a855f7"
                      strokeWidth="2.5"
                      strokeDasharray="6,4"
                      className="animate-pulse"
                    />
                    {/* Distance / Cosine Score Pill Tag */}
                    <g transform={`translate(${midX - 32}, ${midY - 10})`}>
                      <rect
                        width="64"
                        height="18"
                        rx="9"
                        fill="#0f172a"
                        stroke="#a855f7"
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="32"
                        y="12"
                        textAnchor="middle"
                        fill="#c084fc"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        sim {doc.similarity}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Document Cluster Nodes */}
              {DOCUMENT_CORPUS.map(doc => {
                const isRetrieved = retrievedDocs.some(r => r.id === doc.id);
                const isSelected = selectedDocDetail?.id === doc.id;
                const isHovered = hoveredDoc?.id === doc.id;

                const nodeColor =
                  doc.category === 'gil'
                    ? '#06b6d4'
                    : doc.category === 'jit'
                    ? '#f59e0b'
                    : doc.category === 'memory'
                    ? '#10b981'
                    : '#ec4899';

                const offset = doc.labelOffset || { dx: 14, dy: 4 };

                return (
                  <g
                    key={doc.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDocDetail(doc);
                    }}
                    onMouseEnter={() => setHoveredDoc(doc)}
                    onMouseLeave={() => setHoveredDoc(null)}
                  >
                    {/* Outer Glow Ring for Top-K Matches */}
                    {isRetrieved && (
                      <circle
                        cx={doc.x}
                        cy={doc.y}
                        r="24"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Selection Ring */}
                    {(isRetrieved || isSelected || isHovered) && (
                      <circle
                        cx={doc.x}
                        cy={doc.y}
                        r={isRetrieved ? 15 : 12}
                        fill="none"
                        stroke={isRetrieved ? '#a855f7' : nodeColor}
                        strokeWidth="2"
                        opacity="0.9"
                      />
                    )}

                    {/* Central Node Circle */}
                    <circle
                      cx={doc.x}
                      cy={doc.y}
                      r={isRetrieved ? 9 : 7}
                      fill={isRetrieved ? '#a855f7' : nodeColor}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />

                    {/* Clean Pill Label Container with High-Contrast Background */}
                    <g transform={`translate(${doc.x + offset.dx}, ${doc.y + offset.dy - 11})`}>
                      <rect
                        width={doc.shortTitle.length * 7 + 16}
                        height="20"
                        rx="6"
                        fill="#020617"
                        stroke={isRetrieved ? '#a855f7' : isHovered ? nodeColor : '#334155'}
                        strokeWidth={isRetrieved || isHovered ? '1.5' : '1'}
                        opacity="0.96"
                      />
                      <text
                        x="8"
                        y="13.5"
                        fill={isRetrieved ? '#ffffff' : isHovered ? '#f1f5f9' : '#94a3b8'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight={isRetrieved ? 'bold' : '500'}
                      >
                        {doc.shortTitle}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* User Query Vector Anchor (Rose/Purple) */}
              <g>
                {/* Radar Sweep / Search Pulse Ring */}
                <circle
                  cx={queryPoint.x}
                  cy={queryPoint.y}
                  r="28"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  opacity="0.4"
                  className="animate-pulse"
                />

                <circle
                  cx={queryPoint.x}
                  cy={queryPoint.y}
                  r="14"
                  fill="#f43f5e"
                  fillOpacity="0.2"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />

                <circle
                  cx={queryPoint.x}
                  cy={queryPoint.y}
                  r="6"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Clear Floating Query Vector Badge with non-clipping position */}
                <g transform={`translate(${queryPoint.x - 48}, ${queryPoint.y - 32})`}>
                  <rect
                    width="96"
                    height="20"
                    rx="10"
                    fill="#be123c"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    opacity="0.95"
                  />
                  <text
                    x="48"
                    y="13.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.5"
                  >
                    QUERY VECTOR
                  </text>
                </g>
              </g>
            </svg>

            {/* Stage Footer Help Tag */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-slate-950/90 px-3 py-1 rounded-md border border-slate-800 text-[10px] font-mono text-slate-400">
              <Info className="h-3 w-3 text-purple-400" />
              <span>Click anywhere on the map to re-project search query vector</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            In PyTorch with Sentence-Transformers, high-dimensional cosine similarity calculates angular distance: <code className="text-purple-300 font-mono">cos_sim = (A &bull; B) / (||A|| &bull; ||B||)</code>. ChromaDB traverses hierarchical Navigable Small World (HNSW) graphs in sub-millisecond time.
          </p>
        </div>

        {/* Right: Retrieved Chunks & Streaming LLM Synthesis (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-purple-400" />
                <span>Top-K Retrieved Context (ChromaDB)</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                3.8 ms HNSW
              </span>
            </div>

            {/* Retrieved Context Cards */}
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {retrievedDocs.map((doc, idx) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocDetail(doc)}
                  className={`rounded-xl border p-2.5 space-y-1 cursor-pointer transition-all ${
                    selectedDocDetail?.id === doc.id
                      ? 'border-purple-500 bg-purple-950/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-purple-300 font-bold truncate max-w-[200px]">
                      [Source {idx + 1}]: {doc.title}
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono text-[10px]">
                      Similarity: {doc.similarity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {doc.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Generative Streaming Output */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5 font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Synthesized Architectural Response</span>
                </span>
                {isProcessing && (
                  <span className="text-[10px] font-mono text-amber-400 animate-pulse flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                    Streaming SSE Tokens...
                  </span>
                )}
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800/80 p-3 min-h-[110px] text-xs text-slate-200 leading-relaxed font-sans shadow-inner">
                {streamedText}
                {isProcessing && (
                  <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse align-middle" />
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              <span>FastAPI SSE Response Stream</span>
            </span>
            <span className="text-emerald-400 font-bold">200 OK &bull; chunked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

