'use client';

import { useMemo, useState } from 'react';
import type { MuscleGroup } from '@/lib/models/exercise';
import type { ActiveProgram, DraftSession } from '@/lib/engine/types';
import {
  adaptEquipment,
  adaptLowTime,
  adaptMissed,
  adaptSoreness,
  type AdaptReason,
  type AdaptResult,
} from '@/lib/engine';
import { getExerciseById, muscleLabel } from '@/lib/data/exercises';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { SessionPlan } from '@/components/program/SessionPlan';
import { Button } from '@/components/ui';
import styles from './adapt.module.css';

const REASONS: { value: AdaptReason; label: string }[] = [
  { value: 'low-time', label: 'Short on time' },
  { value: 'soreness', label: 'Feeling sore' },
  { value: 'equipment', label: 'Missing equipment' },
  { value: 'missed', label: 'Missed last session' },
];

const TIME_OPTIONS = [30, 45, 60];

export function AdaptPanel({
  program,
  dayIndex,
}: {
  program: ActiveProgram;
  dayIndex: number;
}) {
  const { adaptSession } = useLocalData();
  const session = program.sessions[dayIndex]!;

  const [reason, setReason] = useState<AdaptReason | null>(null);
  const [minutes, setMinutes] = useState(30);
  const [sore, setSore] = useState<Set<MuscleGroup>>(new Set());
  const [gone, setGone] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<AdaptResult | null>(null);
  const [original, setOriginal] = useState<DraftSession | null>(null);

  const muscleOptions = useMemo(() => {
    const set = new Set<MuscleGroup>();
    for (const e of session.exercises) if (e.muscle !== 'cardio') set.add(e.muscle);
    return [...set];
  }, [session]);

  const equipmentOptions = useMemo(() => {
    const set = new Set<string>();
    for (const e of session.exercises) {
      const ex = getExerciseById(e.exerciseId);
      ex?.equipment.forEach((t) => set.add(t));
    }
    return [...set].sort();
  }, [session]);

  function reset() {
    setReason(null);
    setResult(null);
    setSore(new Set());
    setGone(new Set());
  }

  const canPreview =
    reason === 'low-time' ||
    reason === 'missed' ||
    (reason === 'soreness' && sore.size > 0) ||
    (reason === 'equipment' && gone.size > 0);

  function preview() {
    let r: AdaptResult;
    if (reason === 'low-time') r = adaptLowTime(session, minutes);
    else if (reason === 'soreness') r = adaptSoreness(session, [...sore]);
    else if (reason === 'equipment') r = adaptEquipment(session, [...gone], program);
    else r = adaptMissed(program, dayIndex);
    setResult(r);
  }

  function apply() {
    if (!result) return;
    setOriginal(session);
    adaptSession(dayIndex, result.session);
    setResult(null);
    setReason(null);
  }

  function undo() {
    if (!original) return;
    adaptSession(dayIndex, original);
    setOriginal(null);
  }

  return (
    <div className={styles.panel}>
      {original ? (
        <div className={styles.applied}>
          <span className={styles.appliedText}>Session adapted.</span>
          <Button variant="secondary" onClick={undo}>
            Undo adaptation
          </Button>
        </div>
      ) : null}

      <h3 className={styles.title}>Adapt today’s session</h3>
      <p className={styles.hint}>
        Life happens. Tell Safari Lab what’s going on and it reshapes today —
        every change explained, and you can undo it.
      </p>

      <div className={styles.reasons}>
        {REASONS.map((r) => (
          <button
            key={r.value}
            type="button"
            className={reason === r.value ? styles.reasonOn : styles.reason}
            onClick={() => {
              setReason(r.value);
              setResult(null);
            }}
            aria-pressed={reason === r.value}
          >
            {r.label}
          </button>
        ))}
      </div>

      {reason === 'low-time' ? (
        <Field label="How long do you have?">
          <div className={styles.chips}>
            {TIME_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                className={minutes === m ? styles.chipOn : styles.chip}
                onClick={() => setMinutes(m)}
              >
                {m} min
              </button>
            ))}
          </div>
        </Field>
      ) : null}

      {reason === 'soreness' ? (
        <Field label="Which muscles are sore?">
          <div className={styles.chips}>
            {muscleOptions.map((m) => (
              <Toggle
                key={m}
                label={muscleLabel(m)}
                on={sore.has(m)}
                onClick={() => setSore((prev) => toggle(prev, m))}
              />
            ))}
          </div>
        </Field>
      ) : null}

      {reason === 'equipment' ? (
        <Field label="What’s unavailable?">
          <div className={styles.chips}>
            {equipmentOptions.map((t) => (
              <Toggle
                key={t}
                label={t}
                on={gone.has(t)}
                onClick={() => setGone((prev) => toggle(prev, t))}
              />
            ))}
          </div>
        </Field>
      ) : null}

      {reason ? (
        <div className={styles.actions}>
          <Button variant="primary" onClick={preview} disabled={!canPreview}>
            Preview changes
          </Button>
          <Button variant="ghost" onClick={reset}>
            Cancel
          </Button>
        </div>
      ) : null}

      {result ? (
        <div className={styles.result}>
          <h4 className={styles.resultTitle}>{result.ruleLabel}</h4>
          <ul className={styles.changes}>
            {result.changes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <SessionPlan session={result.session} label="Adapted session" />
          <div className={styles.actions}>
            <Button variant="primary" onClick={apply}>
              Apply to today
            </Button>
            <Button variant="ghost" onClick={() => setResult(null)}>
              Discard
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </div>
  );
}

function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={on ? styles.chipOn : styles.chip}
      onClick={onClick}
      aria-pressed={on}
    >
      {label}
    </button>
  );
}
