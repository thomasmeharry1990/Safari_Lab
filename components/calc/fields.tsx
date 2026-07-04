'use client';

import type { ReactNode } from 'react';
import styles from './calc.module.css';

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  placeholder,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
  min?: number;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.inputWrap}>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
      </span>
    </label>
  );
}

export function SegField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.seg} role="group">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={o.value === value ? styles.segOn : styles.segBtn}
            onClick={() => onChange(o.value)}
            aria-pressed={o.value === value}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ResultCard({ children }: { children: ReactNode }) {
  return <div className={styles.result}>{children}</div>;
}

export function BigResult({ value, unit, caption }: { value: string; unit?: string; caption?: string }) {
  return (
    <div className={styles.bigResult}>
      <span className={styles.bigValue}>
        {value}
        {unit ? <span className={styles.bigUnit}> {unit}</span> : null}
      </span>
      {caption ? <span className={styles.bigCaption}>{caption}</span> : null}
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <p className={styles.disclaimer}>{children}</p>;
}
