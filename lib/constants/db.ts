/**
 * Safari Lab - Storage version constants (v1.4 Bible Section 8).
 *
 * CRITICAL: the .slfit save-file schema version and the IndexedDB database
 * version are two SEPARATE systems. Do not confuse them.
 *   - SLFIT_SCHEMA_VERSION: string semver, owned by the root save file only.
 *   - DB_VERSION: integer, passed to indexedDB.open(name, version) for store
 *     upgrades via onupgradeneeded. Increment when adding a store/index.
 */

/** Root save-file schema version. String semver. Root object only. */
export const SLFIT_SCHEMA_VERSION = '1.0.0' as const;

/** Alias kept for parity with Bible naming (Section 2.1). */
export const CURRENT_SL_FIT_SCHEMA_VERSION = SLFIT_SCHEMA_VERSION;

/** User-owned save file extension. */
export const SLFIT_EXTENSION = '.slfit' as const;

export const DB_NAME = 'safari-lab-local' as const;

/** Integer for IndexedDB store upgrades ONLY. Never a semver. */
export const DB_VERSION = 4 as const;

/**
 * IndexedDB object stores (v1.4 Section 8.1). Swap events are embedded inside
 * activeSession / sessionHistory documents - there is deliberately NO separate
 * swapEvents store.
 */
export const DB_STORES = {
  appMeta: 'appMeta', // app version, localDeviceId, lastBackupAt, activeTabLock
  settings: 'settings', // user settings and privacy preferences
  profile: 'profile', // local profile data only
  activeProgram: 'activeProgram', // current locked or editable program
  completedPrograms: 'completedPrograms', // completed program summaries
  activeSession: 'activeSession', // in-progress gym session, incl. swapEvents
  sessionHistory: 'sessionHistory', // completed/abandoned sessions, incl. swapEvents
  quickSafaris: 'quickSafaris', // one-off sessions and conversion metadata
  progressSnapshots: 'progressSnapshots', // calculated local progress snapshots
  exerciseOverrides: 'exerciseOverrides', // favourites, blocked exercises, notes
  audit: 'audit', // import/export/migration/adaptation audit trail
} as const;

export type DbStoreName = (typeof DB_STORES)[keyof typeof DB_STORES];

/** BroadcastChannel name for multi-tab active-session lock (v1.4 Section 8.3). */
export const TAB_LOCK_CHANNEL = 'safari-lab-tab-lock' as const;
