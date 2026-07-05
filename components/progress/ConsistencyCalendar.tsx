import type { ConsistencyStats } from '@/lib/engine';
import styles from './consistency.module.css';

const cx = (...c: (string | undefined)[]) => c.filter(Boolean).join(' ');

function level(count: number): string | undefined {
  if (count <= 0) return styles.lvl0;
  if (count === 1) return styles.lvl1;
  if (count === 2) return styles.lvl2;
  return styles.lvl3;
}

/** GitHub-style training heatmap + streak stats (Consistency section). */
export function ConsistencyCalendar({ stats }: { stats: ConsistencyStats }) {
  const cells = stats.weeks.flat();
  return (
    <div>
      <div className={styles.streakStats}>
        <Stat label="Current streak" value={weeks(stats.currentWeekStreak)} highlight />
        <Stat label="Longest streak" value={weeks(stats.longestWeekStreak)} />
        <Stat label="This week" value={`${stats.daysThisWeek} day${stats.daysThisWeek === 1 ? '' : 's'}`} />
        <Stat label="Days trained" value={String(stats.totalDays)} />
      </div>

      <div className={styles.heatWrap}>
        <div className={styles.heat} role="img" aria-label="Training days over the last several weeks">
          {cells.map((c) => (
            <span
              key={c.date}
              className={cx(styles.cell, c.inFuture ? styles.future : level(c.count))}
              title={c.inFuture ? undefined : `${c.date}: ${c.count} session${c.count === 1 ? '' : 's'}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <span>Less</span>
        <span className={cx(styles.cell, styles.lvl0)} />
        <span className={cx(styles.cell, styles.lvl1)} />
        <span className={cx(styles.cell, styles.lvl2)} />
        <span className={cx(styles.cell, styles.lvl3)} />
        <span>More</span>
      </div>
    </div>
  );
}

function weeks(n: number): string {
  return `${n} week${n === 1 ? '' : 's'}`;
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={styles.stat}>
      <span className={highlight ? styles.statValueHi : styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
