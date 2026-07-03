/**
 * Safari Lab - dose assignment (sets/reps/rest) for a chosen exercise.
 * Shared by the generator and the swap engine so swapping keeps consistent dose.
 */
import type { ExerciseDefinition, MuscleGroup } from '@/lib/models/exercise';
import type { TrainingGoal } from '@/lib/models/program';
import type { DraftExercise, GeneratorInput } from './types';

export function goalRepKey(
  goal: TrainingGoal
): 'hypertrophy' | 'strength' | 'endurance' {
  if (goal === 'strength') return 'strength';
  if (goal === 'endurance_support') return 'endurance';
  return 'hypertrophy';
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function buildDraftExercise(
  ex: ExerciseDefinition,
  muscle: MuscleGroup,
  input: GeneratorInput
): DraftExercise {
  const isPriority = input.priorityMuscles.includes(muscle);
  const wantsConditioning =
    input.goal === 'fat_loss_support' || input.goal === 'endurance_support';
  const repKey = goalRepKey(input.goal);
  const repRange = ex.targetRepRanges[repKey] ?? ex.defaultRepRange;

  let sets = clamp(ex.defaultSets, 2, 5);
  if (isPriority) sets = Math.min(sets + 1, ex.compound ? 5 : 4);

  const rest =
    input.goal === 'strength'
      ? ex.restSeconds.max
      : wantsConditioning
        ? ex.restSeconds.min
        : Math.round((ex.restSeconds.min + ex.restSeconds.max) / 2);

  return {
    exerciseId: ex.id,
    name: ex.name,
    slug: ex.slug,
    muscle,
    sets,
    repRange,
    restSeconds: rest,
    isPriority,
    isCompound: ex.compound,
  };
}
