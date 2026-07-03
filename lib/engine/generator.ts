/**
 * Safari Lab - deterministic program generator (Stage 4 + Stage 5 overrides).
 *
 * generateProgram(input) is pure and deterministic: the same input always yields
 * the same DraftProgram. No randomness, no Date, no network. Selection uses a
 * stable scoring function with id tie-breaks, and rotates exercise variants
 * across sessions so training days aren't identical.
 *
 * Honours user overrides: BLOCKED exercises are never selected; FAVOURITE
 * exercises are boosted. Priority muscles get extra sets and earlier placement;
 * compounds are selected first; volume respects the canonical caps; exercises are
 * filtered by equipment, level and avoid flags.
 */
import type { ExerciseDefinition, MuscleGroup } from '@/lib/models/exercise';
import type { TrainingGoal } from '@/lib/models/program';
import { WEEKLY_VOLUME_CAPS } from '@/lib/models/adaptive';
import { getAllExercises, muscleLabel } from '@/lib/data/exercises';
import { chooseSplit, SESSION_FOCUS } from './split';
import { isAvoided, levelOk, resolveAvailable, usable } from './filters';
import { buildDraftExercise } from './dose';
import type {
  DraftExercise,
  DraftProgram,
  DraftSession,
  GeneratorInput,
} from './types';

const EX_PER_DURATION: Record<GeneratorInput['durationMinutes'], number> = {
  30: 3,
  45: 4,
  60: 5,
  75: 6,
};

const SETUP_PENALTY = { low: 0, medium: 4, high: 8 } as const;

const GOAL_WORD: Record<string, string> = {
  build_muscle: 'Build',
  strength: 'Strength',
  fat_loss_support: 'Lean',
  general_fitness: 'Fitness',
  endurance_support: 'Endurance',
  recovery: 'Recovery',
  'fatigue-management': 'Recovery',
};

export function generateProgram(input: GeneratorInput): DraftProgram {
  const lib = getAllExercises();
  const available = resolveAvailable(input.equipment);
  const prioritySet = new Set(input.priorityMuscles);
  const blockedSet = new Set(input.blocked ?? []);
  const favouriteSet = new Set(input.favourites ?? []);
  const { sessions: templates, label } = chooseSplit(input.daysPerWeek, input.split);
  const perSession = EX_PER_DURATION[input.durationMinutes];
  const wantsConditioning =
    input.goal === 'fat_loss_support' || input.goal === 'endurance_support';

  const rankCache = new Map<MuscleGroup, ExerciseDefinition[]>();

  function score(muscle: MuscleGroup, ex: ExerciseDefinition): number {
    let s = ex.primaryMuscle === muscle ? 100 : 45;
    if (ex.compound) s += 25;
    if (prioritySet.has(muscle)) s += 15;
    if (favouriteSet.has(ex.id)) s += 40;
    if (input.goal === 'strength' && ex.compound) s += 15;
    if (wantsConditioning && ex.isolation) s += 5;
    if (input.durationMinutes <= 45) s -= SETUP_PENALTY[ex.setupDifficulty];
    if (input.experience === 'beginner') s -= SETUP_PENALTY[ex.setupDifficulty];
    return s;
  }

  function ranked(muscle: MuscleGroup): ExerciseDefinition[] {
    const cached = rankCache.get(muscle);
    if (cached) return cached;
    const cands = lib
      .filter(
        (ex) =>
          ex.primaryMuscle !== 'cardio' &&
          ex.movementPattern !== 'mobility' &&
          !blockedSet.has(ex.id) &&
          levelOk(ex, input.experience) &&
          usable(ex, available) &&
          !isAvoided(ex, input.avoid) &&
          (ex.primaryMuscle === muscle || ex.secondaryMuscles.includes(muscle))
      )
      .sort((a, b) => {
        const d = score(muscle, b) - score(muscle, a);
        return d !== 0 ? d : a.id.localeCompare(b.id);
      });
    rankCache.set(muscle, cands);
    return cands;
  }

  const musclePickCount = new Map<MuscleGroup, number>();

  const conditioningPool = lib.filter(
    (ex) =>
      ex.primaryMuscle === 'cardio' &&
      ex.movementPattern === 'conditioning' &&
      !blockedSet.has(ex.id) &&
      usable(ex, available)
  );

  function buildSession(
    key: keyof typeof SESSION_FOCUS,
    title: string,
    dayIndex: number
  ): DraftSession {
    const focus = SESSION_FOCUS[key];
    const pri = focus.filter((m) => prioritySet.has(m));
    const rest = focus.filter((m) => !prioritySet.has(m));
    const queue: MuscleGroup[] = [...pri, ...rest, ...pri, ...rest];

    const chosen: DraftExercise[] = [];
    const usedIds = new Set<string>();
    const usedSwap = new Set<string>();

    for (const muscle of queue) {
      if (chosen.length >= perSession) break;
      const cands = ranked(muscle);
      if (cands.length === 0) continue;
      const offset = (musclePickCount.get(muscle) ?? 0) % cands.length;
      const rotated = cands.slice(offset).concat(cands.slice(0, offset));
      const notUsed = rotated.filter((c) => !usedIds.has(c.id));
      const swapFree = notUsed.filter((c) => !usedSwap.has(c.swapGroup));
      const pick = (swapFree[0] ?? notUsed[0]) as ExerciseDefinition | undefined;
      if (!pick) continue;
      usedIds.add(pick.id);
      usedSwap.add(pick.swapGroup);
      musclePickCount.set(muscle, (musclePickCount.get(muscle) ?? 0) + 1);
      chosen.push(buildDraftExercise(pick, muscle, input));
    }

    chosen.sort((a, b) => Number(b.isCompound) - Number(a.isCompound));

    if (wantsConditioning && conditioningPool.length) {
      const cardio = conditioningPool[dayIndex % conditioningPool.length]!;
      chosen.push({
        exerciseId: cardio.id,
        name: cardio.name,
        slug: cardio.slug,
        muscle: 'cardio',
        sets: 1,
        repRange: [10, 20],
        restSeconds: 60,
        isPriority: false,
        isCompound: false,
        isFinisher: true,
      });
    }

    return {
      id: `s${dayIndex + 1}`,
      dayIndex,
      title,
      focusMuscles: focus,
      estimatedMinutes: estimateMinutes(chosen),
      exercises: chosen,
    };
  }

  const sessions = templates.map((tpl, i) => buildSession(tpl.key, tpl.title, i));

  const volumeMap = new Map<MuscleGroup, number>();
  for (const s of sessions) {
    for (const ex of s.exercises) {
      if (ex.isFinisher) continue;
      volumeMap.set(ex.muscle, (volumeMap.get(ex.muscle) ?? 0) + ex.sets);
    }
  }
  const weeklyVolume = [...volumeMap.entries()]
    .map(([muscle, sets]) => ({ muscle, sets, priority: prioritySet.has(muscle) }))
    .sort((a, b) => b.sets - a.sets || a.muscle.localeCompare(b.muscle));

  const caps = WEEKLY_VOLUME_CAPS[input.experience];
  const name = `${input.weeks}-Week ${label} ${GOAL_WORD[input.goal] ?? 'Plan'}`;

  const summary: string[] = [
    `A ${input.weeks}-week ${label} plan, ${input.daysPerWeek} days per week.`,
    `${perSession} main exercises per session, ${describeGoal(input.goal)}.`,
    'Each session leads with your biggest compound lifts while you are fresh.',
  ];
  if (input.priorityMuscles.length) {
    summary.push(
      `Priority focus: ${input.priorityMuscles.map(muscleLabel).join(', ')} — extra sets and earlier placement, within recovery-safe volume caps (${caps.priority[0]}–${caps.priority[1]} sets/week, hard cap ${caps.priorityHardCap}).`
    );
  }
  if (wantsConditioning) {
    summary.push('A short conditioning finisher is added to each session to support your goal.');
  }
  if (blockedSet.size) {
    summary.push(`${blockedSet.size} blocked exercise${blockedSet.size > 1 ? 's are' : ' is'} excluded from this plan.`);
  }

  return {
    id: `draft-${hashInput(input)}`,
    name,
    goal: input.goal,
    experience: input.experience,
    weeks: input.weeks,
    daysPerWeek: input.daysPerWeek,
    split: input.split,
    resolvedSplit: label,
    sessions,
    priorityMuscles: input.priorityMuscles,
    weeklyVolume,
    summary,
    input,
  };
}

function describeGoal(goal: TrainingGoal): string {
  switch (goal) {
    case 'strength':
      return 'lower reps and longer rest for strength';
    case 'endurance_support':
      return 'higher reps and short rest for endurance';
    case 'fat_loss_support':
      return 'moderate reps with conditioning to support fat loss';
    case 'general_fitness':
      return 'balanced reps for general fitness';
    default:
      return 'hypertrophy rep ranges for muscle growth';
  }
}

function hashInput(input: GeneratorInput): string {
  const str = JSON.stringify(input);
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function estimateMinutes(exercises: DraftExercise[]): number {
  let mins = 6;
  for (const ex of exercises) {
    const avgReps = (ex.repRange[0] + ex.repRange[1]) / 2;
    const perSet = avgReps * 3 + ex.restSeconds;
    mins += (ex.sets * perSet) / 60;
  }
  return Math.round(mins);
}
