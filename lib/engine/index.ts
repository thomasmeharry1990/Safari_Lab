/** Safari Lab - generator engine barrel. */
export * from './types';
export { chooseSplit, SESSION_FOCUS } from './split';
export { generateProgram } from './generator';
export { getSwapCandidates, buildSwap } from './swap';
export { toActiveProgram } from './lock';
export {
  isFinalSession,
  sessionsForProgram,
  buildCompletedProgram,
} from './complete';
export {
  deloadSessions,
  DELOAD_VOLUME_MULTIPLIER,
  DELOAD_INTENSITY_MULTIPLIER,
} from './deload';
export { generateQuickSession, type QuickInput } from './quick';
export {
  buildSessionLog,
  buildQuickSessionLog,
  applySetLog,
  finalizeSession,
  totalSetsLogged,
  targetSetTotal,
  lastAndBest,
  computePRs,
  est1RM,
  type WeightUnit,
  type ExerciseHistoryStat,
  type PRResult,
} from './session';
export {
  recommendNext,
  loadIncrement,
  type ProgressionRec,
  type ProgressionAction,
} from './progression';
export {
  adaptLowTime,
  adaptSoreness,
  adaptEquipment,
  adaptMissed,
  estimateSessionMinutes,
  type AdaptReason,
  type AdaptResult,
} from './adapt';
export {
  computeProgress,
  type ProgressStats,
  type SeriesPoint,
  type PRRow,
  type StrengthOption,
} from './progress';
