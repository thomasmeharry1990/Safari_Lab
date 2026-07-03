import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { BRAND_TAGLINE } from '@/lib/constants/brand';
import styles from './footer.module.css';

const TRAIN_LINKS: { href: string; label: string }[] = [
  { href: '/start', label: 'Start Your Safari' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#features', label: 'Features' },
];

const TRUST_LINKS: { href: string; label: string }[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms & disclaimer' },
  { href: '/about', label: 'About' },
];

/** Site footer. Carries the local-first promise and the fitness disclaimer. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Logo showMotto />
          <p className={styles.tagline}>{BRAND_TAGLINE}</p>
          <p className={styles.promise}>
            Your workouts stay on your device. No account, no uploads, no
            tracking of your training data.
          </p>
        </div>

        <nav className={styles.linkCol} aria-label="Train">
          <h2 className={styles.colTitle}>Train</h2>
          {TRAIN_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.footLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className={styles.linkCol} aria-label="Trust">
          <h2 className={styles.colTitle}>Trust</h2>
          {TRUST_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.footLink}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {year} Safari Lab. A free, local-first training tool.</p>
        <p className={styles.disclaimer}>
          Educational fitness tool only &mdash; not medical advice. Train within
          your ability and seek professional guidance where needed.
        </p>
      </div>
    </footer>
  );
}
