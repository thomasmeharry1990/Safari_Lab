import Link from 'next/link';
import type { Landing } from '@/lib/content/landings';
import { GROUP_META, prefillHref } from '@/lib/content/landings';
import { getExerciseById } from '@/lib/data/exercises';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageIntro } from '@/components/layout/PageIntro';
import { Grid, LinkButton, Panel, Section, Shell } from '@/components/ui';
import { SITE_URL } from '@/lib/constants/site';
import styles from './landing.module.css';

export function LandingPage({ landing }: { landing: Landing }) {
  const group = GROUP_META[landing.group];
  const related = landing.relatedExerciseIds
    .map((id) => getExerciseById(id))
    .filter((e): e is NonNullable<typeof e> => !!e);
  const cta = prefillHref(landing.prefill);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: group.title, item: `${SITE_URL}${group.path}` },
      { '@type': 'ListItem', position: 3, name: landing.h1, item: `${SITE_URL}${group.path}/${landing.slug}` },
    ],
  };

  return (
    <main>
      <JsonLd data={breadcrumb} />
      <Shell>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href={group.path}>{group.title}</Link>
          <span aria-hidden="true"> / </span>
          <span>{landing.h1}</span>
        </nav>
      </Shell>

      <PageIntro eyebrow={group.title} title={landing.h1} lede={landing.lead}>
        <div className={styles.ctaRow}>
          <LinkButton href={cta} variant="primary">
            Generate this plan
          </LinkButton>
        </div>
      </PageIntro>

      <Shell>
        {landing.sections.map((s) => (
          <Section key={s.h2} tight>
            <h2 className={styles.h2}>{s.h2}</h2>
            {s.body.map((p) => (
              <p key={p} className={styles.body}>
                {p}
              </p>
            ))}
          </Section>
        ))}

        {related.length ? (
          <Section tight>
            <h2 className={styles.h2}>Key exercises</h2>
            <Grid cols={4}>
              {related.map((ex) => (
                <ExerciseCard key={ex.id} ex={ex} />
              ))}
            </Grid>
          </Section>
        ) : null}

        {landing.faqs.length ? (
          <Section tight>
            <h2 className={styles.h2}>FAQ</h2>
            {landing.faqs.map((f) => (
              <Panel key={f.q} className={styles.faq}>
                <h3 className={styles.faqQ}>{f.q}</h3>
                <p className={styles.body}>{f.a}</p>
              </Panel>
            ))}
          </Section>
        ) : null}

        <Section tight>
          <Panel className={styles.finalCta}>
            <div>
              <h2 className={styles.h2}>Ready to train?</h2>
              <p className={styles.body}>
                Generate a free, adaptive plan built around this — no account, no
                uploads, stored on your device.
              </p>
            </div>
            <LinkButton href={cta} variant="primary">
              Generate this plan
            </LinkButton>
          </Panel>
        </Section>
      </Shell>
    </main>
  );
}
