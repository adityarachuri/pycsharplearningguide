export interface FintechProjectStep {
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
  }[];
  activeFile: string;
  fileContent: string;
  language: string;
  keyTakeaways: string[];
  proTip: string;
}

export const FINTECH_STEPS: FintechProjectStep[] = [
  {
    id: 1,
    title: 'Project Scaffolding',
    duration: '0:45',
    sceneTitle: 'Initializing the Payment Ledger Service',
    sdlcStage: 'Setup',
    sdlcPhaseName: 'Environment & Dependency Initialization',
    description: 'Scaffold a FastAPI service with uv, pinning exact dependency versions for a financial system where dependency drift is a compliance risk, not just a bug risk.',
    csharpParallel: {
      concept: 'dotnet new webapi + dotnet add package',
      dotnetEquivalent: '.csproj with PackageReference + packages.lock.json',
      keyDifference: 'uv.lock plays the same reproducible-restore role as packages.lock.json — both are committed to source control specifically so a financial audit can verify exactly which dependency versions produced a given deployment.'
    },
    terminalCommands: [
      { cmd: 'uv init --app ledger-service && cd ledger-service', output: ['Initialized project `ledger-service`'] },
      { cmd: 'uv add "fastapi[standard]>=0.115.0" "sqlalchemy>=2.0.35" "redis>=5.1.0"', output: ['Resolved 24 packages', 'Installed 24 packages in 340ms'] }
    ],
    activeFile: 'pyproject.toml',
    fileContent: `[project]
name = "ledger-service"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.115.0",
    "sqlalchemy>=2.0.35",
    "redis>=5.1.0",
    "psycopg[binary]>=3.2.3",
]

[dependency-groups]
dev = ["pytest>=8.3.3", "pytest-asyncio>=0.24.0", "ruff>=0.6.9"]`,
    language: 'toml',
    keyTakeaways: [
      'uv.lock is committed to source control — reproducible installs are an audit requirement here, not just a convenience.',
      'psycopg[binary] gives a pre-compiled PostgreSQL driver, avoiding a C compiler dependency in the deployment image.'
    ],
    proTip: 'Pin exact versions (not just lower bounds) for anything touching monetary calculations — an unreviewed transitive dependency bump is a real compliance concern in fintech, more than in most domains.'
  },
  {
    id: 2,
    title: 'Ledger Schema & Models',
    duration: '1:10',
    sceneTitle: 'Double-Entry Ledger Schema',
    sdlcStage: 'Design',
    sdlcPhaseName: 'Data Modeling',
    description: 'Define the double-entry ledger schema with SQLAlchemy, using NUMERIC (never FLOAT) for every monetary column, and a unique constraint enforcing idempotency at the database level.',
    csharpParallel: {
      concept: 'EF Core entity classes with [Column(TypeName = "decimal(18,2)")]',
      dotnetEquivalent: 'DbContext model configuration via Fluent API or data annotations',
      keyDifference: 'Both approaches exist purely to force the database column type to a fixed-precision decimal — the ORM-level type annotation is a defense against a future developer accidentally introducing a FLOAT column.'
    },
    terminalCommands: [
      { cmd: 'uv add alembic && uv run alembic init migrations', output: ['Creating directory migrations ...  done'] },
      { cmd: 'uv run alembic revision --autogenerate -m "create ledger_entries"', output: ['Generating migrations/versions/a1b2c3_create_ledger_entries.py ...  done'] }
    ],
    activeFile: 'models.py',
    fileContent: `from sqlalchemy import Numeric, String, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from datetime import datetime

class Base(DeclarativeBase): ...

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"
    __table_args__ = (
        UniqueConstraint("idempotency_key", name="uq_ledger_idempotency"),
        CheckConstraint("amount != 0", name="ck_amount_nonzero"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    idempotency_key: Mapped[str] = mapped_column(String(64), index=True)
    account_id: Mapped[str] = mapped_column(String(36), index=True)
    # NUMERIC(18, 2) — never Float. Exact base-10 precision, matching
    # C#'s decimal(18,2) column configuration exactly.
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    entry_type: Mapped[str] = mapped_column(String(6))  # "debit" | "credit"
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)`,
    language: 'python',
    keyTakeaways: [
      'The idempotency_key UNIQUE constraint is the real double-charge guard — the application-level Redis check is an optimization, this constraint is the correctness backstop.',
      'CheckConstraint("amount != 0") rejects a whole class of no-op ledger entries at the database level, before they ever reach reconciliation.'
    ],
    proTip: 'Always add the database-level constraint even when you also have an application-level idempotency check — the constraint is what protects you from a bug in the application logic, not just from client retries.'
  },
  {
    id: 3,
    title: 'Idempotent Charge Endpoint',
    duration: '1:25',
    sceneTitle: 'The Payment Endpoint',
    sdlcStage: 'Implementation',
    sdlcPhaseName: 'Core Business Logic',
    description: 'Implement the charge endpoint with an atomic Redis claim, Decimal-safe amount handling, and a database transaction wrapping both the ledger write and the idempotency record.',
    csharpParallel: {
      concept: 'Idempotent controller action with distributed lock + decimal',
      dotnetEquivalent: 'IDistributedCache.GetOrCreateAsync pattern with decimal DTOs',
      keyDifference: 'FastAPI’s Depends(get_db) generator-based session injection replaces ASP.NET Core’s Scoped DbContext lifetime — same guarantee (one session per request), different mechanism (yield-based cleanup vs. container-managed disposal).'
    },
    terminalCommands: [
      { cmd: 'uv run uvicorn main:app --reload --port 8000', output: ['INFO:     Uvicorn running on http://127.0.0.1:8000', 'INFO:     Application startup complete.'] },
      { cmd: 'curl -X POST localhost:8000/charges -H "Idempotency-Key: abc123" -d \'{"amount":"49.99","account_id":"acct_1"}\'', output: ['{"status":"posted","ledger_entry_id":501}'] }
    ],
    activeFile: 'routers/charges.py',
    fileContent: `from decimal import Decimal
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/charges")
async def create_charge(
    account_id: str,
    amount: Decimal,
    idempotency_key: str = Header(...),
    db: Session = Depends(get_db),
    cache: Redis = Depends(get_cache),
):
    claim_key = f"idem:{idempotency_key}"
    claimed = await cache.set(claim_key, "processing", nx=True, ex=86400)
    if not claimed:
        cached_result = await cache.get(f"{claim_key}:result")
        if cached_result:
            return json.loads(cached_result)
        raise HTTPException(409, "Request already in progress")

    entry = LedgerEntry(
        idempotency_key=idempotency_key,
        account_id=account_id,
        amount=amount,
        entry_type="debit",
    )
    db.add(entry)
    db.commit()  # UNIQUE constraint on idempotency_key is the correctness backstop

    result = {"status": "posted", "ledger_entry_id": entry.id}
    await cache.set(f"{claim_key}:result", json.dumps(result), ex=86400)
    return result`,
    language: 'python',
    keyTakeaways: [
      'SET NX (atomic "set if not exists") claims the idempotency key BEFORE processing — closing the race window a plain check-then-set would leave open.',
      'The database UNIQUE constraint from the previous scene is what actually prevents a double charge if the Redis claim somehow fails or expires early — defense in depth, not redundancy.'
    ],
    proTip: 'Treat the Redis idempotency claim as a performance optimization (avoid reprocessing) and the database UNIQUE constraint as the actual correctness guarantee — never trust distributed cache state alone for a financial invariant.'
  },
  {
    id: 4,
    title: 'Fraud Score Integration',
    duration: '1:05',
    sceneTitle: 'Real-Time Risk Scoring',
    sdlcStage: 'Implementation',
    sdlcPhaseName: 'Risk & Compliance Integration',
    description: 'Wire a pre-trained ONNX fraud model into the charge path, blocking or flagging transactions above a risk threshold before the ledger write commits.',
    csharpParallel: {
      concept: 'Inline ONNX Runtime inference in the request pipeline',
      dotnetEquivalent: 'Microsoft.ML.OnnxRuntime.InferenceSession, loaded once at startup',
      keyDifference: 'Loading the ONNX model once at application startup (not per-request) matters identically in both languages — the InferenceSession/onnxruntime.InferenceSession object is expensive to construct and safe to reuse across requests.'
    },
    terminalCommands: [
      { cmd: 'uv add onnxruntime', output: ['Installed onnxruntime==1.19.2'] },
      { cmd: 'curl -X POST localhost:8000/charges -d \'{"amount":"9999.00", ...}\'', output: ['{"status":"blocked","reason":"fraud_score_exceeded","score":0.91}'] }
    ],
    activeFile: 'services/fraud_scoring.py',
    fileContent: `import onnxruntime as ort
import numpy as np

# Loaded ONCE at module import time — an InferenceSession is expensive
# to construct and fully safe to reuse across concurrent requests.
_session = ort.InferenceSession("models/fraud_model.onnx")
FRAUD_BLOCK_THRESHOLD = 0.85

def score_transaction(feature_vector: list[float]) -> float:
    input_array = np.array([feature_vector], dtype=np.float32)
    outputs = _session.run(None, {"features": input_array})
    return float(outputs[0][0])

def evaluate_risk(feature_vector: list[float]) -> tuple[bool, float]:
    score = score_transaction(feature_vector)
    return score > FRAUD_BLOCK_THRESHOLD, score

# Called from the charge endpoint BEFORE the ledger write commits:
#   blocked, score = evaluate_risk(features)
#   if blocked:
#       raise HTTPException(403, detail={"reason": "fraud_score_exceeded", "score": score})`,
    language: 'python',
    keyTakeaways: [
      'The ONNX model was trained separately (offline, in a notebook or training pipeline) — this file only ever loads and runs the exported graph, with zero training-framework dependency in production.',
      'Risk evaluation happens BEFORE the database commit, inside the same request — a blocked transaction never reaches the ledger at all, rather than being written then reversed.'
    ],
    proTip: 'Log the fraud score for every transaction, blocked or not — you need the full score distribution, not just the blocked cases, to recalibrate the threshold as fraud patterns drift over time.'
  },
  {
    id: 5,
    title: 'Testing & Reconciliation Job',
    duration: '1:15',
    sceneTitle: 'Verifying Ledger Integrity',
    sdlcStage: 'Testing & Deployment',
    sdlcPhaseName: 'Verification & Scheduled Reconciliation',
    description: 'Write a pytest suite covering the idempotency guarantee directly, then schedule the daily pandas-based reconciliation job against the processor settlement file.',
    csharpParallel: {
      concept: 'xUnit integration test + Hangfire scheduled job',
      dotnetEquivalent: 'WebApplicationFactory-based test + IHostedService/Hangfire recurring job',
      keyDifference: 'pytest’s httpx.AsyncClient against the FastAPI app in-process mirrors WebApplicationFactory<T> + HttpClient exactly — both spin up the real app pipeline without a network socket for fast, realistic integration tests.'
    },
    terminalCommands: [
      { cmd: 'uv run pytest tests/test_charges.py -v', output: ['test_duplicate_idempotency_key_returns_cached_result PASSED', 'test_fraud_score_blocks_high_risk_transaction PASSED', '2 passed in 0.41s'] },
      { cmd: 'uv run python -m jobs.daily_reconciliation --date 2024-06-01', output: ['Reconciled 48,291 entries', 'Mismatches: 0', 'Missing from processor: 0'] }
    ],
    activeFile: 'tests/test_charges.py',
    fileContent: `import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_duplicate_idempotency_key_returns_cached_result():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        headers = {"Idempotency-Key": "test-key-001"}
        payload = {"account_id": "acct_test", "amount": "25.00"}

        first = await client.post("/charges", json=payload, headers=headers)
        second = await client.post("/charges", json=payload, headers=headers)

        assert first.status_code == 200
        assert second.status_code == 200
        # Same idempotency key MUST return the identical ledger entry,
        # not create a second one — this is the test that would catch
        # a regression in the SET NX claim logic from Scene 3.
        assert first.json()["ledger_entry_id"] == second.json()["ledger_entry_id"]`,
    language: 'python',
    keyTakeaways: [
      'The idempotency test asserts on the actual ledger_entry_id equality, not just a 200 status — a weaker test would miss a bug that silently created a second entry while still returning 200.',
      'The scheduled reconciliation job runs the pandas outer-merge pattern from the Business Context chapter as an actual production cron job, not just an ad-hoc analysis.'
    ],
    proTip: 'Write the idempotency-guarantee test FIRST, before the endpoint implementation — it’s the single highest-value test in the entire service, and TDD-ing it forces the atomic-claim design from the start rather than retrofitting it.'
  }
];

export interface FintechProjectFile {
  filename: string;
  path: string;
  category: 'config' | 'model' | 'api' | 'service' | 'test';
  content: string;
  summary: string;
}

export const FINTECH_ALL_FILES: FintechProjectFile[] = [
  {
    filename: 'pyproject.toml',
    path: 'pyproject.toml',
    category: 'config',
    summary: 'Project manifest pinning FastAPI, SQLAlchemy, Redis, and ONNX Runtime for the ledger service.',
    content: `[project]
name = "ledger-service"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.115.0",
    "sqlalchemy>=2.0.35",
    "redis>=5.1.0",
    "psycopg[binary]>=3.2.3",
    "onnxruntime>=1.19.2",
]

[dependency-groups]
dev = ["pytest>=8.3.3", "pytest-asyncio>=0.24.0", "httpx>=0.27.2", "ruff>=0.6.9"]`
  },
  {
    filename: 'models.py',
    path: 'app/models.py',
    category: 'model',
    summary: 'Double-entry ledger SQLAlchemy model with NUMERIC precision and an idempotency-key uniqueness constraint.',
    content: `from sqlalchemy import Numeric, String, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from datetime import datetime

class Base(DeclarativeBase): ...

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"
    __table_args__ = (
        UniqueConstraint("idempotency_key", name="uq_ledger_idempotency"),
        CheckConstraint("amount != 0", name="ck_amount_nonzero"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    idempotency_key: Mapped[str] = mapped_column(String(64), index=True)
    account_id: Mapped[str] = mapped_column(String(36), index=True)
    amount: Mapped[float] = mapped_column(Numeric(18, 2))
    entry_type: Mapped[str] = mapped_column(String(6))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)`
  },
  {
    filename: 'charges.py',
    path: 'app/routers/charges.py',
    category: 'api',
    summary: 'The idempotent, fraud-checked, Decimal-safe charge endpoint.',
    content: `from decimal import Decimal
import json
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.models import LedgerEntry
from app.services.fraud_scoring import evaluate_risk
from app.deps import get_db, get_cache

router = APIRouter()

@router.post("/charges")
async def create_charge(
    account_id: str,
    amount: Decimal,
    feature_vector: list[float],
    idempotency_key: str = Header(...),
    db: Session = Depends(get_db),
    cache = Depends(get_cache),
):
    claim_key = f"idem:{idempotency_key}"
    claimed = await cache.set(claim_key, "processing", nx=True, ex=86400)
    if not claimed:
        cached_result = await cache.get(f"{claim_key}:result")
        if cached_result:
            return json.loads(cached_result)
        raise HTTPException(409, "Request already in progress")

    blocked, score = evaluate_risk(feature_vector)
    if blocked:
        raise HTTPException(403, detail={"reason": "fraud_score_exceeded", "score": score})

    entry = LedgerEntry(idempotency_key=idempotency_key, account_id=account_id,
                         amount=amount, entry_type="debit")
    db.add(entry)
    db.commit()

    result = {"status": "posted", "ledger_entry_id": entry.id, "fraud_score": score}
    await cache.set(f"{claim_key}:result", json.dumps(result), ex=86400)
    return result`
  },
  {
    filename: 'fraud_scoring.py',
    path: 'app/services/fraud_scoring.py',
    category: 'service',
    summary: 'ONNX Runtime fraud model inference, loaded once at import time.',
    content: `import onnxruntime as ort
import numpy as np

_session = ort.InferenceSession("models/fraud_model.onnx")
FRAUD_BLOCK_THRESHOLD = 0.85

def score_transaction(feature_vector: list[float]) -> float:
    input_array = np.array([feature_vector], dtype=np.float32)
    outputs = _session.run(None, {"features": input_array})
    return float(outputs[0][0])

def evaluate_risk(feature_vector: list[float]) -> tuple[bool, float]:
    score = score_transaction(feature_vector)
    return score > FRAUD_BLOCK_THRESHOLD, score`
  },
  {
    filename: 'daily_reconciliation.py',
    path: 'app/jobs/daily_reconciliation.py',
    category: 'service',
    summary: 'Scheduled pandas-based outer-merge reconciliation between the internal ledger and processor settlement file.',
    content: `import pandas as pd
import argparse

def reconcile(date_str: str, db_conn, settlement_csv_path: str) -> pd.DataFrame:
    internal_ledger = pd.read_sql(
        "SELECT idempotency_key AS transaction_id, amount FROM ledger_entries "
        "WHERE created_at::date = %(date)s",
        db_conn, params={"date": date_str},
    )
    processor_settlement = pd.read_csv(settlement_csv_path)

    merged = internal_ledger.merge(
        processor_settlement, on="transaction_id", how="outer",
        suffixes=("_internal", "_processor"), indicator=True,
    )

    mismatches = merged[(merged["_merge"] == "both") &
                         (merged["amount_internal"] != merged["amount_processor"])]
    missing = merged[merged["_merge"] != "both"]

    print(f"Reconciled {len(merged):,} entries")
    print(f"Mismatches: {len(mismatches)}")
    print(f"Missing from processor: {len(missing)}")
    return pd.concat([mismatches, missing])

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", required=True)
    args = parser.parse_args()
    reconcile(args.date, get_db_connection(), f"settlements/{args.date}.csv")`
  },
  {
    filename: 'test_charges.py',
    path: 'tests/test_charges.py',
    category: 'test',
    summary: 'Integration test asserting the idempotency guarantee by comparing ledger_entry_id, not just HTTP status.',
    content: `import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_duplicate_idempotency_key_returns_cached_result():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        headers = {"Idempotency-Key": "test-key-001"}
        payload = {"account_id": "acct_test", "amount": "25.00", "feature_vector": [0.1] * 10}

        first = await client.post("/charges", json=payload, headers=headers)
        second = await client.post("/charges", json=payload, headers=headers)

        assert first.status_code == 200
        assert second.status_code == 200
        assert first.json()["ledger_entry_id"] == second.json()["ledger_entry_id"]

@pytest.mark.asyncio
async def test_fraud_score_blocks_high_risk_transaction():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {"account_id": "acct_test", "amount": "9999.00", "feature_vector": [9.9] * 10}
        response = await client.post(
            "/charges", json=payload, headers={"Idempotency-Key": "test-key-002"}
        )
        assert response.status_code == 403
        assert response.json()["detail"]["reason"] == "fraud_score_exceeded"`
  }
];
