/**
 * Safari Lab - nutrition calculators (premium P4). Educational only, local.
 * BMR: Mifflin-St Jeor. All estimates - not medical or dietary advice.
 */
export type Sex = 'male' | 'female';
export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export const ACTIVITY: Record<ActivityLevel, { label: string; factor: number }> = {
  sedentary: { label: 'Sedentary — little or no exercise', factor: 1.2 },
  light: { label: 'Light — 1–3 days/week', factor: 1.375 },
  moderate: { label: 'Moderate — 3–5 days/week', factor: 1.55 },
  active: { label: 'Active — 6–7 days/week', factor: 1.725 },
  very_active: { label: 'Very active — hard training / physical job', factor: 1.9 },
};

export function mifflinBmr(input: {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
}): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  return Math.round(input.sex === 'male' ? base + 5 : base - 161);
}

export function tdee(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY[activity].factor);
}

export function proteinTarget(weightKg: number): { low: number; high: number } {
  return { low: Math.round(weightKg * 1.6), high: Math.round(weightKg * 2.2) };
}

export function macroSplit(
  calories: number,
  split: { proteinPct: number; carbPct: number; fatPct: number }
): { proteinG: number; carbG: number; fatG: number } {
  return {
    proteinG: Math.round((calories * split.proteinPct) / 100 / 4),
    carbG: Math.round((calories * split.carbPct) / 100 / 4),
    fatG: Math.round((calories * split.fatPct) / 100 / 9),
  };
}

export const lbToKg = (lb: number) => lb * 0.453592;
export const inToCm = (inches: number) => inches * 2.54;
