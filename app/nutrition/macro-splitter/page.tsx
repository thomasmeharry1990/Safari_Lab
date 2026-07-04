import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { MacroTool } from './MacroTool';

export const metadata: Metadata = {
  title: 'Macro Splitter',
  description:
    'Free macro calculator — split your daily calories into protein, carbs and fat grams with balanced, high-protein or lower-carb presets.',
  alternates: { canonical: '/nutrition/macro-splitter' },
};

export default function MacroPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Nutrition"
        title="Macro Splitter"
        lede="Turn your daily calories into protein, carb and fat targets in grams."
      />
      <Shell>
        <Section tight>
          <MacroTool />
        </Section>
      </Shell>
    </main>
  );
}
