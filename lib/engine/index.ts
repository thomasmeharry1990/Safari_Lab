/** Safari Lab - generator engine barrel. */
export * from './types';
export { chooseSplit, SESSION_FOCUS } from './split';
export { generateProgram } from './generator';
export { getSwapCandidates, buildSwap } from './swap';
export { toActiveProgram } from './lock';
export {
  buildSessionLog,
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
