import { DeepDiveFeature } from '../types';

export interface WebVerdictPoint {
  id: string;
  claim: string;
  reality: string;
}

export const WEB_FRAMEWORKS_VERDICT =
  'FastAPI is not "Flask with types bolted on" — it\'s built on ASGI (Starlette) and Pydantic, making async request handling and runtime request/response validation first-class, in the same way ASP.NET Core makes middleware pipelines and model binding first-class.';

export const WEB_FRAMEWORKS_VERDICT_POINTS: WebVerdictPoint[] = [
  {
    id: 'asgi-vs-wsgi',
    claim: '"Is ASGI just Python\'s version of Kestrel?"',
    reality:
      "WSGI (Flask/Django’s classic protocol) is a synchronous, one-request-per-thread contract — structurally close to classic ASP.NET's synchronous pipeline. ASGI is the async successor: a single worker can hold thousands of concurrent connections open (WebSockets, SSE streams, long-polling) the same way Kestrel's async pipeline does, without one OS thread pinned per connection."
  },
  {
    id: 'pydantic-vs-model-binding',
    claim: '"How does FastAPI validation compare to ASP.NET Core model binding?"',
    reality:
      'FastAPI reads a function’s Python type hints on its parameters and uses Pydantic to parse, validate, and coerce the incoming JSON body against them at request time — raising a structured 422 on mismatch. This is functionally identical to ASP.NET Core binding a JSON body to a C# DTO class annotated with `[Required]`/data-annotation attributes; FastAPI just derives the "DTO" from ordinary type hints instead of a dedicated model class with attributes.'
  },
  {
    id: 'orm-philosophy',
    claim: '"Is SQLAlchemy just EF Core with different syntax?"',
    reality:
      "SQLAlchemy's Core (a SQL expression builder) plus its ORM layer map closely to EF Core's LINQ-to-Entities plus its change-tracking `DbContext`. The philosophical difference: SQLAlchemy exposes its query-building layer (`select()`, `Table`) as a genuinely separate, usable-standalone tool from its ORM layer, whereas EF Core's LINQ provider and change tracking are more tightly fused into one API surface."
  },
  {
    id: 'wsgi-servers',
    claim: '"Why do Python web apps need a separate app server AND a reverse proxy?"',
    reality:
      'Gunicorn/Uvicorn (the ASGI/WSGI application servers) run your Python app; Nginx or a cloud load balancer sits in front for TLS termination, static file serving, and buffering slow clients — a two-tier setup ASP.NET Core mirrors almost exactly with Kestrel behind an IIS/Nginx reverse proxy for the same reasons (Kestrel is explicitly documented as not hardened for direct internet exposure).'
  }
];

export const WEB_FRAMEWORKS_CONCEPTS: DeepDiveFeature[] = [
  {
    id: 'fastapi-di',
    number: 1,
    title: 'FastAPI Dependency Injection via Function Defaults',
    tagline: 'DI expressed as parameter defaults (`Depends(...)`) instead of a constructor-based container',
    csharpEquivalent: 'ASP.NET Core’s built-in `IServiceCollection` container, injected via constructor parameters',
    whyItMatters: 'ASP.NET Core DI resolves dependencies through class constructors, registered once at startup with a lifetime (`Singleton`/`Scoped`/`Transient`). FastAPI has no classes or startup registration step for this — dependencies are plain functions, declared per-endpoint as a parameter default wrapped in `Depends()`, resolved fresh (or cached per-request via FastAPI’s own request-scoped cache) each call.',
    csharpApproach: 'Register services in `Program.cs` (`builder.Services.AddScoped<IOrderRepository, OrderRepository>()`) and receive them via controller/minimal-API constructor or delegate parameters — the container resolves the full dependency graph.',
    pythonApproach: 'Define a plain function (or a class with `__call__`) that returns the dependency, and reference it via `Depends(get_db_session)` as a parameter default on the route handler — no central registration step exists.',
    csharpCode: `// C#: ASP.NET Core minimal API with constructor/parameter DI
builder.Services.AddScoped<IOrderRepository, SqlOrderRepository>();

app.MapGet("/orders/{id}", async (int id, IOrderRepository repo) =>
{
    var order = await repo.GetByIdAsync(id);
    return order is null ? Results.NotFound() : Results.Ok(order);
});`,
    pythonCode: `from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

app = FastAPI()

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db          # dependency itself is a generator — "yield" is the
    finally:               # injection point; code after yield is teardown
        db.close()

@app.get("/orders/{order_id}")
def read_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=404)
    return order`,
    underTheHood: 'FastAPI inspects each route handler’s signature at *registration* time (via `inspect.signature()`), finds parameters defaulted to `Depends(callable)`, and builds a dependency-resolution tree per request. A `yield`-based dependency (like `get_db` above) is FastAPI’s equivalent of a scoped `IDisposable` service: the code before `yield` runs on request start, the code after `yield` runs on request teardown — no `using`/`IDisposable` needed because generator cleanup semantics stand in for it.',
    pitfalls: [
      'Assuming `Depends(get_db)` reuses one instance across a whole request the way `Scoped` does in ASP.NET Core by default — FastAPI does cache within a single request, but only because the same dependency is referenced with the identical callable; subtly different callables silently create separate instances.',
      'Forgetting the `try/finally` around `yield` in a generator dependency — without it, an exception in the route handler skips cleanup entirely (no equivalent of C#’s guaranteed `using`-block disposal).',
      'Putting expensive setup logic directly in a non-generator `Depends()` function that runs on every single request with no lifetime scoping — there is no built-in `Singleton`-equivalent lifetime; you manage that manually (e.g. a module-level cached object).'
    ],
    bestPractices: [
      'Use generator dependencies (`yield`) for anything needing guaranteed teardown (DB sessions, file handles, locks) — treat the `yield` line as your `using` block boundary.',
      'Compose small, single-purpose dependencies and layer them (`Depends()` inside another `Depends()`) rather than one large dependency function, mirroring the single-responsibility discipline of small registered services.',
      'For anything that should behave like `Singleton` scope, construct it once at module load and inject that shared instance, rather than reconstructing it inside the dependency function on every call.'
    ]
  },
  {
    id: 'pydantic-validation',
    number: 2,
    title: 'Pydantic Models: Runtime-Validated DTOs',
    tagline: 'Type-hint-driven request/response validation and coercion',
    csharpEquivalent: 'C# DTO classes with data-annotation attributes (`[Required]`, `[Range]`), validated by ASP.NET Core model binding',
    whyItMatters: "In ASP.NET Core, a request body is bound to a C# class and validated by data-annotation attributes the *compiler* checks exist on real properties. Pydantic reuses Python's own type-hint syntax for the same job — `age: int = Field(gt=0)` — but because Python type hints are unenforced at runtime by the language itself, Pydantic has to do its own reflection-based coercion and validation pass on every request, which is also why it's usable outside web frameworks entirely (config parsing, CLI argument validation).",
    csharpApproach: 'Define a DTO class with `[Required]`, `[Range(0, 150)]`, `[EmailAddress]` attributes; ASP.NET Core’s model binder validates automatically on `[ApiController]` and returns 400 on failure.',
    pythonApproach: 'Define a `pydantic.BaseModel` subclass with typed fields and `Field(...)` constraints; FastAPI validates automatically against the declared type hint and returns 422 with a structured error body on failure.',
    csharpCode: `// C#: DTO validated via data annotations + [ApiController] auto-400
public class CreateUserRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = "";

    [Range(0, 150)]
    public int Age { get; set; }
}

[HttpPost("/users")]
public IActionResult CreateUser(CreateUserRequest request)
{
    // [ApiController] already rejected invalid input with 400 before this runs
    return Ok(userService.Create(request));
}`,
    pythonCode: `from pydantic import BaseModel, EmailStr, Field

class CreateUserRequest(BaseModel):
    email: EmailStr
    age: int = Field(gt=0, le=150)

@app.post("/users")
def create_user(request: CreateUserRequest):
    # FastAPI already rejected invalid input with a structured 422
    # error body before this function body even runs
    return user_service.create(request)`,
    underTheHood: "Pydantic v2's validation core is written in Rust (`pydantic-core`), compiled once per model class into a validator graph the first time the class is defined — not re-derived on every request. This is architecturally similar to how the CLR JITs a method once and reuses the compiled version: Python pays a one-time model-compilation cost at import time, then validates each request through the pre-built (Rust-speed) validator, closing most of the naive \"Python is slow at validation\" gap.",
    pitfalls: [
      'Relying on Pydantic’s automatic type coercion (`"42"` string silently becomes `int 42`) without realizing it’s enabled by default — C#’s model binder is comparatively stricter about type mismatches by default.',
      'Defining a mutable default like `tags: list[str] = []` directly on a Pydantic field — Pydantic v2 handles this safely per-instance (unlike a raw dataclass), but relying on that safety net without understanding it invites bugs when the same field pattern is used on a plain class.',
      'Forgetting that a Pydantic model used for a *response* still validates outgoing data — a bug that produces an extra unexpected field gets silently stripped rather than erroring, unlike C#’s explicit property-by-property serialization.'
    ],
    bestPractices: [
      'Define separate request and response models even when they overlap heavily (`UserCreate` vs `UserRead`) — the same DTO-per-direction discipline recommended in ASP.NET Core, to avoid leaking internal fields.',
      'Use `Field(..., description=...)` on every field feeding a public API — FastAPI surfaces these directly into the auto-generated OpenAPI/Swagger docs, closer to XML doc comments feeding Swashbuckle.',
      'Validate business rules (cross-field checks) with a Pydantic `@model_validator`, not inside the route handler — keeps the validation layer self-contained and independently testable.'
    ]
  },
  {
    id: 'sqlalchemy-orm',
    number: 3,
    title: 'SQLAlchemy: Core + ORM as Two Layers',
    tagline: 'A standalone SQL expression builder underneath an optional change-tracking ORM',
    csharpEquivalent: 'EF Core’s `DbContext` + LINQ-to-Entities, with Dapper as the closer analogue to SQLAlchemy Core alone',
    whyItMatters: 'EF Core fuses its LINQ query provider and change-tracking `DbContext` into one API. SQLAlchemy deliberately separates "Core" (a SQL expression-building layer you can use with zero ORM concepts, closer to Dapper) from the "ORM" (session-based change tracking, closer to `DbContext`) — you can use Core alone for performance-critical raw-SQL-adjacent code and the ORM layer for everyday CRUD, in the same codebase.',
    csharpApproach: 'Use EF Core’s `DbContext.Set<T>()` with LINQ for typical CRUD and change tracking; drop to raw SQL via `FromSqlRaw` or a separate Dapper query for performance-critical paths.',
    pythonApproach: 'Use SQLAlchemy’s ORM `Session` with declarative models for typical CRUD; drop to SQLAlchemy Core’s `select()`/`Table` expression builder (no ORM session, no change tracking) for performance-critical paths.',
    csharpCode: `// C#: EF Core — change-tracked entity, LINQ query
public class Order
{
    public int Id { get; set; }
    public string Status { get; set; } = "";
    public decimal Total { get; set; }
}

var shipped = await dbContext.Orders
    .Where(o => o.Status == "shipped")
    .OrderByDescending(o => o.Total)
    .Take(10)
    .ToListAsync();

shipped[0].Status = "delivered";   // tracked — no explicit "update" call
await dbContext.SaveChangesAsync();`,
    pythonCode: `from sqlalchemy import select
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

class Base(DeclarativeBase): ...

class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[str]
    total: Mapped[float]

stmt = (
    select(Order)
    .where(Order.status == "shipped")
    .order_by(Order.total.desc())
    .limit(10)
)
shipped = session.scalars(stmt).all()

shipped[0].status = "delivered"   # tracked by the Session, like DbContext
session.commit()`,
    underTheHood: 'Both frameworks use an "identity map" — a per-session/per-`DbContext` cache keyed by primary key, ensuring two queries for the same row return the *same* in-memory object, which is what makes in-place attribute mutation (`shipped[0].status = ...`) trackable without an explicit `.Update()` call. SQLAlchemy’s `select()` statement object is itself immutable and composable (each `.where()` returns a *new* statement, mirroring LINQ’s deferred, chainable query building) rather than mutating the query object in place.',
    pitfalls: [
      'Accessing a lazily-loaded relationship attribute outside an active session (`DetachedInstanceError`) — the direct Python analogue of EF Core’s "context has been disposed" exception when lazy-loading a navigation property after `using` scope ends.',
      'Triggering the N+1 query problem via implicit lazy-loaded relationships in a loop — identical root cause to EF Core’s classic N+1, fixed the same way: eager-load with `.options(selectinload(Order.lines))` (SQLAlchemy) or `.Include()` (EF Core).',
      'Forgetting `session.commit()` — unlike some ORMs, SQLAlchemy tracks changes but never auto-flushes to the database without an explicit commit (or autoflush-triggering query) inside the current transaction.'
    ],
    bestPractices: [
      'Eager-load known-needed relationships explicitly (`selectinload`/`joinedload`) rather than relying on lazy loading in any code path that runs in a loop.',
      'Scope a `Session` per request/unit-of-work (via FastAPI’s `Depends(get_db)` generator pattern), mirroring `DbContext`’s typical per-request lifetime.',
      'Reach for SQLAlchemy Core’s `select()` directly (skip the ORM entity mapping) for reporting/analytics queries that don’t need change tracking — avoids identity-map overhead for read-only bulk data.'
    ]
  },
  {
    id: 'background-tasks',
    number: 4,
    title: 'Background Work: BackgroundTasks & Celery vs Hosted Services',
    tagline: 'In-process fire-and-forget vs a distributed task queue, mapped against .NET’s equivalents',
    csharpEquivalent: '`IHostedService`/`BackgroundService` for in-process work; Hangfire/Azure Service Bus + worker for distributed queues',
    whyItMatters: 'FastAPI’s `BackgroundTasks` runs a function after the response is sent, on the same process — the direct match for a short-lived `IHostedService`-triggered task, not a durable queue. For work that must survive a process restart or scale across multiple machines, Python reaches for Celery (backed by Redis/RabbitMQ), the ecosystem’s equivalent of Hangfire or Azure Service Bus-triggered Functions.',
    csharpApproach: 'Use `IHostedService`/`BackgroundService` for lightweight in-process background work; adopt Hangfire (or a message-broker-backed worker) for durable, distributed, retryable jobs.',
    pythonApproach: 'Use FastAPI’s `BackgroundTasks` parameter for lightweight in-process, fire-and-forget work; adopt Celery with a Redis/RabbitMQ broker for durable, distributed, retryable jobs.',
    csharpCode: `// C#: Hangfire — durable, retryable, persisted job queue
public IActionResult SendWelcomeEmail(int userId)
{
    BackgroundJob.Enqueue<IEmailService>(svc => svc.SendWelcome(userId));
    return Accepted();
}
// Job survives process restarts, retries automatically on failure —
// backed by a persistent store (SQL Server/Redis), not just in-memory.`,
    pythonCode: `from celery import Celery

celery_app = Celery("worker", broker="redis://localhost:6379/0")

@celery_app.task(bind=True, max_retries=3)
def send_welcome_email(self, user_id: int):
    try:
        email_service.send_welcome(user_id)
    except TransientError as exc:
        raise self.retry(exc=exc, countdown=30)

@app.post("/users/{user_id}/welcome")
def trigger_welcome(user_id: int):
    send_welcome_email.delay(user_id)   # enqueued on Redis, run by a
    return {"status": "queued"}          # separate celery worker process`,
    underTheHood: 'FastAPI `BackgroundTasks` literally just appends a callable to a list attached to the `Response` object, which Starlette runs via `await task()` right after the response body has been sent on the *same* process — no persistence, no retry, gone forever if the process crashes first. Celery, by contrast, serializes the task call and its arguments onto a message broker (Redis/RabbitMQ), where one or more entirely separate `celery worker` OS processes pull and execute it — architecturally the same separation of concerns as an ASP.NET Core web app enqueuing a message for a distinct Azure Function or Hangfire worker process to consume.',
    pitfalls: [
      'Using `BackgroundTasks` for anything that must survive a deploy/restart or absolutely must run (payment confirmation emails, webhook delivery) — it has zero durability guarantees, unlike Hangfire’s persisted job store.',
      'Running Celery workers without `bind=True` + explicit `retry()` handling and assuming transient failures (a flaky downstream API) are retried automatically — Celery requires opting into retry logic per task.',
      'Sending large or non-JSON-serializable objects as Celery task arguments — arguments are serialized (JSON by default) onto the broker, so passing e.g. a live DB session object silently fails or misbehaves.'
    ],
    bestPractices: [
      'Default to Celery (or an equivalent durable queue) for anything with a business consequence if it’s silently dropped; reserve `BackgroundTasks` for genuinely best-effort work (cache warming, analytics pings).',
      'Pass IDs, not objects, as task arguments (`send_welcome_email.delay(user_id)`, not the full `User` object) — the worker re-fetches fresh state, avoiding stale/unserializable data.',
      'Configure `acks_late=True` + idempotent task logic for anything where "ran twice" is safer than "ran zero times," mirroring at-least-once delivery semantics common to Azure Service Bus/SQS consumers.'
    ]
  }
];

export interface WebFrameworkTool {
  id: string;
  tool: string;
  role: string;
  csharpAnalogue: string;
}

export const WEB_FRAMEWORK_TOOLS: WebFrameworkTool[] = [
  { id: 'fastapi', tool: 'FastAPI', role: 'Async-first web framework: automatic OpenAPI docs, Pydantic-driven validation, dependency injection.', csharpAnalogue: 'ASP.NET Core Minimal APIs — the closest structural match (route-function-centric, built-in OpenAPI/Swagger).' },
  { id: 'django', tool: 'Django', role: 'Batteries-included, convention-driven full framework: built-in ORM, admin panel, auth, forms.', csharpAnalogue: 'ASP.NET Core MVC with EF Core — similarly opinionated, "everything included" full-stack framework.' },
  { id: 'uvicorn', tool: 'Uvicorn / Gunicorn', role: 'ASGI/WSGI application servers that actually run the Python app process(es).', csharpAnalogue: 'Kestrel — the in-process web server ASP.NET Core apps run on by default.' },
  { id: 'alembic', tool: 'Alembic', role: 'SQLAlchemy’s schema migration tool: auto-generates and applies versioned migration scripts.', csharpAnalogue: 'EF Core Migrations (`dotnet ef migrations add`) — near-identical workflow and purpose.' },
  { id: 'pytest-fastapi', tool: 'httpx.TestClient / pytest', role: 'In-process ASGI test client for hitting FastAPI routes directly in tests, no real network socket.', csharpAnalogue: '`WebApplicationFactory<T>` + `HttpClient` in ASP.NET Core’s integration testing.' },
  { id: 'nginx', tool: 'Nginx / Traefik', role: 'Reverse proxy in front of Uvicorn/Gunicorn workers: TLS termination, load balancing, static files.', csharpAnalogue: 'IIS or Nginx in front of Kestrel — Microsoft’s own docs recommend the same reverse-proxy pattern.' }
];
