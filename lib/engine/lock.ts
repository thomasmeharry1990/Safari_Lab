/**
 * Safari Lab - lock a draft into an active program (Stage 7).
 * Pure transform; the caller supplies the lock timestamp (browser-side).
 */
import type { ActiveProgram, DraftProgram } from './types';

export function toActiveProgram(
  draft: DraftProgram,
  lockedAtISO: string
): ActiveProgram {
  return {
    programId: draft.id,
    name: draft.name,
    goal: draft.goal,
    experience: draft.experience,
    weeks: draft.weeks,
    daysPerWeek: draft.daysPerWeek,
    split: draft.split,
    resolvedSplit: draft.resolvedSplit,
    sessions: draft.sessions,
    weeklyVolume: draft.weeklyVolume,
    summary: draft.summary,
    input: draft.input,
    lockedAt: lockedAtISO,
    currentWeek: 1,
    currentDayIndex: 0,
    status: 'active',
  };
}
