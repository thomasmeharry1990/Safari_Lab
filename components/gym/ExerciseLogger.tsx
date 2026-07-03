'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SessionExerciseBlock } from '@/lib/models/session';
import type { ExerciseHistoryStat, ProgressionRec, WeightUnit } from '@/lib/engine';
import { getExerciseById } from '@/lib/data/exercises';
import { PlateCalc } from './PlateCalc';
import styles from './gym.module.css';

interface LoggedSet {
  weight?: number;
  reps?: number;
}

export function ExerciseLogger({
  block,
  unit,
  stat,
  rec,
  logged,
  onLog,
}: {
  block: SessionExerciseBlock;
  unit: WeightUnit;
  stat: ExerciseHistoryStat;
  rec?: ProgressionRec;
  logged: Map<number, LoggedSet>;
  onLog: (setNumber: number, weight: number | undefined, reps: number | undefined) => void;
}) {
  const ex = getExerciseById(block.currentExerciseId);
  const isCardio = ex?.primaryMuscle === 'cardio';
  const showPlateToggle = !!ex?.plateCalculator;

  const prefillWeight =
    rec?.suggestedWeight != null
      ? String(rec.suggestedWeight)
      : stat.last?.weight != null
        ? String(stat.last.weight)
        : '';
  const prefillReps =
    rec?.suggestedReps != null
      ? String(rec.suggestedReps)
      : stat.last?.reps != null
        ? String(stat.last.reps)
        : String(block.targetRepRange[1]);

  const [inputs, setInputs] = useState<{ weight: string; reps: string }[]>(() =>
    Array.from({ length: block.targetSets }, (_, i) => {
      const done = logged.get(i + 1);
      return {
        weight: done?.weight != null ? String(done.weight) : prefillWeight,
        reps: done?.reps != null ? String(done.reps) : prefillReps,
      };
    })
  );
  const [showPlates, setShowPlates] = useState(false);

  function update(idx: number, field: 'weight' | 'reps', value: string) {
    setInputs((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  function submit(setNumber: number) {
    const row = inputs[setNumber - 1];
    if (!row) return;
    const weight = row.weight === '' ? undefined : Number(row.weight);
    const reps = row.reps === '' ? undefined : Number(row.reps);
    onLog(setNumber, weight, reps);
  }

  const targetText = isCardio
    ? `${block.targetRepRange[0]}–${block.targetRepRange[1]} min`
    : `${block.targetSets} × ${block.targetRepRange[0]}–${block.targetRepRange[1]}`;

  return (
    <div className={styles.exercise}>
      <div className={styles.exHeader}>
        <div>
          <Link href={`/exercises/${ex?.slug ?? ''}`} className={styles.exName}>
            {ex?.name ?? block.currentExerciseId}
          </Link>
          <div className={styles.exTarget}>Target: {targetText}</div>
        </div>
        {block.status === 'complete' ? <span className={styles.exDone}>✓ Done</span> : null}
      </div>

      <div className={styles.chips}>
        {rec && rec.action !== 'start' ? (
          <span className={styles.chipRec} title={rec.rationale}>
            Next:{' '}
            {rec.suggestedWeight != null
              ? `${rec.suggestedWeight}${unit} × ${rec.suggestedReps}`
              : `${rec.suggestedReps} ${isCardio ? 'min' : 'reps'}`}
          </span>
        ) : null}
        {stat.last ? (
          <span className={styles.chip}>
            Last {stat.last.weight}{unit} × {stat.last.reps}
          </span>
        ) : (
          <span className={styles.chipMuted}>First time — set your baseline</span>
        )}
        {stat.best ? (
          <span className={styles.chipGold}>
            Best {stat.best.weight}{unit} × {stat.best.reps}
          </span>
        ) : null}
        {showPlateToggle ? (
          <button
            type="button"
            className={styles.plateToggle}
            onClick={() => setShowPlates((v) => !v)}
            aria-expanded={showPlates}
          >
            Plates
          </button>
        ) : null}
      </div>

      {showPlates ? (
        <PlateCalc unit={unit} initialWeight={Number(inputs[0]?.weight) || undefined} />
      ) : null}

      <ol className={styles.sets}>
        {Array.from({ length: block.targetSets }, (_, i) => {
          const setNumber = i + 1;
          const done = logged.has(setNumber);
          const row = inputs[i]!;
          return (
            <li key={setNumber} className={done ? styles.setRowDone : styles.setRow}>
              <span className={styles.setNum}>{setNumber}</span>
              {!isCardio ? (
                <span className={styles.setField}>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={row.weight}
                    onChange={(e) => update(i, 'weight', e.target.value)}
                    aria-label={`Set ${setNumber} weight`}
                    placeholder="0"
                  />
                  <span className={styles.setUnit}>{unit}</span>
                </span>
              ) : null}
              <span className={styles.setField}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={row.reps}
                  onChange={(e) => update(i, 'reps', e.target.value)}
                  aria-label={`Set ${setNumber} ${isCardio ? 'minutes' : 'reps'}`}
                  placeholder="0"
                />
                <span className={styles.setUnit}>{isCardio ? 'min' : 'reps'}</span>
              </span>
              <button
                type="button"
                className={done ? styles.setBtnDone : styles.setBtn}
                onClick={() => submit(setNumber)}
              >
                {done ? 'Update' : 'Done'}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
