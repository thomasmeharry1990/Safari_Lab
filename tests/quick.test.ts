import { describe, expect, it } from 'vitest';
import { generateQuickSession } from '@/lib/engine';
import type { QuickInput } from '@/lib/engine';
import { getExerciseById } from '@/lib/data/exercises';

function input(over: Partial<QuickInput> = {}): QuickInput {
  return {
    goal: 'build_muscle',
    experience: 'intermediate',
    durationMinutes: 45,
    equipment: 'full_gym',
    targetMuscles: [],
    avoid: [],
    ...over,
  };
}

describe('generateQuickSession', () => {
  it('produces a single session with exercises', () => {
    const s = generateQuickSession(input());
    expect(s.exercises.length).toBeGreaterThan(0);
    expect(s.title).toBe('Quick Safari');
  });

  it('is deterministic', () => {
    expect(JSON.stringify(generateQuickSession(input()))).toBe(
      JSON.stringify(generateQuickSession(input()))
    );
  });

  it('respects a bodyweight profile', () => {
    const s = generateQuickSession(input({ equipment: 'bodyweight' }));
    for (const ex of s.exercises) {
      const def = getExerciseById(ex.exerciseId)!;
      expect(def.equipment.some((e) => ['barbell', 'machine', 'cable', 'smith'].includes(e))).toBe(false);
    }
  });

  it('names the session after target muscles', () => {
    const s = generateQuickSession(input({ targetMuscles: ['glutes'] }));
    expect(s.title).toContain('Glutes');
  });
});
