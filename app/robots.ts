import type { MetadataRoute } from 'next';
import { NOINDEX_PREFIXES, SITE_URL } from '@/lib/constants/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: NOINDEX_PREFIXES.map((p) => `${p}/`),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
