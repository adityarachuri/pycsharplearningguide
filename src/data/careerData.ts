export interface SalaryBenchmark {
  role: string;
  experienceYears: string;
  indiaSalaryLPA: string;
  globalSalaryUSD: string;
  marketDemand: 'High' | 'Very High' | 'Critical';
  coreSkills: string[];
}

export const SALARY_BENCHMARKS: SalaryBenchmark[] = [
  {
    role: 'Junior / Associate Python Engineer',
    experienceYears: '1–3 Years',
    indiaSalaryLPA: '6 – 14 LPA',
    globalSalaryUSD: '$75k – $105k',
    marketDemand: 'High',
    coreSkills: ['Python 3.10+', 'FastAPI or Django', 'SQLAlchemy / PostgreSQL', 'Git & Docker']
  },
  {
    role: 'Senior Python Backend Engineer',
    experienceYears: '4–7 Years',
    indiaSalaryLPA: '18 – 35 LPA',
    globalSalaryUSD: '$120k – $165k',
    marketDemand: 'Very High',
    coreSkills: ['FastAPI / Uvicorn', 'Pydantic v2', 'Asyncio & uvloop', 'Redis caching', 'Pytest', 'CI/CD']
  },
  {
    role: 'Staff / Lead Python Architect',
    experienceYears: '8–12 Years',
    indiaSalaryLPA: '38 – 65 LPA',
    globalSalaryUSD: '$175k – $250k',
    marketDemand: 'Very High',
    coreSkills: ['Clean Architecture / DDD', 'Microservices resilience', 'Kafka / Event-driven systems', 'Observability (OpenTelemetry)', 'Cloud native (AWS/Azure/GCP)']
  },
  {
    role: 'AI / GenAI Platform Architect',
    experienceYears: '10–15+ Years',
    indiaSalaryLPA: '60 – 1.2 Cr+ LPA',
    globalSalaryUSD: '$240k – $400k+',
    marketDemand: 'Critical',
    coreSkills: ['LLM Serving (vLLM, Triton)', 'PyTorch & CUDA internals', 'Vector DBs (Qdrant/Milvus)', 'RAG pipelines', 'High-throughput GPU clusters']
  },
  {
    role: 'High-Volume Data Engineer (Polars/Arrow)',
    experienceYears: '5–10 Years',
    indiaSalaryLPA: '25 – 52 LPA',
    globalSalaryUSD: '$140k – $210k',
    marketDemand: 'High',
    coreSkills: ['Polars & Apache Arrow', 'DuckDB & Spark', 'Prefect / Airflow', 'Parquet / Delta Lake', 'Cloud data lakehouses']
  }
];

export const INDIA_TECH_LANDSCAPE = [
  {
    hub: 'Bengaluru (Silicon Valley of India)',
    type: 'GCCs, AI Startups & Tech Unicorns',
    companies: 'Google, Microsoft IDC, Amazon, Swiggy, Zerodha, Razorpay, PhonePe, Sarvam AI, Flipkart',
    hiringTrends: 'Massive demand for Python engineers who understand high-scale microservices, asynchronous programming, and generative AI agent orchestration. High appetite for senior architects who can lead AI platform migrations.'
  },
  {
    hub: 'Hyderabad (Cyberabad)',
    type: 'FinTech GCCs & Global Cloud Giants',
    companies: 'Microsoft R&D, Amazon, Wells Fargo, Goldman Sachs, State Street, ServiceNow, D.E. Shaw',
    hiringTrends: 'Heavy concentration of quantitative finance and enterprise cloud capability centers. C# developers with strong data structures and SQL skills who transition to Python are actively recruited for financial analytics and cloud automation.'
  },
  {
    hub: 'Pune & Mumbai',
    type: 'BFSI, FinTech & Automotive Platforms',
    companies: 'Barclays, Deutsche Bank, Morgan Stanley, Citi, Tata Motors Digital, Mastercard',
    hiringTrends: 'Focus on regulatory compliance, risk modeling pipelines, and payment processing backends. Strong premium for engineers experienced in transitioning monolithic legacy systems to modern Python microservices.'
  },
  {
    hub: 'NCR (Gurugram & Noida)',
    type: 'Consumer Tech, Enterprise SaaS & E-commerce',
    companies: 'Zomato, MakeMyTrip, Paytm, Airtel Digital, OYO, multinational consulting firms',
    hiringTrends: 'High velocity feature development, AI-enabled customer workflows, and massive traffic scaling. Value placed on candidates with rapid prototyping abilities.'
  },
  {
    hub: 'Chennai',
    type: 'SaaS Powerhouses & Industrial Software',
    companies: 'Zoho, Freshworks, Caterpillar, Ford Digital, PayPal Chennai Center',
    hiringTrends: 'Emphasis on product-engineering longevity, clean code, and scalable multi-tenant architecture.'
  }
];

export const CSHARP_ENGINEER_EDGE = {
  title: 'Why Experienced C# Engineers Have a Massive Edge in the Python Market',
  strengths: [
    {
      title: 'Systems & Distributed Architecture Mastery',
      detail: 'Many self-taught Python developers only know how to assemble libraries without understanding socket lifecycles, memory leaks, or thread starvation. C# engineers bring years of deep CLR systems thinking.'
    },
    {
      title: 'Enterprise Rigor (SOLID, DDD, Clean Architecture)',
      detail: 'C# developers instinctively write modular code, isolate domains with dependency inversion, and handle edge-case exceptions. Bringing this discipline to Python codebases prevents the dreaded "spaghetti script" trap.'
    },
    {
      title: 'Real Multi-Threading & Concurrency Foundation',
      detail: 'Having worked with OS threads, async state machines, and synchronization primitives in .NET, C# developers understand race conditions, deadlocks, and why the GIL exists far better than pure scripting developers.'
    },
    {
      title: 'Database & Transactional Integrity',
      detail: 'Experience with SQL Server, EF Core query plans, indexing strategies, and ACID transactions enables C# developers to build robust SQLAlchemy 2.0 backends that do not fall over under production traffic.'
    }
  ],
  interviewAdvice: [
    'Do NOT write C# in Python syntax: Avoid creating unnecessary abstract factories, verbose getter/setter methods, or over-nested classes during live coding interviews.',
    'Embrace Pythonic idiomatic code: Use comprehensions, enumerate(), zip(), context managers, and dataclasses naturally.',
    'Demonstrate deep awareness of the GIL: When asked about concurrency, explain the difference between asyncio for I/O and multiprocessing / C-extensions for CPU work.',
    'Showcase modern tooling: Mention `uv`, `ruff`, `pydantic v2`, and `pyproject.toml` instead of outdated tools like `pip-tools` or `setup.py`.'
  ]
};
