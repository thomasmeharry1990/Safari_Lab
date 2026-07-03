'use client';

import { ADS_ENABLED, AD_LABEL } from '@/lib/constants/ads';
import { useOnline } from '@/lib/hooks/useOnline';
import styles from './adslot.module.css';

/**
 * A respectful, gated ad slot. Renders nothing while ads are disabled or the user
 * is offline. When live, it reserves a fixed height (no layout shift) and is only
 * ever placed in doctrine-allowed positions - never inside gym-mode set logging.
 */
export function AdSlot({
  variant = 'banner',
  label,
}: {
  variant?: 'banner' | 'rectangle';
  label?: string;
}) {
  const online = useOnline();
  if (!ADS_ENABLED || !online) return null;

  return (
    <aside
      className={variant === 'rectangle' ? styles.rectangle : styles.banner}
      aria-label="Advertisement"
      data-ad-slot
    >
      <span className={styles.label}>{label ?? AD_LABEL}</span>
    </aside>
  );
}
