import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { BodyFatTool } from './BodyFatTool';

export const metadata: Metadata = {
  title: 'Body-Fat & FFMI Calculator',
  description:
    'Free body-fat percentage calculator using the US Navy method, plus FFMI (fat-free mass index) and lean mass. Educational only, works from your logged measurements.',
  alternates: { canonical: '/nutrition/body-fat' },
};

export default function BodyFatPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Nutrition"
        title="Body-Fat & FFMI Calculator"
        lede="Estimate your body-fat percentage from a few tape measurements, plus your lean mass and FFMI. Pulls straight from the measurements you log on the Body page."
      />
      <Shell>
        <Section tight>
          <BodyFatTool />
        </Section>
      </Shell>
    </main>
  );
}
