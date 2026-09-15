import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  Download,
  Check,
  X
} from 'lucide-react';

const ZOOM_STEP = 0.2;
const WHEEL_ZOOM_STEP = 0.15;
const DOUBLE_CLICK_ZOOM_THRESHOLD = 1.1;
const DOUBLE_CLICK_SCALE = 1.6;
const DOWNLOAD_RESET_MS = 2000;

interface ZoomableDiagramWrapperProps {
  children: React.ReactNode;
  title?: string;
  caption?: string;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  enablePan?: boolean;
  className?: string;
  allowDownloadSvg?: boolean;
  zoomTargetSelector?: string;
}

export const ZoomableDiagramWrapper: React.FC<ZoomableDiagramWrapperProps> = ({
  children,
  title,
  caption,
  initialScale = 1,
  minScale = 0.5,
  maxScale = 3.0,
  enablePan = true,
  className = '',
  allowDownloadSvg = true,
  zoomTargetSelector = '[data-zoom-target]'
}) => {
  const [scale, setScale] = useState<number>(initialScale);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fullscreenContentRef = useRef<HTMLDivElement>(null);
  const fullscreenWheelZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyTransform = (root: HTMLDivElement | null, multiplier = 1) => {
      const target = root?.querySelector<HTMLElement>(zoomTargetSelector);
      if (!target) return;

      target.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale * multiplier})`;
      target.style.transformOrigin = 'center center';
      target.style.transition = isDragging ? 'none' : 'transform 0.15s ease-out';
    };

    applyTransform(contentRef.current);
    applyTransform(fullscreenContentRef.current, 1.25);
  }, [isDragging, position.x, position.y, scale, zoomTargetSelector]);

  // Zoom helpers
  const handleZoomIn = () => {
    setScale(prev => Math.min(maxScale, Number((prev + ZOOM_STEP).toFixed(1))));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(minScale, Number((prev - ZOOM_STEP).toFixed(1))));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom when hovering. Attached as a native, non-passive listener (below)
  // because React delegates wheel/touch events as passive by default, which silently
  // ignores preventDefault() and lets the page scroll underneath the diagram while it zooms.
  const applyWheelZoom = (deltaY: number) => {
    const delta = deltaY < 0 ? WHEEL_ZOOM_STEP : -WHEEL_ZOOM_STEP;
    setScale(prev => Number(Math.min(maxScale, Math.max(minScale, prev + delta)).toFixed(2)));
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyWheelZoom(e.deltaY);
    };
    el.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', onNativeWheel);
  }, [maxScale, minScale]);

  useEffect(() => {
    if (!isFullscreen) return;
    const el = fullscreenWheelZoneRef.current;
    if (!el) return;
    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyWheelZoom(e.deltaY);
    };
    el.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', onNativeWheel);
  }, [isFullscreen, maxScale, minScale]);

  // Drag / Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile & tablet pinch & pan
  const touchStateRef = useRef<{
    initialDist: number;
    initialScale: number;
    startX: number;
    startY: number;
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      // Pinch gesture
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      touchStateRef.current = {
        initialDist: dist,
        initialScale: scale,
        startX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        startY: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && touchStateRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / touchStateRef.current.initialDist;
      const newScale = Math.min(maxScale, Math.max(minScale, Number((touchStateRef.current.initialScale * ratio).toFixed(2))));
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStateRef.current = null;
  };

  // Double click to toggle zoom
  const handleDoubleClick = () => {
    if (scale > DOUBLE_CLICK_ZOOM_THRESHOLD) {
      handleReset();
    } else {
      setScale(DOUBLE_CLICK_SCALE);
    }
  };

  // Fullscreen keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        } else if (e.key === '+' || e.key === '=') {
          handleZoomIn();
        } else if (e.key === '-' || e.key === '_') {
          handleZoomOut();
        } else if (e.key === '0') {
          handleReset();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Export SVG / Image if available
  const handleDownload = () => {
    if (!contentRef.current) return;
    const svgEl = contentRef.current.querySelector('svg');
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(title || 'diagram').toLowerCase().replace(/\s+/g, '_')}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setCopied(true);
      setTimeout(() => setCopied(false), DOWNLOAD_RESET_MS);
    }
  };

  // Render controls toolbar
  const renderControls = (inModal = false) => (
    <div
      className={`flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 p-1 backdrop-blur-md shadow-lg ${
        inModal ? 'scale-105' : 'scale-95 sm:scale-100'
      }`}
    >
      <button
        onClick={handleZoomOut}
        disabled={scale <= minScale}
        className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-colors"
        title="Zoom Out (-)"
        aria-label="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      {/* Zoom percentage badge */}
      <button
        onClick={handleReset}
        className="px-2 py-0.5 text-[11px] font-mono font-bold text-amber-300 hover:bg-amber-500/20 rounded-md transition-colors"
        title="Click to reset to 100%"
        aria-label="Reset Zoom"
      >
        {Math.round(scale * 100)}%
      </button>

      <button
        onClick={handleZoomIn}
        disabled={scale >= maxScale}
        className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-colors"
        title="Zoom In (+)"
        aria-label="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      <div className="h-4 w-px bg-slate-700 mx-0.5" />

      <button
        onClick={handleReset}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        title="Reset Pan & Zoom (0)"
        aria-label="Reset Pan and Zoom"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>

      {allowDownloadSvg && (
        <button
          onClick={handleDownload}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors hidden sm:flex"
          title="Export diagram as SVG"
          aria-label="Export SVG"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
        </button>
      )}

      <button
        onClick={() => {
          setIsFullscreen(!isFullscreen);
          handleReset();
        }}
        className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
        title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand to Fullscreen Lightbox'}
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <>
      <div
        className={`group relative rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-xl transition-all ${className}`}
      >
        {/* Header with Title & Zoom Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/80 px-4 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider truncate">
              {title || 'Architecture & Execution Model'}
            </span>
          </div>

          <div className="flex items-center gap-2">{renderControls(false)}</div>
        </div>

        {/* Zoomable & Pannable Viewport */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          className={`relative min-h-45 w-full overflow-hidden p-4 md:p-6 select-none ${
            isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Helpful pan hint overlay when zoomed */}
          {scale > 1.05 && (
            <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 text-[10px] font-mono text-amber-300 backdrop-blur-sm border border-slate-800/80 animate-fadeIn">
              <Move className="h-3 w-3" />
              <span>Drag to pan • Double-click to reset</span>
            </div>
          )}

          {/* Scalable & Translatable Inner Container */}
          <div
            ref={contentRef}
            className="w-full flex items-center justify-center"
          >
            {children}
          </div>
        </div>

        {caption && (
          <div className="border-t border-slate-800/60 bg-slate-900/40 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
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
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl animate-fadeIn">
          {/* Lightbox Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                High-Resolution Lightbox
              </span>
              <h3 className="text-sm md:text-base font-bold text-white truncate">
                {title || 'Diagram & Visualization Inspector'}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {renderControls(true)}
              <button
                onClick={() => {
                  setIsFullscreen(false);
                  handleReset();
                }}
                className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-colors"
                title="Close Fullscreen (Esc)"
                aria-label="Close Lightbox"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Interactive Canvas */}
          <div
            ref={fullscreenWheelZoneRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
            className={`relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-6 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ touchAction: 'none' }}
          >
            <div
              ref={fullscreenContentRef}
              className="w-full h-full flex items-center justify-center origin-center"
            >
              {children}
            </div>

            {/* Floating Navigation Instructions */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full bg-slate-900/90 px-4 py-2 text-xs text-slate-400 border border-slate-800 backdrop-blur-md pointer-events-none shadow-2xl">
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
