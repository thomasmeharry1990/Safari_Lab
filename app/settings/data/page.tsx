import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { DataControls } from './DataControls';

export const metadata: Metadata = {
  title: 'Data Controls',
  description: 'See what Safari Lab stores on your device and clear it any time.',
  robots: { index: false, follow: false },
};

export default function DataControlsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Data controls"
        title="Your data, in your hands"
        lede="Safari Lab keeps everything on this device. Review it here, or clear it entirely."
      />
      <Shell>
        <Section tight>
          <DataControls />
        </Section>
      </Shell>
    </main>
  );
}
