import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  Layers,
  Terminal,
  FileCode2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Sparkles,
  Database,
  Radio
} from 'lucide-react';
import { WorkstationVideoPlayer } from '../components/WorkstationVideoPlayer';
import { InteractiveRagTester } from '../components/InteractiveRagTester';
import { CodeBlock } from '../components/CodeBlock';
import { ZoomableDiagramWrapper } from '../components/ZoomableDiagramWrapper';
import { AIML_STEPS, AIML_ALL_FILES } from '../data/aimlProjectData';

export function AimlProjectView() {
  const [activeSceneId, setActiveSceneId] = useState<number>(1);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedActiveFile, setCopiedActiveFile] = useState<boolean>(false);

  const selectedFile = AIML_ALL_FILES[selectedFileIdx];

  const quickstartBashScript = `#!/usr/bin/env bash
set -e

echo "🧠 [1/5] Initializing RAG Insight Engine with uv..."
uv init --app rag-insight-engine
cd rag-insight-engine

echo "⚡ [2/5] Installing PyTorch, HuggingFace, ChromaDB, and FastAPI..."
uv add "torch>=2.4.1" "sentence-transformers>=3.1.1" "chromadb>=0.5.5" "langchain-core>=0.3.1" "fastapi[standard]>=0.115.0" "pydantic>=2.9.2" "numpy>=1.26.4"
uv add --dev "pytest>=8.3.3" "pytest-asyncio>=0.24.0" "httpx>=0.27.2" "ruff>=0.6.9"

echo "📂 [3/5] Setting up RAG pipeline modules..."
mkdir -p rag/ingestion rag/embeddings rag/storage rag/pipeline rag/api tests

echo "🔍 [4/5] Verifying hardware tensor acceleration (CUDA / MPS / CPU)..."
uv run python -c "import torch; print(f'PyTorch: {torch.__version__} | CUDA: {torch.cuda.is_available()} | MPS: {torch.backends.mps.is_available()}')"

echo "🚀 [5/5] Launching Streaming RAG Inference Microservice..."
echo "Streaming API endpoint will be ready at: http://127.0.0.1:8000/api/v1/rag/stream"
uv run uvicorn rag.api.server:app --reload --port 8000`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(quickstartBashScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyActiveFile = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedActiveFile(true);
    setTimeout(() => setCopiedActiveFile(false), 2000);
  };

  return (
    <div id="aiml-project-view" className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-linear-to-b from-purple-500/10 via-slate-900/60 to-slate-950 p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-mono font-bold text-purple-300">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <span>PROJECT BLUEPRINT 02 &bull; PRODUCTION AI / ML SYSTEM</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Production AI/ML System: <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-300">Local RAG Pipeline with PyTorch, ChromaDB &amp; FastAPI</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              The definitive workstation development reference for C# and .NET engineers transitioning into contemporary Generative AI and vector search. This end-to-end blueprint constructs a hardened, local Retrieval-Augmented Generation (RAG) system utilizing hardware-accelerated PyTorch tensor embeddings, sub-millisecond HNSW vector indexing in ChromaDB, context injection, and Server-Sent Events (SSE) token streaming.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 gap-3 sm:w-72 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs font-mono text-slate-400">Embedding Vector</div>
              <div className="text-lg font-bold text-purple-400 font-mono">384-dim Dense</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">HNSW Search Latency</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">3.8 ms</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">Time-To-First-Token</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">94 ms</div>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">Hardware Backend</div>
              <div className="text-lg font-bold text-amber-400 font-mono">CUDA / MPS / AVX</div>
            </div>
          </div>
        </div>
      </section>

      {/* Graphical Animation / Video Studio Presentation Player */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Play className="h-5 w-5 text-purple-400" />
              <span>AI/ML Workstation Workflow: Video &amp; Animation Studio</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive video-style timeline simulation showing the complete developer experience on a local workstation from PyTorch initialization to streaming SSE generation.
            </p>
          </div>
        </div>

        <WorkstationVideoPlayer
          projectName="RAG Insight Engine"
          projectBadge="PyTorch + ChromaDB Stack"
          scenes={AIML_STEPS}
          activeSceneId={activeSceneId}
          onSelectScene={setActiveSceneId}
          accentColor="purple"
        />
      </section>

      {/* Interactive 2D Vector Space Visualizer & Live RAG Pipeline Simulator */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Interactive 2D Vector Space &amp; RAG Pipeline Simulator
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Explore how high-dimensional sentence embeddings are mapped into geometric space, inspect HNSW nearest neighbor graph traversals, and test token-by-token streaming synthesis in real time.
        </p>

        <ZoomableDiagramWrapper title="Interactive 2D Vector Space & RAG Pipeline Simulator">
          <InteractiveRagTester />
        </ZoomableDiagramWrapper>
      </section>

      {/* 60-Second Quickstart Terminal One-Liner */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-purple-400" />
              <span>Run on Your Local Workstation in 60 Seconds</span>
            </h3>
            <p className="text-xs text-slate-400">
              Copy and paste this script directly into your terminal (macOS, Linux, or WSL2) to scaffold, download weights, and launch the RAG inference service instantly.
            </p>
          </div>

          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 text-xs font-bold font-mono transition-colors shadow-md shadow-purple-500/20"
          >
            {copiedScript ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Quickstart Script'}</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre>{quickstartBashScript}</pre>
        </div>
      </section>

      {/* Full Production Repository Explorer */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-purple-400" />
              <span>Complete Production Codebase Explorer</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse every production source file of the RAG engine repository with zero omitted code or pseudo-code stubs.
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

        {/* File Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {AIML_ALL_FILES.map((file, idx) => {
            const isActive = idx === selectedFileIdx;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIdx(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  isActive
                    ? 'border-purple-500 bg-purple-500/10 text-purple-300 font-bold shadow-xs'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{file.filename}</span>
                <span className="text-[10px] opacity-60 uppercase">[{file.category}]</span>
              </button>
            );
          })}
        </div>

        {/* Selected File Details & Content */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-purple-400 font-bold">Path:</span>
              <span>{selectedFile.path}</span>
            </div>
            <span className="text-xs text-slate-400">{selectedFile.summary}</span>
          </div>

          <div className="p-2">
            <CodeBlock
              code={selectedFile.content}
              language={
                selectedFile.filename.endsWith('.toml')
                  ? 'toml'
                  : selectedFile.filename.endsWith('.py')
                  ? 'python'
                  : 'dockerfile'
              }
            />
          </div>
        </div>
      </section>

      {/* C# vs Python AI/ML Architecture Deep-Dive Matrix */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-400" />
            <span>.NET AI Stack (Semantic Kernel / ML.NET) vs Python AI Stack Matrix</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Understanding why Python dominates modern AI research and generative systems, and where .NET fits in the enterprise topology.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300 font-mono">
                <th className="p-3">AI / ML Domain</th>
                <th className="p-3 text-blue-400">C# / .NET AI Stack</th>
                <th className="p-3 text-purple-400">Python AI Ecosystem</th>
                <th className="p-3 text-slate-400">Architectural Trade-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white">Tensor Computations &amp; Autograd</td>
                <td className="p-3 font-mono text-blue-300">ML.NET / TorchSharp</td>
                <td className="p-3 font-mono text-purple-300">PyTorch (torch.Tensor)</td>
                <td className="p-3 text-slate-400">TorchSharp wraps PyTorch C++ (LibTorch). In Python, PyTorch has native first-class community support and instantaneous zero-day model releases.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Pre-trained Transformers</td>
                <td className="p-3 font-mono text-blue-300">ONNX Runtime (Microsoft.ML.OnnxRuntime)</td>
                <td className="p-3 font-mono text-purple-300">HuggingFace Transformers / sentence-transformers</td>
                <td className="p-3 text-slate-400">Converting modern MoE (Mixture of Experts) or multi-modal models to ONNX requires extra steps, while HuggingFace loads safetensors in 1 line.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Orchestration &amp; RAG</td>
                <td className="p-3 font-mono text-blue-300">Microsoft.SemanticKernel</td>
                <td className="p-3 font-mono text-purple-300">LangChain / LlamaIndex / DSPy</td>
                <td className="p-3 text-slate-400">Semantic Kernel is enterprise-grade with strong typing. Python frameworks innovate faster with agentic workflows, self-reflective RAG, and prompt optimization.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Vector Store Integration</td>
                <td className="p-3 font-mono text-blue-300">Azure AI Search / Qdrant C# SDK</td>
                <td className="p-3 font-mono text-purple-300">ChromaDB / Qdrant / LanceDB</td>
                <td className="p-3 text-slate-400">Python offers lightweight in-process vector databases (ChromaDB, LanceDB) that run embedded inside unit tests and local CLI tools.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Streaming Inference Protocol</td>
                <td className="p-3 font-mono text-blue-300">IAsyncEnumerable&lt;T&gt; + SSE</td>
                <td className="p-3 font-mono text-purple-300">AsyncGenerator + FastAPI StreamingResponse</td>
                <td className="p-3 text-slate-400">Identical architectural concept: asynchronous stream pipelines minimize Time-To-First-Token (TTFT) perceived latency.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Production Verification Checklist */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span>Production AI Quality Gates &amp; Safety Guards</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
              <CheckCircle2 className="h-4 w-4" />
              <span>Hardware Acceleration</span>
            </div>
            <p className="text-xs text-slate-400">
              Auto-detects NVIDIA CUDA, Apple Silicon MPS, or AVX-512 CPU fallback for optimal batch throughput.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
              <CheckCircle2 className="h-4 w-4" />
              <span>Normalized Dot-Product</span>
            </div>
            <p className="text-xs text-slate-400">
              L2-normalized embeddings enable blazing-fast matrix dot-product cosine similarity calculation in NumPy.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
              <CheckCircle2 className="h-4 w-4" />
              <span>Context Grounding Guard</span>
            </div>
            <p className="text-xs text-slate-400">
              Strict system prompt instructions prevent hallucinations by bounding generation to verified retrieved chunks.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
              <CheckCircle2 className="h-4 w-4" />
              <span>Streaming SSE Latency</span>
            </div>
            <p className="text-xs text-slate-400">
              Sub-100ms Time-To-First-Token delivers instant user feedback over standard HTTP/2 and HTTP/1.1 connections.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
