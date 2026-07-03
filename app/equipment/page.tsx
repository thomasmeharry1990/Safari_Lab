import type { Metadata } from 'next';
import { HubPage } from '@/components/seo/HubPage';

export const metadata: Metadata = {
  title: 'Workouts by Equipment — Gym, Dumbbells, Bodyweight',
  description:
    'Generate a free program for the equipment you have — full gym, dumbbells only, or bodyweight anywhere.',
  alternates: { canonical: '/equipment' },
};

export default function EquipmentHub() {
  return <HubPage group="equipment" />;
}
