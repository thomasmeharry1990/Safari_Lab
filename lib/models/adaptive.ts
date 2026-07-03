/**
 * Safari Lab - Canonical adaptive rule registry (v1.4 Bible Section 1).
 *
 * The legacy v1.0 Appendix B numbering scheme (AR001, AR002, AR003...) is
 * DEPRECATED and must not be used in code, tests, analytics or debug output.
 * Canonical adaptive rule IDs are the v1.2/v1.3/v1.4 rulebook IDs only.
 *
 * Collision note: legacy Appendix B "AR003 = two missed sessions" is replaced by
 * AR053. Canonical AR003 is Priority Carry-In Volume. AR048 is a deprecated
 * alias of AR003 (map old data to AR003; never execute separately).
 */

export type AdaptiveRuleId =
  | 'AR003_PRIORITY_CARRY_IN'
  | 'AR050_DELOAD_TRIGGER'
  | 'AR053_TWO_MISSED_SESSIONS_RECOVERY_WEEK';

export const AR003_PRIORITY_CARRY_IN = {
  id: 'AR003_PRIORITY_CARRY_IN',
  trigger: 'priority-muscle-session-skipped',
  maxExtraSetsPerMusclePerWeek: 1,
  hardCapSource: 'canonicalVolumeCaps',
} as const;

export const AR053_TWO_MISSED_SESSIONS_RECOVERY_WEEK = {
  id: 'AR053_TWO_MISSED_SESSIONS_RECOVERY_WEEK',
  trigger: 'two-or-more-missed-sessions-in-week',
  options: ['restart-week', 'reduced-week'],
  neverCramMissedSessions: true,
} as const;

/**
 * Deprecated legacy rule IDs -> canonical mapping. Used only during import
 * migration and test notes. Never execute a deprecated ID directly.
 */
export const DEPRECATED_RULE_ALIASES: Record<string, AdaptiveRuleId> = {
  AR048: 'AR003_PRIORITY_CARRY_IN',
};

/**
 * Canonical weekly volume caps (v1.4 Bible Section 7). Supersedes the v1.0
 * volume table. Used for generator scoring, carry-in volume, missed-session
 * recovery, deload comparisons and progress dashboard warnings. Values are
 * sets per muscle per week.
 */
export const WEEKLY_VOLUME_CAPS = {
  beginner: { normal: [6, 10], priority: [8, 12], priorityHardCap: 14 },
  intermediate: { normal: [8, 14], priority: [12, 18], priorityHardCap: 20 },
  advanced: { normal: [10, 18], priority: [14, 22], priorityHardCap: 24 },
} as const;
