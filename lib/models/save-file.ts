/**
 * Safari Lab - Canonical .slfit save file (v1.4 Bible Section 2).
 *
 * The .slfit file is a ROOT-owned, semver-stamped JSON document. Child entities
 * do NOT own schemaVersion. The v1.0 example with integer `schemaVersion: 1` is
 * WRONG and must never be reproduced. Correct root value is the string "1.0.0".
 *
 * Types marked "[stage-N placeholder]" are minimal canonical shapes owned by a
 * later stage. Kept small on purpose so this contract type-checks today.
 */

import type { SLFIT_SCHEMA_VERSION } from '../constants/db';
import type { ExpeditionLog } from './expedition';
import type { ProgramBlock, ProgramBlockSummary } from './program';
import type { SessionLog } from './session';

export type UnitSystem = 'metric' | 'imperial';

/** [stage-6 placeholder] Local, device-only user preferences. */
export interface UserSettings {
  unitSystem: UnitSystem;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  restTimerDefaultSeconds: number;
  backupRemindersEnabled: boolean;
}

/** [stage-6 placeholder] Local profile metadata only. No PII required. */
export interface LocalProfile {
  displayName?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

/** [stage-9 placeholder] A personal record derived from session history. */
export interface PersonalRecord {
  id: string;
  exerciseId: string;
  type: 'weight' | 'reps' | 'estimated-1rm' | 'volume';
  value: number;
  unit?: 'kg' | 'lb';
  achievedAt: string;
}

/** [stage-12 placeholder] Cached progress/chart values. */
export interface ProgressSnapshot {
  id: string;
  createdAt: string;
  metric: string;
  value: number;
}

/** [stage-5 placeholder] Local exercise overrides: favourites, blocks, notes. */
export interface ExerciseOverride {
  exerciseId: string;
  blocked?: boolean;
  favourite?: boolean;
  note?: string;
}

/** [stage-8 placeholder] One-off Quick Safari session + conversion metadata. */
export interface QuickSafariSession {
  id: string;
  createdAt: string;
  convertedToProgramId?: string;
  session: SessionLog;
}

/** Migration audit entry (v1.4 Section 2.2 - required, renamed from migrationNotes). */
export interface MigrationHistoryEntry {
  id: string;
  fromSchemaVersion: string;
  toSchemaVersion: string;
  migratedAt: string;
  notes: string[];
}

/** General import/export/migration/adaptation audit trail entry. */
export interface AuditEntry {
  id: string;
  type: 'import' | 'export' | 'migration' | 'adaptation' | 'lock-transfer';
  occurredAt: string;
  detail: string;
}

/**
 * Legacy import archive (v1.4 Section 2.3). Preserves old user data that cannot
 * be reconstructed into the canonical model. Ignored by new calculations, but it
 * MUST survive export/import - never destroy old data on migration.
 */
export interface LegacyImportArchive {
  sourceSchemaVersion: string;
  importedAt: string;
  exerciseHistory?: unknown[];
  deprecatedRuleIds?: string[];
  originalMoodValues?: Record<string, string>;
  notes: string[];
}

/** The canonical root save file. */
export interface SafariLabSaveFile {
  app: 'SafariLab';
  schemaVersion: typeof SLFIT_SCHEMA_VERSION; // "1.0.0" - string semver, root only
  exportedAt: string; // ISO datetime
  exportId: string;
  localDeviceId: string;
  settings: UserSettings;
  profile: LocalProfile;
  activeProgram?: ProgramBlock;
  completedPrograms: ProgramBlockSummary[];
  activeSession?: SessionLog;
  sessionHistory: SessionLog[];
  quickSafaris: QuickSafariSession[];
  personalRecords: PersonalRecord[];
  progressSnapshots: ProgressSnapshot[];
  exerciseOverrides: ExerciseOverride[];
  expeditionLogs: ExpeditionLog[];
  migrationHistory: MigrationHistoryEntry[];
  legacyImportArchive?: LegacyImportArchive;
  audit: AuditEntry[];
}
