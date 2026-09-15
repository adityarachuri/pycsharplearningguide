import { UseCaseStudy } from '../types';

export const USE_CASE_STUDIES: UseCaseStudy[] = [
  {
    id: 'fintech-payments',
    companyOrDomain: 'FinTech & High-Frequency Payment Routing',
    title: 'Global Payment Gateway & Fraud Scoring Engine',
    scale: '50,000+ transaction requests/second across 14 currencies',
    problemStatement: 'The enterprise needed an extensible, resilient microservice to ingest credit card webhooks, sanitize PII, evaluate multi-variant fraud heuristics with low latency (<30ms), and route to redundant banking gateways.',
    pythonSolution: 'Built with FastAPI running on Uvicorn workers and uvloop. Input payload validated via Pydantic v2 in under 0.8ms. Redis cluster handles idempotency locks; async httpx handles concurrent banking gateway handshakes.',
    architectureWorkflow: [
      {
        step: 1,
        title: 'Webhook Ingestion & Idempotency',
        description: 'FastAPI receives raw webhook. Redis distributed lock acquired with atomic SETNX on SHA-256 payload hash.',
        tech: 'FastAPI + Redis + uvloop'
      },
      {
        step: 2,
        title: 'Rust-Core Schema Validation',
        description: 'Pydantic v2 validates card token format, merchant tier, and currency limits in ~0.6ms.',
        tech: 'Pydantic-core'
      },
      {
        step: 3,
        title: 'Asynchronous Fraud Scoring',
        description: 'Asyncio TaskGroup fires concurrent calls to local Redis feature store and ONNX Runtime model evaluator.',
        tech: 'asyncio.TaskGroup + ONNX'
      },
      {
        step: 4,
        title: 'Gateway Dispatch & Event Stream',
        description: 'Routes to lowest-latency banking partner via HTTP/2 connection pooling; emits audit event to Kafka topic.',
        tech: 'httpx + aiokafka'
      }
    ],
    csharpComparison: 'While C# ASP.NET Core with Kestrel offers slightly higher raw socket RPS, Python allowed the fraud analytics team (data scientists) and backend engineers to work on the exact same codebase, slashing feature iteration time from 6 weeks to 3 days.',
    performanceMetrics: [
      { label: 'P99 Latency', value: '24.2 ms' },
      { label: 'Ingestion Throughput', value: '52,000 req/s' },
      { label: 'Validation Overhead', value: '< 0.8 ms' },
      { label: 'Codebase Reduction', value: '42% vs C#' }
    ],
    keyTakeaway: 'The unification of data science fraud models and production web endpoints in a single language eliminated the costly "data team in Python, production team in C#" handoff bottleneck.'
  },
  {
    id: 'ai-agent-rag',
    companyOrDomain: 'Enterprise Generative AI & Knowledge Ops',
    title: 'Autonomous RAG Agent Pipeline with Multi-Vector Retrieval',
    scale: '10M+ enterprise documents, 150+ tool-calling agents',
    problemStatement: 'An insurance multinational needed to automate complex claims analysis across 40-page unstructured policy PDFs, medical records, and adjustor notes with guaranteed factual grounding and zero hallucination.',
    pythonSolution: 'Python orchestrated the entire AI lifecycle: Unstructured.io for multimodal PDF parsing, PyTorch/Sentence-Transformers for embedding generation, Qdrant vector database for hybrid semantic search, and LiteLLM for token streaming.',
    architectureWorkflow: [
      {
        step: 1,
        title: 'Document Ingestion & Chunking',
        description: 'Worker pool extracts tables, headers, and text from incoming claims PDFs using PyMuPDF and pypdf.',
        tech: 'ProcessPoolExecutor + PyMuPDF'
      },
      {
        step: 2,
        title: 'Vector Embedding Generation',
        description: 'Batched embeddings calculated via GPU-accelerated model running in native PyTorch tensors.',
        tech: 'PyTorch + CUDA'
      },
      {
        step: 3,
        title: 'Hybrid Dense/Sparse Vector Search',
        description: 'Qdrant vector engine queried for top-k relevant policy clauses with metadata filtering.',
        tech: 'Qdrant-client + BM25'
      },
      {
        step: 4,
        title: 'Agentic Synthesis & Guardrails',
        description: 'LLM agent evaluates cross-clauses, invokes calculation tools, and returns audited decision stream.',
        tech: 'LangGraph + Pydantic'
      }
    ],
    csharpComparison: 'Microsoft offers Semantic Kernel and TorchSharp in .NET, but the generative AI ecosystem (Hugging Face, vLLM, LangGraph, DSPy, Unstructured) lives natively in Python. Replicating this in C# would require wrapping dozens of external Python services via gRPC.',
    performanceMetrics: [
      { label: 'Query Processing Time', value: '1.4 s' },
      { label: 'Context Retrieval Precision', value: '96.8%' },
      { label: 'Monthly Document Volume', value: '8.4M pages' },
      { label: 'Staff Hours Saved/Month', value: '12,500 hrs' }
    ],
    keyTakeaway: 'Python is the uncontested lingua franca of modern AI/ML; building GenAI applications in any other language incurs severe ecosystem friction.'
  },
  {
    id: 'bigdata-polars',
    companyOrDomain: 'High-Volume Data Engineering & Analytics',
    title: '100M+ Record Real-Time Data Pipeline with Polars & Arrow',
    scale: '140M daily clickstream events, 12 TB raw data lake',
    problemStatement: 'Legacy Pandas pipelines suffered frequent Out-Of-Memory (OOM) crashes and took 4.5 hours to process daily telemetry. Upgrading Spark clusters incurred massive cloud compute bills ($28k/month).',
    pythonSolution: 'Migrated to Python using Polars (Rust-based multi-threaded DataFrame engine with Apache Arrow memory layout) orchestrated via Prefect workflows. Used streaming mode to process files larger than available RAM.',
    architectureWorkflow: [
      {
        step: 1,
        title: 'Parquet File Scanning',
        description: 'Polars scans multi-terabyte S3 partitioned Parquet files with lazy predicate and projection pushdown.',
        tech: 'Polars LazyFrame + AWS S3'
      },
      {
        step: 2,
        title: 'Multi-threaded SIMD Aggregations',
        description: 'Polars automatically utilizes all 32 CPU cores without GIL interference, running vectorized SIMD transformations.',
        tech: 'Polars Engine (Rust/Arrow)'
      },
      {
        step: 3,
        title: 'DuckDB Analytical SQL Validation',
        description: 'In-memory DuckDB queries the zero-copy Arrow memory buffers to cross-verify financial balances.',
        tech: 'DuckDB + PyArrow'
      },
      {
        step: 4,
        title: 'Sink to Lakehouse',
        description: 'Aggregated analytics tables written as Z-ordered Delta Lake tables for downstream PowerBI queries.',
        tech: 'Delta-RS (Deltalake Python)'
      }
    ],
    csharpComparison: 'While C# has excellent LINQ and high-performance Span<T>, the data engineering toolchain (Apache Arrow, Polars, DuckDB, Great Expectations, Prefect) is first-class in Python.',
    performanceMetrics: [
      { label: 'Execution Time', value: '14 min (from 4.5 hrs)' },
      { label: 'Cloud Compute Cost', value: '78% reduction' },
      { label: 'Peak RAM Usage', value: '8.2 GB (from 64 GB)' },
      { label: 'Data Processed/Sec', value: '165,000 rows/s' }
    ],
    keyTakeaway: 'Modern Python data engineering leverages Rust and C++ underneath (Polars/Arrow/DuckDB), granting Python developers near-bare-metal speeds with unmatched syntax ergonomics.'
  },
  {
    id: 'scientific-nasa',
    companyOrDomain: 'Scientific Computing & Deep Space Exploration',
    title: 'James Webb Space Telescope (JWST) Data Reduction',
    scale: 'Terabytes of raw infrared sensor data from 1.5 million km in space',
    problemStatement: 'The Space Telescope Science Institute (STScI) required calibration pipelines to ingest raw photon counts from NIRCam/MIRI infrared detectors, remove cosmic ray noise, and perform distortion corrections.',
    pythonSolution: 'Standardized on a pure Python scientific stack: Astropy for astronomical coordinate transformations, NumPy and SciPy for Fourier filtering and matrix deconvolutions, and Dask for parallel distributed cluster processing.',
    architectureWorkflow: [
      {
        step: 1,
        title: 'FITS Telemetry Ingestion',
        description: 'Raw binary telemetry unpacked from spacecraft deep-space transponder into standard Flexible Image Transport System.',
        tech: 'Astropy.io.fits'
      },
      {
        step: 2,
        title: 'Cosmic Ray & Detector Calibration',
        description: 'NumPy vectorized arrays calculate dark current subtractions and cosmic ray flag masks across 4096x4096 sensor grids.',
        tech: 'NumPy + SciPy'
      },
      {
        step: 3,
        title: 'Spectroscopic Point Spread Function',
        description: 'Fast Fourier Transform (FFT) algorithms deconvolve telescope optics point spread functions.',
        tech: 'SciPy.fft'
      },
      {
        step: 4,
        title: 'Mosaic Recombination',
        description: 'Dask distributes image mosaic stitching across supercomputer nodes to generate calibrated composite images.',
        tech: 'Dask + Matplotlib'
      }
    ],
    csharpComparison: 'Scientific algorithms thrive on interactive experimentation (Jupyter notebooks) and 30+ years of peer-reviewed scientific packages (SciPy/NumPy). C# lacks an equivalent breadth of specialized astrophysics and scientific libraries.',
    performanceMetrics: [
      { label: 'Image Resolution', value: '40 Megapixels' },
      { label: 'Calibration Speed', value: 'Real-time telemetry' },
      { label: 'Scientific Precision', value: '64-bit IEEE Floats' },
      { label: 'Global Science Adoption', value: '100% of STScI JWST pipeline' }
    ],
    keyTakeaway: 'Python is the undisputed global standard for open scientific discovery because it allows astrophysicists and mathematicians to code directly without compiler overhead.'
  },
  {
    id: 'devops-automation',
    companyOrDomain: 'Cloud Infrastructure & Autonomous Platform Engineering',
    title: 'Enterprise Kubernetes Controller & Cloud Infrastructure as Code',
    scale: '45 Kubernetes clusters, 6,000+ microservice pods across AWS & Azure',
    problemStatement: 'An enterprise needed a centralized control plane to enforce zero-trust security policies, automatically provision preview environments for pull requests, and manage cross-cloud infrastructure drift.',
    pythonSolution: 'Engineers wrote custom Kubernetes Controllers using the Kopf (Kubernetes Operator Python Framework) library and declared multi-cloud infrastructure using AWS CDK and Pulumi with Python typing.',
    architectureWorkflow: [
      {
        step: 1,
        title: 'Kubernetes Custom Resource Event',
        description: 'A developer commits a `PreviewEnvironment` YAML CRD to the cluster; Kopf operator catches the creation event.',
        tech: 'Kopf + Kubernetes Python Client'
      },
      {
        step: 2,
        title: 'Dynamic Cloud Provisioning',
        description: 'Python script invokes Pulumi automation API to spin up ephemeral RDS Postgres and S3 bucket with tagging.',
        tech: 'Pulumi Python SDK + Boto3'
      },
      {
        step: 3,
        title: 'DNS & Ingress Configuration',
        description: 'Dynamic Route53 record and cert-manager SSL certificate provisioned automatically for PR URL.',
        tech: 'Asyncio + AWS Route53 API'
      },
      {
        step: 4,
        title: 'Slack Bot Notification & TTL Reaper',
        description: 'Sends interactive Slack message with preview URL; registers a cron reaper to delete resources after 48 hours.',
        tech: 'Slack-SDK + Asyncio'
      }
    ],
    csharpComparison: 'While PowerShell or C# can interact with cloud APIs, Python scripts execute seamlessly across Linux, macOS, container images, and CI/CD runners without needing .NET SDK installations or build steps.',
    performanceMetrics: [
      { label: 'Env Provisioning Time', value: '< 2.5 min' },
      { label: 'Idle Cloud Cost Saved', value: '$45,000 / quarter' },
      { label: 'Operator Footprint', value: '45 MB container' },
      { label: 'Lines of Code', value: '650 LoC (vs 2,200 in Go)' }
    ],
    keyTakeaway: 'Python is the ultimate glue language: bridging cloud SDKs, Kubernetes operators, and DevOps CI pipelines with minimal ceremony.'
  }
];
