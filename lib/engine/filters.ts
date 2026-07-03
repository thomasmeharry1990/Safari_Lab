/**
 * Safari Lab - shared exercise filters for the generator + swap engine.
 * Kept in one place so generation and substitution apply identical rules.
 */
import type { ExerciseDefinition, ExperienceLevel } from '@/lib/models/exercise';
import type { AvoidFlag, EquipmentProfile } from './types';

export const PROFILE_EQUIPMENT: Record<EquipmentProfile, Set<string> | 'all'> = {
  full_gym: 'all',
  dumbbells: new Set([
    'dumbbells', 'dumbbell', 'bench', 'bodyweight', 'plate', 'box',
    'kettlebell', 'kettlebells', 'band', 'ez-bar',
  ]),
  home: new Set([
    'dumbbells', 'dumbbell', 'bench', 'bodyweight', 'band', 'kettlebell',
    'kettlebells', 'plate', 'box', 'pullup-bar', 'ez-bar', 'ab-wheel', 'bar',
  ]),
  bodyweight: new Set([
    'bodyweight', 'band', 'pullup-bar', 'box', 'dip-bars', 'ab-wheel', 'bar',
  ]),
};

export const LEVEL_RANK: Record<ExperienceLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export function resolveAvailable(profile: EquipmentProfile): Set<string> | 'all' {
  return PROFILE_EQUIPMENT[profile];
}

export function usable(
  ex: ExerciseDefinition,
  available: Set<string> | 'all'
): boolean {
  if (available === 'all') return true;
  return ex.equipment.every((e) => available.has(e));
}

export function levelOk(
  ex: ExerciseDefinition,
  experience: ExperienceLevel
): boolean {
  return LEVEL_RANK[ex.difficulty] <= LEVEL_RANK[experience];
}

export function isAvoided(ex: ExerciseDefinition, flags: AvoidFlag[]): boolean {
  for (const f of flags) {
    if (f === 'no_barbell' && ex.equipment.includes('barbell')) return true;
    if (f === 'knee' && (ex.movementPattern === 'lunge' || ex.swapGroup === 'knee-dominant'))
      return true;
    if (
      f === 'shoulder' &&
      (ex.movementPattern === 'vertical_push' ||
        ex.swapGroup === 'overhead-press' ||
        ex.swapGroup === 'dip')
    )
      return true;
    if (
      f === 'lower_back' &&
      (ex.swapGroup === 'deadlift-variant' ||
        ex.secondaryMuscles.includes('lower_back') ||
        (ex.movementPattern === 'hinge' && ex.equipment.includes('barbell')))
    )
      return true;
  }
  return false;
}
