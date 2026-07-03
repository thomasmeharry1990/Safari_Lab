'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { lastAndBest, recommendNext, type PRResult, type WeightUnit } from '@/lib/engine';
import type { SessionLog } from '@/lib/models/session';
import { getExerciseById } from '@/lib/data/exercises';
import { PageIntro } from '@/components/layout/PageIntro';
import { SessionPlan } from '@/components/program/SessionPlan';
import { Badge, Button, LinkButton, Section, Shell } from '@/components/ui';
import { ExerciseLogger } from './ExerciseLogger';
import { RestTimer } from './RestTimer';
import { AdaptPanel } from './AdaptPanel';
import styles from './gym.module.css';

function fmtElapsed(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function GymMode() {
  const {
    activeProgram,
    activeSession,
    sessionHistory,
    settings,
    startSession,
    logSet,
    finishSession,
    abandonSession,
  } = useLocalData();
  const router = useRouter();

  const unit: WeightUnit = settings.unitSystem === 'imperial' ? 'lb' : 'kg';
  const [viewDay, setViewDay] = useState(activeProgram?.currentDayIndex ?? 0);
  const [rest, setRest] = useState<{ timerId: number; seconds: number } | null>(null);
  const [completed, setCompleted] = useState<{ session: SessionLog; prs: PRResult[] } | null>(null);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  const [showAdapt, setShowAdapt] = useState(false);
  const [now, setNow] = useState(0);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (!activeSession) return;
    setNow(Date.now());
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [activeSession]);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const loggedByBlock = useMemo(() => {
    const map = new Map<string, Map<number, { weight?: number; reps?: number }>>();
    if (!activeSession) return map;
    for (const set of activeSession.setLogs) {
      if (!map.has(set.sessionExerciseBlockId)) map.set(set.sessionExerciseBlockId, new Map());
      map.get(set.sessionExerciseBlockId)!.set(set.setNumber, {
        weight: set.weight,
        reps: set.reps,
      });
    }
    return map;
  }, [activeSession]);

  if (!activeProgram) return null;

  // --- Completion view ---
  if (completed) {
    const { session, prs } = completed;
    return (
      <>
        <PageIntro eyebrow="Session complete" title="Expedition logged" />
        <Shell>
          <Section tight>
            <div className={styles.complete}>
              <div className={styles.completeStats}>
                <Stat label="Sets logged" value={String(session.setLogs.length)} />
                <Stat
                  label="Duration"
                  value={session.durationSeconds ? fmtElapsed(session.durationSeconds * 1000) : '—'}
                />
                <Stat label="Personal records" value={String(prs.length)} />
              </div>
              {prs.length ? (
                <div className={styles.prList}>
                  <h3 className={styles.prTitle}>New personal records 🎉</h3>
                  <ul>
                    {prs.map((pr) => (
                      <li key={pr.exerciseId}>
                        {getExerciseById(pr.exerciseId)?.name ?? pr.exerciseId} —{' '}
                        {pr.weight}
                        {unit} × {pr.reps}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className={styles.completeNote}>
                  Every logged set builds your history. Last-time and best-ever
                  chips will guide your next session.
                </p>
              )}
              <div className={styles.completeActions}>
                <LinkButton href="/program" variant="primary">
                  Back to program
                </LinkButton>
                <Button variant="ghost" onClick={() => setCompleted(null)}>
                  Stay here
                </Button>
              </div>
            </div>
          </Section>
        </Shell>
      </>
    );
  }

  // --- Logging view ---
  if (activeSession) {
    const planned = activeProgram.sessions.find((s) => s.id === activeSession.plannedWorkoutId);
    const setsLogged = activeSession.setLogs.length;
    const targetTotal = activeSession.exerciseBlocks.reduce((n, b) => n + b.targetSets, 0);
    const elapsed = activeSession.startedAt ? now - new Date(activeSession.startedAt).getTime() : 0;

    function finish() {
      const res = finishSession();
      if (res) setCompleted(res);
      setConfirmFinish(false);
      setRest(null);
    }

    return (
      <>
        <PageIntro eyebrow="Today's Safari" title={planned?.title ?? 'Your session'}>
          <div className={styles.liveMeta}>
            <Badge tone="olive">⏱ {fmtElapsed(elapsed)}</Badge>
            <Badge tone="gold">
              {setsLogged}/{targetTotal} sets
            </Badge>
            {!online ? <Badge tone="copper">Offline</Badge> : null}
          </div>
        </PageIntro>

        <Shell>
          <Section tight>
            {activeSession.exerciseBlocks.map((block) => {
              const ex = getExerciseById(block.currentExerciseId);
              return (
                <ExerciseLogger
                  key={block.id}
                  block={block}
                  unit={unit}
                  stat={lastAndBest(sessionHistory, block.currentExerciseId)}
                  rec={
                    ex
                      ? recommendNext(ex, block.targetRepRange, sessionHistory, unit)
                      : undefined
                  }
                  logged={loggedByBlock.get(block.id) ?? new Map()}
                  onLog={(setNumber, weight, reps) => {
                    logSet(block.id, setNumber, { weight, reps, unit });
                    setRest({ timerId: Date.now(), seconds: block.targetRestSeconds });
                  }}
                />
              );
            })}

            <div className={styles.finishRow}>
              {confirmFinish ? (
                <>
                  <span className={styles.confirmText}>Finish and save this session?</span>
                  <Button variant="primary" onClick={finish}>
                    Finish Safari
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmFinish(false)}>
                    Keep going
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setConfirmFinish(true)}>
                  Finish Safari
                </Button>
              )}
            </div>

            <div className={styles.abandonRow}>
              {confirmAbandon ? (
                <>
                  <span className={styles.confirmText}>Discard this session? Logged sets are lost.</span>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      abandonSession();
                      setConfirmAbandon(false);
                    }}
                  >
                    Discard
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmAbandon(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.abandonLink}
                  onClick={() => setConfirmAbandon(true)}
                >
                  Discard session
                </button>
              )}
            </div>
          </Section>
        </Shell>

        {rest ? (
          <RestTimer
            timerId={rest.timerId}
            seconds={rest.seconds}
            soundEnabled={settings.soundEnabled}
            hapticsEnabled={settings.hapticsEnabled}
            onDismiss={() => setRest(null)}
          />
        ) : null}
      </>
    );
  }

  // --- Start view ---
  const session = activeProgram.sessions[viewDay] ?? activeProgram.sessions[0];
  return (
    <>
      <PageIntro eyebrow="Today's Safari" title={session?.title ?? activeProgram.name}>
        <p className={styles.sub}>
          {activeProgram.name} &middot; Week {activeProgram.currentWeek} of {activeProgram.weeks}
        </p>
      </PageIntro>
      <Shell>
        <Section tight>
          <div className={styles.dayNav} role="group" aria-label="Choose session">
            {activeProgram.sessions.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={i === viewDay ? styles.dayOn : styles.day}
                onClick={() => setViewDay(i)}
                aria-pressed={i === viewDay}
              >
                Day {i + 1}
              </button>
            ))}
          </div>

          {session ? <SessionPlan session={session} label={`Day ${viewDay + 1}`} /> : null}

          <div className={styles.startRow}>
            <Button variant="primary" onClick={() => startSession(viewDay)}>
              Start this session
            </Button>
            <Button variant="secondary" onClick={() => setShowAdapt((v) => !v)}>
              {showAdapt ? 'Hide adapt' : 'Adapt session'}
            </Button>
            <LinkButton href="/program" variant="ghost">
              Back to program
            </LinkButton>
          </div>

          {showAdapt ? <AdaptPanel program={activeProgram} dayIndex={viewDay} /> : null}
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
