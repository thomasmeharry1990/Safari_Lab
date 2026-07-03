import Link from 'next/link';
import type { DraftProgram } from '@/lib/engine/types';
import { muscleLabel } from '@/lib/data/exercises';
import { Badge, Card } from '@/components/ui';
import styles from './draftProgram.module.css';

export function DraftProgramView({ program }: { program: DraftProgram }) {
  const maxVol = Math.max(1, ...program.weeklyVolume.map((v) => v.sets));
  return (
    <div>
      <header className={styles.head}>
        <div>
          <h2 className={styles.name}>{program.name}</h2>
          <div className={styles.metaRow}>
            <Badge tone="gold">{program.resolvedSplit}</Badge>
            <Badge tone="olive">{program.daysPerWeek} days/week</Badge>
            <Badge tone="olive">{program.weeks} weeks</Badge>
          </div>
        </div>
      </header>

      <ul className={styles.summary}>
        {program.summary.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <section className={styles.volume} aria-label="Weekly volume by muscle">
        <h3 className={styles.h3}>Weekly volume</h3>
        <div className={styles.volList}>
          {program.weeklyVolume.map((v) => (
            <div key={v.muscle} className={styles.volRow}>
              <span className={styles.volLabel}>
                {muscleLabel(v.muscle)}
                {v.priority ? <span className={styles.star}> ★</span> : null}
              </span>
              <span className={styles.volBar}>
                <span
                  className={v.priority ? styles.volFillPri : styles.volFill}
                  style={{ width: `${(v.sets / maxVol) * 100}%` }}
                />
              </span>
              <span className={styles.volSets}>{v.sets}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.week} aria-label="Weekly sessions">
        <h3 className={styles.h3}>Your training week</h3>
        <div className={styles.sessions}>
          {program.sessions.map((s) => (
            <Card key={s.id} className={styles.session}>
              <div className={styles.sessionHead}>
                <div>
                  <span className={styles.day}>Day {s.dayIndex + 1}</span>
                  <h4 className={styles.sessionTitle}>{s.title}</h4>
                </div>
                <Badge tone="olive">~{s.estimatedMinutes} min</Badge>
              </div>
              <ol className={styles.exList}>
                {s.exercises.map((ex, i) => (
                  <li key={`${ex.exerciseId}-${i}`} className={styles.exRow}>
                    <span className={styles.exOrder}>{i + 1}</span>
                    <span className={styles.exMain}>
                      <Link href={`/exercises/${ex.slug}`} className={styles.exName}>
                        {ex.name}
                      </Link>
                      <span className={styles.exTags}>
                        {ex.isPriority ? <span className={styles.priTag}>Priority ★</span> : null}
                        {ex.isFinisher ? <span className={styles.finTag}>Finisher</span> : null}
                        <span className={styles.exMuscle}>{muscleLabel(ex.muscle)}</span>
                      </span>
                    </span>
                    <span className={styles.exDose}>
                      {ex.isFinisher
                        ? `${ex.repRange[0]}–${ex.repRange[1]} min`
                        : `${ex.sets} × ${ex.repRange[0]}–${ex.repRange[1]}`}
                      <span className={styles.exRest}>{ex.restSeconds}s rest</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      <p className={styles.note}>
        This is a draft preview. Reviewing, editing and locking your program (so it
        saves to your device and powers gym mode) arrives in an upcoming build stage.
      </p>
    </div>
  );
}
