import type { Metadata } from 'next';
import { LinkButton, Section, Shell } from '@/components/ui';
import { PageIntro } from '@/components/layout/PageIntro';

export const metadata: Metadata = {
  title: 'Off the trail',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main>
      <PageIntro
        eyebrow="404"
        title="You’ve wandered off the trail"
        lede="This page doesn’t exist — or hasn’t been built yet. Let’s get you back to camp."
      />
      <Shell>
        <Section tight>
          <LinkButton href="/" variant="primary">
            Back to home
          </LinkButton>
        </Section>
      </Shell>
    </main>
  );
}
