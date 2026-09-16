import { DeepDiveFeature } from '../types';

export interface TestingVerdictPoint {
  id: string;
  claim: string;
  reality: string;
}

export const TESTING_DEPLOYMENT_VERDICT =
  "`uv` didn't just make `pip install` faster — it collapsed virtual environments, lockfiles, and Python-version management into one Rust-implemented tool, finally giving Python the single-command, deterministic-restore experience `dotnet restore` has had for years.";

export const TESTING_DEPLOYMENT_VERDICT_POINTS: TestingVerdictPoint[] = [
  {
    id: 'fixtures-vs-di',
    claim: '"Are pytest fixtures just test-scoped dependency injection?"',
    reality:
      "Functionally, yes — a fixture is a function pytest calls to produce a value your test requests by parameter name, with a scope (`function`, `class`, `module`, `session`) governing reuse, directly analogous to a test-scoped service in xUnit's `IClassFixture<T>`/`ICollectionFixture<T>`. The mechanism differs: pytest matches fixtures to test parameters purely by *name*, not by declared type, so a typo in a fixture name fails at collection time with no compiler to catch it earlier."
  },
  {
    id: 'no-project-file-historically',
    claim: '"Why did Python packaging feel so fragmented compared to .csproj/NuGet?"',
    reality:
      'For over a decade, Python had no single standardized project-manifest format — `setup.py` (executable Python, not declarative), then `setup.cfg`, then `requirements.txt` for dependencies with no lockfile concept, split across incompatible tools (pip, pipenv, poetry, conda). `pyproject.toml` (PEP 621) plus `uv` finally converges this into one declarative manifest and one deterministic lockfile — much closer to what `.csproj` + `packages.lock.json` gave C# from the start.'
  },
  {
    id: 'wheels-vs-nuget',
    claim: '"Is a Python wheel the same idea as a NuGet package?"',
    reality:
      'A `.whl` file is a pre-built, ready-to-install distribution — the same "already compiled, just extract it" goal as a `.nupkg`. The difference is what "pre-built" means: a *pure-Python* wheel truly is just plain `.py` files; a wheel wrapping a native C extension is pre-*compiled* for one specific OS/architecture/Python-ABI combination, which is why you’ll see multiple wheel files per release (`manylinux`, `macosx`, `win_amd64`) where a single NuGet package targeting a managed `netstandard2.0` TFM needs none of that platform-specific duplication.'
  },
  {
    id: 'docker-multistage',
    claim: '"Does a Python Dockerfile need multi-stage builds the way a compiled C# one does?"',
    reality:
      "For a different reason, but yes: a C# multi-stage build separates the SDK (needed to compile) from the runtime image (doesn't need the compiler). Python has no compile step, but multi-stage still matters — separating a stage with build tools (a C compiler, for native-extension wheels) from a slim final image that only needs the pre-built wheels and the interpreter, keeping the shipped image free of gcc/build-essential and its attack surface."
  }
];

export const TESTING_DEPLOYMENT_CONCEPTS: DeepDiveFeature[] = [
  {
    id: 'pytest-fixtures',
    number: 1,
    title: 'pytest Fixtures: Name-Matched, Scoped Test Dependencies',
    tagline: 'Composable setup/teardown functions injected by parameter name, not by declared type',
    csharpEquivalent: 'xUnit `IClassFixture<T>`/`ICollectionFixture<T>` and constructor injection for test dependencies',
    whyItMatters: 'xUnit resolves a test class’s constructor dependencies by *type*, checked by the compiler. pytest resolves fixtures purely by matching a test function’s *parameter name* to a fixture function of the same name — there’s no shared interface or base class requirement, which makes fixtures extremely composable (a fixture can itself request other fixtures as parameters) but shifts a whole class of "did I spell this right" errors from compile time to test-collection time.',
    csharpApproach: 'Implement `IClassFixture<DatabaseFixture>`, inject it via the test class constructor, and use `IAsyncLifetime` for async setup/teardown — the fixture’s lifetime is tied to the test class or a declared collection.',
    pythonApproach: 'Define a function decorated `@pytest.fixture(scope=...)` that `yield`s the resource (code after `yield` is teardown); any test function that declares a parameter with that fixture’s exact name receives it automatically.',
    csharpCode: `// C#: xUnit — fixture resolved by type, shared across the test class
public class DatabaseFixture : IAsyncLifetime
{
    public AppDbContext Db { get; private set; } = null!;
    public async Task InitializeAsync() => Db = await TestDb.CreateAsync();
    public Task DisposeAsync() => Db.DisposeAsync().AsTask();
}

public class OrderServiceTests : IClassFixture<DatabaseFixture>
{
    private readonly AppDbContext _db;
    public OrderServiceTests(DatabaseFixture fixture) => _db = fixture.Db;

    [Fact]
    public async Task CreatesOrder_WithValidLines()
    {
        var order = await new OrderService(_db).CreateAsync(sampleLines);
        Assert.Equal(OrderStatus.Pending, order.Status);
    }
}`,
    pythonCode: `import pytest

@pytest.fixture(scope="module")
def db_session():
    session = create_test_db()
    yield session          # <-- test runs here, using the yielded value
    session.close()         # <-- runs after all tests in the module finish

@pytest.fixture
def order_service(db_session):   # fixtures can request other fixtures
    return OrderService(db_session)

def test_creates_order_with_valid_lines(order_service):
    # pytest matched "order_service" by NAME to the fixture above —
    # no import, no base class, no explicit constructor wiring
    order = order_service.create(sample_lines)
    assert order.status == OrderStatus.PENDING`,
    underTheHood: 'Before running any test, pytest performs a "collection" pass: it inspects every test function’s parameter list via introspection and builds a dependency graph of fixtures-by-name, resolving scope conflicts (a `session`-scoped fixture can’t depend on a `function`-scoped one) before a single test executes. This is conceptually similar to how a DI container validates its registration graph at startup, except pytest’s "registration" is implicit — any `@pytest.fixture`-decorated function anywhere in a visible `conftest.py` is automatically part of the graph, no explicit `AddScoped`-style registration call required.',
    pitfalls: [
      'Renaming a fixture function without renaming every test parameter that references it by name — pytest reports "fixture not found" at collection time, with no IDE rename-refactor safety net the way a typed constructor parameter would get.',
      'Requesting a broader-scoped fixture (`session`) from inside a narrower one incorrectly assuming fresh state each test — a `session`-scoped fixture is genuinely created once for the whole test run, mutations from one test leak into the next.',
      'Using a plain `return` instead of `yield` in a fixture that opens a resource — no teardown code runs at all, silently leaking connections/file handles across the test session.'
    ],
    bestPractices: [
      'Default every fixture to the narrowest scope that’s still fast enough (`function` first) and only widen to `module`/`session` deliberately, exactly as you would default DI registrations to `Scoped`/`Transient` before reaching for `Singleton`.',
      'Put shared fixtures in a `conftest.py` at the directory level they should apply to — pytest auto-discovers these without any explicit import, mirroring how a DI container’s registrations are visible app-wide once added.',
      'Prefer fixture composition (a fixture requesting another fixture) over duplicating setup logic across fixtures, the same single-responsibility principle applied to service registration.'
    ]
  },
  {
    id: 'mocking',
    number: 2,
    title: 'unittest.mock: Patching by Import Path, Not by Interface',
    tagline: 'Runtime monkey-patching of specific attributes rather than substituting an interface implementation',
    csharpEquivalent: 'Moq/NSubstitute creating a fake implementation of an injected interface',
    whyItMatters: 'C# mocking requires the collaborator to be behind an interface, injected, so the test can substitute a fake implementation — the design (interfaces + DI) exists partly *to enable* mocking. Python’s `unittest.mock.patch()` doesn’t need an interface at all: it temporarily replaces whatever object lives at a given *import path* (a function, a class, even a module attribute) for the duration of the test, then restores the original — powerful, but coupled to exactly where the code imports its dependency from, not to an abstraction.',
    csharpApproach: 'Inject an `IPaymentGateway` interface into the class under test; in the test, construct a `Mock<IPaymentGateway>` (Moq), set up `.Setup(g => g.Charge(...))`, and inject the mock instead of the real implementation.',
    pythonApproach: 'Use `unittest.mock.patch("module.path.to.function")` (or `patch.object`) as a decorator or context manager to temporarily replace the real function/class at its import location with a `MagicMock`, configuring `.return_value` or `side_effect`.',
    csharpCode: `// C#: Moq — substitute a fake behind the injected interface
public interface IPaymentGateway
{
    Task<ChargeResult> ChargeAsync(decimal amount, string cardToken);
}

[Fact]
public async Task ChargesCorrectAmount()
{
    var gatewayMock = new Mock<IPaymentGateway>();
    gatewayMock
        .Setup(g => g.ChargeAsync(49.99m, It.IsAny<string>()))
        .ReturnsAsync(new ChargeResult(Success: true));

    var checkout = new CheckoutService(gatewayMock.Object);
    var result = await checkout.CompleteAsync(order, "tok_abc");

    gatewayMock.Verify(g => g.ChargeAsync(49.99m, "tok_abc"), Times.Once);
    Assert.True(result.Success);
}`,
    pythonCode: `from unittest.mock import patch

# Patches "checkout.payment_gateway.charge" specifically at the IMPORT
# PATH used inside checkout_service.py — not at the gateway module's
# own definition site. Getting this path wrong is the #1 mocking bug.
@patch("checkout_service.payment_gateway.charge")
def test_charges_correct_amount(mock_charge):
    mock_charge.return_value = ChargeResult(success=True)

    checkout = CheckoutService()
    result = checkout.complete(order, card_token="tok_abc")

    mock_charge.assert_called_once_with(49.99, "tok_abc")
    assert result.success is True`,
    underTheHood: '`patch()` works by looking up the dotted path you give it, `setattr()`-ing a `MagicMock` in place of the real object it finds there, and restoring the original object afterward (via `finally`, guaranteed even on test failure). Because Python resolves `import x.y` and then `x.y.z` at *call time* by name lookup through module namespaces, patching only takes effect if you patch the name as it’s looked up from the *calling* module’s namespace — patching the function at its original defining module does nothing if the caller imported it with `from module import func` (creating a second, independent name binding).',
    pitfalls: [
      'Patching a function at its *definition* module path when the code under test imported it with `from x import func` — the test patches a name the calling code never actually looks up, and the mock is silently never used.',
      'Over-mocking to the point the test only verifies "the mock was called," proving nothing about actual integration correctness — the interface-based C# equivalent nudges you toward testing behavior *through* the interface contract instead.',
      'Forgetting `mock.reset_mock()` between assertions within one test, or relying on module-level `patch()` without a `with`/decorator scope, leaking a patched-out dependency into unrelated tests.'
    ],
    bestPractices: [
      'Always patch at the *usage* site (`patch("module_under_test.dependency_name")`), never at the dependency’s own defining module, unless you specifically imported the module itself (not a name from it).',
      'Prefer dependency injection (constructor/function parameters) even in Python specifically to make mocking simpler and path-independent — the C# discipline transfers and reduces patch-path bugs entirely.',
      'Reach for `pytest-mock`’s `mocker` fixture over raw `unittest.mock.patch` decorators — it auto-restores patches per test without needing an explicit `with` block or decorator stacking.'
    ]
  },
  {
    id: 'pyproject-packaging',
    number: 3,
    title: 'pyproject.toml & uv: Declarative Projects, Deterministic Locks',
    tagline: 'One manifest, one lockfile, one fast Rust-implemented tool replacing pip + virtualenv + pip-tools',
    csharpEquivalent: '`.csproj` (project manifest) + `packages.lock.json` (deterministic restore) + `dotnet restore`',
    whyItMatters: 'Historically, a Python project might need `setup.py`, `setup.cfg`, `requirements.txt`, *and* a separate virtual environment tool just to reach parity with what `.csproj` + `dotnet restore` gives C# out of the box. `pyproject.toml` (PEP 621) standardized the declarative manifest; `uv` (Rust-implemented) now handles environment creation, dependency resolution, and a true lockfile (`uv.lock`) in one command, closing the deterministic-restore gap with .NET almost entirely.',
    csharpApproach: 'Declare package references and target framework in `.csproj`; run `dotnet restore` to resolve against `packages.lock.json` for byte-for-byte reproducible restores across machines/CI.',
    pythonApproach: 'Declare dependencies and metadata in `pyproject.toml`; run `uv sync` to create a virtual environment and install exactly the versions pinned in the auto-generated `uv.lock`, reproducibly across machines/CI.',
    csharpCode: `<!-- C#: .csproj — declarative manifest -->
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="FastEndpoints" Version="5.28.0" />
    <PackageReference Include="Npgsql" Version="8.0.3" />
  </ItemGroup>
</Project>

<!-- dotnet restore reads packages.lock.json for exact, reproducible versions -->`,
    pythonCode: `# pyproject.toml — declarative manifest (PEP 621)
[project]
name = "checkout-service"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "sqlalchemy>=2.0.35",
]

[dependency-groups]
dev = ["pytest>=8.3.3", "ruff>=0.6.9"]

# uv sync reads (or creates) uv.lock for exact, reproducible versions,
# and creates/updates the .venv in one command — no separate
# "activate a virtualenv first" step required before it runs.`,
    underTheHood: 'A Python "lockfile" solves the same problem `packages.lock.json` solves — pinning not just your direct dependencies but the *entire resolved transitive graph* to exact versions and content hashes, so `uv sync` on a teammate’s machine (or in CI) installs byte-identical packages, not just "a version satisfying the range." `uv`’s resolver is written in Rust and models the whole resolution problem as a SAT-style constraint solve, which is both why it’s dramatically faster than the pure-Python `pip`/`pip-tools` resolvers it replaces and why it’s able to produce one universal lockfile instead of pip’s historically platform-specific, order-dependent installs.',
    pitfalls: [
      'Committing `requirements.txt` generated by hand (`pip freeze > requirements.txt`) instead of a real lockfile — it captures whatever happened to be installed locally, not a resolver-verified, reproducible dependency graph.',
      'Using loose version specifiers (`fastapi` with no version bound at all) in `pyproject.toml` and relying solely on the lockfile for reproducibility — the *first* `uv lock` on a new machine with no existing lockfile can still pick up a surprising new major version.',
      'Mixing `pip install X` directly into an environment `uv` also manages — bypasses the lockfile entirely, causing silent drift between what’s installed and what `uv.lock` claims is installed.'
    ],
    bestPractices: [
      'Commit `uv.lock` to version control, exactly as you’d commit `packages.lock.json` — treat an uncommitted lockfile as a broken build, not an optional artifact.',
      'Pin `requires-python` in `pyproject.toml` the way you’d pin `<TargetFramework>` — makes the supported runtime version an explicit, resolver-checked constraint, not tribal knowledge.',
      'Run `uv sync --locked` (or the CI equivalent) in continuous integration, which fails the build if `pyproject.toml` and `uv.lock` have drifted out of sync — the direct analogue of `dotnet restore --locked-mode`.'
    ]
  },
  {
    id: 'docker-multistage',
    number: 4,
    title: 'Multi-Stage Docker Builds for Python',
    tagline: 'Separating a build stage (compilers, dev tools) from a slim runtime image',
    csharpEquivalent: 'The standard `mcr.microsoft.com/dotnet/sdk` build stage → `mcr.microsoft.com/dotnet/aspnet` runtime stage pattern',
    whyItMatters: 'A C# multi-stage Dockerfile separates the SDK image (needed only to `dotnet publish`) from the much smaller ASP.NET runtime image the final container actually ships. Python has no compilation step for pure-Python code, but multi-stage builds still matter for a different reason: dependencies with native C extensions (`psycopg2`, `numpy`’s source builds) need a C compiler and system headers *only* during `uv sync`/`pip install` — shipping that entire build toolchain in the final production image needlessly bloats it and expands the attack surface.',
    csharpApproach: 'Stage 1: `FROM mcr.microsoft.com/dotnet/sdk` to restore + publish. Stage 2: `FROM mcr.microsoft.com/dotnet/aspnet` (runtime-only, no SDK) and `COPY --from=build /app/publish .`.',
    pythonApproach: 'Stage 1: a `python:slim` image with build tools installed, run `uv sync` to build/install all dependencies (including native ones) into a virtual environment. Stage 2: a fresh `python:slim` image, `COPY --from=builder /app/.venv .venv` — no compiler ever present in the shipped image.',
    csharpCode: `# C#: two-stage Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore --locked-mode && dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CheckoutService.dll"]
# Final image never contains the SDK/compiler — runtime only`,
    pythonCode: `# Python: two-stage Dockerfile with uv
FROM python:3.12-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends build-essential
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project   # compiles native deps here only

FROM python:3.12-slim AS final
WORKDIR /app
COPY --from=builder /app/.venv .venv        # pre-built venv, no compiler needed
COPY . .
ENV PATH="/app/.venv/bin:$PATH"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
# build-essential (gcc, headers) never present in this final image`,
    underTheHood: 'Docker’s `--from=<stage>` copy mechanism only carries forward the specific files/directories you name — not the whole filesystem layer, not any package manager state from the earlier stage. For Python, copying just the pre-built `.venv` directory means the final image inherits the *compiled artifacts* (the native `.so` extension files, already built) without inheriting the toolchain (`gcc`, `python3-dev` headers) that produced them, the same separation of "build output" from "build tools" a compiled `.NET` multi-stage Dockerfile achieves, just applied to a native-extension virtual environment instead of a compiled DLL.',
    pitfalls: [
      'Installing `build-essential`/gcc in the *final* stage instead of only the builder stage — silently balloons image size and expands the attack surface with a full compiler toolchain in production, defeating the purpose of multi-stage entirely.',
      'Copying the whole `/app` directory (including `uv.lock`, `pyproject.toml`, build caches) into the final stage instead of just the `.venv` and application source — leaks build-time artifacts into the shipped image.',
      'Forgetting that `.venv` paths are typically *not* portable if the base image’s Python version differs even slightly between builder and final stages — pin the exact same base image tag in both `FROM` lines.'
    ],
    bestPractices: [
      'Pin the exact same Python base image version string in both stages (`python:3.12.7-slim` twice, not `python:3.12-slim` where the digest can drift) — same discipline as matching SDK/runtime major.minor versions in a .NET Dockerfile.',
      'Use `--no-install-project` (or an equivalent "deps only" flag) to build the dependency layer before copying application source, so Docker’s layer cache is only invalidated by dependency changes, not every source-code edit — the Python analogue of restoring NuGet packages in their own cached Docker layer.',
      'Run the final container as a non-root user (`USER appuser`) — not Python-specific, but a frequently-skipped step that matters as much here as in any compiled-language production image.'
    ]
  }
];

export interface DeploymentTool {
  id: string;
  tool: string;
  role: string;
  csharpAnalogue: string;
}

export const DEPLOYMENT_TOOLS: DeploymentTool[] = [
  { id: 'ruff', tool: 'Ruff', role: 'Rust-implemented linter + formatter, replacing Flake8/isort/Black/pylint with one order-of-magnitude-faster tool.', csharpAnalogue: 'Roslyn analyzers + `dotnet format` combined — built-in linting and formatting in one pass.' },
  { id: 'pyright', tool: 'Pyright / mypy', role: 'Static type checkers that verify type hints without executing code, surfacing errors before runtime.', csharpAnalogue: 'The C# compiler’s own static type checking — except opt-in and separate from execution in Python, not load-bearing for the language to run at all.' },
  { id: 'tox-nox', tool: 'tox / nox', role: 'Runs the test suite across a matrix of Python versions/dependency sets in isolated environments per combination.', csharpAnalogue: 'A CI pipeline matrix build across multiple `<TargetFrameworks>` — same goal, different mechanism.' },
  { id: 'pre-commit', tool: 'pre-commit', role: 'Git hook framework running linters/formatters/type-checkers automatically before each commit.', csharpAnalogue: 'Husky.NET or a custom `pre-commit` git hook running `dotnet format`/analyzers — same workflow pattern.' },
  { id: 'twine-pypi', tool: 'twine / PyPI', role: 'Uploads built wheel/sdist packages to the Python Package Index for public or private distribution.', csharpAnalogue: '`dotnet nuget push` to NuGet.org or a private feed — the direct publishing-workflow equivalent.' },
  { id: 'gunicorn-supervisor', tool: 'systemd / Supervisor', role: 'Process managers that keep the Gunicorn/Uvicorn worker processes alive, restarting on crash.', csharpAnalogue: 'A Windows Service wrapper or systemd unit running `dotnet MyApp.dll` — the same "keep the process alive" role.' }
];
