'use client';

import type { DraftSession } from '@/lib/engine/types';
import { muscleLabel } from '@/lib/data/exercises';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { Badge, Card } from '@/components/ui';
import styles from './sessionEditor.module.css';

/** Editable session: reorder exercises with up/down controls (Package 8 follow-up). */
export function SessionEditor({
  session,
  dayIndex,
  label,
}: {
  session: DraftSession;
  dayIndex: number;
  label?: string;
}) {
  const { moveExerciseInSession } = useLocalData();
  const last = session.exercises.length - 1;

  return (
    <Card className={styles.session}>
      <div className={styles.head}>
        <div>
          <span className={styles.day}>{label ?? `Day ${session.dayIndex + 1}`}</span>
          <h3 className={styles.title}>{session.title}</h3>
        </div>
        <Badge tone="olive">~{session.estimatedMinutes} min</Badge>
      </div>
      <ol className={styles.list}>
        {session.exercises.map((ex, i) => (
          <li key={`${ex.exerciseId}-${i}`} className={styles.row}>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.moveBtn}
                onClick={() => moveExerciseInSession(dayIndex, i, -1)}
                disabled={i === 0}
                aria-label={`Move ${ex.name} up`}
              >
                <span aria-hidden>▲</span>
              </button>
              <button
                type="button"
                className={styles.moveBtn}
                onClick={() => moveExerciseInSession(dayIndex, i, 1)}
                disabled={i === last}
                aria-label={`Move ${ex.name} down`}
              >
                <span aria-hidden>▼</span>
              </button>
            </div>
            <span className={styles.order}>{i + 1}</span>
            <div className={styles.main}>
              <span className={styles.name}>{ex.name}</span>
              <span className={styles.tags}>
                {ex.isPriority ? <span className={styles.pri}>Priority ★</span> : null}
                {ex.isFinisher ? <span className={styles.fin}>Finisher</span> : null}
                <span className={styles.muscle}>{muscleLabel(ex.muscle)}</span>
              </span>
            </div>
            <span className={styles.dose}>
              {ex.isFinisher
                ? `${ex.repRange[0]}–${ex.repRange[1]} min`
                : `${ex.sets} × ${ex.repRange[0]}–${ex.repRange[1]}`}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
