import { describe, expect, it } from 'vitest';
import { generateProgram } from '@/lib/engine';
import type { GeneratorInput } from '@/lib/engine/types';
import { getExerciseById } from '@/lib/data/exercises';

function input(over: Partial<GeneratorInput> = {}): GeneratorInput {
  return {
    goal: 'build_muscle',
    experience: 'intermediate',
    weeks: 6,
    daysPerWeek: 4,
    split: 'auto',
    durationMinutes: 60,
    priorityMuscles: [],
    equipment: 'full_gym',
    avoid: [],
    ...over,
  };
}

describe('generateProgram', () => {
  it('is deterministic for the same input', () => {
    const a = generateProgram(input({ priorityMuscles: ['glutes'] }));
    const b = generateProgram(input({ priorityMuscles: ['glutes'] }));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('produces one session per training day (2-6)', () => {
    for (const days of [2, 3, 4, 5, 6] as const) {
      const p = generateProgram(input({ daysPerWeek: days }));
      expect(p.sessions.length).toBe(days);
      for (const s of p.sessions) expect(s.exercises.length).toBeGreaterThan(0);
    }
  });

  it('gives priority muscles the most weekly volume', () => {
    const p = generateProgram(input({ priorityMuscles: ['glutes', 'lats'] }));
    const glutes = p.weeklyVolume.find((v) => v.muscle === 'glutes');
    const biceps = p.weeklyVolume.find((v) => v.muscle === 'biceps');
    expect(glutes?.priority).toBe(true);
    if (glutes && biceps) expect(glutes.sets).toBeGreaterThanOrEqual(biceps.sets);
  });

  it('bodyweight profile only selects bodyweight-usable exercises', () => {
    const p = generateProgram(input({ equipment: 'bodyweight' }));
    const banned = ['barbell', 'machine', 'cable', 'smith'];
    for (const s of p.sessions) {
      for (const ex of s.exercises) {
        const def = getExerciseById(ex.exerciseId)!;
        expect(def.equipment.some((e) => banned.includes(e))).toBe(false);
      }
    }
  });

  it('never selects a blocked exercise', () => {
    const p = generateProgram(input({ blocked: ['EX-001'] }));
    const ids = p.sessions.flatMap((s) => s.exercises.map((e) => e.exerciseId));
    expect(ids).not.toContain('EX-001');
  });

  it('adds a conditioning finisher for fat-loss goals', () => {
    const p = generateProgram(input({ goal: 'fat_loss_support' }));
    const hasFinisher = p.sessions.some((s) => s.exercises.some((e) => e.isFinisher));
    expect(hasFinisher).toBe(true);
  });
});
