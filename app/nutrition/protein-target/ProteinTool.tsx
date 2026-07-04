'use client';

import { useState } from 'react';
import { lbToKg, proteinTarget } from '@/lib/calc/nutrition';
import { BigResult, Disclaimer, NumberField, ResultCard, SegField } from '@/components/calc/fields';

export function ProteinTool() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('80');
  const weightKg = units === 'metric' ? Number(weight) : lbToKg(Number(weight));
  const ok = weightKg > 0;
  const t = ok ? proteinTarget(weightKg) : { low: 0, high: 0 };

  return (
    <div>
      <SegField
        label="Units"
        options={[{ value: 'metric', label: 'kg' }, { value: 'imperial', label: 'lb' }]}
        value={units}
        onChange={setUnits}
      />
      <NumberField
        label="Body weight"
        value={weight}
        onChange={setWeight}
        suffix={units === 'metric' ? 'kg' : 'lb'}
        min={0}
      />
      {ok ? (
        <ResultCard>
          <BigResult value={`${t.low}–${t.high}`} unit="g/day" caption="Daily protein target" />
        </ResultCard>
      ) : null}
      <Disclaimer>
        Based on roughly 1.6–2.2 g of protein per kg of body weight — a well-supported
        range for building and keeping muscle. Educational only, not dietary advice.
      </Disclaimer>
    </div>
  );
}
