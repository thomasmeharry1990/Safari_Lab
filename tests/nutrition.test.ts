import { describe, expect, it } from 'vitest';
import { macroSplit, mifflinBmr, proteinTarget, tdee } from '@/lib/calc/nutrition';

describe('nutrition calculators', () => {
  it('Mifflin-St Jeor BMR (male)', () => {
    // 10*80 + 6.25*178 - 5*30 + 5 = 1767.5 -> 1768
    expect(mifflinBmr({ sex: 'male', age: 30, weightKg: 80, heightCm: 178 })).toBe(1768);
  });

  it('Mifflin-St Jeor BMR (female uses -161)', () => {
    const m = mifflinBmr({ sex: 'male', age: 30, weightKg: 70, heightCm: 165 });
    const f = mifflinBmr({ sex: 'female', age: 30, weightKg: 70, heightCm: 165 });
    expect(m - f).toBe(166);
  });

  it('TDEE applies the activity factor', () => {
    expect(tdee(1768, 'moderate')).toBe(2740); // 1768 * 1.55
  });

  it('protein target is 1.6–2.2 g/kg', () => {
    expect(proteinTarget(80)).toEqual({ low: 128, high: 176 });
  });

  it('macro split totals back to the calories (approx)', () => {
    const m = macroSplit(2400, { proteinPct: 40, carbPct: 40, fatPct: 20 });
    const kcal = m.proteinG * 4 + m.carbG * 4 + m.fatG * 9;
    expect(Math.abs(kcal - 2400)).toBeLessThan(15);
  });
});
