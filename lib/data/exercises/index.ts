/**
 * Safari Lab - exercise library access layer.
 * Search/filter helpers, facet lists, substitution lookup and an integrity
 * guard that throws on duplicate ids/slugs (Stage 3 acceptance: no duplicates).
 */
import type {
  ExerciseDefinition,
  ExperienceLevel,
  MuscleGroup,
} from '@/lib/models/exercise';
import { muscleLabel, patternLabel } from './factory';
import { SEED_EXERCISES } from './seed';

export { muscleLabel, patternLabel };

/** Throws if any id or slug is duplicated. Runs once at module load. */
function validateLibrary(list: ExerciseDefinition[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const ex of list) {
    if (ids.has(ex.id)) throw new Error(`Duplicate exercise id: ${ex.id}`);
    if (slugs.has(ex.slug))
      throw new Error(`Duplicate exercise slug: ${ex.slug} (id ${ex.id})`);
    ids.add(ex.id);
    slugs.add(ex.slug);
  }
}

validateLibrary(SEED_EXERCISES);

export function getAllExercises(): ExerciseDefinition[] {
  return SEED_EXERCISES;
}

export function getExerciseBySlug(slug: string): ExerciseDefinition | undefined {
  return SEED_EXERCISES.find((e) => e.slug === slug);
}

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return SEED_EXERCISES.find((e) => e.id === id);
}

/** Same swap group, excluding the exercise itself. */
export function getAlternatives(ex: ExerciseDefinition): ExerciseDefinition[] {
  return SEED_EXERCISES.filter(
    (e) => e.swapGroup === ex.swapGroup && e.id !== ex.id
  );
}

export interface ExerciseFilter {
  query?: string;
  muscle?: MuscleGroup | 'all';
  equipment?: string | 'all';
  level?: ExperienceLevel | 'all';
}

export function filterExercises(
  filter: ExerciseFilter,
  list: ExerciseDefinition[] = SEED_EXERCISES
): ExerciseDefinition[] {
  const q = filter.query?.trim().toLowerCase();
  return list.filter((ex) => {
    if (filter.muscle && filter.muscle !== 'all') {
      if (
        ex.primaryMuscle !== filter.muscle &&
        !ex.secondaryMuscles.includes(filter.muscle)
      )
        return false;
    }
    if (filter.equipment && filter.equipment !== 'all') {
      if (!ex.equipment.includes(filter.equipment)) return false;
    }
    if (filter.level && filter.level !== 'all') {
      if (ex.difficulty !== filter.level) return false;
    }
    if (q) {
      const haystack = [
        ex.name,
        ex.primaryMuscle,
        ...ex.aliases,
        ...ex.equipment,
        ...ex.substitutionTags,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Muscle groups that actually appear as a primary muscle, with labels. */
export function getMuscleFacets(): { value: MuscleGroup; label: string }[] {
  const present = new Set<MuscleGroup>();
  for (const ex of SEED_EXERCISES) present.add(ex.primaryMuscle);
  return [...present]
    .map((value) => ({ value, label: muscleLabel(value) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Unique equipment tokens across the library, sorted. */
export function getEquipmentFacets(): string[] {
  const set = new Set<string>();
  for (const ex of SEED_EXERCISES) for (const e of ex.equipment) set.add(e);
  return [...set].sort();
}

export const LEVEL_FACETS: ExperienceLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
];
