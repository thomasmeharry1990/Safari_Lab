import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Prose } from '@/components/content/Prose';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'How Safari Lab handles your data: workouts stay on your device, nothing is uploaded.',
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Privacy"
        title="Your training stays on your device"
        lede="Safari Lab is built local-first. We designed it so your workout data never has to leave your browser."
      />
      <Prose>
        <h2>What we store, and where</h2>
        <p>
          Your programs, logged sets, progress and settings are stored{' '}
          <strong>in your browser</strong> using IndexedDB. They live on your
          device. Safari Lab has no user accounts and no server database, so
          there is nowhere for us to receive or keep your workout data.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not require an account, email or password.</li>
          <li>We do not upload, sync or back up your workouts to a server.</li>
          <li>We do not sell or share your training data — we never receive it.</li>
        </ul>

        <h2>Your save files</h2>
        <p>
          You can export a <strong>.slfit</strong> save file at any time and
          import it on another device. Those files are yours. Keep them safe —
          because your data is local, clearing your browser storage removes it,
          and a save file is how you recover.
        </p>

        <h2>Analytics and ads</h2>
        <p>
          Safari Lab may be supported by ads in future. This page will be updated
          with a clear, honest description before any advertising or analytics
          that uses cookies is introduced. We will not claim &ldquo;no
          tracking&rdquo; while running ads that do.
        </p>

        <h2>Questions</h2>
        <p>
          This is a living document for a product that is still being built. If
          anything here is unclear, it will be expanded as Safari Lab grows.
        </p>
      </Prose>
    </main>
  );
}
