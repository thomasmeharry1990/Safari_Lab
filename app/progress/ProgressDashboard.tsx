'use client';

import { useMemo, useState } from 'react';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { computeProgress } from '@/lib/engine';
import { PageIntro } from '@/components/layout/PageIntro';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { Button, Card, LinkButton, Panel, Section, Shell } from '@/components/ui';
import styles from './progress.module.css';

export function ProgressDashboard() {
  const { hydrated, sessionHistory } = useLocalData();
  const stats = useMemo(
    () => computeProgress(sessionHistory, new Date()),
    [sessionHistory]
  );
  const [strengthId, setStrengthId] = useState<string | null>(null);

  if (!hydrated) {
    return <PageIntro eyebrow="Progress" title="Your training" lede="Loading…" />;
  }

  if (stats.totalSessions === 0) {
    return (
      <>
        <PageIntro
          eyebrow="Progress"
          title="No training logged yet"
          lede="Finish a session in gym mode and your PRs, volume and strength trends appear here."
        />
        <Shell>
          <Section tight>
            <LinkButton href="/today" variant="primary">
              Open Today’s Safari
            </LinkButton>
          </Section>
        </Shell>
      </>
    );
  }

  const selected =
    stats.strength.find((s) => s.exerciseId === strengthId) ?? stats.strength[0];

  return (
    <>
      <PageIntro eyebrow="Progress" title="Your command centre">
        <div className={styles.printRow}>
          <Button variant="secondary" className={styles.noPrint} onClick={() => window.print()}>
            Print / save report
          </Button>
        </div>
      </PageIntro>

      <Shell>
        <Section tight>
          <div className={styles.overview}>
            <Stat label="Sessions" value={String(stats.totalSessions)} />
            <Stat label="This week" value={String(stats.sessionsThisWeek)} />
            <Stat label="Sets logged" value={String(stats.totalSets)} />
            <Stat
              label={`Volume (${stats.unit})`}
              value={stats.totalVolume.toLocaleString()}
            />
            <Stat label="Personal records" value={String(stats.prs.length)} />
          </div>
        </Section>

        <Section tight>
          <Card className={styles.chartCard}>
            <h2 className={styles.h2}>Volume per session</h2>
            <LineChart
              points={stats.volumeSeries}
              unit={stats.unit}
              ariaLabel="Total training volume per session over time"
            />
          </Card>
        </Section>

        {stats.strength.length ? (
          <Section tight>
            <Card className={styles.chartCard}>
              <div className={styles.chartHead}>
                <h2 className={styles.h2}>Strength trend</h2>
                <select
                  className={styles.select}
                  value={selected?.exerciseId ?? ''}
                  onChange={(e) => setStrengthId(e.target.value)}
                  aria-label="Choose exercise for strength trend"
                >
                  {stats.strength.map((s) => (
                    <option key={s.exerciseId} value={s.exerciseId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              {selected ? (
                <LineChart
                  points={selected.points}
                  unit={`e1RM ${stats.unit}`}
                  ariaLabel={`Estimated one-rep max trend for ${selected.name}`}
                />
              ) : null}
            </Card>
          </Section>
        ) : null}

        <div className={styles.twoCol}>
          <Section tight>
            <Panel className={styles.panel}>
              <h2 className={styles.h2}>Volume by muscle</h2>
              <BarChart
                data={stats.muscleVolume.map((m) => ({ label: m.label, value: m.sets }))}
                suffix="sets"
              />
            </Panel>
          </Section>

          <Section tight>
            <Panel className={styles.panel}>
              <h2 className={styles.h2}>Personal records</h2>
              {stats.prs.length ? (
                <ul className={styles.prList}>
                  {stats.prs.slice(0, 8).map((pr) => (
                    <li key={pr.exerciseId}>
                      <span className={styles.prName}>{pr.name}</span>
                      <span className={styles.prVal}>
                        {pr.weight}
                        {pr.unit} × {pr.reps}
                        <span className={styles.prE1rm}> · e1RM {pr.e1rm}{pr.unit}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.muted}>Log weighted sets to start setting records.</p>
              )}
            </Panel>
          </Section>
        </div>

        <Section tight>
          <Panel className={styles.panel}>
            <h2 className={styles.h2}>Recent sessions</h2>
            <ul className={styles.recent}>
              {stats.recent.slice(0, 8).map((r) => (
                <li key={r.id} className={styles.recentRow}>
                  <span>{new Date(r.at).toLocaleDateString()}</span>
                  <span className={styles.recentSets}>{r.sets} sets</span>
                  <span className={styles.recentVol}>
                    {r.volume.toLocaleString()} {stats.unit}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </Section>
      </Shell>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
