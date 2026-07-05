/**
 * Safari Lab - body-composition estimates (Body Composition tool).
 * US Navy circumference method for body fat + Fat-Free Mass Index (FFMI).
 * Educational estimates only - not medical or clinical measurements.
 * All maths in metric (cm, kg, m); callers convert imperial input first.
 */
import type { Sex } from './nutrition';

export interface NavyInput {
  sex: Sex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  /** Required for females (hip circumference). Ignored for males. */
  hipCm?: number;
}

/**
 * US Navy body-fat percentage (metric formula). Returns null when the inputs
 * fall outside the domain of the formula (e.g. waist <= neck), where the log
 * terms are undefined.
 */
export function navyBodyFat(input: NavyInput): number | null {
  const { sex, heightCm, neckCm, waistCm, hipCm } = input;
  if (heightCm <= 0 || neckCm <= 0 || waistCm <= 0) return null;

  if (sex === 'male') {
    const inner = waistCm - neckCm;
    if (inner <= 0) return null;
    const bf =
      495 /
        (1.0324 - 0.19077 * Math.log10(inner) + 0.15456 * Math.log10(heightCm)) -
      450;
    return clampBf(bf);
  }

  if (hipCm == null || hipCm <= 0) return null;
  const inner = waistCm + hipCm - neckCm;
  if (inner <= 0) return null;
  const bf =
    495 /
      (1.29579 - 0.35004 * Math.log10(inner) + 0.221 * Math.log10(heightCm)) -
    450;
  return clampBf(bf);
}

function clampBf(bf: number): number | null {
  if (!Number.isFinite(bf)) return null;
  return round1(Math.min(75, Math.max(2, bf)));
}

/** Fat-free (lean) mass in kg from bodyweight and body-fat %. */
export function fatFreeMass(weightKg: number, bodyFatPct: number): number {
  return round1(weightKg * (1 - bodyFatPct / 100));
}

/** Fat-Free Mass Index and height-normalised FFMI (to a 1.8 m reference). */
export function ffmi(
  weightKg: number,
  heightCm: number,
  bodyFatPct: number
): { ffmi: number; normalised: number; fatFreeMassKg: number } | null {
  if (weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const ffm = weightKg * (1 - bodyFatPct / 100);
  const raw = ffm / (heightM * heightM);
  const normalised = raw + 6.1 * (1.8 - heightM);
  return {
    ffmi: round1(raw),
    normalised: round1(normalised),
    fatFreeMassKg: round1(ffm),
  };
}

/** Rough educational body-fat category by sex (ACE-style bands). */
export function bodyFatCategory(bodyFatPct: number, sex: Sex): string {
  const bands: [number, string][] =
    sex === 'male'
      ? [
          [6, 'Essential fat'],
          [14, 'Athletic'],
          [18, 'Fitness'],
          [25, 'Average'],
          [Infinity, 'Above average'],
        ]
      : [
          [14, 'Essential fat'],
          [21, 'Athletic'],
          [25, 'Fitness'],
          [32, 'Average'],
          [Infinity, 'Above average'],
        ];
  return bands.find(([max]) => bodyFatPct <= max)?.[1] ?? 'Average';
}

/** Rough educational FFMI category (natural ceiling ~25). */
export function ffmiCategory(normalisedFfmi: number): string {
  const bands: [number, string][] = [
    [18, 'Below average'],
    [20, 'Average'],
    [22, 'Above average'],
    [23, 'Excellent'],
    [25, 'Superior'],
    [Infinity, 'Exceptional (rare naturally)'],
  ];
  return bands.find(([max]) => normalisedFfmi <= max)?.[1] ?? 'Average';
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
