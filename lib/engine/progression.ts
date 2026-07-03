/**
 * Safari Lab - progression recommendations (Stage 9).
 *
 * Deterministic next-target suggestions from logged history, following the
 * exercise's progression model (double-progression by default): when every
 * working set hit the top of the rep range last time, add load and reset reps to
 * the bottom; otherwise keep the load and chase one more rep. Bodyweight moves
 * add reps; timed/carry moves add a little time/distance.
 */
import type { ExerciseDefinition, MuscleGroup } from '@/lib/models/exercise';
import type { SessionLog, SetLog } from '@/lib/models/session';
import type { WeightUnit } from './session';

export type ProgressionAction =
  | 'start'
  | 'add-reps'
  | 'increase-load'
  | 'add-time'
  | 'add-distance';

export interface ProgressionRec {
  action: ProgressionAction;
  suggestedWeight?: number;
  suggestedReps?: number;
  rationale: string;
  incrementUsed?: number;
}

const LOWER_MUSCLES: MuscleGroup[] = [
  'quads', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors',
];

/** Smallest sensible load jump for this movement and unit. */
export function loadIncrement(ex: ExerciseDefinition, unit: WeightUnit): number {
  const big = ex.compound && LOWER_MUSCLES.includes(ex.primaryMuscle);
  if (unit === 'kg') return big ? 5 : 2.5;
  return big ? 10 : 5;
}

/** Sets for this exercise from the most recent completed session, if any. */
function lastSessionSets(history: SessionLog[], exerciseId: string): SetLog[] {
  const completed = history.filter(
    (s) => s.status === 'complete' && s.setLogs.some((x) => x.performedExerciseId === exerciseId)
  );
  if (!completed.length) return [];
  completed.sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  const latest = completed[0]!;
  return latest.setLogs.filter(
    (x) => x.performedExerciseId === exerciseId && x.reps != null
  );
}

export function recommendNext(
  ex: ExerciseDefinition,
  repRange: [number, number],
  history: SessionLog[],
  unit: WeightUnit
): ProgressionRec {
  const [bottom, top] = repRange;
  const sets = lastSessionSets(history, ex.id);

  // No usable history -> establish a baseline.
  if (sets.length === 0) {
    return {
      action: 'start',
      suggestedReps: top,
      rationale: 'First time — pick a weight you can control for every set.',
    };
  }

  const model = ex.progressionModel;

  // Timed / distance movements: nudge the duration/distance up.
  if (model === 'duration' || model === 'distance') {
    const lastReps = Math.max(...sets.map((s) => s.reps ?? 0));
    return {
      action: model === 'duration' ? 'add-time' : 'add-distance',
      suggestedReps: lastReps + 1,
      rationale:
        model === 'duration'
          ? `Last time you held ${lastReps}. Add a little time this session.`
          : `Last time you covered ${lastReps}. Push a bit further.`,
    };
  }

  const weighted = sets.filter((s) => s.weight != null);
  const workingWeight = weighted.length
    ? Math.max(...weighted.map((s) => s.weight!))
    : undefined;
  const maxReps = Math.max(...sets.map((s) => s.reps ?? 0));
  const allHitTop = sets.every((s) => (s.reps ?? 0) >= top);

  // Bodyweight / rep-driven progression (no external load).
  if (workingWeight == null || model === 'reps') {
    return {
      action: 'add-reps',
      suggestedReps: Math.min(top, maxReps + 1),
      rationale: allHitTop
        ? `You reached ${top} reps — keep adding reps or a harder variation.`
        : `Last time ${maxReps} reps. Aim for one more toward ${top}.`,
    };
  }

  if (allHitTop) {
    const inc = loadIncrement(ex, unit);
    return {
      action: 'increase-load',
      suggestedWeight: workingWeight + inc,
      suggestedReps: bottom,
      incrementUsed: inc,
      rationale: `You hit ${top} reps on every set — add ${inc}${unit} and build back up from ${bottom}.`,
    };
  }

  return {
    action: 'add-reps',
    suggestedWeight: workingWeight,
    suggestedReps: Math.min(top, maxReps + 1),
    rationale: `Match ${workingWeight}${unit} and earn one more rep toward ${top}.`,
  };
}
