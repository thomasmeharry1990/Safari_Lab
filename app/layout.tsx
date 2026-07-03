import type { Metadata, Viewport } from 'next';
import { APP_DISPLAY_NAME, DOCTRINE_STATEMENT } from '@/lib/constants/doctrine';
import { BRAND_COLORS } from '@/lib/constants/brand';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LocalDataProvider } from '@/lib/state/LocalDataProvider';
import './globals.css';

/**
 * Root layout.
 *
 * NOTE: the whole site is a pre-launch shell during staged build. Per doctrine
 * "no unfinished public page is indexable", robots is set to noindex globally
 * for now. This is relaxed per-route in Stage 15 (SEO) once pages are finished.
 */
export const metadata: Metadata = {
  title: {
    default: `${APP_DISPLAY_NAME} - Adaptive Workout Planner`,
    template: `%s | ${APP_DISPLAY_NAME}`,
  },
  description: DOCTRINE_STATEMENT,
  applicationName: APP_DISPLAY_NAME,
  robots: { index: false, follow: false },
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
      </body>
    </html>
  );
}
