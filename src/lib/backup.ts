import { questionById } from '../data/questions';
import type { Attempt, Settings } from './storage';

/**
 * Backup file format.
 *
 * A backup contains only what already lives in this browser: attempts, saved
 * item IDs and preferences. No personal data, no identifiers and nothing that
 * was ever sent to a server.
 */
export interface BackupFile {
  format: 'keyform-backup';
  version: 1;
  exportedAt: string;
  appVersion: string;
  attempts: Attempt[];
  bookmarks: string[];
  settings: Settings;
}

export const BACKUP_FORMAT = 'keyform-backup';
export const APP_VERSION = '0.2.0';

export function createBackup(
  attempts: Attempt[],
  bookmarks: string[],
  settings: Settings,
  now = new Date(),
): BackupFile {
  return {
    format: BACKUP_FORMAT,
    version: 1,
    exportedAt: now.toISOString(),
    appVersion: APP_VERSION,
    attempts,
    bookmarks,
    settings,
  };
}

export function serializeBackup(backup: BackupFile): string {
  return JSON.stringify(backup, null, 2);
}

export type ParseResult =
  | {
      ok: true;
      backup: BackupFile;
      /** Attempts dropped because their question is not in this build's bank. */
      droppedAttempts: number;
      /** Bookmark IDs dropped for the same reason. */
      droppedBookmarks: number;
    }
  | { ok: false; error: string };

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Parse and validate a backup file.
 *
 * Validation is strict about structure and lenient about content: unknown
 * question IDs are dropped (with a count) rather than rejecting the whole file,
 * so a backup from an older bank still restores what it can.
 */
export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON. Choose the .json backup you exported.' };
  }

  if (!isObject(raw)) {
    return { ok: false, error: 'The file does not contain a backup object.' };
  }
  if (raw.format !== BACKUP_FORMAT) {
    return {
      ok: false,
      error: 'This is not a Keyform backup. The expected “format” field is missing.',
    };
  }
  if (raw.version !== 1) {
    return { ok: false, error: `Backup version ${String(raw.version)} is not supported by this build.` };
  }
  if (!Array.isArray(raw.attempts) || !Array.isArray(raw.bookmarks)) {
    return { ok: false, error: 'The backup is missing its attempts or bookmarks list.' };
  }

  const attempts: Attempt[] = [];
  let droppedAttempts = 0;
  for (const entry of raw.attempts) {
    if (!isObject(entry)) {
      droppedAttempts += 1;
      continue;
    }
    const questionId = typeof entry.questionId === 'string' ? entry.questionId : '';
    const submittedAt = typeof entry.submittedAt === 'string' ? entry.submittedAt : '';
    if (!questionId || Number.isNaN(Date.parse(submittedAt))) {
      droppedAttempts += 1;
      continue;
    }
    if (!questionById(questionId)) {
      droppedAttempts += 1;
      continue;
    }
    attempts.push({
      id: typeof entry.id === 'string' && entry.id ? entry.id : `imported-${attempts.length + 1}`,
      questionId,
      exam: typeof entry.exam === 'string' ? entry.exam : 'CDS',
      topic: typeof entry.topic === 'string' ? entry.topic : 'vocabulary',
      correct: entry.correct === true,
      submittedAt,
      elapsedMs:
        typeof entry.elapsedMs === 'number' && Number.isFinite(entry.elapsedMs) && entry.elapsedMs >= 0
          ? Math.round(entry.elapsedMs)
          : 0,
      answerMode: entry.answerMode === 'letter' ? 'letter' : 'text',
      sessionId: typeof entry.sessionId === 'string' ? entry.sessionId : 'imported-session',
    });
  }

  const bookmarks: string[] = [];
  let droppedBookmarks = 0;
  for (const entry of raw.bookmarks) {
    if (typeof entry === 'string' && questionById(entry)) bookmarks.push(entry);
    else droppedBookmarks += 1;
  }

  const settings = sanitizeSettings(raw.settings);

  return {
    ok: true,
    droppedAttempts,
    droppedBookmarks,
    backup: {
      format: BACKUP_FORMAT,
      version: 1,
      exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : new Date().toISOString(),
      appVersion: typeof raw.appVersion === 'string' ? raw.appVersion : 'unknown',
      attempts,
      bookmarks,
      settings,
    },
  };
}

/** Keep only values this build understands, so a bad file cannot break the UI. */
export function sanitizeSettings(value: unknown): Settings {
  const source = isObject(value) ? value : {};
  const theme = source.theme === 'dark' ? 'dark' : 'light';
  const answerMode = source.answerMode === 'letter' ? 'letter' : 'text';
  const dailyGoalRaw = typeof source.dailyGoal === 'number' ? source.dailyGoal : 20;
  const sessionRaw = typeof source.sessionLength === 'number' ? source.sessionLength : 10;
  return {
    theme,
    answerMode,
    dailyGoal: Math.min(100, Math.max(5, Math.round(dailyGoalRaw) || 20)),
    sessionLength: [5, 10, 15, 20].includes(Math.round(sessionRaw)) ? Math.round(sessionRaw) : 10,
    hideOptions: source.hideOptions === true,
  };
}

export function backupFileName(now = new Date()): string {
  const stamp = now.toISOString().slice(0, 10);
  return `keyform-backup-${stamp}.json`;
}
