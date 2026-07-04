import type { MetadataRoute } from 'next';
import { BRAND_COLORS } from '@/lib/constants/brand';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Safari Lab - Adaptive Workout Planner',
    short_name: 'Safari Lab',
    description:
      'Free, non-server, local-first adaptive workout planner and tracker. Discover. Train. Evolve.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: BRAND_COLORS.black,
    theme_color: BRAND_COLORS.black,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
