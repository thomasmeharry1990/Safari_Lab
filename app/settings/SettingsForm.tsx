'use client';

import { useLocalData } from '@/lib/state/LocalDataProvider';
import type { UserSettings } from '@/lib/models/save-file';
import { Panel } from '@/components/ui';
import styles from './settings.module.css';

const REST_OPTIONS = [60, 90, 120, 150, 180];

export function SettingsForm() {
  const { hydrated, settings, updateSettings } = useLocalData();

  return (
    <div>
      <p className={styles.autosave}>
        {hydrated ? 'Changes save automatically to this device.' : 'Loading your settings…'}
      </p>

      <Panel className={styles.group}>
        <Row label="Units" hint="Used across calculators and gym mode.">
          <Segmented
            options={[
              { value: 'metric', label: 'Metric (kg)' },
              { value: 'imperial', label: 'Imperial (lb)' },
            ]}
            value={settings.unitSystem}
            onChange={(v) => updateSettings({ unitSystem: v as UserSettings['unitSystem'] })}
          />
        </Row>

        <Row label="Default rest timer" hint="Starting rest between sets.">
          <Segmented
            options={REST_OPTIONS.map((s) => ({ value: String(s), label: `${s}s` }))}
            value={String(settings.restTimerDefaultSeconds)}
            onChange={(v) => updateSettings({ restTimerDefaultSeconds: Number(v) })}
          />
        </Row>
      </Panel>

      <Panel className={styles.group}>
        <Toggle
          label="Haptics"
          hint="Vibrate on timers and set completion where supported."
          checked={settings.hapticsEnabled}
          onChange={(v) => updateSettings({ hapticsEnabled: v })}
        />
        <Toggle
          label="Sound"
          hint="Play a cue when the rest timer ends."
          checked={settings.soundEnabled}
          onChange={(v) => updateSettings({ soundEnabled: v })}
        />
        <Toggle
          label="Backup reminders"
          hint="Gentle nudges to export a save file — never during a workout."
          checked={settings.backupRemindersEnabled}
          onChange={(v) => updateSettings({ backupRemindersEnabled: v })}
        />
      </Panel>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <span className={styles.rowLabel}>{label}</span>
        {hint ? <span className={styles.rowHint}>{hint}</span> : null}
      </div>
      <div className={styles.rowControl}>{children}</div>
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.segmented} role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={o.value === value ? styles.segOn : styles.seg}
          onClick={() => onChange(o.value)}
          aria-pressed={o.value === value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <span className={styles.rowLabel}>{label}</span>
        {hint ? <span className={styles.rowHint}>{hint}</span> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={checked ? styles.switchOn : styles.switch}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.knob} />
      </button>
    </div>
  );
}
