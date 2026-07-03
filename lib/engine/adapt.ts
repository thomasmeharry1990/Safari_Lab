/**
 * Safari Lab - adaptive replanning (Stage 10).
 *
 * Deterministic, inspectable adaptations of a single planned session. Every
 * adaptation returns an adapted session PLUS plain-English `changes` explaining
 * exactly what happened (doctrine: every change has a why). The caller applies
 * the result and keeps the original for undo (recoverable).
 *
 * Rule IDs use the canonical v1.4 registry where one applies (AR003 carry-in).
 */
import type { ExerciseDefinition, MuscleGroup } from '@/lib/models/exercise';
import { getAllExercises, getExerciseById, muscleLabel } from '@/lib/data/exercises';
import { resolveAvailable, usable } from './filters';
import type { ActiveProgram, DraftExercise, DraftSession } from './types';

export type AdaptReason = 'low-time' | 'soreness' | 'equipment' | 'missed';

export interface AdaptResult {
  ruleId: string;
  ruleLabel: string;
  session: DraftSession;
  changes: string[];
}

/** Rough session time estimate (mirrors the generator's estimator). */
export function estimateSessionMinutes(exercises: DraftExercise[]): number {
  let mins = 6;
  for (const ex of exercises) {
    const avgReps = (ex.repRange[0] + ex.repRange[1]) / 2;
    mins += (ex.sets * (avgReps * 3 + ex.restSeconds)) / 60;
  }
  return Math.round(mins);
}

function withMinutes(session: DraftSession, exercises: DraftExercise[]): DraftSession {
  return { ...session, exercises, estimatedMinutes: estimateSessionMinutes(exercises) };
}

const protectedExercise = (e: DraftExercise) => e.isCompound || e.isPriority;

/** Trim a session to fit a time budget: drop low-value work, then shave sets. */
export function adaptLowTime(session: DraftSession, targetMinutes: number): AdaptResult {
  let exercises = [...session.exercises];
  const changes: string[] = [];

  while (estimateSessionMinutes(exercises) > targetMinutes) {
    const revIdx = [...exercises]
      .reverse()
      .findIndex((e) => !protectedExercise(e) || e.isFinisher);
    if (revIdx === -1) break;
    const removeAt = exercises.length - 1 - revIdx;
    const [removed] = exercises.splice(removeAt, 1);
    if (removed) changes.push(`Dropped ${removed.name} to fit ~${targetMinutes} min.`);
  }

  while (estimateSessionMinutes(exercises) > targetMinutes) {
    const idx = exercises.findIndex((e) => e.sets > 2 && !e.isFinisher);
    if (idx === -1) break;
    const trimmed = { ...exercises[idx]!, sets: exercises[idx]!.sets - 1 };
    exercises[idx] = trimmed;
    changes.push(`Trimmed ${trimmed.name} to ${trimmed.sets} sets.`);
  }

  if (!changes.length) changes.push('Your session already fits — nothing to trim.');
  return {
    ruleId: 'AR-LOW-TIME',
    ruleLabel: 'Time-crunched',
    session: withMinutes(session, exercises),
    changes,
  };
}

/** Ease volume on sore muscles by shaving a set (keeps a minimum of 2). */
export function adaptSoreness(
  session: DraftSession,
  soreMuscles: MuscleGroup[]
): AdaptResult {
  const sore = new Set(soreMuscles);
  const changes: string[] = [];
  const exercises = session.exercises.map((e) => {
    if (sore.has(e.muscle) && !e.isFinisher && e.sets > 2) {
      changes.push(`Eased ${e.name} to ${e.sets - 1} sets — ${muscleLabel(e.muscle)} is sore.`);
      return { ...e, sets: e.sets - 1 };
    }
    return e;
  });
  if (!changes.length) {
    changes.push('No easy volume to cut for those muscles — keep the intensity gentle today.');
  }
  return {
    ruleId: 'AR-SORENESS',
    ruleLabel: 'Managing soreness',
    session: withMinutes(session, exercises),
    changes,
  };
}

/** Swap out exercises that need unavailable equipment; drop if no alternative. */
export function adaptEquipment(
  session: DraftSession,
  unavailable: string[],
  program: ActiveProgram
): AdaptResult {
  const gone = new Set(unavailable);
  const available = resolveAvailable(program.input.equipment);
  const lib = getAllExercises();
  const changes: string[] = [];

  const findAlt = (ex: ExerciseDefinition): ExerciseDefinition | undefined => {
    const ok = (c: ExerciseDefinition) =>
      c.id !== ex.id &&
      usable(c, available) &&
      !c.equipment.some((t) => gone.has(t));
    return (
      lib.find((c) => ok(c) && c.swapGroup === ex.swapGroup) ??
      lib.find(
        (c) => ok(c) && c.primaryMuscle === ex.primaryMuscle && c.movementPattern === ex.movementPattern
      )
    );
  };

  const exercises: DraftExercise[] = [];
  for (const e of session.exercises) {
    const ex = getExerciseById(e.exerciseId);
    if (!ex || !ex.equipment.some((t) => gone.has(t))) {
      exercises.push(e);
      continue;
    }
    const blocking = ex.equipment.filter((t) => gone.has(t)).join('/');
    const alt = findAlt(ex);
    if (alt) {
      changes.push(`Swapped ${e.name} → ${alt.name} (no ${blocking}).`);
      exercises.push({
        ...e,
        exerciseId: alt.id,
        name: alt.name,
        slug: alt.slug,
        isCompound: alt.compound,
        isSwapped: true,
      });
    } else {
      changes.push(`Removed ${e.name} — no ${blocking}-free alternative available.`);
    }
  }

  if (!changes.length) changes.push('None of today’s exercises need that equipment.');
  return {
    ruleId: 'AR-EQUIPMENT',
    ruleLabel: 'Equipment unavailable',
    session: withMinutes(session, exercises),
    changes,
  };
}

/**
 * AR003 priority carry-in: if a priority muscle from the previous (missed)
 * session is trained today, add one extra set (within the weekly cap).
 */
export function adaptMissed(program: ActiveProgram, todayIndex: number): AdaptResult {
  const today = program.sessions[todayIndex]!;
  const days = program.daysPerWeek;
  const missedIndex = (todayIndex - 1 + days) % days;
  const missed = program.sessions[missedIndex];
  const priority = program.input.priorityMuscles;
  const label = 'AR003 priority carry-in';

  const carryMuscle = missed?.focusMuscles.find((m) => priority.includes(m));
  if (!carryMuscle) {
    return {
      ruleId: 'AR003_PRIORITY_CARRY_IN',
      ruleLabel: label,
      session: today,
      changes: ['No priority carry-in is needed from your last session.'],
    };
  }

  const idx = today.exercises.findIndex((e) => e.muscle === carryMuscle && !e.isFinisher);
  if (idx === -1) {
    return {
      ruleId: 'AR003_PRIORITY_CARRY_IN',
      ruleLabel: label,
      session: today,
      changes: [
        `Missed ${muscleLabel(carryMuscle)} work can’t carry into today — it isn’t trained in this session. Lost volume isn’t fully recovered; consistency matters more than cramming.`,
      ],
    };
  }

  const exercises = today.exercises.map((e, i) =>
    i === idx ? { ...e, sets: e.sets + 1 } : e
  );
  return {
    ruleId: 'AR003_PRIORITY_CARRY_IN',
    ruleLabel: label,
    session: withMinutes(today, exercises),
    changes: [
      `Added one carry-in set to ${exercises[idx]!.name} for the ${muscleLabel(carryMuscle)} work you missed (AR003), staying within your weekly volume cap.`,
    ],
  };
}
