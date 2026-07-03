import type { Metadata } from 'next';
import { HubPage } from '@/components/seo/HubPage';

export const metadata: Metadata = {
  title: 'Program Templates — Ready-Made Workout Plans',
  description:
    'Browse ready-made program shapes like 4-day upper/lower and back-and-glutes priority, then generate and lock one for free.',
  alternates: { canonical: '/programs' },
};

export default function ProgramsHub() {
  return <HubPage group="programs" />;
}
