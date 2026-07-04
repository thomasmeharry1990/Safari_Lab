/**
 * Safari Lab - one-rep-max estimator (premium P4). Average of Epley + Brzycki.
 * Estimates only - always train with a spotter and conservative loads.
 */
export const epley = (w: number, r: number) => w * (1 + r / 30);
export const brzycki = (w: number, r: number) => (w * 36) / (37 - r);

export function estimate1RM(weight: number, reps: number): number {
  if (!Number.isFinite(weight) || !Number.isFinite(reps) || weight <= 0 || reps < 1) {
    return 0;
  }
  if (reps === 1) return Math.round(weight);
  return Math.round((epley(weight, reps) + brzycki(weight, reps)) / 2);
}

const PERCENTS: { pct: number; reps: number }[] = [
  { pct: 100, reps: 1 },
  { pct: 95, reps: 2 },
  { pct: 90, reps: 4 },
  { pct: 85, reps: 6 },
  { pct: 80, reps: 8 },
  { pct: 75, reps: 10 },
  { pct: 70, reps: 12 },
  { pct: 65, reps: 15 },
  { pct: 60, reps: 20 },
];

export function percentTable(oneRm: number): { pct: number; weight: number; reps: number }[] {
  return PERCENTS.map((p) => ({
    pct: p.pct,
    reps: p.reps,
    weight: Math.round((oneRm * p.pct) / 100),
  }));
}
