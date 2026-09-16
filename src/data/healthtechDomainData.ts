import { DeepDiveFeature } from '../types';

export interface HealthtechVerdictPoint {
  id: string;
  claim: string;
  reality: string;
}

export const HEALTHTECH_VERDICT =
  "Healthcare software has two nearly disjoint Python footprints: clinical research and data science (overwhelming Python, via pandas/scikit-learn/PyTorch for everything from readmission-risk models to medical imaging), and production EHR/interoperability systems (a genuine split between Python and C#/Java, with Epic's own backend famously built on a MUMPS/Caché database that neither language touches directly — both integrate with it exclusively through HL7/FHIR APIs).";

export const HEALTHTECH_VERDICT_POINTS: HealthtechVerdictPoint[] = [
  {
    id: 'fhir-is-the-integration-point',
    claim: '"If Epic runs on MUMPS, how does a Python or C# service talk to it at all?"',
    reality:
      "Neither language integrates with a hospital's core EHR database directly — FHIR (Fast Healthcare Interoperability Resources), a REST/JSON-based standard, is the universal integration layer every major EHR vendor (Epic, Cerner/Oracle Health) exposes. A Python service uses the `fhir.resources` library; a C# service uses the Firely .NET SDK — both are typed wrappers around the same standardized FHIR resource schemas (Patient, Observation, MedicationRequest), so the integration code looks structurally similar regardless of language."
  },
  {
    id: 'deidentification-is-a-legal-requirement',
    claim: '"Is de-identifying patient data just a nice-to-have for analytics?"',
    reality:
      'HIPAA’s Safe Harbor method defines 18 specific identifier categories (names, dates more granular than year, geographic subdivisions smaller than state, etc.) that must be removed or generalized before health data can be used for research or analytics without being subject to the full Privacy Rule. This isn’t a best practice — improperly de-identified data used outside its authorized purpose is a reportable HIPAA violation with real financial penalties, regardless of whether the mishandling was in Python or C#.'
  },
  {
    id: 'audit-trails-are-mandatory',
    claim: '"Why do healthtech systems log every single record access, not just writes?"',
    reality:
      'HIPAA’s Security Rule requires audit controls that record and examine activity in systems containing PHI (Protected Health Information) — including *read* access, not just modifications, specifically to detect unauthorized snooping (a well-documented real-world problem: employees looking up celebrity or family-member records without a treatment relationship). This access-logging requirement shapes the architecture identically in Python or C# — every PHI read path needs an append-only audit log entry, not just writes.'
  },
  {
    id: 'imaging-is-pytorch-territory',
    claim: '"Where does deep learning actually show up in a hospital’s software stack?"',
    reality:
      'Medical imaging analysis (radiology triage, pathology slide classification) is almost exclusively PyTorch/TensorFlow-based Python, trained on DICOM-format imaging data, frequently deployed via the MONAI framework (a PyTorch-based medical imaging toolkit built by NVIDIA/King’s College London specifically for this domain). This is one of the clearest cases in all of healthtech where there is no real C# equivalent ecosystem — the research and the production imaging pipeline both stay in Python.'
  }
];

export const HEALTHTECH_CONCEPTS: DeepDiveFeature[] = [
  {
    id: 'fhir-interoperability',
    number: 1,
    title: 'FHIR Interoperability: Typed Resources Over a Standard Schema',
    tagline: 'Talking to any EHR vendor through one standardized, typed resource model',
    csharpEquivalent: 'The Firely .NET SDK (Hl7.Fhir.R4) — the .NET ecosystem’s equivalent typed FHIR resource library',
    whyItMatters: 'Before FHIR (finalized as a stable standard around 2019), healthcare interoperability meant hand-parsing HL7 v2 pipe-delimited messages — a genuinely painful, loosely-typed format. FHIR resources (Patient, Observation, Condition, MedicationRequest) are strongly-typed, versioned, and validated against a published schema in both Python’s `fhir.resources` (Pydantic-based) and C#’s Firely SDK, which is why integration code for a Patient record looks remarkably similar in both ecosystems today.',
    csharpApproach: 'Use the Firely SDK’s `Patient` POCO-style resource classes, deserialized from a FHIR server’s JSON response via `FhirJsonParser`, with schema validation built into the type system.',
    pythonApproach: 'Use the `fhir.resources` package’s Pydantic-based `Patient` model, which validates incoming JSON against the FHIR R4 schema automatically at parse time — identical to how any other Pydantic model validates a FastAPI request body.',
    csharpCode: `// C#: Firely SDK — typed FHIR resource parsing and validation
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;

var parser = new FhirJsonParser();
Patient patient = parser.Parse<Patient>(fhirJsonResponse);

string familyName = patient.Name.FirstOrDefault()?.Family ?? "Unknown";
var activeConditions = patient.Contained
    .OfType<Condition>()
    .Where(c => c.ClinicalStatus.Coding.Any(code => code.Code == "active"));`,
    pythonCode: `from fhir.resources.patient import Patient
from fhir.resources.condition import Condition
import httpx

response = httpx.get(f"{fhir_server_url}/Patient/{patient_id}")
# Pydantic-based validation against the FHIR R4 schema happens HERE,
# at construction — malformed resources raise a ValidationError
# immediately, the same guarantee Firely's parser gives in C#.
patient = Patient.model_validate(response.json())

family_name = patient.name[0].family if patient.name else "Unknown"
active_conditions = [
    c for c in patient_conditions
    if any(coding.code == "active" for coding in c.clinicalStatus.coding)
]`,
    underTheHood: "Both `fhir.resources` and the Firely SDK are code-generated (or schema-driven) directly from HL7's published FHIR StructureDefinition resources — the canonical, machine-readable schema HL7 itself maintains for every resource type. This is why upgrading from FHIR R4 to R5 support in either library is a dependency version bump rather than a hand-written migration: the type definitions themselves are regenerated from the updated official schema, not maintained by hand in either ecosystem.",
    pitfalls: [
      'Assuming a "Patient" resource always has a family name, birth date, or any specific field populated — FHIR resources model real-world data incompleteness explicitly; nearly every field is optional (`Optional[...]` / nullable), and code must handle absence, not just validate presence once.',
      'Hardcoding a specific FHIR version’s field shape without checking the server’s declared `CapabilityStatement` — different EHR vendors (and different versions of the same vendor) may support R4 vs R4B vs R5 with genuinely different resource shapes.',
      'Treating a successful FHIR resource parse as proof the *data* is clinically correct — schema validation only confirms structural conformance (right types, right cardinality), never clinical plausibility (an impossible birth date is schema-valid).'
    ],
    bestPractices: [
      'Always check a FHIR server’s `CapabilityStatement` (`GET /metadata`) before assuming which resources/versions/search parameters it supports — treat it the way you’d treat an OpenAPI spec for a REST API.',
      'Model optional FHIR fields as genuinely optional in your own downstream code, with explicit fallback/default handling, rather than assuming population.',
      'Use `fhir.resources`’ (or Firely’s) built-in validation as your *first* defense, but add domain-specific clinical plausibility checks separately — schema-valid is not the same guarantee as clinically-sensible.'
    ]
  },
  {
    id: 'phi-deidentification',
    number: 2,
    title: 'PHI De-identification: HIPAA Safe Harbor in Code',
    tagline: 'Systematically removing or generalizing the 18 HIPAA-defined identifier categories before data leaves a clinical system',
    csharpEquivalent: 'A dedicated de-identification service/library applying the same Safe Harbor rule set, typically hand-built or via a healthcare-specific NuGet package',
    whyItMatters: "HIPAA's Safe Harbor method (45 CFR §164.514(b)(2)) is a specific, enumerated checklist — not a vague \"remove PII\" instruction. It requires removing or generalizing all 18 categories: names, all geographic subdivisions smaller than a state, all elements of dates more specific than year (including age for patients over 89), phone/fax numbers, and more. This is implementable as a deterministic, testable function in either language; Python’s ecosystem has purpose-built libraries (`presidio` from Microsoft, or hand-rolled regex/rule sets) but the underlying rule set is identical to whatever a C# implementation would enforce.",
    csharpApproach: 'Implement (or use a library implementing) the 18-category Safe Harbor removal rules as a transformation applied to any dataset before it leaves the clinical system boundary for research/analytics use.',
    pythonApproach: 'Apply the same 18-category rule set via a library like Microsoft’s `presidio-analyzer`/`presidio-anonymizer` (works in Python and has broad healthcare adoption), or explicit field-by-field transformation logic for structured data.',
    csharpCode: `// C#: explicit Safe Harbor field transformation for structured data
public class SafeHarborDeidentifier
{
    public PatientRecord Deidentify(PatientRecord record)
    {
        return record with
        {
            Name = null,                                    // category 1: names
            BirthDate = new DateOnly(record.BirthDate.Year, 1, 1),  // category 3: dates -> year only
            ZipCode = TruncateToThreeDigits(record.ZipCode), // category 2: geo subdivision
            Age = record.Age > 89 ? 90 : record.Age,         // category 3: ages over 89 -> "90+"
            Phone = null,                                     // category 4
            Mrn = HashIdentifier(record.Mrn),                 // category 8: medical record numbers
        };
    }
}`,
    pythonCode: `from dataclasses import replace
from datetime import date

def deidentify_safe_harbor(record: PatientRecord) -> PatientRecord:
    return replace(
        record,
        name=None,                                          # category 1: names
        birth_date=date(record.birth_date.year, 1, 1),      # category 3: dates -> year only
        zip_code=record.zip_code[:3] + "00",                 # category 2: geo subdivision
        age=90 if record.age > 89 else record.age,           # category 3: ages over 89 -> "90+"
        phone=None,                                           # category 4
        mrn=hash_identifier(record.mrn),                      # category 8: medical record numbers
    )
    # Note: this covers a SUBSET of the 18 categories for illustration —
    # a real implementation must handle all 18 explicitly, including
    # rare categories like vehicle identifiers, biometric identifiers,
    # and full-face photographs.`,
    underTheHood: 'Safe Harbor is deliberately a *rule-based*, not a statistical or ML-based, de-identification method — which is exactly why it’s implementable as a deterministic, unit-testable function rather than requiring a trained model (that’s the alternative "Expert Determination" method, which does use statistical disclosure-risk analysis and genuinely can involve ML). Because the rule set is enumerated by federal regulation rather than invented per-project, the same 18-category checklist is the correct reference implementation regardless of language — the value either ecosystem’s library adds is completeness (catching all 18 categories reliably) and maintenance as the regulation is clarified, not novel de-identification logic.',
    pitfalls: [
      'Implementing only the "obvious" categories (name, address) and missing less-obvious ones like vehicle identifiers, device serial numbers, or biometric identifiers — an incomplete Safe Harbor implementation is not legally compliant, even if it feels sufficient.',
      'De-identifying a dataset once and treating it as permanently safe, without considering re-identification risk from *combining* it with other, separately de-identified datasets — Safe Harbor addresses single-dataset disclosure risk, not cross-dataset linkage risk.',
      'Truncating a ZIP code to three digits without also checking the "sparse population" exception — Safe Harbor additionally requires the *initial three digits* be changed to "000" for any ZIP code area with a population of 20,000 or fewer, an easy-to-miss sub-rule.'
    ],
    bestPractices: [
      'Implement de-identification as one centralized, thoroughly unit-tested module covering all 18 categories explicitly — never as scattered, ad-hoc field-stripping logic across multiple call sites.',
      'Treat the de-identification function itself as PHI-adjacent code requiring the same code-review rigor as the payment-processing code in a fintech system — a bug here is a compliance incident, not just a functional bug.',
      'When in doubt about whether a specific data element counts as an identifier, consult HHS’s own published Safe Harbor guidance directly rather than inferring from example implementations — the full 18-category list has genuine edge cases.'
    ]
  },
  {
    id: 'hipaa-audit-logging',
    number: 3,
    title: 'HIPAA Audit Logging: Append-Only Access Trails',
    tagline: 'Recording every PHI read, not just writes, as a legal requirement rather than an operational nicety',
    csharpEquivalent: 'ASP.NET Core middleware writing to an append-only audit table/log store on every PHI-touching endpoint',
    whyItMatters: 'Most application audit logging focuses on writes (who changed what). HIPAA’s Security Rule specifically requires logging *access* — including reads — to detect unauthorized viewing of patient records by staff without a legitimate treatment relationship, a genuinely common real-world violation category (\"snooping\" on a celebrity or family member’s chart). This shapes the architecture: every PHI-serving endpoint needs an audit log write as a side effect of the *read* path, not only the write path, in either language.',
    csharpApproach: 'Implement audit logging as ASP.NET Core middleware or an action filter wrapping every PHI-touching endpoint, writing an immutable audit record (who, what resource, when, from where) to an append-only store, independent of the endpoint’s own business logic.',
    pythonApproach: 'Implement audit logging as a FastAPI dependency (or middleware) applied to every PHI-touching route, writing the same immutable audit record to an append-only store — structured so the audit write cannot be silently skipped by forgetting to add it manually per-endpoint.',
    csharpCode: `// C#: audit logging as middleware, applied uniformly — cannot be
// accidentally omitted per-endpoint the way an inline log call could be
public class PhiAuditMiddleware
{
    private readonly RequestDelegate _next;
    public PhiAuditMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, IAuditLogStore auditStore)
    {
        if (context.Request.Path.StartsWithSegments("/patients"))
        {
            await auditStore.RecordAsync(new AuditEntry(
                UserId: context.User.FindFirst("sub")?.Value ?? "unknown",
                ResourcePath: context.Request.Path,
                AccessedAt: DateTimeOffset.UtcNow,
                SourceIp: context.Connection.RemoteIpAddress?.ToString()
            ));
        }
        await _next(context);
    }
}`,
    pythonCode: `from fastapi import Request
import time

async def phi_audit_middleware(request: Request, call_next):
    response = await call_next(request)

    if request.url.path.startswith("/patients"):
        # Write happens regardless of response status — even a failed
        # or unauthorized attempt to access PHI is itself an auditable event.
        await audit_store.record(AuditEntry(
            user_id=request.state.user_id if hasattr(request.state, "user_id") else "unknown",
            resource_path=request.url.path,
            accessed_at=time.time(),
            source_ip=request.client.host if request.client else None,
            response_status=response.status_code,
        ))

    return response

app.middleware("http")(phi_audit_middleware)`,
    underTheHood: 'Applying audit logging as middleware/a global dependency rather than an inline call inside each endpoint handler is a deliberate architectural choice in both ecosystems: it makes the audit trail *structurally impossible to accidentally omit* when a new PHI-touching endpoint is added later, versus relying on every future developer remembering to add a manual log call. The audit store itself is typically append-only at the database level (an insert-only table with no UPDATE/DELETE grants for the application role) specifically so a compromised or malicious application process cannot cover its own tracks by altering historical access records.',
    pitfalls: [
      'Logging only successful (200-status) PHI access and skipping failed/unauthorized attempts — a pattern of repeated 403s against a specific patient record is itself a security signal that must be captured, not discarded.',
      'Storing audit logs in the same database/table the application can freely UPDATE or DELETE from — defeats the tamper-evidence purpose; the audit store needs genuinely separate, more restrictive write permissions than normal application data.',
      'Logging the full patient record content into the audit entry "for context" — the audit log itself then becomes a second copy of PHI requiring its own full HIPAA-compliant handling, when it should typically just reference the resource ID.'
    ],
    bestPractices: [
      'Implement PHI audit logging as global middleware/a dependency applied by path pattern, never as a per-endpoint manual call — removes the "did the developer remember" failure mode entirely.',
      'Log resource *identifiers*, not resource *content*, in audit entries — avoids duplicating PHI into a second store that then needs its own compliance handling.',
      'Grant the application’s database role INSERT-only permission on the audit table (no UPDATE/DELETE) at the database level, not just as an application-level convention.'
    ]
  },
  {
    id: 'clinical-data-pipelines',
    number: 4,
    title: 'Clinical Data Pipelines: Lab Results & Vitals as Time Series',
    tagline: 'Structuring irregular, multi-source clinical observations into analyzable time-series data',
    csharpEquivalent: 'A scheduled ETL service using LINQ/EF Core to reshape HL7/FHIR Observation resources into a reporting schema',
    whyItMatters: 'Clinical observations (lab results, vital signs) arrive as a stream of individually-timestamped FHIR `Observation` resources, not a clean tabular time series — different measurement types at irregular intervals, from potentially multiple source systems. Turning this into an analyzable time series (for a readmission-risk model, a clinical dashboard, or a research dataset) is fundamentally a pivot/reshape operation, which pandas’ `pivot_table` expresses far more directly than the equivalent hand-written LINQ grouping-and-reshaping logic.',
    csharpApproach: 'Query FHIR Observation resources via the Firely SDK, group by patient and measurement type in LINQ, and manually reshape into a wide-format table (one row per patient-timepoint, one column per measurement type).',
    pythonApproach: 'Query the same Observation resources, load into a long-format pandas DataFrame (one row per individual observation), and use `pivot_table` to reshape into the wide-format time series in one vectorized call.',
    csharpCode: `// C#: manual reshape of long-format observations into a wide
// per-patient time series — explicit grouping and dictionary building
var wideFormat = observations
    .GroupBy(o => (o.PatientId, o.Timestamp.Date))
    .Select(g => new PatientDayVitals
    {
        PatientId = g.Key.PatientId,
        Date = g.Key.Date,
        HeartRate = g.FirstOrDefault(o => o.Type == "heart-rate")?.Value,
        Systolic = g.FirstOrDefault(o => o.Type == "systolic-bp")?.Value,
        Diastolic = g.FirstOrDefault(o => o.Type == "diastolic-bp")?.Value,
    })
    .ToList();`,
    pythonCode: `import pandas as pd

# Long format: one row per individual FHIR Observation — exactly how
# the data naturally arrives from a FHIR server's Observation query
observations = pd.DataFrame([
    {"patient_id": "p1", "date": "2024-06-01", "type": "heart-rate", "value": 78},
    {"patient_id": "p1", "date": "2024-06-01", "type": "systolic-bp", "value": 122},
    {"patient_id": "p1", "date": "2024-06-01", "type": "diastolic-bp", "value": 80},
])

# pivot_table reshapes long -> wide in one vectorized call — what the
# C# code above builds with an explicit GroupBy + manual field assembly
wide_format = observations.pivot_table(
    index=["patient_id", "date"], columns="type", values="value"
).reset_index()
# Result: one row per patient-day, one column per measurement type —
# directly usable as model input features or a clinical dashboard row.`,
    underTheHood: "`pivot_table`'s implementation is a hash-based group-by (on the index columns) combined with a reshape of the `type` column's distinct values into new output columns — conceptually the same operation as the C# `GroupBy` + manual field-by-field assembly, but expressed as a single declarative reshape rather than an explicit loop over measurement types. This matters more as the number of distinct observation types grows: the pandas version doesn't need a new explicitly-named field added to the reshape logic every time a new lab test type is introduced, since `pivot_table` derives output columns from the data’s actual distinct `type` values rather than a hardcoded list.",
    pitfalls: [
      'Assuming every patient-day has a value for every measurement type after pivoting — `pivot_table` correctly produces `NaN` for missing combinations, and downstream model/dashboard code must handle that explicitly, not assume a dense matrix.',
      'Pivoting on raw observation *timestamps* instead of a meaningfully bucketed time unit (day, hour) when readings arrive at genuinely irregular sub-second intervals from bedside monitors — produces a mostly-empty, unusably sparse pivot.',
      'Silently dropping duplicate observations (the same measurement type recorded twice for the same patient-day from two source systems) during the pivot — `pivot_table`’s default aggregation (mean) can mask a genuine data-quality issue worth surfacing instead.'
    ],
    bestPractices: [
      'Explicitly choose and document the pivot’s aggregation function (`aggfunc=`) for any measurement type where duplicates are possible — don’t rely on the default silently averaging clinically distinct duplicate readings.',
      'Bucket high-frequency bedside-monitor data (heart rate, SpO2 sampled every few seconds) into a coarser time window before pivoting — pivot directly on raw timestamps only for genuinely discrete, infrequent measurements like daily labs.',
      'Explicitly handle `NaN` from missing measurement combinations as a first-class signal (a lab genuinely wasn’t drawn that day) in any downstream model, not as an error condition to silently fill.'
    ]
  }
];

export interface HealthComplianceItem {
  id: string;
  regulation: string;
  concern: string;
  pythonTooling: string;
}

export const HEALTHTECH_COMPLIANCE_TABLE: HealthComplianceItem[] = [
  { id: 'hipaa-privacy', regulation: 'HIPAA Privacy Rule', concern: 'Governs use and disclosure of Protected Health Information (PHI); mandates de-identification (Safe Harbor or Expert Determination) before non-treatment use.', pythonTooling: 'Centralized Safe Harbor de-identification module (as in the concept above), applied before any data reaches an analytics or research pipeline.' },
  { id: 'hipaa-security', regulation: 'HIPAA Security Rule', concern: 'Requires technical safeguards: access controls, audit controls, transmission security, and encryption for PHI at rest and in transit.', pythonTooling: 'Append-only audit-log middleware on every PHI endpoint, TLS-everywhere, and encryption at rest via the database/cloud provider’s native encryption.' },
  { id: 'hitech', regulation: 'HITECH Act', concern: 'Extends HIPAA with breach notification requirements and increased penalties; incentivizes EHR adoption and meaningful use.', pythonTooling: 'Breach-detection alerting built on the same audit log (anomalous access-pattern detection), feeding a notification workflow if a breach is confirmed.' },
  { id: 'fda-part11', regulation: '21 CFR Part 11 (FDA)', concern: 'For systems supporting clinical trials/regulated medical devices: requires electronic records and signatures to be trustworthy, tamper-evident, and attributable.', pythonTooling: 'Append-only, cryptographically-hashed audit trails and explicit electronic-signature capture workflows for any regulated clinical trial data system.' },
  { id: 'gdpr-health', regulation: 'GDPR Article 9 (EU)', concern: 'Health data is a "special category" requiring explicit consent and heightened protection for any EU patient data.', pythonTooling: 'Explicit consent-tracking fields on patient records plus the same de-identification/audit patterns, applied to any EU-resident patient data specifically.' }
];
