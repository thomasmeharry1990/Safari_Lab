/**
 * Safari Lab - split selection + session muscle focus (Stage 4).
 * Deterministic: given (days, preference, experience) always the same split.
 */
import type { MuscleGroup } from '@/lib/models/exercise';
import type { GeneratorSplit } from './types';

export type FocusKey =
  | 'full_a'
  | 'full_b'
  | 'full_c'
  | 'upper'
  | 'lower'
  | 'push'
  | 'pull'
  | 'legs';

export interface SessionTemplate {
  key: FocusKey;
  title: string;
}

/** Muscles trained in each session type, ordered biggest-first. */
export const SESSION_FOCUS: Record<FocusKey, MuscleGroup[]> = {
  full_a: ['quads', 'chest', 'lats', 'glutes', 'side_delts', 'biceps', 'core'],
  full_b: ['hamstrings', 'upper_back', 'front_delts', 'glutes', 'triceps', 'calves', 'core'],
  full_c: ['chest', 'lats', 'quads', 'glutes', 'rear_delts', 'biceps', 'triceps'],
  upper: ['chest', 'lats', 'upper_back', 'front_delts', 'side_delts', 'rear_delts', 'triceps', 'biceps'],
  lower: ['quads', 'hamstrings', 'glutes', 'calves', 'core'],
  push: ['chest', 'front_delts', 'side_delts', 'triceps'],
  pull: ['lats', 'upper_back', 'rear_delts', 'traps', 'biceps'],
  legs: ['quads', 'hamstrings', 'glutes', 'calves'],
};

const TITLE: Record<FocusKey, string> = {
  full_a: 'Full Body A Expedition',
  full_b: 'Full Body B Expedition',
  full_c: 'Full Body C Expedition',
  upper: 'Upper Expedition',
  lower: 'Lower Expedition',
  push: 'Push Expedition',
  pull: 'Pull Expedition',
  legs: 'Leg Expedition',
};

function t(key: FocusKey): SessionTemplate {
  return { key, title: TITLE[key] };
}

const FULL_CYCLE: FocusKey[] = ['full_a', 'full_b', 'full_c'];

function fullBody(days: number): SessionTemplate[] {
  return Array.from({ length: days }, (_, i) => t(FULL_CYCLE[i % 3] as FocusKey));
}

function upperLower(days: number): SessionTemplate[] {
  return Array.from({ length: days }, (_, i) => t(i % 2 === 0 ? 'upper' : 'lower'));
}

function ppl(days: number): SessionTemplate[] {
  const cycle: FocusKey[] = ['push', 'pull', 'legs'];
  return Array.from({ length: days }, (_, i) => t(cycle[i % 3] as FocusKey));
}

/**
 * Resolve the weekly split. Honours an explicit preference where the day count
 * supports it, otherwise picks the best automatic fit (Bible template logic).
 */
export function chooseSplit(
  days: number,
  pref: GeneratorSplit
): { sessions: SessionTemplate[]; label: string } {
  if (pref === 'full_body') {
    return { sessions: fullBody(days), label: 'Full Body' };
  }
  if (pref === 'upper_lower' && days % 2 === 0) {
    return { sessions: upperLower(days), label: 'Upper / Lower' };
  }
  if (pref === 'ppl' && (days === 3 || days === 6)) {
    return { sessions: ppl(days), label: 'Push / Pull / Legs' };
  }

  // Auto (or preference that doesn't fit the day count)
  switch (days) {
    case 2:
      return { sessions: fullBody(2), label: 'Full Body' };
    case 3:
      return { sessions: fullBody(3), label: 'Full Body' };
    case 4:
      return { sessions: upperLower(4), label: 'Upper / Lower' };
    case 5:
      return {
        sessions: [t('push'), t('pull'), t('legs'), t('upper'), t('lower')],
        label: 'Push / Pull / Legs + Upper / Lower',
      };
    case 6:
      return { sessions: ppl(6), label: 'Push / Pull / Legs ×2' };
    default:
      return { sessions: fullBody(days), label: 'Full Body' };
  }
}
