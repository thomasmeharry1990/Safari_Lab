/**
 * Safari Lab - completed-program record (Stage / Package 8).
 *
 * When the final session of the final week of an ActiveProgram is finished, the
 * program is retired into a CompletedProgram: a compact "block report" summary
 * plus the original GeneratorInput so the athlete can start a fresh next block.
 * Stored in the `completedPrograms` IndexedDB store and carried in .slfit exports.
 */
import type { TrainingGoal } from '@/lib/models/program';
import type { GeneratorInput } from '@/lib/engine/types';
import type { WeightUnit } from '@/lib/engine';

export interface CompletedProgramPR {
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  unit: WeightUnit;
  e1rm: number;
}

export interface CompletedProgram {
  id: string; // unique record id (not the programId)
  programId: string;
  name: string;
  goal: TrainingGoal;
  resolvedSplit: string;
  weeks: number;
  daysPerWeek: number;
  lockedAt: string;
  completedAt: string;
  sessionsCompleted: number;
  totalSets: number;
  totalVolume: number;
  unit: WeightUnit;
  topPRs: CompletedProgramPR[];
  /** Original generator input, so a next block can be built from the same brief. */
  input: GeneratorInput;
}
