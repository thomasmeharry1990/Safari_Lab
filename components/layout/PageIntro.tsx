import type { ReactNode } from 'react';
import { Badge, Section, Shell } from '@/components/ui';
import styles from './pageIntro.module.css';

/** Consistent page header: eyebrow badge, title and optional lede. */
export function PageIntro({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Shell>
      <Section className={styles.intro}>
        {eyebrow ? <Badge tone="olive">{eyebrow}</Badge> : null}
        <h1 className={styles.title}>{title}</h1>
        {lede ? <p className={styles.lede}>{lede}</p> : null}
        {children}
      </Section>
    </Shell>
  );
}
