/**
 * Safari Lab - body-tracking schema (Body Tracking feature).
 *
 * A BodyEntry is one dated snapshot of bodyweight + optional tape measurements.
 * Local-first: stored in the `bodyEntries` IndexedDB store and carried in .slfit
 * exports. Values are stored in the unit they were entered in (like SetLog), so
 * display is always faithful to what the athlete typed.
 */
export type BodyWeightUnit = 'kg' | 'lb';
export type BodyLengthUnit = 'cm' | 'in';

export type BodyMeasurementKey =
  | 'neck'
  | 'shoulders'
  | 'chest'
  | 'waist'
  | 'hips'
  | 'arm'
  | 'thigh'
  | 'calf';

export const BODY_MEASUREMENTS: { key: BodyMeasurementKey; label: string }[] = [
  { key: 'neck', label: 'Neck' },
  { key: 'shoulders', label: 'Shoulders' },
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'arm', label: 'Arm' },
  { key: 'thigh', label: 'Thigh' },
  { key: 'calf', label: 'Calf' },
];

export interface BodyEntry {
  id: string;
  /** Calendar day this snapshot is for (YYYY-MM-DD). One entry per day. */
  date: string;
  weight?: number;
  weightUnit: BodyWeightUnit;
  /** Optional body-fat percentage (0–100). */
  bodyFatPct?: number;
  measurements?: Partial<Record<BodyMeasurementKey, number>>;
  lengthUnit: BodyLengthUnit;
  notes?: string;
  createdAt: string;
}

/** True when an entry carries no data worth keeping. */
export function isEmptyBodyEntry(e: BodyEntry): boolean {
  const hasMeasurement =
    e.measurements != null &&
    Object.values(e.measurements).some((v) => v != null && !Number.isNaN(v));
  return (
    e.weight == null &&
    e.bodyFatPct == null &&
    !hasMeasurement &&
    !(e.notes && e.notes.trim())
  );
}
