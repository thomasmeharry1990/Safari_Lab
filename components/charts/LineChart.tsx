import type { SeriesPoint } from '@/lib/engine';
import styles from './charts.module.css';

/** Lightweight local SVG line chart (no chart library). Responsive via viewBox. */
export function LineChart({
  points,
  unit,
  ariaLabel,
}: {
  points: SeriesPoint[];
  unit?: string;
  ariaLabel: string;
}) {
  if (points.length < 2) {
    return (
      <p className={styles.empty}>
        Log a couple more sessions to see this trend take shape.
      </p>
    );
  }

  const W = 640;
  const H = 200;
  const padX = 40;
  const padY = 24;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const x = (i: number) => padX + (i / (points.length - 1)) * (W - padX * 2);
  const y = (v: number) => padY + (1 - (v - min) / range) * (H - padY * 2);

  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const area = `${padX},${H - padY} ${line} ${W - padX},${H - padY}`;

  return (
    <svg
      className={styles.chart}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sl-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sl-gold)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--sl-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline */}
      <line className={styles.axis} x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} />

      <polygon className={styles.areaFill} points={area} />
      <polyline className={styles.linePath} points={line} />

      {points.map((p, i) => (
        <circle key={`${p.at}-${i}`} className={styles.dot} cx={x(i)} cy={y(p.value)} r={3.5} />
      ))}

      {/* y max / min labels */}
      <text className={styles.tick} x={4} y={y(max) + 4}>
        {max}
      </text>
      <text className={styles.tick} x={4} y={y(min) + 4}>
        {min}
      </text>
      {/* x first / last labels */}
      <text className={styles.tick} x={padX} y={H - 4} textAnchor="middle">
        {points[0]!.label}
      </text>
      <text className={styles.tick} x={W - padX} y={H - 4} textAnchor="middle">
        {points[points.length - 1]!.label}
      </text>
      {unit ? (
        <text className={styles.unit} x={W - padX} y={14} textAnchor="end">
          {unit}
        </text>
      ) : null}
    </svg>
  );
}
