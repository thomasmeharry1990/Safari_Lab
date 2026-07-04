import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { LinkCards } from '@/components/nav/LinkCards';
import { Section, Shell } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Nutrition Calculators',
  description:
    'Free nutrition calculators — TDEE / maintenance calories, macro splitter and daily protein target. Educational, local, no account.',
  alternates: { canonical: '/nutrition' },
};

const TOOLS = [
  {
    href: '/nutrition/tdee-calculator',
    title: 'TDEE Calculator',
    desc: 'Estimate your maintenance calories, plus fat-loss and lean-gain targets.',
  },
  {
    href: '/nutrition/macro-splitter',
    title: 'Macro Splitter',
    desc: 'Split your calories into protein, carb and fat grams.',
  },
  {
    href: '/nutrition/protein-target',
    title: 'Protein Target',
    desc: 'A daily protein range to build and keep muscle, from your body weight.',
  },
];

export default function NutritionHub() {
  return (
    <main>
      <PageIntro
        eyebrow="Nutrition"
        title="Nutrition calculators"
        lede="Educational calculators for the numbers behind your training. Not dietary advice — just a sensible starting point."
      />
      <Shell>
        <Section tight>
          <LinkCards items={TOOLS} />
        </Section>
      </Shell>
    </main>
  );
}
