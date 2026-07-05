/**
 * Safari Lab - training consistency analytics (Consistency & Achievements).
 * Pure, derived from completed session history. The caller supplies `today`
 * (a Date) so the module never reads the clock itself.
 */
import type { SessionLog } from '@/lib/models/session';

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  count: number; // completed sessions that day
  inFuture: boolean;
}

export interface ConsistencyStats {
  /** Weeks (Monday-first) x 7 days, oldest week first. */
  weeks: CalendarDay[][];
  maxCount: number;
  totalDays: number;
  daysThisWeek: number;
  currentWeekStreak: number;
  longestWeekStreak: number;
  weeksTrained: number;
}

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Monday 00:00 of the week containing `d`. */
function mondayOf(d: Date): Date {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (out.getDay() + 6) % 7; // 0 = Monday
  out.setDate(out.getDate() - day);
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function computeConsistency(
  history: SessionLog[],
  today: Date,
  weekCount = 18
): ConsistencyStats {
  const perDay = new Map<string, number>();
  for (const s of history) {
    if (s.status !== 'complete' || !s.completedAt) continue;
    const key = isoDay(new Date(s.completedAt));
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  const thisMonday = mondayOf(today);
  const start = addDays(thisMonday, -(weekCount - 1) * 7);
  const todayKey = isoDay(today);

  const weeks: CalendarDay[][] = [];
  let maxCount = 0;
  for (let w = 0; w < weekCount; w++) {
    const row: CalendarDay[] = [];
    for (let day = 0; day < 7; day++) {
      const d = addDays(start, w * 7 + day);
      const key = isoDay(d);
      const count = perDay.get(key) ?? 0;
      if (count > maxCount) maxCount = count;
      row.push({ date: key, count, inFuture: key > todayKey });
    }
    weeks.push(row);
  }

  // Week streaks: consecutive Mondays that had >=1 completed session.
  const trainedMondays = new Set<string>();
  for (const s of history) {
    if (s.status !== 'complete' || !s.completedAt) continue;
    trainedMondays.add(isoDay(mondayOf(new Date(s.completedAt))));
  }

  let longest = 0;
  let run = 0;
  // Walk oldest -> newest across the shown window plus enough history.
  const earliestNeeded = addDays(thisMonday, -52 * 7);
  for (let m = new Date(earliestNeeded); m <= thisMonday; m = addDays(m, 7)) {
    if (trainedMondays.has(isoDay(m))) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }

  // Current streak: count back from this week (grace: allow starting at last week).
  let current = 0;
  let cursor = thisMonday;
  if (!trainedMondays.has(isoDay(cursor))) cursor = addDays(cursor, -7); // grace week
  while (trainedMondays.has(isoDay(cursor))) {
    current += 1;
    cursor = addDays(cursor, -7);
  }

  const daysThisWeek = weeks[weeks.length - 1]!.filter((d) => d.count > 0).length;

  return {
    weeks,
    maxCount,
    totalDays: perDay.size,
    daysThisWeek,
    currentWeekStreak: current,
    longestWeekStreak: longest,
    weeksTrained: trainedMondays.size,
  };
}
