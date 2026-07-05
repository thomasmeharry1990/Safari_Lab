'use client';

import { useMemo, useState } from 'react';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import {
  BODY_MEASUREMENTS,
  type BodyEntry,
  type BodyLengthUnit,
  type BodyMeasurementKey,
  type BodyWeightUnit,
} from '@/lib/models/body';
import {
  loggedMeasurementKeys,
  measurementSeries,
  sortBodyEntries,
  weightSeries,
  weightSummary,
} from '@/lib/engine';
import { PageIntro } from '@/components/layout/PageIntro';
import { LineChart } from '@/components/charts/LineChart';
import { Badge, Button, Card, LinkButton, Section, Shell } from '@/components/ui';
import styles from './body.module.css';

const MEASURE_ORDER = BODY_MEASUREMENTS.map((m) => m.key);

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

type MeasureInputs = Partial<Record<BodyMeasurementKey, string>>;

export function BodyTracker() {
  const { hydrated, settings, bodyEntries, saveBodyEntry, deleteBodyEntry } =
    useLocalData();

  const defaultWeightUnit: BodyWeightUnit =
    settings.unitSystem === 'imperial' ? 'lb' : 'kg';
  const defaultLengthUnit: BodyLengthUnit =
    settings.unitSystem === 'imperial' ? 'in' : 'cm';

  const [date, setDate] = useState(todayISO);
  const [weightUnit, setWeightUnit] = useState<BodyWeightUnit>(defaultWeightUnit);
  const [lengthUnit, setLengthUnit] = useState<BodyLengthUnit>(defaultLengthUnit);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [measures, setMeasures] = useState<MeasureInputs>({});
  const [notes, setNotes] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [measureKey, setMeasureKey] = useState<BodyMeasurementKey | null>(null);

  const sorted = useMemo(() => sortBodyEntries(bodyEntries).reverse(), [bodyEntries]);
  const summary = useMemo(() => weightSummary(bodyEntries), [bodyEntries]);
  const wSeries = useMemo(() => weightSeries(bodyEntries), [bodyEntries]);
  const availableMeasures = useMemo(
    () => loggedMeasurementKeys(bodyEntries, MEASURE_ORDER),
    [bodyEntries]
  );
  const activeMeasure = measureKey ?? availableMeasures[0] ?? null;
  const mSeries = useMemo(
    () => (activeMeasure ? measurementSeries(bodyEntries, activeMeasure) : []),
    [bodyEntries, activeMeasure]
  );

  if (!hydrated) {
    return <PageIntro eyebrow="Body" title="Track your body" lede="Loading your log…" />;
  }

  const parsedWeight = weight === '' ? undefined : Number(weight);
  const parsedBodyFat = bodyFat === '' ? undefined : Number(bodyFat);
  const parsedMeasures: Partial<Record<BodyMeasurementKey, number>> = {};
  for (const { key } of BODY_MEASUREMENTS) {
    const raw = measures[key];
    if (raw != null && raw !== '' && !Number.isNaN(Number(raw))) {
      parsedMeasures[key] = Number(raw);
    }
  }
  const hasMeasures = Object.keys(parsedMeasures).length > 0;
  const canSave =
    !!date && (parsedWeight != null || parsedBodyFat != null || hasMeasures);

  function resetForm() {
    setDate(todayISO());
    setWeight('');
    setBodyFat('');
    setMeasures({});
    setNotes('');
  }

  function save() {
    if (!canSave) return;
    const existing = bodyEntries.find((e) => e.date === date);
    const entry: BodyEntry = {
      id: existing?.id ?? crypto.randomUUID(),
      date,
      weight: parsedWeight,
      weightUnit,
      bodyFatPct: parsedBodyFat,
      measurements: hasMeasures ? parsedMeasures : undefined,
      lengthUnit,
      notes: notes.trim() || undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    saveBodyEntry(entry);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    resetForm();
  }

  function loadIntoForm(e: BodyEntry) {
    setDate(e.date);
    setWeightUnit(e.weightUnit);
    setLengthUnit(e.lengthUnit);
    setWeight(e.weight != null ? String(e.weight) : '');
    setBodyFat(e.bodyFatPct != null ? String(e.bodyFatPct) : '');
    setNotes(e.notes ?? '');
    const m: MeasureInputs = {};
    for (const { key } of BODY_MEASUREMENTS) {
      const v = e.measurements?.[key];
      if (v != null) m[key] = String(v);
    }
    setMeasures(m);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const editingExisting = bodyEntries.some((e) => e.date === date);

  return (
    <>
      <PageIntro eyebrow="Body" title="Track your body">
        <p className={styles.sub}>
          Log your bodyweight and tape measurements over time. Everything stays on
          your device.
        </p>
      </PageIntro>

      <Shell>
        {summary.latest?.weight != null ? (
          <Section tight>
            <div className={styles.stats}>
              <Stat
                label="Latest weight"
                value={`${summary.latest.weight}${summary.latest.weightUnit}`}
                sub={new Date(summary.latest.date).toLocaleDateString()}
              />
              <Stat
                label="Since last"
                value={fmtDelta(summary.deltaFromPrevious, summary.latest.weightUnit)}
                tone={toneFor(summary.deltaFromPrevious)}
              />
              <Stat
                label="Since start"
                value={fmtDelta(summary.deltaFromStart, summary.latest.weightUnit)}
                tone={toneFor(summary.deltaFromStart)}
              />
              <Stat label="Entries" value={String(bodyEntries.length)} />
            </div>
          </Section>
        ) : null}

        {/* --- Log form --- */}
        <Section tight>
          <Card className={styles.form}>
            <div className={styles.formHead}>
              <h2 className={styles.h2}>
                {editingExisting ? 'Update entry' : 'New entry'}
              </h2>
              {savedFlash ? <Badge tone="gold">Saved ✓</Badge> : null}
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>Date</span>
                <input
                  type="date"
                  value={date}
                  max={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Bodyweight</span>
                <span className={styles.inline}>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.1"
                    value={weight}
                    placeholder="0"
                    onChange={(e) => setWeight(e.target.value)}
                    aria-label="Bodyweight"
                  />
                  <UnitToggle
                    value={weightUnit}
                    options={['kg', 'lb']}
                    onChange={(u) => setWeightUnit(u as BodyWeightUnit)}
                    ariaLabel="Weight unit"
                  />
                </span>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Body fat (optional)</span>
                <span className={styles.inline}>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    step="0.1"
                    value={bodyFat}
                    placeholder="—"
                    onChange={(e) => setBodyFat(e.target.value)}
                    aria-label="Body fat percentage"
                  />
                  <span className={styles.staticUnit}>%</span>
                </span>
              </label>
            </div>

            <details className={styles.measures}>
              <summary className={styles.measuresSummary}>
                Tape measurements ({lengthUnit})
              </summary>
              <div className={styles.measureUnit}>
                <span className={styles.label}>Units</span>
                <UnitToggle
                  value={lengthUnit}
                  options={['cm', 'in']}
                  onChange={(u) => setLengthUnit(u as BodyLengthUnit)}
                  ariaLabel="Measurement unit"
                />
              </div>
              <div className={styles.measureGrid}>
                {BODY_MEASUREMENTS.map((m) => (
                  <label key={m.key} className={styles.field}>
                    <span className={styles.label}>{m.label}</span>
                    <span className={styles.inline}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.1"
                        value={measures[m.key] ?? ''}
                        placeholder="—"
                        onChange={(e) =>
                          setMeasures((prev) => ({ ...prev, [m.key]: e.target.value }))
                        }
                        aria-label={`${m.label} measurement`}
                      />
                      <span className={styles.staticUnit}>{lengthUnit}</span>
                    </span>
                  </label>
                ))}
              </div>
            </details>

            <label className={styles.field}>
              <span className={styles.label}>Notes (optional)</span>
              <textarea
                className={styles.notes}
                rows={2}
                value={notes}
                maxLength={280}
                placeholder="How you're feeling, conditions, anything worth remembering…"
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <div className={styles.formActions}>
              <Button variant="primary" onClick={save} disabled={!canSave}>
                {editingExisting ? 'Update entry' : 'Save entry'}
              </Button>
              <span className={styles.formHint}>
                One entry per day — saving a date you already logged updates it.
              </span>
            </div>
          </Card>
        </Section>

        {/* --- Weight chart --- */}
        {wSeries.length >= 2 ? (
          <Section tight>
            <Card className={styles.chartCard}>
              <h2 className={styles.h2}>Weight trend</h2>
              <LineChart
                points={wSeries}
                unit={summary.latest?.weightUnit}
                ariaLabel="Bodyweight over time"
              />
            </Card>
          </Section>
        ) : null}

        {/* --- Measurement chart --- */}
        {availableMeasures.length && activeMeasure ? (
          <Section tight>
            <Card className={styles.chartCard}>
              <div className={styles.chartHead}>
                <h2 className={styles.h2}>Measurement trend</h2>
                <select
                  className={styles.select}
                  value={activeMeasure}
                  onChange={(e) => setMeasureKey(e.target.value as BodyMeasurementKey)}
                  aria-label="Choose measurement"
                >
                  {availableMeasures.map((k) => (
                    <option key={k} value={k}>
                      {BODY_MEASUREMENTS.find((m) => m.key === k)?.label ?? k}
                    </option>
                  ))}
                </select>
              </div>
              {mSeries.length >= 2 ? (
                <LineChart
                  points={mSeries}
                  unit={sorted[0]?.lengthUnit}
                  ariaLabel={`${activeMeasure} measurement over time`}
                />
              ) : (
                <p className={styles.muted}>
                  Log this measurement on another day to see its trend.
                </p>
              )}
            </Card>
          </Section>
        ) : null}

        {/* --- History --- */}
        <Section tight>
          <h2 className={styles.h2}>History</h2>
          {sorted.length === 0 ? (
            <p className={styles.muted}>
              No entries yet. Log your first weigh-in above to start your trend.
            </p>
          ) : (
            <ul className={styles.history}>
              {sorted.map((e) => (
                <li key={e.id} className={styles.entry}>
                  <div className={styles.entryMain}>
                    <span className={styles.entryDate}>
                      {new Date(e.date).toLocaleDateString()}
                    </span>
                    <span className={styles.entryVals}>
                      {e.weight != null ? (
                        <span className={styles.entryWeight}>
                          {e.weight}
                          {e.weightUnit}
                        </span>
                      ) : null}
                      {e.bodyFatPct != null ? (
                        <span className={styles.entryTag}>{e.bodyFatPct}% bf</span>
                      ) : null}
                      {e.measurements
                        ? Object.entries(e.measurements).map(([k, v]) => (
                            <span key={k} className={styles.entryTag}>
                              {BODY_MEASUREMENTS.find((m) => m.key === k)?.label ?? k}{' '}
                              {v}
                              {e.lengthUnit}
                            </span>
                          ))
                        : null}
                    </span>
                    {e.notes ? <span className={styles.entryNote}>{e.notes}</span> : null}
                  </div>
                  <div className={styles.entryActions}>
                    <button
                      type="button"
                      className={styles.entryBtn}
                      onClick={() => loadIntoForm(e)}
                    >
                      Edit
                    </button>
                    {confirmDeleteId === e.id ? (
                      <>
                        <button
                          type="button"
                          className={styles.entryDanger}
                          onClick={() => {
                            deleteBodyEntry(e.id);
                            setConfirmDeleteId(null);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className={styles.entryBtn}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className={styles.entryBtn}
                        onClick={() => setConfirmDeleteId(e.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section tight>
          <Card className={styles.tie}>
            <div>
              <h3 className={styles.h3}>Turn your numbers into insight</h3>
              <p className={styles.muted}>
                Your latest weight and measurements feed straight into the
                calculators — one tap prefills them.
              </p>
            </div>
            <div className={styles.tieActions}>
              <LinkButton href="/nutrition/body-fat" variant="secondary">
                Body-fat &amp; FFMI
              </LinkButton>
              <LinkButton href="/nutrition/tdee-calculator" variant="ghost">
                TDEE calculator
              </LinkButton>
            </div>
          </Card>
        </Section>
      </Shell>
    </>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'up' | 'down';
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span
        className={
          tone === 'up' ? styles.statUp : tone === 'down' ? styles.statDown : styles.statValue
        }
      >
        {value}
      </span>
      {sub ? <span className={styles.statSub}>{sub}</span> : null}
    </div>
  );
}

function UnitToggle({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  return (
    <span className={styles.unitToggle} role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={o === value ? styles.unitOn : styles.unitOff}
          onClick={() => onChange(o)}
          aria-pressed={o === value}
        >
          {o}
        </button>
      ))}
    </span>
  );
}

function fmtDelta(delta: number | undefined, unit: string): string {
  if (delta == null) return '—';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta}${unit}`;
}

function toneFor(delta: number | undefined): 'up' | 'down' | undefined {
  if (delta == null || delta === 0) return undefined;
  return delta > 0 ? 'up' : 'down';
}
