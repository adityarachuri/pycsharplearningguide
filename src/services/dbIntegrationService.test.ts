import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dbService } from './dbIntegrationService';

const storage = new Map<string, string>();

const installStorage = () => {
  const localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: (index: number) => [...storage.keys()][index] ?? null,
    get length() {
      return storage.size;
    }
  };

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorage
  });
};

describe('DbIntegrationService', () => {
  beforeEach(() => {
    storage.clear();
    installStorage();
    vi.restoreAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'ready' }) }));
  });

  it('returns the singleton service instance', async () => {
    vi.resetModules();
    const module = await import('./dbIntegrationService');

    expect(module.DbIntegrationService.getInstance()).toBe(module.DbIntegrationService.getInstance());
  });

  it('returns default progress and notes when storage is empty', () => {
    expect(dbService.getProgress()).toEqual(['fundamentals']);
    expect(dbService.getNotes()).toEqual({});
  });

  it('reads stored progress and notes', () => {
    storage.set('python_csharp_completed', JSON.stringify(['fundamentals', 'architecture']));
    storage.set('python_csharp_notes', JSON.stringify({ architecture: 'Review frames' }));

    expect(dbService.getProgress()).toEqual(['fundamentals', 'architecture']);
    expect(dbService.getNotes()).toEqual({ architecture: 'Review frames' });
  });

  it('falls back when stored JSON is malformed', () => {
    storage.set('python_csharp_completed', '{bad');
    storage.set('python_csharp_notes', '{bad');

    expect(dbService.getProgress()).toEqual(['fundamentals']);
    expect(dbService.getNotes()).toEqual({});
  });

  it('saves progress, records metadata, and queues sync', async () => {
    const record = dbService.saveProgress(['fundamentals', 'architecture']);
    await Promise.resolve();

    expect(record).toMatchObject({
      userId: 'local_architect_user',
      completedChapters: ['fundamentals', 'architecture'],
      lastActiveSection: 'architecture',
      totalChaptersMastered: 2,
      schemaVersion: 'v2.4.0'
    });
    expect(JSON.parse(storage.get('python_csharp_completed')!)).toEqual(['fundamentals', 'architecture']);
    expect(JSON.parse(storage.get('python_csharp_sync_meta')!)).toMatchObject({
      completedChapters: ['fundamentals', 'architecture']
    });
    expect(fetch).toHaveBeenCalledWith('/api/db/sync', expect.objectContaining({ method: 'POST' }));
  });

  it('uses fundamentals when saving empty progress', () => {
    expect(dbService.saveProgress([]).lastActiveSection).toBe('fundamentals');
  });

  it('handles progress storage failures', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => null,
        setItem: () => { throw new Error('storage unavailable'); }
      }
    });

    expect(() => dbService.saveProgress(['fundamentals'])).not.toThrow();
  });

  it('saves notes and queues sync', async () => {
    dbService.saveNote('architecture', 'Review the GIL');
    await Promise.resolve();

    expect(JSON.parse(storage.get('python_csharp_notes')!)).toEqual({ architecture: 'Review the GIL' });
    expect(fetch).toHaveBeenCalledWith('/api/db/sync', expect.objectContaining({ method: 'POST' }));
  });

  it('handles note storage failures', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => null,
        setItem: () => { throw new Error('storage unavailable'); }
      }
    });

    expect(() => dbService.saveNote('architecture', 'note')).not.toThrow();
  });

  it('returns backend status when available', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ready', driver: 'test' })
    }));

    await expect(dbService.checkBackendDatabaseStatus()).resolves.toEqual({ status: 'ready', driver: 'test' });
  });

  it('returns offline status when backend status fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const result = await dbService.checkBackendDatabaseStatus();

    expect(result).toMatchObject({ status: 'offline', driver: 'localStorage_active_fallback' });
  });

  it('returns offline status for a non-ok backend response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    expect((await dbService.checkBackendDatabaseStatus()).status).toBe('offline');
  });

  it('reports sync success and failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    await expect(dbService.syncStateWithBackend()).resolves.toBe(true);

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(dbService.syncStateWithBackend()).resolves.toBe(false);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(dbService.syncStateWithBackend()).resolves.toBe(false);
  });

  it('does not surface background sync failures from local writes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    dbService.saveProgress(['fundamentals']);
    dbService.saveNote('fundamentals', 'note');
    dbService.restoreFromBackup(JSON.stringify({}));
    await Promise.resolve();

    expect(fetch).toHaveBeenCalled();
  });

  it('generates a complete backup payload', () => {
    storage.set('python_csharp_completed', JSON.stringify(['architecture']));
    storage.set('python_csharp_notes', JSON.stringify({ architecture: 'note' }));
    storage.set('python_csharp_theme', 'reading');

    expect(dbService.generateBackupPayload()).toMatchObject({
      schemaVersion: 'v2.4.0',
      progress: {
        completedChapters: ['architecture'],
        lastActiveSection: 'architecture'
      },
      notes: { architecture: 'note' },
      preferences: {
        theme: 'reading',
        autoRunSandbox: true,
        codeFontSize: 13
      }
    });
  });

  it('uses safe defaults when backup source values are empty', () => {
    storage.set('python_csharp_completed', JSON.stringify([]));
    const backup = dbService.generateBackupPayload();

    expect(backup.progress.lastActiveSection).toBe('fundamentals');
    expect(backup.preferences.theme).toBe('slate');
  });

  it('restores valid backup data and queues sync', async () => {
    const restored = dbService.restoreFromBackup(JSON.stringify({
      progress: { completedChapters: ['fundamentals', 'future'] },
      notes: { future: 'PEP 703' },
      preferences: { theme: 'idle' }
    }));
    await Promise.resolve();

    expect(restored).toBe(true);
    expect(dbService.getProgress()).toEqual(['fundamentals', 'future']);
    expect(dbService.getNotes()).toEqual({ future: 'PEP 703' });
    expect(storage.get('python_csharp_theme')).toBe('idle');
  });

  it('accepts backups with optional sections missing', () => {
    expect(dbService.restoreFromBackup(JSON.stringify({}))).toBe(true);
  });

  it('ignores backup sections with invalid shapes', () => {
    expect(dbService.restoreFromBackup(JSON.stringify({
      progress: { completedChapters: 'not-an-array' },
      notes: 'not-an-object',
      preferences: { theme: '' }
    }))).toBe(true);
  });

  it('rejects malformed backups', () => {
    expect(dbService.restoreFromBackup('{bad')).toBe(false);
  });
});
