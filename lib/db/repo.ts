/**
 * Safari Lab - typed local repository over IndexedDB (Stage 6).
 * Provides defaults so callers get sensible values before/without stored data.
 */
import { DB_STORES, SLFIT_SCHEMA_VERSION } from '@/lib/constants/db';
import type { ExerciseOverride, UserSettings } from '@/lib/models/save-file';
import type { ActiveProgram } from '@/lib/engine/types';
import type { SessionLog } from '@/lib/models/session';
import {
  idbClearAll,
  idbDelete,
  idbGet,
  idbGetAll,
  idbPut,
  isBrowserDbAvailable,
} from './indexeddb';

const SINGLETON = 'singleton';

export const DEFAULT_SETTINGS: UserSettings = {
  unitSystem: 'metric',
  hapticsEnabled: true,
  soundEnabled: true,
  restTimerDefaultSeconds: 90,
  backupRemindersEnabled: true,
};

export interface AppMeta {
  id: typeof SINGLETON;
  deviceId: string;
  schemaVersion: string;
  createdAt: string;
  lastBackupAt?: string;
}

interface StoredSettings extends UserSettings {
  id: typeof SINGLETON;
}

export async function getSettings(): Promise<UserSettings> {
  if (!isBrowserDbAvailable()) return DEFAULT_SETTINGS;
  const stored = await idbGet<StoredSettings>(DB_STORES.settings, SINGLETON);
  if (!stored) return DEFAULT_SETTINGS;
  const { id: _id, ...settings } = stored;
  return { ...DEFAULT_SETTINGS, ...settings };
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await idbPut<StoredSettings>(DB_STORES.settings, { id: SINGLETON, ...settings });
}

export async function getAppMeta(): Promise<AppMeta> {
  const existing = await idbGet<AppMeta>(DB_STORES.appMeta, SINGLETON);
  if (existing) return existing;
  const meta: AppMeta = {
    id: SINGLETON,
    deviceId: crypto.randomUUID(),
    schemaVersion: SLFIT_SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
  };
  await idbPut(DB_STORES.appMeta, meta);
  return meta;
}

export async function getOverrides(): Promise<ExerciseOverride[]> {
  if (!isBrowserDbAvailable()) return [];
  return idbGetAll<ExerciseOverride>(DB_STORES.exerciseOverrides);
}

export async function putOverride(o: ExerciseOverride): Promise<void> {
  await idbPut(DB_STORES.exerciseOverrides, o);
}

export async function deleteOverride(exerciseId: string): Promise<void> {
  await idbDelete(DB_STORES.exerciseOverrides, exerciseId);
}

interface StoredActiveProgram extends ActiveProgram {
  id: typeof SINGLETON;
}

export async function getActiveProgram(): Promise<ActiveProgram | null> {
  if (!isBrowserDbAvailable()) return null;
  const stored = await idbGet<StoredActiveProgram>(DB_STORES.activeProgram, SINGLETON);
  if (!stored) return null;
  const { id: _id, ...program } = stored;
  return program;
}

export async function saveActiveProgram(program: ActiveProgram): Promise<void> {
  await idbPut<StoredActiveProgram>(DB_STORES.activeProgram, {
    id: SINGLETON,
    ...program,
  });
}

export async function clearActiveProgram(): Promise<void> {
  await idbDelete(DB_STORES.activeProgram, SINGLETON);
}

// --- Active gym session (singleton) + completed session history (collection) ---

interface StoredActiveSession {
  id: typeof SINGLETON;
  session: SessionLog;
}

export async function getActiveSession(): Promise<SessionLog | null> {
  if (!isBrowserDbAvailable()) return null;
  const stored = await idbGet<StoredActiveSession>(DB_STORES.activeSession, SINGLETON);
  return stored?.session ?? null;
}

export async function saveActiveSession(session: SessionLog): Promise<void> {
  await idbPut<StoredActiveSession>(DB_STORES.activeSession, { id: SINGLETON, session });
}

export async function clearActiveSession(): Promise<void> {
  await idbDelete(DB_STORES.activeSession, SINGLETON);
}

export async function getSessionHistory(): Promise<SessionLog[]> {
  if (!isBrowserDbAvailable()) return [];
  return idbGetAll<SessionLog>(DB_STORES.sessionHistory);
}

export async function addSessionToHistory(session: SessionLog): Promise<void> {
  await idbPut(DB_STORES.sessionHistory, session);
}

/** Wipe all local data (settings, overrides, programs, sessions, everything). */
export async function clearAllData(): Promise<void> {
  await idbClearAll();
}
