import { useState, type ReactElement } from 'react';
import { Play, Terminal, FileCode2, Copy, Check, Layers, Landmark } from 'lucide-react';
import { WorkstationVideoPlayer } from '../components/WorkstationVideoPlayer';
import { CodeBlock } from '../components/CodeBlock';
import { FINTECH_STEPS, FINTECH_ALL_FILES } from '../data/fintechProjectData';

const COPY_RESET_MS = 2000;

export function FintechProjectView(): ReactElement {
  const [activeSceneId, setActiveSceneId] = useState<number>(1);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedActiveFile, setCopiedActiveFile] = useState<boolean>(false);

  const selectedFile = FINTECH_ALL_FILES[selectedFileIdx];

  const quickstartBashScript = `#!/usr/bin/env bash
set -e

echo "🏦 [1/5] Initializing Ledger Service with uv..."
uv init --app ledger-service
cd ledger-service

echo "⚡ [2/5] Installing FastAPI, SQLAlchemy, Redis, and ONNX Runtime..."
uv add "fastapi[standard]>=0.115.0" "sqlalchemy>=2.0.35" "redis>=5.1.0" "psycopg[binary]>=3.2.3" "onnxruntime>=1.19.2"
uv add --dev "pytest>=8.3.3" "pytest-asyncio>=0.24.0" "httpx>=0.27.2" "ruff>=0.6.9"

echo "📂 [3/5] Setting up ledger service modules..."
mkdir -p app/routers app/services app/jobs tests

echo "🔍 [4/5] Running the idempotency guarantee test suite..."
uv run pytest tests/ -v

echo "🚀 [5/5] Launching the Ledger Service..."
echo "API will be ready at: http://127.0.0.1:8000/charges"
uv run uvicorn main:app --reload --port 8000`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(quickstartBashScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), COPY_RESET_MS);
  };

  const handleCopyActiveFile = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedActiveFile(true);
    setTimeout(() => setCopiedActiveFile(false), COPY_RESET_MS);
  };

  return (
    <div id="fintech-project-view" className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-linear-to-b from-amber-500/10 via-slate-900/60 to-slate-950 p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>INDUSTRY BLUEPRINT &bull; FINTECH TECHNICAL IMPLEMENTATION</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Building a Ledger Service: <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-emerald-300">Idempotent Payments, Fraud Scoring & Reconciliation</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              An end-to-end FastAPI + SQLAlchemy ledger service demonstrating the non-negotiables of production fintech engineering: idempotency-key-protected charges, Decimal-safe monetary math, real-time ONNX fraud scoring, and a scheduled pandas-based reconciliation job.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-72 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs font-mono text-slate-400">Monetary Precision</div>
              <div className="text-lg font-bold text-amber-400 font-mono">Decimal(18,2)</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">Fraud Score Latency</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">&lt; 5 ms</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">Idempotency Guard</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">DB + Redis</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">Reconciliation</div>
              <div className="text-lg font-bold text-purple-400 font-mono">pandas outer-merge</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Studio */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Play className="h-5 w-5 text-amber-400" />
              <span>Ledger Service Build: Video &amp; Animation Studio</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive timeline walking through scaffolding, schema design, the idempotent charge endpoint, fraud scoring integration, and verification.
            </p>
          </div>
        </div>

        <WorkstationVideoPlayer
          projectName="Ledger Service"
          projectBadge="FastAPI + SQLAlchemy + ONNX Stack"
          scenes={FINTECH_STEPS}
          activeSceneId={activeSceneId}
          onSelectScene={setActiveSceneId}
          accentColor="amber"
        />
      </section>

      {/* Quickstart */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-amber-400" />
              <span>Scaffold the Ledger Service Locally</span>
            </h3>
            <p className="text-xs text-slate-400">
              Copy and paste this script into your terminal to scaffold, test, and launch the service.
            </p>
          </div>

          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold font-mono transition-colors shadow-md shadow-amber-500/20"
          >
            {copiedScript ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Quickstart Script'}</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre>{quickstartBashScript}</pre>
        </div>
      </section>

      {/* File Explorer */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-amber-400" />
              <span>Complete Ledger Service Codebase Explorer</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Every production source file, with zero omitted code or pseudo-code stubs.
            </p>
          </div>

          <button
            onClick={handleCopyActiveFile}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 text-xs font-mono font-medium transition-colors"
          >
            {copiedActiveFile ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedActiveFile ? 'Copied File' : `Copy ${selectedFile.filename}`}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {FINTECH_ALL_FILES.map((file, idx) => {
            const isActive = idx === selectedFileIdx;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIdx(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  isActive
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold shadow-xs'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{file.filename}</span>
                <span className="text-[10px] opacity-60 uppercase">[{file.category}]</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-amber-400 font-bold">Path:</span>
              <span>{selectedFile.path}</span>
            </div>
            <span className="text-xs text-slate-400">{selectedFile.summary}</span>
          </div>

          <div className="p-2">
            <CodeBlock
              code={selectedFile.content}
              language={selectedFile.filename.endsWith('.toml') ? 'toml' : 'python'}
            />
          </div>
        </div>
      </section>

      {/* Stack comparison */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <span>.NET Fintech Stack vs. Python Fintech Stack Matrix</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Where each ecosystem’s tooling naturally fits in a production financial system.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300 font-mono">
                <th className="p-3">Fintech Concern</th>
                <th className="p-3 text-blue-400">C# / .NET Stack</th>
                <th className="p-3 text-amber-400">Python Stack</th>
                <th className="p-3 text-slate-400">Trade-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white flex items-center gap-2"><Landmark className="h-3.5 w-3.5 text-amber-400" />Monetary Precision</td>
                <td className="p-3 font-mono text-blue-300">decimal (128-bit)</td>
                <td className="p-3 font-mono text-amber-300">decimal.Decimal (arbitrary precision)</td>
                <td className="p-3 text-slate-400">Functionally equivalent correctness guarantee; both explicitly reject IEEE-754 binary float for money.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Fraud/Risk Model Training</td>
                <td className="p-3 font-mono text-blue-300">ML.NET (limited GBM support)</td>
                <td className="p-3 font-mono text-amber-300">XGBoost / scikit-learn</td>
                <td className="p-3 text-slate-400">Python’s gradient-boosting ecosystem is meaningfully more mature; export to ONNX to serve from either language.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Reconciliation & Batch Analytics</td>
                <td className="p-3 font-mono text-blue-300">LINQ over collections / EF Core</td>
                <td className="p-3 font-mono text-amber-300">pandas DataFrame merge/groupby</td>
                <td className="p-3 text-slate-400">pandas scales more naturally to million-row in-memory reconciliation; LINQ is well-suited to smaller in-process datasets.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Core Ledger / Matching Engine</td>
                <td className="p-3 font-mono text-blue-300">C# (high-throughput, low-latency)</td>
                <td className="p-3 font-mono text-amber-300">Python (viable at moderate throughput)</td>
                <td className="p-3 text-slate-400">At the highest-frequency tier (exchange matching engines), C#/C++/Java still dominate over Python’s GIL-constrained single-thread event loop.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
