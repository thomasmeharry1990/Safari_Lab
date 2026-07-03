'use client';

import { useLocalData } from '@/lib/state/LocalDataProvider';
import { PageIntro } from '@/components/layout/PageIntro';
import { GymMode } from '@/components/gym/GymMode';
import { LinkButton, Section, Shell } from '@/components/ui';

export function TodaySession() {
  const { hydrated, activeProgram } = useLocalData();

  if (!hydrated) {
    return <PageIntro eyebrow="Today's Safari" title="Your session" lede="Loading…" />;
  }

  if (!activeProgram) {
    return (
      <>
        <PageIntro
          eyebrow="Today's Safari"
          title="No expedition in progress"
          lede="Lock a program and your next session shows up here, ready to train."
        />
        <Shell>
          <Section tight>
            <LinkButton href="/workout-generator" variant="primary">
              Build a program
            </LinkButton>
          </Section>
        </Shell>
      </>
    );
  }

  return <GymMode />;
}
