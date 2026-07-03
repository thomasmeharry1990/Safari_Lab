/**
 * Safari Lab - Canonical ExerciseDefinition (v1.4 Bible Section 4).
 *
 * This is the SINGLE merged canonical exercise schema. It supersedes the v1.0
 * Exercise interface, the v1.2 exercise schema and the v1.3 warm-up patch.
 * Seed exercises are mapped into this structure in Stage 3.
 */

export type MuscleGroup =
  | 'chest'
  | 'lats'
  | 'upper_back'
  | 'traps'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'adductors'
  | 'abductors'
  | 'core'
  | 'abs'
  | 'obliques'
  | 'lower_back'
  | 'cardio';

export type MovementPattern =
  | 'horizontal_push'
  | 'vertical_push'
  | 'horizontal_pull'
  | 'vertical_pull'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'hip_thrust'
  | 'knee_flexion'
  | 'calf_raise'
  | 'curl'
  | 'extension'
  | 'lateral_raise'
  | 'rear_delt'
  | 'carry'
  | 'anti_rotation'
  | 'core_flexion'
  | 'conditioning'
  | 'mobility';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface WarmUpProtocol {
  type: 'none' | 'general' | 'compound-ramp' | 'joint-prep';
  trigger: 'never' | 'first-heavy-compound' | 'always' | 'user-choice';
  rampPercentages?: number[]; // e.g. [0.50, 0.75]
  rampReps?: number[]; // e.g. [8, 4]
  notes?: string[];
}

export interface ExerciseDefinition {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  movementPattern: MovementPattern;
  equipment: string[];
  difficulty: ExperienceLevel;
  setupDifficulty: 'low' | 'medium' | 'high';
  gymSpace: 'small' | 'medium' | 'large';
  bodyPosition: 'standing' | 'seated' | 'lying' | 'kneeling' | 'supported' | 'mixed';
  unilateral: boolean;
  compound: boolean;
  isolation: boolean;
  splitTags: ('push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full_body')[];
  defaultSets: number;
  defaultRepRange: [number, number];
  targetRepRanges: {
    hypertrophy?: [number, number];
    strength?: [number, number];
    endurance?: [number, number];
  };
  restSeconds: { min: number; max: number };
  progressionModel: 'load' | 'reps' | 'sets' | 'tempo' | 'duration' | 'distance';
  swapGroup: string;
  substitutionTags: string[];
  avoidIf: string[];
  contraindicationNotes: string[];
  cues: string[];
  formCues: string[];
  commonMistakes: string[];
  safetyNotes: string[];
  requiresWarmUp: boolean;
  warmUpProtocol: WarmUpProtocol;
  plateCalculator: boolean;
  seo: { title: string; description: string };
}
