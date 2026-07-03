/**
 * Safari Lab - substitution engine (Stage 5).
 *
 * getSwapCandidates() returns valid alternatives for an exercise, honouring the
 * same equipment / level / avoid / BLOCKED filters as generation. It follows the
 * Bible substitution logic: prefer the same swap group (equivalent movement),
 * then fall back to same-muscle/same-pattern options. A blocked exercise is never
 * offered, so a swapped-in choice can never be something the user removed.
 */
import type { ExerciseDefinition, MuscleGroup } from '@/lib/models/exercise';
import { getAllExercises, getExerciseById } from '@/lib/data/exercises';
import { isAvoided, levelOk, resolveAvailable, usable } from './filters';
import { buildDraftExercise } from './dose';
import type { DraftExercise, GeneratorInput } from './types';

export function getSwapCandidates(
  currentExerciseId: string,
  input: GeneratorInput
): ExerciseDefinition[] {
  const current = getExerciseById(currentExerciseId);
  if (!current) return [];

  const available = resolveAvailable(input.equipment);
  const blocked = new Set(input.blocked ?? []);

  const base = getAllExercises().filter(
    (e) =>
      e.id !== current.id &&
      !blocked.has(e.id) &&
      usable(e, available) &&
      levelOk(e, input.experience) &&
      !isAvoided(e, input.avoid)
  );

  const rank = (ex: ExerciseDefinition): number => {
    let s = 0;
    if (ex.primaryMuscle === current.primaryMuscle) s += 40;
    if (ex.movementPattern === current.movementPattern) s += 20;
    if (ex.compound === current.compound) s += 10;
    return s;
  };
  const byScore = (a: ExerciseDefinition, b: ExerciseDefinition) =>
    rank(b) - rank(a) || a.id.localeCompare(b.id);

  const sameGroup = base
    .filter((e) => e.swapGroup === current.swapGroup)
    .sort(byScore);
  const samePattern = base
    .filter(
      (e) =>
        e.swapGroup !== current.swapGroup &&
        e.movementPattern === current.movementPattern &&
        (e.primaryMuscle === current.primaryMuscle ||
          e.secondaryMuscles.includes(current.primaryMuscle))
    )
    .sort(byScore);

  const seen = new Set<string>();
  const out: ExerciseDefinition[] = [];
  for (const ex of [...sameGroup, ...samePattern]) {
    if (seen.has(ex.id)) continue;
    seen.add(ex.id);
    out.push(ex);
  }
  return out;
}

/** Build a replacement DraftExercise for a slot, keeping the slot's muscle. */
export function buildSwap(
  newExerciseId: string,
  muscle: MuscleGroup,
  input: GeneratorInput
): DraftExercise | null {
  const ex = getExerciseById(newExerciseId);
  if (!ex) return null;
  return { ...buildDraftExercise(ex, muscle, input), isSwapped: true };
}
