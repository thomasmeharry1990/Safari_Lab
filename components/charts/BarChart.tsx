import styles from './charts.module.css';

/** Horizontal bar chart for categorical data (e.g. sets per muscle). */
export function BarChart({
  data,
  suffix,
}: {
  data: { label: string; value: number }[];
  suffix?: string;
}) {
  if (data.length === 0) {
    return <p className={styles.empty}>No data yet.</p>;
  }
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={styles.bars}>
      {data.map((d) => (
        <div key={d.label} className={styles.barRow}>
          <span className={styles.barLabel}>{d.label}</span>
          <span className={styles.barTrack}>
            <span className={styles.barFill} style={{ width: `${(d.value / max) * 100}%` }} />
          </span>
          <span className={styles.barValue}>
            {d.value}
            {suffix ? ` ${suffix}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
