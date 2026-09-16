// Builds a test harness around a learner's submitted solution and evaluates
// it via the same Pyodide worker the Interactive Sandbox uses (see
// pyodideSandboxService.ts) — one execution round-trip runs the submission
// once and every test case against it, each isolated in its own try/except
// so one failing test doesn't abort the rest.

import type { Challenge, ChallengeTestCase } from '../types';
import { runChallengeInSandbox } from './pyodideSandboxService';

export interface TestOutcome {
  id: string;
  description: string;
  passed: boolean;
  error: string | null;
}

export interface ChallengeEvaluation {
  ranAtAll: boolean;
  crashMessage: string | null;
  stdout: string;
  outcomes: TestOutcome[];
  passedCount: number;
  totalCount: number;
  allPassed: boolean;
  timedOut: boolean;
  durationMs: number;
}

function indentPythonBlock(code: string, spaces = 4): string {
  const pad = ' '.repeat(spaces);
  const lines = code.split('\n');
  return lines.map(line => (line.trim().length > 0 ? pad + line : line)).join('\n');
}

function buildHarness(userCode: string, tests: ChallengeTestCase[]): string {
  const testFunctions = tests
    .map((test, idx) => {
      const fnName = `__test_${idx}`;
      const body = indentPythonBlock(test.assertionCode);
      return `def ${fnName}():\n${body}\n__results.append(__run_test(${JSON.stringify(test.id)}, ${JSON.stringify(test.description)}, ${fnName}))`;
    })
    .join('\n\n');

  return `${userCode}

import json as __json

def __run_test(__id, __desc, __fn):
    try:
        __fn()
        return {"id": __id, "description": __desc, "passed": True, "error": None}
    except AssertionError as __e:
        __msg = str(__e)
        return {"id": __id, "description": __desc, "passed": False, "error": "AssertionError: " + __msg if __msg else "AssertionError: the assertion failed"}
    except Exception as __e:
        return {"id": __id, "description": __desc, "passed": False, "error": type(__e).__name__ + ": " + str(__e)}

__results = []

${testFunctions}

__json.dumps(__results)`;
}

export async function evaluateChallenge(challenge: Challenge, userCode: string): Promise<ChallengeEvaluation> {
  const harness = buildHarness(userCode, challenge.testCases);
  const outcome = await runChallengeInSandbox(harness);

  if (outcome.timedOut) {
    return {
      ranAtAll: false,
      crashMessage: outcome.stderr,
      stdout: outcome.stdout,
      outcomes: [],
      passedCount: 0,
      totalCount: challenge.testCases.length,
      allPassed: false,
      timedOut: true,
      durationMs: outcome.durationMs
    };
  }

  if (!outcome.success || !outcome.testResultsJson) {
    // The submission itself crashed before the harness could run every test
    // (e.g. a SyntaxError, or an exception raised at module level outside
    // any function) — every test is implicitly a failure.
    return {
      ranAtAll: false,
      crashMessage: outcome.stderr || 'The submission raised an error before any tests could run.',
      stdout: outcome.stdout,
      outcomes: [],
      passedCount: 0,
      totalCount: challenge.testCases.length,
      allPassed: false,
      timedOut: false,
      durationMs: outcome.durationMs
    };
  }

  let outcomes: TestOutcome[] = [];
  try {
    outcomes = JSON.parse(outcome.testResultsJson) as TestOutcome[];
  } catch {
    return {
      ranAtAll: false,
      crashMessage: 'Internal error: could not parse test results.',
      stdout: outcome.stdout,
      outcomes: [],
      passedCount: 0,
      totalCount: challenge.testCases.length,
      allPassed: false,
      timedOut: false,
      durationMs: outcome.durationMs
    };
  }

  const passedCount = outcomes.filter(o => o.passed).length;
  return {
    ranAtAll: true,
    crashMessage: null,
    stdout: outcome.stdout,
    outcomes,
    passedCount,
    totalCount: outcomes.length,
    allPassed: outcomes.length > 0 && passedCount === outcomes.length,
    timedOut: false,
    durationMs: outcome.durationMs
  };
}
