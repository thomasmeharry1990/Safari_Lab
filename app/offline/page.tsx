import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Prose } from '@/components/content/Prose';
import { LinkButton, Section, Shell } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Offline',
  description: 'How Safari Lab works offline once it has loaded.',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main>
      <PageIntro
        eyebrow="Offline"
        title="You’re training off the grid"
        lede="Safari Lab keeps working without a connection once it has loaded. Your workouts are on your device, not in the cloud."
      />
      <Shell>
        <Section tight>
          <LinkButton href="/today" variant="primary">
            Go to Today’s Safari
          </LinkButton>
        </Section>
      </Shell>
      <Prose>
        <h2>What works offline</h2>
        <ul>
          <li>Logging your workout in gym mode — sets, rest timer and plates.</li>
          <li>Your active program, exercise library and progress.</li>
          <li>Exporting and importing your save file.</li>
        </ul>

        <h2>What needs a connection</h2>
        <ul>
          <li>Loading Safari Lab for the very first time.</li>
          <li>Ads, where shown, are hidden while offline and never block your session.</li>
        </ul>

        <p>
          Reconnect whenever you like — nothing you logged offline is lost, because
          it was saved to this device the moment you entered it.
        </p>
      </Prose>
    </main>
  );
}
