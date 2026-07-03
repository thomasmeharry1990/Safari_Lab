/**
 * Safari Lab - typed local repository over IndexedDB (Stage 6).
 * Provides defaults so callers get sensible values before/without stored data.
 */
import { DB_STORES, SLFIT_SCHEMA_VERSION } from '@/lib/constants/db';
import type { ExerciseOverride, UserSettings } from '@/lib/models/save-file';
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

/** Wipe all local data (settings, overrides, programs, sessions, everything). */
export async function clearAllData(): Promise<void> {
  await idbClearAll();
}
