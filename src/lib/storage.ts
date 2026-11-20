/**
 * Local persistence.
 *
 * IndexedDB is used when available; localStorage is a fallback for private
 * browsing modes. If both fail, the app keeps working for the current session
 * and tells the learner that progress will not be saved.
 *
 * Nothing here sends data anywhere: the MVP has no account and no backend.
 */

const DB_NAME = 'keyform';
const DB_VERSION = 1;
const STORE = 'kv';

export type StorageMode = 'indexeddb' | 'localstorage' | 'memory';

export type Attempt = {
  id: string;
  questionId: string;
  exam: string;
  topic: string;
  correct: boolean;
  submittedAt: string;
  elapsedMs: number;
  answerMode: 'text' | 'letter';
  sessionId: string;
};

export type Settings = {
  theme: 'light' | 'dark';
  answerMode: 'text' | 'letter';
  dailyGoal: number;
  sessionLength: number;
  /** Hide the four reference options until an answer is submitted. */
  hideOptions: boolean;
};

export const defaultSettings: Settings = {
  theme: 'light',
  answerMode: 'text',
  dailyGoal: 20,
  sessionLength: 10,
  hideOptions: false,
};

let mode: StorageMode = detectMode();
let memory = new Map<string, unknown>();

function detectMode(): StorageMode {
  try {
    if (typeof indexedDB !== 'undefined') return 'indexeddb';
  } catch {
    /* ignore */
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.getItem('keyform:probe');
      return 'localstorage';
    }
  } catch {
    /* ignore */
  }
  return 'memory';
}

export function getStorageMode(): StorageMode {
  return mode;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function readValue<T>(key: string, fallback: T): Promise<T> {
  try {
    if (mode === 'indexeddb') {
      const value = await idbGet<T>(key);
      return value === undefined ? fallback : value;
    }
    if (mode === 'localstorage') {
      const raw = localStorage.getItem(`keyform:${key}`);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    }
  } catch {
    mode = 'memory';
  }
  return (memory.get(key) as T | undefined) ?? fallback;
}

export async function writeValue(key: string, value: unknown): Promise<boolean> {
  try {
    if (mode === 'indexeddb') {
      await idbSet(key, value);
      return true;
    }
    if (mode === 'localstorage') {
      localStorage.setItem(`keyform:${key}`, JSON.stringify(value));
      return true;
    }
  } catch {
    mode = 'memory';
  }
  memory.set(key, value);
  return false;
}

export function newId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* ---------- typed helpers ---------- */

export const loadAttempts = () => readValue<Attempt[]>('attempts', []);
export const saveAttempts = (attempts: Attempt[]) => writeValue('attempts', attempts);
export const loadBookmarks = () => readValue<string[]>('bookmarks', []);
export const saveBookmarks = (ids: string[]) => writeValue('bookmarks', ids);

export async function loadSettings(): Promise<Settings> {
  const stored = await readValue<Partial<Settings>>('settings', {});
  return { ...defaultSettings, ...stored };
}

export const saveSettings = (settings: Settings) => writeValue('settings', settings);

export async function clearAllData(): Promise<void> {
  await writeValue('attempts', []);
  await writeValue('bookmarks', []);
  await writeValue('settings', defaultSettings);
  memory = new Map();
}
