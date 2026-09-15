import { AdvancedConceptLecture } from '../types';

export const ADVANCED_CONCEPT_LECTURES: AdvancedConceptLecture[] = [
  {
    id: 'clean-architecture',
    title: 'Clean Architecture & Domain-Driven Design in Python',
    subtitle: 'Structuring enterprise-grade backends with Ports and Adapters, Protocols, and SQLAlchemy 2.0',
    industryRelevance: 'Essential for microservices and mission-critical enterprise systems to isolate business rules from database or framework churn.',
    csharpCounterpart: 'ASP.NET Core Clean Architecture templates, MediatR, EF Core Repositories, and Onion Architecture.',
    modules: [
      {
        heading: '1. The Four Concentric Layers',
        body: `Coming from C#, you are familiar with separating Domain, Application (Use Cases), Infrastructure, and Presentation. In Python, this exact separation is achieved cleanly without excessive interface projects:
- **Domain Layer**: Pure dataclasses, domain entities, value objects, and domain exceptions. Zero third-party dependencies (no ORMs, no web frameworks).
- **Application Layer**: Use case orchestrators (command/query handlers) interacting strictly with abstract storage contracts defined as \`typing.Protocol\`.
- **Infrastructure Layer**: Concrete implementations of protocols using SQLAlchemy 2.0 (async session), Redis, Kafka, or AWS Boto3.
- **Presentation Layer**: FastAPI or Litestar controllers converting HTTP JSON payloads via Pydantic schemas into domain commands.`
      },
      {
        heading: '2. Domain Modeling with Pure Dataclasses',
        body: 'Keep the domain completely decoupled from database schema decorators. In Python 3.10+, domain entities use slotted dataclasses with business invariant validation in `__post_init__`:',
        codeExample: {
          language: 'python',
          caption: 'Domain Entity and Custom Exception',
          python: `from dataclasses import dataclass
from datetime import datetime
import uuid

class DomainError(Exception): """Base for business errors"""
class InsufficientFundsError(DomainError): pass

@dataclass(slots=True)
class Account:
    account_id: uuid.UUID
    owner_email: str
    balance: float
    is_active: bool = True
    created_at: datetime = datetime.utcnow()

    def withdraw(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if not self.is_active:
            raise DomainError("Account is inactive")
        if self.balance < amount:
            raise InsufficientFundsError(f"Balance {self.balance} < requested {amount}")
        self.balance -= amount`
        }
      },
      {
        heading: '3. Protocol-Based Inversion of Control (Ports)',
        body: 'Instead of creating a separate `Interfaces.csproj` assembly, define a structural Protocol port in the application layer. Any infrastructure repository satisfying the protocol can be plugged in without explicit inheritance:',
        codeExample: {
          language: 'python',
          caption: 'Application Port and Use Case Service',
          python: `from typing import Protocol
import uuid

class AccountRepository(Protocol):
    """Output Port (Boundary contract)"""
    async def get_by_id(self, account_id: uuid.UUID) -> Account | None: ...
    async def update(self, account: Account) -> None: ...

class WithdrawFundsUseCase:
    """Application Service orchestrating business workflow"""
    def __init__(self, repo: AccountRepository):
        self._repo = repo

    async def execute(self, account_id: uuid.UUID, amount: float) -> Account:
        account = await self._repo.get_by_id(account_id)
        if not account:
            raise ValueError("Account not found")
        
        # Pure domain business logic executes here
        account.withdraw(amount)
        
        # Persist updated state
        await self._repo.update(account)
        return account`
        },
        callout: {
          type: 'insight',
          text: 'Notice that WithdrawFundsUseCase can be tested in 0.001 seconds using a simple in-memory dictionary fake repository without starting Docker or spinning up databases!'
        }
      }
    ]
  },
  {
    id: 'pydantic-di',
    title: 'Modern Validation & Dependency Injection: Pydantic v2 & FastAPI',
    subtitle: 'High-speed Rust-backed validation and hierarchical dependency graphs',
    industryRelevance: 'Pydantic v2 is downloaded over 100M times monthly, powering FastAPI, LangChain, and OpenAI SDKs. It is the de facto standard for contract validation.',
    csharpCounterpart: 'FluentValidation, System.Text.Json, and Microsoft.Extensions.DependencyInjection (IServiceCollection).',
    modules: [
      {
        heading: '1. Pydantic v2: Rust-Core Performance',
        body: `In Pydantic v1, parsing large JSON documents in pure Python was a known bottleneck. Pydantic v2 rebuilt its core serialization and validation engine entirely in Rust (\`pydantic-core\`), making it 5x–50x faster.
Unlike C# where deserialization and validation are often separate steps (JSON serializer + FluentValidation), Pydantic unifies both: data is parsed, coerced, and validated in a single zero-copy pass.`
      },
      {
        heading: '2. Schema Definition and Custom Validators',
        body: 'Pydantic models declare types using standard Python annotations, with field constraints and custom validators:',
        codeExample: {
          language: 'python',
          caption: 'Pydantic v2 Schema with Field Constraints',
          python: `from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import date

class UserRegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=30, pattern="^[a-zA-Z0-9_]+$")
    birth_date: date
    tier: str = Field(default="standard")

    @field_validator("birth_date")
    @classmethod
    def validate_age(cls, v: date) -> date:
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 18:
            raise ValueError("User must be at least 18 years old")
        return v

# Automatically validates incoming HTTP payloads:
payload = {"email": "dev@company.com", "username": "aditya_r", "birth_date": "1995-04-12"}
user = UserRegisterRequest.model_validate(payload)
print(user.email)  # Strongly-typed accessor`
        }
      },
      {
        heading: '3. Dependency Injection in FastAPI (Depends)',
        body: 'FastAPI provides a built-in hierarchical dependency injection system using `Depends()`. It handles lifecycle management (scoped dependencies, database session cleanup) automatically via generator yields:',
        codeExample: {
          language: 'python',
          caption: 'FastAPI Scoped Dependency Injection',
          python: `from fastapi import FastAPI, Depends, HTTPException, status
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

app = FastAPI()

# Database session provider with auto-cleanup (like Scoped in C# DI)
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

# Composable security dependency
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    user = await verify_jwt_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user

@app.post("/accounts/transfer")
async def transfer_money(
    req: TransferRequest,
    user: User = Depends(get_current_user),      # Injected user
    db: AsyncSession = Depends(get_db_session)    # Injected DB session
):
    return await execute_transfer(db, user, req)`
        }
      }
    ]
  },
  {
    id: 'concurrency-uvloop',
    title: 'High-Throughput Concurrency & CPU Parallelism',
    subtitle: 'Mastering asyncio, uvloop, ProcessPoolExecutor, and C-extension offloading',
    industryRelevance: 'Solving the classic enterprise dilemma: how to scale Python to 100,000 requests/sec despite the GIL.',
    csharpCounterpart: 'ThreadPool starvation prevention, Task.Run(), SIMD Vector<T>, and P/Invoke.',
    modules: [
      {
        heading: '1. The Two Concurrency Modes in Python',
        body: `C# developers are accustomed to running both I/O and CPU work on ThreadPool threads. In Python, you must deliberately classify the workload:
1. **I/O-Bound Work (Network APIs, DB queries, Microservice calls)**:
   - Use **asyncio** with an ASGI server.
   - Install **uvloop** (drop-in replacement for the default asyncio event loop, written in C on top of Node's \`libuv\`). It delivers throughput competitive with Node.js and Go.
2. **CPU-Bound Work (Cryptography, heavy JSON hashing, data transformation)**:
   - Python threads CANNOT parallelize CPU work due to the CPython GIL.
   - Solution: Use **multiprocessing** or **concurrent.futures.ProcessPoolExecutor** to spawn isolated worker processes with independent memory spaces and separate GILs.`
      },
      {
        heading: '2. Hybrid Async & ProcessPool Architecture',
        body: 'Here is how production systems handle heavy CPU computations without blocking incoming async HTTP traffic:',
        codeExample: {
          language: 'python',
          caption: 'Non-blocking CPU execution within an Async API',
          python: `import asyncio
from concurrent.futures import ProcessPoolExecutor
import hashlib
import os

# Heavy CPU-bound function (pure math/hashing)
def cpu_heavy_hash(data: str, iterations: int = 500_000) -> str:
    salt = b"salt_key"
    key = hashlib.pbkdf2_hmac("sha256", data.encode(), salt, iterations)
    return key.hex()

# Global process pool shared across the service
process_pool = ProcessPoolExecutor(max_workers=os.cpu_count())

async def hash_api_endpoint(user_input: str) -> str:
    loop = asyncio.get_running_loop()
    
    # Offload CPU work to separate OS process in the pool.
    # The async event loop remains 100% responsive to other users!
    result = await loop.run_in_executor(
        process_pool, 
        cpu_heavy_hash, 
        user_input
    )
    return result`
        },
        callout: {
          type: 'warning',
          text: 'ProcessPoolExecutor pickles arguments and return values to send them across process boundaries. Ensure data passed into the pool is serializable (plain dicts, strings, ints, or tuples).'
        }
      }
    ]
  },
  {
    id: 'servers-wsgi-asgi',
    title: 'Application Servers: WSGI vs ASGI vs Kestrel',
    subtitle: 'Understanding the web gateway protocol layer and production deployment topologies',
    industryRelevance: 'Every Python web backend deployed on Kubernetes, Cloud Run, or AWS ECS relies on WSGI or ASGI.',
    csharpCounterpart: 'ASP.NET Core Kestrel web server, IIS reverse proxy, and HttpContext pipeline.',
    modules: [
      {
        heading: '1. The Python Web Gateway Standards',
        body: `In .NET, Kestrel is the built-in HTTP server that runs your code. In Python, web frameworks do not ship built-in HTTP socket servers for production. Instead, Python relies on standardized gateway specifications:
- **WSGI (Web Server Gateway Interface - PEP 3333)**: Synchronous specification created in 2003. One request maps to one thread/worker. Used by Flask, Django (classic). Powered by **Gunicorn** or **uWSGI**.
- **ASGI (Asynchronous Server Gateway Interface)**: Modern asynchronous successor created in 2018. Supports HTTP/2, WebSockets, long-polling, and async/await streaming. Used by FastAPI, Starlette, Litestar, Django Channels. Powered by **Uvicorn** or **Hypercorn**.`
      },
      {
        heading: '2. Production Deployment Topology',
        body: 'The standard production deployment pattern for Python web services involves a multi-process supervisor managing asynchronous event loops:',
        codeExample: {
          language: 'python',
          caption: 'Gunicorn managing multiple Uvicorn worker processes',
          python: `# Production CLI command to start high-concurrency API:
# gunicorn main:app \\
#   --workers 4 \\                  # (2 x CPU cores) worker processes
#   --worker-class uvicorn.workers.UvicornWorker \\  # ASGI async workers
#   --bind 0.0.0.0:8000 \\
#   --timeout 30 \\
#   --access-logfile - \\
#   --error-logfile -

# Architecture:
# [ Nginx / Cloud Load Balancer ]
#               │
#      [ Gunicorn Master Process ]  (Process supervisor & health checks)
#         ┌─────┼─────┬─────┐
#         ▼     ▼     ▼     ▼
#      [Uvicorn Worker 1..4]  (Each running uvloop async event loop)`
        }
      }
    ]
  },
  {
    id: 'observability-structlog',
    title: 'Production Observability: Structlog & Profiling',
    subtitle: 'High-performance structured JSON logging, tracing with OpenTelemetry, and memory leak detection',
    industryRelevance: 'Essential for Datadog, Grafana Loki, CloudWatch, and distributed microservices debugging.',
    csharpCounterpart: 'Serilog with JSON enrichers, OpenTelemetry .NET SDK, and dotnet-trace / dotnet-dump.',
    modules: [
      {
        heading: '1. Structured Logging with structlog',
        body: 'Standard `logging` in Python emits plain text strings by default. Enterprise systems adopt `structlog` to emit structured JSON with correlation IDs, timestamps, and contextual metadata:',
        codeExample: {
          language: 'python',
          caption: 'Configuring structlog for JSON production output',
          python: `import structlog
import time

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer() # Emits pure JSON lines
    ]
)

logger = structlog.get_logger()

def process_order(order_id: str, user_id: int):
    # Contextual structured log
    log = logger.bind(order_id=order_id, user_id=user_id)
    log.info("order_processing_started", step="inventory_check")
    
    # Output: {"event": "order_processing_started", "level": "info", 
    #          "order_id": "ORD-99", "user_id": 42, "step": "inventory_check", 
    #          "timestamp": "2026-09-10T23:30:00Z"}`
        }
      },
      {
        heading: '2. Profiling with py-spy and tracemalloc',
        body: `When diagnosing performance bottlenecks:
- **cProfile**: Built-in deterministic function profiler. Great for local benchmarking.
- **py-spy**: Sampling profiler written in Rust that can inspect a running Python process without restarting or modifying code (similar to dotnet-trace). Generates flamegraphs.
- **tracemalloc**: Built-in memory allocation tracer to find memory leaks and pinpoint exact source code lines holding references.`
      }
    ]
  },
  {
    id: 'testing-pytest',
    title: 'Enterprise Testing: Pytest Mastery vs xUnit',
    subtitle: 'Fixtures, parameterization, monkeypatching, and property-based testing with Hypothesis',
    industryRelevance: 'Pytest is universally regarded as one of the best testing frameworks in any programming language.',
    csharpCounterpart: 'xUnit / NUnit with Moq, AutoFixture, and FluentAssertions.',
    modules: [
      {
        heading: '1. Unlearning the xUnit Class Paradigm',
        body: `In C#, tests are methods inside classes (\`[Fact] public void TestUserCreation()\`). In Pytest, tests are plain standalone functions prefixed with \`test_\`.
Instead of inheritance or constructor injection for test setup, Pytest uses **Fixtures** with dependency injection. Fixtures can have scopes (\`function\`, \`class\`, \`module\`, \`session\`) and clean up using \`yield\`:`
      },
      {
        heading: '2. Pytest Fixtures & Parametrize',
        body: 'Observe how clean and readable tests become without boilerplate setup/teardown classes:',
        codeExample: {
          language: 'python',
          caption: 'Pytest Fixture with Yield Cleanup and @pytest.mark.parametrize',
          python: `import pytest
from typing import Generator

# Fixture acts as setup + teardown
@pytest.fixture
def mock_db() -> Generator[dict, None, None]:
    db = {"users": [{"id": 1, "name": "Aditya"}]}
    print("\\n[Setup] DB initialized")
    yield db  # Test executes with this value
    print("\\n[Teardown] DB cleared")
    db.clear()

# Parameterized test (like [Theory] [InlineData] in xUnit)
@pytest.mark.parametrize("amount,expected_valid", [
    (10.0, True),
    (0.0, False),
    (-5.0, False),
    (999.99, True),
])
def test_validate_payment(amount: float, expected_valid: bool):
    is_valid = validate_transaction(amount)
    assert is_valid == expected_valid  # Plain Python assert!`
        },
        callout: {
          type: 'insight',
          text: 'Notice that Pytest uses the plain Python `assert` keyword! Pytest rewrites the AST before execution so failed assertions print rich diffs showing exact operand values without needing special assertion libraries.'
        }
      }
    ]
  }
];
