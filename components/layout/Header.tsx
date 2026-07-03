import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { COPY } from '@/lib/constants/brand';
import styles from './header.module.css';

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/about', label: 'About' },
];

/**
 * Site header. Responsive with no client JS: desktop shows inline nav, mobile
 * uses a native <details> disclosure. Later stages (gym mode) render without
 * this marketing header.
 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />

        <nav className={styles.desktopNav} aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.navLink}>
              {l.label}
            </Link>
          ))}
          <Link href="/start" className={styles.cta}>
            {COPY.startCta}
          </Link>
        </nav>

        <details className={styles.mobileNav}>
          <summary className={styles.menuButton} aria-label="Open menu">
            <span className={styles.menuBars} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </summary>
          <div className={styles.menuPanel}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={styles.menuLink}>
                {l.label}
              </Link>
            ))}
            <Link href="/start" className={styles.menuCta}>
              {COPY.startCta}
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
