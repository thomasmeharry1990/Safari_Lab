/**
 * Safari Lab - exercise seed factory.
 *
 * The Bible's seed library (139 movements) is stored as compact `Seed` rows and
 * expanded into full canonical `ExerciseDefinition` objects here, so the data
 * stays DRY and every exercise has consistent derived defaults.
 *
 * Canonical schema is UNCHANGED (lib/models/exercise.ts). Where a v1.2 movement
 * pattern has no exact v1.4 enum value, the seed row already carries the nearest
 * canonical `MovementPattern`; richer substitution is handled by `swapGroup`.
 */
import type {
  ExerciseDefinition,
  ExperienceLevel,
  MovementPattern,
  MuscleGroup,
  WarmUpProtocol,
} from '@/lib/models/exercise';

export type BodyPosition = ExerciseDefinition['bodyPosition'];
export type ProgressionModel = ExerciseDefinition['progressionModel'];
export type SplitTag = ExerciseDefinition['splitTags'][number];

export interface Seed {
  id: string;
  name: string;
  primary: MuscleGroup;
  secondary?: MuscleGroup[];
  pattern: MovementPattern;
  equipment: string[];
  level: ExperienceLevel;
  /** [setsMin, setsMax, repMin, repMax] */
  d: [number, number, number, number];
  swap: string;
  slug?: string;
  iso?: boolean;
  uni?: boolean;
  plate?: boolean;
  space?: ExerciseDefinition['gymSpace'];
  pos?: BodyPosition;
  prog?: ProgressionModel;
  /** reps represent seconds / a held duration */
  timed?: boolean;
  aliases?: string[];
  cues?: string[];
}

const COMPOUND_PATTERNS: MovementPattern[] = [
  'squat',
  'hinge',
  'lunge',
  'hip_thrust',
  'horizontal_push',
  'vertical_push',
  'horizontal_pull',
  'vertical_pull',
];

const CONDITIONING_EQUIPMENT = [
  'rope',
  'ropes',
  'rower',
  'bike',
  'treadmill',
  'sled',
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const MUSCLE_LABEL: Record<MuscleGroup, string> = {
  chest: 'Chest',
  lats: 'Lats',
  upper_back: 'Upper Back',
  traps: 'Traps',
  front_delts: 'Front Delts',
  side_delts: 'Side Delts',
  rear_delts: 'Rear Delts',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  glutes: 'Glutes',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
  adductors: 'Adductors',
  abductors: 'Abductors',
  core: 'Core',
  abs: 'Abs',
  obliques: 'Obliques',
  lower_back: 'Lower Back',
  cardio: 'Cardio',
};

export function muscleLabel(m: MuscleGroup): string {
  return MUSCLE_LABEL[m];
}

const PATTERN_LABEL: Partial<Record<MovementPattern, string>> = {
  horizontal_push: 'Horizontal Push',
  vertical_push: 'Vertical Push',
  horizontal_pull: 'Horizontal Pull',
  vertical_pull: 'Vertical Pull',
  hip_thrust: 'Hip Thrust',
  knee_flexion: 'Knee Flexion',
  calf_raise: 'Calf Raise',
  lateral_raise: 'Lateral Raise',
  rear_delt: 'Rear Delt',
  anti_rotation: 'Anti-Rotation',
  core_flexion: 'Core Flexion',
};

export function patternLabel(p: MovementPattern): string {
  return PATTERN_LABEL[p] ?? p.charAt(0).toUpperCase() + p.slice(1);
}

/** Default cues when a seed row doesn't specify its own. */
const PATTERN_CUES: Partial<Record<MovementPattern, string[]>> = {
  squat: ['Brace your core before you descend', 'Drive through mid-foot', 'Keep knees tracking over toes'],
  hinge: ['Push your hips back, not down', 'Keep a neutral spine', 'Feel the stretch in your hamstrings'],
  lunge: ['Control the descent', 'Keep your front shin vertical', 'Drive through the front heel'],
  hip_thrust: ['Tuck your chin and ribs down', 'Drive hips up to full lockout', 'Squeeze your glutes at the top'],
  horizontal_push: ['Set your shoulder blades down and back', 'Control the weight to your chest', 'Press without flaring your elbows'],
  vertical_push: ['Brace and keep ribs down', 'Press in a straight line', 'Lock out without shrugging'],
  horizontal_pull: ['Lead with your elbow', 'Squeeze your shoulder blades together', 'Avoid using momentum'],
  vertical_pull: ['Pull your elbows down and back', 'Drive shoulders away from ears', 'Control the negative'],
  curl: ['Keep your elbows pinned', 'Control the lowering phase', 'Avoid swinging'],
  extension: ['Keep your upper arm still', 'Full range without locking harshly', 'Control the return'],
  lateral_raise: ['Lead with your elbows', 'Stay tall, no swinging', 'Lower under control'],
  rear_delt: ['Think elbows out and back', 'Keep a soft elbow', 'Pause and squeeze'],
  calf_raise: ['Full stretch at the bottom', 'Pause at the top', 'Control the tempo'],
  anti_rotation: ['Resist the pull, stay square', 'Brace your whole trunk', 'Breathe steadily'],
  core_flexion: ['Move with your abs, not your hips', 'Exhale as you crunch', 'Control the eccentric'],
  carry: ['Stand tall, ribs down', 'Grip hard and walk steady', 'Keep your steps controlled'],
  conditioning: ['Settle into a sustainable pace', 'Breathe rhythmically', 'Keep your form as you fatigue'],
  mobility: ['Move slowly and with control', 'Breathe into the stretch', 'Never force a painful range'],
};

export function defineExercise(s: Seed): ExerciseDefinition {
  const isCompound = !s.iso && COMPOUND_PATTERNS.includes(s.pattern);
  const isolation = !!s.iso || !isCompound;
  const equipmentLc = s.equipment.map((e) => e.toLowerCase());
  const isBarbellLike =
    equipmentLc.includes('barbell') || equipmentLc.includes('smith');
  const isBodyweight = equipmentLc.some((e) => e.includes('bodyweight'));
  const isConditioning =
    s.pattern === 'conditioning' ||
    equipmentLc.some((e) => CONDITIONING_EQUIPMENT.includes(e));

  const plateCalculator = s.plate ?? (isBarbellLike && isCompound);
  const requiresWarmUp = plateCalculator;
  const warmUpProtocol: WarmUpProtocol = requiresWarmUp
    ? {
        type: 'compound-ramp',
        trigger: 'first-heavy-compound',
        rampPercentages: [0.5, 0.75],
        rampReps: [8, 4],
      }
    : { type: 'none', trigger: 'never' };

  const progressionModel: ProgressionModel =
    s.prog ??
    (isConditioning || s.timed
      ? 'duration'
      : s.pattern === 'carry'
        ? 'distance'
        : isBodyweight && !plateCalculator
          ? 'reps'
          : 'load');

  const restSeconds = isConditioning
    ? { min: 60, max: 120 }
    : isCompound
      ? { min: 120, max: 180 }
      : s.timed || s.pattern === 'core_flexion' || s.pattern === 'anti_rotation'
        ? { min: 45, max: 75 }
        : { min: 45, max: 90 };

  const [setsMin, setsMax, repMin, repMax] = s.d;
  const splitTags = deriveSplitTags(s.primary, s.pattern);

  const cues = s.cues ?? PATTERN_CUES[s.pattern] ?? ['Move with control', 'Keep tension on the target muscle'];

  const setupDifficulty =
    s.level === 'beginner' ? 'low' : s.level === 'advanced' ? 'high' : 'medium';

  return {
    id: s.id,
    slug: s.slug ?? slugify(s.name),
    name: s.name,
    aliases: s.aliases ?? [],
    primaryMuscle: s.primary,
    secondaryMuscles: s.secondary ?? [],
    movementPattern: s.pattern,
    equipment: s.equipment,
    difficulty: s.level,
    setupDifficulty,
    gymSpace: s.space ?? 'medium',
    bodyPosition: s.pos ?? 'standing',
    unilateral: !!s.uni,
    compound: isCompound,
    isolation,
    splitTags,
    defaultSets: setsMin,
    defaultRepRange: [repMin, repMax],
    targetRepRanges: {
      hypertrophy: [repMin, repMax],
      ...(isCompound
        ? { strength: [Math.max(1, repMin - 3), Math.max(3, repMax - 4)] as [number, number] }
        : {}),
      endurance: [repMax, repMax + 8] as [number, number],
    },
    restSeconds,
    progressionModel,
    swapGroup: s.swap,
    substitutionTags: [s.swap],
    avoidIf: [],
    contraindicationNotes: [],
    cues,
    formCues: cues,
    commonMistakes: [],
    safetyNotes: [],
    requiresWarmUp,
    warmUpProtocol,
    plateCalculator,
    seo: {
      title: `${s.name} - Form, Muscles & Alternatives`,
      description: `How to do the ${s.name}: target muscles (${muscleLabel(
        s.primary
      )}), equipment, rep ranges, form cues and exercise substitutions.`,
    },
  };
}

/**
 * Friendly dose string for cards/detail. Returns null for pure cardio (the UI
 * shows a "Conditioning" chip instead, since sets x reps doesn't apply).
 */
export function formatDose(ex: ExerciseDefinition): string | null {
  if (ex.primaryMuscle === 'cardio') return null;
  const [lo, hi] = ex.defaultRepRange;
  const setsPart = `${ex.defaultSets} sets`;
  if (ex.progressionModel === 'distance') return `${setsPart} × ${lo}–${hi} m`;
  if (ex.progressionModel === 'duration') return `${setsPart} × ${lo}–${hi}s`;
  return `${setsPart} × ${lo}–${hi} reps`;
}

function deriveSplitTags(
  primary: MuscleGroup,
  pattern: MovementPattern
): SplitTag[] {
  const push: MuscleGroup[] = ['chest', 'front_delts', 'side_delts', 'triceps'];
  const pull: MuscleGroup[] = ['lats', 'upper_back', 'rear_delts', 'biceps', 'traps', 'forearms'];
  const legs: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'];

  if (push.includes(primary)) return ['push', 'upper'];
  if (pull.includes(primary)) return ['pull', 'upper'];
  if (legs.includes(primary)) return ['legs', 'lower'];
  if (pattern === 'conditioning' || primary === 'cardio') return ['full_body'];
  return ['full_body'];
}
