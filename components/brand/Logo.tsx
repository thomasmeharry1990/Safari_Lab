import Link from 'next/link';
import { BRAND_MOTTO } from '@/lib/constants/brand';
import styles from './logo.module.css';

/**
 * Safari Lab brand mark - compass emblem (acacia + mountains + sun + barbell)
 * matching the supplied brand guide, plus the SAFARI LAB wordmark.
 *
 * Emblem colours come from CSS classes (tokens-driven) so nothing hard-codes
 * brand hex here. The emblem is decorative; the link carries the accessible name.
 */
export function Emblem({ size = 34 }: { size?: number }) {
  return (
    <svg
      className={styles.emblem}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* compass ring */}
      <circle className={styles.ring} cx="32" cy="32" r="30" strokeWidth="2.4" />
      {/* cardinal star points */}
      <polygon className={styles.point} points="32,1.5 34.4,9 32,12 29.6,9" />
      <polygon className={styles.point} points="32,62.5 34.4,55 32,52 29.6,55" />
      <polygon className={styles.point} points="62.5,32 55,34.4 52,32 55,29.6" />
      <polygon className={styles.point} points="1.5,32 9,34.4 12,32 9,29.6" />

      {/* scene disc */}
      <circle className={styles.disc} cx="32" cy="28" r="16.5" strokeWidth="1.2" />
      <clipPath id="sl-scene">
        <circle cx="32" cy="28" r="15.8" />
      </clipPath>
      <g clipPath="url(#sl-scene)">
        {/* sun (prominent cream disc behind the range) */}
        <circle className={styles.sun} cx="32" cy="26" r="11" />
        {/* mountains */}
        <polygon className={styles.mtnBack} points="30,44 43,29 55,44" />
        <polygon className={styles.mtnFront} points="13,44 26,26 38,44" />
        {/* acacia tree, silhouetted against the sun */}
        <line className={styles.tree} x1="19" y1="40" x2="19" y2="27" />
        <ellipse className={styles.treeCanopy} cx="19" cy="26" rx="7" ry="2.2" />
        {/* birds */}
        <path className={styles.bird} d="M35 20c.9-1 1.8-1 2.6 0 .8-1 1.7-1 2.6 0" />
      </g>

      {/* barbell */}
      <g className={styles.barbell}>
        <line x1="15" y1="49" x2="49" y2="49" strokeWidth="2" />
        <line x1="22" y1="44" x2="22" y2="54" strokeWidth="3" />
        <line x1="42" y1="44" x2="42" y2="54" strokeWidth="3" />
        <line x1="18" y1="45.5" x2="18" y2="52.5" strokeWidth="2.4" />
        <line x1="46" y1="45.5" x2="46" y2="52.5" strokeWidth="2.4" />
      </g>
    </svg>
  );
}

export function Logo({
  href = '/',
  showWordmark = true,
  showMotto = false,
  size = 34,
}: {
  href?: string | null;
  showWordmark?: boolean;
  showMotto?: boolean;
  size?: number;
}) {
  const content = (
    <span className={styles.lockup}>
      <span className={styles.emblemWrap}>
        <Emblem size={size} />
      </span>
      {showWordmark ? (
        <span className={styles.text}>
          <span className={styles.wordmark}>
            Safari<span className={styles.wordmarkThin}> Lab</span>
          </span>
          {showMotto ? <span className={styles.motto}>{BRAND_MOTTO}</span> : null}
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={styles.link} aria-label="Safari Lab home">
        {content}
      </Link>
    );
  }
  return content;
}
