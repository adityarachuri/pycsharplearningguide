import { DeepDiveFeature } from '../types';

export const DEEP_LEARNING_VERDICT =
  '"Deep learning" is not one job. The person who trains a novel architecture and the person who puts a trained model into production reliably serving 50,000 requests/second are both "doing deep learning" — but they read different papers, use different tools, and are measured by different numbers. This chapter maps both ends of that spectrum, and the shared PyTorch foundation underneath both of them.';

// ---------------------------------------------------------------------------
// Section 1: Neural network foundations (shared by both tracks)
// ---------------------------------------------------------------------------

export const NEURAL_NETWORK_CONCEPTS: DeepDiveFeature[] = [
  {
    id: 'perceptron-to-mlp',
    number: 1,
    title: 'From a Single Neuron to a Multi-Layer Perceptron',
    tagline: 'A neural network layer is a matrix multiply plus a nonlinearity — nothing more mystical than that',
    csharpEquivalent: 'No direct built-in equivalent — closest is manually composing `Matrix.Multiply()` calls from Math.NET Numerics, or a `TorchSharp.nn.Linear` layer if using .NET\'s libtorch binding',
    whyItMatters: 'Every layer in a neural network — no matter how large the model — is fundamentally the same operation repeated: take an input vector, multiply it by a learned weight matrix, add a learned bias vector, and pass the result through a nonlinear "activation function" (ReLU, GELU, etc.). A "deep" network is just many of these layers stacked, each one\'s output feeding the next one\'s input. Understanding this makes the difference between treating PyTorch as a black box and being able to debug a model that silently isn\'t learning.',
    csharpApproach: 'There is no idiomatic C# equivalent in the BCL — building this by hand means writing your own `Matrix` type with multiply/add, then manually implementing the forward pass as nested loops or Math.NET Numerics matrix operations.',
    pythonApproach: 'Compose `torch.nn.Linear` layers (each one a weight matrix + bias vector) with a nonlinearity (`torch.nn.ReLU`) between them, wrapped in a `torch.nn.Module` subclass — this is the standard, idiomatic shape of every PyTorch model definition.',
    csharpCode: `// C#: the "from scratch" math a Linear layer performs — no framework,
// so the mechanics have to be written out explicitly (Math.NET Numerics)
using MathNet.Numerics.LinearAlgebra;

// Layer 1: 4 inputs -> 8 hidden units
var W1 = Matrix<double>.Build.Random(8, 4);   // weights (learned)
var b1 = Vector<double>.Build.Random(8);      // bias (learned)

Vector<double> Relu(Vector<double> v) =>
    v.Map(x => Math.Max(0, x));

Vector<double> Forward(Vector<double> x)
{
    var z1 = W1 * x + b1;      // linear transform
    var a1 = Relu(z1);         // nonlinearity
    return a1;
}`,
    pythonCode: `import torch
import torch.nn as nn

class TinyMLP(nn.Module):
    """A 2-layer multi-layer perceptron: 4 -> 8 -> 1."""
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Linear(in_features=4, out_features=8)
        self.activation = nn.ReLU()
        self.layer2 = nn.Linear(in_features=8, out_features=1)

    def forward(self, x):
        x = self.layer1(x)      # linear transform: x @ W1.T + b1
        x = self.activation(x)  # nonlinearity — without this, stacking
        x = self.layer2(x)      # linear layers would collapse into one
        return x

model = TinyMLP()
sample_input = torch.randn(1, 4)   # batch of 1, 4 features
output = model(sample_input)        # calls forward() via __call__`,
    underTheHood: '`nn.Linear(4, 8)` allocates a weight matrix of shape (8, 4) and a bias vector of shape (8,), both registered as `nn.Parameter` — tensors PyTorch tracks for gradient computation. `layer(x)` computes `x @ W.T + b`, a single fused GPU/CPU matrix-multiply kernel, not a Python loop. Without the `ReLU` between layers, stacking two `Linear` layers is mathematically equivalent to one `Linear` layer (a composition of linear functions is still linear) — the nonlinearity is what lets a deep network approximate functions a single layer structurally cannot.',
    pitfalls: [
      'Forgetting the nonlinearity between linear layers — the model will still run and produce numbers, but it has no more representational power than a single layer, and this is not an error PyTorch can detect for you.',
      'Confusing a model\'s `forward()` method with calling it directly — always call `model(x)`, never `model.forward(x)` directly, since `__call__` also triggers hooks (used by things like gradient tracking and `nn.Module` lifecycle logic) that a direct `.forward()` call skips.',
      'Mismatching `in_features` between consecutive layers — `nn.Linear(4, 8)` followed by `nn.Linear(4, 1)` (instead of `nn.Linear(8, 1)`) raises a runtime shape-mismatch error only when data actually flows through, not at model-definition time.'
    ],
    bestPractices: [
      'Always subclass `nn.Module` and define layers in `__init__`, forward logic in `forward()` — this is the near-universal convention every PyTorch codebase (and every pretrained model you will ever load) follows.',
      'Print `sum(p.numel() for p in model.parameters())` to sanity-check a model\'s total parameter count matches your mental model of its size before training.',
      'Use `torchinfo.summary(model, input_size=(1, 4))` (a small third-party package) to print a full per-layer shape table — invaluable for catching shape mistakes before a training run wastes GPU time.'
    ]
  },
  {
    id: 'backprop-autograd',
    number: 2,
    title: 'Backpropagation as Reverse-Mode Automatic Differentiation',
    tagline: 'The algorithm that makes "the network learns" a mechanical, deterministic process rather than magic',
    csharpEquivalent: 'No BCL equivalent — TorchSharp exposes the identical `requires_grad` / `.backward()` autograd API as PyTorch, since it binds the same underlying libtorch engine',
    whyItMatters: 'A network "learning" means: compute a loss (a single number measuring how wrong the current predictions are), then figure out how much each of the model\'s millions of weights individually contributed to that wrongness, then nudge each weight slightly in the direction that reduces it. Backpropagation is the algorithm that computes those millions of "how much did this weight contribute" values (gradients) in a single backward pass through the network, using the chain rule from calculus — not by numerically perturbing each weight one at a time, which would be computationally infeasible at scale.',
    csharpApproach: 'C# has no built-in automatic differentiation. TorchSharp (a real, actively maintained .NET binding to the same libtorch C++ engine PyTorch itself uses) exposes the identical tape-based autograd system, including `.backward()` and `.grad`.',
    pythonApproach: 'Set `requires_grad=True` on input tensors (or use `nn.Parameter`, which does this automatically), run the forward pass normally, call `loss.backward()`, then read the accumulated gradients off `.grad` — PyTorch\'s autograd engine builds a computation graph during the forward pass specifically to make this possible.',
    csharpCode: `// C#: TorchSharp exposes the SAME autograd engine PyTorch uses,
// since it's a binding to the identical libtorch C++ library
using TorchSharp;
using static TorchSharp.torch;

var x = torch.tensor(new float[] { 2.0f, 3.0f }, requires_grad: true);
var weights = torch.tensor(new float[] { 0.5f, -1.5f });

var y = torch.dot(weights, x);
var target = torch.tensor(1.0f);
var loss = (y - target).pow(2);

loss.backward();   // computes d(loss)/d(x) via reverse-mode autodiff

Console.WriteLine(x.grad);   // gradients, identical mechanism to PyTorch`,
    pythonCode: `import torch

x = torch.tensor([2.0, 3.0], requires_grad=True)
weights = torch.tensor([0.5, -1.5])

# Forward pass — PyTorch silently builds a computation graph as this runs,
# recording every operation so it can be traversed backward afterward.
y = torch.dot(weights, x)
target = torch.tensor(1.0)
loss = (y - target) ** 2

# Backward pass: walks the recorded graph in reverse, applying the chain
# rule at each node to compute d(loss)/d(x) — this is backpropagation.
loss.backward()

print(x.grad)  # tensor([-3.4500, 10.3500]) — how much each element of x
               # would need to change to reduce the loss, per the gradient`,
    underTheHood: 'During the forward pass, every tensor operation on a `requires_grad=True` tensor is recorded as a node in a directed acyclic graph (the "autograd graph"), each node storing a reference to the mathematical derivative of that specific operation. `.backward()` traverses this graph from the loss node back to every leaf tensor, multiplying derivatives together at each step per the chain rule — exactly the same "reverse-mode automatic differentiation" technique regardless of whether the graph has 3 nodes (this toy example) or the tens of thousands of nodes in a modern transformer. This is also precisely why `.backward()` can only be called once per graph by default: the intermediate values needed for the backward pass are freed after use unless `retain_graph=True` is explicitly requested.',
    pitfalls: [
      'Calling `.backward()` twice on the same computation graph without `retain_graph=True` — the intermediate buffers are freed after the first call, and PyTorch raises a runtime error rather than silently recomputing.',
      'Forgetting `optimizer.zero_grad()` before the next `.backward()` call in a training loop — gradients accumulate (add to the existing `.grad` value) by design, which is useful for gradient accumulation across mini-batches, but silently corrupts a normal training loop if omitted.',
      'Performing an in-place operation (e.g., `x += 1`) on a tensor that autograd needs for the backward pass — PyTorch raises `RuntimeError: a leaf Variable that requires grad is being used in an in-place operation` rather than silently producing wrong gradients.'
    ],
    bestPractices: [
      'Wrap inference-only code (no training) in `with torch.no_grad():` — this stops PyTorch from building the autograd graph at all, meaningfully reducing memory use and computation for anything that never calls `.backward()`.',
      'Call `optimizer.zero_grad()` at the start of every training-loop iteration, before the forward pass — make it a reflex, not something to remember mid-loop.',
      'Use `torch.autograd.gradcheck()` when implementing a genuinely custom differentiable operation, to numerically verify your analytical gradient matches a finite-difference approximation before trusting a training run built on it.'
    ]
  },
  {
    id: 'gradient-descent-optimizers',
    number: 3,
    title: 'Gradient Descent and the Optimizers Built On It',
    tagline: 'Turning "we know which direction reduces the loss" into a stable, convergent training process',
    csharpEquivalent: 'No BCL equivalent — TorchSharp exposes `torch.optim.Adam`/`SGD` identically, since optimizer state (momentum buffers, etc.) lives in the same libtorch tensors either language wraps',
    whyItMatters: 'Backpropagation tells you the gradient (direction of steepest loss increase) for every weight. Naive gradient descent — subtract `learning_rate * gradient` from every weight, every step — technically works but converges slowly and is fragile to the learning rate choice. Modern optimizers (Adam, AdamW) track a running estimate of each weight\'s gradient *momentum* and *variance* to adapt the effective step size per-parameter, which is why "just use Adam with a reasonable default learning rate" is close to universal practice rather than tuning plain SGD by hand.',
    csharpApproach: 'TorchSharp exposes `torch.optim.Adam(model.parameters(), lr: 1e-3)` with an identical API surface to PyTorch, since both languages ultimately call into the same libtorch optimizer implementations.',
    pythonApproach: 'Instantiate an optimizer bound to the model\'s parameters (`torch.optim.AdamW(model.parameters(), lr=1e-3)`), then in the training loop: zero gradients, forward pass, compute loss, `loss.backward()`, `optimizer.step()` — a five-line pattern that is close to universal across every PyTorch training script you will ever read.',
    csharpCode: `// C#: TorchSharp's training loop is structurally identical to PyTorch's —
// same five-step pattern, same optimizer, same tensor operations
using static TorchSharp.torch;

var model = new TinyMLP();
var optimizer = torch.optim.Adam(model.parameters(), lr: 1e-3);
var lossFn = nn.MSELoss();

foreach (var (inputs, targets) in trainingBatches)
{
    optimizer.zero_grad();
    var predictions = model.forward(inputs);
    var loss = lossFn.forward(predictions, targets);
    loss.backward();
    optimizer.step();
}`,
    pythonCode: `import torch
import torch.nn as nn
import torch.optim as optim

model = TinyMLP()
optimizer = optim.AdamW(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

# The canonical PyTorch training loop — this five-step shape appears,
# essentially unchanged, whether training a 2-layer MLP or a
# 70-billion-parameter language model.
for inputs, targets in training_batches:
    optimizer.zero_grad()               # 1. clear old gradients
    predictions = model(inputs)         # 2. forward pass
    loss = loss_fn(predictions, targets)  # 3. compute the loss
    loss.backward()                     # 4. backward pass (autograd)
    optimizer.step()                    # 5. apply the gradient update`,
    underTheHood: 'AdamW maintains two extra running-average tensors per parameter — a first moment (mean of recent gradients, giving momentum) and second moment (variance of recent gradients, used to scale the step size down for parameters with noisy/large gradients and up for consistently small ones). `optimizer.step()` reads the gradients accumulated on `.grad` by the preceding `.backward()` call, updates these moment estimates, and writes the new parameter values in place — none of this touches the autograd graph itself, which is why `zero_grad()` and `.step()` are separate, explicit calls rather than one fused operation.',
    pitfalls: [
      'Setting a learning rate copied from a different model/dataset without adjustment — the "right" learning rate is architecture- and data-dependent, and too-high a value causes loss to diverge (often visibly exploding to `NaN`) rather than merely converging slowly.',
      'Using plain SGD with a fixed learning rate as a default for a new project — Adam/AdamW converges faster and more robustly for the overwhelming majority of deep learning workloads; SGD is a deliberate choice (often for its generalization properties in specific research contexts), not the default starting point.',
      'Forgetting `model.eval()` before validation/inference — layers like `Dropout` and `BatchNorm` behave differently in training vs. evaluation mode, and skipping this silently produces worse (and non-deterministic) validation numbers.'
    ],
    bestPractices: [
      'Start new projects with `AdamW` at a learning rate around `1e-3` to `3e-4` and a learning-rate scheduler (`torch.optim.lr_scheduler`) rather than hand-tuning a fixed rate from scratch.',
      'Watch the loss curve for the first few hundred steps before committing to a long run — a diverging or flat-lined loss is diagnosable in minutes, not after hours of wasted compute.',
      'Call `model.train()` / `model.eval()` explicitly at the start of each training/validation phase — never assume the model is already in the right mode.'
    ]
  }
];

// ---------------------------------------------------------------------------
// Section 2: Architecture families
// ---------------------------------------------------------------------------

export interface ArchitectureFamily {
  id: string;
  name: string;
  oneLineDefinition: string;
  designedFor: string;
  keyIdea: string;
  csharpAngle: string;
  limitationsOrSuccessor: string;
}

export const ARCHITECTURE_FAMILIES: ArchitectureFamily[] = [
  {
    id: 'cnn',
    name: 'Convolutional Neural Networks (CNNs)',
    oneLineDefinition: 'A network that learns small, spatially-shared filters instead of a separate weight per pixel.',
    designedFor: 'Grid-structured data — primarily images, but also spectrograms and other 2D signals.',
    keyIdea: 'A convolutional layer slides a small learned filter (e.g. 3×3) across the whole image, reusing the same weights at every position. This gives two properties a fully-connected layer lacks: far fewer parameters (one filter, not one weight per pixel), and translation invariance (a learned "edge detector" fires the same way regardless of where the edge appears in the image).',
    csharpAngle: 'Conceptually similar to running the same small `Func<PixelWindow, double>` kernel across every position of a `Bitmap` — the "same function, different data" pattern is one C# developers already know from image-processing code, just learned instead of hand-written.',
    limitationsOrSuccessor: 'Still the standard, efficient choice for many vision tasks (especially where compute/latency is constrained), though Vision Transformers (ViT) have become competitive-to-superior for large-scale image classification when enough training data is available.'
  },
  {
    id: 'rnn-lstm',
    name: 'Recurrent Networks & LSTMs',
    oneLineDefinition: 'A network with a hidden state that carries information from one sequence step to the next.',
    designedFor: 'Sequential data of variable length — text, time series, audio — before Transformers became the dominant choice.',
    keyIdea: 'A vanilla RNN reuses the same weights at every timestep, feeding its own previous output back in as part of the next input — but gradients propagated back across many timesteps tend to vanish or explode. LSTMs (Long Short-Term Memory) add explicit "gates" (learned vectors that control how much of the previous state to forget, how much new information to let in, and how much to output) specifically to keep gradients stable across long sequences.',
    csharpAngle: 'The recurrence itself is structurally close to folding over an `IEnumerable<T>` while threading an accumulator (`Aggregate()`), except both the accumulator update logic *and* the accumulator\'s own dimensionality are learned rather than hand-written.',
    limitationsOrSuccessor: 'Inherently sequential — step *t* needs the output of step *t-1*, which cannot be parallelized across a GPU the way Transformer attention can. This sequential bottleneck is the primary reason Transformers displaced RNNs/LSTMs for most large-scale sequence modeling.'
  },
  {
    id: 'transformer',
    name: 'Transformers & Self-Attention',
    oneLineDefinition: 'A network that lets every position in a sequence directly attend to every other position, in parallel.',
    designedFor: 'Sequential/token data at scale — language is the dominant use case, but the same mechanism now powers vision (ViT), audio, and multi-modal models.',
    keyIdea: 'Introduced in "Attention Is All You Need" (Vaswani et al., 2017). Self-attention computes, for every token, a weighted combination of every other token\'s representation — the weights (how much token A should "attend to" token B) are themselves learned and computed fresh for every input, rather than being fixed like a convolution\'s filter. Because every position\'s attention computation is independent of every other position\'s, this parallelizes across a GPU in a way sequential RNN recurrence structurally cannot.',
    csharpAngle: 'No close C# BCL analogue — the nearest approachable framing is a fully-connected bipartite graph between every pair of sequence positions, where edge weights are computed on the fly by a learned scoring function (`Q · K^T`, the query/key dot product) rather than being fixed.',
    limitationsOrSuccessor: 'Self-attention\'s compute and memory cost scales quadratically with sequence length (every token attends to every other token), which is the central active research problem behind techniques like FlashAttention (a memory-efficient exact implementation) and various sparse/linear attention variants for very long contexts.'
  }
];

// ---------------------------------------------------------------------------
// Section 3: Career spectrum — ML Engineer vs ML Researcher
// ---------------------------------------------------------------------------

export interface CareerTrackDimension {
  id: string;
  dimension: string;
  mlEngineer: string;
  mlResearcher: string;
}

export const CAREER_TRACK_COMPARISON: CareerTrackDimension[] = [
  {
    id: 'primary-question',
    dimension: 'The question the role exists to answer',
    mlEngineer: '"How do we get this model serving real traffic reliably, cheaply, and within a latency budget?"',
    mlResearcher: '"Does this new idea actually work, and why — or why not?"'
  },
  {
    id: 'daily-work',
    dimension: 'A typical week',
    mlEngineer: 'Profiling inference latency, writing data pipelines, debugging a model-serving deployment, running A/B tests, instrumenting monitoring/alerting, reviewing PRs against a production training pipeline.',
    mlResearcher: 'Reading recent papers (often via arXiv preprints before formal publication), running controlled ablation experiments, iterating on a hypothesis, writing up results, maintaining a research codebase optimized for fast iteration over production robustness.'
  },
  {
    id: 'primary-deliverable',
    dimension: 'What "done" looks like',
    mlEngineer: 'A model serving in production behind a monitored, versioned, rollback-capable deployment — the model architecture itself is often treated as a fixed, already-validated input.',
    mlResearcher: 'A validated result: a new architecture, training technique, or empirical finding — typically communicated as a paper, technical report, or internal writeup with reproducible experiments.'
  },
  {
    id: 'success-metric',
    dimension: 'How the work is evaluated',
    mlEngineer: 'Production metrics: p99 latency, requests/second, GPU cost per inference, uptime, model-serving error rate, business KPIs the model moves.',
    mlResearcher: 'Benchmark performance against prior work, statistical significance across seeds/ablations, novelty and generality of the finding, peer review (internal or academic) of the methodology.'
  },
  {
    id: 'core-tools',
    dimension: 'Tools reached for by default',
    mlEngineer: 'ONNX Runtime / TensorRT (quantization & inference optimization), Docker + Kubernetes, feature stores, FastAPI or gRPC serving layers, Prometheus/Grafana-style monitoring, CI/CD pipelines for model artifacts.',
    mlResearcher: 'PyTorch/JAX directly (rarely abstracted away), Jupyter notebooks, experiment-tracking dashboards (Weights & Biases, MLflow, TensorBoard), a compute cluster scheduler (Slurm or similar) for running many parallel experiments.'
  },
  {
    id: 'code-lifespan',
    dimension: 'How long the code is expected to live',
    mlEngineer: 'Years — production training/serving pipelines are maintained, versioned, and held to the same code-quality bar as any other production system.',
    mlResearcher: 'Often weeks — a research codebase frequently exists to answer one question and is then abandoned or heavily rewritten for the next hypothesis; "move fast, iterate on the idea" is explicitly prioritized over long-term maintainability.'
  },
  {
    id: 'math-depth',
    dimension: 'Depth of math/theory required day-to-day',
    mlEngineer: 'Working fluency (understand what a loss function or learning rate schedule does and why) is usually sufficient — deep derivations are rarely needed to deploy a model someone else designed.',
    mlResearcher: 'Substantially deeper — deriving why a new loss formulation behaves the way it does, or why an optimizer converges (or fails to), is frequently the actual job, not an occasional necessity.'
  },
  {
    id: 'failure-mode',
    dimension: 'What a bad day looks like',
    mlEngineer: 'A production incident: the model server is down, latency spiked, or a silent data-drift issue is quietly degrading predictions in production without an alert firing.',
    mlResearcher: 'A negative result after weeks of experiments, or discovering a subtle bug (a data leak, an evaluation-set contamination) that invalidates a result already believed to be promising.'
  }
];

export const CAREER_SPECTRUM_NOTE =
  'These are the two ends of a spectrum, not a rigid binary — "Research Engineer" and "Applied Scientist" are common titles that deliberately sit in between, doing production-grade engineering in service of a research agenda. Most real ML organizations need people who can move along this spectrum, not just occupy one end of it permanently.';

// ---------------------------------------------------------------------------
// Section 4: Research practice
// ---------------------------------------------------------------------------

export interface PracticeItem {
  id: string;
  title: string;
  description: string;
}

export const RESEARCH_PRACTICES: PracticeItem[] = [
  {
    id: 'arxiv-first',
    title: 'arXiv preprints move faster than peer review',
    description: 'The dominant venue for a new result reaching the field is an arXiv preprint, often months before (if ever) formal peer review at a conference. Staying current means monitoring arXiv directly (or curated feeds/Twitter-style aggregators of it), not waiting for the NeurIPS/ICML/ICLR proceedings.'
  },
  {
    id: 'reproducibility',
    title: 'Reproducibility is a known, actively-discussed weak point',
    description: 'Re-implementing a paper\'s claimed result from the description alone frequently fails to reproduce the reported numbers — due to undisclosed hyperparameters, seed sensitivity, or selective reporting. This is widely enough recognized that major venues now run explicit reproducibility tracks and checklists, and "does the official code release actually reproduce Table 1?" is a standard early step before building on someone else\'s claimed result.'
  },
  {
    id: 'ablation-studies',
    title: 'Ablation studies isolate which change actually mattered',
    description: 'A new architecture rarely changes exactly one thing versus the prior baseline. An ablation study re-runs the experiment with individual components removed or swapped one at a time, to determine which specific change is responsible for an observed improvement — without this, an apparent gain might come from an unrelated confound (more training data, a longer schedule, a different learning rate) rather than the proposed idea itself.'
  },
  {
    id: 'experiment-tracking',
    title: 'Experiment tracking replaces "which run was this?" spreadsheets',
    description: 'Tools like Weights & Biases and MLflow log every run\'s hyperparameters, metrics, and (often) model checkpoints automatically, with a searchable dashboard — necessary once a research project accumulates dozens or hundreds of experiment variations, which happens quickly.'
  },
  {
    id: 'compute-budgeting',
    title: 'Compute is budgeted and rationed like any other scarce resource',
    description: 'A GPU cluster is a shared, finite resource scheduled (commonly via Slurm) across a research team — part of the job is designing experiments that answer the intended question with the least compute necessary, rather than assuming unlimited scale is available for every hypothesis.'
  }
];

// ---------------------------------------------------------------------------
// Section 5: Engineering practice
// ---------------------------------------------------------------------------

export const ENGINEERING_PRACTICES: PracticeItem[] = [
  {
    id: 'quantization',
    title: 'Quantization trades a little accuracy for a lot of speed/memory',
    description: 'Converting model weights from 32-bit floats to 16-bit (FP16/BF16) or 8-bit integers (INT8) shrinks memory footprint and increases inference throughput substantially, at a typically small (task-dependent) accuracy cost. Tools like ONNX Runtime and TensorRT automate much of this conversion and the accompanying calibration.'
  },
  {
    id: 'serving-latency-budget',
    title: 'Inference is designed against an explicit latency budget',
    description: 'A production model rarely gets "as much time as it needs" — a real-time recommendation or fraud-scoring model might have a p99 latency budget of single-digit milliseconds. Model architecture choices, batching strategy, and hardware selection are all made against that constraint, not just against offline accuracy.'
  },
  {
    id: 'data-drift-monitoring',
    title: 'Production models are monitored for silent degradation',
    description: 'A model\'s accuracy on live traffic can degrade over time as the real-world data distribution drifts away from the training distribution — without an obvious error or crash. Production ML systems monitor input feature distributions and prediction distributions over time specifically to catch this before it shows up as a business-metric regression.'
  },
  {
    id: 'feature-stores',
    title: 'Feature stores keep training-time and serving-time features consistent',
    description: 'A subtle, common production bug ("training/serving skew") happens when the feature computed during training (e.g., from a batch pipeline) differs even slightly from the same feature computed at serving time (e.g., from a live request) — a feature store centralizes feature computation so both paths use identical logic.'
  },
  {
    id: 'ci-cd-for-models',
    title: 'Model artifacts get the same rollout discipline as application code',
    description: 'A new model version is typically versioned, validated against a held-out evaluation set as a release gate, deployed behind a canary or shadow-traffic rollout, and kept rollback-capable — the same operational discipline a C#/.NET team would apply to a production service release, applied to a model artifact instead of an assembly.'
  }
];
