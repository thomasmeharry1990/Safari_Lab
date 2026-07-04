'use client';

import { useMemo, useState } from 'react';
import { HELP_ARTICLES, HELP_CATEGORIES } from '@/lib/content/help';
import styles from './help.module.css';

export function HelpCentre() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return HELP_ARTICLES;
    return HELP_ARTICLES.filter((a) =>
      `${a.q} ${a.keywords} ${a.a.join(' ')}`.toLowerCase().includes(q)
    );
  }, [q]);

  const byCategory = HELP_CATEGORIES.map((cat) => ({
    cat,
    items: filtered.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <input
        type="search"
        className={styles.search}
        placeholder="Search help — “backup”, “progression”, “offline”…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search help articles"
      />

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          No articles matched “{query}”. Try another word, or contact us.
        </p>
      ) : (
        byCategory.map((group) => (
          <section key={group.cat} className={styles.group}>
            <h2 className={styles.catTitle}>{group.cat}</h2>
            {group.items.map((a) => (
              <details key={a.q} className={styles.article} open={!!q}>
                <summary className={styles.summary}>{a.q}</summary>
                <div className={styles.body}>
                  {a.a.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
