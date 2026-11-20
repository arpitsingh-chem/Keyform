import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { BackupFile } from './backup';
import {
  clearAllData,
  defaultSettings,
  getStorageMode,
  loadAttempts,
  loadBookmarks,
  loadSettings,
  newId,
  saveAttempts,
  saveBookmarks,
  saveSettings,
  type Attempt,
  type Settings,
  type StorageMode,
} from './storage';

interface RecordInput {
  questionId: string;
  exam: string;
  topic: string;
  correct: boolean;
  elapsedMs: number;
  sessionId: string;
}

interface StudyContextValue {
  ready: boolean;
  storageMode: StorageMode;
  attempts: Attempt[];
  bookmarks: string[];
  settings: Settings;
  recordAttempt: (input: RecordInput) => void;
  toggleBookmark: (questionId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  restoreBackup: (backup: BackupFile) => Promise<void>;
  resetAll: () => Promise<void>;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>('memory');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    let active = true;
    (async () => {
      const [storedAttempts, storedBookmarks, storedSettings] = await Promise.all([
        loadAttempts(),
        loadBookmarks(),
        loadSettings(),
      ]);
      if (!active) return;
      setAttempts(storedAttempts);
      setBookmarks(storedBookmarks);
      setSettings(storedSettings);
      setStorageMode(getStorageMode());
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  const recordAttempt = useCallback((input: RecordInput) => {
    const attempt: Attempt = {
      id: newId('attempt'),
      answerMode: 'text',
      submittedAt: new Date().toISOString(),
      ...input,
    };
    setAttempts((current) => {
      const next = [...current, attempt];
      void saveAttempts(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarks((current) => {
      const next = current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId];
      void saveBookmarks(next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  const restoreBackup = useCallback(async (backup: BackupFile) => {
    await Promise.all([
      saveAttempts(backup.attempts),
      saveBookmarks(backup.bookmarks),
      saveSettings(backup.settings),
    ]);
    setAttempts(backup.attempts);
    setBookmarks(backup.bookmarks);
    setSettings(backup.settings);
    setStorageMode(getStorageMode());
  }, []);

  const resetAll = useCallback(async () => {
    await clearAllData();
    setAttempts([]);
    setBookmarks([]);
    setSettings(defaultSettings);
    setStorageMode(getStorageMode());
  }, []);

  const value = useMemo(
    () => ({
      ready,
      storageMode,
      attempts,
      bookmarks,
      settings,
      recordAttempt,
      toggleBookmark,
      updateSettings,
      restoreBackup,
      resetAll,
    }),
    [
      ready,
      storageMode,
      attempts,
      bookmarks,
      settings,
      recordAttempt,
      toggleBookmark,
      updateSettings,
      restoreBackup,
      resetAll,
    ],
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyContextValue {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used inside StudyProvider');
  return context;
}
