'use client';

import { useState } from 'react';
import { DEFAULT_BAR, plateBreakdown, type WeightUnit } from '@/lib/calc/plate';
import { NumberField, ResultCard, SegField } from '@/components/calc/fields';

export function PlateTool() {
  const [unit, setUnit] = useState<WeightUnit>('kg');
  const [weight, setWeight] = useState('100');
  const [bar, setBar] = useState('');
  const barW = bar === '' ? DEFAULT_BAR[unit] : Number(bar);
  const res = plateBreakdown(Number(weight), unit, barW);

  return (
    <div>
      <SegField
        label="Unit"
        options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]}
        value={unit}
        onChange={setUnit}
      />
      <NumberField label="Total weight" value={weight} onChange={setWeight} suffix={unit} min={0} />
      <NumberField
        label="Bar weight"
        value={bar}
        onChange={setBar}
        suffix={unit}
        placeholder={String(DEFAULT_BAR[unit])}
      />
      <ResultCard>
        {res ? (
          res.perSide.length ? (
            <p style={{ margin: 0, color: 'var(--sl-cream)' }}>
              Per side:{' '}
              {res.perSide.map((p) => `${p.count} × ${p.plate}${unit}`).join(', ')}
              {res.leftover > 0 ? ` — ${res.leftover}${unit} can’t be evenly plated` : ''}
            </p>
          ) : (
            <p style={{ margin: 0, color: 'var(--sl-cream)' }}>Just the bar ({res.barWeight}{unit}).</p>
          )
        ) : (
          <p style={{ margin: 0, color: 'var(--sl-fg-muted)' }}>
            Enter a weight of at least the bar ({DEFAULT_BAR[unit]}{unit}).
          </p>
        )}
      </ResultCard>
    </div>
  );
}
