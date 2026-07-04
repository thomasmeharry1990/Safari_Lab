import type { Metadata, Viewport } from 'next';
// Self-hosted brand fonts - woff2 vendored + bundled at build (no CDN, no
// build-time network). Raleway (display) + Montserrat (body).
import '@fontsource/raleway/600.css';
import '@fontsource/raleway/700.css';
import '@fontsource/raleway/800.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import { APP_DISPLAY_NAME, DOCTRINE_STATEMENT } from '@/lib/constants/doctrine';
import { BRAND_COLORS } from '@/lib/constants/brand';
import { SITE_NAME, SITE_URL } from '@/lib/constants/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LocalDataProvider } from '@/lib/state/LocalDataProvider';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import './globals.css';

/**
 * Root layout.
 *
 * Default is indexable (marketing + content pages). App/tool pages set their own
 * `robots: { index: false }` so unfinished/private app screens stay out of search
 * (doctrine: no unfinished page indexable).
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_DISPLAY_NAME} - Free Adaptive Workout Planner`,
    template: `%s | ${APP_DISPLAY_NAME}`,
  },
  description: DOCTRINE_STATEMENT,
  applicationName: APP_DISPLAY_NAME,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${APP_DISPLAY_NAME} - Free Adaptive Workout Planner`,
    description: DOCTRINE_STATEMENT,
    url: SITE_URL,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_DISPLAY_NAME} - Free Adaptive Workout Planner`,
    description: DOCTRINE_STATEMENT,
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: APP_DISPLAY_NAME,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLORS.black,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocalDataProvider>
          <Header />
          {children}
          <Footer />
        </LocalDataProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
