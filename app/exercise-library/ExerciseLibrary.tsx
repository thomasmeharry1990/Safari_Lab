'use client';

import { useMemo, useState } from 'react';
import type { ExperienceLevel, MuscleGroup } from '@/lib/models/exercise';
import {
  filterExercises,
  getAllExercises,
  getEquipmentFacets,
  getMuscleFacets,
  LEVEL_FACETS,
} from '@/lib/data/exercises';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';
import { FavouriteButton } from '@/components/exercise/FavouriteButton';
import { AdSlot } from '@/components/ads/AdSlot';
import { Button } from '@/components/ui';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import styles from './library.module.css';

const ALL = getAllExercises();
const MUSCLES = getMuscleFacets();
const EQUIPMENT = getEquipmentFacets();

export function ExerciseLibrary() {
  const { favouriteIds } = useLocalData();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all');
  const [equipment, setEquipment] = useState<string | 'all'>('all');
  const [level, setLevel] = useState<ExperienceLevel | 'all'>('all');
  const [favOnly, setFavOnly] = useState(false);

  const results = useMemo(() => {
    const base = filterExercises({ query, muscle, equipment, level }, ALL);
    return favOnly ? base.filter((ex) => favouriteIds.includes(ex.id)) : base;
  }, [query, muscle, equipment, level, favOnly, favouriteIds]);

  const hasFilters =
    query !== '' ||
    muscle !== 'all' ||
    equipment !== 'all' ||
    level !== 'all' ||
    favOnly;

  function clear() {
    setQuery('');
    setMuscle('all');
    setEquipment('all');
    setLevel('all');
    setFavOnly(false);
  }

  return (
    <div>
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search movements, muscles or equipment…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search exercises"
        />
        <div className={styles.filters}>
          <select
            className={styles.select}
            value={muscle}
            onChange={(e) => setMuscle(e.target.value as MuscleGroup | 'all')}
            aria-label="Filter by muscle"
          >
            <option value="all">All muscles</option>
            {MUSCLES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            aria-label="Filter by equipment"
          >
            <option value="all">All equipment</option>
            {EQUIPMENT.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={level}
            onChange={(e) => setLevel(e.target.value as ExperienceLevel | 'all')}
            aria-label="Filter by level"
          >
            <option value="all">All levels</option>
            {LEVEL_FACETS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={favOnly ? styles.favToggleOn : styles.favToggle}
            onClick={() => setFavOnly((v) => !v)}
            aria-pressed={favOnly}
          >
            <span aria-hidden>{favOnly ? '★' : '☆'}</span> Favourites
            {favouriteIds.length ? ` (${favouriteIds.length})` : ''}
          </button>
          {hasFilters ? (
            <Button variant="ghost" onClick={clear}>
              Clear filters
            </Button>
          ) : null}
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        {results.length} {results.length === 1 ? 'movement' : 'movements'}
      </p>

      {results.length === 0 ? (
        <div className={styles.empty}>
          <p>{favOnly ? 'No favourites match this search yet.' : 'No movement found for that search.'}</p>
          <p className={styles.emptyHint}>
            {favOnly
              ? 'Tap the star on any exercise to add it to your favourites.'
              : 'Try another muscle, equipment type or clear your filters.'}
          </p>
          <Button variant="secondary" onClick={clear}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {results.map((ex) => (
              <div key={ex.id} className={styles.cardWrap}>
                <ExerciseCard ex={ex} />
                <div className={styles.favOverlay}>
                  <FavouriteButton exerciseId={ex.id} variant="icon" />
                </div>
              </div>
            ))}
          </div>
          {/* Ad below the first result group only, never between swap buttons. */}
          <AdSlot />
        </>
      )}
    </div>
  );
}
