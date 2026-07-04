import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { HelpCentre } from './HelpCentre';

export const metadata: Metadata = {
  title: 'Help Centre',
  description:
    'Answers to common Safari Lab questions — creating programs, gym mode, progression, backups and offline use.',
  alternates: { canonical: '/help' },
};

export default function HelpPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Help Centre"
        title="How can we help?"
        lede="Quick answers on programs, training, your data and offline use. Still stuck? Get in touch."
      />
      <Shell>
        <Section tight>
          <HelpCentre />
          <p style={{ marginTop: 'var(--sl-space-6)', color: 'var(--sl-fg-muted)' }}>
            Can’t find it? <Link href="/contact">Contact us</Link>.
          </p>
        </Section>
      </Shell>
    </main>
  );
}
