import { describe, expect, it } from 'vitest';
import { deloadSessions, generateProgram } from '@/lib/engine';
import type { GeneratorInput } from '@/lib/engine/types';

function sessions() {
  const input: GeneratorInput = {
    goal: 'fat_loss_support', // includes finishers, to test they're dropped
    experience: 'intermediate',
    weeks: 6,
    daysPerWeek: 4,
    split: 'auto',
    durationMinutes: 75,
    priorityMuscles: [],
    equipment: 'full_gym',
    avoid: [],
  };
  return generateProgram(input).sessions;
}

function totalSets(list: { exercises: { sets: number; isFinisher?: boolean }[] }[]) {
  return list.reduce((n, s) => n + s.exercises.reduce((m, e) => m + e.sets, 0), 0);
}

describe('deloadSessions', () => {
  it('reduces total working volume', () => {
    const original = sessions();
    const deloaded = deloadSessions(original);
    expect(totalSets(deloaded)).toBeLessThan(totalSets(original));
  });

  it('keeps at least 2 sets per exercise and drops finishers', () => {
    const deloaded = deloadSessions(sessions());
    for (const s of deloaded) {
      expect(s.exercises.some((e) => e.isFinisher)).toBe(false);
      for (const e of s.exercises) expect(e.sets).toBeGreaterThanOrEqual(2);
    }
  });

  it('does not mutate the original sessions', () => {
    const original = sessions();
    const before = totalSets(original);
    deloadSessions(original);
    expect(totalSets(original)).toBe(before);
  });
});
