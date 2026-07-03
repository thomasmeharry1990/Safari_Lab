import { describe, expect, it } from 'vitest';
import {
  applySetLog,
  buildSessionLog,
  computePRs,
  finalizeSession,
  generateProgram,
  lastAndBest,
  toActiveProgram,
} from '@/lib/engine';
import type { GeneratorInput } from '@/lib/engine/types';

function activeProgram() {
  const input: GeneratorInput = {
    goal: 'build_muscle',
    experience: 'intermediate',
    weeks: 6,
    daysPerWeek: 4,
    split: 'auto',
    durationMinutes: 60,
    priorityMuscles: [],
    equipment: 'full_gym',
    avoid: [],
  };
  return toActiveProgram(generateProgram(input), '2026-01-01T00:00:00.000Z');
}

describe('gym session engine', () => {
  it('builds a session log with one block per planned exercise', () => {
    const program = activeProgram();
    const log = buildSessionLog(program, 0);
    expect(log.status).toBe('inProgress');
    expect(log.exerciseBlocks.length).toBe(program.sessions[0]!.exercises.length);
    expect(log.setLogs.length).toBe(0);
  });

  it('logs sets and marks a block complete at its target', () => {
    const program = activeProgram();
    let log = buildSessionLog(program, 0);
    const block = log.exerciseBlocks[0]!;
    for (let i = 1; i <= block.targetSets; i++) {
      log = applySetLog(log, block.id, i, { weight: 100, reps: 8, unit: 'kg' });
    }
    const updated = log.exerciseBlocks.find((b) => b.id === block.id)!;
    expect(updated.status).toBe('complete');
    expect(log.setLogs.filter((s) => s.sessionExerciseBlockId === block.id).length).toBe(block.targetSets);
  });

  it('updates an existing set rather than duplicating it', () => {
    const program = activeProgram();
    let log = buildSessionLog(program, 0);
    const block = log.exerciseBlocks[0]!;
    log = applySetLog(log, block.id, 1, { weight: 100, reps: 8, unit: 'kg' });
    log = applySetLog(log, block.id, 1, { weight: 105, reps: 6, unit: 'kg' });
    const setsForBlock = log.setLogs.filter((s) => s.sessionExerciseBlockId === block.id);
    expect(setsForBlock.length).toBe(1);
    expect(setsForBlock[0]!.weight).toBe(105);
  });

  it('finalizes with a duration and completed status', () => {
    const program = activeProgram();
    let log = buildSessionLog(program, 0);
    const block = log.exerciseBlocks[0]!;
    log = applySetLog(log, block.id, 1, { weight: 100, reps: 8, unit: 'kg' });
    const done = finalizeSession(log);
    expect(done.status).toBe('complete');
    expect(done.completedAt).toBeTruthy();
    expect(done.durationSeconds).toBeGreaterThanOrEqual(0);
  });

  it('computes last/best and detects a PR against empty history', () => {
    const program = activeProgram();
    let log = buildSessionLog(program, 0);
    const block = log.exerciseBlocks[0]!;
    log = applySetLog(log, block.id, 1, { weight: 100, reps: 8, unit: 'kg' });
    const done = finalizeSession(log);
    const prs = computePRs(done, []);
    expect(prs.length).toBeGreaterThan(0);
    const stat = lastAndBest([done], block.currentExerciseId);
    expect(stat.last?.weight).toBe(100);
    expect(stat.best?.weight).toBe(100);
  });
});
