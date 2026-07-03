import type { Metadata } from 'next';
import { HubPage } from '@/components/seo/HubPage';

export const metadata: Metadata = {
  title: 'Training Splits — PPL, Upper/Lower, Full Body',
  description:
    'Understand the common training splits and generate a free program in the split that fits your week.',
  alternates: { canonical: '/splits' },
};

export default function SplitsHub() {
  return <HubPage group="splits" />;
}
