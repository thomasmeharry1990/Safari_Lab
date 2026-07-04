/**
 * Safari Lab - deload transform (premium P5). TPL-014 Deload Expedition:
 * ~55% of normal volume at reduced intensity, for a recovery week. User-requested
 * (or, later, AR050-triggered). Recoverable: the original sessions are kept.
 */
import type { DraftSession } from './types';
import { estimateSessionMinutes } from './adapt';

export const DELOAD_VOLUME_MULTIPLIER = 0.55;
export const DELOAD_INTENSITY_MULTIPLIER = 0.75;

export function deloadSessions(
  sessions: DraftSession[],
  multiplier = DELOAD_VOLUME_MULTIPLIER
): DraftSession[] {
  return sessions.map((s) => {
    const exercises = s.exercises
      .filter((e) => !e.isFinisher) // drop conditioning finishers on a deload
      .map((e) => ({ ...e, sets: Math.max(2, Math.round(e.sets * multiplier)) }));
    return { ...s, exercises, estimatedMinutes: estimateSessionMinutes(exercises) };
  });
}
