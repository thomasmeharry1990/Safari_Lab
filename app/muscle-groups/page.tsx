import type { Metadata } from 'next';
import { HubPage } from '@/components/seo/HubPage';

export const metadata: Metadata = {
  title: 'Muscle Groups — Target-a-Body-Part Workouts',
  description:
    'Learn how to train each muscle group and generate a free program that prioritises the body part you care about.',
  alternates: { canonical: '/muscle-groups' },
};

export default function MuscleGroupsHub() {
  return <HubPage group="muscle-groups" />;
}
