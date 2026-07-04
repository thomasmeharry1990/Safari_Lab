import { describe, expect, it } from 'vitest';
import {
  applySetLog,
  buildCompletedProgram,
  buildSessionLog,
  finalizeSession,
  generateProgram,
  isFinalSession,
  sessionsForProgram,
  toActiveProgram,
} from '@/lib/engine';
import type { GeneratorInput } from '@/lib/engine/types';

function activeProgram(overrides: Partial<GeneratorInput> = {}) {
  const input: GeneratorInput = {
    goal: 'build_muscle',
    experience: 'intermediate',
    weeks: 4,
    daysPerWeek: 4,
    split: 'auto',
    durationMinutes: 60,
    priorityMuscles: [],
    equipment: 'full_gym',
    avoid: [],
    ...overrides,
  };
  return toActiveProgram(generateProgram(input), '2026-01-01T00:00:00.000Z');
}

describe('program completion', () => {
  it('detects the final session of the final week', () => {
    const p = activeProgram({ weeks: 4, daysPerWeek: 4 });
    expect(isFinalSession({ ...p, currentWeek: 1, currentDayIndex: 0 })).toBe(false);
    expect(isFinalSession({ ...p, currentWeek: 4, currentDayIndex: 2 })).toBe(false);
    expect(isFinalSession({ ...p, currentWeek: 4, currentDayIndex: 3 })).toBe(true);
  });

  it('only counts this program’s completed sessions', () => {
    const p = activeProgram();
    let log = buildSessionLog(p, 0);
    const block = log.exerciseBlocks[0]!;
    log = applySetLog(log, block.id, 1, { weight: 100, reps: 8, unit: 'kg' });
    const done = finalizeSession(log);
    const foreign = { ...done, id: 'other', programBlockId: 'someone-else' };
    const mine = sessionsForProgram(p, [done, foreign]);
    expect(mine).toHaveLength(1);
    expect(mine[0]!.id).toBe(done.id);
  });

  it('builds a block report with totals and top lifts', () => {
    const p = activeProgram();
    let log = buildSessionLog(p, 0);
    const block = log.exerciseBlocks[0]!;
    log = applySetLog(log, block.id, 1, { weight: 100, reps: 10, unit: 'kg' });
    log = applySetLog(log, block.id, 2, { weight: 100, reps: 8, unit: 'kg' });
    const done = finalizeSession(log);

    const report = buildCompletedProgram(
      p,
      [done],
      'kg',
      '2026-02-01T00:00:00.000Z',
      'report-1'
    );

    expect(report.sessionsCompleted).toBe(1);
    expect(report.totalSets).toBe(2);
    expect(report.totalVolume).toBe(1800); // 100*10 + 100*8
    expect(report.topPRs.length).toBeGreaterThan(0);
    expect(report.topPRs[0]!.weight).toBe(100);
    expect(report.input.goal).toBe('build_muscle'); // carried for the next block
  });
});
