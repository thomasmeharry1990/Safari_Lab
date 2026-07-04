'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { PageIntro } from '@/components/layout/PageIntro';
import { SessionPlan } from '@/components/program/SessionPlan';
import { SessionEditor } from '@/components/program/SessionEditor';
import { BlockReport } from '@/components/program/BlockReport';
import { Badge, Button, Card, LinkButton, Section, Shell } from '@/components/ui';
import styles from './program.module.css';

export function ProgramDashboard() {
  const {
    hydrated,
    activeProgram,
    completedPrograms,
    endProgram,
    startDeload,
    endDeload,
    startNextBlock,
  } = useLocalData();
  const router = useRouter();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [reordering, setReordering] = useState(false);

  const lastCompleted =
    completedPrograms.length > 0
      ? [...completedPrograms].sort((a, b) =>
          b.completedAt.localeCompare(a.completedAt)
        )[0]
      : undefined;

  if (!hydrated) {
    return (
      <PageIntro eyebrow="My Program" title="Your active expedition" lede="Loading your program…" />
    );
  }

  if (!activeProgram) {
    return (
      <>
        <PageIntro
          eyebrow="My Program"
          title={lastCompleted ? 'Ready for your next block' : 'No expedition in progress'}
          lede={
            lastCompleted
              ? 'You finished your last program. Review the block report below, then start a fresh block from the same brief or build something new.'
              : 'Once you lock a program it lives here — your week at a glance, with Today’s Safari ready to train.'
          }
        />
        <Shell>
          {lastCompleted ? (
            <Section tight>
              <BlockReport program={lastCompleted} heading="Last expedition complete" />
              <div className={styles.nextBlock}>
                <Button
                  variant="primary"
                  onClick={() => {
                    startNextBlock(lastCompleted);
                    router.push('/today');
                  }}
                >
                  Start next block
                </Button>
                <LinkButton href="/workout-generator" variant="secondary">
                  Build a new program
                </LinkButton>
                <LinkButton href="/progress" variant="ghost">
                  View progress
                </LinkButton>
              </div>
            </Section>
          ) : (
            <Section tight>
              <div className={styles.empty}>
                <LinkButton href="/workout-generator" variant="primary">
                  Build a program
                </LinkButton>
                <LinkButton href="/start" variant="secondary">
                  Other ways to start
                </LinkButton>
              </div>
            </Section>
          )}
        </Shell>
      </>
    );
  }

  const p = activeProgram;
  const today = p.sessions[p.currentDayIndex] ?? p.sessions[0];

  function end() {
    endProgram();
    setConfirmEnd(false);
    router.refresh();
  }

  return (
    <>
      <PageIntro eyebrow="My Program" title={p.name}>
        <div className={styles.meta}>
          <Badge tone="gold">{p.resolvedSplit}</Badge>
          <Badge tone="olive">
            Week {p.currentWeek} of {p.weeks}
          </Badge>
          <Badge tone="olive">{p.daysPerWeek} days/week</Badge>
        </div>
      </PageIntro>

      <Shell>
        {p.deload?.active ? (
          <Section tight>
            <div className={styles.deloadBanner}>
              <span>
                <strong>Deload week active</strong> — volume is reduced (~55%) for
                recovery. Keep the reps crisp and leave some in the tank.
              </span>
              <Button variant="secondary" onClick={endDeload}>
                End deload
              </Button>
            </div>
          </Section>
        ) : null}

        {today ? (
          <Section tight>
            <div className={styles.todayHead}>
              <h2 className={styles.h2}>Today’s Safari</h2>
              <LinkButton href="/today" variant="primary">
                Open Today’s Safari
              </LinkButton>
            </div>
            <SessionPlan session={today} label="Today’s Safari" />
          </Section>
        ) : null}

        <Section tight>
          <div className={styles.weekHead}>
            <h2 className={styles.h2}>Your training week</h2>
            <Button
              variant={reordering ? 'primary' : 'secondary'}
              onClick={() => setReordering((v) => !v)}
            >
              {reordering ? 'Done reordering' : 'Reorder exercises'}
            </Button>
          </div>
          {reordering ? (
            <p className={styles.reorderHint}>
              Use the ▲▼ controls to change the order exercises appear in each
              session. Changes save instantly.
            </p>
          ) : null}
          <div className={styles.week}>
            {p.sessions.map((s, i) =>
              reordering ? (
                <SessionEditor key={s.id} session={s} dayIndex={i} />
              ) : (
                <SessionPlan key={s.id} session={s} />
              )
            )}
          </div>
        </Section>

        <Section tight>
          <Card className={styles.footerCard}>
            <div>
              <h3 className={styles.h3}>Program controls</h3>
              <p className={styles.note}>
                Need a recovery week? A deload cuts your volume while keeping
                technique sharp. Locked {new Date(p.lockedAt).toLocaleDateString()}.
              </p>
            </div>
            <div className={styles.controls}>
              <LinkButton href="/progress" variant="secondary">
                View progress
              </LinkButton>
              {p.deload?.active ? (
                <Button variant="secondary" onClick={endDeload}>
                  End deload
                </Button>
              ) : (
                <Button variant="secondary" onClick={startDeload}>
                  Deload this week
                </Button>
              )}
              <LinkButton href="/workout-generator" variant="secondary">
                Build a new program
              </LinkButton>
              {confirmEnd ? (
                <>
                  <Button variant="primary" onClick={end}>
                    End &amp; discard
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmEnd(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="ghost" onClick={() => setConfirmEnd(true)}>
                  End program
                </Button>
              )}
            </div>
          </Card>
        </Section>
      </Shell>
    </>
  );
}
