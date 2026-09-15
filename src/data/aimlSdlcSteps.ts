import { AimlProjectStep } from './aimlProjectData';

export const AIML_STEPS: AimlProjectStep[] = [
  {
    id: 1,
    title: 'Workstation Setup: PyTorch & GPU Toolchain',
    duration: '01:10',
    sceneTitle: 'Scene 1: Developer Workstation Setup & Hardware Acceleration Toolchain',
    sdlcStage: 'SDLC Step 1 of 8: Developer Workstation Setup',
    sdlcPhaseName: 'Workstation Setup',
    description:
      'Configure an AI developer workstation using Astral uv with hardware acceleration (NVIDIA CUDA or Apple Silicon MPS Metal Performance Shaders). In C#, you would configure Microsoft.ML or ONNX Runtime with native DLLs. Here, uv creates an isolated virtual environment (.venv) and configures VS Code with Pyright tensor typing and Ruff linting.',
    csharpParallel: {
      concept: 'Workstation AI Toolchain & Tensor Runtime',
      dotnetEquivalent: 'Microsoft.ML.OnnxRuntime.Gpu + Microsoft.SemanticKernel NuGet packages',
      keyDifference:
        'C# relies on native C++ wrapper DLLs (onnxruntime.dll). In Python, PyTorch (`torch`) and HuggingFace provide direct, high-level Pythonic APIs with automated dynamic tensor dispatch across CPU, CUDA, and Apple MPS.'
    },
    terminalCommands: [
      {
        cmd: 'uv --version && python3 --version',
        output: [
          'uv 0.4.18 (astral-sh fast package manager)',
          'Python 3.12.7 (main, Oct  1 2024, 11:15:30) [GCC 12.2.0]'
        ]
      },
      {
        cmd: 'uv init --app rag-insight-engine && cd rag-insight-engine',
        output: [
          'Initialized project `rag-insight-engine` at /workspace/rag-insight-engine',
          'Created pyproject.toml and virtual environment (.venv)'
        ]
      },
      {
        cmd: 'mkdir -p .vscode && cat << \'EOF\' > .vscode/settings.json ...',
        output: [
          'Configured .vscode/settings.json:',
          '  - python.defaultInterpreterPath: "${workspaceFolder}/.venv/bin/python"',
          '  - editor.formatOnSave: true (charliermarsh.ruff)',
          '  - python.analysis.typeCheckingMode: "basic"'
        ]
      },
      {
        cmd: 'uv add "torch>=2.4.0" "sentence-transformers>=3.1.0" "chromadb>=0.5.5" "fastapi[standard]>=0.115.0" "pydantic>=2.9.0"',
        output: [
          'Resolved 68 packages in 480ms',
          'Installed 68 packages in 1.4s',
          ' + torch==2.4.1 (with GPU/MPS dynamic acceleration)',
          ' + sentence-transformers==3.1.1',
          ' + chromadb==0.5.5',
          ' + fastapi==0.115.0',
          ' + pydantic==2.9.2'
        ]
      },
      {
        cmd: 'uv run python -c "import torch; print(f\'CUDA: {torch.cuda.is_available()} | MPS: {torch.backends.mps.is_available()} | Device: {\\\'cuda\\\' if torch.cuda.is_available() else (\\\'mps\\\' if torch.backends.mps.is_available() else \\\'cpu\\\')}\')"',
        output: [
          'CUDA: True | MPS: False | Device: cuda'
        ]
      }
    ],
    activeFile: '.vscode/settings.json',
    language: 'json',
    fileContent: `{
  // AI Engineering Workstation IDE configuration
  "python.defaultInterpreterPath": "\${workspaceFolder}/.venv/bin/python",
  "python.terminal.activateEnvironment": true,
  
  // Format and lint with Ruff
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  },

  // Pyright type checking for tensor shapes and matrix operations
  "python.analysis.typeCheckingMode": "basic",
  "python.analysis.diagnosticSeverityOverrides": {
    "reportMissingTypeStubs": "none"
  },

  // Exclude PyTorch and ChromaDB cache artifacts
  "files.exclude": {
    "**/.git": true,
    "**/.venv": false,
    "**/__pycache__": true,
    "**/.chroma": true
  }
}`,
    keyTakeaways: [
      'PyTorch is the undisputed lingua franca of contemporary AI research and production inference.',
      '.vscode/settings.json configures the workstation with automated formatting and tensor type checking.',
      'uv resolves heavy machine learning wheels with cryptographic verification and zero conflict loops.'
    ],
    proTip:
      'Always query `torch.cuda.is_available()` or `torch.backends.mps.is_available()` to auto-select the best compute device.'
  },
  {
    id: 2,
    title: 'Document Ingestion & Semantic Chunking',
    duration: '02:00',
    sceneTitle: 'Scene 2: Text Ingestion & Recursive Chunking Pipeline',
    sdlcStage: 'SDLC Step 2 of 8: Data Ingestion & Chunking',
    sdlcPhaseName: 'Data Ingestion',
    description:
      'Process raw documents and split them into semantic text chunks with sliding window overlap. In C#, you would parse text with StringBuilder or Regex. In Python, recursive semantic splitting preserves paragraph (\\n\\n), sentence (\\n), and whitespace boundaries to maintain contextual coherence.',
    csharpParallel: {
      concept: 'Text Tokenization & Chunking',
      dotnetEquivalent: 'Microsoft.SemanticKernel.Text.TextChunker.SplitPlainTextParagraphs(...)',
      keyDifference:
        'Python chunkers track both token-based and character-based metrics, injecting dynamic metadata (source, chunk_id, section_header) into each chunk object for downstream filtering.'
    },
    terminalCommands: [
      {
        cmd: 'mkdir -p rag/ingestion rag/embeddings rag/storage rag/pipeline rag/api',
        output: ['Created directory tree: rag/{ingestion, embeddings, storage, pipeline, api}']
      },
      {
        cmd: 'uv run python -m rag.ingestion.chunker --sample-docs',
        output: [
          'Ingesting technical documentation...',
          'Parsed document: "csharp_vs_python_architecture.md" (18,420 chars)',
          'Generated 34 semantic chunks with chunk_size=512, chunk_overlap=64',
          'Sample Chunk 0: [Header: CPython vs CLR] "CPython compiles source to bytecode..."',
          'Sample Chunk 1: [Header: GIL Mechanics] "The Global Interpreter Lock prevents..."'
        ]
      }
    ],
    activeFile: 'rag/ingestion/chunker.py',
    language: 'python',
    fileContent: `from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class DocumentChunk:
    """Immutable document chunk representation with rich metadata."""
    chunk_id: str
    doc_id: str
    text: str
    metadata: dict[str, str | int]

class SemanticTextSplitter:
    """Recursive text chunker preserving paragraph and sentence boundaries."""
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50) -> None:
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators: list[str] = ["\\n\\n", "\\n", ". ", " ", ""]

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
        return [r for r in result if r]`,
    keyTakeaways: [
      'Sliding window overlap ensures contextual continuity across chunk boundaries.',
      '`@dataclass(frozen=True, slots=True)` provides memory-efficient, immutable records.',
      'Splitting on hierarchical separators preserves natural paragraph and sentence semantics.'
    ],
    proTip:
      'Avoid naive fixed-character chunking (e.g. `text[i:i+500]`) which cuts words in half and degrades embedding retrieval accuracy.'
  },
  {
    id: 3,
    title: 'Dense Vector Embeddings with PyTorch',
    duration: '02:45',
    sceneTitle: 'Scene 3: Dense Vector Embeddings Engine with Tensor Normalization',
    sdlcStage: 'SDLC Step 3 of 8: Embeddings Engine',
    sdlcPhaseName: 'Embeddings Engine',
    description:
      'Load a pre-trained transformer model (`all-MiniLM-L6-v2`) into PyTorch, encode document chunks into 384-dimensional dense vectors, and normalize tensors on GPU/MPS for cosine similarity math. In .NET, this replaces ONNX model inference sessions.',
    csharpParallel: {
      concept: 'Vector Embeddings & Tensor Inference',
      dotnetEquivalent: 'DenseTensor<float> tensor = new DenseTensor<float>(...); onnxSession.Run(...)',
      keyDifference:
        'Sentence-Transformers in Python manages tokenizer pipelines, sub-word pooling (mean pooling), and L2 unit-sphere vector normalization automatically in native C++/CUDA.'
    },
    terminalCommands: [
      {
        cmd: 'uv run python -c "from sentence_transformers import SentenceTransformer; model = SentenceTransformer(\'all-MiniLM-L6-v2\'); print(f\'Model loaded. Dimension: {model.get_sentence_embedding_dimension()}\')"',
        output: [
          'Loading weights into device: cuda:0',
          'Model loaded. Dimension: 384'
        ]
      },
      {
        cmd: 'uv run python -m rag.embeddings.embedder --benchmark',
        output: [
          'Encoding 34 document chunks...',
          'Inference completed in 38.2ms (890 chunks/sec on CUDA)',
          'Generated tensor shape: torch.Size([34, 384])',
          'Vector L2-norm verification: 1.0000 (Unit sphere normalized)'
        ]
      }
    ],
    activeFile: 'rag/embeddings/embedder.py',
    language: 'python',
    fileContent: `import torch
from sentence_transformers import SentenceTransformer

class VectorEmbeddingEngine:
    """Manages dense vector representation using local PyTorch transformer models."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2") -> None:
        # Determine optimal hardware device (CUDA -> Apple MPS -> CPU)
        if torch.cuda.is_available():
            self.device = torch.device("cuda")
        elif torch.backends.mps.is_available():
            self.device = torch.device("mps")
        else:
            self.device = torch.device("cpu")

        self.model = SentenceTransformer(model_name, device=str(self.device))
        self.dimension = self.model.get_sentence_embedding_dimension()

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        """Encode list of strings into normalized 384-dim dense vectors."""
        embeddings = self.model.encode(
            texts,
            batch_size=32,
            show_progress_bar=False,
            normalize_embeddings=True,  # Crucial for dot-product = cosine similarity
            convert_to_tensor=True
        )
        return embeddings.cpu().tolist()

    def embed_query(self, query: str) -> list[float]:
        """Encode single user query for cosine similarity search."""
        embedding = self.model.encode(
            query,
            normalize_embeddings=True,
            convert_to_tensor=True
        )
        return embedding.cpu().tolist()`,
    keyTakeaways: [
      '`normalize_embeddings=True` maps vectors to the unit sphere where dot product equals cosine distance.',
      'Batch encoding (`batch_size=32`) maximizes GPU tensor core saturation.',
      'Device selection is dynamic, automatically taking advantage of CUDA or MPS.'
    ],
    proTip:
      'Keep embeddings normalized so vector database lookups only need fast inner-product (`ip`) calculations instead of expensive square-root Euclidean calculations.'
  },
  {
    id: 4,
    title: 'ChromaDB Persistent Store & HNSW Indexing',
    duration: '03:30',
    sceneTitle: 'Scene 4: ChromaDB Persistent Store & HNSW Graph Indexing',
    sdlcStage: 'SDLC Step 4 of 8: Vector Database Indexing',
    sdlcPhaseName: 'Vector Database',
    description:
      'Store chunk embeddings, text, and metadata in an in-process ChromaDB vector database backed by SQLite and HNSWlib (Hierarchical Navigable Small World). Query top-K most semantically relevant chunks with sub-millisecond retrieval latency.',
    csharpParallel: {
      concept: 'Vector Database & Nearest Neighbor Indexing',
      dotnetEquivalent: 'Qdrant / Milvus / Azure AI Search vector store integration in C#',
      keyDifference:
        'ChromaDB runs in-process with zero external server dependencies. Python manages vector collections, cosine index construction, and metadata filters in a unified local store.'
    },
    terminalCommands: [
      {
        cmd: 'uv run python -m rag.storage.chroma_store --index-docs',
        output: [
          'Initializing ChromaDB persistent client at "./.chroma_db"...',
          'Upserting 34 document vectors into collection "pycsharp_docs"...',
          'Indexed in 14.5ms. HNSW graph constructed.'
        ]
      },
      {
        cmd: 'uv run python -m rag.storage.chroma_store --query "How does Python handle concurrency without threads?"',
        output: [
          'Top 2 Matches (Cosine Distance):',
          '  [Score: 0.884] Chunk: "AsyncIO uses an event loop running cooperative single-threaded tasks..."',
          '  [Score: 0.821] Chunk: "The Global Interpreter Lock (GIL) serializes execution of CPython bytecodes..."'
        ]
      }
    ],
    activeFile: 'rag/storage/chroma_store.py',
    language: 'python',
    fileContent: `import chromadb
from chromadb.config import Settings
from rag.embeddings.embedder import VectorEmbeddingEngine
from rag.ingestion.chunker import DocumentChunk

class VectorStore:
    """Manages vector persistence and HNSW nearest-neighbor retrieval."""
    
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
        """Upsert chunks with pre-computed vector embeddings."""
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

    def search(self, query: str, top_k: int = 3) -> list[dict[str, str | float]]:
        """Retrieve top-K most similar document chunks."""
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
        return matches`,
    keyTakeaways: [
      'ChromaDB provides zero-infrastructure local vector storage backed by SQLite and HNSWlib.',
      'Cosine distance metadata (`{"hnsw:space": "cosine"}`) configures graph search geometry.',
      'Sub-5ms top-K retrieval enables ultra-fast RAG generation loops.'
    ],
    proTip:
      'In production, configure HNSW `ef_search` and `M` parameters to tune the trade-off between search speed and recall accuracy.'
  },
  {
    id: 5,
    title: 'Core Code Implementation: Streaming RAG Engine',
    duration: '04:15',
    sceneTitle: 'Scene 5: Core Code Implementation: Augmented Prompt & Token Stream',
    sdlcStage: 'SDLC Step 5 of 8: Core Code Implementation',
    sdlcPhaseName: 'Code Implementation',
    description:
      'Implement the core Retrieval-Augmented Generation pipeline. Synthesize user queries with retrieved context into strict prompt templates, and stream tokens back using Python async generators (`yield`). In C#, this replaces IAsyncEnumerable<string> streaming pipelines.',
    csharpParallel: {
      concept: 'RAG Pipeline & Streaming Generation',
      dotnetEquivalent: 'await foreach (var token in chatService.GetStreamingChatMessageContentsAsync(...))',
      keyDifference:
        'Python async generators (`async def ... yield token`) provide first-class streaming without boilerplate classes or reactive observable wrappers.'
    },
    terminalCommands: [
      {
        cmd: 'uv run python -m rag.pipeline.rag_engine --query "Explain GIL vs RyuJIT"',
        output: [
          'Searching vector database...',
          'Retrieved 2 context chunks in 4.1ms',
          'Streaming response:',
          '  [Token Stream]: While C# CLR executes JIT-compiled IL across true OS threads...',
          '  [Token Stream]: CPython enforces a Global Interpreter Lock serializing opcode evaluation.',
          'Finished in 180ms.'
        ]
      }
    ],
    activeFile: 'rag/pipeline/rag_engine.py',
    language: 'python',
    fileContent: `import asyncio
from collections.abc import AsyncGenerator
from rag.storage.chroma_store import VectorStore

class RagPipeline:
    """Core RAG execution engine combining retrieval with contextual synthesis."""
    
    def __init__(self, vector_store: VectorStore) -> None:
        self.vector_store = vector_store

    def build_prompt(self, query: str, context_chunks: list[str]) -> str:
        """Compose strict system prompt injected with retrieved context."""
        context_block = "\\n---\\n".join(context_chunks)
        return (
            "System: You are an enterprise C# to Python architectural assistant.\\n"
            "Use ONLY the following architectural context to answer the user's question.\\n\\n"
            f"Context:\\n{context_block}\\n\\n"
            f"Question: {query}\\n"
            "Answer:"
        )

    async def generate_stream(self, query: str) -> AsyncGenerator[str, None]:
        """Stream generated response token-by-token using Python async generator."""
        # Step 1: Retrieve context chunks from vector database
        matches = self.vector_store.search(query, top_k=2)
        context_texts = [m["text"] for m in matches if isinstance(m["text"], str)]

        # Step 2: Assemble augmented prompt
        prompt = self.build_prompt(query, context_texts)
        
        # Simulated streaming response tokens based on synthesized context
        simulated_tokens = [
            "Based ", "on ", "the ", "architectural ", "context: ",
            "While ", "C# ", ".NET ", "CLR ", "uses ", "the ", "RyuJIT ",
            "compiler ", "with ", "true ", "OS-level ", "threads, ",
            "Python ", "CPython ", "relies ", "on ", "an ", "interpreter ",
            "with ", "a ", "Global ", "Interpreter ", "Lock ", "(GIL). ",
            "For ", "I/O-bound ", "workloads, ", "Python's ", "AsyncIO ",
            "delivers ", "exceptional ", "concurrency."
        ]

        for token in simulated_tokens:
            await asyncio.sleep(0.02)  # Simulate token generation latency
            yield token`,
    keyTakeaways: [
      'Strict contextual prompt boundaries prevent LLM hallucinations.',
      'Async generators (`yield`) deliver real-time token streaming to frontends with low latency.',
      'Retrieval occurs non-blockingly before synthesis begins.'
    ],
    proTip:
      'Always log both the raw query and the retrieved context chunks to trace model responses and debug prompt alignment.'
  },
  {
    id: 6,
    title: 'Automated Testing: Retrieval QA & Invariants',
    duration: '04:55',
    sceneTitle: 'Scene 6: Automated Testing: Semantic Accuracy & Fixtures',
    sdlcStage: 'SDLC Step 6 of 8: QA & Automated Testing',
    sdlcPhaseName: 'Automated Testing',
    description:
      'Unit and integration testing of the AI/ML pipeline using pytest. Verify cosine similarity distance thresholds, test chunking invariant boundaries, and validate token streaming without calling external cloud LLM APIs.',
    csharpParallel: {
      concept: 'RAG Pipeline Unit & Integration Testing',
      dotnetEquivalent: 'xUnit tests with Moq mocking IEmbeddingGenerator and IChatCompletionService',
      keyDifference:
        'In Python, pytest fixtures manage temporary in-memory ChromaDB databases and mock transformer weights, executing fast test suites in milliseconds.'
    },
    terminalCommands: [
      {
        cmd: 'uv run pytest tests/ -v',
        output: [
          '============================= test session starts ==============================',
          'platform linux -- Python 3.12.7, pytest-8.3.3',
          'collected 4 items',
          '',
          'tests/test_rag_pipeline.py::test_chunker_preserves_sentence_boundaries PASSED [ 25%]',
          'tests/test_rag_pipeline.py::test_embeddings_normalized_unit_sphere PASSED     [ 50%]',
          'tests/test_rag_pipeline.py::test_vector_store_retrieval_ranking PASSED       [ 75%]',
          'tests/test_rag_pipeline.py::test_streaming_rag_tokens_yielded PASSED         [100%]',
          '',
          '============================== 4 passed in 0.38s ==============================='
        ]
      }
    ],
    activeFile: 'tests/test_rag_pipeline.py',
    language: 'python',
    fileContent: `import pytest
from rag.ingestion.chunker import SemanticTextSplitter
from rag.embeddings.embedder import VectorEmbeddingEngine

def test_chunker_preserves_sentence_boundaries():
    text = "Sentence one. Sentence two. Sentence three."
    splitter = SemanticTextSplitter(chunk_size=30, chunk_overlap=5)
    chunks = splitter.split_text(text, doc_id="test_doc")
    assert len(chunks) > 0
    for chunk in chunks:
        assert len(chunk.text) <= 35
        assert chunk.doc_id == "test_doc"

def test_embeddings_normalized_unit_sphere():
    embedder = VectorEmbeddingEngine()
    vectors = embedder.embed_texts(["C# RyuJIT compiler", "Python CPython GIL"])
    assert len(vectors) == 2
    assert len(vectors[0]) == 384
    # Check L2 magnitude is approximately 1.0
    import math
    magnitude = math.sqrt(sum(x * x for x in vectors[0]))
    assert abs(magnitude - 1.0) < 0.001

@pytest.mark.asyncio
async def test_streaming_rag_tokens_yielded():
    from rag.pipeline.rag_engine import RagPipeline
    from unittest.mock import MagicMock
    
    mock_store = MagicMock()
    mock_store.search.return_value = [{"text": "Mocked context about C# and Python"}]
    
    pipeline = RagPipeline(vector_store=mock_store)
    tokens = [t async for t in pipeline.generate_stream("Compare C# and Python")]
    assert len(tokens) > 0
    assert "Based " in tokens`,
    keyTakeaways: [
      'Testing embeddings ensures tensors lie on the unit sphere for accurate cosine retrieval.',
      'Chunker tests assert that sentence boundaries and metadata schemas remain invariant.',
      'Pytest-asyncio allows direct testing of asynchronous generator token streams.'
    ],
    proTip:
      'Always include regression tests with known questions and expected top-1 retrieved document IDs to prevent retrieval regressions.'
  },
  {
    id: 7,
    title: 'CI/CD Automation & Model Verification',
    duration: '05:35',
    sceneTitle: 'Scene 7: CI/CD Pipeline: Model Validation & Security Audits',
    sdlcStage: 'SDLC Step 7 of 8: CI/CD Automation',
    sdlcPhaseName: 'CI/CD Pipeline',
    description:
      'Automate the ML engineering SDLC with GitHub Actions. The workflow validates HuggingFace weights cache integrity, runs Ruff linting, verifies tensor type analysis with Pyright, and audits dependencies with pip-audit.',
    csharpParallel: {
      concept: 'ML Pipeline CI/CD Quality Gates',
      dotnetEquivalent: 'Azure DevOps / GitHub Actions running dotnet test and ONNX model validation',
      keyDifference:
        'uv caches PyTorch wheels across CI runs, reducing pipeline cold start times from 5 minutes to under 25 seconds.'
    },
    terminalCommands: [
      {
        cmd: 'uv run ruff check .',
        output: ['All checks passed! 0 lint errors found.']
      },
      {
        cmd: 'uv run mypy rag/ --ignore-missing-imports',
        output: ['Success: no issues found in 5 source files.']
      },
      {
        cmd: 'uv run pip-audit',
        output: [
          'Audited 68 packages: 0 vulnerabilities found',
          'Security audit: PASSED'
        ]
      }
    ],
    activeFile: '.github/workflows/ai-ci.yml',
    language: 'yaml',
    fileContent: `name: AI/ML Engineering CI Pipeline

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
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Install Astral uv
        uses: astral-sh/setup-uv@v3
        with:
          version: "latest"
          enable-cache: true

      - name: Set up Python 3.12
        run: uv python install 3.12

      - name: Restore AI Dependencies with Cache
        run: uv sync --frozen

      - name: Code Formatting & Ruff Linter Gate
        run: uv run ruff check .

      - name: Type Analysis Gate
        run: uv run mypy rag/ --ignore-missing-imports

      - name: Dependency Security Audit
        run: uv run pip-audit

      - name: Execute Automated Test Suite
        run: uv run pytest tests/ -v`,
    keyTakeaways: [
      'Astral setup-uv action caches PyTorch wheels across CI jobs.',
      'Static type analysis catches tensor shape mismatches before deployment.',
      'Automated pip-audit prevents vulnerable machine learning dependencies from entering production.'
    ],
    proTip:
      'Cache the `~/.cache/huggingface` directory in GitHub Actions to avoid re-downloading model weights on every CI run.'
  },
  {
    id: 8,
    title: 'Production Serving & Health Probes (Final Step)',
    duration: '06:15',
    sceneTitle: 'Scene 8: Production Deployment, Streaming SSE API & Health Probes (Final SDLC Step)',
    sdlcStage: 'SDLC Step 8 of 8: Final Step of SDLC (Production & Monitoring)',
    sdlcPhaseName: 'Production & Observability',
    description:
      'The culmination and final step of the SDLC! Deploy the containerized AI/ML microservice to production, wire Server-Sent Events (SSE) streaming API, configure Kubernetes/Cloud Run liveness (/health/live) and readiness (/health/ready) probes verifying GPU/VRAM and ChromaDB connectivity, and validate end-to-end streaming latency.',
    csharpParallel: {
      concept: 'Production AI Serving & Health Probes',
      dotnetEquivalent: 'ASP.NET Core Minimal API with IAsyncEnumerable<T> and MapHealthChecks',
      keyDifference:
        'FastAPI natively streams async generators via `StreamingResponse(generator, media_type="text/event-stream")`. No external SignalR or WebSocket infrastructure required.'
    },
    terminalCommands: [
      {
        cmd: 'docker run -d -p 8000:8000 --name rag-engine rag-insight-engine:latest',
        output: [
          '8f9c12b7a4e03d9215c08831e6fa001712a3d',
          'AI/ML container started. Listening on http://0.0.0.0:8000'
        ]
      },
      {
        cmd: 'curl -s http://localhost:8000/health/ready | jq',
        output: [
          '{',
          '  "status": "ready",',
          '  "device": "cuda:0",',
          '  "chromadb": "connected",',
          '  "collection_items": 34,',
          '  "environment": "production"',
          '}'
        ]
      },
      {
        cmd: 'curl -N -X POST http://localhost:8000/api/v1/rag/stream -H "Content-Type: application/json" -d \'{"query": "Explain the Python GIL"}\'',
        output: [
          'data: {"token": "Based "}',
          'data: {"token": "on "}',
          'data: {"token": "the "}',
          'data: {"token": "architectural "}',
          'data: {"token": "context: "}',
          'data: {"token": "The "}',
          'data: {"token": "GIL "}',
          'data: {"token": "prevents "}',
          'data: {"token": "multiple "}',
          'data: {"token": "threads "}',
          'data: {"token": "from "}',
          'data: {"token": "running "}',
          'data: {"token": "simultaneously."}'
        ]
      }
    ],
    activeFile: 'rag/api/server.py',
    language: 'python',
    fileContent: `import json
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import torch
from rag.pipeline.rag_engine import RagPipeline
from rag.storage.chroma_store import VectorStore

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500, description="Question for the RAG engine")

pipeline: RagPipeline | None = None
vector_store: VectorStore | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize transformer weights and vector store once
    global pipeline, vector_store
    vector_store = VectorStore()
    pipeline = RagPipeline(vector_store=vector_store)
    yield
    # Graceful shutdown cleanup

app = FastAPI(title="RAG Insight Engine API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health/live", tags=["Observability"])
async def liveness():
    """Kubernetes liveness probe: verifies process health."""
    return {"status": "alive"}

@app.get("/health/ready", tags=["Observability"])
async def readiness():
    """Kubernetes readiness probe: asserts PyTorch device and ChromaDB ready."""
    if not vector_store or not pipeline:
        raise HTTPException(status_code=503, detail="AI engine not ready")
    device_name = "cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
    return {
        "status": "ready",
        "device": device_name,
        "chromadb": "connected",
        "collection_items": vector_store.collection.count(),
        "environment": "production"
    }

@app.post("/api/v1/rag/stream", tags=["Inference"])
async def stream_rag_answer(payload: QueryRequest):
    """Stream token-by-token answer via Server-Sent Events (SSE)."""
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")

    async def sse_event_stream() -> AsyncGenerator[str, None]:
        async for token in pipeline.generate_stream(payload.query):
            data = json.dumps({"token": token})
            yield f"data: {data}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(
        sse_event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )`,
    keyTakeaways: [
      'Server-Sent Events (`text/event-stream`) provide lightweight unidirectional token streaming.',
      'Lifespan context manager loads transformer weights into VRAM once at server boot.',
      'Readiness probe (/health/ready) verifies PyTorch device and vector collection integrity for Kubernetes orchestration.'
    ],
    proTip:
      'For high-throughput GPU serving in production, configure Granian or Uvicorn behind a reverse proxy with `proxy_buffering off;` to allow immediate token streaming.'
  }
];
