import { describe, expect, it } from 'vitest';
import {
  BACKUP_FORMAT,
  backupFileName,
  createBackup,
  parseBackup,
  sanitizeSettings,
  serializeBackup,
} from '../src/lib/backup';
import { defaultSettings, type Attempt } from '../src/lib/storage';
import { questions } from '../src/data/questions';

const knownId = questions[0].id;

const attempt: Attempt = {
  id: 'a1',
  questionId: knownId,
  exam: 'CDS',
  topic: 'vocabulary',
  correct: true,
  submittedAt: new Date(2026, 10, 20, 10, 0).toISOString(),
  elapsedMs: 4200,
  answerMode: 'text',
  sessionId: 's1',
};

describe('backup round trip', () => {
  it('survives serialise and parse unchanged', () => {
    const backup = createBackup([attempt], [knownId], defaultSettings);
    const parsed = parseBackup(serializeBackup(backup));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.attempts).toHaveLength(1);
    expect(parsed.backup.attempts[0].questionId).toBe(knownId);
    expect(parsed.backup.bookmarks).toEqual([knownId]);
    expect(parsed.backup.settings).toEqual(defaultSettings);
    expect(parsed.droppedAttempts).toBe(0);
    expect(parsed.droppedBookmarks).toBe(0);
  });

  it('names the file with a date', () => {
    expect(backupFileName(new Date(2026, 10, 20))).toBe('keyform-backup-2026-11-20.json');
  });
});

describe('backup rejection', () => {
  it('rejects text that is not JSON', () => {
    const result = parseBackup('not json at all');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/valid JSON/i);
  });

  it('rejects JSON that is not a Keyform backup', () => {
    const result = parseBackup(JSON.stringify({ hello: 'world' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/not a Keyform backup/i);
  });

  it('rejects an unsupported version', () => {
    const result = parseBackup(
      JSON.stringify({ format: BACKUP_FORMAT, version: 99, attempts: [], bookmarks: [] }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/version 99/i);
  });

  it('rejects a file missing the collections', () => {
    const result = parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 1 }));
    expect(result.ok).toBe(false);
  });
});

describe('backup tolerance', () => {
  it('drops attempts and bookmarks for items not in this build, and counts them', () => {
    const payload = {
      format: BACKUP_FORMAT,
      version: 1,
      exportedAt: new Date().toISOString(),
      attempts: [attempt, { ...attempt, id: 'a2', questionId: 'removed-item-999' }],
      bookmarks: [knownId, 'removed-item-999'],
      settings: defaultSettings,
    };
    const parsed = parseBackup(JSON.stringify(payload));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.attempts).toHaveLength(1);
    expect(parsed.droppedAttempts).toBe(1);
    expect(parsed.backup.bookmarks).toEqual([knownId]);
    expect(parsed.droppedBookmarks).toBe(1);
  });

  it('drops malformed attempts rather than failing the whole file', () => {
    const payload = {
      format: BACKUP_FORMAT,
      version: 1,
      attempts: [{ questionId: knownId, submittedAt: 'not-a-date' }, 'nonsense', attempt],
      bookmarks: [],
      settings: {},
    };
    const parsed = parseBackup(JSON.stringify(payload));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.attempts).toHaveLength(1);
    expect(parsed.droppedAttempts).toBe(2);
  });
});

describe('settings sanitising', () => {
  it('replaces unknown values with safe defaults', () => {
    const settings = sanitizeSettings({
      theme: 'neon',
      answerMode: 'shout',
      dailyGoal: 9999,
      sessionLength: 7,
      hideOptions: 'yes',
    });
    expect(settings.theme).toBe('light');
    expect(settings.answerMode).toBe('text');
    expect(settings.dailyGoal).toBe(100);
    expect(settings.sessionLength).toBe(10);
    expect(settings.hideOptions).toBe(false);
  });

  it('keeps valid values', () => {
    const settings = sanitizeSettings({
      theme: 'dark',
      answerMode: 'letter',
      dailyGoal: 30,
      sessionLength: 20,
      hideOptions: true,
    });
    expect(settings).toEqual({
      theme: 'dark',
      answerMode: 'letter',
      dailyGoal: 30,
      sessionLength: 20,
      hideOptions: true,
    });
  });

  it('handles a missing or non-object settings field', () => {
    expect(sanitizeSettings(undefined)).toEqual(defaultSettings);
    expect(sanitizeSettings('nope')).toEqual(defaultSettings);
  });
});
