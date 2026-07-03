'use client';

import { useState } from 'react';
import { DEFAULT_BAR, plateBreakdown, type WeightUnit } from '@/lib/calc/plate';
import styles from './gym.module.css';

/** Self-contained per-side plate calculator for barbell lifts. */
export function PlateCalc({
  unit,
  initialWeight,
}: {
  unit: WeightUnit;
  initialWeight?: number;
}) {
  const [w, setW] = useState(initialWeight ? String(initialWeight) : '');
  const result = plateBreakdown(Number(w), unit);

  return (
    <div className={styles.plate}>
      <div className={styles.plateInput}>
        <input
          type="number"
          inputMode="decimal"
          value={w}
          onChange={(e) => setW(e.target.value)}
          placeholder="Total weight"
          aria-label="Barbell total weight"
        />
        <span className={styles.plateUnit}>{unit}</span>
      </div>
      {result ? (
        result.perSide.length ? (
          <p className={styles.plateOut}>
            Per side:{' '}
            {result.perSide.map((p) => (
              <span key={p.plate} className={styles.plateChip}>
                {p.count}×{p.plate}
              </span>
            ))}
            {result.leftover > 0 ? (
              <span className={styles.plateLeft}> +{result.leftover}{unit} unplated</span>
            ) : null}
          </p>
        ) : (
          <p className={styles.plateOut}>Just the bar ({result.barWeight}{unit}).</p>
        )
      ) : (
        <p className={styles.plateHint}>
          Enter a weight of at least the bar ({DEFAULT_BAR[unit]}{unit}).
        </p>
      )}
    </div>
  );
}
