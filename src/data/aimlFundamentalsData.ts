import { DeepDiveFeature } from '../types';

export interface WhyPythonWinsPoint {
  id: string;
  claim: string;
  reality: string;
}

export const WHY_PYTHON_WINS_VERDICT =
  "Python isn't fast. NumPy, PyTorch, and Pandas are fast — they're thin, ergonomic Python bindings around C, Fortran (BLAS/LAPACK), and CUDA kernels. The interpreter never touches the hot loop.";

export const WHY_PYTHON_WINS_POINTS: WhyPythonWinsPoint[] = [
  {
    id: 'thin-wrapper',
    claim: "\"Python is slow, so how does it run AI/ML at scale?\"",
    reality:
      'A single `arr * 2` on a NumPy array never executes as a Python-level loop. It dispatches one call into a compiled C ufunc that walks the underlying contiguous memory buffer directly. The CPython interpreter loop that makes plain Python loops slow (~tens of millions of ops/sec) is bypassed entirely — the actual arithmetic runs at native C speed, often further vectorized with SIMD (AVX2/AVX-512) by the BLAS backend.'
  },
  {
    id: 'gil-irrelevant',
    claim: '"Doesn\'t the GIL cripple parallel tensor math?"',
    reality:
      'The Global Interpreter Lock only blocks concurrent execution of Python *bytecode*. PyTorch, NumPy, and TensorFlow release the GIL before entering their C/C++/CUDA kernels, so multiple threads (or the CUDA driver dispatching thousands of GPU cores) run the actual math fully in parallel. The GIL is a non-issue for the 99% of runtime spent inside tensor operations — it only matters for the thin Python orchestration layer around them.'
  },
  {
    id: 'ecosystem-gravity',
    claim: '"Couldn\'t C# do the same with the right library?"',
    reality:
      "Technically yes (TorchSharp, ML.NET, Math.NET exist) — but the AI research community standardized on Python's NumPy array protocol decades ago (NumPy: 2006). Every new paper, model checkpoint format, and training framework ships a Python API first, if not exclusively. The moat isn't the language's raw speed; it's 20 years of shared array semantics, interchangeable libraries, and a research community whose default habitat is a Jupyter notebook."
  },
  {
    id: 'repl-driven',
    claim: '"Why do ML engineers live in notebooks instead of a compiled IDE workflow?"',
    reality:
      "Model development is empirical and iterative — you inspect a tensor's shape, plot a distribution, retrain with a tweaked hyperparameter, and repeat, often against multi-gigabyte datasets already loaded in memory. Python's REPL-first culture (IPython, Jupyter) keeps that state alive between edits. C#'s edit-compile-run cycle, built for static, ahead-of-time-verified systems code, actively fights this explore-then-commit workflow."
  }
];

export const AIML_FUNDAMENTALS_CONCEPTS: DeepDiveFeature[] = [
  {
    id: 'vectorization',
    number: 1,
    title: 'Vectorization: Eliminating the Explicit Loop',
    tagline: 'Replacing per-element iteration with whole-array C operations — the first reflex to unlearn from C#',
    csharpEquivalent: 'A `foreach` loop over `T[]`/`List<T>`, or `Enumerable.Select` in LINQ (still one delegate invocation per element)',
    whyItMatters: "In C#, iterating an array with a `foreach` (or LINQ `.Select()`) is the idiomatic, fast path — the JIT inlines it well. Writing the equivalent explicit `for` loop over a NumPy array in Python is idiomatic-looking but 50–100x slower than the vectorized form, because every loop iteration pays the CPython bytecode-dispatch tax per element. The fix isn't a faster loop — it's deleting the loop and expressing the operation as a whole-array expression that NumPy's C layer executes in one call.",
    csharpApproach: 'Iterate with `foreach`/`for`, or express the transform declaratively with LINQ `.Select()` — the CLR JIT compiles the loop body to native machine code either way, so both are fast.',
    pythonApproach: 'Never write `for i in range(len(arr)): arr[i] = arr[i] * 2 + 1` over a NumPy array. Express the whole transform as one array expression — `arr * 2 + 1` — which NumPy compiles into a single pass over contiguous memory in C.',
    csharpCode: `// C#: idiomatic array transform — JIT-compiled, genuinely fast either way
double[] prices = { 100.0, 105.5, 98.25, 110.0 };

// LINQ (allocates a new sequence, one delegate call per element)
double[] withTax = prices.Select(p => p * 1.08).ToArray();

// Explicit loop (equally fast — no vectorization penalty in C#)
var result = new double[prices.Length];
for (int i = 0; i < prices.Length; i++)
{
    result[i] = prices[i] * 1.08;
}`,
    pythonCode: `import numpy as np

prices = np.array([100.0, 105.5, 98.25, 110.0])

# Vectorized: one call into NumPy's C ufunc dispatch, operates on the
# whole contiguous buffer at once — this is the ONLY idiomatic form.
with_tax = prices * 1.08

# The tempting "C#-style" translation — syntactically valid, but a
# 50-100x performance regression: every "+" and "*" re-enters the
# CPython interpreter loop and re-boxes a Python float per element.
result = np.empty_like(prices)
for i in range(len(prices)):
    result[i] = prices[i] * 1.08  # AVOID — defeats the array's purpose`,
    underTheHood: "A NumPy array (`ndarray`) is a raw, contiguous, typed C buffer with shape/stride metadata — not an array of boxed `PyObject`s like a Python `list`. `prices * 1.08` dispatches to a single C \"ufunc\" (universal function) that walks that buffer with a tight, type-specialized C loop, often further SIMD-vectorized by the compiler. Indexing `prices[i]` inside a Python `for` loop, by contrast, must box each raw C double back into a heap-allocated `PyObject*` float on every single access — that boxing/unboxing overhead, repeated per element, is what erases the C speed NumPy otherwise delivers.",
    pitfalls: [
      'Writing `for i in range(len(arr))` over a NumPy array out of C# habit — this silently reverts to interpreted-Python speed, no exception is raised.',
      'Mixing Python `list` and NumPy `ndarray` in the same pipeline — `list + list` concatenates, `ndarray + ndarray` adds element-wise, and the two look identical at a glance.',
      "Calling `.append()` in a loop to build an array, then converting once at the end — each NumPy `np.append()` call reallocates and copies the entire buffer (there's no amortized-growth `List<T>`-style backing array)."
    ],
    bestPractices: [
      'Default to whole-array expressions (`arr * 2`, `np.where(cond, a, b)`, boolean masking) before ever reaching for an explicit loop.',
      'Build a Python `list` first (cheap appends) and call `np.array(the_list)` exactly once at the end, instead of growing an `ndarray` incrementally.',
      'Reach for `numba.njit` or `Cython` only when a loop is genuinely irreducible to array operations (rare) — not as a default performance escape hatch.'
    ]
  },
  {
    id: 'broadcasting',
    number: 2,
    title: 'Broadcasting: Implicit Shape-Matching Algebra',
    tagline: "NumPy's rule for combining differently-shaped arrays without writing the alignment code yourself",
    csharpEquivalent: 'No built-in equivalent — closest analogue is manually writing nested loops, or `Enumerable.Zip` for same-length sequences only',
    whyItMatters: "C#'s arrays and LINQ have no concept of combining a `double[,]` matrix with a `double[]` vector directly — you write nested loops and index arithmetic by hand, or reach for a numerics library. NumPy instead defines a precise, learnable rule (broadcasting) for when and how arrays of *different* shapes can be combined element-wise without writing a single index. Misreading this rule — not syntax errors — is the single most common source of silent shape bugs in Python numeric code.",
    csharpApproach: 'Write explicit nested `for` loops with manual bounds-checking to combine a matrix and a vector, or use a numerics library (Math.NET) with its own explicit `.Broadcast()`-equivalent API calls.',
    pythonApproach: "Rely on NumPy's broadcasting rule: compare shapes from the trailing (rightmost) dimension outward; two dimensions are compatible if they're equal, or if one of them is 1 (which is then stretched to match) — no data is actually copied, the stretch is virtual.",
    csharpCode: `// C#: combining a 3x4 matrix with a per-column bias vector
// requires an explicit nested loop — there is no shape-inference step
double[,] matrix = new double[3, 4] {
    { 1, 2, 3, 4 }, { 5, 6, 7, 8 }, { 9, 10, 11, 12 }
};
double[] bias = { 10, 20, 30, 40 }; // one value per column

var result = new double[3, 4];
for (int row = 0; row < 3; row++)
{
    for (int col = 0; col < 4; col++)
    {
        result[row, col] = matrix[row, col] + bias[col];
    }
}`,
    pythonCode: `import numpy as np

matrix = np.array([[1, 2, 3, 4],
                    [5, 6, 7, 8],
                    [9, 10, 11, 12]])       # shape (3, 4)
bias = np.array([10, 20, 30, 40])           # shape (4,)

# Broadcasting rule, compared trailing-dimension-first:
#   matrix.shape = (3, 4)
#   bias.shape   = (   4,)  -> treated as (1, 4), then row-stretched to (3, 4)
# Dimensions match (4 == 4) or one side is 1 -> compatible, no loop needed.
result = matrix + bias

# A genuinely incompatible shape raises immediately and loudly:
wrong = np.array([1, 2, 3])                 # shape (3,)
# matrix + wrong  ->  ValueError: operands could not be broadcast
#                     together with shapes (3,4) (3,)`,
    underTheHood: "Broadcasting never physically copies the smaller array's data to match the larger shape — NumPy sets its internal stride for the size-1 (or missing) dimension to 0, so the same memory address is revisited for every step along that virtual dimension. This is why broadcasting is essentially free: it's a metadata trick on top of the existing vectorized C loop from the previous concept, not a separate allocation-and-copy pass.",
    pitfalls: [
      "Assuming a shape mismatch will silently pad with zeros like some spreadsheet tools — NumPy raises `ValueError` immediately if the trailing dimensions aren't equal or 1, it never guesses.",
      'Confusing shape `(4,)` (a 1-D vector) with `(1, 4)` or `(4, 1)` — these broadcast completely differently against a matrix (row-wise vs. column-wise), and this is the #1 source of silently-wrong (not crashing) training runs.',
      'Forgetting that broadcasting applies identically inside PyTorch/TensorFlow tensor ops — a shape bug in a loss function often trains "successfully" while learning nothing.'
    ],
    bestPractices: [
      'Print `.shape` liberally while prototyping (`print(matrix.shape, bias.shape)`) — shape bugs are the dominant bug class in numeric Python, and shape mismatches are usually invisible until you look.',
      "Use `arr[:, np.newaxis]` (or `arr.reshape(-1, 1)`) to make an intended column-vector broadcast explicit, rather than relying on NumPy's default row-vector interpretation of a 1-D array.',",
      'Treat a `ValueError: operands could not be broadcast together` as a design-intent bug, not a syntax bug — it means your mental model of the data’s shape diverged from reality.'
    ]
  },
  {
    id: 'pandas-vs-linq',
    number: 3,
    title: 'Pandas DataFrames vs. LINQ-over-Collections',
    tagline: 'Columnar, vectorized tabular data manipulation vs. row-by-row object-sequence queries',
    csharpEquivalent: 'LINQ over `IEnumerable<T>` (`.Where()`, `.GroupBy()`, `.Select()`) operating on a sequence of POCOs',
    whyItMatters: 'LINQ models tabular data as a sequence of *row objects* — each `.Where()`/`.Select()` call invokes a delegate once per row. Pandas instead stores each column as a contiguous NumPy-backed buffer and models a "table" as a dict of columns, not a list of rows. A Pandas `groupby().mean()` is a columnar, vectorized C operation across an entire column; the LINQ equivalent is still fundamentally a per-row enumeration, just a well-optimized one.',
    csharpApproach: 'Model a table as `IEnumerable<Trade>` (one POCO per row) and compose `.Where(t => t.Volume > 1000).GroupBy(t => t.Symbol).Select(g => g.Average(t => t.Price))`.',
    pythonApproach: 'Load the table as a `pandas.DataFrame` (each column is a typed, contiguous array) and express the same query as vectorized column operations: `df[df.volume > 1000].groupby("symbol")["price"].mean()`.',
    csharpCode: `// C#: row-oriented — one Trade object allocated per row,
// each LINQ stage enumerates the sequence again
public record Trade(string Symbol, double Price, int Volume);

var avgPriceBySymbol = trades
    .Where(t => t.Volume > 1000)
    .GroupBy(t => t.Symbol)
    .Select(g => new { Symbol = g.Key, AvgPrice = g.Average(t => t.Price) })
    .ToList();`,
    pythonCode: `import pandas as pd

# Column-oriented — "symbol", "price", "volume" are each one
# contiguous NumPy array under the hood, not a list of row objects.
df = pd.DataFrame({
    "symbol": ["MSFT", "MSFT", "AAPL", "AAPL"],
    "price":  [410.2, 411.0, 189.5, 190.1],
    "volume": [1500,  800,   2200,  1100],
})

avg_price_by_symbol = (
    df[df["volume"] > 1000]     # vectorized boolean mask over the whole column
      .groupby("symbol")["price"]
      .mean()                  # one C-level reduction per group, not per row
)`,
    underTheHood: "`df[\"volume\"] > 1000` doesn't loop through Python row objects — it runs one vectorized comparison across the whole `volume` NumPy buffer, producing a boolean mask array in a single C pass. `.groupby()` then uses a hash-based C routine (implemented in Cython) to bucket row *indices* by key, and `.mean()` reduces each bucket's slice of the `price` column with the same vectorized C machinery as `arr.sum() / arr.size`. No Python-level object is ever created per row.",
    pitfalls: [
      'Iterating a DataFrame with `.iterrows()` out of C#-`foreach` habit — this reconstructs a boxed Python object per row on every iteration and is dramatically slower than any vectorized column operation.',
      'Chained boolean indexing that silently returns a *copy* instead of a *view* (`SettingWithCopyWarning`) — assigning back into it does nothing to the original DataFrame.',
      'Assuming column dtypes stay numeric after a `groupby`/`merge` — a single `NaN` from a missing join key silently upcasts an entire integer column to `float64`.'
    ],
    bestPractices: [
      'Reach for `.iterrows()`/`.itertuples()` only for true row-by-row side effects (e.g. calling an external API per row) — never for computing a new column.',
      'Prefer vectorized column expressions and `.apply()` only as a last resort; `.apply()` still calls a Python function per row/group under the hood.',
      'Check `df.dtypes` after joins/group-bys the way you’d check LINQ’s inferred generic type — an unexpected `object` or `float64` dtype usually signals a silent `NaN`-driven type upcast.'
    ]
  },
  {
    id: 'dtype-memory',
    number: 4,
    title: 'Fixed-Width dtypes: Trading Python’s Dynamism for C Memory Layout',
    tagline: 'Why `np.array([1, 2, 3])` behaves nothing like the Python `list` it was built from',
    csharpEquivalent: 'A C# `int[]`/`double[]` — a homogeneous, fixed-width, stack-of-value-types array, exactly what a `List<object>` is not',
    whyItMatters: "A Python `list` is an array of pointers to heap-allocated `PyObject`s — each element can be a different type, and even same-typed elements are scattered across the heap. A C# `int[]` is already what NumPy arrays imitate: contiguous, fixed-width, homogeneous. The mental adjustment for a C# developer isn't learning something new — it's recognizing that NumPy's `ndarray` is the *value-type array* semantics you already know from C#, deliberately opted into inside a language whose default container (`list`) does not have those semantics.",
    csharpApproach: 'Value-type arrays (`int[]`, `double[]`, `struct[]`) are contiguous and fixed-width by default — this requires no special opt-in, it’s simply what `T[]` means for a value type `T`.',
    pythonApproach: 'Explicitly construct a `numpy.ndarray` with a declared `dtype` (`np.int32`, `np.float64`, ...) to get that same contiguous, fixed-width layout — a plain Python `list` never has it.',
    csharpCode: `// C#: this is already a contiguous block of 4-byte ints on the heap,
// no special container needed — it's just what int[] means
int[] ids = { 1, 2, 3, 4, 5 };
Console.WriteLine(ids.GetType());   // System.Int32[]
// sizeof(int) * ids.Length == exact byte size of the buffer`,
    pythonCode: `import numpy as np

python_list = [1, 2, 3, 4, 5]
# A list of 5 pointers to 5 separately heap-allocated PyObject ints
# (each int object itself: ~28 bytes for refcount + type ptr + value)

np_array = np.array(python_list, dtype=np.int32)
# One contiguous buffer: 5 * 4 bytes = 20 bytes total, laid out exactly
# like C#'s int[] — this is the opt-in step with no C# equivalent
# because C# arrays of value types are ALWAYS already laid out this way.

print(np_array.dtype, np_array.nbytes)  # int32 20`,
    underTheHood: "`np.array([1, 2, 3])` walks the source Python list once, inspects (or is told via `dtype=`) the target element type, and allocates a single `malloc`'d buffer sized `itemsize * length`, copying each Python int's value in. From that point on, every element access reads/writes raw bytes at a computed offset (`base_ptr + i * itemsize`) — identical in spirit to how the CLR computes `ids[i]` as `base_ptr + i * sizeof(int)` for a C# value-type array. The Python `list` it was built from, by contrast, keeps storing 8-byte pointers to independently heap-allocated int objects even after the NumPy array exists alongside it.",
    pitfalls: [
      'Letting NumPy infer `dtype` from mixed-type input — a single `None` or string in the source list silently upcasts the whole array to `dtype=object`, quietly losing every vectorization benefit above.',
      'Integer overflow that wraps silently instead of throwing — `np.array([200], dtype=np.int8) + 100` wraps to a negative number exactly like unchecked C# arithmetic, with no `OverflowException` equivalent by default.',
      'Assuming `float64` everywhere — many GPU/ML pipelines default to `float32` (or `bfloat16`) for memory/speed, and mixing a `float64` NumPy array into a `float32` PyTorch tensor triggers an implicit, silently-lossy cast.'
    ],
    bestPractices: [
      'Declare `dtype=` explicitly when creating arrays that feed a training pipeline, the same way you’d choose `int` vs `long` deliberately in C# — don’t rely on inference for anything performance- or precision-sensitive.',
      'Check `.dtype` immediately after any array is built from mixed or externally-sourced data (`dtype=object` is almost always an unintended fallback, not a design choice).',
      'When crossing between NumPy and PyTorch/TensorFlow, confirm the two libraries agree on dtype (`float32` is the ML-pipeline default in both) before an operation silently promotes or truncates.'
    ]
  }
];

export interface ScientificStackTool {
  id: string;
  tool: string;
  role: string;
  csharpAnalogue: string;
  whyNoRealCsharpAnalogue?: string;
}

export const SCIENTIFIC_STACK_TOOLS: ScientificStackTool[] = [
  {
    id: 'jupyter',
    tool: 'Jupyter / IPython',
    role: 'Interactive, stateful notebook REPL — cells execute independently against a live kernel process, keeping large in-memory datasets/models loaded between edits.',
    csharpAnalogue: '.NET Interactive / Polyglot Notebooks (VS Code) — exists, but has nowhere near the ecosystem gravity or default-habitat status Jupyter has among ML researchers.',
  },
  {
    id: 'numpy',
    tool: 'NumPy',
    role: 'The foundational N-dimensional array type and vectorized math every other library in this list is built on top of.',
    csharpAnalogue: 'Math.NET Numerics, NumSharp — functionally similar, but not the universal array protocol every ML/data library in the Python ecosystem inter-operates through.',
  },
  {
    id: 'pandas',
    tool: 'Pandas',
    role: 'Labeled, columnar tabular data structures (`DataFrame`/`Series`) with vectorized filtering, grouping, joining, and time-series handling.',
    csharpAnalogue: 'Microsoft.Data.Analysis (`DataFrame`) — exists but is far less mature, with a much smaller surrounding ecosystem of readers/writers/plotting integrations.',
  },
  {
    id: 'scipy',
    tool: 'SciPy',
    role: 'Scientific algorithms built on NumPy arrays: optimization, statistics, signal processing, sparse linear algebra, spatial algorithms.',
    csharpAnalogue: 'Math.NET Numerics covers a meaningful subset (linear algebra, some statistics) but not SciPy’s full breadth (optimization, signal processing, sparse solvers).',
  },
  {
    id: 'matplotlib',
    tool: 'Matplotlib / Seaborn',
    role: 'Static and statistical plotting, rendered inline in the same notebook cell where the data was just computed — tight compute-then-visualize loop.',
    csharpAnalogue: 'OxyPlot, ScottPlot — capable plotting libraries, but not integrated into a REPL-driven, inline-rendering workflow the way Matplotlib is inside Jupyter.',
  },
  {
    id: 'scikitlearn',
    tool: 'Scikit-Learn',
    role: 'Classical ML algorithms (regression, SVM, random forest, clustering) behind one consistent `.fit()` / `.predict()` API, all operating on NumPy arrays.',
    csharpAnalogue: 'ML.NET — a genuinely comparable, actively maintained .NET framework with its own consistent pipeline API, arguably the strongest C# parallel on this whole list.',
  }
];
