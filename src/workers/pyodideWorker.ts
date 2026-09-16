/// <reference lib="webworker" />
// Runs learner Python code via Pyodide (CPython compiled to WebAssembly)
// entirely inside this Worker. This is the sandbox's real execution path:
// no server round-trip, no host filesystem, no network access exposed to
// the executed code, and a runaway/infinite loop can only ever hang this
// one Worker thread — the main thread stays responsive and can terminate
// this Worker outright (see pyodideSandboxService.ts) to enforce a hard
// timeout, since Pyodide has no cooperative interrupt for a tight loop.
//
// `loadPyodide` is imported from the npm package (not dynamically imported
// by URL) so Vite bundles this small JS glue module normally in both dev
// and production — Vite's dev server refuses to serve /public files via
// module import() at all. `indexURL` below still points at the self-hosted
// /pyodide/ static assets (wasm/zip), which load via plain fetch() and are
// unaffected by that restriction either way.
import { loadPyodide } from 'pyodide';

declare const self: DedicatedWorkerGlobalScope;

const MAX_OUTPUT_CHARS = 20_000;

interface RunMessage {
  type: 'run';
  runId: number;
  code: string;
}

interface RunChallengeMessage {
  type: 'run-challenge';
  runId: number;
  code: string;
}

interface ResultMessage {
  type: 'result';
  runId: number;
  stdout: string;
  stderr: string;
  success: boolean;
  durationMs: number;
}

interface ChallengeResultMessage {
  type: 'challenge-result';
  runId: number;
  stdout: string;
  stderr: string;
  /** JSON-encoded ChallengeTestOutcome[] returned as the harness's final expression, or null if the code crashed before reaching it. */
  testResultsJson: string | null;
  success: boolean;
  durationMs: number;
}

interface ReadyMessage {
  type: 'ready';
}

interface LoadErrorMessage {
  type: 'load-error';
  message: string;
}

type OutgoingMessage = ResultMessage | ChallengeResultMessage | ReadyMessage | LoadErrorMessage;

function post(message: OutgoingMessage): void {
  self.postMessage(message);
}

function capOutput(text: string): string {
  if (text.length <= MAX_OUTPUT_CHARS) return text;
  return `${text.slice(0, MAX_OUTPUT_CHARS)}\n... [output truncated at ${MAX_OUTPUT_CHARS.toLocaleString()} characters]`;
}

// Pyodide's own type declarations aren't installed as a project dependency
// (the worker only needs the runtime, not its TS types), so the loader
// function is typed loosely here and narrowed by how we actually use it.
type PyodideInterface = {
  setStdout(options: { batched: (text: string) => void }): void;
  setStderr(options: { batched: (text: string) => void }): void;
  runPythonAsync(code: string): Promise<unknown>;
};

let pyodideReadyPromise: Promise<PyodideInterface> | null = null;

async function getPyodide(): Promise<PyodideInterface> {
  if (!pyodideReadyPromise) {
    // Same-origin runtime files vendored by scripts/copy-pyodide-runtime.mjs
    // — never fetched from a third-party CDN, keeping the app's strict CSP intact.
    pyodideReadyPromise = loadPyodide({ indexURL: '/pyodide/' }) as Promise<PyodideInterface>;
  }
  return pyodideReadyPromise;
}

// Start loading immediately when the worker spins up, so it's likely
// already warm by the time the learner presses "Run".
getPyodide()
  .then(() => post({ type: 'ready' }))
  .catch((err: unknown) => {
    post({ type: 'load-error', message: err instanceof Error ? err.message : String(err) });
  });

self.onmessage = async (event: MessageEvent<RunMessage | RunChallengeMessage>) => {
  const { type, runId, code } = event.data;
  const startedAt = performance.now();
  let stdout = '';
  let stderr = '';

  if (type === 'run') {
    try {
      const pyodide = await getPyodide();
      pyodide.setStdout({ batched: (text: string) => { stdout += text + '\n'; } });
      pyodide.setStderr({ batched: (text: string) => { stderr += text + '\n'; } });

      await pyodide.runPythonAsync(code);

      post({
        type: 'result',
        runId,
        stdout: capOutput(stdout.trimEnd()),
        stderr: capOutput(stderr.trimEnd()),
        success: true,
        durationMs: performance.now() - startedAt
      });
    } catch (err) {
      // PythonError.message from Pyodide is already a formatted CPython-style
      // traceback — pass it through as-is rather than re-wrapping it.
      const message = err instanceof Error ? err.message : String(err);
      post({
        type: 'result',
        runId,
        stdout: capOutput(stdout.trimEnd()),
        stderr: capOutput((stderr ? stderr + '\n' : '') + message),
        success: false,
        durationMs: performance.now() - startedAt
      });
    }
    return;
  }

  if (type === 'run-challenge') {
    try {
      const pyodide = await getPyodide();
      pyodide.setStdout({ batched: (text: string) => { stdout += text + '\n'; } });
      pyodide.setStderr({ batched: (text: string) => { stderr += text + '\n'; } });

      // The harness (built in challengeEvaluationService.ts) ends with a bare
      // expression — the JSON-encoded test results — which runPythonAsync
      // returns as its resolved value, kept separate from any stdout the
      // learner's own print() calls produced.
      const resultValue = await pyodide.runPythonAsync(code);
      const testResultsJson = typeof resultValue === 'string' ? resultValue : null;

      post({
        type: 'challenge-result',
        runId,
        stdout: capOutput(stdout.trimEnd()),
        stderr: capOutput(stderr.trimEnd()),
        testResultsJson,
        success: true,
        durationMs: performance.now() - startedAt
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      post({
        type: 'challenge-result',
        runId,
        stdout: capOutput(stdout.trimEnd()),
        stderr: capOutput((stderr ? stderr + '\n' : '') + message),
        testResultsJson: null,
        success: false,
        durationMs: performance.now() - startedAt
      });
    }
  }
};
