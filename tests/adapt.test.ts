import { describe, expect, it } from 'vitest';
import {
  adaptEquipment,
  adaptLowTime,
  adaptMissed,
  estimateSessionMinutes,
  generateProgram,
  toActiveProgram,
} from '@/lib/engine';
import type { GeneratorInput } from '@/lib/engine/types';
import { getExerciseById } from '@/lib/data/exercises';

function program(over: Partial<GeneratorInput> = {}) {
  const input: GeneratorInput = {
    goal: 'build_muscle',
    experience: 'intermediate',
    weeks: 6,
    daysPerWeek: 4,
    split: 'upper_lower',
    durationMinutes: 75,
    priorityMuscles: ['lats', 'glutes'],
    equipment: 'full_gym',
    avoid: [],
    ...over,
  };
  return toActiveProgram(generateProgram(input), '2026-01-01T00:00:00.000Z');
}

describe('adaptation', () => {
  it('low-time trims a session under the time budget with explanations', () => {
    const p = program();
    const session = p.sessions[0]!;
    const res = adaptLowTime(session, 30);
    expect(res.changes.length).toBeGreaterThan(0);
    expect(estimateSessionMinutes(res.session.exercises)).toBeLessThanOrEqual(
      estimateSessionMinutes(session.exercises)
    );
  });

  it('equipment adaptation removes exercises needing the unavailable gear', () => {
    const p = program({ equipment: 'full_gym' });
    // find a session with a barbell exercise
    const session = p.sessions.find((s) =>
      s.exercises.some((e) => getExerciseById(e.exerciseId)?.equipment.includes('barbell'))
    )!;
    const res = adaptEquipment(session, ['barbell'], p);
    for (const ex of res.session.exercises) {
      const def = getExerciseById(ex.exerciseId)!;
      expect(def.equipment.includes('barbell')).toBe(false);
    }
    expect(res.changes.length).toBeGreaterThan(0);
  });

  it('missed carry-in adds a set for a priority muscle or explains why not', () => {
    const p = program();
    const res = adaptMissed(p, p.currentDayIndex);
    expect(res.ruleId).toBe('AR003_PRIORITY_CARRY_IN');
    expect(res.changes.length).toBe(1);
  });
});
