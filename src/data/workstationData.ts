export interface ToolComparison {
  dotnetTool: string;
  legacyPython: string;
  modernPythonStandard: string;
  whyItMatters: string;
}

export const TOOLCHAIN_ROSETTA: ToolComparison[] = [
  {
    dotnetTool: 'dotnet CLI (SDK installer & runner)',
    legacyPython: 'pyenv, asdf, python.org installers',
    modernPythonStandard: 'uv (uv python install 3.12 / 3.13)',
    whyItMatters: 'uv manages Python interpreter versions automatically per project without requiring admin privileges or manual shell hooks.'
  },
  {
    dotnetTool: 'NuGet & dotnet add package',
    legacyPython: 'pip, pip-tools, poetry, pipenv',
    modernPythonStandard: 'uv add <pkg> / uv remove <pkg>',
    whyItMatters: 'Written in Rust by Astral, uv resolves complex dependency graphs in 10ms with universal cross-platform lockfiles (uv.lock).'
  },
  {
    dotnetTool: 'csproj & packages.lock.json',
    legacyPython: 'requirements.txt, setup.py, Pipfile',
    modernPythonStandard: 'pyproject.toml (PEP 621) + uv.lock',
    whyItMatters: 'Standardized single manifest for dependencies, dev-tools, scripts, and build backends.'
  },
  {
    dotnetTool: 'Roslyn Compiler (csc) Static Analysis',
    legacyPython: 'No compile step (runtime crash)',
    modernPythonStandard: 'Pyright / BasedPyright / Mypy (Strict mode)',
    whyItMatters: 'Catches NoneType exceptions, missing arguments, and type mismatches in editor before code ever executes.'
  },
  {
    dotnetTool: 'dotnet format / StyleCop / EditorConfig',
    legacyPython: 'Black, Flake8, isort, autopep8, pylint',
    modernPythonStandard: 'Ruff (Single Rust binary)',
    whyItMatters: '100x faster than Python-based linters. Replaces 6 legacy tools with sub-second execution on 1M lines of code.'
  },
  {
    dotnetTool: 'dotnet test (xUnit / NUnit / MSTest)',
    legacyPython: 'unittest (Python stdlib)',
    modernPythonStandard: 'pytest + pytest-xdist + pytest-asyncio',
    whyItMatters: 'Expressive assertion syntax (assert a == b), powerful parameterization, fixtures with dependency injection.'
  },
  {
    dotnetTool: 'Visual Studio / VS Code C# Dev Kit',
    legacyPython: 'Sublime Text, IDLE, PyCharm CE',
    modernPythonStandard: 'VS Code / Cursor (Pylance + Ruff) or PyCharm Pro',
    whyItMatters: 'Rich LSP intelligence, visual debuggers, interactive test explorers, and dev containers.'
  },
  {
    dotnetTool: 'docker build (ASP.NET chiseled base)',
    legacyPython: 'Bloated python:3.11 Dockerfiles (1.2GB)',
    modernPythonStandard: 'Multi-stage uv distroless / alpine (48MB)',
    whyItMatters: 'Ultra-lean production containers with fast layer caching and non-root security.'
  }
];

export const WORKSTATION_PILLARS = [
  {
    id: 'runtime-env',
    number: '01',
    title: 'Interpreter & Virtual Environments (uv)',
    tagline: 'Never install packages into the global system Python',
    csharpConcept: 'Equivalent to .NET SDK global isolation & local bin/obj directories',
    overview: `In .NET, packages are installed into your global NuGet cache and referenced locally per project in bin/Debug/net8.0.
In legacy Python, beginners ran 'pip install' globally, contaminating system Python and breaking Linux OS tools.

The modern standard: Every Python project MUST have an isolated virtual environment (.venv). Using 'uv', managing virtual environments is 100% transparent. You never even need to run 'source .venv/bin/activate'. Simply prefix any command with 'uv run'.`
  },
  {
    id: 'linting-formatting',
    number: '02',
    title: 'Formatting & Linting at 100x Speed (Ruff)',
    tagline: 'Replacing 6 legacy tools with one blazing-fast Rust engine',
    csharpConcept: 'Equivalent to dotnet format + Roslyn Analyzers + StyleCop',
    overview: `Previously, a typical Python CI pipeline ran Black (formatter), isort (import sorter), Flake8 (linter), pydocstyle (docstrings), and pyupgrade (syntax modernization). This took 20-40 seconds per commit.

Ruff is an ultra-fast Python linter and code formatter written in Rust by Charlie Marsh. It executes in 10-25 milliseconds on large codebases and includes over 800 built-in lint rules.`
  },
  {
    id: 'type-checking',
    number: '03',
    title: 'Compiler-Grade Static Typing (Pyright)',
    tagline: 'Achieving C# / TypeScript grade safety in a dynamic language',
    csharpConcept: 'Equivalent to the Roslyn C# compile-time type verification',
    overview: `C# developers expect the compiler to catch typos, mismatched types, and null reference exceptions before running code.
Pyright (developed by Microsoft and powering VS Code Pylance) is a fast, spec-compliant type checker written in TypeScript.

When configured in 'strict' mode, Pyright will reject code that passes untyped arguments, returns mismatched types, or fails to handle Optional[T] / None.`
  },
  {
    id: 'debugging-profiling',
    number: '04',
    title: 'Modern Debugging, DAP, & launch.json',
    tagline: 'Visual breakpoints, conditional watches, and remote container attach',
    csharpConcept: 'Equivalent to Visual Studio F5 debugging and CLR SOS diagnostics',
    overview: `Python debugging has evolved far beyond 'print()' or 'import pdb; pdb.set_trace()'.
Modern Python uses the Debug Adapter Protocol (debugpy) integrated into VS Code, PyCharm, and Cursor.

You can set conditional breakpoints, logpoints (evaluating code without pausing), step into third-party libraries, inspect local value frames, and attach to remote Kubernetes pods or Docker containers.`
  }
];

export const OS_SETUP_SCRIPTS = {
  wsl2: {
    title: 'Windows 11 with WSL2 (Ubuntu 24.04 LTS)',
    recommendation: 'STRONGLY RECOMMENDED FOR WINDOWS .NET ENGINEERS',
    why: 'Avoids MSVC C-compiler wheel incompatibilities, POSIX signal quirks, and provides native CUDA driver pass-through for PyTorch.',
    steps: [
      '1. Open PowerShell as Administrator and enable WSL: wsl --install -d Ubuntu-24.04',
      '2. Restart Windows and launch Ubuntu terminal',
      '3. Install uv via the official standalone installer (no python needed): curl -LsSf https://astral.sh/uv/install.sh | sh',
      '4. Reload shell: source ~/.bashrc',
      '5. Install latest stable Python 3.12: uv python install 3.12',
      '6. Verify installation: uv --version && uv python list',
      '7. In VS Code, install the "WSL" extension and open folder: code .'
    ]
  },
  macos: {
    title: 'macOS (Apple Silicon M1/M2/M3/M4)',
    recommendation: 'EXCELLENT FOR LOCAL DEVELOPMENT & METAL ACCELERATION',
    why: 'Full POSIX compliance, Unix shell, and native PyTorch Apple Silicon GPU acceleration via MPS (Metal Performance Shaders).',
    steps: [
      '1. Install Homebrew: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
      '2. Install uv: brew install uv',
      '3. Install Git & build essentials: brew install git',
      '4. Install Python versions via uv: uv python install 3.12 3.13',
      '5. Verify uv and shell: uv --version'
    ]
  },
  linux: {
    title: 'Linux (Debian / Ubuntu / Fedora)',
    recommendation: 'PRODUCTION CLOUD NATIVE STANDARD',
    why: 'The exact operating system environment your production Docker containers and Kubernetes clusters will run.',
    steps: [
      '1. Install curl & ca-certificates: sudo apt update && sudo apt install -y curl ca-certificates build-essential git',
      '2. Install uv standalone: curl -LsSf https://astral.sh/uv/install.sh | sh',
      '3. Source profile: source ~/.bashrc',
      '4. Install Python 3.12: uv python install 3.12'
    ]
  }
};
