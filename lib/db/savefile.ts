/**
 * Safari Lab - .slfit save file (Stage 11).
 *
 * The .slfit file is a root-owned, semver-stamped JSON document (v1.4 Bible
 * Section 2). It carries everything Safari Lab stores locally so a user can back
 * up and move their data between devices. schemaVersion is the STRING semver
 * "1.0.0" (never the integer IndexedDB DB_VERSION).
 */
import { SLFIT_SCHEMA_VERSION } from '@/lib/constants/db';
import type {
  ExerciseOverride,
  MigrationHistoryEntry,
  UserSettings,
} from '@/lib/models/save-file';
import type { SessionLog } from '@/lib/models/session';
import type { ActiveProgram } from '@/lib/engine/types';
import type { CompletedProgram } from '@/lib/models/completed-program';
import type { BodyEntry } from '@/lib/models/body';

export interface SlFitSaveFile {
  app: 'SafariLab';
  schemaVersion: typeof SLFIT_SCHEMA_VERSION;
  exportedAt: string;
  exportId: string;
  localDeviceId: string;
  settings: UserSettings;
  exerciseOverrides: ExerciseOverride[];
  activeProgram: ActiveProgram | null;
  activeSession: SessionLog | null;
  sessionHistory: SessionLog[];
  /** Retired program block reports. Optional for backward compatibility. */
  completedPrograms: CompletedProgram[];
  /** Dated bodyweight + measurement snapshots. Optional for back-compat. */
  bodyEntries: BodyEntry[];
  migrationHistory: MigrationHistoryEntry[];
}

export function serializeSaveFile(file: SlFitSaveFile): string {
  return JSON.stringify(file, null, 2);
}

export type ValidationResult =
  | { ok: true; file: SlFitSaveFile }
  | { ok: false; error: string };

/**
 * Validate + normalise a parsed .slfit object. Future schema versions plug their
 * migration in here; today only "1.0.0" is known.
 */
export function validateSaveFile(raw: unknown): ValidationResult {
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: 'That file isn’t a Safari Lab save file.' };
  }
  const obj = raw as Record<string, unknown>;

  if (obj.app !== 'SafariLab') {
    return { ok: false, error: 'That file isn’t a Safari Lab save file.' };
  }
  if (obj.schemaVersion !== SLFIT_SCHEMA_VERSION) {
    return {
      ok: false,
      error: `Unsupported save-file version (${String(obj.schemaVersion)}). This build reads ${SLFIT_SCHEMA_VERSION}.`,
    };
  }
  if (typeof obj.settings !== 'object' || obj.settings === null) {
    return { ok: false, error: 'Save file is missing its settings.' };
  }

  const file: SlFitSaveFile = {
    app: 'SafariLab',
    schemaVersion: SLFIT_SCHEMA_VERSION,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : '',
    exportId: typeof obj.exportId === 'string' ? obj.exportId : '',
    localDeviceId: typeof obj.localDeviceId === 'string' ? obj.localDeviceId : '',
    settings: obj.settings as UserSettings,
    exerciseOverrides: Array.isArray(obj.exerciseOverrides)
      ? (obj.exerciseOverrides as ExerciseOverride[])
      : [],
    activeProgram: (obj.activeProgram as ActiveProgram | null) ?? null,
    activeSession: (obj.activeSession as SessionLog | null) ?? null,
    sessionHistory: Array.isArray(obj.sessionHistory)
      ? (obj.sessionHistory as SessionLog[])
      : [],
    completedPrograms: Array.isArray(obj.completedPrograms)
      ? (obj.completedPrograms as CompletedProgram[])
      : [],
    bodyEntries: Array.isArray(obj.bodyEntries)
      ? (obj.bodyEntries as BodyEntry[])
      : [],
    migrationHistory: Array.isArray(obj.migrationHistory)
      ? (obj.migrationHistory as MigrationHistoryEntry[])
      : [],
  };
  return { ok: true, file };
}

export function parseSaveFile(text: string): ValidationResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file isn’t valid JSON — it may be corrupt.' };
  }
  return validateSaveFile(raw);
}

export interface SaveFileSummary {
  hasProgram: boolean;
  programName?: string;
  completedSessions: number;
  overrides: number;
  exportedAt: string;
}

export function summariseSaveFile(file: SlFitSaveFile): SaveFileSummary {
  return {
    hasProgram: !!file.activeProgram,
    programName: file.activeProgram?.name,
    completedSessions: file.sessionHistory.filter((s) => s.status === 'complete').length,
    overrides: file.exerciseOverrides.length,
    exportedAt: file.exportedAt,
  };
}
