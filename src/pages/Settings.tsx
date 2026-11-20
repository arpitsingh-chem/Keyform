import { useRef, useState } from 'react';
import { useStudy } from '../lib/store';
import {
  backupFileName,
  createBackup,
  parseBackup,
  serializeBackup,
} from '../lib/backup';
import { Note, SectionTitle } from '../components/ui';
import { IconMoon, IconSun } from '../components/icons';

const storageCopy: Record<string, string> = {
  indexeddb: 'IndexedDB is available. Attempts and saved items persist on this device.',
  localstorage: 'IndexedDB was unavailable, so limited browser storage is being used.',
  memory: 'No persistent storage is available. Progress lasts only for this browser session.',
};

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    storageMode,
    attempts,
    bookmarks,
    resetAll,
    restoreBackup,
    ready,
  } = useStudy();
  const [status, setStatus] = useState<string>('');
  const [importError, setImportError] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  function downloadBackup() {
    const json = serializeBackup(createBackup(attempts, bookmarks, settings));
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = backupFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setImportError('');
    setStatus(
      `Backup downloaded with ${attempts.length} attempts and ${bookmarks.length} saved items.`,
    );
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setImportError('');
    setStatus('');
    const text = await file.text();
    const parsed = parseBackup(text);
    if (!parsed.ok) {
      setImportError(parsed.error);
      return;
    }
    const { backup, droppedAttempts, droppedBookmarks } = parsed;
    const notes = [
      droppedAttempts > 0 ? `${droppedAttempts} attempt(s) for items not in this build` : '',
      droppedBookmarks > 0 ? `${droppedBookmarks} saved item(s) not in this build` : '',
    ].filter(Boolean);
    const confirmed = window.confirm(
      `Replace the progress on this device with the backup?\n\n` +
        `Backup contains ${backup.attempts.length} attempts and ${backup.bookmarks.length} saved items, ` +
        `exported ${new Date(backup.exportedAt).toLocaleString()}.\n\n` +
        `Your current ${attempts.length} attempts will be overwritten.` +
        (notes.length > 0 ? `\n\nSkipped: ${notes.join('; ')}.` : ''),
    );
    if (!confirmed) {
      setStatus('Import cancelled. Nothing was changed.');
      return;
    }
    await restoreBackup(backup);
    setStatus(
      `Backup restored: ${backup.attempts.length} attempts and ${backup.bookmarks.length} saved items.` +
        (notes.length > 0 ? ` Skipped ${notes.join('; ')}.` : ''),
    );
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Workspace</span>
          <h1>Settings</h1>
          <p className="lead">
            Preferences are stored locally. There is no account, no remote profile and no
            synchronisation in this release.
          </p>
        </div>
      </div>

      <Note>
        <strong>Storage status.</strong> {storageCopy[storageMode] ?? storageCopy.memory}{' '}
        {ready ? `${attempts.length} attempts and ${bookmarks.length} saved items are held here.` : ''}
      </Note>

      <section className="card" aria-labelledby="appearance-heading">
        <SectionTitle title="Appearance" hint="Dark mode applies immediately and is remembered." />
        <div className="btn-row">
          <button
            type="button"
            className={settings.theme === 'light' ? 'btn btn-primary' : 'btn btn-secondary'}
            aria-pressed={settings.theme === 'light'}
            onClick={() => updateSettings({ theme: 'light' })}
          >
            <IconSun size={16} /> Light
          </button>
          <button
            type="button"
            className={settings.theme === 'dark' ? 'btn btn-primary' : 'btn btn-secondary'}
            aria-pressed={settings.theme === 'dark'}
            onClick={() => updateSettings({ theme: 'dark' })}
          >
            <IconMoon size={16} /> Dark
          </button>
        </div>
      </section>

      <section className="card" aria-labelledby="practice-heading">
        <SectionTitle title="Practice defaults" hint="Used when a new session starts." />
        <div className="settings-grid">
          <div className="field">
            <label htmlFor="default-mode">Answer mode</label>
            <select
              id="default-mode"
              value={settings.answerMode}
              onChange={(event) =>
                updateSettings({ answerMode: event.target.value as 'text' | 'letter' })
              }
            >
              <option value="text">Type the answer text</option>
              <option value="letter">Type the option letter (A–D)</option>
            </select>
            <span className="field-hint">
              Text mode checks the answer string exactly after trimming and lower-casing.
            </span>
          </div>

          <div className="field">
            <label htmlFor="default-length">Session length</label>
            <select
              id="default-length"
              value={settings.sessionLength}
              onChange={(event) => updateSettings({ sessionLength: Number(event.target.value) })}
            >
              {[5, 10, 15, 20].map((length) => (
                <option key={length} value={length}>
                  {length} questions
                </option>
              ))}
            </select>
            <span className="field-hint">Sessions stop early when a topic runs out of items.</span>
          </div>

          <div className="field">
            <label htmlFor="daily-goal">Daily goal (answers)</label>
            <input
              id="daily-goal"
              type="number"
              min={5}
              max={100}
              step={5}
              value={settings.dailyGoal}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isFinite(next) && next >= 5 && next <= 100) {
                  updateSettings({ dailyGoal: next });
                }
              }}
            />
            <span className="field-hint">
              Counts completed answers, not page visits. Range 5–100.
            </span>
          </div>

          <div className="field">
            <span className="field-label" id="hide-options-label">
              Recall difficulty
            </span>
            <label className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <input
                type="checkbox"
                checked={settings.hideOptions}
                aria-describedby="hide-options-hint"
                onChange={(event) => updateSettings({ hideOptions: event.target.checked })}
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              {settings.hideOptions ? 'Options hidden until I submit' : 'Show options while I answer'}
            </label>
            <span className="field-hint" id="hide-options-hint">
              Hiding the four options makes the drill pure recall. They appear with the explanation
              after you submit.
            </span>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="backup-heading">
        <SectionTitle
          title="Backup and restore"
          hint="Progress lives in this browser only, so a backup is the only way to move it to another device."
        />
        <div className="stack">
          <p className="small muted">
            The file is plain JSON containing your attempts, saved items and preferences. It holds no
            name, email or identifier, and it is never uploaded anywhere: you choose where to keep it.
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={downloadBackup}>
              Download backup
            </button>
            <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
              Restore from backup
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="visually-hidden"
                onChange={(event) => {
                  void handleFile(event.target.files?.[0]);
                }}
              />
            </label>
          </div>
          {importError ? (
            <p className="field-error" role="alert">
              {importError}
            </p>
          ) : null}
          <p className="small" role="status" aria-live="polite">
            {status}
          </p>
          <p className="small muted">
            Restoring replaces what is on this device. Take a backup first if you are unsure.
          </p>
        </div>
      </section>

      <section className="card" aria-labelledby="data-heading">
        <SectionTitle
          title="Local data"
          hint="Deleting is permanent and cannot be undone, because nothing is stored elsewhere."
        />
        <div className="stack">
          <p className="small muted">
            {ready
              ? `This device holds ${attempts.length} attempts and ${bookmarks.length} saved items.`
              : 'Reading local data…'}
          </p>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                window.print();
              }}
            >
              Print this page
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
              onClick={async () => {
                const confirmed = window.confirm(
                  'Delete all local progress and settings on this device? This cannot be undone.',
                );
                if (!confirmed) {
                  setStatus('Nothing was deleted.');
                  return;
                }
                await resetAll();
                setStatus('Local progress and settings were deleted.');
              }}
            >
              Delete local data
            </button>
          </div>
          <p className="small" role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </section>

      <section className="card" aria-labelledby="about-heading">
        <SectionTitle title="About this release" />
        <ul className="stack small" style={{ paddingLeft: '1.1rem' }}>
          <li>Practice items are original material; no item is labelled a previous-year question.</li>
          <li>Official syllabus and paper links are listed under Previous years.</li>
          <li>Mock runs use the workspace’s own length, timing and marking settings.</li>
          <li>No personal data is collected, and no third-party analytics are loaded.</li>
        </ul>
      </section>
    </div>
  );
}
