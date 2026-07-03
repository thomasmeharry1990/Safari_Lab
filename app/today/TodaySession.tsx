'use client';

import { useState } from 'react';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { PageIntro } from '@/components/layout/PageIntro';
import { SessionPlan } from '@/components/program/SessionPlan';
import { LinkButton, Section, Shell } from '@/components/ui';
import styles from './today.module.css';

export function TodaySession() {
  const { hydrated, activeProgram } = useLocalData();
  const [viewDay, setViewDay] = useState<number | null>(null);

  if (!hydrated) {
    return <PageIntro eyebrow="Today's Safari" title="Your session" lede="Loading…" />;
  }

  if (!activeProgram) {
    return (
      <>
        <PageIntro
          eyebrow="Today's Safari"
          title="No expedition in progress"
          lede="Lock a program and your next session shows up here, ready to train."
        />
        <Shell>
          <Section tight>
            <LinkButton href="/workout-generator" variant="primary">
              Build a program
            </LinkButton>
          </Section>
        </Shell>
      </>
    );
  }

  const p = activeProgram;
  const day = viewDay ?? p.currentDayIndex;
  const session = p.sessions[day] ?? p.sessions[0];

  return (
    <>
      <PageIntro eyebrow="Today's Safari" title={session?.title ?? p.name}>
        <p className={styles.sub}>
          {p.name} &middot; Week {p.currentWeek} of {p.weeks}
        </p>
      </PageIntro>

      <Shell>
        <Section tight>
          <div className={styles.dayNav} role="group" aria-label="Choose session">
            {p.sessions.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={i === day ? styles.dayOn : styles.day}
                onClick={() => setViewDay(i)}
                aria-pressed={i === day}
              >
                Day {i + 1}
              </button>
            ))}
          </div>

          {session ? <SessionPlan session={session} label={`Day ${day + 1}`} /> : null}

          <div className={styles.gymNote}>
            <p>
              Interactive set logging — the sticky logger, rest timer, plate
              calculator and last-time chips — arrives in the next build stage
              (gym mode). For now this is your session plan.
            </p>
            <LinkButton href="/program" variant="secondary">
              Back to program
            </LinkButton>
          </div>
        </Section>
      </Shell>
    </>
  );
}
