import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { BRAND_TAGLINE } from '@/lib/constants/brand';
import styles from './footer.module.css';

const TRAIN_LINKS: { href: string; label: string }[] = [
  { href: '/start', label: 'Start Your Safari' },
  { href: '/exercise-library', label: 'Exercise Library' },
  { href: '/backup', label: 'Backup & save files' },
];

const EXPLORE_LINKS: { href: string; label: string }[] = [
  { href: '/goals/build-muscle', label: 'Build muscle' },
  { href: '/programs', label: 'Program templates' },
  { href: '/splits/push-pull-legs', label: 'Push / Pull / Legs' },
  { href: '/muscle-groups/glutes', label: 'Glute training' },
  { href: '/tools', label: 'Free tools' },
  { href: '/nutrition', label: 'Nutrition calculators' },
];

const TRUST_LINKS: { href: string; label: string }[] = [
  { href: '/help', label: 'Help Centre' },
  { href: '/contact', label: 'Contact' },
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

        <nav className={styles.linkCol} aria-label="Explore">
          <h2 className={styles.colTitle}>Explore</h2>
          {EXPLORE_LINKS.map((l) => (
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
