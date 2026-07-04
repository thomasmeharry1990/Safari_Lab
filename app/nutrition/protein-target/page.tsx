import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { ProteinTool } from './ProteinTool';

export const metadata: Metadata = {
  title: 'Protein Target Calculator',
  description:
    'Free protein calculator — find your daily protein target range from body weight (1.6–2.2 g/kg) to build and keep muscle.',
  alternates: { canonical: '/nutrition/protein-target' },
};

export default function ProteinPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Nutrition"
        title="Protein Target"
        lede="A simple daily protein range to support muscle, based on your body weight."
      />
      <Shell>
        <Section tight>
          <ProteinTool />
        </Section>
      </Shell>
    </main>
  );
}
