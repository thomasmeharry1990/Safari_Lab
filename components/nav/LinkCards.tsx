import Link from 'next/link';
import { Grid } from '@/components/ui';
import styles from './linkcards.module.css';

export function LinkCards({
  items,
  cols = 3,
}: {
  items: { href: string; title: string; desc: string }[];
  cols?: number;
}) {
  return (
    <Grid cols={cols}>
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={styles.card}>
          <h2 className={styles.title}>{i.title}</h2>
          <p className={styles.desc}>{i.desc}</p>
          <span className={styles.cta}>Open →</span>
        </Link>
      ))}
    </Grid>
  );
}
