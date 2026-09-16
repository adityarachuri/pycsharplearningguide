import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BrainCircuit,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Play,
  X,
  Layers,
  Cpu,
  ShieldAlert,
  Boxes,
  Zap,
  Terminal,
  Filter,
  FunctionSquare,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { MINDMAP_DOMAINS, MINDMAP_NODES } from '../data/mindmapData';
import { COPY_RESET_MS } from '../constants';

interface MindmapVisualizerProps {
  onLaunchSandbox?: (code: string) => void;
  className?: string;
}

type ViewMode = 'graph' | 'bridge';

const MIN_ZOOM_LEVEL = 0.7;
const MAX_ZOOM_LEVEL = 1.5;
const ZOOM_STEP = 0.1;

export const MindmapVisualizer: React.FC<MindmapVisualizerProps> = ({
  onLaunchSandbox,
  className = ''
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-linq-comprehensions');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // SVG canvas container ref, measured so the fixed-size virtual canvas
  // below can always be scaled to fit inside it — no scrollbars, ever.
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const node = svgContainerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const selectedNode = useMemo(() => {
    return MINDMAP_NODES.find(n => n.id === selectedNodeId) || MINDMAP_NODES[0];
  }, [selectedNodeId]);

  const selectedDomain = useMemo(() => {
    return MINDMAP_DOMAINS.find(d => d.id === selectedNode.domainId) || MINDMAP_DOMAINS[0];
  }, [selectedNode]);

  // Filtered nodes based on domain, difficulty, and search query
  const filteredNodes = useMemo(() => {
    return MINDMAP_NODES.filter(node => {
      const matchesDomain = selectedDomainId === 'all' || node.domainId === selectedDomainId;
      const matchesDifficulty = selectedDifficulty === 'all' || node.difficulty === selectedDifficulty;
      const matchesSearch =
        searchQuery.trim() === '' ||
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.csharpConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.pythonConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.cognitiveShift.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDomain && matchesDifficulty && matchesSearch;
    });
  }, [selectedDomainId, selectedDifficulty, searchQuery]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), COPY_RESET_MS);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(prev + delta, MIN_ZOOM_LEVEL), MAX_ZOOM_LEVEL));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Navigate to adjacent node
  const handleStepNode = (direction: 'prev' | 'next') => {
    const currentIndex = filteredNodes.findIndex(n => n.id === selectedNodeId);
    if (currentIndex === -1) return;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % filteredNodes.length
        : (currentIndex - 1 + filteredNodes.length) % filteredNodes.length;
    setSelectedNodeId(filteredNodes[nextIndex].id);
  };

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="h-4 w-4" />;
      case 'Layers':
        return <Layers className="h-4 w-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="h-4 w-4" />;
      case 'Boxes':
        return <Boxes className="h-4 w-4" />;
      case 'Zap':
        return <Zap className="h-4 w-4" />;
      case 'Terminal':
        return <Terminal className="h-4 w-4" />;
      case 'FunctionSquare':
        return <FunctionSquare className="h-4 w-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="h-4 w-4" />;
      case 'Globe':
        return <Globe className="h-4 w-4" />;
      default:
        return <BrainCircuit className="h-4 w-4" />;
    }
  };

  // Domain hubs are positioned radially around the center; each domain's
  // nodes then branch outward from its hub.
  const graphLayout = useMemo(() => {
    const width = 1050;
    const height = 720;
    const centerX = width / 2;
    const centerY = height / 2;

    const root = { x: centerX, y: centerY, label: 'C# ⟷ Python Mental Nexus' };

    const domainPositions: Record<string, { x: number; y: number; angle: number }> = {};
    const domainRadius = 210;

    MINDMAP_DOMAINS.forEach((domain, idx) => {
      const angle = (idx * (2 * Math.PI)) / MINDMAP_DOMAINS.length - Math.PI / 2;
      domainPositions[domain.id] = {
        x: centerX + Math.cos(angle) * (domainRadius * 1.05),
        y: centerY + Math.sin(angle) * (domainRadius * 0.82),
        angle
      };
    });

    const nodePositions: Record<string, { x: number; y: number }> = {};

    MINDMAP_DOMAINS.forEach(domain => {
      const dPos = domainPositions[domain.id];
      const domainNodes = MINDMAP_NODES.filter(n => n.domainId === domain.id);
      const count = domainNodes.length;

      domainNodes.forEach((node, nodeIdx) => {
        // Spread outward from domain position
        const spreadAngle = count > 1 ? ((nodeIdx - (count - 1) / 2) * 0.45) : 0;
        const totalAngle = dPos.angle + spreadAngle;
        const leafDistance = 145;

        // Position with horizontal stretch for better aspect ratio
        const x = dPos.x + Math.cos(totalAngle) * leafDistance * 1.15;
        const y = dPos.y + Math.sin(totalAngle) * leafDistance * 0.85;

        nodePositions[node.id] = { x, y };
      });
    });

    return { width, height, centerX, centerY, root, domainPositions, nodePositions };
  }, []);

  // Scale the fixed 1050x720 virtual canvas down (or up) to exactly fill the
  // measured container, so the entire mindmap is always visible in one view
  // with no scrollbar — regardless of the container's actual width/height on
  // a given screen. A small padding factor keeps the outermost nodes clear
  // of the container's edge. The user's own zoom buttons multiply on top of
  // this fit baseline (100% = "fit to view", not 100% of the raw 1050px).
  const CANVAS_PADDING_FACTOR = 0.94;
  const autoFitScale = useMemo(() => {
    if (!containerSize || containerSize.width === 0 || containerSize.height === 0) return 1;
    const scaleX = (containerSize.width / graphLayout.width) * CANVAS_PADDING_FACTOR;
    const scaleY = (containerSize.height / graphLayout.height) * CANVAS_PADDING_FACTOR;
    return Math.min(scaleX, scaleY);
  }, [containerSize, graphLayout.width, graphLayout.height]);

  const appliedScale = autoFitScale * zoomLevel;

  return (
    <div
      id="mindmap-visualizer-container"
      className={`rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl overflow-hidden backdrop-blur-sm ${className}`}
    >
      {/* Top Header & Interactive Toolbar */}
      <div className="border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Architectural Mindmap Visualizer
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-400">
                    Rosetta 2.0
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Cognitive relational mapping between C# (.NET CLR) paradigms and Python (CPython) equivalents
              </p>
            </div>
          </div>

          {/* View Mode & Control Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === 'graph'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Radial Mindmap Graph"
              >
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>Radial Mindmap</span>
              </button>
              <button
                onClick={() => setViewMode('bridge')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === 'bridge'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Direct Dual-Column Bridge"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Dual-Column Bridge</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search concepts, LINQ, GIL..."
                aria-label="Search mindmap concepts"
                className="w-44 sm:w-56 rounded-xl border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Domain Filter Bar */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-800/80 pt-3">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="h-3 w-3 text-slate-400" />
            Domains:
          </span>
          <button
            onClick={() => setSelectedDomainId('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              selectedDomainId === 'all'
                ? 'bg-slate-200 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All ({MINDMAP_NODES.length})
          </button>

          {MINDMAP_DOMAINS.map(domain => {
            const count = MINDMAP_NODES.filter(n => n.domainId === domain.id).length;
            const isSelected = selectedDomainId === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap border transition-all ${
                  isSelected
                    ? `${domain.accentBg} ${domain.accentBorder} ${domain.textColor} font-bold shadow-xs`
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{getDomainIcon(domain.iconName)}</span>
                <span>{domain.shortName}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Canvas & Inspection Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12">
        {/* Left/Top Interactive Graph / Bridge Canvas */}
        <div className="xl:col-span-7 border-b xl:border-b-0 xl:border-r border-slate-800 bg-slate-950/40 relative flex flex-col aspect-1050/720 min-h-100 max-h-160">
          {/* Canvas Floating Controls */}
          {viewMode === 'graph' && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
              <button
                onClick={() => handleZoom(ZOOM_STEP)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleZoom(-ZOOM_STEP)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1.5">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          )}

          {/* Quick Stats Legend */}
          <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Active Node: <strong className="text-white">{selectedNode.title}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>Click any node to inspect</span>
          </div>

          {/* MODE 1: RADIAL GRAPH MINDMAP VIEW — the 1050x720 canvas below is
              scaled by `appliedScale` (auto-fit-to-container × the user's own
              zoom multiplier) so the whole mindmap is always visible in one
              view. `overflow-hidden` is intentional: nothing should ever need
              to scroll here, since the canvas is always scaled to fit. */}
          {viewMode === 'graph' ? (
            <div
              ref={svgContainerRef}
              className="flex-1 w-full h-full overflow-hidden flex items-center justify-center p-4 select-none"
            >
              <div
                style={{
                  transform: `scale(${appliedScale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="w-262.5 h-180 relative shrink-0"
              >
                <svg
                  width={graphLayout.width}
                  height={graphLayout.height}
                  className="w-full h-full"
                  viewBox={`0 0 ${graphLayout.width} ${graphLayout.height}`}
                >
                  <defs>
                    <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="activeBranchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>

                  {/* Central Background Ambient Glow */}
                  <circle
                    cx={graphLayout.centerX}
                    cy={graphLayout.centerY}
                    r="160"
                    fill="url(#hubGlow)"
                  />

                  {/* Connection Lines from Center Root to 6 Domain Hubs */}
                  {MINDMAP_DOMAINS.map(domain => {
                    const dPos = graphLayout.domainPositions[domain.id];
                    const isDomainActive = selectedNode.domainId === domain.id;

                    return (
                      <g key={`root-line-${domain.id}`}>
                        <path
                          d={`M ${graphLayout.centerX} ${graphLayout.centerY} Q ${(graphLayout.centerX + dPos.x) / 2} ${(graphLayout.centerY + dPos.y) / 2} ${dPos.x} ${dPos.y}`}
                          fill="none"
                          stroke={isDomainActive ? domain.color : '#334155'}
                          strokeWidth={isDomainActive ? 3 : 1.5}
                          strokeDasharray={isDomainActive ? 'none' : '4,4'}
                          opacity={isDomainActive ? 0.9 : 0.4}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}

                  {/* Connection Lines from Domain Hubs to Feature Nodes */}
                  {MINDMAP_NODES.map(node => {
                    const domain = MINDMAP_DOMAINS.find(d => d.id === node.domainId);
                    if (!domain) return null;
                    const dPos = graphLayout.domainPositions[domain.id];
                    const nPos = graphLayout.nodePositions[node.id];
                    if (!dPos || !nPos) return null;

                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isDimmed =
                      (selectedDomainId !== 'all' && node.domainId !== selectedDomainId) ||
                      (searchQuery && !filteredNodes.some(fn => fn.id === node.id));

                    // Curve control point
                    const cx = (dPos.x + nPos.x) / 2;
                    const cy = (dPos.y + nPos.y) / 2;

                    return (
                      <g key={`leaf-line-${node.id}`} opacity={isDimmed ? 0.2 : 1}>
                        <path
                          d={`M ${dPos.x} ${dPos.y} Q ${cx} ${cy} ${nPos.x} ${nPos.y}`}
                          fill="none"
                          stroke={isSelected || isHovered ? domain.color : '#334155'}
                          strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                          className="transition-all duration-200"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* HTML Interactive Overlay Nodes (Crisp typography & buttons) */}

                {/* Center Root Hub */}
                <div
                  style={{
                    left: `${graphLayout.centerX}px`,
                    top: `${graphLayout.centerY}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute z-20 flex flex-col items-center justify-center rounded-2xl border-2 border-amber-500/60 bg-slate-900/95 px-4 py-3 shadow-xl shadow-amber-500/10 text-center w-52 pointer-events-auto"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    Mental Nexus
                  </div>
                  <div className="mt-1 text-xs font-extrabold text-white">
                    C# (.NET) ⟷ Python (CPython)
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {MINDMAP_NODES.length} Conceptual Paradigms
                  </div>
                </div>

                {/* 6 Domain Hubs */}
                {MINDMAP_DOMAINS.map(domain => {
                  const dPos = graphLayout.domainPositions[domain.id];
                  const isDomainSelected = selectedNode.domainId === domain.id;
                  const count = MINDMAP_NODES.filter(n => n.domainId === domain.id).length;

                  return (
                    <button
                      key={`hub-${domain.id}`}
                      onClick={() => {
                        setSelectedDomainId(domain.id);
                        const firstInDomain = MINDMAP_NODES.find(n => n.domainId === domain.id);
                        if (firstInDomain) setSelectedNodeId(firstInDomain.id);
                      }}
                      style={{
                        left: `${dPos.x}px`,
                        top: `${dPos.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className={`absolute z-20 flex items-center gap-2 rounded-xl border px-3 py-2 text-left shadow-lg backdrop-blur-md transition-all hover:scale-105 ${
                        isDomainSelected
                          ? `${domain.accentBg} ${domain.accentBorder} shadow-md`
                          : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                      >
                        {getDomainIcon(domain.iconName)}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white whitespace-nowrap">
                          {domain.shortName}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {count} mappings
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Leaf Feature Nodes */}
                {MINDMAP_NODES.map(node => {
                  const nPos = graphLayout.nodePositions[node.id];
                  if (!nPos) return null;
                  const domain = MINDMAP_DOMAINS.find(d => d.id === node.domainId);
                  const isSelected = selectedNodeId === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const isDimmed =
                    (selectedDomainId !== 'all' && node.domainId !== selectedDomainId) ||
                    (searchQuery && !filteredNodes.some(fn => fn.id === node.id));

                  return (
                    <button
                      key={`node-${node.id}`}
                      onClick={() => setSelectedNodeId(node.id)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      style={{
                        left: `${nPos.x}px`,
                        top: `${nPos.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className={`absolute z-30 flex flex-col rounded-xl border px-2.5 py-1.5 text-left text-xs transition-all w-44 shadow-md backdrop-blur-md ${
                        isDimmed ? 'opacity-25 pointer-events-none' : 'opacity-100'
                      } ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 text-white ring-2 ring-amber-400/40 scale-105 shadow-amber-500/20'
                          : isHovered
                          ? 'border-slate-600 bg-slate-800/95 text-slate-100 scale-102'
                          : 'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: domain?.color || '#38bdf8' }}
                        />
                        <span className="text-[9px] font-mono uppercase text-slate-500 truncate">
                          {node.difficulty}
                        </span>
                      </div>
                      <div className="mt-0.5 font-semibold text-[11px] leading-tight text-white line-clamp-1">
                        {node.title}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <span className="text-purple-400 font-mono truncate max-w-[45%]">
                          {node.csharpConcept.split(' ')[0]}
                        </span>
                        <ArrowRightLeft className="h-2.5 w-2.5 text-slate-600 shrink-0" />
                        <span className="text-amber-400 font-mono truncate max-w-[45%]">
                          {node.pythonConcept.split(' ')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* MODE 2: DUAL-COLUMN COGNITIVE RELAY BRIDGE VIEW */
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-150">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  <strong>Left: C# (.NET CLR)</strong>
                </span>
                <span className="text-slate-500 text-[11px]">Cognitive Bridge Connector</span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <strong>Right: Python (CPython)</strong>
                </span>
              </div>

              {filteredNodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const domain = MINDMAP_DOMAINS.find(d => d.id === node.domainId);

                return (
                  <button
                    key={`bridge-${node.id}`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-500/10 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/30'
                        : 'border-slate-800/90 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: domain?.color || '#38bdf8' }}
                        />
                        <span className="text-xs font-bold text-white">{node.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase rounded bg-slate-950 px-1.5 py-0.5 border border-slate-800">
                        {node.difficulty}
                      </span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Left: C# */}
                      <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 p-2.5 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                          C# .NET Approach:
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {node.csharpConcept}
                        </p>
                      </div>

                      {/* Right: Python */}
                      <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-2.5 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          Pythonic Counterpart:
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {node.pythonConcept}
                        </p>
                      </div>
                    </div>

                    {/* Cognitive leap summary */}
                    <div className="mt-2 text-[11px] text-slate-400 line-clamp-1 italic">
                      <strong className="text-slate-300 not-italic">Cognitive Leap: </strong>
                      {node.cognitiveShift}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right/Bottom Inspector Detail Workspace */}
        <div className="xl:col-span-5 p-5 md:p-6 space-y-5 bg-slate-950/90 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Inspector Header with Navigation Steps */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
                  style={{
                    backgroundColor: `${selectedDomain.color}25`,
                    color: selectedDomain.color,
                    border: `1px solid ${selectedDomain.color}50`
                  }}
                >
                  {getDomainIcon(selectedDomain.iconName)}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {selectedDomain.name}
                </span>
              </div>

              {/* Step Prev/Next */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStepNode('prev')}
                  className="rounded-lg border border-slate-800 p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  title="Previous concept"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-[10px] font-mono text-slate-500 px-1">
                  {filteredNodes.findIndex(n => n.id === selectedNodeId) + 1} / {filteredNodes.length}
                </span>
                <button
                  onClick={() => handleStepNode('next')}
                  className="rounded-lg border border-slate-800 p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  title="Next concept"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Title & Tag Pills */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase">
                  {selectedNode.difficulty}
                </span>
                {selectedNode.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-2 text-lg font-bold text-white tracking-tight">
                {selectedNode.title}
              </h3>
            </div>

            {/* The Cognitive Shift / Mental Model Callout */}
            <div className="rounded-xl border border-amber-500/30 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                The Mental Rewiring (Cognitive Shift)
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedNode.cognitiveShift}
              </p>
            </div>

            {/* Side-by-Side Code Translation */}
            <div className="space-y-3">
              {/* C# Snippet */}
              <div className="rounded-xl border border-purple-500/25 bg-slate-900/70 overflow-hidden">
                <div className="flex items-center justify-between border-b border-purple-500/20 bg-purple-950/30 px-3 py-1.5 text-[11px]">
                  <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-400" />
                    C# (.NET Approach)
                  </span>
                  <button
                    onClick={() => handleCopy(selectedNode.csharpCode, 'csharp')}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                  >
                    {copiedCode === 'csharp' ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copiedCode === 'csharp' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                  <code>{selectedNode.csharpCode}</code>
                </pre>
              </div>

              {/* Python Snippet */}
              <div className="rounded-xl border border-amber-500/25 bg-slate-900/70 overflow-hidden">
                <div className="flex items-center justify-between border-b border-amber-500/20 bg-amber-950/30 px-3 py-1.5 text-[11px]">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Python (CPython Idiom)
                  </span>
                  <button
                    onClick={() => handleCopy(selectedNode.pythonCode, 'python')}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                  >
                    {copiedCode === 'python' ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copiedCode === 'python' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 font-mono text-[11px] text-amber-200/90 overflow-x-auto leading-relaxed">
                  <code>{selectedNode.pythonCode}</code>
                </pre>
              </div>
            </div>

            {/* The Architect's Trap / Gotcha */}
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                <ShieldAlert className="h-3.5 w-3.5" />
                The C# Architect's Gotcha:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.gotcha}
              </p>
            </div>
          </div>

          {/* Action Trigger: Run in Sandbox */}
          {selectedNode.sandboxCode && onLaunchSandbox && (
            <div className="pt-3 border-t border-slate-800/80">
              <button
                onClick={() => onLaunchSandbox(selectedNode.sandboxCode!)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-linear-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-slate-950" />
                <span>Execute &amp; Experiment in Python Sandbox</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
