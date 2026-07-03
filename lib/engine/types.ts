/**
 * Safari Lab - generator engine types (Stage 4).
 *
 * A DraftProgram is the deterministic output of generateProgram(). It is NOT yet
 * persisted or locked (that is Stage 6/7); it's a preview the user can review and
 * regenerate. Deterministic: same input -> same program.
 */
import type { ExperienceLevel, MuscleGroup } from '@/lib/models/exercise';
import type { TrainingGoal } from '@/lib/models/program';

export type GeneratorSplit = 'auto' | 'full_body' | 'upper_lower' | 'ppl';

export type EquipmentProfile = 'full_gym' | 'dumbbells' | 'home' | 'bodyweight';

export type AvoidFlag = 'knee' | 'shoulder' | 'lower_back' | 'no_barbell';

export interface GeneratorInput {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  weeks: 4 | 6 | 8 | 12;
  daysPerWeek: 2 | 3 | 4 | 5 | 6;
  split: GeneratorSplit;
  durationMinutes: 30 | 45 | 60 | 75;
  priorityMuscles: MuscleGroup[];
  equipment: EquipmentProfile;
  avoid: AvoidFlag[];
  /** Exercise ids the user has blocked. Never selected or offered as a swap. */
  blocked?: string[];
  /** Exercise ids the user favourites. Boosted during selection. */
  favourites?: string[];
}

export interface DraftExercise {
  exerciseId: string;
  name: string;
  slug: string;
  muscle: MuscleGroup;
  sets: number;
  repRange: [number, number];
  restSeconds: number;
  isPriority: boolean;
  isCompound: boolean;
  isFinisher?: boolean;
  /** True when the user manually swapped this slot from the generated pick. */
  isSwapped?: boolean;
}

export interface DraftSession {
  id: string;
  dayIndex: number;
  title: string;
  focusMuscles: MuscleGroup[];
  estimatedMinutes: number;
  exercises: DraftExercise[];
}

export interface DraftProgram {
  id: string;
  name: string;
  goal: TrainingGoal;
  experience: ExperienceLevel;
  weeks: number;
  daysPerWeek: number;
  split: GeneratorSplit;
  resolvedSplit: string;
  sessions: DraftSession[];
  priorityMuscles: MuscleGroup[];
  weeklyVolume: { muscle: MuscleGroup; sets: number; priority: boolean }[];
  summary: string[];
  input: GeneratorInput;
}
