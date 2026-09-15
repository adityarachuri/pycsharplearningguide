export interface AimlStackLayer {
  layerNumber: number;
  layerName: string;
  category: string;
  technologies: string[];
  role: string;
  csharpAlternative: string;
  engineeringDetails: string;
}

export const AIML_STACK_LAYERS: AimlStackLayer[] = [
  {
    layerNumber: 1,
    layerName: 'Hardware Acceleration & Kernel Layer',
    category: 'Compute & Drivers',
    technologies: ['NVIDIA CUDA', 'cuDNN', 'OpenAI Triton', 'TensorRT', 'AMD ROCm', 'Apple MPS'],
    role: 'Low-level GPU memory allocation, fused kernel dispatch, float16/bfloat16/int4 quantization.',
    csharpAlternative: 'Direct3D Compute Shaders, DirectML, Managed CUDA wrappers (ManagedCuda).',
    engineeringDetails: 'OpenAI Triton allows writing custom GPU kernels in Python syntax that compile directly to high-efficiency PTX assembly, bypassing raw C++/CUDA complexity.'
  },
  {
    layerNumber: 2,
    layerName: 'Core Deep Learning & Tensor Engines',
    category: 'Frameworks',
    technologies: ['PyTorch 2.x (torch.compile)', 'Google JAX (XLA)', 'TensorFlow', 'Keras 3'],
    role: 'Automatic differentiation (autograd), tensor graph compilation, dynamic computational graphs, distributed training.',
    csharpAlternative: 'TorchSharp (.NET bindings for libtorch), ML.NET, TensorFlow.NET.',
    engineeringDetails: 'PyTorch 2.0 introduced `torch.compile()` which uses TorchDynamo to trace Python bytecode and synthesize optimized C++/Triton kernels via TorchInductor, achieving up to 2x speedups with zero code changes.'
  },
  {
    layerNumber: 3,
    layerName: 'Data & Mathematical Foundations',
    category: 'Data Science',
    technologies: ['NumPy', 'Polars', 'Pandas 2.0 (PyArrow)', 'SciPy', 'Scikit-Learn'],
    role: 'Vectorized N-dimensional array manipulation, SIMD-accelerated linear algebra, classic ML algorithms (Random Forest, SVM).',
    csharpAlternative: 'Math.NET Numerics, Microsoft.Data.Analysis, NumSharp.',
    engineeringDetails: 'NumPy arrays are raw contiguous C buffers in RAM. Vectorized operations execute in pure C/Fortran/BLAS at full CPU bus bandwidth without per-element Python interpreter overhead.'
  },
  {
    layerNumber: 4,
    layerName: 'Generative AI & LLM Orchestration',
    category: 'Modern GenAI',
    technologies: ['Hugging Face (Transformers, PEFT, TRL)', 'vLLM', 'LangGraph', 'LlamaIndex', 'DSPy', 'LiteLLM'],
    role: 'Foundation model loading, Low-Rank Adaptation (LoRA), prompt compilation, autonomous multi-agent graphs, continuous batching inference.',
    csharpAlternative: 'Microsoft Semantic Kernel, AutoGen .NET, Betalgo.OpenAI.',
    engineeringDetails: 'vLLM introduced PagedAttention (managing KV-cache memory like virtual memory pages in operating systems), increasing LLM serving throughput by 2x–4x over naive implementations.'
  },
  {
    layerNumber: 5,
    layerName: 'Vector Databases & Embeddings',
    category: 'Retrieval & RAG',
    technologies: ['Qdrant', 'Milvus', 'ChromaDB', 'pgvector', 'Meta Faiss', 'Sentence-Transformers'],
    role: 'High-dimensional HNSW vector index search, dense/sparse hybrid retrieval, metadata filtering for Retrieval-Augmented Generation (RAG).',
    csharpAlternative: 'Qdrant .NET SDK, Microsoft.Extensions.VectorData, Azure AI Search .NET SDK.',
    engineeringDetails: 'Faiss (Facebook AI Similarity Search) and Qdrant use SIMD vector distance calculations (cosine, dot product, L2) to query millions of 1536-dimensional vectors in single-digit milliseconds.'
  },
  {
    layerNumber: 6,
    layerName: 'Production Serving & MLOps Infrastructure',
    category: 'Deployment & Scale',
    technologies: ['FastAPI', 'NVIDIA Triton Inference Server', 'Ray Serve', 'BentoML', 'Docker', 'Kubeflow'],
    role: 'Exposing REST/gRPC inference endpoints, dynamic request batching, GPU model autoscaling, streaming tokens via SSE/WebSockets.',
    csharpAlternative: 'ASP.NET Core Kestrel with ONNX Runtime.',
    engineeringDetails: 'FastAPI combined with async streaming generators (`StreamingResponse`) powers the real-time token streaming experience in ChatGPT-style interfaces.'
  }
];

export const CSHARP_VS_PYTHON_AIML = {
  verdict: 'For AI/ML, Python is the non-negotiable industry leader; C# excels at edge ONNX deployment and enterprise client integration.',
  keyDifferences: [
    {
      aspect: 'Research Velocity & Paper Implementations',
      pythonReality: '99% of research papers from OpenAI, Google DeepMind, Meta FAIR, and universities release their code in PyTorch. Breakthrough algorithms (Diffusion models, Mamba, DeepSeek-V3) are available in Python on Day 1.',
      csharpReality: 'C# developers must wait months or years for someone to port the architecture to C# or wrap the weights in ONNX.'
    },
    {
      aspect: 'GPU Kernel & Quantization Support',
      pythonReality: 'FlashAttention, AWQ, GPTQ, BitsAndBytes, and ExLlama are designed natively for Python C-API and PyTorch.',
      csharpReality: 'C# bindings often lack bleeding-edge quantization or require compiling complex custom C++ DLLs via P/Invoke.'
    },
    {
      aspect: 'Production Inference Options',
      pythonReality: 'FastAPI + vLLM / TensorRT-LLM provides maximum throughput for serving open-weights models (Llama 3, Mistral, Qwen).',
      csharpReality: 'ONNX Runtime in ASP.NET Core is exceptionally fast and memory-efficient for deploying pre-trained vision and classification models inside Windows/.NET environments.'
    },
    {
      aspect: 'Orchestrating Cloud APIs (OpenAI, Anthropic, Gemini)',
      pythonReality: 'Official SDKs, LangGraph, DSPy, and Pydantic validation make agentic engineering intuitive.',
      csharpReality: 'Microsoft Semantic Kernel is a very solid enterprise option in C# for integrating LLMs into existing .NET solutions.'
    }
  ]
};

export const CODE_EXAMPLES_AIML = {
  pytorchTensor: `# PyTorch: Tensor operations and Autograd
import torch

# Create tensors with gradient tracking
x = torch.tensor([2.0, 3.0], requires_grad=True)
weights = torch.tensor([0.5, -1.5])
bias = 0.25

# Forward pass: y = weights * x + bias
y = torch.dot(weights, x) + bias

# Compute loss (L2 loss against target 1.0)
target = torch.tensor(1.0)
loss = (y - target) ** 2

# Backward pass: automatic differentiation computes dy/dx
loss.backward()

print(f"Loss: {loss.item():.4f}")
print(f"Gradients on x: {x.grad}") # Output: tensor([-3.4500, 10.3500])`,
  ragPipeline: `# Modern RAG Semantic Query using Sentence-Transformers
from sentence_transformers import SentenceTransformer
import numpy as np

# Load local embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

documents = [
    "C# compiles to MSIL and runs on the Common Language Runtime (CLR).",
    "Python executes bytecode inside the CPython virtual machine loop.",
    "Asyncio provides a single-threaded cooperative event loop.",
    "ASP.NET Core uses Kestrel as its high-performance web server."
]

# Generate dense vector embeddings (384 dimensions)
doc_embeddings = model.encode(documents)

# Search query
query = "How does Python handle asynchronous execution?"
query_embedding = model.encode([query])

# Cosine similarity calculation
scores = np.dot(doc_embeddings, query_embedding.T).flatten()
best_match_idx = np.argmax(scores)

print(f"Top Result (Score {scores[best_match_idx]:.3f}):")
print(documents[best_match_idx])`
};
