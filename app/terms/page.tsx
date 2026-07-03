import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Prose } from '@/components/content/Prose';

export const metadata: Metadata = {
  title: 'Terms & Fitness Disclaimer',
  description:
    'Safari Lab is an educational fitness tool, not medical advice. Train responsibly.',
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Terms & disclaimer"
        title="Train smart, train safe"
        lede="Safari Lab is a free educational training tool. Please read how to use it responsibly."
      />
      <Prose>
        <h2>Not medical advice</h2>
        <p>
          Safari Lab provides general fitness information and workout planning
          for educational purposes only. It is <strong>not</strong> medical
          advice and is not a substitute for guidance from a qualified doctor,
          physiotherapist or coach. If you have an injury, a health condition or
          any doubt, seek professional advice before training.
        </p>

        <h2>Train within your ability</h2>
        <ul>
          <li>Warm up, use good form and progress gradually.</li>
          <li>Stop if you feel sharp pain, dizziness or anything unusual.</li>
          <li>
            Weights, rep ranges and progressions are suggestions — adjust them to
            your own strength and experience.
          </li>
        </ul>

        <h2>No guaranteed results</h2>
        <p>
          Results depend on many factors outside a workout plan, including
          nutrition, sleep, recovery and consistency. Safari Lab does not promise
          specific outcomes.
        </p>

        <h2>Use of the tool</h2>
        <p>
          Safari Lab is provided &ldquo;as is&rdquo;, free of charge, and runs in
          your browser. Because your data is stored locally, you are responsible
          for exporting save files to keep your history safe.
        </p>
      </Prose>
    </main>
  );
}
