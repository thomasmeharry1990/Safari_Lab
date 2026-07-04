/**
 * Safari Lab - site-level constants for SEO (Stage 15).
 *
 * IMPORTANT: SITE_URL is a PLACEHOLDER. Set it to the real production domain
 * before deploying, then submit the sitemap. It is used for metadataBase,
 * canonical URLs, robots.txt, the sitemap and JSON-LD.
 */
export const SITE_URL = 'https://safarilab.app';
export const SITE_NAME = 'Safari Lab';

/** App/tool routes that must never be indexed (per-route noindex). */
export const NOINDEX_PREFIXES = [
  '/start',
  '/workout-generator',
  '/quick-safari',
  '/program',
  '/today',
  '/progress',
  '/settings',
  '/backup',
  '/offline',
] as const;
