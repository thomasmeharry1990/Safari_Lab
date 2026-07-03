import { describe, expect, it } from 'vitest';
import { recommendNext } from '@/lib/engine';
import { getExerciseBySlug } from '@/lib/data/exercises';
import type { SessionLog } from '@/lib/models/session';

const bench = getExerciseBySlug('barbell-bench-press')!;

function history(sets: { weight: number; reps: number }[]): SessionLog[] {
  return [
    {
      id: 's1',
      status: 'complete',
      startedAt: '2026-01-01T10:00:00.000Z',
      completedAt: '2026-01-01T11:00:00.000Z',
      exerciseBlocks: [],
      swapEvents: [],
      adaptationEvents: [],
      setLogs: sets.map((s, i) => ({
        id: `l${i}`,
        sessionLogId: 's1',
        sessionExerciseBlockId: 'b1',
        plannedExerciseId: bench.id,
        performedExerciseId: bench.id,
        setNumber: i + 1,
        unit: 'kg',
        weight: s.weight,
        reps: s.reps,
      })),
    },
  ];
}

describe('recommendNext (double progression)', () => {
  it('suggests a baseline with no history', () => {
    const rec = recommendNext(bench, [3, 10], [], 'kg');
    expect(rec.action).toBe('start');
  });

  it('adds a rep when the top of the range was not reached', () => {
    const rec = recommendNext(bench, [3, 10], history([
      { weight: 100, reps: 8 },
      { weight: 100, reps: 8 },
      { weight: 100, reps: 8 },
    ]), 'kg');
    expect(rec.action).toBe('add-reps');
    expect(rec.suggestedWeight).toBe(100);
    expect(rec.suggestedReps).toBe(9);
  });

  it('increases load and resets reps when every set hit the top', () => {
    const rec = recommendNext(bench, [3, 10], history([
      { weight: 100, reps: 10 },
      { weight: 100, reps: 10 },
      { weight: 100, reps: 10 },
    ]), 'kg');
    expect(rec.action).toBe('increase-load');
    expect(rec.suggestedWeight).toBe(102.5); // upper-body compound +2.5kg
    expect(rec.suggestedReps).toBe(3); // reset to bottom
  });
});
