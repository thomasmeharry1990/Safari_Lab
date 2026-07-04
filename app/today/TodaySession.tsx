'use client';

import { useLocalData } from '@/lib/state/LocalDataProvider';
import { PageIntro } from '@/components/layout/PageIntro';
import { GymMode } from '@/components/gym/GymMode';

export function TodaySession() {
  const { hydrated } = useLocalData();

  if (!hydrated) {
    return <PageIntro eyebrow="Today's Safari" title="Your session" lede="Loading…" />;
  }

  // GymMode owns every state below hydration - including the just-completed block
  // report, which must survive the moment activeProgram becomes null.
  return <GymMode />;
}
