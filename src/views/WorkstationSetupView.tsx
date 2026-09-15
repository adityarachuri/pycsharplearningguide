import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Code,
  Laptop,
  FolderTree,
  ShieldCheck,
  Zap,
  Play,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Workflow,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import {
  TOOLCHAIN_ROSETTA,
  WORKSTATION_PILLARS,
  OS_SETUP_SCRIPTS
} from '../data/workstationData';
import { MermaidViewer } from '../components/MermaidViewer';

export const WorkstationSetupView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rosetta' | 'config-generator' | 'os-setup' | 'audit'>('overview');
  const [activeConfigTab, setActiveConfigTab] = useState<'pyproject' | 'settings' | 'launch' | 'precommit' | 'docker' | 'editorconfig'>('pyproject');
  const [selectedOS, setSelectedOS] = useState<'wsl2' | 'macos' | 'linux'>('wsl2');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  // Interactive Checklist State
  const [auditChecks, setAuditChecks] = useState<Record<string, boolean>>({
    uv_installed: true,
    python_version: true,
    ruff_on_save: false,
    pyright_strict: false,
    venv_isolated: true,
    launch_json: false,
    pre_commit: false,
    docker_multistage: false
  });

  const toggleAudit = (key: string) => {
    setAuditChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const auditScore = Object.values(auditChecks).filter(Boolean).length;
  const auditPercent = Math.round((auditScore / Object.keys(auditChecks).length) * 100);

  // Mermaid diagrams
  const INNER_LOOP_MERMAID = `flowchart LR
    subgraph IDE ["Modern IDE (VS Code / Cursor / PyCharm)"]
      Code["Source Code (.py)"]
      LSP["LSP Server (Pyright / Pylance)"]
      Ruff["Ruff Formatter & Linter"]
      Code -->|"Save / Keystroke"| LSP
      Code -->|"On Save (~10ms)"| Ruff
      LSP -->|"Static Diagnostics"| ErrorUI["Inline Compiler-Grade Errors"]
    end

    subgraph UV ["uv Engine (100% Rust)"]
      Venv[".venv Isolated Environment"]
      Lock["uv.lock (Deterministic Graph)"]
      Sync["uv sync / uv run"]
      Sync --> Venv
      Sync --> Lock
    end

    subgraph Quality ["Test & Quality Gates"]
      Pytest["uv run pytest -v"]
      PreCommit[".pre-commit (Git Hook)"]
      Pytest --> Report["Coverage & Test Report"]
    end

    subgraph Ship ["Containerized Delivery"]
      Docker["Multi-stage Dockerfile (48MB)"]
      Cloud["Kubernetes / Cloud Run (Linux ELF)"]
      Docker --> Cloud
    end

    IDE -->|"CLI Execution"| UV
    UV -->|"Local Test Execution"| Quality
    Quality -->|"CI/CD Pipeline"| Ship

    classDef ide fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef uv fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#f8fafc;
    classDef qual fill:#701a75,stroke:#f472b6,stroke-width:2px,color:#f8fafc;
    classDef ship fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;

    style IDE fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    style UV fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#f8fafc;
    style Quality fill:#701a75,stroke:#f472b6,stroke-width:2px,color:#f8fafc;
    style Ship fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;`;

  const DEPENDENCY_PIPELINE_MERMAID = `sequenceDiagram
    autonumber
    actor Dev as C# / Python Engineer
    participant UV as uv CLI (Rust Engine)
    participant Index as PyPI / Private Artifacts
    participant Lock as uv.lock (Reproducible Hash)
    participant Venv as Local .venv

    Dev->>UV: uv add 'fastapi>=0.115.0' 'pydantic>=2.10.0'
    Note over UV: High-speed PubGrub SAT Dependency Solver in 12ms
    UV->>Index: Fetch Wheels & Check Cryptographic Hashes
    Index-->>UV: Return pre-compiled C-wheels
    UV->>Lock: Generate / Update uv.lock with exact SHA256 hashes
    UV->>Venv: Hard-link wheels into .venv/lib/python3.12/site-packages
    Note over UV,Venv: Zero-copy hard-links (Installs in ~80ms without disk bloat)
    UV-->>Dev: Ready! Run instantly with 'uv run main.py'`;

  // Config files code
  const CONFIGS = {
    pyproject: `# ==============================================================================
# pyproject.toml - Standardized PEP 621 / PEP 517 Project Definition
# Equivalent to .csproj in modern C# .NET solutions
# ==============================================================================
[project]
name = "enterprise-service"
version = "0.1.0"
description = "High-performance API built with FastAPI, Pydantic, and modern tooling"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",
    "pydantic>=2.10.0",
    "pydantic-settings>=2.6.0",
    "httpx>=0.28.0",
    "structlog>=24.4.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=6.0.0",
    "pyright>=1.1.390",
    "ruff>=0.8.0",
    "pre-commit>=4.0.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

# ------------------------------------------------------------------------------
# Ruff Configuration (Replaces Black, Flake8, isort, pyupgrade)
# ------------------------------------------------------------------------------
[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # Pyflakes
    "I",    # isort (automatic import sorting)
    "B",    # flake8-bugbear (common bug traps)
    "UP",   # pyupgrade (modern Python syntax)
    "ASYNC",# flake8-async (asyncio best practices)
    "RUF",  # Ruff-specific rules
]
ignore = ["E501"] # Let formatter handle line length

[tool.ruff.format]
quote-style = "double"
indent-style = "space"

# ------------------------------------------------------------------------------
# Pyright Type Checker (Compiler-grade static typing)
# ------------------------------------------------------------------------------
[tool.pyright]
typeCheckingMode = "strict"
pythonVersion = "3.12"
reportMissingTypeStubs = false
reportUnknownMemberType = false

# ------------------------------------------------------------------------------
# Pytest Configuration (Equivalent to xUnit / dotnet test)
# ------------------------------------------------------------------------------
[tool.pytest.ini_options]
minversion = "8.0"
addopts = "-ra -q --cov=src --cov-report=term-missing"
testpaths = ["tests"]
asyncio_mode = "auto"
`,
    settings: `// .vscode/settings.json
// Configures VS Code for strict, lightning-fast Python development
{
  // Point interpreter to the uv-managed local virtual environment
  "python.defaultInterpreterPath": "\${workspaceFolder}/.venv/bin/python",
  
  // Use Microsoft Pyright / Pylance for C#-grade static typing
  "python.languageServer": "Pylance",
  "python.analysis.typeCheckingMode": "strict",
  "python.analysis.autoImportCompletions": true,
  "python.analysis.diagnosticMode": "workspace",

  // Configure Ruff as default linter and formatter
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  },

  // Test explorer setup for pytest
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": ["tests"],
  "python.testing.unittestEnabled": false,

  // General hygiene
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.rulers": [88, 120]
}`,
    launch: `// .vscode/launch.json
// Production debugging configurations for VS Code and Cursor
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI Service (Uvicorn Reload)",
      "type": "debugpy",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "src.main:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8000"
      ],
      "jinja": true,
      "justMyCode": false,
      "env": {
        "ENVIRONMENT": "development",
        "LOG_LEVEL": "DEBUG"
      }
    },
    {
      "name": "Python: Debug Current File",
      "type": "debugpy",
      "request": "launch",
      "program": "\${file}",
      "console": "integratedTerminal",
      "justMyCode": true
    },
    {
      "name": "Python: Pytest (Current Test Function)",
      "type": "debugpy",
      "request": "launch",
      "module": "pytest",
      "args": [
        "\${file}",
        "-k",
        "\${selectedText}",
        "-s",
        "-vv"
      ],
      "console": "integratedTerminal",
      "justMyCode": false
    },
    {
      "name": "Python: Attach to Remote Container (Port 5678)",
      "type": "debugpy",
      "request": "attach",
      "connect": {
        "host": "localhost",
        "port": 5678
      },
      "pathMappings": [
        {
          "localRoot": "\${workspaceFolder}",
          "remoteRoot": "/app"
        }
      ]
    }
  ]
}`,
    precommit: `# .pre-commit-config.yaml
# Ensures no unformatted or improperly typed code is ever committed
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.4
    hooks:
      # Run linter
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]
      # Run code formatter
      - id: ruff-format

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.13.0
    hooks:
      - id: mypy
        additional_dependencies: [pydantic>=2.10.0]
        args: [--strict, --ignore-missing-imports]

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
`,
    docker: `# Multi-stage Dockerfile using Astral uv
# Produces ultra-compact (~48MB), non-root, production container image
FROM ghcr.io/astral-sh/uv:0.5.11-python3.12-bookworm-slim AS builder

WORKDIR /app

# Enable bytecode compilation for faster cold starts
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies first (leveraging Docker layer caching)
RUN --mount=type=cache,target=/root/.cache/uv \\
    --mount=type=bind,source=uv.lock,target=uv.lock \\
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \\
    uv sync --frozen --no-install-project --no-dev

# Copy application source
COPY . /app

# Install the project itself
RUN --mount=type=cache,target=/root/.cache/uv \\
    uv sync --frozen --no-dev

# ------------------------------------------------------------------------------
# Final Runtime Stage (Lean Distroless-style)
# ------------------------------------------------------------------------------
FROM python:3.12-slim-bookworm AS runtime

WORKDIR /app

# Create non-root system user
RUN useradd -u 1000 -m -s /bin/bash appuser

# Copy virtual environment from builder
COPY --from=builder --chown=appuser:appuser /app/.venv /app/.venv
COPY --from=builder --chown=appuser:appuser /app/src /app/src

# Set environment path to execute from virtualenv without prefix
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

USER appuser

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
`,
    editorconfig: `# .editorconfig
# Ensures consistent formatting across all IDEs and operating systems
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{json,yaml,yml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
`
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
            Workstation Engineering
          </span>
          <span className="text-xs text-slate-400">The Modern Python Ecosystem</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Developer Workstation Setup: The Modern Python Dev Environment
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          A definitive, architecture-grade blueprint for C# and .NET architects transitioning to modern Python. Master <span className="text-cyan-300 font-semibold">uv</span>, <span className="text-amber-300 font-semibold">Ruff</span>, <span className="text-purple-300 font-semibold">Pyright</span>, VS Code / PyCharm configurations, WSL2 vs macOS setups, and containerized dev environments.
        </p>

        {/* Tab Controls */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {[
            { id: 'overview', label: '1. Toolchain Architecture', icon: Workflow },
            { id: 'rosetta', label: '2. .NET vs Python Tooling Matrix', icon: Layers },
            { id: 'config-generator', label: '3. Production Config Files Generator', icon: Code },
            { id: 'os-setup', label: '4. OS Foundations (WSL2 / Mac / Linux)', icon: Laptop },
            { id: 'audit', label: '5. Workstation Readiness Audit', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview & Architecture Diagrams */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Visual Architecture Diagram */}
          <div className="space-y-3">
            <div className="border-l-2 border-cyan-500/40 pl-4">
              <h2 className="text-lg font-bold text-white">Modern Inner-Loop Developer Workflow</h2>
              <p className="text-xs text-slate-400">
                From keystroke in VS Code to Rust-accelerated type checking, sub-second formatting, and multi-stage container delivery.
              </p>
            </div>

            <MermaidViewer
              title="Modern Python Development Inner-Loop Architecture"
              chart={INNER_LOOP_MERMAID}
              caption="Architecture of a 2026-era Python workstation utilizing uv, Ruff, Pyright, and Docker."
            />
          </div>

          {/* The 4 Pillars */}
          <div className="space-y-3">
            <div className="border-l-2 border-cyan-500/40 pl-4">
              <h2 className="text-lg font-bold text-white">The Four Pillars of Senior Python Engineering</h2>
              <p className="text-xs text-slate-400">
                Core mental shifts required to build robust, team-ready Python solutions without legacy friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORKSTATION_PILLARS.map(p => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 font-mono text-xs font-bold text-cyan-300">
                        {p.number}
                      </span>
                      <h3 className="text-base font-bold text-white">{p.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-amber-400">{p.tagline}</p>

                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-xs text-purple-300">
                    <strong>.NET Architectural Parallel: </strong>
                    <span>{p.csharpConcept}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {p.overview}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dependency Resolution Diagram */}
          <div className="space-y-3">
            <div className="border-l-2 border-cyan-500/40 pl-4">
              <h2 className="text-lg font-bold text-white">PubGrub SAT Dependency Solver Pipeline</h2>
              <p className="text-xs text-slate-400">
                How uv resolves, caches, and hard-links C-wheels in milliseconds, replacing slow pip installs.
              </p>
            </div>

            <MermaidViewer
              title="Fast Dependency Resolution & uv.lock Generation"
              chart={DEPENDENCY_PIPELINE_MERMAID}
              caption="Deterministic dependency locking mirroring NuGet packages.lock.json."
            />
          </div>
        </div>
      )}

      {/* Tab 2: Rosetta Stone Tooling Matrix */}
      {activeTab === 'rosetta' && (
        <div className="space-y-6">
          <div className="border-l-2 border-cyan-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">.NET vs Python Toolchain Rosetta Stone</h2>
            <p className="text-xs text-slate-400">
              Direct mapping of commands, build configurations, test runners, and compilers from C# / .NET to Modern Python.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-4 text-purple-300">.NET / C# Ecosystem</th>
                    <th className="p-4 text-rose-300/80">Legacy Python (Avoid)</th>
                    <th className="p-4 text-cyan-300">Modern Python Standard (2025+)</th>
                    <th className="p-4">Architectural Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {TOOLCHAIN_ROSETTA.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {item.dotnetTool}
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[11px] line-through opacity-75">
                        {item.legacyPython}
                      </td>
                      <td className="p-4 text-cyan-300 font-mono text-[11px] font-bold">
                        {item.modernPythonStandard}
                      </td>
                      <td className="p-4 text-slate-300 leading-relaxed text-xs">
                        {item.whyItMatters}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick CLI Rosetta Stone */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Direct Terminal Command Mapping</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { dot: 'dotnet new webapi -n MyApi', py: 'uv init --app my_api' },
                { dot: 'dotnet add package FluentValidation', py: 'uv add pydantic' },
                { dot: 'dotnet add package xunit --dev', py: 'uv add --dev pytest pytest-asyncio' },
                { dot: 'dotnet run', py: 'uv run python main.py' },
                { dot: 'dotnet test', py: 'uv run pytest' },
                { dot: 'dotnet format', py: 'uvx ruff format .' },
                { dot: 'dotnet build', py: 'uv sync && uvx pyright' }
              ].map((cmd, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-purple-300">
                    <span>.NET:</span>
                    <span className="text-slate-200">{cmd.dot}</span>
                  </div>
                  <div className="flex items-center justify-between text-cyan-300 border-t border-slate-900 pt-1.5 font-bold">
                    <span>Python:</span>
                    <span>{cmd.py}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Config Files Generator */}
      {activeTab === 'config-generator' && (
        <div className="space-y-6">
          <div className="border-l-2 border-cyan-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Production Configuration Generator</h2>
            <p className="text-xs text-slate-400">
              Copy-paste ready, battle-tested configuration files for your workspace.
            </p>
          </div>

          {/* Subtabs for configs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'pyproject', label: 'pyproject.toml', icon: Code },
              { id: 'settings', label: '.vscode/settings.json', icon: Settings },
              { id: 'launch', label: '.vscode/launch.json', icon: Play },
              { id: 'precommit', label: '.pre-commit-config.yaml', icon: ShieldCheck },
              { id: 'docker', label: 'Dockerfile (Multi-Stage)', icon: Cpu },
              { id: 'editorconfig', label: '.editorconfig', icon: FolderTree }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveConfigTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeConfigTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Container */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Code className="h-4 w-4 text-cyan-400" />
                <span>{activeConfigTab === 'pyproject' ? 'pyproject.toml' : activeConfigTab === 'settings' ? '.vscode/settings.json' : activeConfigTab === 'launch' ? '.vscode/launch.json' : activeConfigTab === 'precommit' ? '.pre-commit-config.yaml' : activeConfigTab === 'docker' ? 'Dockerfile' : '.editorconfig'}</span>
              </div>
              <button
                onClick={() => copyToClipboard(CONFIGS[activeConfigTab], activeConfigTab)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {copiedCodeKey === activeConfigTab ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Config</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 md:p-6 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
              {CONFIGS[activeConfigTab]}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: OS Foundations (WSL2 / macOS / Linux) */}
      {activeTab === 'os-setup' && (
        <div className="space-y-6">
          <div className="border-l-2 border-cyan-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Operating System Setup Guide</h2>
            <p className="text-xs text-slate-400">
              Why Windows .NET engineers should adopt WSL2, and how to configure macOS or Linux workstations.
            </p>
          </div>

          {/* OS Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'wsl2', title: 'Windows 11 (WSL2)', badge: 'Recommended for C# Devs' },
              { id: 'macos', title: 'macOS (Apple Silicon)', badge: 'Metal MPS Support' },
              { id: 'linux', title: 'Linux (Ubuntu/Debian)', badge: 'Cloud Native Standard' }
            ].map(os => {
              const isSelected = selectedOS === os.id;
              return (
                <button
                  key={os.id}
                  onClick={() => setSelectedOS(os.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{os.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {os.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active OS Detail Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {OS_SETUP_SCRIPTS[selectedOS].title}
              </h3>
              <span className="text-xs font-bold text-amber-400">
                {OS_SETUP_SCRIPTS[selectedOS].recommendation}
              </span>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs text-cyan-300">
              <strong>Why This Matters: </strong>
              <span>{OS_SETUP_SCRIPTS[selectedOS].why}</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step-by-Step Setup Commands
              </h4>
              <div className="space-y-2 font-mono text-xs">
                {OS_SETUP_SCRIPTS[selectedOS].steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800 text-slate-200"
                  >
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Workstation Readiness Audit Checklist */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="border-l-2 border-cyan-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Workstation Readiness Audit</h2>
            <p className="text-xs text-slate-400">
              Interactive checklist to certify your local environment against senior engineering standards.
            </p>
          </div>

          {/* Progress Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Readiness Score
                </span>
                <div className="text-2xl font-black text-white mt-0.5">
                  {auditPercent}% Certified
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-cyan-400">
                  {auditScore} of {Object.keys(auditChecks).length} Criteria Verified
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${auditPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive Checklist Items */}
          <div className="space-y-2.5">
            {[
              {
                id: 'uv_installed',
                title: 'Astral uv Installed',
                desc: 'Verified via `uv --version`. Used as the primary package manager, venv manager, and Python version switcher.'
              },
              {
                id: 'python_version',
                title: 'Modern Python Interpreter (3.12 or 3.13)',
                desc: 'Using Python 3.12+ to take advantage of PEP 659 adaptive opcode specialization, improved traceback errors, and type syntax.'
              },
              {
                id: 'ruff_on_save',
                title: 'Ruff Formatter & Linter Enabled on Save',
                desc: 'Configured in `.vscode/settings.json` under `editor.codeActionsOnSave` for automatic import sorting and lint auto-fixing.'
              },
              {
                id: 'pyright_strict',
                title: 'Pyright Strict Mode Configured',
                desc: '`typeCheckingMode = "strict"` in `pyproject.toml` or `pyrightconfig.json` to catch NoneType traps and argument mismatches.'
              },
              {
                id: 'venv_isolated',
                title: 'Project Virtual Environment (.venv)',
                desc: 'Packages are NEVER installed into the global system Python. Verified `.venv` exists in project root.'
              },
              {
                id: 'launch_json',
                title: 'VS Code launch.json Debug Profiles',
                desc: 'Configured F5 debug profiles for FastAPI / Uvicorn reload, current file, and pytest single-function debugging.'
              },
              {
                id: 'pre_commit',
                title: 'Git Pre-Commit Hooks Active',
                desc: 'Installed via `uv run pre-commit install` to automatically reject unformatted or broken commits before pushing.'
              },
              {
                id: 'docker_multistage',
                title: 'Multi-Stage Dockerfile with uv Layer Caching',
                desc: 'Docker image builds under 50MB using non-root user and layer-cached dependencies.'
              }
            ].map(item => {
              const checked = auditChecks[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleAudit(item.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    checked
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center mt-0.5 transition-colors ${
                      checked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 bg-slate-800'
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
