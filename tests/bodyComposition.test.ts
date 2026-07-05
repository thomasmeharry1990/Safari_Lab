import { describe, expect, it } from 'vitest';
import {
  bodyFatCategory,
  fatFreeMass,
  ffmi,
  ffmiCategory,
  navyBodyFat,
} from '@/lib/calc/bodyComposition';

describe('body composition', () => {
  it('estimates male body fat with the Navy formula', () => {
    const bf = navyBodyFat({ sex: 'male', heightCm: 178, neckCm: 38, waistCm: 85 });
    expect(bf).not.toBeNull();
    expect(bf!).toBeCloseTo(16.4, 0); // ~16%
    expect(bodyFatCategory(bf!, 'male')).toBe('Fitness');
  });

  it('estimates female body fat and needs a hip measurement', () => {
    const bf = navyBodyFat({
      sex: 'female',
      heightCm: 165,
      neckCm: 32,
      waistCm: 70,
      hipCm: 95,
    });
    expect(bf).not.toBeNull();
    expect(bf!).toBeGreaterThan(20);
    expect(bf!).toBeLessThan(30);
    // no hip -> undefined domain
    expect(
      navyBodyFat({ sex: 'female', heightCm: 165, neckCm: 32, waistCm: 70 })
    ).toBeNull();
  });

  it('returns null when the formula domain is invalid', () => {
    // waist <= neck -> log of non-positive
    expect(navyBodyFat({ sex: 'male', heightCm: 178, neckCm: 40, waistCm: 40 })).toBeNull();
    expect(navyBodyFat({ sex: 'male', heightCm: 0, neckCm: 38, waistCm: 85 })).toBeNull();
  });

  it('computes fat-free mass and FFMI', () => {
    expect(fatFreeMass(80, 16.4)).toBeCloseTo(66.9, 0);
    const comp = ffmi(80, 178, 16.4);
    expect(comp).not.toBeNull();
    expect(comp!.ffmi).toBeCloseTo(21.1, 0);
    expect(comp!.normalised).toBeGreaterThan(21);
    expect(comp!.normalised).toBeLessThan(22);
    expect(ffmiCategory(comp!.normalised)).toBe('Above average');
  });
});
