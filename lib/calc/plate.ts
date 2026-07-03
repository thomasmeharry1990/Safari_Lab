/**
 * Safari Lab - barbell plate calculator (Stage 8). Pure, unit-aware.
 * Returns the per-side plate breakdown for a target total weight.
 */
export type WeightUnit = 'kg' | 'lb';

const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const LB_PLATES = [45, 35, 25, 10, 5, 2.5];

export const DEFAULT_BAR: Record<WeightUnit, number> = { kg: 20, lb: 45 };

export interface PlateResult {
  perSide: { plate: number; count: number }[];
  leftover: number; // weight that couldn't be evenly plated (per side)
  barWeight: number;
}

export function plateBreakdown(
  total: number,
  unit: WeightUnit,
  barWeight = DEFAULT_BAR[unit]
): PlateResult | null {
  if (!Number.isFinite(total) || total < barWeight) return null;
  let perSideRemaining = (total - barWeight) / 2;
  const plates = unit === 'kg' ? KG_PLATES : LB_PLATES;
  const perSide: { plate: number; count: number }[] = [];
  for (const p of plates) {
    let count = 0;
    while (perSideRemaining >= p - 1e-9) {
      perSideRemaining -= p;
      count++;
    }
    if (count > 0) perSide.push({ plate: p, count });
  }
  return {
    perSide,
    leftover: Math.round(perSideRemaining * 100) / 100,
    barWeight,
  };
}
