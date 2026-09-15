export interface AimlProjectStep {
  id: number;
  title: string;
  duration: string;
  sceneTitle: string;
  sdlcStage?: string;
  sdlcPhaseName?: string;
  description: string;
  csharpParallel: {
    concept: string;
    dotnetEquivalent: string;
    keyDifference: string;
  };
  terminalCommands: {
    cmd: string;
    output: string[];
    delayMs?: number;
  }[];
  activeFile: string;
  fileContent: string;
  language: string;
  keyTakeaways: string[];
  proTip: string;
}

export interface AimlProjectFile {
  filename: string;
  path: string;
  category: 'config' | 'pipeline' | 'vector' | 'api' | 'docker';
  content: string;
  summary: string;
}

export { AIML_STEPS } from './aimlSdlcSteps';

export const AIML_ALL_FILES: AimlProjectFile[] = [
  {
    filename: '.vscode/settings.json',
    path: '.vscode/settings.json',
    category: 'config',
    summary: 'Workstation IDE settings for Python 3.12 AI development with Pyright and Ruff.',
    content: `{
  "python.defaultInterpreterPath": "\${workspaceFolder}/.venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true
  },
  "python.analysis.typeCheckingMode": "basic"
}`
  },
  {
    filename: 'pyproject.toml',
    path: 'pyproject.toml',
    category: 'config',
    summary: 'Project configuration specifying PyTorch, Sentence-Transformers, ChromaDB, and FastAPI.',
    content: `[project]
name = "rag-insight-engine"
version = "0.1.0"
description = "Production Retrieval-Augmented Generation (RAG) Microservice"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "torch>=2.4.1",
    "sentence-transformers>=3.1.1",
    "chromadb>=0.5.5",
    "fastapi[standard]>=0.115.0",
    "pydantic>=2.9.2",
    "numpy>=1.26.4",
]

[dependency-groups]
dev = [
    "pytest>=8.3.3",
    "pytest-asyncio>=0.24.0",
    "httpx>=0.27.2",
    "ruff>=0.6.9",
]

[tool.ruff]
line-length = 100
target-version = "py312"`
  },
  {
    filename: 'chunker.py',
    path: 'rag/ingestion/chunker.py',
    category: 'pipeline',
    summary: 'Recursive semantic text splitter preserving paragraph, sentence, and word boundaries.',
    content: `from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class DocumentChunk:
    chunk_id: str
    doc_id: str
    text: str
    metadata: dict[str, str | int]

class SemanticTextSplitter:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50) -> None:
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\\n\\n", "\\n", ". ", " ", ""]

    def split_text(self, text: str, doc_id: str) -> list[DocumentChunk]:
        chunks: list[DocumentChunk] = []
        raw_splits = self._recursive_split(text, self.separators)
        
        current_chunk: list[str] = []
        current_len = 0
        chunk_idx = 0

        for piece in raw_splits:
            piece_len = len(piece)
            if current_len + piece_len > self.chunk_size and current_chunk:
                combined = "".join(current_chunk).strip()
                if combined:
                    chunks.append(DocumentChunk(
                        chunk_id=f"{doc_id}_chunk_{chunk_idx}",
                        doc_id=doc_id,
                        text=combined,
                        metadata={"chunk_index": chunk_idx, "char_count": len(combined)}
                    ))
                    chunk_idx += 1
                current_chunk = []
                current_len = 0

            current_chunk.append(piece)
            current_len += piece_len

        if current_chunk:
            combined = "".join(current_chunk).strip()
            if combined:
                chunks.append(DocumentChunk(
                    chunk_id=f"{doc_id}_chunk_{chunk_idx}",
                    doc_id=doc_id,
                    text=combined,
                    metadata={"chunk_index": chunk_idx, "char_count": len(combined)}
                ))

        return chunks

    def _recursive_split(self, text: str, separators: list[str]) -> list[str]:
        if not separators:
            return list(text)
        sep = separators[0]
        splits = text.split(sep)
        result: list[str] = []
        for i, piece in enumerate(splits):
            if i > 0:
                result.append(sep)
            result.append(piece)
        return [r for r in result if r]`
  },
  {
    filename: 'embedder.py',
    path: 'rag/embeddings/embedder.py',
    category: 'vector',
    summary: 'PyTorch + SentenceTransformers embedding engine with dynamic CUDA/MPS tensor acceleration.',
    content: `import torch
from sentence_transformers import SentenceTransformer

class VectorEmbeddingEngine:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2") -> None:
        if torch.cuda.is_available():
            self.device = torch.device("cuda")
        elif torch.backends.mps.is_available():
            self.device = torch.device("mps")
        else:
            self.device = torch.device("cpu")

        self.model = SentenceTransformer(model_name, device=str(self.device))
        self.dimension = self.model.get_sentence_embedding_dimension()

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        embeddings = self.model.encode(
            texts,
            batch_size=32,
            show_progress_bar=False,
            normalize_embeddings=True,
            convert_to_tensor=True
        )
        return embeddings.cpu().tolist()

    def embed_query(self, query: str) -> list[float]:
        embedding = self.model.encode(
            query,
            normalize_embeddings=True,
            convert_to_tensor=True
        )
        return embedding.cpu().tolist()`
  },
  {
    filename: 'chroma_store.py',
    path: 'rag/storage/chroma_store.py',
    category: 'vector',
    summary: 'ChromaDB persistent vector store with HNSW index configuration and metadata filtering.',
    content: `import chromadb
from chromadb.config import Settings
from rag.embeddings.embedder import VectorEmbeddingEngine
from rag.ingestion.chunker import DocumentChunk

class VectorStore:
    def __init__(self, persist_directory: str = "./.chroma_db") -> None:
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        self.embedder = VectorEmbeddingEngine()
        self.collection = self.client.get_or_create_collection(
            name="pycsharp_docs",
            metadata={"hnsw:space": "cosine"}
        )

    def add_chunks(self, chunks: list[DocumentChunk]) -> None:
        texts = [c.text for c in chunks]
        embeddings = self.embedder.embed_texts(texts)
        ids = [c.chunk_id for c in chunks]
        metadatas = [c.metadata for c in chunks]

        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas
        )

    def search_similar(self, query: str, top_k: int = 3) -> list[dict[str, str | float]]:
        query_vector = self.embedder.embed_query(query)
        results = self.collection.query(
            query_embeddings=[query_vector],
            n_results=top_k
        )
        matches = []
        if results["documents"] and results["distances"]:
            docs = results["documents"][0]
            dists = results["distances"][0]
            for doc, dist in zip(docs, dists, strict=False):
                matches.append({
                    "text": doc,
                    "similarity_score": round(1.0 - dist, 4)
                })
        return matches`
  },
  {
    filename: 'rag_engine.py',
    path: 'rag/pipeline/rag_engine.py',
    category: 'pipeline',
    summary: 'Context assembly and async token streaming pipeline with simulated LLM generation.',
    content: `import asyncio
from collections.abc import AsyncGenerator
from rag.storage.chroma_store import VectorStore

class RagPipeline:
    def __init__(self, vector_store: VectorStore | None = None) -> None:
        self.store = vector_store or VectorStore()

    async def generate_stream(self, question: str) -> AsyncGenerator[str, None]:
        matches = self.store.search_similar(question, top_k=3)
        context = "\\n\\n".join(f"[Source {i+1}]: {m['text']}" for i, m in enumerate(matches))
        
        response = (
            f"Based on the technical context retrieved from the vector store: "
            f"C# executes through RyuJIT compilation to native code with preemptive multi-threading, "
            f"while CPython evaluates bytecode sequentially via PyEval_EvalFrameDefault with the GIL. "
            f"For I/O-bound microservices, Python's AsyncIO provides high throughput with minimal boilerplate."
        )
        for word in response.split(" "):
            yield f"{word} "
            await asyncio.sleep(0.03)`
  },
  {
    filename: 'server.py',
    path: 'rag/api/server.py',
    category: 'api',
    summary: 'FastAPI ASGI microservice exposing SSE streaming inference endpoint and health probes.',
    content: `import json
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from rag.pipeline.rag_engine import RagPipeline
from rag.storage.chroma_store import VectorStore

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500)

pipeline: RagPipeline | None = None
store: VectorStore | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline, store
    store = VectorStore()
    pipeline = RagPipeline(vector_store=store)
    yield

app = FastAPI(title="RAG Insight Engine", version="0.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health/live")
async def liveness():
    return {"status": "alive"}

@app.get("/health/ready")
async def readiness():
    if not store or not pipeline:
        raise HTTPException(status_code=503, detail="Not ready")
    return {"status": "ready", "collection_items": store.collection.count()}

@app.post("/api/v1/rag/stream")
async def stream_rag(payload: QueryRequest):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Engine not ready")

    async def event_generator() -> AsyncGenerator[str, None]:
        async for token in pipeline.generate_stream(payload.query):
            yield f"data: {json.dumps({'token': token})}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")`
  },
  {
    filename: '.github/workflows/ai-ci.yml',
    path: '.github/workflows/ai-ci.yml',
    category: 'config',
    summary: 'CI/CD pipeline with GitHub Actions executing model validation, Ruff, and Pytest.',
    content: `name: AI/ML Engineering CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  validate-ai-pipeline:
    name: Model Validation, Lint & Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v3
        with:
          version: "latest"
          enable-cache: true
      - run: uv python install 3.12
      - run: uv sync --frozen
      - run: uv run ruff check .
      - run: uv run pytest tests/ -v`
  },
  {
    filename: 'Dockerfile',
    path: 'Dockerfile',
    category: 'docker',
    summary: 'Multi-stage Dockerfile for AI serving with uv and PyTorch acceleration.',
    content: `FROM ghcr.io/astral-sh/uv:0.4-python3.12-bookworm-slim AS builder
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

FROM python:3.12-slim-bookworm AS runner
WORKDIR /app
RUN groupadd -r appgroup && useradd -r -g appgroup -s /bin/false appuser
COPY --from=builder --chown=appuser:appgroup /app/.venv /app/.venv
COPY --chown=appuser:appgroup ./rag /app/rag
ENV PATH="/app/.venv/bin:$PATH"
USER appuser
EXPOSE 8000
CMD ["uvicorn", "rag.api.server:app", "--host", "0.0.0.0", "--port", "8000"]`
  }
];
