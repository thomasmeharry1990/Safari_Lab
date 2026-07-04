'use client';

import { useState } from 'react';
import type { WeightUnit } from '@/lib/calc/plate';
import { estimate1RM, percentTable } from '@/lib/calc/onerm';
import { BigResult, Disclaimer, NumberField, ResultCard, SegField } from '@/components/calc/fields';
import styles from './onerm.module.css';

export function OneRmTool() {
  const [unit, setUnit] = useState<WeightUnit>('kg');
  const [weight, setWeight] = useState('100');
  const [reps, setReps] = useState('5');
  const orm = estimate1RM(Number(weight), Number(reps));
  const table = orm > 0 ? percentTable(orm) : [];

  return (
    <div>
      <SegField
        label="Unit"
        options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]}
        value={unit}
        onChange={setUnit}
      />
      <NumberField label="Weight lifted" value={weight} onChange={setWeight} suffix={unit} min={0} />
      <NumberField label="Reps performed" value={reps} onChange={setReps} suffix="reps" min={1} />

      {orm > 0 ? (
        <ResultCard>
          <BigResult value={String(orm)} unit={unit} caption="Estimated 1-rep max" />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>% of 1RM</th>
                <th>Weight</th>
                <th>~ reps</th>
              </tr>
            </thead>
            <tbody>
              {table.map((r) => (
                <tr key={r.pct}>
                  <td>{r.pct}%</td>
                  <td>{r.weight}{unit}</td>
                  <td>{r.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResultCard>
      ) : null}

      <Disclaimer>
        An estimate (average of the Epley and Brzycki formulas), most accurate under
        about 10 reps. Never max out without a spotter, and build up conservatively.
      </Disclaimer>
    </div>
  );
}
