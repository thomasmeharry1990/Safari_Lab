import Link from 'next/link';
import type { ExerciseDefinition } from '@/lib/models/exercise';
import { formatDose, muscleLabel } from '@/lib/data/exercises/factory';
import { Badge } from '@/components/ui';
import styles from './exerciseCard.module.css';

const LEVEL_TONE = {
  beginner: 'olive',
  intermediate: 'gold',
  advanced: 'copper',
} as const;

/** Library result / alternative card. Links to the exercise detail page. */
export function ExerciseCard({ ex }: { ex: ExerciseDefinition }) {
  const dose = formatDose(ex);
  return (
    <Link href={`/exercises/${ex.slug}`} className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.name}>{ex.name}</h3>
        <Badge tone={LEVEL_TONE[ex.difficulty]}>{ex.difficulty}</Badge>
      </div>
      <div className={styles.tags}>
        <span className={styles.muscle}>{muscleLabel(ex.primaryMuscle)}</span>
        {ex.compound ? (
          <span className={styles.tag}>Compound</span>
        ) : (
          <span className={styles.tag}>Isolation</span>
        )}
      </div>
      <p className={styles.meta}>
        {dose ?? 'Conditioning'} &middot;{' '}
        <span className={styles.equipment}>{ex.equipment.join(', ')}</span>
      </p>
    </Link>
  );
}
