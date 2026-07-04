import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants/site';
import { getAllExercises } from '@/lib/data/exercises';
import { GROUP_META, LANDINGS } from '@/lib/content/landings';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/help',
    '/contact',
    '/exercise-library',
    '/goals',
    '/splits',
    '/muscle-groups',
    '/equipment',
    '/programs',
  ];
  const exercisePaths = getAllExercises().map((e) => `/exercises/${e.slug}`);
  const landingPaths = LANDINGS.map((l) => `${GROUP_META[l.group].path}/${l.slug}`);

  return [...staticPaths, ...exercisePaths, ...landingPaths].map((path) => ({
    url: `${SITE_URL}${path}/`.replace(`${SITE_URL}//`, `${SITE_URL}/`),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
