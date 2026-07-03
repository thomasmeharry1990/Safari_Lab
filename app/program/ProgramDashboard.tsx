'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { PageIntro } from '@/components/layout/PageIntro';
import { SessionPlan } from '@/components/program/SessionPlan';
import { Badge, Button, Card, LinkButton, Section, Shell } from '@/components/ui';
import styles from './program.module.css';

export function ProgramDashboard() {
  const { hydrated, activeProgram, endProgram } = useLocalData();
  const router = useRouter();
  const [confirmEnd, setConfirmEnd] = useState(false);

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
          title="No expedition in progress"
          lede="Once you lock a program it lives here — your week at a glance, with Today’s Safari ready to train."
        />
        <Shell>
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
          <h2 className={styles.h2}>Your training week</h2>
          <div className={styles.week}>
            {p.sessions.map((s) => (
              <SessionPlan key={s.id} session={s} />
            ))}
          </div>
        </Section>

        <Section tight>
          <Card className={styles.footerCard}>
            <div>
              <h3 className={styles.h3}>Program controls</h3>
              <p className={styles.note}>
                Set logging, progress and adaptation arrive in the next build
                stages. Locked {new Date(p.lockedAt).toLocaleDateString()}.
              </p>
            </div>
            <div className={styles.controls}>
              <LinkButton href="/progress" variant="secondary">
                View progress
              </LinkButton>
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
