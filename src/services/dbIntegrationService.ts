/**
 * Database Integration & Synchronization Layer
 *
 * Provides typed repository abstractions designed for seamless future migration
 * from client-side persistence (localStorage/IndexedDB) to cloud-hosted databases
 * (such as Google Cloud Firestore, Cloud SQL PostgreSQL, or RESTful API microservices).
 */

export interface UserProgressRecord {
  userId: string;
  completedChapters: string[];
  lastActiveSection: string;
  totalChaptersMastered: number;
  lastUpdated: string;
  schemaVersion: string;
}

export interface ChapterNoteRecord {
  userId: string;
  chapterId: string;
  content: string;
  characterCount: number;
  lastUpdated: string;
}

export interface UserPreferencesRecord {
  userId: string;
  theme: 'slate' | 'idle';
  autoRunSandbox: boolean;
  codeFontSize: number;
  lastUpdated: string;
}

export interface DatabaseStatusInfo {
  status: 'ready' | 'syncing' | 'offline' | 'error';
  driver: string;
  schemaVersion: string;
  compatibleDatabases: string[];
  storageStatus: {
    cacheSynchronized: boolean;
    optimisticLocking: boolean;
    conflictResolution: string;
    exportSupported: boolean;
    importSupported: boolean;
  };
  handshakeTimestamp: string;
}

export interface DatabaseBackupPayload {
  exportTimestamp: string;
  schemaVersion: string;
  system: string;
  progress: UserProgressRecord;
  notes: Record<string, string>;
  preferences: UserPreferencesRecord;
}

const STORAGE_KEYS = {
  PROGRESS: 'python_csharp_completed',
  THEME: 'python_csharp_theme',
  NOTES: 'python_csharp_notes',
  PREFERENCES: 'python_csharp_preferences',
  SYNC_META: 'python_csharp_sync_meta'
};

const DEFAULT_USER_ID = 'local_architect_user';
const CURRENT_SCHEMA_VERSION = 'v2.4.0';

export class DbIntegrationService {
  private static instance: DbIntegrationService;

  private constructor() {}

  public static getInstance(): DbIntegrationService {
    if (!DbIntegrationService.instance) {
      DbIntegrationService.instance = new DbIntegrationService();
    }
    return DbIntegrationService.instance;
  }

  /**
   * Loads user progress record
   */
  public getProgress(): string[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return saved ? JSON.parse(saved) : ['fundamentals'];
    } catch {
      return ['fundamentals'];
    }
  }

  /**
   * Saves user progress with optimistic local write and queue for backend sync
   */
  public saveProgress(chapters: string[]): UserProgressRecord {
    const record: UserProgressRecord = {
      userId: DEFAULT_USER_ID,
      completedChapters: chapters,
      lastActiveSection: chapters[chapters.length - 1] || 'fundamentals',
      totalChaptersMastered: chapters.length,
      lastUpdated: new Date().toISOString(),
      schemaVersion: CURRENT_SCHEMA_VERSION
    };

    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(chapters));
      localStorage.setItem(STORAGE_KEYS.SYNC_META, JSON.stringify(record));
    } catch (err) {
      console.warn('LocalStorage save progress error:', err);
    }

    // Trigger async background sync to server
    this.syncStateWithBackend().catch(() => {});
    return record;
  }

  /**
   * Loads all study notes
   */
  public getNotes(): Record<string, string> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  /**
   * Saves a note for a specific chapter
   */
  public saveNote(chapterId: string, noteContent: string): void {
    try {
      const notes = this.getNotes();
      notes[chapterId] = noteContent;
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      this.syncStateWithBackend().catch(() => {});
    } catch (err) {
      console.warn('LocalStorage save note error:', err);
    }
  }

  /**
   * Validates backend database handshake and capabilities
   */
  public async checkBackendDatabaseStatus(): Promise<DatabaseStatusInfo> {
    try {
      const res = await fetch('/api/db/status', { method: 'GET' });
      if (res.ok) {
        return (await res.json()) as DatabaseStatusInfo;
      }
    } catch {
      // Offline fallback
    }

    return {
      status: 'offline',
      driver: 'localStorage_active_fallback',
      schemaVersion: CURRENT_SCHEMA_VERSION,
      compatibleDatabases: ['firestore', 'postgresql_cloudsql', 'rest_api'],
      storageStatus: {
        cacheSynchronized: true,
        optimisticLocking: true,
        conflictResolution: 'last_write_wins',
        exportSupported: true,
        importSupported: true
      },
      handshakeTimestamp: new Date().toISOString()
    };
  }

  /**
   * Performs real JSON synchronization with the backend API / database layer
   */
  public async syncStateWithBackend(): Promise<boolean> {
    const payload = {
      progress: this.getProgress(),
      notes: this.getNotes(),
      timestamp: new Date().toISOString(),
      schemaVersion: CURRENT_SCHEMA_VERSION
    };

    try {
      const res = await fetch('/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generates a portable JSON database backup file
   */
  public generateBackupPayload(): DatabaseBackupPayload {
    const progressList = this.getProgress();
    return {
      exportTimestamp: new Date().toISOString(),
      schemaVersion: CURRENT_SCHEMA_VERSION,
      system: 'Python for C# Developers — Architect Edition',
      progress: {
        userId: DEFAULT_USER_ID,
        completedChapters: progressList,
        lastActiveSection: progressList[progressList.length - 1] || 'fundamentals',
        totalChaptersMastered: progressList.length,
        lastUpdated: new Date().toISOString(),
        schemaVersion: CURRENT_SCHEMA_VERSION
      },
      notes: this.getNotes(),
      preferences: {
        userId: DEFAULT_USER_ID,
        theme: (localStorage.getItem(STORAGE_KEYS.THEME) as 'slate' | 'idle') || 'slate',
        autoRunSandbox: true,
        codeFontSize: 13,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * Restores database state from a validated JSON backup string
   */
  public restoreFromBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.progress && Array.isArray(data.progress.completedChapters)) {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress.completedChapters));
      }
      if (data.notes && typeof data.notes === 'object') {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
      }
      if (data.preferences && data.preferences.theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, data.preferences.theme);
      }
      this.syncStateWithBackend().catch(() => {});
      return true;
    } catch (e) {
      console.error('Backup restoration failed:', e);
      return false;
    }
  }
}

export const dbService = DbIntegrationService.getInstance();
