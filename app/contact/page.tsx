import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/layout/PageIntro';
import { Prose } from '@/components/content/Prose';
import { LinkButton, Section, Shell } from '@/components/ui';
import { CONTACT_EMAIL } from '@/lib/constants/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Safari Lab.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Contact"
        title="Get in touch"
        lede="Questions, feedback or a bug to report? We’d love to hear from you."
      />
      <Shell>
        <Section tight>
          <LinkButton href={`mailto:${CONTACT_EMAIL}`} variant="primary">
            Email {CONTACT_EMAIL}
          </LinkButton>
        </Section>
      </Shell>
      <Prose>
        <h2>Before you email</h2>
        <p>
          Many questions are answered in the <Link href="/help">Help Centre</Link> —
          creating programs, backups, offline use and troubleshooting.
        </p>
        <h2>A note on your data</h2>
        <p>
          Safari Lab stores your training on your device, not on a server. We can’t
          see or recover your workouts, so please keep a <Link href="/backup">save
          file</Link> as your backup.
        </p>
      </Prose>
    </main>
  );
}
