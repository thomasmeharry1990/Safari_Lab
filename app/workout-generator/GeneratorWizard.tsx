'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ExperienceLevel, MuscleGroup } from '@/lib/models/exercise';
import type { TrainingGoal } from '@/lib/models/program';
import { buildSwap, generateProgram } from '@/lib/engine';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import type {
  AvoidFlag,
  DraftProgram,
  EquipmentProfile,
  GeneratorInput,
  GeneratorSplit,
} from '@/lib/engine/types';
import { DraftProgramView } from '@/components/program/DraftProgramView';
import { Button } from '@/components/ui';
import styles from './generator.module.css';

const GOALS: { value: TrainingGoal; label: string }[] = [
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'strength', label: 'Strength' },
  { value: 'fat_loss_support', label: 'Fat loss support' },
  { value: 'general_fitness', label: 'General fitness' },
  { value: 'endurance_support', label: 'Endurance' },
];
const LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];
const DAYS: (2 | 3 | 4 | 5 | 6)[] = [2, 3, 4, 5, 6];
const WEEKS: (4 | 6 | 8 | 12)[] = [4, 6, 8, 12];
const SPLITS: { value: GeneratorSplit; label: string }[] = [
  { value: 'auto', label: 'Auto (best fit)' },
  { value: 'full_body', label: 'Full body' },
  { value: 'upper_lower', label: 'Upper / Lower' },
  { value: 'ppl', label: 'Push / Pull / Legs' },
];
const DURATIONS: (30 | 45 | 60 | 75)[] = [30, 45, 60, 75];
const PRIORITY_OPTIONS: { value: MuscleGroup; label: string }[] = [
  { value: 'chest', label: 'Chest' },
  { value: 'lats', label: 'Back' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'quads', label: 'Quads' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'side_delts', label: 'Shoulders' },
  { value: 'biceps', label: 'Biceps' },
  { value: 'triceps', label: 'Triceps' },
  { value: 'calves', label: 'Calves' },
  { value: 'core', label: 'Core' },
];
const EQUIPMENT: { value: EquipmentProfile; label: string; note: string }[] = [
  { value: 'full_gym', label: 'Full gym', note: 'Barbells, machines, cables, dumbbells' },
  { value: 'dumbbells', label: 'Dumbbells', note: 'Dumbbells + a bench' },
  { value: 'home', label: 'Home', note: 'Dumbbells, bands, pull-up bar' },
  { value: 'bodyweight', label: 'Bodyweight', note: 'No equipment needed' },
];
const AVOIDS: { value: AvoidFlag; label: string }[] = [
  { value: 'knee', label: 'Knee-friendly' },
  { value: 'shoulder', label: 'Shoulder-friendly' },
  { value: 'lower_back', label: 'Lower-back-friendly' },
  { value: 'no_barbell', label: 'No barbell' },
];

const STEPS = ['Goal', 'Schedule', 'Priorities', 'Equipment', 'Adjustments'];
const MAX_PRIORITY = 3;

export function GeneratorWizard() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<TrainingGoal>('build_muscle');
  const [experience, setExperience] = useState<ExperienceLevel>('intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState<GeneratorInput['daysPerWeek']>(4);
  const [weeks, setWeeks] = useState<GeneratorInput['weeks']>(6);
  const [split, setSplit] = useState<GeneratorSplit>('auto');
  const [durationMinutes, setDuration] = useState<GeneratorInput['durationMinutes']>(60);
  const [priorityMuscles, setPriority] = useState<MuscleGroup[]>([]);
  const [equipment, setEquipment] = useState<EquipmentProfile>('full_gym');
  const [avoid, setAvoid] = useState<AvoidFlag[]>([]);
  const [program, setProgram] = useState<DraftProgram | null>(null);
  const [activeInput, setActiveInput] = useState<GeneratorInput | null>(null);
  const {
    blockedIds,
    favouriteIds,
    blockExercise,
    unblockExercise,
    activeProgram,
    lockProgram,
  } = useLocalData();
  const [lockConfirm, setLockConfirm] = useState(false);
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);

  function togglePriority(m: MuscleGroup) {
    setPriority((prev) =>
      prev.includes(m)
        ? prev.filter((x) => x !== m)
        : prev.length < MAX_PRIORITY
          ? [...prev, m]
          : prev
    );
  }
  function toggleAvoid(a: AvoidFlag) {
    setAvoid((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function run(input: GeneratorInput, scroll: boolean) {
    setActiveInput(input);
    setProgram(generateProgram(input));
    if (scroll) {
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    }
  }

  function generate() {
    run(
      {
        goal,
        experience,
        weeks,
        daysPerWeek,
        split,
        durationMinutes,
        priorityMuscles,
        equipment,
        avoid,
        blocked: blockedIds,
        favourites: favouriteIds,
      },
      true
    );
  }

  function handleBlock(id: string) {
    if (!activeInput) return;
    const next = blockedIds.includes(id) ? blockedIds : [...blockedIds, id];
    blockExercise(id); // persists to IndexedDB
    run({ ...activeInput, blocked: next }, false);
  }

  function handleUnblock(id: string) {
    if (!activeInput) return;
    const next = blockedIds.filter((x) => x !== id);
    unblockExercise(id); // persists to IndexedDB
    run({ ...activeInput, blocked: next }, false);
  }

  function handleLock() {
    if (!program) return;
    if (activeProgram) {
      setLockConfirm(true);
      return;
    }
    doLock();
  }

  function doLock() {
    if (!program) return;
    lockProgram(program);
    router.push('/program');
  }

  function handleSwap(si: number, ei: number, newExId: string) {
    if (!program || !activeInput) return;
    const slot = program.sessions[si]?.exercises[ei];
    if (!slot) return;
    const replacement = buildSwap(newExId, slot.muscle, activeInput);
    if (!replacement) return;
    const sessions = program.sessions.map((s, i) =>
      i !== si
        ? s
        : { ...s, exercises: s.exercises.map((e, j) => (j !== ei ? e : replacement)) }
    );
    setProgram({ ...program, sessions });
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div>
      <ol className={styles.steps} aria-label="Generator steps">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={i === step ? styles.stepActive : i < step ? styles.stepDone : styles.step}
          >
            <span className={styles.stepNum}>{i + 1}</span>
            <span className={styles.stepLabel}>{label}</span>
          </li>
        ))}
      </ol>

      <div className={styles.panel}>
        {step === 0 && (
          <>
            <Field label="What's your main goal?">
              <Segmented options={GOALS} value={goal} onChange={setGoal} />
            </Field>
            <Field label="Experience level">
              <Segmented options={LEVELS} value={experience} onChange={setExperience} />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Workouts per week">
              <Segmented
                options={DAYS.map((d) => ({ value: d, label: String(d) }))}
                value={daysPerWeek}
                onChange={setDaysPerWeek}
              />
            </Field>
            <Field label="Program length">
              <Segmented
                options={WEEKS.map((w) => ({ value: w, label: `${w} weeks` }))}
                value={weeks}
                onChange={setWeeks}
              />
            </Field>
            <Field label="Split preference">
              <Segmented options={SPLITS} value={split} onChange={setSplit} />
            </Field>
            <Field label="Session length">
              <Segmented
                options={DURATIONS.map((d) => ({ value: d, label: `${d} min` }))}
                value={durationMinutes}
                onChange={setDuration}
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <Field
            label="Priority muscles"
            hint={`Optional — pick up to ${MAX_PRIORITY}. Priorities get extra sets and earlier placement.`}
          >
            <div className={styles.chips}>
              {PRIORITY_OPTIONS.map((m) => {
                const on = priorityMuscles.includes(m.value);
                const full = priorityMuscles.length >= MAX_PRIORITY && !on;
                return (
                  <button
                    key={m.value}
                    type="button"
                    className={on ? styles.chipOn : styles.chip}
                    onClick={() => togglePriority(m.value)}
                    disabled={full}
                    aria-pressed={on}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </Field>
        )}

        {step === 3 && (
          <Field label="What equipment do you have?">
            <div className={styles.cards}>
              {EQUIPMENT.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  className={equipment === e.value ? styles.optCardOn : styles.optCard}
                  onClick={() => setEquipment(e.value)}
                  aria-pressed={equipment === e.value}
                >
                  <span className={styles.optCardLabel}>{e.label}</span>
                  <span className={styles.optCardNote}>{e.note}</span>
                </button>
              ))}
            </div>
          </Field>
        )}

        {step === 4 && (
          <Field
            label="Any adjustments?"
            hint="Optional — Safari Lab will steer around these."
          >
            <div className={styles.chips}>
              {AVOIDS.map((a) => {
                const on = avoid.includes(a.value);
                return (
                  <button
                    key={a.value}
                    type="button"
                    className={on ? styles.chipOn : styles.chip}
                    onClick={() => toggleAvoid(a.value)}
                    aria-pressed={on}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </Field>
        )}

        <div className={styles.nav}>
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {isLast ? (
            <Button variant="primary" onClick={generate}>
              Generate Plan
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
              Next
            </Button>
          )}
        </div>
      </div>

      {program && activeInput ? (
        <div ref={resultRef} className={styles.result}>
          <div className={styles.resultActions}>
            <Button variant="primary" onClick={handleLock}>
              Lock this Safari
            </Button>
            <Button variant="secondary" onClick={generate}>
              Regenerate
            </Button>
            <Button variant="ghost" onClick={() => setProgram(null)}>
              Adjust inputs
            </Button>
          </div>
          {lockConfirm ? (
            <div className={styles.lockConfirm}>
              <span className={styles.lockConfirmText}>
                You already have an active program. Locking this one replaces it.
              </span>
              <div className={styles.resultActions}>
                <Button variant="primary" onClick={doLock}>
                  Replace &amp; lock
                </Button>
                <Button variant="ghost" onClick={() => setLockConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
          <DraftProgramView
            program={program}
            input={activeInput}
            blocked={blockedIds}
            onSwap={handleSwap}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
          />
        </div>
      ) : null}
    </div>
  );
}

/* --- small local controls --- */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {hint ? <span className={styles.fieldHint}>{hint}</span> : null}
      {children}
    </div>
  );
}

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className={styles.segmented} role="group">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          className={o.value === value ? styles.segOn : styles.seg}
          onClick={() => onChange(o.value)}
          aria-pressed={o.value === value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
