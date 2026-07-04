'use client';

import { useState } from 'react';
import {
  ACTIVITY,
  inToCm,
  lbToKg,
  mifflinBmr,
  tdee,
  type ActivityLevel,
  type Sex,
} from '@/lib/calc/nutrition';
import {
  Disclaimer,
  NumberField,
  ResultCard,
  SegField,
  SelectField,
} from '@/components/calc/fields';
import styles from './tdee.module.css';

export function TdeeTool() {
  const [sex, setSex] = useState<Sex>('male');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('80');
  const [height, setHeight] = useState('178');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  const weightKg = units === 'metric' ? Number(weight) : lbToKg(Number(weight));
  const heightCm = units === 'metric' ? Number(height) : inToCm(Number(height));
  const ok = weightKg > 0 && heightCm > 0 && Number(age) > 0;
  const bmr = ok ? mifflinBmr({ sex, age: Number(age), weightKg, heightCm }) : 0;
  const total = ok ? tdee(bmr, activity) : 0;

  return (
    <div>
      <SegField
        label="Sex"
        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
        value={sex}
        onChange={setSex}
      />
      <SegField
        label="Units"
        options={[{ value: 'metric', label: 'Metric (kg/cm)' }, { value: 'imperial', label: 'Imperial (lb/in)' }]}
        value={units}
        onChange={setUnits}
      />
      <NumberField label="Age" value={age} onChange={setAge} suffix="years" min={0} />
      <NumberField label="Weight" value={weight} onChange={setWeight} suffix={units === 'metric' ? 'kg' : 'lb'} min={0} />
      <NumberField label="Height" value={height} onChange={setHeight} suffix={units === 'metric' ? 'cm' : 'in'} min={0} />
      <SelectField
        label="Activity level"
        options={(Object.keys(ACTIVITY) as ActivityLevel[]).map((k) => ({ value: k, label: ACTIVITY[k].label }))}
        value={activity}
        onChange={setActivity}
      />

      {ok ? (
        <ResultCard>
          <div className={styles.grid}>
            <Stat label="BMR" value={`${bmr}`} sub="calories at rest" />
            <Stat label="Maintenance (TDEE)" value={`${total}`} sub="calories/day" highlight />
          </div>
          <div className={styles.grid}>
            <Stat label="Fat loss" value={`${total - 500}`} sub="~0.5 kg/week" />
            <Stat label="Lean gain" value={`${total + 300}`} sub="slow bulk" />
          </div>
        </ResultCard>
      ) : null}

      <Disclaimer>
        An educational estimate using the Mifflin-St Jeor equation. It is not
        dietary or medical advice — adjust to how your body actually responds.
      </Disclaimer>
    </div>
  );
}

function Stat({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={highlight ? styles.statValueHi : styles.statValue}>{value}</span>
      <span className={styles.statSub}>{sub}</span>
    </div>
  );
}
