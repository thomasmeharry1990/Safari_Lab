import { describe, expect, it } from 'vitest';
import { plateBreakdown } from '@/lib/calc/plate';

describe('plateBreakdown', () => {
  it('returns null below bar weight', () => {
    expect(plateBreakdown(15, 'kg')).toBeNull();
    expect(plateBreakdown(40, 'lb')).toBeNull();
  });

  it('plates 100kg on a 20kg bar as 25+15 per side', () => {
    const r = plateBreakdown(100, 'kg')!;
    expect(r.barWeight).toBe(20);
    expect(r.perSide).toEqual([
      { plate: 25, count: 1 },
      { plate: 15, count: 1 },
    ]);
    expect(r.leftover).toBe(0);
  });

  it('just the bar has no plates', () => {
    const r = plateBreakdown(20, 'kg')!;
    expect(r.perSide).toEqual([]);
  });

  it('reports leftover that cannot be plated', () => {
    const r = plateBreakdown(23, 'kg')!; // 1.5/side, smallest kg plate is 1.25
    expect(r.perSide).toEqual([{ plate: 1.25, count: 1 }]);
    expect(r.leftover).toBeCloseTo(0.25, 5);
  });

  it('uses a 45lb bar for imperial', () => {
    const r = plateBreakdown(135, 'lb')!;
    expect(r.barWeight).toBe(45);
    expect(r.perSide).toEqual([{ plate: 45, count: 1 }]);
  });
});
