/**
 * Safari Lab - achievements (Consistency & Achievements).
 * Pure milestones derived from completed session history. Purely motivational
 * and local; no data leaves the browser.
 */
import type { SessionLog } from '@/lib/models/session';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: boolean;
  /** Progress toward the next tier (or this one), for the unearned state. */
  progress: { current: number; target: number };
}

export interface AchievementInput {
  history: SessionLog[];
  /** Longest run of consecutive trained weeks (from computeConsistency). */
  longestWeekStreak: number;
}

interface Totals {
  sessions: number;
  sets: number;
  volume: number;
  exercises: number;
}

function totalsFrom(history: SessionLog[]): Totals {
  const completed = history.filter((s) => s.status === 'complete');
  const exercises = new Set<string>();
  let sets = 0;
  let volume = 0;
  for (const s of completed) {
    for (const set of s.setLogs) {
      sets += 1;
      exercises.add(set.performedExerciseId);
      if (set.weight != null && set.reps != null) volume += set.weight * set.reps;
    }
  }
  return { sessions: completed.length, sets, volume: Math.round(volume), exercises: exercises.size };
}

function tiered(
  idBase: string,
  icon: string,
  titles: string[],
  tiers: number[],
  current: number,
  unit: (n: number) => string
): Achievement {
  // The highest tier reached, or the first tier as the "next" goal.
  let reachedIdx = -1;
  for (let i = 0; i < tiers.length; i++) if (current >= tiers[i]!) reachedIdx = i;
  const showIdx = reachedIdx >= 0 ? reachedIdx : 0;
  const target = tiers[showIdx]!;
  const earned = current >= target;
  const nextIdx = earned ? Math.min(showIdx + 1, tiers.length - 1) : showIdx;
  const displayTarget = tiers[nextIdx]!;
  const displayEarnedTarget = tiers[showIdx]!;
  return {
    id: `${idBase}-${earned ? showIdx : nextIdx}`,
    icon,
    title: titles[earned ? showIdx : nextIdx]!,
    description: earned
      ? `Reached ${unit(displayEarnedTarget)}.`
      : `${unit(current)} of ${unit(displayTarget)}.`,
    earned,
    progress: { current, target: earned ? displayEarnedTarget : displayTarget },
  };
}

export function computeAchievements(input: AchievementInput): Achievement[] {
  const t = totalsFrom(input.history);
  return [
    tiered(
      'sessions',
      '🏕',
      ['First expedition', 'Getting consistent', 'Trailblazer', 'Half century', 'Centurion'],
      [1, 10, 25, 50, 100],
      t.sessions,
      (n) => `${n} session${n === 1 ? '' : 's'}`
    ),
    tiered(
      'volume',
      '🏋',
      ['Heavy hauler', 'Pack mule', 'Ox strength', 'Elephant lift'],
      [10_000, 50_000, 250_000, 1_000_000],
      t.volume,
      (n) => `${n.toLocaleString()} kg moved`
    ),
    tiered(
      'streak',
      '🔥',
      ['On the trail', 'Four in a row', 'Two months strong', 'Season-long streak'],
      [2, 4, 8, 12],
      input.longestWeekStreak,
      (n) => `${n} week${n === 1 ? '' : 's'} in a row`
    ),
    tiered(
      'variety',
      '🧭',
      ['Explorer', 'Wide roamer', 'Whole savanna'],
      [10, 25, 50],
      t.exercises,
      (n) => `${n} exercises trained`
    ),
    tiered(
      'sets',
      '📈',
      ['Set collector', 'Volume veteran', 'Iron accountant'],
      [50, 250, 1000],
      t.sets,
      (n) => `${n.toLocaleString()} sets logged`
    ),
  ];
}
