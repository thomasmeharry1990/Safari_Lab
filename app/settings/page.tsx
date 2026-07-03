import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { SettingsForm } from './SettingsForm';
import styles from './settings.module.css';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Units, rest timer, haptics and data preferences — all stored on your device.',
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Settings"
        title="Your preferences"
        lede="Everything here is stored locally on this device — no account, no upload."
      />
      <Shell>
        <Section tight>
          <SettingsForm />
          <p className={styles.autosave}>
            Manage your saved data on the{' '}
            <Link href="/settings/data">Data controls</Link> page.
          </p>
        </Section>
      </Shell>
    </main>
  );
}
