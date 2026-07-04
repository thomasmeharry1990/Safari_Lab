import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { Badge, Button, Card, Grid, LinkButton, Section, Shell } from '@/components/ui';
import {
  IconCompass,
  IconDownload,
  IconShuffle,
  type IconProps,
} from '@/components/brand/Icons';
import { PageIntro } from '@/components/layout/PageIntro';
import styles from './start.module.css';

export const metadata: Metadata = {
  title: 'Start Your Safari',
  robots: { index: false, follow: false },
};

const ROUTES: {
  title: string;
  body: string;
  Icon: ComponentType<IconProps>;
  href?: string;
  cta?: string;
}[] = [
  {
    title: 'Create a program',
    body: 'Answer a few questions and generate an adaptive 4–12 week block around your goal, days and equipment.',
    Icon: IconCompass,
    href: '/workout-generator',
    cta: 'Build a program',
  },
  {
    title: 'Quick Safari',
    body: 'One-off session built for the time and equipment you have right now — no program required.',
    Icon: IconShuffle,
    href: '/quick-safari',
    cta: 'Start a Quick Safari',
  },
  {
    title: 'Import a save file',
    body: 'Already have a .slfit file? Bring your programs, history and progress onto this device.',
    Icon: IconDownload,
    href: '/backup',
    cta: 'Import a save file',
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
                  <span className={styles.routeIcon} aria-hidden="true">
                    <r.Icon size={22} />
                  </span>
                  {r.href ? (
                    <Badge tone="gold">Ready</Badge>
                  ) : (
                    <Badge tone="olive">Coming soon</Badge>
                  )}
                </div>
                <h2 className={styles.routeTitle}>{r.title}</h2>
                <p className={styles.routeBody}>{r.body}</p>
                {r.href ? (
                  <LinkButton href={r.href} variant="primary">
                    {r.cta}
                  </LinkButton>
                ) : (
                  <Button variant="secondary" disabled aria-disabled="true">
                    Unlocks in an upcoming build stage
                  </Button>
                )}
              </Card>
            ))}
          </Grid>
          <p className={styles.note}>
            Everything runs in your browser and stays on your device — no account,
            no uploads. Not sure? A Quick Safari is the fastest way to try it.
          </p>
        </Section>
      </Shell>
    </main>
  );
}
