import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLanding, getLandings } from '@/lib/content/landings';
import { LandingPage } from '@/components/seo/LandingPage';

const GROUP = 'goals' as const;

export function generateStaticParams(): { slug: string }[] {
  return getLandings(GROUP).map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const l = getLanding(GROUP, params.slug);
  if (!l) return { title: 'Not found' };
  return {
    title: l.seo.title,
    description: l.seo.description,
    alternates: { canonical: `/goals/${l.slug}` },
  };
}

export default function GoalLanding({ params }: { params: { slug: string } }) {
  const l = getLanding(GROUP, params.slug);
  if (!l) notFound();
  return <LandingPage landing={l} />;
}
