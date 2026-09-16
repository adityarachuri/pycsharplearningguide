// Tracks challenge attempts/completions in localStorage, mirroring the
// persistence pattern in dbIntegrationService.ts but kept separate since
// it tracks a distinct concern (practice progress vs. curriculum progress).

import type { ChallengeAttemptRecord } from '../types';

const STORAGE_KEY = 'python_csharp_challenge_progress';

function loadAll(): Record<string, ChallengeAttemptRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ChallengeAttemptRecord>) : {};
  } catch {
    return {};
  }
}

function saveAll(records: Record<string, ChallengeAttemptRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('LocalStorage save challenge progress error:', err);
  }
}

export function getAllChallengeProgress(): Record<string, ChallengeAttemptRecord> {
  return loadAll();
}

export function recordChallengeAttempt(
  challengeId: string,
  passedCount: number,
  totalCount: number
): ChallengeAttemptRecord {
  const all = loadAll();
  const existing = all[challengeId];
  const completed = totalCount > 0 && passedCount === totalCount;

  const record: ChallengeAttemptRecord = {
    challengeId,
    attempts: (existing?.attempts ?? 0) + 1,
    completed: existing?.completed || completed,
    bestPassedCount: Math.max(existing?.bestPassedCount ?? 0, passedCount),
    totalTestCount: totalCount,
    hintsUsed: existing?.hintsUsed ?? 0,
    lastAttemptedAt: new Date().toISOString(),
    completedAt: existing?.completedAt ?? (completed ? new Date().toISOString() : undefined)
  };

  all[challengeId] = record;
  saveAll(all);
  return record;
}

export function recordHintUsed(challengeId: string): void {
  const all = loadAll();
  const existing = all[challengeId];
  all[challengeId] = existing
    ? { ...existing, hintsUsed: existing.hintsUsed + 1 }
    : {
        challengeId,
        attempts: 0,
        completed: false,
        bestPassedCount: 0,
        totalTestCount: 0,
        hintsUsed: 1,
        lastAttemptedAt: new Date().toISOString()
      };
  saveAll(all);
}

export function getChallengeStats(allChallengeIds: string[]): {
  attempted: number;
  completed: number;
  total: number;
} {
  const all = loadAll();
  const relevant = allChallengeIds.map(id => all[id]).filter((r): r is ChallengeAttemptRecord => !!r);
  return {
    attempted: relevant.length,
    completed: relevant.filter(r => r.completed).length,
    total: allChallengeIds.length
  };
}
