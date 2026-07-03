import type { Metadata } from 'next';
import { ProgramDashboard } from './ProgramDashboard';

export const metadata: Metadata = {
  title: 'My Program',
  description: 'Your active Safari Lab training program — this week at a glance.',
  robots: { index: false, follow: false },
};

export default function ProgramPage() {
  return (
    <main>
      <ProgramDashboard />
    </main>
  );
}
