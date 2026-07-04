'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ExperienceLevel, MuscleGroup } from '@/lib/models/exercise';
import type { TrainingGoal } from '@/lib/models/program';
import type { DraftSession, EquipmentProfile } from '@/lib/engine/types';
import type { SessionLog } from '@/lib/models/session';
import {
  generateQuickSession,
  lastAndBest,
  recommendNext,
  type PRResult,
  type WeightUnit,
} from '@/lib/engine';
import { getExerciseById } from '@/lib/data/exercises';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { PageIntro } from '@/components/layout/PageIntro';
import { SessionPlan } from '@/components/program/SessionPlan';
import { ExerciseLogger } from '@/components/gym/ExerciseLogger';
import { ExpeditionLogForm } from '@/components/gym/ExpeditionLogForm';
import { RestTimer } from '@/components/gym/RestTimer';
import { Scene } from '@/components/media/Scene';
import { Badge, Button, LinkButton, Section, Shell } from '@/components/ui';
import styles from './quick.module.css';

const GOALS: { value: TrainingGoal; label: string }[] = [
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'strength', label: 'Strength' },
  { value: 'fat_loss_support', label: 'Fat loss' },
  { value: 'general_fitness', label: 'General' },
];
const TIMES: (30 | 45 | 60 | 75)[] = [30, 45, 60];
const EQUIP: { value: EquipmentProfile; label: string }[] = [
  { value: 'full_gym', label: 'Full gym' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'home', label: 'Home' },
  { value: 'bodyweight', label: 'Bodyweight' },
];
const MUSCLES: { value: MuscleGroup; label: string }[] = [
  { value: 'chest', label: 'Chest' },
  { value: 'lats', label: 'Back' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'quads', label: 'Legs' },
  { value: 'side_delts', label: 'Shoulders' },
  { value: 'biceps', label: 'Arms' },
  { value: 'core', label: 'Core' },
];

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function QuickSafari() {
  const {
    hydrated,
    settings,
    sessionHistory,
    activeQuickSession,
    startQuickSession,
    logQuickSet,
    finishQuickSession,
    abandonQuickSession,
    blockedIds,
  } = useLocalData();
  const unit: WeightUnit = settings.unitSystem === 'imperial' ? 'lb' : 'kg';

  const [goal, setGoal] = useState<TrainingGoal>('build_muscle');
  const [time, setTime] = useState<30 | 45 | 60 | 75>(45);
  const [equipment, setEquipment] = useState<EquipmentProfile>('full_gym');
  const [muscles, setMuscles] = useState<MuscleGroup[]>([]);
  const [draft, setDraft] = useState<DraftSession | null>(null);
  const [completed, setCompleted] = useState<{ session: SessionLog; prs: PRResult[] } | null>(null);
  const [rest, setRest] = useState<{ timerId: number; seconds: number } | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!activeQuickSession) return;
    setNow(Date.now());
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [activeQuickSession]);

  const loggedByBlock = useMemo(() => {
    const map = new Map<string, Map<number, { weight?: number; reps?: number; rpe?: number }>>();
    if (!activeQuickSession) return map;
    for (const s of activeQuickSession.setLogs) {
      if (!map.has(s.sessionExerciseBlockId)) map.set(s.sessionExerciseBlockId, new Map());
      map.get(s.sessionExerciseBlockId)!.set(s.setNumber, {
        weight: s.weight,
        reps: s.reps,
        rpe: s.rpe,
      });
    }
    return map;
  }, [activeQuickSession]);

  if (!hydrated) {
    return <PageIntro eyebrow="Quick Safari" title="One-off session" lede="Loading…" />;
  }

  function generate() {
    setDraft(
      generateQuickSession({
        goal,
        experience: 'intermediate' as ExperienceLevel,
        durationMinutes: time,
        equipment,
        targetMuscles: muscles,
        avoid: [],
        blocked: blockedIds,
      })
    );
  }

  function toggleMuscle(m: MuscleGroup) {
    setMuscles((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : prev.length < 2 ? [...prev, m] : prev
    );
  }

  const prefillHref = `/workout-generator?goal=${goal}&equipment=${equipment}${
    muscles.length ? `&muscles=${muscles.join(',')}` : ''
  }`;

  // --- Completion ---
  if (completed) {
    const { session, prs } = completed;
    return (
      <>
        <PageIntro eyebrow="Quick Safari" title="Session logged" />
        <Shell>
          <Section tight>
            <div className={styles.doneStats}>
              <Stat label="Sets" value={String(session.setLogs.length)} />
              <Stat label="Duration" value={session.durationSeconds ? fmt(session.durationSeconds * 1000) : '—'} />
              <Stat label="PRs" value={String(prs.length)} />
            </div>
            {prs.length ? (
              <p className={styles.prLine}>
                🎉 New PR:{' '}
                {prs.map((p) => getExerciseById(p.exerciseId)?.name ?? p.exerciseId).join(', ')}
              </p>
            ) : null}
            <p className={styles.note}>
              Logged to your history — it counts toward your progress and records.
            </p>
            <ExpeditionLogForm sessionId={session.id} />
            <div className={styles.row}>
              <LinkButton href={prefillHref} variant="primary">
                Make it a full program
              </LinkButton>
              <LinkButton href="/progress" variant="secondary">
                View progress
              </LinkButton>
              <Button variant="ghost" onClick={() => { setCompleted(null); setDraft(null); }}>
                Another Quick Safari
              </Button>
            </div>
          </Section>
        </Shell>
      </>
    );
  }

  // --- Logging ---
  if (activeQuickSession) {
    const setsLogged = activeQuickSession.setLogs.length;
    const target = activeQuickSession.exerciseBlocks.reduce((n, b) => n + b.targetSets, 0);
    const elapsed = activeQuickSession.startedAt ? now - new Date(activeQuickSession.startedAt).getTime() : 0;
    return (
      <>
        <PageIntro eyebrow="Quick Safari" title="Log your session">
          <div className={styles.live}>
            <Badge tone="olive">⏱ {fmt(elapsed)}</Badge>
            <Badge tone="gold">{setsLogged}/{target} sets</Badge>
          </div>
        </PageIntro>
        <Shell>
          <Section tight>
            {activeQuickSession.exerciseBlocks.map((block) => {
              const ex = getExerciseById(block.currentExerciseId);
              return (
                <ExerciseLogger
                  key={block.id}
                  block={block}
                  unit={unit}
                  stat={lastAndBest(sessionHistory, block.currentExerciseId)}
                  rec={ex ? recommendNext(ex, block.targetRepRange, sessionHistory, unit) : undefined}
                  logged={loggedByBlock.get(block.id) ?? new Map()}
                  onLog={(setNumber, weight, reps, rpe) => {
                    logQuickSet(block.id, setNumber, { weight, reps, rpe, unit });
                    setRest({ timerId: Date.now(), seconds: block.targetRestSeconds });
                  }}
                />
              );
            })}
            <div className={styles.row}>
              <Button
                variant="primary"
                onClick={() => {
                  const res = finishQuickSession();
                  if (res) setCompleted(res);
                  setRest(null);
                }}
              >
                Finish Safari
              </Button>
              <Button variant="ghost" onClick={() => abandonQuickSession()}>
                Discard
              </Button>
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

  // --- Build + preview ---
  return (
    <>
      <PageIntro
        eyebrow="Quick Safari"
        title="A workout, right now"
        lede="No program needed — get a one-off session built around your time, equipment and focus. Log it live and it counts toward your progress."
      />
      <Shell>
        <Section tight>
          <div className={styles.builder}>
            <Scene name="gym" slot="quick-header" className={styles.headerScene} />
            <div className={styles.form}>
              <Field label="Goal">
                <Seg options={GOALS} value={goal} onChange={setGoal} />
              </Field>
              <Field label="Time">
                <Seg options={TIMES.map((t) => ({ value: t, label: `${t} min` }))} value={time} onChange={setTime} />
              </Field>
              <Field label="Equipment">
                <Seg options={EQUIP} value={equipment} onChange={setEquipment} />
              </Field>
              <Field label="Focus (optional, up to 2)">
                <div className={styles.chips}>
                  {MUSCLES.map((m) => {
                    const on = muscles.includes(m.value);
                    return (
                      <button
                        key={m.value}
                        type="button"
                        className={on ? styles.chipOn : styles.chip}
                        onClick={() => toggleMuscle(m.value)}
                        aria-pressed={on}
                        disabled={!on && muscles.length >= 2}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Button variant="primary" onClick={generate}>
                {draft ? 'Regenerate' : 'Build my session'}
              </Button>
            </div>
          </div>

          {draft ? (
            <div className={styles.preview}>
              <SessionPlan session={draft} label="Quick Safari" />
              <div className={styles.row}>
                <Button variant="primary" onClick={() => startQuickSession(draft)}>
                  Start &amp; log this session
                </Button>
                <LinkButton href={prefillHref} variant="secondary">
                  Make it a full program
                </LinkButton>
              </div>
            </div>
          ) : null}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </div>
  );
}

function Seg<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className={styles.seg} role="group">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          className={o.value === value ? styles.segOn : styles.segBtn}
          onClick={() => onChange(o.value)}
          aria-pressed={o.value === value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
