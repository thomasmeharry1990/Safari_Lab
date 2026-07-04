import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { TdeeTool } from './TdeeTool';

export const metadata: Metadata = {
  title: 'TDEE Calculator',
  description:
    'Free TDEE calculator — estimate your maintenance calories from BMR and activity, with fat-loss and lean-gain targets. Educational only.',
  alternates: { canonical: '/nutrition/tdee-calculator' },
};

export default function TdeePage() {
  return (
    <main>
      <PageIntro
        eyebrow="Nutrition"
        title="TDEE Calculator"
        lede="Estimate your daily maintenance calories, plus a starting point for fat loss or lean gains."
      />
      <Shell>
        <Section tight>
          <TdeeTool />
        </Section>
      </Shell>
    </main>
  );
}
