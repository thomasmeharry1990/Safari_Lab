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
import { Button } from '@/components/ui';
import styles from './library.module.css';

const ALL = getAllExercises();
const MUSCLES = getMuscleFacets();
const EQUIPMENT = getEquipmentFacets();

export function ExerciseLibrary() {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all');
  const [equipment, setEquipment] = useState<string | 'all'>('all');
  const [level, setLevel] = useState<ExperienceLevel | 'all'>('all');

  const results = useMemo(
    () => filterExercises({ query, muscle, equipment, level }, ALL),
    [query, muscle, equipment, level]
  );

  const hasFilters =
    query !== '' || muscle !== 'all' || equipment !== 'all' || level !== 'all';

  function clear() {
    setQuery('');
    setMuscle('all');
    setEquipment('all');
    setLevel('all');
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
          <p>No movement found for that search.</p>
          <p className={styles.emptyHint}>
            Try another muscle, equipment type or clear your filters.
          </p>
          <Button variant="secondary" onClick={clear}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {results.map((ex) => (
            <ExerciseCard key={ex.id} ex={ex} />
          ))}
        </div>
      )}
    </div>
  );
}
