/**
 * Safari Lab - ExpeditionLog schema + v1.1->v1.4 migration (v1.4 Bible Section 5).
 *
 * BREAKING CHANGE from v1.1: field `sessionId` renamed to `sessionLogId`, and
 * the mood enum changed from great/good/okay/rough to a gym-specific set.
 */

export type ExpeditionMood =
  | 'strong'
  | 'normal'
  | 'tired'
  | 'sore'
  | 'stressed'
  | 'energised';

export type ExpeditionLogTag =
  | 'PR'
  | 'fatigue'
  | 'missed-sleep'
  | 'great-pump'
  | 'pain-note'
  | 'low-energy'
  | 'busy-gym'
  | 'technique-focus'
  | 'deload'
  | 'felt-easy'
  | 'felt-hard';

export const EXPEDITION_FREE_TEXT_MAX = 500 as const;

export interface ExpeditionLog {
  id: string;
  sessionLogId?: string; // renamed from v1.1 `sessionId`
  createdAt: string;
  mood?: ExpeditionMood;
  tags: ExpeditionLogTag[]; // required array; can be empty
  freeText: string; // max 500 characters
  maxLength: 500;
}

/**
 * Migrate a legacy v1.1 expedition log to the v1.4 shape.
 * Mirrors Bible Section 5.1 exactly. Note: crypto.randomUUID and new Date are
 * only ever called in the browser at migration time, never during SSG.
 */
export function migrateExpeditionLogV11ToV14(old: {
  id?: string;
  sessionLogId?: string;
  sessionId?: string;
  createdAt?: string;
  mood?: string;
  tags?: unknown;
  freeText?: string;
  text?: string;
}): ExpeditionLog {
  const legacyMoodMap: Record<string, ExpeditionMood> = {
    great: 'strong',
    good: 'normal',
    okay: 'normal',
    rough:
      Array.isArray(old.tags) && old.tags.includes('pain-note')
        ? 'sore'
        : 'tired',
  };

  return {
    id: old.id ?? crypto.randomUUID(),
    sessionLogId: old.sessionLogId ?? old.sessionId,
    createdAt: old.createdAt ?? new Date().toISOString(),
    mood: old.mood ? legacyMoodMap[old.mood] : undefined,
    tags: Array.isArray(old.tags) ? (old.tags as ExpeditionLogTag[]) : [],
    freeText: String(old.freeText ?? old.text ?? '').slice(
      0,
      EXPEDITION_FREE_TEXT_MAX
    ),
    maxLength: 500,
  };
}
