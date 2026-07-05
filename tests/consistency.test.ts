import { describe, expect, it } from 'vitest';
import { computeAchievements, computeConsistency } from '@/lib/engine';
import type { SessionLog, SetLog } from '@/lib/models/session';

function completedSession(
  id: string,
  completedAt: string,
  sets: { ex: string; weight: number; reps: number }[] = []
): SessionLog {
  const setLogs: SetLog[] = sets.map((s, i) => ({
    id: `${id}-s${i}`,
    sessionLogId: id,
    sessionExerciseBlockId: `${id}-b`,
    plannedExerciseId: s.ex,
    performedExerciseId: s.ex,
    setNumber: i + 1,
    weight: s.weight,
    reps: s.reps,
    unit: 'kg',
  }));
  return {
    id,
    status: 'complete',
    completedAt,
    exerciseBlocks: [],
    setLogs,
    swapEvents: [],
    adaptationEvents: [],
  };
}

// Local ISO day string in the same convention the engine uses.
function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

describe('consistency', () => {
  const today = new Date(2026, 6, 15); // 15 Jul 2026
  const minus = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return `${iso(d)}T12:00:00.000Z`;
  };

  it('builds an 18-week x 7-day grid and counts training days', () => {
    const history = [
      completedSession('a', minus(0)),
      completedSession('b', minus(7)),
      completedSession('c', minus(14)),
    ];
    const c = computeConsistency(history, today);
    expect(c.weeks).toHaveLength(18);
    expect(c.weeks.every((w) => w.length === 7)).toBe(true);
    expect(c.totalDays).toBe(3);
    expect(c.maxCount).toBe(1);
  });

  it('computes consecutive-week streaks', () => {
    const history = [
      completedSession('a', minus(0)),
      completedSession('b', minus(7)),
      completedSession('c', minus(14)),
    ];
    const c = computeConsistency(history, today);
    expect(c.currentWeekStreak).toBe(3);
    expect(c.longestWeekStreak).toBe(3);
    expect(c.weeksTrained).toBe(3);
  });

  it('ignores non-complete sessions', () => {
    const abandoned: SessionLog = { ...completedSession('x', minus(0)), status: 'abandoned' };
    const c = computeConsistency([abandoned], today);
    expect(c.totalDays).toBe(0);
    expect(c.currentWeekStreak).toBe(0);
  });
});

describe('achievements', () => {
  it('unlocks the first-expedition tier and tracks progress on higher ones', () => {
    const history = [
      completedSession('a', '2026-07-15T12:00:00.000Z', [
        { ex: 'EX-1', weight: 100, reps: 5 },
        { ex: 'EX-2', weight: 60, reps: 10 },
      ]),
    ];
    const list = computeAchievements({ history, longestWeekStreak: 0 });

    const sessions = list.find((a) => a.id.startsWith('sessions'))!;
    expect(sessions.earned).toBe(true);
    expect(sessions.title).toBe('First expedition');

    const volume = list.find((a) => a.id.startsWith('volume'))!;
    expect(volume.earned).toBe(false); // 1100 kg < 10,000
    expect(volume.progress.current).toBe(1100);
    expect(volume.progress.target).toBe(10_000);
  });
});
