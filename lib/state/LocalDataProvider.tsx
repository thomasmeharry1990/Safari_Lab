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
import type { SessionLog } from '@/lib/models/session';
import type { ActiveProgram, DraftProgram } from '@/lib/engine/types';
import {
  applySetLog,
  buildSessionLog,
  computePRs,
  finalizeSession,
  toActiveProgram,
  type PRResult,
  type WeightUnit,
} from '@/lib/engine';
import {
  addSessionToHistory,
  clearActiveProgram,
  clearActiveSession,
  clearAllData,
  DEFAULT_SETTINGS,
  deleteOverride,
  getActiveProgram,
  getActiveSession,
  getAppMeta,
  getOverrides,
  getSessionHistory,
  getSettings,
  putOverride,
  saveActiveProgram,
  saveActiveSession,
  saveSettings,
  type AppMeta,
} from '@/lib/db/repo';

interface LocalDataValue {
  hydrated: boolean;
  settings: UserSettings;
  overrides: ExerciseOverride[];
  appMeta: AppMeta | null;
  activeProgram: ActiveProgram | null;
  activeSession: SessionLog | null;
  sessionHistory: SessionLog[];
  blockedIds: string[];
  favouriteIds: string[];
  updateSettings: (patch: Partial<UserSettings>) => void;
  blockExercise: (exerciseId: string) => void;
  unblockExercise: (exerciseId: string) => void;
  toggleFavourite: (exerciseId: string) => void;
  lockProgram: (draft: DraftProgram) => ActiveProgram;
  endProgram: () => void;
  startSession: (dayIndex: number) => void;
  logSet: (
    blockId: string,
    setNumber: number,
    input: { weight?: number; reps?: number; unit: WeightUnit }
  ) => void;
  finishSession: () => { session: SessionLog; prs: PRResult[] } | null;
  abandonSession: () => void;
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
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [activeSession, setActiveSession] = useState<SessionLog | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionLog[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [s, o, m, p, sess, hist] = await Promise.all([
          getSettings(),
          getOverrides(),
          getAppMeta(),
          getActiveProgram(),
          getActiveSession(),
          getSessionHistory(),
        ]);
        if (!active) return;
        setSettings(s);
        setOverrides(o);
        setAppMeta(m);
        setActiveProgram(p);
        setActiveSession(sess);
        setSessionHistory(hist);
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

  const lockProgram = useCallback((draft: DraftProgram): ActiveProgram => {
    const program = toActiveProgram(draft, new Date().toISOString());
    void saveActiveProgram(program);
    setActiveProgram(program);
    return program;
  }, []);

  const endProgram = useCallback(() => {
    void clearActiveProgram();
    void clearActiveSession();
    setActiveProgram(null);
    setActiveSession(null);
  }, []);

  const startSession = useCallback(
    (dayIndex: number) => {
      if (!activeProgram) return;
      const session = buildSessionLog(activeProgram, dayIndex);
      void saveActiveSession(session);
      setActiveSession(session);
    },
    [activeProgram]
  );

  const logSet = useCallback(
    (
      blockId: string,
      setNumber: number,
      input: { weight?: number; reps?: number; unit: WeightUnit }
    ) => {
      setActiveSession((prev) => {
        if (!prev) return prev;
        const next = applySetLog(prev, blockId, setNumber, input);
        void saveActiveSession(next);
        return next;
      });
    },
    []
  );

  const finishSession = useCallback((): {
    session: SessionLog;
    prs: PRResult[];
  } | null => {
    if (!activeSession) return null;
    const finalized = finalizeSession(activeSession);
    const prs = computePRs(finalized, sessionHistory);

    void addSessionToHistory(finalized);
    void clearActiveSession();
    setSessionHistory((prev) => [...prev, finalized]);
    setActiveSession(null);

    // Advance the program to the next day / week.
    if (activeProgram) {
      const nextDay = (activeProgram.currentDayIndex + 1) % activeProgram.daysPerWeek;
      const wrapped = nextDay === 0;
      const nextWeek = Math.min(
        activeProgram.weeks,
        activeProgram.currentWeek + (wrapped ? 1 : 0)
      );
      const updated: ActiveProgram = {
        ...activeProgram,
        currentDayIndex: nextDay,
        currentWeek: nextWeek,
      };
      void saveActiveProgram(updated);
      setActiveProgram(updated);
    }

    return { session: finalized, prs };
  }, [activeSession, sessionHistory, activeProgram]);

  const abandonSession = useCallback(() => {
    void clearActiveSession();
    setActiveSession(null);
  }, []);

  const clearAll = useCallback(async () => {
    await clearAllData();
    setSettings(DEFAULT_SETTINGS);
    setOverrides([]);
    setActiveProgram(null);
    setActiveSession(null);
    setSessionHistory([]);
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
      activeProgram,
      activeSession,
      sessionHistory,
      blockedIds,
      favouriteIds,
      updateSettings,
      blockExercise,
      unblockExercise,
      toggleFavourite,
      lockProgram,
      endProgram,
      startSession,
      logSet,
      finishSession,
      abandonSession,
      clearAll,
    }),
    [
      hydrated,
      settings,
      overrides,
      appMeta,
      activeProgram,
      activeSession,
      sessionHistory,
      blockedIds,
      favouriteIds,
      updateSettings,
      blockExercise,
      unblockExercise,
      toggleFavourite,
      lockProgram,
      endProgram,
      startSession,
      logSet,
      finishSession,
      abandonSession,
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
