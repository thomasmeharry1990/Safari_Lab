/**
 * Safari Lab - Quick Safari: a one-off session, no program needed (premium P2).
 * Reuses the deterministic generator: a full-body session emphasising any target
 * muscles, sized to the time you have and the equipment you own.
 */
import type { ExperienceLevel, MuscleGroup } from '@/lib/models/exercise';
import type { TrainingGoal } from '@/lib/models/program';
import { muscleLabel } from '@/lib/data/exercises';
import { generateProgram } from './generator';
import type { AvoidFlag, DraftSession, EquipmentProfile } from './types';

export interface QuickInput {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  durationMinutes: 30 | 45 | 60 | 75;
  equipment: EquipmentProfile;
  targetMuscles: MuscleGroup[];
  avoid: AvoidFlag[];
  blocked?: string[];
}

export function generateQuickSession(input: QuickInput): DraftSession {
  const program = generateProgram({
    goal: input.goal,
    experience: input.experience,
    weeks: 4,
    daysPerWeek: 2,
    split: 'full_body',
    durationMinutes: input.durationMinutes,
    priorityMuscles: input.targetMuscles,
    equipment: input.equipment,
    avoid: input.avoid,
    blocked: input.blocked,
  });
  const s = program.sessions[0]!;
  const title = input.targetMuscles.length
    ? `${input.targetMuscles.map(muscleLabel).join(' & ')} Safari`
    : 'Quick Safari';
  return { ...s, id: `quick-${program.id}`, title };
}
