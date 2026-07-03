/**
 * Safari Lab - minimal IndexedDB wrapper (Stage 6). No external dependencies.
 *
 * Opens the local database, creates the canonical stores (v1.4 Bible Section 8)
 * in onupgradeneeded, and exposes small promise-based get/put/getAll/delete/clear
 * helpers. All access is browser-only; on the server (static export prerender)
 * these reject, and callers fall back to defaults.
 *
 * DB_VERSION is an INTEGER upgrade track, separate from the .slfit semver.
 */
import { DB_NAME, DB_STORES, DB_VERSION } from '@/lib/constants/db';

/** Stores keyed by something other than `id`. */
const STORE_KEYPATH: Record<string, string> = {
  [DB_STORES.exerciseOverrides]: 'exerciseId',
};

function keyPathFor(store: string): string {
  return STORE_KEYPATH[store] ?? 'id';
}

export function isBrowserDbAvailable(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDB(): Promise<IDBDatabase> {
  if (!isBrowserDbAvailable()) {
    return Promise.reject(new Error('IndexedDB is not available'));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      for (const store of Object.values(DB_STORES)) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: keyPathFor(store) });
        }
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to open IndexedDB'));
    req.onblocked = () => reject(new Error('IndexedDB open blocked by another tab'));
  });

  return dbPromise;
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (os: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(store, mode);
        const request = run(transaction.objectStore(store));
        transaction.oncomplete = () => resolve(request.result);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      })
  );
}

export function idbGet<T>(store: string, key: IDBValidKey): Promise<T | undefined> {
  return tx<T | undefined>(store, 'readonly', (os) => os.get(key) as IDBRequest<T | undefined>);
}

export function idbGetAll<T>(store: string): Promise<T[]> {
  return tx<T[]>(store, 'readonly', (os) => os.getAll() as IDBRequest<T[]>);
}

export function idbPut<T>(store: string, value: T): Promise<void> {
  return tx(store, 'readwrite', (os) => os.put(value as unknown as object)).then(() => undefined);
}

export function idbDelete(store: string, key: IDBValidKey): Promise<void> {
  return tx(store, 'readwrite', (os) => os.delete(key)).then(() => undefined);
}

export function idbClearStore(store: string): Promise<void> {
  return tx(store, 'readwrite', (os) => os.clear()).then(() => undefined);
}

/** Clear every store (used by "Clear all local data"). */
export async function idbClearAll(): Promise<void> {
  await Promise.all(Object.values(DB_STORES).map((s) => idbClearStore(s)));
}
