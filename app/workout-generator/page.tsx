import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { GeneratorWizard } from './GeneratorWizard';

export const metadata: Metadata = {
  title: 'Program Generator',
  description:
    'Build a free, adaptive gym program from your goal, days, priority muscles and equipment — generated in your browser.',
  robots: { index: false, follow: false },
};

export default function WorkoutGeneratorPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Program Generator"
        title="Build your Safari"
        lede="Answer a few questions and Safari Lab builds a balanced, adaptive training block — deterministic and fully in your browser."
      />
      <Shell>
        <Section tight>
          <GeneratorWizard />
        </Section>
      </Shell>
    </main>
  );
}
