import Link from 'next/link';
import styles from './logo.module.css';

/**
 * Safari Lab brand mark. Emblem is an inline SVG using currentColor (gold via
 * CSS), so it inherits colour and needs no external asset. Lion-claw motif +
 * expedition wordmark. Refined art can replace the emblem later without API
 * changes.
 */
export function Logo({
  href = '/',
  showWordmark = true,
  size = 34,
}: {
  href?: string | null;
  showWordmark?: boolean;
  size?: number;
}) {
  const emblem = (
    <svg
      className={styles.emblem}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      {/* three claw strokes */}
      <path
        d="M13 27c1.6-5 3.2-8.4 5.5-11.6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M19 29c1-5.2 2-9 3.4-12.6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M25 28.5c.3-5 .7-8.8 1.6-12.6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );

  const content = (
    <span className={styles.lockup}>
      <span className={styles.emblemWrap}>{emblem}</span>
      {showWordmark ? (
        <span className={styles.wordmark}>
          Safari<span className={styles.wordmarkThin}> Lab</span>
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
