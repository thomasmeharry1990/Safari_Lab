'use client';

import { useLocalData } from '@/lib/state/LocalDataProvider';
import styles from './favouriteButton.module.css';

/**
 * Star toggle for favouriting an exercise. `variant="icon"` is a compact star
 * for cards; `variant="labelled"` is a full button for the detail page.
 */
export function FavouriteButton({
  exerciseId,
  variant = 'labelled',
}: {
  exerciseId: string;
  variant?: 'icon' | 'labelled';
}) {
  const { hydrated, favouriteIds, toggleFavourite } = useLocalData();
  const isFav = favouriteIds.includes(exerciseId);
  const label = isFav ? 'Remove from favourites' : 'Add to favourites';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={isFav ? styles.iconOn : styles.icon}
        onClick={() => toggleFavourite(exerciseId)}
        aria-pressed={isFav}
        aria-label={label}
        title={label}
        disabled={!hydrated}
      >
        <span aria-hidden>{isFav ? '★' : '☆'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={isFav ? styles.btnOn : styles.btn}
      onClick={() => toggleFavourite(exerciseId)}
      aria-pressed={isFav}
      disabled={!hydrated}
    >
      <span aria-hidden>{isFav ? '★' : '☆'}</span>
      {isFav ? 'Favourited' : 'Favourite'}
    </button>
  );
}
