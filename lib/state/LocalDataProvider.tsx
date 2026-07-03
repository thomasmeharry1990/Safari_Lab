'use client';

/**
 * Safari Lab - local data context (Stage 6).
 * Hydrates settings, exercise overrides and app meta from IndexedDB on mount and
 * write-through auto-saves every change. This is the app's single source of local
 * state; components read it with useLocalData().
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ExerciseOverride, UserSettings } from '@/lib/models/save-file';
import {
  clearAllData,
  DEFAULT_SETTINGS,
  deleteOverride,
  getAppMeta,
  getOverrides,
  getSettings,
  putOverride,
  saveSettings,
  type AppMeta,
} from '@/lib/db/repo';

interface LocalDataValue {
  hydrated: boolean;
  settings: UserSettings;
  overrides: ExerciseOverride[];
  appMeta: AppMeta | null;
  blockedIds: string[];
  favouriteIds: string[];
  updateSettings: (patch: Partial<UserSettings>) => void;
  blockExercise: (exerciseId: string) => void;
  unblockExercise: (exerciseId: string) => void;
  toggleFavourite: (exerciseId: string) => void;
  clearAll: () => Promise<void>;
}

const LocalDataContext = createContext<LocalDataValue | null>(null);

function isEmptyOverride(o: ExerciseOverride): boolean {
  return !o.blocked && !o.favourite && !o.note;
}

export function LocalDataProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [overrides, setOverrides] = useState<ExerciseOverride[]>([]);
  const [appMeta, setAppMeta] = useState<AppMeta | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [s, o, m] = await Promise.all([
          getSettings(),
          getOverrides(),
          getAppMeta(),
        ]);
        if (!active) return;
        setSettings(s);
        setOverrides(o);
        setAppMeta(m);
      } catch {
        // IndexedDB unavailable (private mode, blocked) - stay on defaults.
      } finally {
        if (active) setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  const upsertOverride = useCallback(
    (exerciseId: string, patch: Partial<Omit<ExerciseOverride, 'exerciseId'>>) => {
      setOverrides((prev) => {
        const existing = prev.find((o) => o.exerciseId === exerciseId);
        const merged: ExerciseOverride = { exerciseId, ...existing, ...patch };
        if (isEmptyOverride(merged)) {
          void deleteOverride(exerciseId);
          return prev.filter((o) => o.exerciseId !== exerciseId);
        }
        void putOverride(merged);
        return existing
          ? prev.map((o) => (o.exerciseId === exerciseId ? merged : o))
          : [...prev, merged];
      });
    },
    []
  );

  const blockExercise = useCallback(
    (id: string) => upsertOverride(id, { blocked: true }),
    [upsertOverride]
  );
  const unblockExercise = useCallback(
    (id: string) => upsertOverride(id, { blocked: false }),
    [upsertOverride]
  );
  const toggleFavourite = useCallback(
    (id: string) => {
      const cur = overrides.find((o) => o.exerciseId === id)?.favourite ?? false;
      upsertOverride(id, { favourite: !cur });
    },
    [overrides, upsertOverride]
  );

  const clearAll = useCallback(async () => {
    await clearAllData();
    setSettings(DEFAULT_SETTINGS);
    setOverrides([]);
    setAppMeta(await getAppMeta());
  }, []);

  const blockedIds = useMemo(
    () => overrides.filter((o) => o.blocked).map((o) => o.exerciseId),
    [overrides]
  );
  const favouriteIds = useMemo(
    () => overrides.filter((o) => o.favourite).map((o) => o.exerciseId),
    [overrides]
  );

  const value = useMemo<LocalDataValue>(
    () => ({
      hydrated,
      settings,
      overrides,
      appMeta,
      blockedIds,
      favouriteIds,
      updateSettings,
      blockExercise,
      unblockExercise,
      toggleFavourite,
      clearAll,
    }),
    [
      hydrated,
      settings,
      overrides,
      appMeta,
      blockedIds,
      favouriteIds,
      updateSettings,
      blockExercise,
      unblockExercise,
      toggleFavourite,
      clearAll,
    ]
  );

  return (
    <LocalDataContext.Provider value={value}>
      {children}
    </LocalDataContext.Provider>
  );
}

export function useLocalData(): LocalDataValue {
  const ctx = useContext(LocalDataContext);
  if (!ctx) {
    throw new Error('useLocalData must be used within a LocalDataProvider');
  }
  return ctx;
}
