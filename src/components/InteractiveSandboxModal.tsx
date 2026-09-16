import React from 'react';
import { X, Terminal } from 'lucide-react';
import { InteractiveSandbox } from './InteractiveSandbox';
import { useEscapeToClose } from '../hooks/useEscapeToClose';

interface InteractiveSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPresetId?: string;
  customCode?: string;
}

export const InteractiveSandboxModal: React.FC<InteractiveSandboxModalProps> = ({
  isOpen,
  onClose,
  initialPresetId = 'comprehension',
  customCode
}) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-md transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sandbox-modal-title"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative flex h-full max-h-[88vh] w-full max-w-6xl flex-col rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Chrome */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h2 id="sandbox-modal-title" className="text-sm font-bold text-white flex items-center gap-2">
                Live CPython Interactive Terminal & Execution Engine
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 text-[10px] font-mono text-emerald-400">
                  CPython 3.14 (WASM)
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Architectural playground for Python algorithms, protocols, and standard library modules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Close Sandbox Modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          <InteractiveSandbox
            initialPresetId={initialPresetId}
            customCode={customCode}
            isModalView={true}
          />
        </div>
      </div>
    </div>
  );
};
