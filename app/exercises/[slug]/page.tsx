import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Panel, Pill, Section, Shell } from '@/components/ui';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';
import { FavouriteButton } from '@/components/exercise/FavouriteButton';
import { ExerciseHistoryPanel } from '@/components/exercise/ExerciseHistoryPanel';
import {
  getAllExercises,
  getAlternatives,
  getExerciseBySlug,
  muscleLabel,
  patternLabel,
} from '@/lib/data/exercises';
import { formatDose } from '@/lib/data/exercises/factory';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/constants/site';
import styles from './detail.module.css';

/** Static export: pre-render one page per exercise slug. */
export function generateStaticParams(): { slug: string }[] {
  return getAllExercises().map((ex) => ({ slug: ex.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const ex = getExerciseBySlug(params.slug);
  if (!ex) return { title: 'Exercise not found' };
  return {
    title: ex.seo.title,
    description: ex.seo.description,
    alternates: { canonical: `/exercises/${ex.slug}` },
  };
}

export default function ExerciseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const ex = getExerciseBySlug(params.slug);
  if (!ex) notFound();

  const dose = formatDose(ex);
  const alternatives = getAlternatives(ex);

  const facts: { label: string; value: string }[] = [
    { label: 'Primary muscle', value: muscleLabel(ex.primaryMuscle) },
    {
      label: 'Also works',
      value: ex.secondaryMuscles.length
        ? ex.secondaryMuscles.map(muscleLabel).join(', ')
        : '—',
    },
    { label: 'Movement', value: patternLabel(ex.movementPattern) },
    { label: 'Equipment', value: ex.equipment.join(', ') },
    { label: 'Level', value: ex.difficulty },
    {
      label: 'Typical dose',
      value: dose ?? 'Conditioning / timed',
    },
    {
      label: 'Rest',
      value: `${ex.restSeconds.min}–${ex.restSeconds.max}s`,
    },
  ];

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Exercise Library', item: `${SITE_URL}/exercise-library/` },
      { '@type': 'ListItem', position: 3, name: ex.name, item: `${SITE_URL}/exercises/${ex.slug}/` },
    ],
  };

  return (
    <main>
      <JsonLd data={breadcrumb} />
      <Shell>
        <Section className={styles.top}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/exercise-library">Exercise Library</Link>
            <span aria-hidden="true"> / </span>
            <span>{ex.name}</span>
          </nav>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{ex.name}</h1>
            <div className={styles.badges}>
              {ex.compound ? (
                <Badge tone="gold">Compound</Badge>
              ) : (
                <Badge tone="olive">Isolation</Badge>
              )}
              {ex.unilateral ? <Badge tone="olive">Single-side</Badge> : null}
              {ex.plateCalculator ? <Badge tone="olive">Barbell</Badge> : null}
            </div>
          </div>
          <div className={styles.favRow}>
            <FavouriteButton exerciseId={ex.id} />
          </div>
          {ex.aliases.length ? (
            <p className={styles.aliases}>Also known as: {ex.aliases.join(', ')}</p>
          ) : null}
        </Section>

        <Section tight className={styles.body}>
          <div className={styles.main}>
            <Panel className={styles.facts}>
              {facts.map((f) => (
                <div key={f.label} className={styles.fact}>
                  <span className={styles.factLabel}>{f.label}</span>
                  <span className={styles.factValue}>{f.value}</span>
                </div>
              ))}
            </Panel>

            <ExerciseHistoryPanel exerciseId={ex.id} />

            <h2 className={styles.h2}>Form cues</h2>
            <ul className={styles.cues}>
              {ex.cues.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            {ex.requiresWarmUp ? (
              <>
                <h2 className={styles.h2}>Warm-up</h2>
                <p className={styles.note}>
                  As a heavy compound, ramp up before your working sets — build
                  from roughly {Math.round((ex.warmUpProtocol.rampPercentages?.[0] ?? 0.5) * 100)}
                  % to {Math.round((ex.warmUpProtocol.rampPercentages?.[1] ?? 0.75) * 100)}% of
                  your working weight for a few easy reps to groove the pattern.
                </p>
              </>
            ) : null}

            <p className={styles.disclaimer}>
              Educational information only, not medical advice. Train within your
              ability and stop if you feel pain.
            </p>
          </div>

          <aside className={styles.side}>
            <h2 className={styles.h2}>Swap options</h2>
            {alternatives.length ? (
              <div className={styles.altList}>
                {alternatives.slice(0, 6).map((alt) => (
                  <ExerciseCard key={alt.id} ex={alt} />
                ))}
              </div>
            ) : (
              <p className={styles.note}>
                No direct substitutes in the library yet for the{' '}
                <Pill>{ex.swapGroup}</Pill> group.
              </p>
            )}
          </aside>
        </Section>
      </Shell>
    </main>
  );
}
