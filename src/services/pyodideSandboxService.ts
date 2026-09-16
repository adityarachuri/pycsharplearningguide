// Orchestrates the Pyodide Web Worker (src/workers/pyodideWorker.ts) from the
// main thread: lazy worker creation, a hard execution timeout enforced by
// terminating the worker outright (the only reliable way to stop a
// synchronous infinite loop running inside it), and one worker reused
// across runs for speed, replaced only after a timeout/crash.

export interface SandboxRunResult {
  stdout: string;
  stderr: string;
  success: boolean;
  durationMs: number;
  timedOut: boolean;
}

export interface ChallengeRunResult {
  stdout: string;
  stderr: string;
  testResultsJson: string | null;
  success: boolean;
  durationMs: number;
  timedOut: boolean;
}

const EXECUTION_TIMEOUT_MS = 10_000;

type WorkerIncoming =
  | { type: 'ready' }
  | { type: 'load-error'; message: string }
  | { type: 'result'; runId: number; stdout: string; stderr: string; success: boolean; durationMs: number }
  | { type: 'challenge-result'; runId: number; stdout: string; stderr: string; testResultsJson: string | null; success: boolean; durationMs: number };

let worker: Worker | null = null;
let isReady = false;
let nextRunId = 1;
const readyListeners = new Set<() => void>();

function createWorker(): Worker {
  const w = new Worker(new URL('../workers/pyodideWorker.ts', import.meta.url), { type: 'module' });
  isReady = false;
  w.addEventListener('message', (event: MessageEvent<WorkerIncoming>) => {
    if (event.data.type === 'ready') {
      isReady = true;
      readyListeners.forEach(listener => listener());
      readyListeners.clear();
    }
  });
  return w;
}

function getWorker(): Worker {
  if (!worker) worker = createWorker();
  return worker;
}

/** Begins warming up the Pyodide runtime before the learner presses Run. */
export function preloadSandbox(): void {
  getWorker();
}

/** Resolves once the Pyodide runtime has finished loading in the worker. */
export function onSandboxReady(callback: () => void): void {
  if (isReady) {
    callback();
    return;
  }
  readyListeners.add(callback);
}

export function isSandboxReady(): boolean {
  return isReady;
}

export async function runInSandbox(code: string): Promise<SandboxRunResult> {
  const runId = nextRunId++;
  const startedAt = performance.now();
  const activeWorker = getWorker();

  return new Promise<SandboxRunResult>(resolve => {
    let settled = false;

    const finish = (result: SandboxRunResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutHandle);
      activeWorker.removeEventListener('message', onMessage);
      resolve(result);
    };

    const onMessage = (event: MessageEvent<WorkerIncoming>) => {
      if (event.data.type === 'result' && event.data.runId === runId) {
        finish({
          stdout: event.data.stdout,
          stderr: event.data.stderr,
          success: event.data.success,
          durationMs: event.data.durationMs,
          timedOut: false
        });
      } else if (event.data.type === 'load-error') {
        finish({
          stdout: '',
          stderr: `Failed to load the Python runtime: ${event.data.message}`,
          success: false,
          durationMs: performance.now() - startedAt,
          timedOut: false
        });
      }
    };

    const timeoutHandle = setTimeout(() => {
      // Hard-terminate: the only way to interrupt a synchronous infinite
      // loop running inside the worker. The worker is unusable after this,
      // so the next run() call transparently creates a fresh one.
      activeWorker.terminate();
      worker = null;
      finish({
        stdout: '',
        stderr: `Execution exceeded the ${EXECUTION_TIMEOUT_MS / 1000}s time limit and was stopped.`,
        success: false,
        durationMs: EXECUTION_TIMEOUT_MS,
        timedOut: true
      });
    }, EXECUTION_TIMEOUT_MS);

    activeWorker.addEventListener('message', onMessage);
    activeWorker.postMessage({ type: 'run', runId, code });
  });
}

/** Runs a challenge evaluation harness (see challengeEvaluationService.ts) in the same worker/runtime as runInSandbox. */
export async function runChallengeInSandbox(harnessCode: string): Promise<ChallengeRunResult> {
  const runId = nextRunId++;
  const startedAt = performance.now();
  const activeWorker = getWorker();

  return new Promise<ChallengeRunResult>(resolve => {
    let settled = false;

    const finish = (result: ChallengeRunResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutHandle);
      activeWorker.removeEventListener('message', onMessage);
      resolve(result);
    };

    const onMessage = (event: MessageEvent<WorkerIncoming>) => {
      if (event.data.type === 'challenge-result' && event.data.runId === runId) {
        finish({
          stdout: event.data.stdout,
          stderr: event.data.stderr,
          testResultsJson: event.data.testResultsJson,
          success: event.data.success,
          durationMs: event.data.durationMs,
          timedOut: false
        });
      } else if (event.data.type === 'load-error') {
        finish({
          stdout: '',
          stderr: `Failed to load the Python runtime: ${event.data.message}`,
          testResultsJson: null,
          success: false,
          durationMs: performance.now() - startedAt,
          timedOut: false
        });
      }
    };

    const timeoutHandle = setTimeout(() => {
      activeWorker.terminate();
      worker = null;
      finish({
        stdout: '',
        stderr: `Execution exceeded the ${EXECUTION_TIMEOUT_MS / 1000}s time limit and was stopped — check for an infinite loop.`,
        testResultsJson: null,
        success: false,
        durationMs: EXECUTION_TIMEOUT_MS,
        timedOut: true
      });
    }, EXECUTION_TIMEOUT_MS);

    activeWorker.addEventListener('message', onMessage);
    activeWorker.postMessage({ type: 'run-challenge', runId, code: harnessCode });
  });
}
