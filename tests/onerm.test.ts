import { describe, expect, it } from 'vitest';
import { estimate1RM, percentTable } from '@/lib/calc/onerm';

describe('one-rep-max estimator', () => {
  it('returns the weight itself at 1 rep', () => {
    expect(estimate1RM(120, 1)).toBe(120);
  });

  it('averages Epley + Brzycki for 100kg x 5', () => {
    // epley 116.67, brzycki 112.5 -> ~114.6 -> 115
    expect(estimate1RM(100, 5)).toBe(115);
  });

  it('returns 0 for invalid input', () => {
    expect(estimate1RM(0, 5)).toBe(0);
    expect(estimate1RM(100, 0)).toBe(0);
  });

  it('percent table starts at 100% = the 1RM and has 9 rows', () => {
    const t = percentTable(150);
    expect(t).toHaveLength(9);
    expect(t[0]).toEqual({ pct: 100, weight: 150, reps: 1 });
    expect(t[t.length - 1]!.pct).toBe(60);
  });
});
