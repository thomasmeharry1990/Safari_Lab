import type { Metadata } from 'next';
import { HubPage } from '@/components/seo/HubPage';

export const metadata: Metadata = {
  title: 'Training Goals — Build a Plan Around Yours',
  description:
    'Choose a training goal — build muscle, get stronger or general fitness — and generate a free adaptive program built around it.',
  alternates: { canonical: '/goals' },
};

export default function GoalsHub() {
  return <HubPage group="goals" />;
}
