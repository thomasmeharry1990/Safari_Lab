import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { LinkCards } from '@/components/nav/LinkCards';
import { Section, Shell } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Free Training Tools',
  description:
    'Free browser tools for lifters — a barbell plate calculator and a one-rep-max calculator. No account, nothing uploaded.',
  alternates: { canonical: '/tools' },
};

const TOOLS = [
  {
    href: '/tools/plate-calculator',
    title: 'Plate Calculator',
    desc: 'Load the bar right — see the plates per side for any target weight, in kg or lb.',
  },
  {
    href: '/tools/one-rep-max-calculator',
    title: '1RM Calculator',
    desc: 'Estimate your one-rep max and read off your training percentages.',
  },
  {
    href: '/nutrition',
    title: 'Nutrition calculators',
    desc: 'TDEE, macro splitter and protein target — the numbers behind your training.',
  },
];

export default function ToolsHub() {
  return (
    <main>
      <PageIntro
        eyebrow="Free tools"
        title="Training tools"
        lede="Handy calculators that run entirely in your browser — no account, nothing uploaded."
      />
      <Shell>
        <Section tight>
          <LinkCards items={TOOLS} />
        </Section>
      </Shell>
    </main>
  );
}
