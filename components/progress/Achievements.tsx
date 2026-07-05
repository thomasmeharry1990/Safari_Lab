import type { Achievement } from '@/lib/engine';
import styles from './consistency.module.css';

/** Motivational badge grid derived from training history. */
export function Achievements({ items }: { items: Achievement[] }) {
  const earnedCount = items.filter((a) => a.earned).length;
  return (
    <div>
      <p className={styles.achSummary}>
        {earnedCount} of {items.length} unlocked
      </p>
      <div className={styles.achGrid}>
        {items.map((a) => {
          const pct = Math.min(100, Math.round((a.progress.current / a.progress.target) * 100));
          return (
            <div key={a.id} className={a.earned ? styles.badgeOn : styles.badge}>
              <span className={styles.badgeIcon} aria-hidden>
                {a.icon}
              </span>
              <span className={styles.badgeTitle}>{a.title}</span>
              <span className={styles.badgeDesc}>{a.description}</span>
              {a.earned ? (
                <span className={styles.badgeEarned}>Unlocked ✓</span>
              ) : (
                <span className={styles.badgeBar} aria-hidden>
                  <span className={styles.badgeBarFill} style={{ width: `${pct}%` }} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
