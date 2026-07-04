import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { OneRmTool } from './OneRmTool';

export const metadata: Metadata = {
  title: 'One-Rep Max (1RM) Calculator',
  description:
    'Free 1RM calculator — estimate your one-rep max from a weight and reps, with a full percentage-of-1RM training table. kg or lb.',
  alternates: { canonical: '/tools/one-rep-max-calculator' },
};

export default function OneRepMaxPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Free tool"
        title="One-Rep Max Calculator"
        lede="Estimate your 1RM from a recent set, then read off your training percentages."
      />
      <Shell>
        <Section tight>
          <OneRmTool />
        </Section>
      </Shell>
    </main>
  );
}
