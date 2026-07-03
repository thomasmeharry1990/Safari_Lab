import type { Metadata } from 'next';
import { TodaySession } from './TodaySession';

export const metadata: Metadata = {
  title: "Today's Safari",
  description: 'Your current training session, ready for the gym.',
  robots: { index: false, follow: false },
};

export default function TodayPage() {
  return (
    <main>
      <TodaySession />
    </main>
  );
}
