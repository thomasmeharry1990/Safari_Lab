'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DraftProgram, GeneratorInput } from '@/lib/engine/types';
import { getSwapCandidates } from '@/lib/engine';
import { getExerciseById, muscleLabel } from '@/lib/data/exercises';
import { formatDose } from '@/lib/data/exercises/factory';
import { Badge, Card } from '@/components/ui';
import styles from './draftProgram.module.css';

interface Props {
  program: DraftProgram;
  input: GeneratorInput;
  blocked: string[];
  onSwap: (sessionIndex: number, exIndex: number, newExerciseId: string) => void;
  onBlock: (exerciseId: string) => void;
  onUnblock: (exerciseId: string) => void;
}

export function DraftProgramView({
  program,
  input,
  blocked,
  onSwap,
  onBlock,
  onUnblock,
}: Props) {
  const [openRow, setOpenRow] = useState<string | null>(null);
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

      {blocked.length > 0 && (
        <div className={styles.blocked}>
          <span className={styles.blockedLabel}>Blocked:</span>
          {blocked.map((id) => {
            const ex = getExerciseById(id);
            return (
              <button
                key={id}
                type="button"
                className={styles.blockedChip}
                onClick={() => onUnblock(id)}
                title="Unblock"
              >
                {ex?.name ?? id} <span aria-hidden="true">✕</span>
              </button>
            );
          })}
        </div>
      )}

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
          {program.sessions.map((s, si) => (
            <Card key={s.id} className={styles.session}>
              <div className={styles.sessionHead}>
                <div>
                  <span className={styles.day}>Day {s.dayIndex + 1}</span>
                  <h4 className={styles.sessionTitle}>{s.title}</h4>
                </div>
                <Badge tone="olive">~{s.estimatedMinutes} min</Badge>
              </div>
              <ol className={styles.exList}>
                {s.exercises.map((ex, i) => {
                  const rowKey = `${s.id}:${i}`;
                  const open = openRow === rowKey;
                  const candidates = open
                    ? getSwapCandidates(ex.exerciseId, input).slice(0, 8)
                    : [];
                  return (
                    <li key={rowKey} className={styles.exRow}>
                      <div className={styles.exLine}>
                        <span className={styles.exOrder}>{i + 1}</span>
                        <span className={styles.exMain}>
                          <Link href={`/exercises/${ex.slug}`} className={styles.exName}>
                            {ex.name}
                          </Link>
                          <span className={styles.exTags}>
                            {ex.isPriority ? <span className={styles.priTag}>Priority ★</span> : null}
                            {ex.isSwapped ? <span className={styles.swapTag}>Swapped</span> : null}
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
                        <span className={styles.exActions}>
                          <button
                            type="button"
                            className={styles.exBtn}
                            onClick={() => setOpenRow(open ? null : rowKey)}
                            aria-expanded={open}
                          >
                            Swap
                          </button>
                          <button
                            type="button"
                            className={styles.exBtnDanger}
                            onClick={() => onBlock(ex.exerciseId)}
                            title="Block this exercise so it never returns"
                          >
                            Block
                          </button>
                        </span>
                      </div>

                      {open && (
                        <div className={styles.swapPanel}>
                          {candidates.length === 0 ? (
                            <p className={styles.swapEmpty}>
                              No alternatives available for your equipment.
                            </p>
                          ) : (
                            <ul className={styles.swapList}>
                              {candidates.map((c) => (
                                <li key={c.id}>
                                  <button
                                    type="button"
                                    className={styles.swapOption}
                                    onClick={() => {
                                      onSwap(si, i, c.id);
                                      setOpenRow(null);
                                    }}
                                  >
                                    <span className={styles.swapName}>{c.name}</span>
                                    <span className={styles.swapMeta}>
                                      {muscleLabel(c.primaryMuscle)} &middot;{' '}
                                      {formatDose(c) ?? 'Conditioning'}
                                    </span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
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
