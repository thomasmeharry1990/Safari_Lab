import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { PlateTool } from './PlateTool';

export const metadata: Metadata = {
  title: 'Barbell Plate Calculator',
  description:
    'Free barbell plate calculator — enter a target weight and see exactly which plates to load per side. Works in kg or lb.',
  alternates: { canonical: '/tools/plate-calculator' },
};

export default function PlateCalculatorPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Free tool"
        title="Barbell Plate Calculator"
        lede="Enter your target weight and Safari Lab shows the plates to load on each side of the bar."
      />
      <Shell>
        <Section tight>
          <PlateTool />
        </Section>
      </Shell>
    </main>
  );
}
