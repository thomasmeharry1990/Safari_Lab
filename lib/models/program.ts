/**
 * Safari Lab - Program & template model (v1.4 Bible Section 6).
 *
 * The ProgramTemplate interface below is canonical, including the v1.4-added
 * volumeMultiplier / intensityMultiplier fields used by the Deload Expedition.
 *
 * NOTE: types marked "[stage-N placeholder]" are minimal canonical shapes to be
 * expanded in the stage that owns them (generator, program lock, etc.). They are
 * intentionally small so the save file and templates type-check now without
 * inventing schema that later stages should own.
 */

import type { AdaptiveRuleId } from './adaptive';
import type { ExperienceLevel, MuscleGroup } from './exercise';

export type TrainingGoal =
  | 'build_muscle'
  | 'strength'
  | 'fat_loss_support'
  | 'general_fitness'
  | 'endurance_support'
  | 'recovery'
  | 'fatigue-management';

export type SplitType =
  | 'auto'
  | 'full_body'
  | 'upper_lower'
  | 'ppl'
  | 'custom'
  | 'reduced-week';

export type ProgressionModel =
  | 'double-progression'
  | 'load-linear'
  | 'reps-first'
  | 'time'
  | 'distance'
  | 'hold'
  | 'maintain-technique';

/** [stage-4 placeholder] Per-muscle weekly volume target used by the generator. */
export interface VolumeTarget {
  muscle: MuscleGroup;
  minSets: number;
  maxSets: number;
  priority: boolean;
}

/** [stage-4 placeholder] One planned day within a template's weekly structure. */
export interface TemplateDay {
  dayIndex: number;
  title: string;
  focus: MuscleGroup[];
  estimatedMinutes: number;
}

export interface ProgramTemplate {
  id: string;
  name: string;
  durationWeeks: number;
  daysPerWeek: number;
  goalTags: TrainingGoal[];
  experienceLevels: ExperienceLevel[];
  splitType: SplitType;
  weeklyStructure: TemplateDay[];
  volumeTargets: VolumeTarget[];
  progressionModel: ProgressionModel;
  deloadCompatible: boolean;
  triggeredBy?: (AdaptiveRuleId | 'user-request')[];
  outputTemplateForRule?: AdaptiveRuleId;
  volumeMultiplier?: number; // 0.55 => 55% of normal volume (a 45% reduction)
  intensityMultiplier?: number; // 0.75 => 75% of normal load/intensity target
  notes?: string[];
}

/**
 * [stage-7 placeholder] An instantiated, locked/active program block. Expanded
 * when the draft->active lock flow is built.
 */
export interface ProgramBlock {
  id: string;
  templateId?: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  goal: TrainingGoal;
  experienceLevel: ExperienceLevel;
  weeks: number;
  daysPerWeek: number;
  targetMuscles: MuscleGroup[];
  createdAt: string;
  updatedAt: string;
}

/** [stage-7 placeholder] Compact summary of a completed program block. */
export interface ProgramBlockSummary {
  id: string;
  name: string;
  goal: TrainingGoal;
  weeks: number;
  completedAt: string;
}
