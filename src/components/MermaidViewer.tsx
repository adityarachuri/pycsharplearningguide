import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import {
  Copy,
  Check,
  Eye,
  Code,
  RefreshCw,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  Download,
  X
} from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
  title?: string;
  caption?: string;
  id?: string;
}

let isMermaidInitialized = false;

function ensureMermaidConfigured() {
  if (isMermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
    themeVariables: {
      darkMode: true,
      background: '#090d16',
      primaryColor: '#1e293b',
      primaryTextColor: '#f8fafc',
      primaryBorderColor: '#f59e0b',
      lineColor: '#60a5fa',
      secondaryColor: '#0f172a',
      tertiaryColor: '#1e1b4b',
      noteBkgColor: '#1e293b',
      noteTextColor: '#fbbf24',
      noteBorderColor: '#f59e0b'
    },
    flowchart: {
      htmlLabels: true,
      curve: 'basis'
    },
    sequence: {
      actorFontSize: 13,
      messageFontSize: 12,
      noteFontSize: 11
    }
  });
  isMermaidInitialized = true;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  chart,
  title,
  caption,
  id
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRendering, setIsRendering] = useState(true);

  // Zoom & Pan State
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate safe stable base identifier
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, '_');
  const baseId = id ? id.replace(/[^a-zA-Z0-9_-]/g, '_') : `mm_${reactId}`;

  useEffect(() => {
    let isMounted = true;
    ensureMermaidConfigured();

    const renderDiagram = async () => {
      setIsRendering(true);
      setError(null);

      // Unique alphanumeric ID per render attempt to avoid DOM collisions
      const renderId = `${baseId}_${Math.random().toString(36).substring(2, 8)}_${Date.now()}`;

      const cleanupTempElements = () => {
        try {
          document.getElementById(renderId)?.remove();
          document.getElementById(`d${renderId}`)?.remove();
          document.querySelectorAll(`[id*="${renderId}"]`).forEach(el => el.remove());
        } catch {
          // ignore DOM cleanup issues
        }
      };

      try {
        cleanupTempElements();
        const cleanChart = chart.trim();

        const { svg, bindFunctions } = await mermaid.render(renderId, cleanChart);

        if (isMounted) {
          setSvgContent(svg);
          setError(null);
          setIsRendering(false);

          setTimeout(() => {
            if (isMounted && containerRef.current && bindFunctions) {
              bindFunctions(containerRef.current);
            }
          }, 50);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Mermaid render error for diagram:', baseId, err);
          setError(err?.message || 'Failed to parse or render diagram');
          setIsRendering(false);
        }
      } finally {
        cleanupTempElements();
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, baseId, retryCount]);

  const copyCode = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const retryRender = () => {
    setRetryCount(prev => prev + 1);
  };

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(3.0, Number((prev + 0.2).toFixed(1))));
  const handleZoomOut = () => setScale(prev => Math.max(0.5, Number((prev - 0.2).toFixed(1))));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setScale(prev => Math.min(3.0, Math.max(0.5, Number((prev + delta).toFixed(2)))));
  };

  // Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch pan & pinch
  const touchStateRef = useRef<{ initialDist: number; initialScale: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStateRef.current = { initialDist: dist, initialScale: scale };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
    } else if (e.touches.length === 2 && touchStateRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStateRef.current.initialDist;
      setScale(Math.min(3.0, Math.max(0.5, Number((touchStateRef.current.initialScale * ratio).toFixed(2)))));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStateRef.current = null;
  };

  // Export SVG
  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(title || 'architecture_diagram').toLowerCase().replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  // Fullscreen keyboard listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isFullscreen && e.key === 'Escape') {
        setIsFullscreen(false);
        handleResetZoom();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  // Shared zoom controls toolbar
  const renderZoomBar = (inModal = false) => (
    <div className={`flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-900/90 p-1 backdrop-blur-md ${inModal ? 'scale-105' : ''}`}>
      <button
        onClick={handleZoomOut}
        disabled={scale <= 0.5}
        className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-colors"
        title="Zoom Out (-)"
        aria-label="Zoom Out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={handleResetZoom}
        className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 hover:bg-amber-500/20 rounded transition-colors"
        title="Reset zoom to 100%"
        aria-label="Reset Zoom"
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        onClick={handleZoomIn}
        disabled={scale >= 3.0}
        className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-colors"
        title="Zoom In (+)"
        aria-label="Zoom In"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={handleResetZoom}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        title="Reset View"
        aria-label="Reset View"
      >
        <RotateCcw className="h-3 w-3" />
      </button>
      <button
        onClick={handleDownloadSvg}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors hidden sm:flex"
        title="Download high-res SVG"
        aria-label="Download SVG"
      >
        {downloadSuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() => {
          setIsFullscreen(!isFullscreen);
          if (!isFullscreen) handleResetZoom();
        }}
        className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/20 transition-colors"
        title={isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen Lightbox'}
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-2xl transition-all">
        {/* Header bar with controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/70 px-4 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`h-2 w-2 rounded-full shrink-0 ${error ? 'bg-rose-400' : isRendering ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider truncate">
              {title || 'Architecture & Execution Diagram'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls Bar */}
            {!showSource && !error && svgContent && renderZoomBar(false)}

            <button
              onClick={() => setShowSource(!showSource)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                showSource
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
              title="Toggle raw Mermaid syntax"
            >
              {showSource ? <Eye className="h-3.5 w-3.5" /> : <Code className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{showSource ? 'View Diagram' : 'View Code'}</span>
            </button>

            <button
              onClick={copyCode}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              title="Copy Mermaid source"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px] hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px] hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Diagram Canvas or Source Code */}
        <div
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={() => setScale(scale > 1.1 ? 1 : 1.6)}
          className={`relative p-4 md:p-6 overflow-hidden min-h-[180px] flex items-center justify-center select-none ${
            isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
          }`}
          style={{ touchAction: 'none' }}
        >
          {showSource ? (
            <pre className="w-full font-mono text-xs text-amber-300 bg-slate-900 p-4 rounded-xl overflow-x-auto border border-slate-800 leading-relaxed">
              {chart}
            </pre>
          ) : error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 text-xs text-rose-300 w-full space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Diagram could not be rendered:</span>
                </div>
                <button
                  onClick={retryRender}
                  className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/30 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </button>
              </div>
              <p className="font-mono text-[11px] text-rose-400/90 bg-slate-950/60 p-2.5 rounded border border-rose-500/20 overflow-x-auto">
                {error}
              </p>
              <div>
                <p className="text-[11px] text-slate-400 mb-1 font-semibold">Mermaid Source Specification:</p>
                <pre className="bg-slate-950 p-3 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80">
                  {chart}
                </pre>
              </div>
            </div>
          ) : svgContent ? (
            <div
              ref={containerRef}
              className="w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto filter drop-shadow-md origin-center transition-transform"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-8">
              <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
              <span>Rendering high-resolution architecture diagram...</span>
            </div>
          )}

          {/* Pan hint when zoomed */}
          {scale > 1.05 && !showSource && (
            <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 text-[10px] font-mono text-amber-300 backdrop-blur-sm border border-slate-800/80">
              <Move className="h-3 w-3" />
              <span>Pan &amp; Drag • Double-click to reset</span>
            </div>
          )}
        </div>

        {caption && (
          <div className="border-t border-slate-800/60 bg-slate-900/40 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="text-amber-400">◈</span>
              <span className="truncate">{caption}</span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline font-mono">
              Scroll / Pinch to zoom
            </span>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreen && svgContent && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl animate-fadeIn">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                High-Resolution Diagram Lightbox
              </span>
              <h3 className="text-sm md:text-base font-bold text-white truncate">
                {title || 'Architecture Model'}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {renderZoomBar(true)}
              <button
                onClick={() => {
                  setIsFullscreen(false);
                  handleResetZoom();
                }}
                className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-colors"
                title="Close Fullscreen (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Interactive Fullscreen Canvas */}
          <div
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={() => setScale(scale > 1.1 ? 1 : 1.8)}
            className={`relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-6 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ touchAction: 'none' }}
          >
            <div
              className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full origin-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale * 1.3})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-slate-900/90 px-4 py-2 text-xs text-slate-400 border border-slate-800 backdrop-blur-md pointer-events-none shadow-2xl">
              <span>Drag to Pan</span>
              <span>•</span>
              <span>Scroll or Pinch to Zoom ({Math.round(scale * 100)}%)</span>
              <span>•</span>
              <span>Double-Click to Toggle</span>
              <span>•</span>
              <span>Press Esc to Exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
