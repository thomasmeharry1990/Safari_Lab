import { describe, expect, it } from 'vitest';
import {
  filterExercises,
  getAllExercises,
  getAlternatives,
  getExerciseBySlug,
} from '@/lib/data/exercises';

describe('exercise library', () => {
  const all = getAllExercises();

  it('has the full seed library', () => {
    expect(all.length).toBe(139);
  });

  it('has no duplicate ids or slugs', () => {
    const ids = new Set(all.map((e) => e.id));
    const slugs = new Set(all.map((e) => e.slug));
    expect(ids.size).toBe(all.length);
    expect(slugs.size).toBe(all.length);
  });

  it('every exercise has cues and a valid rep range', () => {
    for (const ex of all) {
      expect(ex.cues.length).toBeGreaterThan(0);
      expect(ex.defaultRepRange[0]).toBeLessThanOrEqual(ex.defaultRepRange[1]);
      expect(ex.defaultSets).toBeGreaterThan(0);
    }
  });

  it('filters by muscle and equipment', () => {
    const glutes = filterExercises({ muscle: 'glutes' }, all);
    expect(glutes.length).toBeGreaterThan(0);
    expect(glutes.every((e) => e.primaryMuscle === 'glutes' || e.secondaryMuscles.includes('glutes'))).toBe(true);

    const barbell = filterExercises({ equipment: 'barbell' }, all);
    expect(barbell.every((e) => e.equipment.includes('barbell'))).toBe(true);
  });

  it('search matches names and aliases', () => {
    const res = filterExercises({ query: 'squat' }, all);
    expect(res.some((e) => e.name === 'Barbell Back Squat')).toBe(true);
  });

  it('alternatives share a swap group and exclude self', () => {
    const squat = getExerciseBySlug('barbell-back-squat')!;
    const alts = getAlternatives(squat);
    expect(alts.length).toBeGreaterThan(0);
    expect(alts.every((a) => a.swapGroup === squat.swapGroup && a.id !== squat.id)).toBe(true);
  });
});
