'use client';

import { useState } from 'react';
import { macroSplit } from '@/lib/calc/nutrition';
import { Disclaimer, NumberField, ResultCard, SelectField } from '@/components/calc/fields';
import styles from './macro.module.css';

type SplitKey = 'balanced' | 'high_protein' | 'low_carb';
const SPLITS: Record<SplitKey, { label: string; proteinPct: number; carbPct: number; fatPct: number }> = {
  balanced: { label: 'Balanced (30 / 40 / 30)', proteinPct: 30, carbPct: 40, fatPct: 30 },
  high_protein: { label: 'High protein (40 / 40 / 20)', proteinPct: 40, carbPct: 40, fatPct: 20 },
  low_carb: { label: 'Lower carb (40 / 20 / 40)', proteinPct: 40, carbPct: 20, fatPct: 40 },
};

export function MacroTool() {
  const [calories, setCalories] = useState('2400');
  const [split, setSplit] = useState<SplitKey>('high_protein');
  const cals = Number(calories);
  const ok = cals > 0;
  const m = ok ? macroSplit(cals, SPLITS[split]) : { proteinG: 0, carbG: 0, fatG: 0 };

  return (
    <div>
      <NumberField label="Daily calories" value={calories} onChange={setCalories} suffix="kcal" min={0} />
      <SelectField
        label="Split (protein / carbs / fat)"
        options={(Object.keys(SPLITS) as SplitKey[]).map((k) => ({ value: k, label: SPLITS[k].label }))}
        value={split}
        onChange={setSplit}
      />
      {ok ? (
        <ResultCard>
          <div className={styles.grid}>
            <Macro label="Protein" grams={m.proteinG} pct={SPLITS[split].proteinPct} />
            <Macro label="Carbs" grams={m.carbG} pct={SPLITS[split].carbPct} />
            <Macro label="Fat" grams={m.fatG} pct={SPLITS[split].fatPct} />
          </div>
        </ResultCard>
      ) : null}
      <Disclaimer>
        A simple split from your calories (protein &amp; carbs at 4 kcal/g, fat at 9
        kcal/g). Educational only — a starting point, not dietary advice.
      </Disclaimer>
    </div>
  );
}

function Macro({ label, grams, pct }: { label: string; grams: number; pct: number }) {
  return (
    <div className={styles.macro}>
      <span className={styles.macroLabel}>{label}</span>
      <span className={styles.macroG}>{grams}g</span>
      <span className={styles.macroPct}>{pct}%</span>
    </div>
  );
}
