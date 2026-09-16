export interface HealthtechProjectStep {
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

export const HEALTHTECH_STEPS: HealthtechProjectStep[] = [
  {
    id: 1,
    title: 'Project Scaffolding',
    duration: '0:50',
    sceneTitle: 'Initializing the Patient Records Service',
    sdlcStage: 'Setup',
    sdlcPhaseName: 'Environment & Dependency Initialization',
    description: 'Scaffold a FastAPI service with fhir.resources for typed FHIR validation, and a structured logging library for HIPAA-compliant audit output.',
    csharpParallel: {
      concept: 'dotnet new webapi + Firely SDK package reference',
      dotnetEquivalent: 'Hl7.Fhir.R4 NuGet package + Serilog structured logging',
      keyDifference: 'Both ecosystems reach for a dedicated structured-logging library (not plain print/Console.WriteLine) specifically because HIPAA audit logs need queryable, structured fields — not free-text log lines.'
    },
    terminalCommands: [
      { cmd: 'uv init --app patient-records-service && cd patient-records-service', output: ['Initialized project `patient-records-service`'] },
      { cmd: 'uv add "fastapi[standard]>=0.115.0" "fhir.resources>=7.1.0" "structlog>=24.4.0"', output: ['Resolved 31 packages', 'Installed 31 packages in 410ms'] }
    ],
    activeFile: 'pyproject.toml',
    fileContent: `[project]
name = "patient-records-service"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.115.0",
    "fhir.resources>=7.1.0",
    "sqlalchemy>=2.0.35",
    "structlog>=24.4.0",
]

[dependency-groups]
dev = ["pytest>=8.3.3", "pytest-asyncio>=0.24.0", "ruff>=0.6.9"]`,
    language: 'toml',
    keyTakeaways: [
      'fhir.resources is Pydantic-based, so FastAPI’s automatic request validation applies to FHIR resources exactly like any other Pydantic model.',
      'structlog produces structured (JSON) log output from the start — essential for audit logs that must be queryable, not just human-readable text.'
    ],
    proTip: 'Never build a healthtech service without structured logging from day one — retrofitting HIPAA-compliant, queryable audit logs onto free-text log lines later is far more painful than starting structured.'
  },
  {
    id: 2,
    title: 'FHIR Patient Resource Model',
    duration: '1:15',
    sceneTitle: 'Typed FHIR Patient Validation',
    sdlcStage: 'Design',
    sdlcPhaseName: 'Data Modeling',
    description: 'Define the internal patient record schema alongside a FHIR-compliant conversion layer, so the service can both store data efficiently and expose a standards-compliant FHIR API.',
    csharpParallel: {
      concept: 'Internal EF Core entity + Firely FHIR Patient conversion methods',
      dotnetEquivalent: 'A mapping layer between the DbContext entity and the Hl7.Fhir.Model.Patient wire format',
      keyDifference: 'Both ecosystems deliberately keep an internal storage model separate from the FHIR wire-format model — the FHIR schema is standardized and versioned by HL7, not something you want to directly use as your database schema.'
    },
    terminalCommands: [
      { cmd: 'uv run python -c "from fhir.resources.patient import Patient; print(Patient.model_fields.keys())"', output: ["dict_keys(['resourceType', 'id', 'name', 'birthDate', 'gender', ...])"] }
    ],
    activeFile: 'models.py',
    fileContent: `from sqlalchemy import String, Date
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from fhir.resources.patient import Patient as FhirPatient
from fhir.resources.humanname import HumanName
from datetime import date

class Base(DeclarativeBase): ...

class PatientRecord(Base):
    """Internal storage model — deliberately separate from the FHIR
    wire format, which is standardized and versioned by HL7."""
    __tablename__ = "patient_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    mrn: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    family_name: Mapped[str] = mapped_column(String(100))
    given_name: Mapped[str] = mapped_column(String(100))
    birth_date: Mapped[date]

    def to_fhir(self) -> FhirPatient:
        """Convert internal storage -> validated FHIR R4 Patient resource."""
        return FhirPatient(
            id=self.mrn,
            name=[HumanName(family=self.family_name, given=[self.given_name])],
            birthDate=self.birth_date,
        )`,
    language: 'python',
    keyTakeaways: [
      'to_fhir() constructing a FhirPatient object validates the output against the FHIR R4 schema automatically — a malformed conversion raises immediately, before ever reaching an API response.',
      'Keeping the internal model separate from the FHIR model means an HL7 schema update (R4 -> R5) only touches the conversion layer, not the database schema.'
    ],
    proTip: 'Resist the temptation to use the FHIR resource classes directly as your database ORM models — the FHIR schema evolves on HL7’s standards timeline, not yours, and coupling your storage schema to it makes every FHIR version upgrade a database migration.'
  },
  {
    id: 3,
    title: 'De-identification Service',
    duration: '1:20',
    sceneTitle: 'Safe Harbor De-identification Pipeline',
    sdlcStage: 'Implementation',
    sdlcPhaseName: 'Compliance & Privacy Engineering',
    description: 'Implement the Safe Harbor de-identification transformation as an isolated, thoroughly-tested module applied before any patient data reaches an analytics export.',
    csharpParallel: {
      concept: 'A dedicated, unit-tested Deidentifier service class',
      dotnetEquivalent: 'A single-responsibility C# class covering all 18 Safe Harbor categories, called only from the analytics-export path',
      keyDifference: 'Architecturally identical in both languages: de-identification lives in exactly one place, called from exactly one boundary (the export/analytics path), never scattered inline across multiple endpoints.'
    },
    terminalCommands: [
      { cmd: 'uv run pytest tests/test_deidentify.py -v', output: ['test_removes_all_18_safe_harbor_categories PASSED', 'test_generalizes_age_over_89 PASSED', '2 passed in 0.28s'] }
    ],
    activeFile: 'services/deidentify.py',
    fileContent: `from dataclasses import replace
from datetime import date
from app.models import PatientRecord

def deidentify_safe_harbor(record: PatientRecord) -> PatientRecord:
    """HIPAA Safe Harbor (45 CFR 164.514(b)(2)) de-identification.
    Called ONLY from the analytics-export boundary — never applied
    to data served through the clinical-care FHIR API."""
    return replace(
        record,
        family_name="[REDACTED]",
        given_name="[REDACTED]",
        mrn=hash_identifier(record.mrn),                       # category 8
        birth_date=date(record.birth_date.year, 1, 1),          # category 3
    )

def generalize_age(age: int) -> int:
    """Category 3 sub-rule: ages over 89 must be generalized to 90+."""
    return 90 if age > 89 else age

def deidentify_zip(zip_code: str, population_under_20k: bool) -> str:
    """Category 2 sub-rule: ZIP codes in sparse-population areas
    require the full first three digits be zeroed, not just truncated."""
    prefix = zip_code[:3]
    return "000" if population_under_20k else f"{prefix}00"`,
    language: 'python',
    keyTakeaways: [
      'hash_identifier() on the MRN makes it a stable pseudonym (same patient always hashes the same) without storing the real MRN — useful for longitudinal research without re-identification.',
      'The sparse-population ZIP code exception is exactly the kind of Safe Harbor sub-rule that’s easy to miss without referencing the full 18-category checklist directly.'
    ],
    proTip: 'Write a test asserting ALL 18 Safe Harbor categories are handled, not just the obvious ones (name, address) — an incomplete implementation that passes a superficial test suite is a false sense of compliance.'
  },
  {
    id: 4,
    title: 'HIPAA Audit Middleware',
    duration: '1:05',
    sceneTitle: 'Append-Only Access Logging',
    sdlcStage: 'Implementation',
    sdlcPhaseName: 'Security & Compliance Middleware',
    description: 'Wire audit logging as global FastAPI middleware so every PHI-touching request — read or write, successful or denied — is recorded, structurally impossible to skip per-endpoint.',
    csharpParallel: {
      concept: 'ASP.NET Core middleware wrapping every /patients/* route',
      dotnetEquivalent: 'IMiddleware implementation registered in the pipeline before the PHI endpoints',
      keyDifference: 'Middleware-based audit logging in both frameworks guarantees uniform coverage — a new endpoint added later automatically inherits the audit behavior without a developer remembering to add it.'
    },
    terminalCommands: [
      { cmd: 'uv run uvicorn main:app --reload --port 8000', output: ['INFO:     Uvicorn running on http://127.0.0.1:8000'] },
      { cmd: 'curl localhost:8000/patients/mrn-4471', output: ['{"resourceType":"Patient","id":"mrn-4471", ...}'] }
    ],
    activeFile: 'middleware/audit.py',
    fileContent: `import time
import structlog
from fastapi import Request

audit_log = structlog.get_logger("phi_audit")

async def phi_audit_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)

    if request.url.path.startswith("/patients"):
        # Structured fields, not a free-text message — this log line
        # must be queryable ("show me every access to patient X in the
        # last 30 days"), which requires structured, not prose, output.
        audit_log.info(
            "phi_access",
            user_id=getattr(request.state, "user_id", "unknown"),
            resource_path=request.url.path,
            method=request.method,
            status_code=response.status_code,
            source_ip=request.client.host if request.client else None,
            duration_ms=round((time.time() - start) * 1000, 2),
        )
        # response_status is logged regardless of success — a denied
        # (403) access attempt is itself a security-relevant event.

    return response`,
    language: 'python',
    keyTakeaways: [
      'The audit write happens after call_next() but unconditionally — it logs the response status whether the request succeeded, failed, or was denied.',
      'structlog’s keyword-argument style produces genuinely structured (JSON-serializable) log entries, directly queryable in whatever log aggregation system ingests them.'
    ],
    proTip: 'Route structlog output to an append-only sink (a write-only log aggregation service, or a database role with INSERT-only grants) — an audit log the application itself could tamper with defeats the entire purpose.'
  },
  {
    id: 5,
    title: 'Testing & Clinical Data Pipeline',
    duration: '1:10',
    sceneTitle: 'Verifying Compliance & Building the Vitals Pipeline',
    sdlcStage: 'Testing & Deployment',
    sdlcPhaseName: 'Verification & Analytics Pipeline',
    description: 'Write tests asserting the de-identification and audit-logging guarantees directly, then build the pandas-based pivot job turning long-format observations into a wide-format clinical time series.',
    csharpParallel: {
      concept: 'xUnit compliance tests + a scheduled reshape job',
      dotnetEquivalent: 'WebApplicationFactory-based integration tests + an IHostedService running the LINQ-based reshape',
      keyDifference: 'httpx.AsyncClient against the in-process FastAPI app mirrors WebApplicationFactory<T> exactly — both test the real middleware pipeline (including the audit logging from Scene 4) without a live network socket.'
    },
    terminalCommands: [
      { cmd: 'uv run pytest tests/ -v', output: ['test_deidentified_export_contains_no_names PASSED', 'test_patient_access_creates_audit_entry PASSED', '2 passed in 0.35s'] },
      { cmd: 'uv run python -m jobs.vitals_pipeline --date 2024-06-01', output: ['Pivoted 12,404 observations', 'Wide-format rows: 1,203 patient-days'] }
    ],
    activeFile: 'tests/test_audit.py',
    fileContent: `import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_patient_access_creates_audit_entry(caplog):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(
            "/patients/mrn-test-001",
            headers={"Authorization": "Bearer test-token"},
        )

        assert response.status_code in (200, 404)
        # The audit middleware from Scene 4 must have logged this access
        # REGARDLESS of whether the patient existed — this is the test
        # that would catch a regression where audit logging silently
        # only fires on the "happy path".
        audit_events = [r for r in caplog.records if r.msg == "phi_access"]
        assert len(audit_events) == 1
        assert audit_events[0].resource_path == "/patients/mrn-test-001"`,
    language: 'python',
    keyTakeaways: [
      'The audit test asserts on BOTH possible status codes (200 or 404) — because the audit requirement covers the access attempt itself, not just successful reads.',
      'The vitals pipeline job reuses the exact pivot_table pattern from the Business Context chapter’s Clinical Data Pipelines concept, now running as a real scheduled job.'
    ],
    proTip: 'Test audit logging as rigorously as you test the business logic it wraps — a silent gap in PHI access logging is a compliance failure that’s invisible until an actual audit, which is exactly the wrong time to discover it.'
  }
];

export interface HealthtechProjectFile {
  filename: string;
  path: string;
  category: 'config' | 'model' | 'api' | 'service' | 'test';
  content: string;
  summary: string;
}

export const HEALTHTECH_ALL_FILES: HealthtechProjectFile[] = [
  {
    filename: 'pyproject.toml',
    path: 'pyproject.toml',
    category: 'config',
    summary: 'Project manifest pinning FastAPI, fhir.resources, and structlog for the patient records service.',
    content: `[project]
name = "patient-records-service"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.115.0",
    "fhir.resources>=7.1.0",
    "sqlalchemy>=2.0.35",
    "structlog>=24.4.0",
]

[dependency-groups]
dev = ["pytest>=8.3.3", "pytest-asyncio>=0.24.0", "httpx>=0.27.2", "ruff>=0.6.9"]`
  },
  {
    filename: 'models.py',
    path: 'app/models.py',
    category: 'model',
    summary: 'Internal patient record model with a to_fhir() conversion layer, kept separate from the HL7-versioned wire format.',
    content: `from sqlalchemy import String, Date
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from fhir.resources.patient import Patient as FhirPatient
from fhir.resources.humanname import HumanName
from datetime import date

class Base(DeclarativeBase): ...

class PatientRecord(Base):
    __tablename__ = "patient_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    mrn: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    family_name: Mapped[str] = mapped_column(String(100))
    given_name: Mapped[str] = mapped_column(String(100))
    birth_date: Mapped[date]

    def to_fhir(self) -> FhirPatient:
        return FhirPatient(
            id=self.mrn,
            name=[HumanName(family=self.family_name, given=[self.given_name])],
            birthDate=self.birth_date,
        )`
  },
  {
    filename: 'patients.py',
    path: 'app/routers/patients.py',
    category: 'api',
    summary: 'FHIR-compliant patient read endpoint, protected by the audit middleware applied globally.',
    content: `from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import PatientRecord
from app.deps import get_db, get_current_user

router = APIRouter()

@router.get("/patients/{mrn}")
async def get_patient(
    mrn: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    record = db.query(PatientRecord).filter(PatientRecord.mrn == mrn).first()
    if record is None:
        raise HTTPException(404, "Patient not found")

    # The phi_audit_middleware (applied globally, see middleware/audit.py)
    # already logs this access — no manual audit call needed here.
    return record.to_fhir().model_dump()`
  },
  {
    filename: 'audit.py',
    path: 'app/middleware/audit.py',
    category: 'service',
    summary: 'Global HIPAA audit-logging middleware, applied to every /patients/* request regardless of outcome.',
    content: `import time
import structlog
from fastapi import Request

audit_log = structlog.get_logger("phi_audit")

async def phi_audit_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)

    if request.url.path.startswith("/patients"):
        audit_log.info(
            "phi_access",
            user_id=getattr(request.state, "user_id", "unknown"),
            resource_path=request.url.path,
            method=request.method,
            status_code=response.status_code,
            source_ip=request.client.host if request.client else None,
            duration_ms=round((time.time() - start) * 1000, 2),
        )

    return response`
  },
  {
    filename: 'deidentify.py',
    path: 'app/services/deidentify.py',
    category: 'service',
    summary: 'Safe Harbor de-identification module, the single call site used before any analytics export.',
    content: `from dataclasses import replace
from datetime import date
from app.models import PatientRecord

def deidentify_safe_harbor(record: PatientRecord) -> PatientRecord:
    return replace(
        record,
        family_name="[REDACTED]",
        given_name="[REDACTED]",
        mrn=hash_identifier(record.mrn),
        birth_date=date(record.birth_date.year, 1, 1),
    )

def generalize_age(age: int) -> int:
    return 90 if age > 89 else age`
  },
  {
    filename: 'vitals_pipeline.py',
    path: 'app/jobs/vitals_pipeline.py',
    category: 'service',
    summary: 'Scheduled pandas pivot job turning long-format FHIR Observations into a wide-format clinical time series.',
    content: `import pandas as pd
import argparse

def build_vitals_pipeline(date_str: str, db_conn) -> pd.DataFrame:
    observations = pd.read_sql(
        "SELECT patient_id, observed_date AS date, observation_type AS type, value "
        "FROM observations WHERE observed_date = %(date)s",
        db_conn, params={"date": date_str},
    )

    wide_format = observations.pivot_table(
        index=["patient_id", "date"], columns="type", values="value"
    ).reset_index()

    print(f"Pivoted {len(observations):,} observations")
    print(f"Wide-format rows: {len(wide_format):,} patient-days")
    return wide_format

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", required=True)
    args = parser.parse_args()
    build_vitals_pipeline(args.date, get_db_connection())`
  },
  {
    filename: 'test_audit.py',
    path: 'tests/test_audit.py',
    category: 'test',
    summary: 'Integration test verifying PHI access unconditionally creates an audit log entry.',
    content: `import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_patient_access_creates_audit_entry(caplog):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(
            "/patients/mrn-test-001",
            headers={"Authorization": "Bearer test-token"},
        )

        assert response.status_code in (200, 404)
        audit_events = [r for r in caplog.records if r.msg == "phi_access"]
        assert len(audit_events) == 1
        assert audit_events[0].resource_path == "/patients/mrn-test-001"

@pytest.mark.asyncio
async def test_deidentified_export_contains_no_names():
    from app.services.deidentify import deidentify_safe_harbor
    from app.models import PatientRecord
    from datetime import date

    record = PatientRecord(mrn="mrn-1", family_name="Smith", given_name="Jane",
                            birth_date=date(1985, 3, 14))
    deidentified = deidentify_safe_harbor(record)

    assert deidentified.family_name == "[REDACTED]"
    assert deidentified.given_name == "[REDACTED]"
    assert deidentified.birth_date == date(1985, 1, 1)   # year only, per Safe Harbor`
  }
];
