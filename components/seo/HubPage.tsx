import Link from 'next/link';
import { GROUP_META, getLandings, type LandingGroup } from '@/lib/content/landings';
import { PageIntro } from '@/components/layout/PageIntro';
import { Grid, Section, Shell } from '@/components/ui';
import styles from './hub.module.css';

export function HubPage({ group }: { group: LandingGroup }) {
  const meta = GROUP_META[group];
  const items = getLandings(group);
  return (
    <main>
      <PageIntro eyebrow="Explore" title={meta.title} lede={meta.blurb} />
      <Shell>
        <Section tight>
          <Grid cols={3}>
            {items.map((l) => (
              <Link key={l.slug} href={`${meta.path}/${l.slug}`} className={styles.card}>
                <h2 className={styles.cardTitle}>{l.h1}</h2>
                <p className={styles.cardBody}>{l.seo.description}</p>
                <span className={styles.cardCta}>Generate this plan →</span>
              </Link>
            ))}
          </Grid>
        </Section>
      </Shell>
    </main>
  );
}
