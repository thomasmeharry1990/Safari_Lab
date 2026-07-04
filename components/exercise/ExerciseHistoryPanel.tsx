'use client';

import { useMemo } from 'react';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { est1RM } from '@/lib/engine';
import styles from './exerciseHistoryPanel.module.css';

interface TopSet {
  weight: number;
  reps: number;
  unit: 'kg' | 'lb';
  rpe?: number;
  at: string;
  e1rm: number;
}

/**
 * "Your history" for a single exercise, read from local session history.
 * Client-only island on the (static) exercise detail page.
 */
export function ExerciseHistoryPanel({ exerciseId }: { exerciseId: string }) {
  const { hydrated, sessionHistory } = useLocalData();

  const { recent, best } = useMemo(() => {
    const perSession: TopSet[] = [];
    let bestSet: TopSet | undefined;

    const completed = sessionHistory
      .filter((s) => s.status === 'complete' && s.completedAt)
      .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));

    for (const session of completed) {
      let top: TopSet | undefined;
      for (const set of session.setLogs) {
        if (set.performedExerciseId !== exerciseId) continue;
        if (set.weight == null || set.reps == null) continue;
        const e1rm = est1RM(set.weight, set.reps);
        const candidate: TopSet = {
          weight: set.weight,
          reps: set.reps,
          unit: set.unit,
          rpe: set.rpe,
          at: session.completedAt!,
          e1rm,
        };
        if (!top || e1rm > top.e1rm) top = candidate;
        if (!bestSet || e1rm > bestSet.e1rm) bestSet = candidate;
      }
      if (top) perSession.push(top);
    }

    return { recent: perSession.slice(0, 5), best: bestSet };
  }, [sessionHistory, exerciseId]);

  if (!hydrated) return null;

  if (recent.length === 0) {
    return (
      <div className={styles.panel}>
        <h2 className={styles.h2}>Your history</h2>
        <p className={styles.empty}>
          No sessions logged yet. Log this movement in a session and your last
          time and best set appear here to guide your next lift.
        </p>
      </div>
    );
  }

  const last = recent[0]!;
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();

  return (
    <div className={styles.panel}>
      <h2 className={styles.h2}>Your history</h2>
      <div className={styles.highlights}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Last time</span>
          <span className={styles.cardValue}>
            {last.weight}
            {last.unit} × {last.reps}
            {last.rpe != null ? <span className={styles.rpe}> @{last.rpe}</span> : null}
          </span>
          <span className={styles.cardMeta}>{fmtDate(last.at)}</span>
        </div>
        {best ? (
          <div className={styles.card}>
            <span className={styles.cardLabel}>Best (est. 1RM)</span>
            <span className={styles.cardValue}>
              {best.weight}
              {best.unit} × {best.reps}
            </span>
            <span className={styles.cardMeta}>≈ {Math.round(best.e1rm)}{best.unit} 1RM</span>
          </div>
        ) : null}
      </div>

      {recent.length > 1 ? (
        <>
          <h3 className={styles.h3}>Recent sessions</h3>
          <ul className={styles.list}>
            {recent.map((s) => (
              <li key={s.at} className={styles.row}>
                <span className={styles.rowDate}>{fmtDate(s.at)}</span>
                <span className={styles.rowSet}>
                  {s.weight}
                  {s.unit} × {s.reps}
                  {s.rpe != null ? <span className={styles.rpe}> @{s.rpe}</span> : null}
                </span>
                <span className={styles.rowE1rm}>≈ {Math.round(s.e1rm)}{s.unit}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
