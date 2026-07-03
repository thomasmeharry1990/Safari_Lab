import Link from 'next/link';
import type { DraftSession } from '@/lib/engine/types';
import { muscleLabel } from '@/lib/data/exercises';
import { Badge, Card } from '@/components/ui';
import styles from './sessionPlan.module.css';

/** Read-only presentation of a single planned session. */
export function SessionPlan({
  session,
  label,
}: {
  session: DraftSession;
  label?: string;
}) {
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
            <span className={styles.order}>{i + 1}</span>
            <span className={styles.main}>
              <Link href={`/exercises/${ex.slug}`} className={styles.name}>
                {ex.name}
              </Link>
              <span className={styles.tags}>
                {ex.isPriority ? <span className={styles.pri}>Priority ★</span> : null}
                {ex.isFinisher ? <span className={styles.fin}>Finisher</span> : null}
                <span className={styles.muscle}>{muscleLabel(ex.muscle)}</span>
              </span>
            </span>
            <span className={styles.dose}>
              {ex.isFinisher
                ? `${ex.repRange[0]}–${ex.repRange[1]} min`
                : `${ex.sets} × ${ex.repRange[0]}–${ex.repRange[1]}`}
              <span className={styles.rest}>{ex.restSeconds}s rest</span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
