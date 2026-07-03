import type { Metadata, Viewport } from 'next';
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
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
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
