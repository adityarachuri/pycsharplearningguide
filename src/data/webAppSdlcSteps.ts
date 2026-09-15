import { ProjectStep } from './webAppProjectData';

export const WEB_APP_STEPS: ProjectStep[] = [
  {
    id: 1,
    title: 'Workstation Setup & IDE Toolchain',
    duration: '01:00',
    sceneTitle: 'Scene 1: Developer Workstation Setup & IDE Toolchain Provisioning',
    sdlcStage: 'SDLC Step 1 of 8: Developer Workstation Setup',
    sdlcPhaseName: 'Workstation Setup',
    description:
      'Set up the developer workstation for production Python 3.12+ engineering. In .NET, you would install the .NET SDK, configure Omnisharp / C# Dev Kit in VS Code, and setup Directory.Build.props. Here, we provision the workstation with Astral uv, scaffold an isolated virtual environment (.venv), configure .vscode/settings.json with Ruff format-on-save and Pyright type checking, and lock dependencies with sub-second performance.',
    csharpParallel: {
      concept: 'Workstation Provisioning & IDE Workspace',
      dotnetEquivalent: 'dotnet new tool-manifest && dotnet tool install csharpier && dotnet new webapi',
      keyDifference:
        'C# relies on global MSBuild targets and OmniSharp/Roslyn language servers. Python workstation setups use isolated virtual environments (.venv) mapped in .vscode/settings.json, with Ruff executing linting and formatting in Rust at 10-100x the speed of legacy tools.'
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
        cmd: 'uv init --app taskflow-api && cd taskflow-api',
        output: [
          'Initialized project `taskflow-api` at /workspace/taskflow-api',
          'Created pyproject.toml',
          'Created .python-version (3.12.7)',
          'Created README.md'
        ]
      },
      {
        cmd: 'mkdir -p .vscode && cat << \'EOF\' > .vscode/settings.json ...',
        output: [
          'Configured .vscode/settings.json:',
          '  - python.defaultInterpreterPath: "${workspaceFolder}/.venv/bin/python"',
          '  - editor.formatOnSave: true (charliermarsh.ruff)',
          '  - python.analysis.typeCheckingMode: "strict"'
        ]
      },
      {
        cmd: 'uv add "fastapi[standard]>=0.115.0" "sqlalchemy[asyncio]>=2.0.35" "asyncpg>=0.29.0" "pydantic-settings>=2.5.0" "alembic>=1.13.0"',
        output: [
          'Using Python 3.12.7 environment at: .venv',
          'Resolved 42 packages in 284ms',
          'Installed 42 packages in 420ms',
          ' + alembic==1.13.3',
          ' + asyncpg==0.29.0',
          ' + fastapi==0.115.0',
          ' + pydantic==2.9.2',
          ' + pydantic-settings==2.5.2',
          ' + sqlalchemy==2.0.35',
          ' + uvicorn==0.30.6'
        ]
      },
      {
        cmd: 'uv add --dev "pytest>=8.3.0" "pytest-asyncio>=0.24.0" "httpx>=0.27.0" "aiosqlite>=0.20.0" "ruff>=0.6.0" "mypy>=1.11.0"',
        output: [
          'Resolved 16 dev packages in 78ms',
          'Installed 16 packages in 115ms',
          'All dependencies locked in uv.lock (deterministic SHA-256 hashes)'
        ]
      }
    ],
    activeFile: '.vscode/settings.json',
    language: 'json',
    fileContent: `{
  // Workstation IDE configuration for high-velocity Python 3.12+ engineering
  "python.defaultInterpreterPath": "\${workspaceFolder}/.venv/bin/python",
  "python.terminal.activateEnvironment": true,
  
  // Format-on-Save powered by Ruff (Rust engine replacing Black + isort + Flake8)
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  },

  // Pyright / Pylance strict type checking (replaces C# Roslyn compile-time checks)
  "python.analysis.typeCheckingMode": "strict",
  "python.analysis.autoImportCompletions": true,
  "python.analysis.diagnosticSeverityOverrides": {
    "reportMissingTypeStubs": "none",
    "reportUnknownMemberType": "none"
  },

  // Files and search exclusions
  "files.exclude": {
    "**/.git": true,
    "**/.venv": false,
    "**/__pycache__": true,
    "**/.ruff_cache": true,
    "**/.pytest_cache": true
  }
}`,
    keyTakeaways: [
      'uv replaces pip, poetry, virtualenv, and pipx with a single lightning-fast Rust binary.',
      '.vscode/settings.json standardizes formatting, linting, and strict type checking across team workstations.',
      'pyproject.toml (PEP 621) unified metadata eliminates redundant config files across the repo.'
    ],
    proTip:
      'Always commit .vscode/settings.json and uv.lock to version control, but strictly gitignore .venv/.'
  },
  {
    id: 2,
    title: 'Domain Models & Async Database Engine',
    duration: '01:45',
    sceneTitle: 'Scene 2: Domain Architecture & Declarative SQLAlchemy 2.0 Models',
    sdlcStage: 'SDLC Step 2 of 8: Domain Modeling',
    sdlcPhaseName: 'Domain Modeling',
    description:
      'Configure an async database session pool and define domain models using SQLAlchemy 2.0 DeclarativeBase with Mapped[T] type annotations. In C#, this corresponds to Entity Framework Core DbContext, DbSet<T>, and entity type configurations.',
    csharpParallel: {
      concept: 'Async ORM & Entity Modeling',
      dotnetEquivalent: 'public class TaskItem { public int Id { get; set; } ... } in EF Core',
      keyDifference:
        'SQLAlchemy 2.0 uses type annotations `Mapped[T] = mapped_column(...)` that mirror C# typed properties. Python type checkers validate SQL query operations at authoring time.'
    },
    terminalCommands: [
      {
        cmd: 'mkdir -p app/models app/schemas app/routers',
        output: ['Created directory tree: app/models, app/schemas, app/routers']
      },
      {
        cmd: 'touch app/__init__.py app/models/__init__.py app/models/task.py',
        output: ['Initialized Python package structure']
      },
      {
        cmd: 'uv run python -c "from app.models.task import TaskItem; print(TaskItem.__tablename__)"',
        output: ['tasks']
      }
    ],
    activeFile: 'app/models/task.py',
    language: 'python',
    fileContent: `from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import String, Text, DateTime, Enum as SQLEnum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    """Declarative root base equivalent to EF Core ModelBuilder configurations."""
    pass

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class TaskPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class TaskItem(Base):
    __tablename__ = "tasks"

    # Mapped[T] provides compile-time type hints identical to C# property getters/setters
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[TaskStatus] = mapped_column(
        SQLEnum(TaskStatus, native_enum=False),
        default=TaskStatus.PENDING,
        nullable=False
    )
    priority: Mapped[TaskPriority] = mapped_column(
        SQLEnum(TaskPriority, native_enum=False),
        default=TaskPriority.MEDIUM,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )`,
    keyTakeaways: [
      'SQLAlchemy 2.0 Mapped[T] provides strict typing matching C# EF Core properties.',
      'Always use timezone-aware datetimes with `datetime.now(timezone.utc)`.',
      'String enums inherit from both `str` and `Enum` for seamless JSON serialization.'
    ],
    proTip:
      'Avoid legacy SQLAlchemy 1.4 syntax like `Column(Integer)`. Always use 2.0 declarative typed mapped columns.'
  },
  {
    id: 3,
    title: 'Database Migrations with Alembic',
    duration: '02:30',
    sceneTitle: 'Scene 3: Database Schema Migrations with Alembic Async',
    sdlcStage: 'SDLC Step 3 of 8: Schema Migrations',
    sdlcPhaseName: 'Database Migrations',
    description:
      'Initialize and execute database migrations using Alembic in async mode. In .NET, this is identical to running dotnet ef migrations add InitialCreate followed by dotnet ef database update. Alembic inspects your SQLAlchemy Base metadata and generates version-controlled Python migration scripts.',
    csharpParallel: {
      concept: 'Database Schema Migrations',
      dotnetEquivalent: 'dotnet ef migrations add InitialCreate && dotnet ef database update',
      keyDifference:
        'Alembic stores migrations in python scripts under alembic/versions. Unlike EF Core designer files, Alembic revisions are readable Python scripts that can run custom raw SQL or data migrations.'
    },
    terminalCommands: [
      {
        cmd: 'uv run alembic init -t async alembic',
        output: [
          '  Creating directory /workspace/taskflow-api/alembic ... done',
          '  Creating directory /workspace/taskflow-api/alembic/versions ... done',
          '  Generating /workspace/taskflow-api/alembic.ini ... done',
          '  Generating /workspace/taskflow-api/alembic/env.py ... done',
          '  Generating /workspace/taskflow-api/alembic/script.py.mako ... done',
          '  Please edit the "sqlalchemy.url" in "alembic.ini" or env.py'
        ]
      },
      {
        cmd: 'uv run alembic revision --autogenerate -m "create initial tasks schema"',
        output: [
          'INFO  [alembic.runtime.migration] Context impl SQLiteImpl.',
          'INFO  [alembic.runtime.migration] Will assume non-transactional DDL.',
          'INFO  [alembic.autogenerate.compare] Detected added table \'tasks\'',
          'INFO  [alembic.autogenerate.compare] Detected added index \'ix_tasks_title\' on \'tasks\'',
          '  Generating /workspace/taskflow-api/alembic/versions/20260912_01_create_initial_tasks_schema.py ... done'
        ]
      },
      {
        cmd: 'uv run alembic upgrade head',
        output: [
          'INFO  [alembic.runtime.migration] Context impl SQLiteImpl.',
          'INFO  [alembic.runtime.migration] Will assume non-transactional DDL.',
          'INFO  [alembic.runtime.migration] Running upgrade  -> 20260912_01, create initial tasks schema',
          'Migration complete: tasks table created with 7 columns and 1 index.'
        ]
      }
    ],
    activeFile: 'alembic/versions/20260912_01_create_initial_tasks_schema.py',
    language: 'python',
    fileContent: `"""create initial tasks schema

Revision ID: 20260912_01
Revises: 
Create Date: 2026-09-12 10:00:00.000000

"""
from collections.abc import Sequence
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '20260912_01'
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    # Equivalent to MigrationBuilder.CreateTable in EF Core
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'IN_PROGRESS', 'COMPLETED', name='taskstatus', native_enum=False), nullable=False),
        sa.Column('priority', sa.Enum('LOW', 'MEDIUM', 'HIGH', name='taskpriority', native_enum=False), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tasks_title'), 'tasks', ['title'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_tasks_title'), table_name='tasks')
    op.drop_table('tasks')`,
    keyTakeaways: [
      'Alembic auto-generates migrations by comparing DeclarativeBase metadata with current database schema.',
      'Always review autogenerated migration scripts before running \`upgrade head\`.',
      'Async Alembic uses \`async_engine.connect()\` in \`env.py\` to run DDL operations.'
    ],
    proTip:
      'In CI/CD, run \`alembic check\` to assert that no pending model changes lack a migration script.'
  },
  {
    id: 4,
    title: 'Code Implementation: Routers & Contracts',
    duration: '03:15',
    sceneTitle: 'Scene 4: Core Code Implementation: REST Endpoints, DTOs & DI',
    sdlcStage: 'SDLC Step 4 of 8: Core Code Implementation',
    sdlcPhaseName: 'Code Implementation',
    description:
      'Author strict Pydantic v2 DTOs (Data Transfer Objects) and wire REST routes with FastAPI. In ASP.NET Core, this replaces C# records, FluentValidation, [FromBody] attributes, and MediatR request handlers. FastAPI handles validation and generates interactive OpenAPI 3.1 Swagger UI out of the box.',
    csharpParallel: {
      concept: 'Controllers, Routing & Dependency Injection',
      dotnetEquivalent: '[ApiController] [Route("api/v1/tasks")] with ITaskService injected via constructor',
      keyDifference:
        'FastAPI uses function-based dependency injection via `Annotated[AsyncSession, Depends(get_db)]`. No complex IServiceCollection registrations or custom middleware are needed for request-scoped database sessions.'
    },
    terminalCommands: [
      {
        cmd: 'uv run ruff check app/routers/tasks.py',
        output: ['All checks passed! No lint errors found.']
      },
      {
        cmd: 'uv run uvicorn app.main:app --reload --port 8000',
        output: [
          'INFO:     Will watch for changes in: [\'/workspace/taskflow-api/app\']',
          'INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)',
          'INFO:     Started reloader process [18920] using WatchFiles',
          'INFO:     Started server process [18922]',
          'INFO:     Waiting for application startup.',
          'INFO:     Application startup complete.',
          'INFO:     Swagger UI docs available at: http://127.0.0.1:8000/docs'
        ]
      },
      {
        cmd: 'curl -s -X POST http://127.0.0.1:8000/api/v1/tasks/ -H "Content-Type: application/json" -d \'{"title": "Migrate C# microservice to FastAPI", "priority": "HIGH"}\' | jq',
        output: [
          '{',
          '  "id": 1,',
          '  "title": "Migrate C# microservice to FastAPI",',
          '  "description": null,',
          '  "priority": "HIGH",',
          '  "status": "PENDING",',
          '  "created_at": "2026-09-12T10:15:32.418290Z",',
          '  "updated_at": "2026-09-12T10:15:32.418290Z"',
          '}'
        ]
      }
    ],
    activeFile: 'app/routers/tasks.py',
    language: 'python',
    fileContent: `from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.task import TaskItem, TaskStatus
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# Type alias for Dependency Injection - equivalent to C# constructor injection [FromServices]
DbSession = Annotated[AsyncSession, Depends(get_db)]

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreate, db: DbSession) -> TaskItem:
    """Create a new task with automatic Pydantic request validation."""
    task = TaskItem(
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        status=TaskStatus.PENDING
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@router.get("/", response_model=list[TaskRead])
async def list_tasks(
    db: DbSession,
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
) -> list[TaskItem]:
    """Paginated list of tasks with optional status filter."""
    query = select(TaskItem).offset(offset).limit(limit)
    if status_filter:
        query = query.where(TaskItem.status == status_filter)
    result = await db.execute(query)
    return list(result.scalars().all())

@router.get("/{task_id}", response_model=TaskRead)
async def get_task(task_id: int, db: DbSession) -> TaskItem:
    """Retrieve single task by ID or return HTTP 404."""
    task = await db.get(TaskItem, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )
    return task`,
    keyTakeaways: [
      'Pydantic v2 validates request payloads in compiled Rust before reaching router functions.',
      '`Annotated[AsyncSession, Depends(get_db)]` provides clean, reusable dependency injection.',
      'SQLAlchemy 2.0 `select()` syntax gives full compile-time typing and async execution.'
    ],
    proTip:
      'FastAPI automatically generates an interactive Swagger UI documentation at `/docs` and ReDoc at `/redoc`.'
  },
  {
    id: 5,
    title: 'Automated Testing with Pytest & AsyncClient',
    duration: '04:15',
    sceneTitle: 'Scene 5: Quality Assurance: Pytest Async & In-Memory Isolation',
    sdlcStage: 'SDLC Step 5 of 8: QA & Automated Testing',
    sdlcPhaseName: 'Automated Testing',
    description:
      'Write end-to-end integration tests using pytest, pytest-asyncio, and httpx.AsyncClient. In .NET, you use Microsoft.AspNetCore.Mvc.Testing (WebApplicationFactory<T>) and xUnit. In Python, an in-memory SQLite database fixture runs tests in parallel without external server spin-up.',
    csharpParallel: {
      concept: 'Integration Testing & Test Host',
      dotnetEquivalent: 'WebApplicationFactory<Program> with HttpClient in xUnit',
      keyDifference:
        'FastAPI tests use `ASGITransport` which injects HTTP requests directly into the in-memory ASGI app pipeline without opening an operating system TCP socket, running 5-10x faster than traditional network tests.'
    },
    terminalCommands: [
      {
        cmd: 'uv run pytest tests/ -v --cov=app',
        output: [
          '============================= test session starts ==============================',
          'platform linux -- Python 3.12.7, pytest-8.3.3, pluggy-1.5.0',
          'rootdir: /workspace/taskflow-api, configfile: pyproject.toml',
          'plugins: asyncio-0.24.0, cov-5.0.0',
          'asyncio: mode=Mode.AUTO',
          'collected 5 items',
          '',
          'tests/test_tasks_api.py::test_create_task_success PASSED               [ 20%]',
          'tests/test_tasks_api.py::test_list_tasks_empty PASSED                  [ 40%]',
          'tests/test_tasks_api.py::test_get_task_by_id PASSED                   [ 60%]',
          'tests/test_tasks_api.py::test_get_task_not_found PASSED               [ 80%]',
          'tests/test_tasks_api.py::test_validation_error_empty_title PASSED     [100%]',
          '',
          '---------- coverage: platform linux, python 3.12.7 -----------',
          'Name                    Stmts   Miss  Cover',
          '-------------------------------------------',
          'app/__init__.py             0      0   100%',
          'app/config.py               9      0   100%',
          'app/database.py            16      1    94%',
          'app/models/task.py         22      0   100%',
          'app/routers/tasks.py       35      2    94%',
          'app/schemas/task.py        18      0   100%',
          '-------------------------------------------',
          'TOTAL                     100      3    97%',
          '============================== 5 passed in 0.42s ==============================='
        ]
      }
    ],
    activeFile: 'tests/test_tasks_api.py',
    language: 'python',
    fileContent: `import pytest
from collections.abc import AsyncGenerator
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.database import get_db
from app.main import app
from app.models.task import Base

# In-memory SQLite async engine for lightning-fast test isolation
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="function")
async def test_session() -> AsyncGenerator[AsyncSession, None]:
    """Creates a fresh database schema for every test function."""
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(bind=engine, expire_on_commit=False)
    async with async_session() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest.fixture(scope="function")
async def client(test_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Test client equivalent to WebApplicationFactory.CreateClient() in C#."""
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield test_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()

async def test_create_task_success(client: AsyncClient):
    payload = {"title": "Test C# to Python transition", "priority": "HIGH"}
    response = await client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "Test C# to Python transition"
    assert data["status"] == "PENDING"`,
    keyTakeaways: [
      'FastAPI \`app.dependency_overrides[get_db]\` swaps production databases for test databases effortlessly.',
      'ASGITransport sends requests in-memory without opening OS sockets, running tests in milliseconds.',
      'Pytest fixtures handle setup and teardown cleanly with Python async generators.'
    ],
    proTip:
      'In C#, you configure \`ConfigureTestServices(services => ...)\`. In FastAPI, \`app.dependency_overrides\` does the exact same thing cleanly.'
  },
  {
    id: 6,
    title: 'CI/CD Automation & Static Quality Gates',
    duration: '04:50',
    sceneTitle: 'Scene 6: CI/CD Pipeline: GitHub Actions, Ruff & Mypy Gates',
    sdlcStage: 'SDLC Step 6 of 8: CI/CD Automation',
    sdlcPhaseName: 'CI/CD Pipeline',
    description:
      'Automate the SDLC pipeline with GitHub Actions continuous integration. The workflow executes Ruff code formatting verification, strict type checking with Mypy/Pyright, matrix testing across Python versions, and dependency vulnerability audits via pip-audit before any merge.',
    csharpParallel: {
      concept: 'CI/CD Pipeline & Build Quality Gates',
      dotnetEquivalent: 'GitHub Actions running dotnet format --verify-no-changes && dotnet test',
      keyDifference:
        'uv sync --frozen restores the locked environment in CI runners in under 800ms. Ruff verifies 100,000 lines of code in under 50ms, resulting in ultra-fast feedback loops compared to MSBuild.'
    },
    terminalCommands: [
      {
        cmd: 'uv run ruff check .',
        output: ['All checks passed! 0 errors in 18 files.']
      },
      {
        cmd: 'uv run ruff format --check .',
        output: ['18 files already formatted.']
      },
      {
        cmd: 'uv run mypy app/ --strict',
        output: ['Success: no issues found in 8 source files. Type check passed with 0 warnings.']
      },
      {
        cmd: 'uv run pip-audit',
        output: [
          'Found 42 known dependencies',
          'Audited 42 packages: 0 vulnerabilities found',
          'Security audit: PASSED'
        ]
      }
    ],
    activeFile: '.github/workflows/ci.yml',
    language: 'yaml',
    fileContent: `name: Enterprise CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  quality-gate:
    name: Lint, Type Check & Test Matrix
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.12", "3.13"]

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Install Astral uv
        uses: astral-sh/setup-uv@v3
        with:
          version: "latest"
          enable-cache: true

      - name: Set up Python \${{ matrix.python-version }}
        run: uv python install \${{ matrix.python-version }}

      - name: Restore Locked Dependencies
        run: uv sync --frozen

      - name: Ruff Linter & Formatting Gate
        run: |
          uv run ruff check .
          uv run ruff format --check .

      - name: Strict Static Type Checking (Mypy)
        run: uv run mypy app/ --strict

      - name: Security Vulnerability Scan (pip-audit)
        run: uv run pip-audit

      - name: Execute Automated Test Suite with Coverage
        run: uv run pytest tests/ -v --cov=app --cov-report=xml

      - name: Verify Alembic Migration Status
        run: uv run alembic check`,
    keyTakeaways: [
      'Astral setup-uv action caches wheels globally across CI jobs, speeding up runs by 10x.',
      'Automated matrix testing validates compatibility across current and future Python versions.',
      '\`alembic check\` enforces that all model modifications have matching migration revisions.'
    ],
    proTip:
      'Add \`--cov-fail-under=90\` to pytest in CI to enforce high test coverage quality gates across pull requests.'
  },
  {
    id: 7,
    title: 'Containerization: Multi-Stage Docker Build',
    duration: '05:30',
    sceneTitle: 'Scene 7: Production Containerization: Multi-Stage Build with uv',
    sdlcStage: 'SDLC Step 7 of 8: Containerization',
    sdlcPhaseName: 'Containerization',
    description:
      'Build an ultra-lean multi-stage Docker image using Astral\'s official uv container image and Debian Bookworm slim. The resulting image weighs under 120MB, pre-compiles bytecode Ahead-of-Time, and runs as an unprivileged user.',
    csharpParallel: {
      concept: 'Containerization & Multi-Stage Docker',
      dotnetEquivalent: 'FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build ... FROM mcr.microsoft.com/dotnet/aspnet:8.0',
      keyDifference:
        'C# compiles to intermediate assemblies (.dll) or native AOT. uv caches Python wheels across layers, compiling bytecodes (.pyc) Ahead-of-Time in the build stage to maximize container startup performance.'
    },
    terminalCommands: [
      {
        cmd: 'docker build -t taskflow-api:latest .',
        output: [
          '[+] Building 4.8s (13/13) FINISHED',
          ' => [internal] load build definition from Dockerfile',
          ' => [builder 2/4] COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv',
          ' => [builder 3/4] COPY pyproject.toml uv.lock ./',
          ' => [builder 4/4] RUN uv sync --frozen --no-install-project --no-dev --compile-bytecode',
          ' => [runner 3/5] COPY --from=builder /app/.venv /app/.venv',
          ' => [runner 4/5] COPY ./app /app/app',
          ' => [runner 5/5] USER appuser',
          ' => exporting to image (114 MB)',
          ' => naming to docker.io/library/taskflow-api:latest'
        ]
      }
    ],
    activeFile: 'Dockerfile',
    language: 'dockerfile',
    fileContent: `# syntax=docker/dockerfile:1
# -------------------------------------------------------------
# Stage 1: Build & Dependency Resolution
# -------------------------------------------------------------
FROM ghcr.io/astral-sh/uv:0.4-python3.12-bookworm-slim AS builder

WORKDIR /app

# Enable bytecode compilation for instantaneous container startup
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Copy dependency files first to maximize Docker cache utilization
COPY pyproject.toml uv.lock ./

# Install production dependencies without development packages
RUN --mount=type=cache,target=/root/.cache/uv \\
    uv sync --frozen --no-install-project --no-dev

# -------------------------------------------------------------
# Stage 2: Minimal Production Runtime
# -------------------------------------------------------------
FROM python:3.12-slim-bookworm AS runner

WORKDIR /app

# Create a non-root system user for security hardening (CIS Docker Benchmark)
RUN groupadd -r appgroup && useradd -r -g appgroup -s /bin/false appuser

# Copy virtual environment from builder
COPY --from=builder --chown=appuser:appgroup /app/.venv /app/.venv
COPY --chown=appuser:appgroup ./app /app/app

# Ensure virtualenv binaries are prioritized on PATH
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

USER appuser

EXPOSE 8000

# Healthcheck for orchestration platforms (Kubernetes / Cloud Run)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/live')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--no-access-log"]`,
    keyTakeaways: [
      'Multi-stage Docker builds isolate the uv build tool from the final production runner image.',
      '\`UV_COMPILE_BYTECODE=1\` pre-compiles all \`.py\` files into \`.pyc\` bytecode, eliminating cold-start latency.',
      'Running as a non-root user (\`USER appuser\`) satisfies enterprise security and CIS Docker benchmarks.'
    ],
    proTip:
      'In production on Linux containers, consider Granian (a high-performance HTTP server written in Rust) as a drop-in replacement for Uvicorn for 2-3x higher RPS throughput.'
  },
  {
    id: 8,
    title: 'Production Deployment & Observability (Final Step)',
    duration: '06:15',
    sceneTitle: 'Scene 8: Production Deployment, Health Probes & Observability (Final SDLC Step)',
    sdlcStage: 'SDLC Step 8 of 8: Final Step of SDLC (Production & Monitoring)',
    sdlcPhaseName: 'Production & Observability',
    description:
      'The culmination and final step of the SDLC! Deploy the containerized microservice to production, configure Kubernetes/Cloud Run liveness (/health/live) and readiness (/health/ready) probes, enable Prometheus metrics (/metrics), and configure structured JSON logging with correlation IDs. Verify zero-downtime health status and system telemetry in real time.',
    csharpParallel: {
      concept: 'Production Hosting, HealthChecks & Telemetry',
      dotnetEquivalent: 'app.MapHealthChecks("/health/ready") + OpenTelemetry Serilog structured logging',
      keyDifference:
        'FastAPI combined with Uvicorn/Granian exposes ASGI asynchronous health endpoints that query DB connectivity non-blockingly without thread-pool starvation.'
    },
    terminalCommands: [
      {
        cmd: 'docker run -d -p 8000:8000 --name taskflow-prod taskflow-api:latest',
        output: [
          '5a7e3241bbf8923a45c08831e6fa001712a3d',
          'Production container started successfully on port 8000',
          'Ready for Kubernetes Ingress / Google Cloud Run traffic'
        ]
      },
      {
        cmd: 'curl -s http://localhost:8000/health/ready | jq',
        output: [
          '{',
          '  "status": "ready",',
          '  "database": "connected",',
          '  "latency_ms": 0.82,',
          '  "version": "0.1.0",',
          '  "environment": "production"',
          '}'
        ]
      },
      {
        cmd: 'curl -s http://localhost:8000/metrics | head -n 6',
        output: [
          '# HELP http_requests_total Total number of HTTP requests processed',
          '# TYPE http_requests_total counter',
          'http_requests_total{method="GET",handler="/health/ready",status="200"} 1',
          '# HELP db_connection_pool_active Active connection count',
          '# TYPE db_connection_pool_active gauge',
          'db_connection_pool_active 2'
        ]
      }
    ],
    activeFile: 'app/observability.py',
    language: 'python',
    fileContent: `import time
from fastapi import APIRouter, status, Response
from sqlalchemy import text
from app.database import AsyncSessionLocal
from app.config import settings

router = APIRouter(prefix="/health", tags=["Observability & Health"])

@router.get("/live", status_code=status.HTTP_200_OK)
async def liveness_probe():
    """Kubernetes liveness probe: indicates if the process is alive."""
    return {"status": "alive", "timestamp": time.time()}

@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_probe(response: Response):
    """Kubernetes readiness probe: asserts downstream database connectivity."""
    start_time = time.perf_counter()
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        latency = round((time.perf_counter() - start_time) * 1000, 2)
        return {
            "status": "ready",
            "database": "connected",
            "latency_ms": latency,
            "version": "0.1.0",
            "environment": settings.ENVIRONMENT
        }
    except Exception as exc:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(exc)
        }`,
    keyTakeaways: [
      'Liveness (/health/live) checks whether the ASGI container process should be restarted.',
      'Readiness (/health/ready) checks whether downstream database connection pools are responsive.',
      'Clean separation between health probes guarantees zero-downtime rolling deploys in Kubernetes and Cloud Run.'
    ],
    proTip:
      'In production, expose \`/metrics\` to Prometheus scrapers inside your internal cluster network, shielded from public internet ingress.'
  }
];
