import { describe, expect, it } from 'vitest';
import {
  latestWeight,
  loggedMeasurementKeys,
  measurementSeries,
  sortBodyEntries,
  weightSeries,
  weightSummary,
} from '@/lib/engine';
import type { BodyEntry } from '@/lib/models/body';

function entry(date: string, weight?: number, extra: Partial<BodyEntry> = {}): BodyEntry {
  return {
    id: `e-${date}`,
    date,
    weight,
    weightUnit: 'kg',
    lengthUnit: 'cm',
    createdAt: `${date}T00:00:00.000Z`,
    ...extra,
  };
}

describe('body-tracking analytics', () => {
  const entries = [
    entry('2026-03-01', 90),
    entry('2026-02-01', 92),
    entry('2026-04-01', 89, { measurements: { waist: 84 } }),
    entry('2026-03-15', undefined, { measurements: { waist: 85 } }),
  ];

  it('sorts entries oldest to newest by date', () => {
    const dates = sortBodyEntries(entries).map((e) => e.date);
    expect(dates).toEqual(['2026-02-01', '2026-03-01', '2026-03-15', '2026-04-01']);
  });

  it('builds a weight series in date order, skipping entries with no weight', () => {
    const s = weightSeries(entries);
    expect(s.map((p) => p.value)).toEqual([92, 90, 89]); // 03-15 had no weight
  });

  it('computes weight deltas from start and from the previous weigh-in', () => {
    const sum = weightSummary(entries);
    expect(sum.deltaFromStart).toBe(-3); // 89 - 92
    expect(sum.deltaFromPrevious).toBe(-1); // 89 - 90
    expect(sum.latest?.date).toBe('2026-04-01');
  });

  it('returns the most recent recorded weight', () => {
    expect(latestWeight(entries)).toEqual({ weight: 89, unit: 'kg' });
    expect(latestWeight([])).toBeUndefined();
  });

  it('lists only measurement keys that appear, and series in date order', () => {
    const keys = loggedMeasurementKeys(entries, ['neck', 'waist', 'chest']);
    expect(keys).toEqual(['waist']);
    const waist = measurementSeries(entries, 'waist');
    expect(waist.map((p) => p.value)).toEqual([85, 84]); // 03-15 then 04-01
  });
});
