import type { Metadata } from 'next';
import { BodyTracker } from '@/components/body/BodyTracker';

export const metadata: Metadata = {
  title: 'Body Tracking',
  description: 'Log your bodyweight and measurements over time, stored locally on your device.',
  robots: { index: false, follow: false },
};

export default function BodyPage() {
  return (
    <main>
      <BodyTracker />
    </main>
  );
}
