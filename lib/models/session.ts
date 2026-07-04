/**
 * Safari Lab - Canonical session logging schema (v1.4 Bible Section 3).
 *
 * Key canonical decisions:
 *   - SetLog primary identifier is `id` (NEVER `setId`).
 *   - Swap events are EMBEDDED in the session (SessionLog.swapEvents) and travel
 *     inside activeSession while live, then inside sessionHistory when complete.
 *     There is NO separate swapEvents IndexedDB store.
 */

export type SessionStatus =
  | 'notStarted'
  | 'inProgress'
  | 'complete'
  | 'abandoned';

export type ExerciseBlockStatus =
  | 'notStarted'
  | 'inProgress'
  | 'complete'
  | 'skipped'
  | 'swapped';

export type SwapReason =
  | 'equipment-unavailable'
  | 'pain-discomfort'
  | 'preference'
  | 'busy-gym'
  | 'randomise'
  | 'other';

export interface ExerciseSwapEvent {
  id: string;
  sessionLogId: string;
  sessionExerciseBlockId: string;
  fromExerciseId: string;
  toExerciseId: string;
  reason: SwapReason;
  occurredAt: string; // ISO datetime
  preserveExistingSets: true;
  userNote?: string;
}

export interface SetLog {
  id: string; // canonical primary identifier - NOT setId
  sessionLogId: string;
  sessionExerciseBlockId: string;
  plannedExerciseId: string;
  performedExerciseId: string;
  setNumber: number;
  targetReps?: number;
  reps?: number;
  weight?: number;
  unit: 'kg' | 'lb';
  rpe?: number;
  rir?: number;
  isWarmUp?: boolean;
  isPR?: boolean;
  completedAt?: string;
  notes?: string;
  swappedFromExerciseId?: string;
  swappedToExerciseId?: string;
  swapEventId?: string;
}

export interface SessionExerciseBlock {
  id: string;
  plannedExerciseId: string;
  currentExerciseId: string;
  originalExerciseId?: string;
  order: number;
  status: ExerciseBlockStatus;
  targetSets: number;
  targetRepRange: [number, number];
  targetRestSeconds: number;
  setLogIds: string[];
  swapEventIds: string[];
}

/**
 * Adaptation events record when the local rules engine changed the plan and why.
 * Fleshed out in Stage 10 (Adaptation). Minimal canonical shape for now so
 * SessionLog and the save file type-check.
 */
export interface AdaptationEvent {
  id: string;
  ruleId: string; // canonical AdaptiveRuleId (see models/adaptive.ts)
  occurredAt: string;
  explanation: string; // required plain-English "why" (doctrine)
  reversible: boolean;
}

export interface SessionLog {
  id: string;
  programBlockId?: string;
  weekNumber?: number;
  plannedWorkoutId?: string;
  quickSafariId?: string;
  status: SessionStatus;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  exerciseBlocks: SessionExerciseBlock[];
  setLogs: SetLog[];
  swapEvents: ExerciseSwapEvent[]; // embedded here; no separate store
  adaptationEvents: AdaptationEvent[];
  expeditionLogId?: string;
  /** Embedded expedition log (mood/tags/notes) captured on completion. */
  expeditionLog?: import('./expedition').ExpeditionLog;
}
