import type { Metadata } from 'next';
import { QuickSafari } from './QuickSafari';

export const metadata: Metadata = {
  title: 'Quick Safari',
  description:
    'Generate and log a one-off workout in your browser — built around your time, equipment and focus. No program or account needed.',
  robots: { index: false, follow: false },
};

export default function QuickSafariPage() {
  return (
    <main>
      <QuickSafari />
    </main>
  );
}
