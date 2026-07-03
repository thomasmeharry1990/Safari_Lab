/**
 * Safari Lab - gym-mode session logic (Stage 8).
 *
 * Pure builders/reducers over the canonical v1.4 SessionLog. crypto.randomUUID
 * and new Date are only ever called in the browser at logging time.
 */
import type {
  SessionExerciseBlock,
  SessionLog,
  SetLog,
} from '@/lib/models/session';
import type { ActiveProgram } from './types';

export type WeightUnit = 'kg' | 'lb';

/** Build a fresh in-progress SessionLog from a planned session in the program. */
export function buildSessionLog(
  program: ActiveProgram,
  dayIndex: number
): SessionLog {
  const session = program.sessions[dayIndex];
  if (!session) throw new Error(`No session at day ${dayIndex}`);
  const id = crypto.randomUUID();

  const exerciseBlocks: SessionExerciseBlock[] = session.exercises.map((ex, i) => ({
    id: crypto.randomUUID(),
    plannedExerciseId: ex.exerciseId,
    currentExerciseId: ex.exerciseId,
    order: i,
    status: 'notStarted',
    targetSets: ex.isFinisher ? 1 : ex.sets,
    targetRepRange: ex.repRange,
    targetRestSeconds: ex.restSeconds,
    setLogIds: [],
    swapEventIds: [],
  }));

  return {
    id,
    programBlockId: program.programId,
    weekNumber: program.currentWeek,
    plannedWorkoutId: session.id,
    status: 'inProgress',
    startedAt: new Date().toISOString(),
    exerciseBlocks,
    setLogs: [],
    swapEvents: [],
    adaptationEvents: [],
  };
}

export interface SetInput {
  weight?: number;
  reps?: number;
  unit: WeightUnit;
}

/** Insert or update the SetLog for a block + set number, returning a new session. */
export function applySetLog(
  session: SessionLog,
  blockId: string,
  setNumber: number,
  input: SetInput
): SessionLog {
  const block = session.exerciseBlocks.find((b) => b.id === blockId);
  if (!block) return session;

  const existing = session.setLogs.find(
    (s) => s.sessionExerciseBlockId === blockId && s.setNumber === setNumber
  );

  const setLog: SetLog = existing
    ? { ...existing, weight: input.weight, reps: input.reps, unit: input.unit, completedAt: new Date().toISOString() }
    : {
        id: crypto.randomUUID(),
        sessionLogId: session.id,
        sessionExerciseBlockId: blockId,
        plannedExerciseId: block.plannedExerciseId,
        performedExerciseId: block.currentExerciseId,
        setNumber,
        reps: input.reps,
        weight: input.weight,
        unit: input.unit,
        completedAt: new Date().toISOString(),
      };

  const setLogs = existing
    ? session.setLogs.map((s) => (s.id === existing.id ? setLog : s))
    : [...session.setLogs, setLog];

  const blockSetIds = existing
    ? block.setLogIds
    : [...block.setLogIds, setLog.id];
  const completedCount = setLogs.filter(
    (s) => s.sessionExerciseBlockId === blockId
  ).length;
  const status: SessionExerciseBlock['status'] =
    completedCount >= block.targetSets ? 'complete' : 'inProgress';

  const exerciseBlocks = session.exerciseBlocks.map((b) =>
    b.id === blockId ? { ...b, setLogIds: blockSetIds, status } : b
  );

  return { ...session, setLogs, exerciseBlocks };
}

/** Mark a session complete and stamp duration. */
export function finalizeSession(session: SessionLog): SessionLog {
  const completedAt = new Date().toISOString();
  const durationSeconds = session.startedAt
    ? Math.max(
        0,
        Math.round(
          (new Date(completedAt).getTime() - new Date(session.startedAt).getTime()) /
            1000
        )
      )
    : undefined;
  return { ...session, status: 'complete', completedAt, durationSeconds };
}

export function totalSetsLogged(session: SessionLog): number {
  return session.setLogs.length;
}

export function targetSetTotal(session: SessionLog): number {
  return session.exerciseBlocks.reduce((n, b) => n + b.targetSets, 0);
}

/** Estimated 1RM (Epley). Used for best-ever comparison. */
export function est1RM(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

export interface ExerciseHistoryStat {
  last?: { weight: number; reps: number; at: string };
  best?: { weight: number; reps: number };
}

/** Look up the most recent and best logged set for an exercise across history. */
export function lastAndBest(
  history: SessionLog[],
  exerciseId: string
): ExerciseHistoryStat {
  const completed = history.filter((s) => s.status === 'complete');
  const sorted = [...completed].sort((a, b) =>
    (b.completedAt ?? '').localeCompare(a.completedAt ?? '')
  );

  let last: ExerciseHistoryStat['last'];
  let best: ExerciseHistoryStat['best'];
  let bestScore = -Infinity;

  for (const session of sorted) {
    for (const set of session.setLogs) {
      if (set.performedExerciseId !== exerciseId) continue;
      if (set.weight == null || set.reps == null) continue;
      if (!last && session.completedAt) {
        last = { weight: set.weight, reps: set.reps, at: session.completedAt };
      }
      const score = est1RM(set.weight, set.reps);
      if (score > bestScore) {
        bestScore = score;
        best = { weight: set.weight, reps: set.reps };
      }
    }
  }
  return { last, best };
}

export interface PRResult {
  exerciseId: string;
  weight: number;
  reps: number;
}

/** Exercises where the best set this session beats the historical best (a PR). */
export function computePRs(
  session: SessionLog,
  history: SessionLog[]
): PRResult[] {
  const prs: PRResult[] = [];
  const byExercise = new Map<string, { weight: number; reps: number; score: number }>();

  for (const set of session.setLogs) {
    if (set.weight == null || set.reps == null) continue;
    const score = est1RM(set.weight, set.reps);
    const cur = byExercise.get(set.performedExerciseId);
    if (!cur || score > cur.score) {
      byExercise.set(set.performedExerciseId, { weight: set.weight, reps: set.reps, score });
    }
  }

  for (const [exerciseId, top] of byExercise) {
    const { best } = lastAndBest(history, exerciseId);
    const prevScore = best ? est1RM(best.weight, best.reps) : 0;
    if (top.score > prevScore + 1e-6) {
      prs.push({ exerciseId, weight: top.weight, reps: top.reps });
    }
  }
  return prs;
}
