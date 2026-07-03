import type { ReactNode } from 'react';
import { Section, Shell } from '@/components/ui';
import styles from './prose.module.css';

/** Readable long-form content column for support/legal pages. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <Shell>
      <Section tight>
        <div className={styles.prose}>{children}</div>
      </Section>
    </Shell>
  );
}
