export interface ProjectStep {
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

export interface ProjectFile {
  filename: string;
  path: string;
  category: 'config' | 'api' | 'data' | 'tests' | 'docker';
  content: string;
  summary: string;
}

export { WEB_APP_STEPS } from './webAppSdlcSteps';

export const WEB_APP_ALL_FILES: ProjectFile[] = [
  {
    filename: '.vscode/settings.json',
    path: '.vscode/settings.json',
    category: 'config',
    summary: 'Workstation IDE settings for automatic formatting with Ruff and strict Pyright typing.',
    content: `{
  "python.defaultInterpreterPath": "\${workspaceFolder}/.venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  },
  "python.analysis.typeCheckingMode": "strict",
  "python.analysis.autoImportCompletions": true
}`
  },
  {
    filename: 'pyproject.toml',
    path: 'pyproject.toml',
    category: 'config',
    summary: 'Root project manifest declaring Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic, and Ruff.',
    content: `[project]
name = "taskflow-api"
version = "0.1.0"
description = "Production ASGI Task Management Microservice"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.115.0",
    "sqlalchemy[asyncio]>=2.0.35",
    "asyncpg>=0.29.0",
    "pydantic>=2.9.2",
    "pydantic-settings>=2.5.2",
    "alembic>=1.13.3",
]

[dependency-groups]
dev = [
    "pytest>=8.3.3",
    "pytest-asyncio>=0.24.0",
    "httpx>=0.27.2",
    "aiosqlite>=0.20.0",
    "ruff>=0.6.9",
    "mypy>=1.11.0",
]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]`
  },
  {
    filename: 'config.py',
    path: 'app/config.py',
    category: 'config',
    summary: 'Environment configuration with Pydantic Settings (replaces C# IConfiguration & appsettings.json).',
    content: `from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Strongly typed application configuration from environment variables."""
    PROJECT_NAME: str = "TaskFlow Enterprise API"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite+aiosqlite:///./taskflow.db"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Reads from .env file if present
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()`
  },
  {
    filename: 'database.py',
    path: 'app/database.py',
    category: 'data',
    summary: 'Async engine and AsyncSession factory with Dependency Injection yield lifecycle.',
    content: `from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency provider for database session with automatic cleanup."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()`
  },
  {
    filename: 'models/task.py',
    path: 'app/models/task.py',
    category: 'data',
    summary: 'SQLAlchemy 2.0 declarative database entity definition with Mapped types.',
    content: `from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import String, Text, DateTime, Enum as SQLEnum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
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
    )`
  },
  {
    filename: 'schemas/task.py',
    path: 'app/schemas/task.py',
    category: 'api',
    summary: 'Pydantic v2 DTO schemas with field validation rules (replaces FluentValidation & C# DTOs).',
    content: `from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.task import TaskStatus, TaskPriority

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Task headline title")
    description: str | None = Field(None, max_length=2000, description="Detailed description")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None

class TaskRead(TaskBase):
    id: int
    status: TaskStatus
    created_at: datetime
    updated_at: datetime

    # Enable ORM serialization from SQLAlchemy TaskItem object
    model_config = ConfigDict(from_attributes=True)`
  },
  {
    filename: 'routers/tasks.py',
    path: 'app/routers/tasks.py',
    category: 'api',
    summary: 'FastAPI controller router with dependency injection, querying, and error handling.',
    content: `from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.task import TaskItem, TaskStatus
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

DbSession = Annotated[AsyncSession, Depends(get_db)]

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreate, db: DbSession) -> TaskItem:
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
    query = select(TaskItem).offset(offset).limit(limit)
    if status_filter:
        query = query.where(TaskItem.status == status_filter)
    result = await db.execute(query)
    return list(result.scalars().all())

@router.get("/{task_id}", response_model=TaskRead)
async def get_task(task_id: int, db: DbSession) -> TaskItem:
    task = await db.get(TaskItem, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return task

@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(task_id: int, payload: TaskUpdate, db: DbSession) -> TaskItem:
    task = await db.get(TaskItem, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
        
    await db.commit()
    await db.refresh(task)
    return task`
  },
  {
    filename: 'main.py',
    path: 'app/main.py',
    category: 'api',
    summary: 'ASGI root application entry point with lifespan events and CORS middleware.',
    content: `from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import tasks

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: e.g. initialize connection pools
    yield
    # Shutdown: gracefully close database engines
    from app.database import engine
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "version": "0.1.0", "environment": settings.ENVIRONMENT}`
  },
  {
    filename: '.github/workflows/ci.yml',
    path: '.github/workflows/ci.yml',
    category: 'config',
    summary: 'CI/CD pipeline with GitHub Actions executing Ruff, strict Mypy, and Pytest matrix.',
    content: `name: Enterprise CI Pipeline

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
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v3
        with:
          version: "latest"
          enable-cache: true
      - run: uv python install \${{ matrix.python-version }}
      - run: uv sync --frozen
      - run: uv run ruff check .
      - run: uv run mypy app/ --strict
      - run: uv run pytest tests/ -v --cov=app`
  },
  {
    filename: 'observability.py',
    path: 'app/observability.py',
    category: 'api',
    summary: 'Production Kubernetes liveness and readiness health check probes with DB latency check.',
    content: `import time
from fastapi import APIRouter, status, Response
from sqlalchemy import text
from app.database import AsyncSessionLocal
from app.config import settings

router = APIRouter(prefix="/health", tags=["Observability & Health"])

@router.get("/live", status_code=status.HTTP_200_OK)
async def liveness_probe():
    return {"status": "alive", "timestamp": time.time()}

@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_probe(response: Response):
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
        }`
  },
  {
    filename: 'Dockerfile',
    path: 'Dockerfile',
    category: 'docker',
    summary: 'Multi-stage Dockerfile leveraging uv cache for fast builds and hardened non-root execution.',
    content: `FROM ghcr.io/astral-sh/uv:0.4-python3.12-bookworm-slim AS builder

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \\
    uv sync --frozen --no-install-project --no-dev

FROM python:3.12-slim-bookworm AS runner

WORKDIR /app
RUN groupadd -r appgroup && useradd -r -g appgroup -s /bin/false appuser

COPY --from=builder --chown=appuser:appgroup /app/.venv /app/.venv
COPY --chown=appuser:appgroup ./app /app/app

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

USER appuser
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`
  }
];
