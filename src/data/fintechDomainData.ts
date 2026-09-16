import { DeepDiveFeature } from '../types';

export interface FintechVerdictPoint {
  id: string;
  claim: string;
  reality: string;
}

export const FINTECH_VERDICT =
  'Python did not win fintech by being the fastest language — it won the data science and quantitative research layer (pandas, NumPy, scikit-learn) so decisively that the transaction-processing and ledger layers increasingly get built in Python too, just to keep one language across research and production. C#/.NET remains dominant in the highest-throughput, lowest-latency core banking and exchange-matching engines.';

export const FINTECH_VERDICT_POINTS: FintechVerdictPoint[] = [
  {
    id: 'where-python-wins',
    claim: '"Where does Python actually run in a real fintech stack, versus C#?"',
    reality:
      'Fraud/risk scoring models, regulatory reporting pipelines, reconciliation batch jobs, and internal analytics tooling: overwhelmingly Python (pandas + scikit-learn/XGBoost). Core ledger systems, payment gateways, and exchange matching engines at the highest-throughput tier: frequently C#/.NET or Java/C++, where microsecond-level latency and the CLR’s mature, battle-tested concurrency primitives matter more than data-science ecosystem gravity.'
  },
  {
    id: 'decimal-not-float',
    claim: '"Is a plain Python float safe to use for money?"',
    reality:
      'Never — the same reason C# engineers never use `double` for currency. Python’s `decimal.Decimal` (arbitrary-precision, base-10) is the direct equivalent of C#’s `decimal` type, and it’s a correctness requirement, not a style preference: `0.1 + 0.2 == 0.30000000000000004` in IEEE-754 floating point, in both languages, and that error compounds silently across millions of transactions.'
  },
  {
    id: 'idempotency-is-universal',
    claim: '"Does idempotent payment processing look different in Python than in C#?"',
    reality:
      "The pattern is identical: every payment-mutating endpoint accepts a client-generated idempotency key, checks a store (Redis/DB) for a prior result before processing, and returns the cached result on retry instead of double-charging. This is a distributed-systems discipline, not a language feature — Stripe's own idempotency-key API design is implemented nearly identically whether the backend is Python, C#, Ruby, or Go."
  },
  {
    id: 'compliance-not-optional',
    claim: '"Is PCI-DSS compliance a Python-specific concern?"',
    reality:
      "PCI-DSS (card data), SOX (financial reporting controls), and KYC/AML (identity verification, transaction monitoring) constraints apply identically regardless of language — what differs is tooling maturity. .NET has long-established, audited libraries for these; Python's ecosystem (e.g. `cryptography` for tokenization, dedicated KYC/AML vendor SDKs) has matured to parity for most of these needs, but due-diligence on library provenance matters more in fintech than almost any other domain."
  }
];

export const FINTECH_CONCEPTS: DeepDiveFeature[] = [
  {
    id: 'payment-processing',
    number: 1,
    title: 'Payment Processing: Idempotent, Decimal-Safe Transaction Flow',
    tagline: 'Client-generated idempotency keys and arbitrary-precision decimals — the two non-negotiables of any payment endpoint',
    csharpEquivalent: 'ASP.NET Core minimal API/controller using `decimal` for all monetary values and a Redis- or DB-backed idempotency-key middleware',
    whyItMatters: 'A payment endpoint retried by a flaky network client (or a client that never received the response) must never process the same charge twice. Idempotency keys solve this at the API contract level; `Decimal` solves the separate, equally critical problem of monetary values never being represented in binary floating point, which cannot exactly represent most base-10 fractions.',
    csharpApproach: 'Accept an `Idempotency-Key` header, look it up in a distributed cache before processing, store the `decimal`-typed result keyed by that value with a TTL, and return the cached result on a repeated key.',
    pythonApproach: 'Accept the same header via FastAPI, look it up in Redis before processing, use `decimal.Decimal` (never `float`) for every monetary calculation, and cache the serialized result under the idempotency key with a TTL.',
    csharpCode: `// C#: idempotent charge endpoint, decimal-safe throughout
public record ChargeRequest(decimal Amount, string Currency, string CardToken);

[HttpPost("/charges")]
public async Task<IActionResult> CreateCharge(
    [FromHeader(Name = "Idempotency-Key")] string idempotencyKey,
    ChargeRequest request)
{
    var cached = await _cache.GetAsync<ChargeResult>($"idem:{idempotencyKey}");
    if (cached is not null) return Ok(cached);   // safe retry, no double charge

    var result = await _paymentGateway.ChargeAsync(request.Amount, request.CardToken);
    await _cache.SetAsync($"idem:{idempotencyKey}", result, TimeSpan.FromHours(24));
    return Ok(result);
}`,
    pythonCode: `from decimal import Decimal
from fastapi import FastAPI, Header
import redis.asyncio as redis

app = FastAPI()
cache = redis.Redis()

class ChargeRequest(BaseModel):
    amount: Decimal          # NEVER float — exact base-10 precision required
    currency: str
    card_token: str

@app.post("/charges")
async def create_charge(request: ChargeRequest, idempotency_key: str = Header(...)):
    cache_key = f"idem:{idempotency_key}"
    cached = await cache.get(cache_key)
    if cached is not None:
        return json.loads(cached)          # safe retry, no double charge

    result = await payment_gateway.charge(request.amount, request.card_token)
    await cache.set(cache_key, json.dumps(result), ex=86400)   # 24h TTL
    return result`,
    underTheHood: "`decimal.Decimal` stores a coefficient and exponent (base-10) rather than a binary mantissa, exactly mirroring how C#'s `decimal` (128-bit floating decimal point) avoids IEEE-754 binary rounding error — both are specifically designed so `Decimal(\"0.10\") + Decimal(\"0.20\") == Decimal(\"0.30\")` holds exactly, which is false for `float`/`double` in every mainstream language. The idempotency check-then-cache sequence is a classic read-then-write race in a naive implementation; production systems use an atomic `SET key value NX` (Redis \"set if not exists\") to claim the key before processing even begins, preventing two concurrent retries from both slipping past the initial cache check.",
    pitfalls: [
      'Using `float`/`double` anywhere in the amount pipeline (even just for display formatting before converting back) — a single float round-trip can introduce a cent-level discrepancy that fails reconciliation days later.',
      'Checking the idempotency cache and processing the charge as two separate, non-atomic steps — two near-simultaneous retries can both pass the cache check before either has written a result, causing a real double charge.',
      'Generating the idempotency key server-side instead of requiring the client to generate and send it — defeats the entire purpose, since a genuinely lost/retried request needs the *same* key sent by the client both times.'
    ],
    bestPractices: [
      'Store amounts as `Decimal` (Python) / `decimal` (C#) from the API boundary all the way to the database column type (`NUMERIC`, never `FLOAT`) — no conversion to floating point anywhere in the pipeline.',
      'Use an atomic claim-then-process pattern (`SET NX` in Redis, or a unique DB constraint on the idempotency key) rather than a plain read-then-write check.',
      'Set a sensible idempotency-key TTL (24–48 hours is common) — long enough to cover realistic retry windows, short enough not to accumulate unbounded cache growth.'
    ]
  },
  {
    id: 'fraud-scoring',
    number: 2,
    title: 'Fraud & Risk Scoring: The Python-Native Layer',
    tagline: 'Where Python’s ML ecosystem gravity is strongest in the entire fintech stack',
    csharpEquivalent: 'ML.NET for on-platform scoring, or an ONNX-exported model consumed via ONNX Runtime for cross-language model portability',
    whyItMatters: 'Fraud/risk models are trained on historical transaction data using scikit-learn, XGBoost, or LightGBM — Python-first tools with no real C# equivalent of comparable maturity for gradient-boosted tree models specifically. The common production pattern: train in Python, export to ONNX, and serve the ONNX model from *either* a Python or C# service, decoupling the training language from the serving language entirely.',
    csharpApproach: 'Either call out to a Python-hosted scoring microservice over gRPC/REST, or load the ONNX-exported model directly into the C# transaction-processing service via `Microsoft.ML.OnnxRuntime` for zero cross-process latency.',
    pythonApproach: 'Train the model with scikit-learn/XGBoost against historical labeled transactions, export it (`joblib`/ONNX), and serve real-time scores either from a FastAPI microservice or embedded directly in the transaction-processing path if latency allows.',
    csharpCode: `// C#: consuming a Python-trained model via ONNX Runtime,
// with zero dependency on a running Python process at inference time
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

var session = new InferenceSession("fraud_model.onnx");

var input = new DenseTensor<float>(featureVector, new[] { 1, featureVector.Length });
var inputs = new List<NamedOnnxValue> {
    NamedOnnxValue.CreateFromTensor("features", input)
};

using var results = session.Run(inputs);
float fraudScore = results.First().AsTensor<float>()[0];
bool shouldBlock = fraudScore > 0.85f;`,
    pythonCode: `import xgboost as xgb
import pandas as pd

# Training (offline, on historical labeled transactions)
model = xgb.XGBClassifier(max_depth=6, n_estimators=200)
model.fit(X_train, y_train)   # X_train: pandas DataFrame of engineered features

# Export for cross-language serving — the C# service above loads THIS file
model.save_model("fraud_model.json")
# or, for full framework portability: convert to ONNX via onnxmltools

# Real-time scoring (online, inside the transaction path)
def score_transaction(features: pd.DataFrame) -> float:
    return float(model.predict_proba(features)[0][1])  # probability of fraud

fraud_score = score_transaction(current_transaction_features)
should_block = fraud_score > 0.85`,
    underTheHood: 'ONNX (Open Neural Network Exchange) defines a language-neutral computational graph format: a model trained in Python’s XGBoost/scikit-learn is compiled into this graph representation once, and ONNX Runtime (available as both a Python and a .NET package, `Microsoft.ML.OnnxRuntime`) executes that *same* graph natively in either language — the C# service pays zero cross-process/network overhead at inference time, and the Python training pipeline never needs to run in production at all. This is the standard pattern reconciling "Python has the best training ecosystem" with "C# has the lowest-latency serving infrastructure" in one architecture.',
    pitfalls: [
      'Training on data with target leakage (features only available *after* the fraud outcome is known, like a chargeback flag) — the model appears highly accurate offline and fails catastrophically on genuinely real-time transactions.',
      'Serving the raw Python model via a live network call to a Python process on the hot transaction path instead of exporting to ONNX — adds real network latency and an availability dependency on an entirely separate service for every single transaction.',
      'Retraining the fraud model without a fixed evaluation dataset and threshold-recalibration step — fraud patterns drift constantly, and an un-recalibrated model’s 0.85 threshold from six months ago may no longer represent the same false-positive rate today.'
    ],
    bestPractices: [
      'Export to ONNX specifically when the serving language differs from the training language — don’t maintain two independently-trained model implementations in two languages.',
      'Log every fraud-model decision (score, threshold, features) for the specific transaction, not just the final block/allow outcome — essential for both model debugging and regulatory audit trails.',
      'Version fraud models explicitly and keep the previous version servable behind a flag — a bad retraining rollout blocking legitimate transactions needs an immediate rollback path, not a redeploy.'
    ]
  },
  {
    id: 'ledger-reconciliation',
    number: 3,
    title: 'Ledger & Reconciliation: Double-Entry Correctness at Scale',
    tagline: 'Batch reconciliation between internal ledgers and external payment processor statements',
    csharpEquivalent: 'A scheduled `IHostedService`/Hangfire job comparing `decimal`-typed ledger entries against a processor’s settlement file',
    whyItMatters: "Every financial transaction must be recorded as a double-entry (a debit and an equal, offsetting credit) — the accounting invariant that total debits always equal total credits is what makes automated reconciliation possible at all. Pandas' vectorized `merge`/`groupby` operations are the natural fit for comparing two large transaction datasets (internal ledger vs. processor settlement file) and surfacing discrepancies, the same job LINQ's `Join`/`GroupBy` does over in-memory collections in C#, just at a different natural scale (pandas comfortably handles millions of rows in memory; LINQ-over-collections is more naturally suited to smaller in-process datasets before reaching for a database-level query).",
    csharpApproach: 'Load both datasets (internal ledger, processor settlement file) into typed collections, `Join` on a shared transaction ID, and `Where` for amount mismatches or one-sided entries — typically inside a scheduled background job.',
    pythonApproach: 'Load both datasets as pandas DataFrames, `merge()` on the shared transaction ID with `how="outer"` to surface both mismatches *and* entries missing from either side, and flag `Decimal`-precise amount discrepancies.',
    csharpCode: `// C#: LINQ-based reconciliation between internal ledger and
// processor settlement records
var mismatches = internalLedger
    .Join(processorSettlement,
          l => l.TransactionId,
          p => p.TransactionId,
          (l, p) => new { l.TransactionId, l.Amount, ProcessorAmount = p.Amount })
    .Where(x => x.Amount != x.ProcessorAmount)
    .ToList();

var missingFromProcessor = internalLedger
    .Where(l => !processorSettlement.Any(p => p.TransactionId == l.TransactionId))
    .ToList();`,
    pythonCode: `import pandas as pd

internal_ledger = pd.read_sql("SELECT transaction_id, amount FROM ledger", conn)
processor_settlement = pd.read_csv("settlement_2024_06.csv")

# Outer merge surfaces BOTH amount mismatches AND one-sided entries
# in a single vectorized operation — no explicit loop or join logic
merged = internal_ledger.merge(
    processor_settlement,
    on="transaction_id",
    how="outer",
    suffixes=("_internal", "_processor"),
    indicator=True,   # adds a "_merge" column: both / left_only / right_only
)

mismatches = merged[
    (merged["_merge"] == "both") &
    (merged["amount_internal"] != merged["amount_processor"])
]
missing_from_processor = merged[merged["_merge"] == "left_only"]`,
    underTheHood: "pandas' `merge(how=\"outer\", indicator=True)` performs a single hash-join across both DataFrames' full column buffers in one vectorized C pass, producing the `_merge` categorical column (`both`/`left_only`/`right_only`) that classifies every row's reconciliation status without any explicit iteration — functionally equivalent to a SQL `FULL OUTER JOIN`, but executed in-process against data already loaded into memory. This single operation replaces what would otherwise be three separate LINQ passes (an inner join for mismatches, plus two separate existence checks for one-sided entries) with one merge and a boolean filter.",
    pitfalls: [
      'Comparing `amount_internal != amount_processor` when either column loaded as `float64` instead of a precision-safe type — introduces false-positive mismatches from floating-point representation error, not real reconciliation discrepancies.',
      'Using an inner merge (`how="inner"`) instead of `how="outer"` — silently hides transactions that exist in only one of the two datasets, which is often the *more* financially significant class of discrepancy (a missing settlement, or a phantom internal entry).',
      'Running reconciliation on a live, still-mutating ledger table without a consistent snapshot (e.g. a point-in-time read or transaction isolation level) — produces spurious mismatches from entries that simply hadn’t settled yet, not genuine errors.'
    ],
    bestPractices: [
      'Load monetary columns explicitly as `Decimal`/fixed-precision types on read (`pd.read_sql` with an explicit dtype, not float inference) — the same discipline as the payment-processing concept above, applied to batch analytics.',
      'Always reconcile with an outer join and inspect all three categories (matched-but-mismatched, internal-only, processor-only) — each represents a structurally different failure mode requiring different remediation.',
      'Persist every reconciliation run’s discrepancy list with a timestamp, even when empty — an auditable history of "reconciliation ran clean on this date" is itself a compliance artifact, not just the discrepancies.'
    ]
  },
  {
    id: 'regulatory-reporting',
    number: 4,
    title: 'Regulatory Reporting: Structured, Auditable Output Pipelines',
    tagline: 'Generating SOX/regulator-mandated reports from transaction data with a verifiable audit trail',
    csharpEquivalent: 'A scheduled reporting service producing signed, versioned report artifacts from EF Core-queried financial data',
    whyItMatters: "Regulatory reports (transaction monitoring for AML, SOX financial controls attestation, tax reporting) share a common requirement regardless of implementation language: the exact query and transformation logic that produced a filed report must be reproducible and auditable months or years later. Python's combination of pandas for the transformation logic and a library like `great_expectations` or hand-written assertions for data-quality validation gives a reproducible, scriptable pipeline — the same reproducibility goal a versioned, tested C# reporting service achieves through source control and unit tests on the transformation logic itself.",
    csharpApproach: 'Query financial data via EF Core into strongly-typed DTOs, apply reporting transformations in versioned, unit-tested C# service methods, and emit the report to an immutable, timestamped storage location.',
    pythonApproach: 'Query financial data into a pandas DataFrame, apply transformations in a versioned, unit-tested Python module (not ad-hoc notebook cells), validate data quality assertions before emission, and write the report to an immutable, timestamped storage location.',
    csharpCode: `// C#: versioned reporting service method, unit-testable in isolation
public class SoxControlReportGenerator
{
    public SoxReport Generate(IEnumerable<LedgerEntry> entries, DateOnly periodEnd)
    {
        var flagged = entries
            .Where(e => e.Amount > ApprovalThreshold && e.ApproverId is null)
            .ToList();

        return new SoxReport(
            PeriodEnd: periodEnd,
            UnapprovedHighValueEntries: flagged,
            GeneratedAt: DateTimeOffset.UtcNow,
            GeneratorVersion: ThisAssembly.InformationalVersion  // for audit trail
        );
    }
}`,
    pythonCode: `import pandas as pd
from datetime import datetime, timezone

REPORT_GENERATOR_VERSION = "2.3.1"   # bumped + tagged on every logic change
APPROVAL_THRESHOLD = Decimal("10000.00")

def generate_sox_control_report(entries: pd.DataFrame, period_end: date) -> dict:
    # Vectorized filter — the same "flag unapproved high-value entries"
    # rule, expressed as a boolean mask instead of a LINQ .Where()
    flagged = entries[
        (entries["amount"] > APPROVAL_THRESHOLD) &
        (entries["approver_id"].isna())
    ]

    # Data-quality assertion BEFORE emitting a regulator-facing report
    assert not flagged["transaction_id"].duplicated().any(), \\
        "Duplicate transaction IDs in flagged set — report generation aborted"

    return {
        "period_end": period_end.isoformat(),
        "unapproved_high_value_entries": flagged.to_dict("records"),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generator_version": REPORT_GENERATOR_VERSION,   # for audit trail
    }`,
    underTheHood: 'A regulator or internal auditor reproducing a filed report months later needs three things preserved together: the exact input data snapshot, the exact transformation code version, and the exact output — which is why both implementations stamp a `GeneratorVersion`/`generator_version` onto every report artifact, tying the output permanently to a specific, source-controlled version of the transformation logic. This is a process/discipline requirement, not a language capability; Python’s advantage here is purely that pandas expresses the filtering/aggregation transformations (`entries[mask]`, `.groupby().agg()`) in fewer, more directly-reviewable lines than the equivalent hand-written LINQ pipeline for genuinely complex multi-condition regulatory rules.',
    pitfalls: [
      'Writing regulatory transformation logic directly in an interactive notebook cell, run manually, with no version control or unit tests — makes "reproduce exactly what produced this specific filed report" effectively impossible months later.',
      'Silently coercing `NaN`/`None` values in a numeric column during a `groupby` aggregation without an explicit data-quality check first — a missing approver ID or amount can silently vanish from a sum instead of correctly flagging an incomplete record.',
      'Running data-quality assertions (`assert`) that get stripped in a Python "optimized" run (`python -O`, which strips `assert` statements) — use an explicit validation library or exception, not a bare `assert`, for anything that must never be silently skipped.'
    ],
    bestPractices: [
      'Treat regulatory report generation code with the same rigor as production payment code: version control, code review, and unit tests against known-good fixture data — never an ungoverned notebook.',
      'Stamp every generated report with the exact code version and a content hash of the input data snapshot, giving auditors a verifiable chain from filed report back to source data and logic.',
      'Replace bare `assert` statements with an explicit validation library (`pandera`, `great_expectations`) or raised exceptions for any check that absolutely must run in every environment, including an optimized production build.'
    ]
  }
];

export interface ComplianceItem {
  id: string;
  regulation: string;
  concern: string;
  pythonTooling: string;
}

export const FINTECH_COMPLIANCE_TABLE: ComplianceItem[] = [
  { id: 'pci-dss', regulation: 'PCI-DSS', concern: 'Cardholder data must never be stored in plaintext; tokenization required for any stored card reference.', pythonTooling: 'Never store raw card numbers at all — use the payment processor’s tokenization API (Stripe/Adyen SDKs) so your service only ever handles opaque tokens.' },
  { id: 'sox', regulation: 'SOX (Sarbanes-Oxley)', concern: 'Financial reporting controls must be auditable, with segregation of duties and change-tracked reporting logic.', pythonTooling: 'Version-controlled, code-reviewed reporting pipelines (as in the Regulatory Reporting concept above) with immutable, timestamped report artifacts.' },
  { id: 'kyc-aml', regulation: 'KYC / AML', concern: 'Identity verification at onboarding and ongoing transaction monitoring for suspicious activity patterns.', pythonTooling: 'Third-party KYC/AML vendor SDKs (identity verification) plus custom pandas/scikit-learn transaction-monitoring pipelines for pattern detection.' },
  { id: 'gdpr-ccpa', regulation: 'GDPR / CCPA', concern: 'Customer financial data subject to right-to-erasure and data-minimization requirements.', pythonTooling: 'Explicit data-retention policies enforced at the ORM/database layer (SQLAlchemy soft-delete + scheduled hard-delete jobs), not just documentation.' },
  { id: 'pos-basel', regulation: 'Basel III (banking)', concern: 'Capital adequacy and risk-weighted asset calculations for regulated banking entities.', pythonTooling: 'NumPy/pandas-based quantitative risk models, often the same ecosystem used for fraud scoring, applied to portfolio-level risk aggregation.' }
];
