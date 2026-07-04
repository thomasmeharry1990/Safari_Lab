import type { CompletedProgram } from '@/lib/models/completed-program';
import { Badge, Card } from '@/components/ui';
import styles from './blockReport.module.css';

/** Celebratory summary of a finished program block (Package 8). */
export function BlockReport({
  program,
  heading = 'Expedition complete',
}: {
  program: CompletedProgram;
  heading?: string;
}) {
  const started = new Date(program.lockedAt).toLocaleDateString();
  const finished = new Date(program.completedAt).toLocaleDateString();

  return (
    <Card className={styles.report}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>🏔 {heading}</span>
        <h3 className={styles.name}>{program.name}</h3>
        <div className={styles.meta}>
          <Badge tone="gold">{program.resolvedSplit}</Badge>
          <Badge tone="olive">
            {program.weeks} weeks · {program.daysPerWeek}/week
          </Badge>
          <span className={styles.dates}>
            {started} – {finished}
          </span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{program.sessionsCompleted}</span>
          <span className={styles.statLabel}>Sessions</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{program.totalSets}</span>
          <span className={styles.statLabel}>Sets logged</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {program.totalVolume.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Volume ({program.unit})</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{program.topPRs.length}</span>
          <span className={styles.statLabel}>Top lifts</span>
        </div>
      </div>

      {program.topPRs.length ? (
        <div className={styles.prs}>
          <h4 className={styles.prTitle}>Best lifts this block</h4>
          <ul className={styles.prList}>
            {program.topPRs.map((pr) => (
              <li key={pr.exerciseId}>
                <span className={styles.prName}>{pr.name}</span>
                <span className={styles.prVal}>
                  {pr.weight}
                  {pr.unit} × {pr.reps}
                  <span className={styles.prE1rm}>
                    {' '}
                    · e1RM {pr.e1rm}
                    {pr.unit}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={styles.note}>
          Log weighted sets next block to start tracking your best lifts.
        </p>
      )}
    </Card>
  );
}
