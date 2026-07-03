import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Section, Shell } from '@/components/ui';
import { getAllExercises } from '@/lib/data/exercises';
import { ExerciseLibrary } from './ExerciseLibrary';

export const metadata: Metadata = {
  title: 'Exercise Library',
  description:
    'Search and filter a library of gym exercises by muscle, equipment and level, with form cues and substitutions.',
  robots: { index: false, follow: false },
};

export default function ExerciseLibraryPage() {
  const total = getAllExercises().length;
  return (
    <main>
      <PageIntro
        eyebrow="Exercise Library"
        title="Find your next movement"
        lede={`Search ${total} movements by muscle, equipment and experience level. Every entry has form cues and smart substitutions for when the rack is taken.`}
      />
      <Shell>
        <Section tight>
          <ExerciseLibrary />
        </Section>
      </Shell>
    </main>
  );
}
