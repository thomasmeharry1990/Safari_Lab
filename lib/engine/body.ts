/**
 * Safari Lab - body-tracking analytics (Body Tracking feature).
 * Pure, derived from local BodyEntry records. No Date/random - callers pass
 * timestamps. All computation is local; nothing leaves the browser.
 */
import type {
  BodyEntry,
  BodyLengthUnit,
  BodyMeasurementKey,
} from '@/lib/models/body';
import type { SeriesPoint } from './progress';

function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

/** Entries sorted oldest -> newest by date (stable on createdAt tiebreak). */
export function sortBodyEntries(entries: BodyEntry[]): BodyEntry[] {
  return [...entries].sort((a, b) => {
    const d = a.date.localeCompare(b.date);
    return d !== 0 ? d : (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
  });
}

/** Weight series for the chart (only entries that recorded a weight). */
export function weightSeries(entries: BodyEntry[]): SeriesPoint[] {
  return sortBodyEntries(entries)
    .filter((e) => e.weight != null)
    .map((e) => ({ label: shortDate(e.date), value: e.weight as number, at: e.date }));
}

/** Series for one measurement key (only entries that recorded it). */
export function measurementSeries(
  entries: BodyEntry[],
  key: BodyMeasurementKey
): SeriesPoint[] {
  return sortBodyEntries(entries)
    .filter((e) => e.measurements?.[key] != null)
    .map((e) => ({
      label: shortDate(e.date),
      value: e.measurements![key] as number,
      at: e.date,
    }));
}

/** Measurement keys that appear in at least one entry, in canonical order. */
export function loggedMeasurementKeys(
  entries: BodyEntry[],
  order: BodyMeasurementKey[]
): BodyMeasurementKey[] {
  return order.filter((k) => entries.some((e) => e.measurements?.[k] != null));
}

export interface WeightSummary {
  latest?: BodyEntry;
  first?: BodyEntry;
  /** latest weight minus the first recorded weight (same unit as latest). */
  deltaFromStart?: number;
  /** latest weight minus the previous recorded weight. */
  deltaFromPrevious?: number;
}

/** Latest entry + weight deltas from start and from the previous weigh-in. */
export function weightSummary(entries: BodyEntry[]): WeightSummary {
  const sorted = sortBodyEntries(entries);
  const withWeight = sorted.filter((e) => e.weight != null);
  const latest = sorted[sorted.length - 1];
  const first = withWeight[0];
  const lastWeighed = withWeight[withWeight.length - 1];
  const prevWeighed = withWeight[withWeight.length - 2];

  const summary: WeightSummary = { latest, first };
  if (lastWeighed?.weight != null && first?.weight != null && lastWeighed !== first) {
    summary.deltaFromStart = round1(lastWeighed.weight - first.weight);
  }
  if (lastWeighed?.weight != null && prevWeighed?.weight != null) {
    summary.deltaFromPrevious = round1(lastWeighed.weight - prevWeighed.weight);
  }
  return summary;
}

/** Most recent entry that recorded a weight, if any (for calculator prefill). */
export function latestWeight(
  entries: BodyEntry[]
): { weight: number; unit: BodyEntry['weightUnit'] } | undefined {
  const withWeight = sortBodyEntries(entries).filter((e) => e.weight != null);
  const last = withWeight[withWeight.length - 1];
  return last?.weight != null ? { weight: last.weight, unit: last.weightUnit } : undefined;
}

/**
 * The most recent recorded value for each measurement key (scanning newest
 * first, per key), plus the length unit of the newest entry that had any
 * measurement. Used to prefill the body-composition calculator.
 */
export function latestMeasurements(entries: BodyEntry[]): {
  values: Partial<Record<BodyMeasurementKey, number>>;
  unit?: BodyLengthUnit;
} {
  const newestFirst = sortBodyEntries(entries).reverse();
  const values: Partial<Record<BodyMeasurementKey, number>> = {};
  let unit: BodyLengthUnit | undefined;
  for (const entry of newestFirst) {
    if (!entry.measurements) continue;
    if (!unit) unit = entry.lengthUnit;
    for (const [key, value] of Object.entries(entry.measurements)) {
      const k = key as BodyMeasurementKey;
      if (values[k] == null && value != null) values[k] = value;
    }
  }
  return { values, unit };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
