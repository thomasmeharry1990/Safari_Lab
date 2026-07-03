import type { Metadata } from 'next';
import { ProgressDashboard } from './ProgressDashboard';

export const metadata: Metadata = {
  title: 'Progress',
  description:
    'Your local training progress — PRs, volume, strength trends and session history. Nothing leaves your device.',
  robots: { index: false, follow: false },
};

export default function ProgressPage() {
  return (
    <main>
      <ProgressDashboard />
    </main>
  );
}
