'use client';

import { useState } from 'react';
import {
  cmToIn,
  inToCm,
  kgToLb,
  lbToKg,
  type Sex,
} from '@/lib/calc/nutrition';
import {
  bodyFatCategory,
  ffmi,
  ffmiCategory,
  navyBodyFat,
} from '@/lib/calc/bodyComposition';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { latestMeasurements, latestWeight } from '@/lib/engine';
import {
  Disclaimer,
  NumberField,
  ResultCard,
  SegField,
} from '@/components/calc/fields';
import styles from './bodyFat.module.css';

type Units = 'metric' | 'imperial';

export function BodyFatTool() {
  const { bodyEntries } = useLocalData();
  const [sex, setSex] = useState<Sex>('male');
  const [units, setUnits] = useState<Units>('metric');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('80');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');

  const lm = latestMeasurements(bodyEntries);
  const lw = latestWeight(bodyEntries);
  const hasLogged = lw != null || Object.keys(lm.values).length > 0;

  function useLoggedData() {
    // Prefer the length unit of logged measurements; else the weight unit.
    const system: Units =
      (lm.unit ?? (lw?.unit === 'lb' ? 'in' : 'cm')) === 'in' ? 'imperial' : 'metric';
    setUnits(system);
    if (lm.values.neck != null) setNeck(String(round1(lm.values.neck)));
    if (lm.values.waist != null) setWaist(String(round1(lm.values.waist)));
    if (lm.values.hips != null) setHip(String(round1(lm.values.hips)));
    if (lw != null) {
      const wantKg = system === 'metric';
      const w = lw.unit === 'kg' ? lw.weight : lbToKg(lw.weight);
      setWeight(String(round1(wantKg ? w : kgToLb(w))));
    }
  }

  const metric = units === 'metric';
  const heightCm = metric ? Number(height) : inToCm(Number(height));
  const weightKg = metric ? Number(weight) : lbToKg(Number(weight));
  const neckCm = metric ? Number(neck) : inToCm(Number(neck));
  const waistCm = metric ? Number(waist) : inToCm(Number(waist));
  const hipCm = metric ? Number(hip) : inToCm(Number(hip));

  const bf = navyBodyFat({
    sex,
    heightCm,
    neckCm,
    waistCm,
    hipCm: sex === 'female' ? hipCm : undefined,
  });

  const comp = bf != null ? ffmi(weightKg, heightCm, bf) : null;
  const fatMassKg = bf != null && weightKg > 0 ? (weightKg * bf) / 100 : null;

  const wUnit = metric ? 'kg' : 'lb';
  const toDisplayMass = (kg: number) => round1(metric ? kg : kgToLb(kg));
  const lUnit = metric ? 'cm' : 'in';

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
        options={[
          { value: 'metric', label: 'Metric (cm/kg)' },
          { value: 'imperial', label: 'Imperial (in/lb)' },
        ]}
        value={units}
        onChange={setUnits}
      />

      {hasLogged ? (
        <button type="button" className={styles.useLogged} onClick={useLoggedData}>
          Use my logged measurements
        </button>
      ) : null}

      <NumberField label="Height" value={height} onChange={setHeight} suffix={lUnit} min={0} />
      <NumberField label="Weight" value={weight} onChange={setWeight} suffix={wUnit} min={0} />
      <NumberField label="Neck" value={neck} onChange={setNeck} suffix={lUnit} min={0} placeholder="around the neck" />
      <NumberField label="Waist" value={waist} onChange={setWaist} suffix={lUnit} min={0} placeholder="at the navel" />
      {sex === 'female' ? (
        <NumberField label="Hips" value={hip} onChange={setHip} suffix={lUnit} min={0} placeholder="at the widest" />
      ) : null}

      {bf != null ? (
        <ResultCard>
          <div className={styles.headline}>
            <span className={styles.bfValue}>{bf}%</span>
            <span className={styles.bfLabel}>
              body fat · {bodyFatCategory(bf, sex)}
            </span>
          </div>
          <div className={styles.grid}>
            <Stat label="Lean mass" value={`${toDisplayMass(comp?.fatFreeMassKg ?? weightKg * (1 - bf / 100))}${wUnit}`} />
            <Stat label="Fat mass" value={fatMassKg != null ? `${toDisplayMass(fatMassKg)}${wUnit}` : '—'} />
            {comp ? <Stat label="FFMI (normalised)" value={`${comp.normalised}`} sub={ffmiCategory(comp.normalised)} highlight /> : null}
          </div>
        </ResultCard>
      ) : (
        <p className={styles.hint}>
          Enter your neck and waist{sex === 'female' ? ' and hips' : ''} to estimate
          body fat. The waist must be larger than the neck for the formula to work.
        </p>
      )}

      <Disclaimer>
        A rough estimate using the US Navy circumference method and FFMI — handy
        for tracking a trend, but it is not a clinical body-composition
        measurement. Measure relaxed, at the same spots each time.
      </Disclaimer>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={highlight ? styles.statValueHi : styles.statValue}>{value}</span>
      {sub ? <span className={styles.statSub}>{sub}</span> : null}
    </div>
  );
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
