/**
 * Safari Lab - program completion (Package 8).
 *
 * Pure builders that turn a finished ActiveProgram + its logged sessions into a
 * CompletedProgram block report, and that decide when a program is finished.
 * No Date/random here - the caller supplies the completion timestamp.
 */
import type { ActiveProgram } from './types';
import type { SessionLog } from '@/lib/models/session';
import type {
  CompletedProgram,
  CompletedProgramPR,
} from '@/lib/models/completed-program';
import { getExerciseById } from '@/lib/data/exercises';
import { est1RM, type WeightUnit } from './session';

/**
 * True when `program` has just had the final session of its final week logged.
 * currentWeek / currentDayIndex reflect the state BEFORE the finish advances them.
 */
export function isFinalSession(program: ActiveProgram): boolean {
  return (
    program.currentWeek >= program.weeks &&
    program.currentDayIndex >= program.daysPerWeek - 1
  );
}

/** Sessions in history that belong to this program and were completed. */
export function sessionsForProgram(
  program: ActiveProgram,
  history: SessionLog[]
): SessionLog[] {
  return history.filter(
    (s) => s.programBlockId === program.programId && s.status === 'complete'
  );
}

/** Build the block-report record for a just-finished program. */
export function buildCompletedProgram(
  program: ActiveProgram,
  history: SessionLog[],
  unit: WeightUnit,
  completedAtISO: string,
  id: string
): CompletedProgram {
  const sessions = sessionsForProgram(program, history);

  let totalSets = 0;
  let totalVolume = 0;
  const bestByExercise = new Map<string, CompletedProgramPR>();

  for (const session of sessions) {
    for (const set of session.setLogs) {
      totalSets += 1;
      if (set.weight == null || set.reps == null) continue;
      totalVolume += set.weight * set.reps;
      const e1rm = est1RM(set.weight, set.reps);
      const cur = bestByExercise.get(set.performedExerciseId);
      if (!cur || e1rm > cur.e1rm) {
        bestByExercise.set(set.performedExerciseId, {
          exerciseId: set.performedExerciseId,
          name: getExerciseById(set.performedExerciseId)?.name ?? set.performedExerciseId,
          weight: set.weight,
          reps: set.reps,
          unit: set.unit,
          e1rm: Math.round(e1rm),
        });
      }
    }
  }

  const topPRs = [...bestByExercise.values()]
    .sort((a, b) => b.e1rm - a.e1rm)
    .slice(0, 5);

  return {
    id,
    programId: program.programId,
    name: program.name,
    goal: program.goal,
    resolvedSplit: program.resolvedSplit,
    weeks: program.weeks,
    daysPerWeek: program.daysPerWeek,
    lockedAt: program.lockedAt,
    completedAt: completedAtISO,
    sessionsCompleted: sessions.length,
    totalSets,
    totalVolume: Math.round(totalVolume),
    unit,
    topPRs,
    input: program.input,
  };
}
