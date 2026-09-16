import { useState, type ReactElement } from 'react';
import { Play, Terminal, FileCode2, Copy, Check, Layers, HeartPulse } from 'lucide-react';
import { WorkstationVideoPlayer } from '../components/WorkstationVideoPlayer';
import { CodeBlock } from '../components/CodeBlock';
import { HEALTHTECH_STEPS, HEALTHTECH_ALL_FILES } from '../data/healthtechProjectData';
import { COPY_RESET_MS } from '../constants';

export function HealthtechProjectView(): ReactElement {
  const [activeSceneId, setActiveSceneId] = useState<number>(1);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedActiveFile, setCopiedActiveFile] = useState<boolean>(false);

  const selectedFile = HEALTHTECH_ALL_FILES[selectedFileIdx];

  const quickstartBashScript = `#!/usr/bin/env bash
set -e

echo "🏥 [1/5] Initializing Patient Records Service with uv..."
uv init --app patient-records-service
cd patient-records-service

echo "⚡ [2/5] Installing FastAPI, fhir.resources, and structlog..."
uv add "fastapi[standard]>=0.115.0" "fhir.resources>=7.1.0" "sqlalchemy>=2.0.35" "structlog>=24.4.0"
uv add --dev "pytest>=8.3.3" "pytest-asyncio>=0.24.0" "httpx>=0.27.2" "ruff>=0.6.9"

echo "📂 [3/5] Setting up service modules..."
mkdir -p app/routers app/services app/middleware app/jobs tests

echo "🔍 [4/5] Running the compliance test suite (audit + de-identification)..."
uv run pytest tests/ -v

echo "🚀 [5/5] Launching the Patient Records Service..."
echo "FHIR API will be ready at: http://127.0.0.1:8000/patients/{mrn}"
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
    <div id="healthtech-project-view" className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-linear-to-b from-emerald-500/10 via-slate-900/60 to-slate-950 p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>INDUSTRY BLUEPRINT &bull; HEALTHTECH TECHNICAL IMPLEMENTATION</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Building a Patient Records Service: <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-sky-300">FHIR, De-identification & HIPAA Audit Trails</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              An end-to-end FastAPI + fhir.resources patient records service demonstrating the non-negotiables of production healthtech engineering: standards-compliant FHIR resources, Safe Harbor de-identification, append-only HIPAA audit logging, and a clinical vitals pipeline.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-72 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs font-mono text-slate-400">FHIR Version</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">R4</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">De-identification</div>
              <div className="text-lg font-bold text-amber-400 font-mono">Safe Harbor</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">Audit Coverage</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">100% PHI reads</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">Log Format</div>
              <div className="text-lg font-bold text-purple-400 font-mono">Structured JSON</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Studio */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Play className="h-5 w-5 text-emerald-400" />
              <span>Patient Records Service Build: Video &amp; Animation Studio</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive timeline walking through scaffolding, FHIR modeling, de-identification, audit middleware, and verification.
            </p>
          </div>
        </div>

        <WorkstationVideoPlayer
          projectName="Patient Records Service"
          projectBadge="FastAPI + FHIR + structlog Stack"
          scenes={HEALTHTECH_STEPS}
          activeSceneId={activeSceneId}
          onSelectScene={setActiveSceneId}
          accentColor="emerald"
        />
      </section>

      {/* Quickstart */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <span>Scaffold the Patient Records Service Locally</span>
            </h3>
            <p className="text-xs text-slate-400">
              Copy and paste this script into your terminal to scaffold, test, and launch the service.
            </p>
          </div>

          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-xs font-bold font-mono transition-colors shadow-md shadow-emerald-500/20"
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
              <FileCode2 className="h-5 w-5 text-emerald-400" />
              <span>Complete Patient Records Service Codebase Explorer</span>
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
          {HEALTHTECH_ALL_FILES.map((file, idx) => {
            const isActive = idx === selectedFileIdx;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIdx(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold shadow-xs'
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
              <span className="text-emerald-400 font-bold">Path:</span>
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
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>.NET Healthtech Stack vs. Python Healthtech Stack Matrix</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Where each ecosystem’s tooling naturally fits in a production clinical software system.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300 font-mono">
                <th className="p-3">Healthtech Concern</th>
                <th className="p-3 text-blue-400">C# / .NET Stack</th>
                <th className="p-3 text-emerald-400">Python Stack</th>
                <th className="p-3 text-slate-400">Trade-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white flex items-center gap-2"><HeartPulse className="h-3.5 w-3.5 text-emerald-400" />FHIR Resource Modeling</td>
                <td className="p-3 font-mono text-blue-300">Firely .NET SDK (Hl7.Fhir.R4)</td>
                <td className="p-3 font-mono text-emerald-300">fhir.resources (Pydantic-based)</td>
                <td className="p-3 text-slate-400">Both are schema-generated from HL7’s published StructureDefinitions; structurally near-identical integration code.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Medical Imaging / Deep Learning</td>
                <td className="p-3 font-mono text-blue-300">ONNX Runtime (inference only)</td>
                <td className="p-3 font-mono text-emerald-300">PyTorch + MONAI</td>
                <td className="p-3 text-slate-400">No real C# equivalent for training; imaging research and production training both stay in Python, with ONNX bridging to C# for inference-only serving.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Clinical Data Reshaping</td>
                <td className="p-3 font-mono text-blue-300">LINQ GroupBy + manual assembly</td>
                <td className="p-3 font-mono text-emerald-300">pandas pivot_table</td>
                <td className="p-3 text-slate-400">pandas’ declarative reshape scales more gracefully as new observation types are added, without new hardcoded fields.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Core EHR Integration Layer</td>
                <td className="p-3 font-mono text-blue-300">C# (common in enterprise hospital IT)</td>
                <td className="p-3 font-mono text-emerald-300">Python (common in health-data startups)</td>
                <td className="p-3 text-slate-400">Both integrate exclusively via FHIR/HL7 APIs — neither touches Epic’s MUMPS/Caché backend directly; the choice is organizational, not technical.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
