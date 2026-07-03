import type { Metadata } from 'next';
import { Badge, Button, Card, Grid, Section, Shell } from '@/components/ui';
import { PageIntro } from '@/components/layout/PageIntro';
import styles from './start.module.css';

export const metadata: Metadata = {
  title: 'Start Your Safari',
  robots: { index: false, follow: false },
};

const ROUTES: { title: string; body: string }[] = [
  {
    title: 'Create a program',
    body: 'Answer a few questions and generate an adaptive 4–12 week block around your goal, days and equipment.',
  },
  {
    title: 'Quick Safari',
    body: 'One-off session built for the time and equipment you have right now — no program required.',
  },
  {
    title: 'Import a save file',
    body: 'Already have a .slfit file? Bring your programs, history and progress onto this device.',
  },
];

export default function StartPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Start Your Safari"
        title="Choose how you begin"
        lede="Three ways in — all free, all local to your device. Nothing is uploaded and no account is created."
      />
      <Shell>
        <Section tight>
          <Grid cols={3}>
            {ROUTES.map((r) => (
              <Card key={r.title} className={styles.routeCard}>
                <div className={styles.routeHead}>
                  <h2 className={styles.routeTitle}>{r.title}</h2>
                  <Badge tone="olive">Coming soon</Badge>
                </div>
                <p className={styles.routeBody}>{r.body}</p>
                <Button variant="secondary" disabled aria-disabled="true">
                  Unlocks in an upcoming build stage
                </Button>
              </Card>
            ))}
          </Grid>
          <p className={styles.note}>
            You’re looking at the Stage 1 shell. The generator, gym-mode logging
            and save-file import arrive in later build stages — this page will
            wire up to them as they land.
          </p>
        </Section>
      </Shell>
    </main>
  );
}
