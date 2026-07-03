/**
 * Safari Lab - progress analytics (Stage 12). Pure, derived from session history.
 * All computation is local; no data leaves the browser.
 */
import type { SessionLog } from '@/lib/models/session';
import type { MuscleGroup } from '@/lib/models/exercise';
import { getExerciseById, muscleLabel } from '@/lib/data/exercises';
import { est1RM } from './session';

export interface SeriesPoint {
  label: string;
  value: number;
  at: string;
}

export interface PRRow {
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  e1rm: number;
  unit: 'kg' | 'lb';
}

export interface StrengthOption {
  exerciseId: string;
  name: string;
  points: SeriesPoint[];
}

export interface ProgressStats {
  totalSessions: number;
  totalSets: number;
  totalVolume: number;
  unit: 'kg' | 'lb';
  sessionsThisWeek: number;
  volumeSeries: SeriesPoint[];
  muscleVolume: { muscle: MuscleGroup; label: string; sets: number }[];
  prs: PRRow[];
  strength: StrengthOption[];
  recent: {
    id: string;
    title: string;
    at: string;
    sets: number;
    volume: number;
  }[];
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function weekStart(now: Date): Date {
  const x = new Date(now);
  const day = (x.getDay() + 6) % 7; // Monday = 0
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
}

export function computeProgress(history: SessionLog[], now: Date): ProgressStats {
  const completed = history
    .filter((s) => s.status === 'complete' && s.completedAt)
    .sort((a, b) => (a.completedAt ?? '').localeCompare(b.completedAt ?? ''));

  let totalSets = 0;
  let totalVolume = 0;
  let kg = 0;
  let lb = 0;

  const volumeSeries: SeriesPoint[] = [];
  const muscleSets = new Map<MuscleGroup, number>();
  const bestByExercise = new Map<string, { weight: number; reps: number; e1rm: number; unit: 'kg' | 'lb' }>();
  const strengthByExercise = new Map<string, SeriesPoint[]>();
  const recent: ProgressStats['recent'] = [];
  const wkStart = weekStart(now);
  let sessionsThisWeek = 0;

  for (const session of completed) {
    let sessionVolume = 0;
    const sessionBestE1rm = new Map<string, number>();

    for (const set of session.setLogs) {
      totalSets++;
      if (set.unit === 'lb') lb++;
      else kg++;
      const muscle = getExerciseById(set.performedExerciseId)?.primaryMuscle;
      if (muscle) muscleSets.set(muscle, (muscleSets.get(muscle) ?? 0) + 1);

      if (set.weight != null && set.reps != null) {
        sessionVolume += set.weight * set.reps;
        const e = est1RM(set.weight, set.reps);
        // best set ever for this exercise
        const cur = bestByExercise.get(set.performedExerciseId);
        if (!cur || e > cur.e1rm) {
          bestByExercise.set(set.performedExerciseId, {
            weight: set.weight,
            reps: set.reps,
            e1rm: e,
            unit: set.unit,
          });
        }
        // best e1rm within this session (for the strength trend)
        const sb = sessionBestE1rm.get(set.performedExerciseId) ?? 0;
        if (e > sb) sessionBestE1rm.set(set.performedExerciseId, e);
      }
    }

    totalVolume += sessionVolume;
    const at = session.completedAt!;
    volumeSeries.push({ label: shortDate(at), value: Math.round(sessionVolume), at });
    if (new Date(at) >= wkStart) sessionsThisWeek++;

    for (const [exerciseId, e] of sessionBestE1rm) {
      const arr = strengthByExercise.get(exerciseId) ?? [];
      arr.push({ label: shortDate(at), value: Math.round(e), at });
      strengthByExercise.set(exerciseId, arr);
    }

    recent.push({
      id: session.id,
      title: sessionTitle(session),
      at,
      sets: session.setLogs.length,
      volume: Math.round(sessionVolume),
    });
  }

  const unit: 'kg' | 'lb' = lb > kg ? 'lb' : 'kg';

  const muscleVolume = [...muscleSets.entries()]
    .map(([muscle, sets]) => ({ muscle, label: muscleLabel(muscle), sets }))
    .sort((a, b) => b.sets - a.sets)
    .slice(0, 10);

  const prs: PRRow[] = [...bestByExercise.entries()]
    .map(([exerciseId, b]) => ({
      exerciseId,
      name: getExerciseById(exerciseId)?.name ?? exerciseId,
      weight: b.weight,
      reps: b.reps,
      e1rm: Math.round(b.e1rm),
      unit: b.unit,
    }))
    .sort((a, b) => b.e1rm - a.e1rm);

  const strength: StrengthOption[] = [...strengthByExercise.entries()]
    .map(([exerciseId, points]) => ({
      exerciseId,
      name: getExerciseById(exerciseId)?.name ?? exerciseId,
      points,
    }))
    .sort((a, b) => b.points.length - a.points.length || a.name.localeCompare(b.name));

  return {
    totalSessions: completed.length,
    totalSets,
    totalVolume: Math.round(totalVolume),
    unit,
    sessionsThisWeek,
    volumeSeries,
    muscleVolume,
    prs,
    strength,
    recent: recent.reverse(),
  };
}

function sessionTitle(session: SessionLog): string {
  const first = session.setLogs[0];
  const name = first ? getExerciseById(first.performedExerciseId)?.name : undefined;
  return name ? `Session (${name}…)` : 'Session';
}
