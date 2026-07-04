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
import type { ActiveProgram, DraftProgram, DraftSession } from '@/lib/engine/types';
import {
  applySetLog,
  buildQuickSessionLog,
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
  clearActiveQuickSession,
  clearActiveSession,
  clearAllData,
  getActiveQuickSession,
  saveActiveQuickSession,
  DEFAULT_SETTINGS,
  deleteOverride,
  getActiveProgram,
  getActiveSession,
  getAppMeta,
  getOverrides,
  getSessionHistory,
  getSettings,
  putOverride,
  replaceHistory,
  replaceOverrides,
  saveActiveProgram,
  saveActiveSession,
  saveSettings,
  type AppMeta,
} from '@/lib/db/repo';
import type { SlFitSaveFile } from '@/lib/db/savefile';

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
  adaptSession: (dayIndex: number, session: DraftSession) => void;
  startSession: (dayIndex: number) => void;
  logSet: (
    blockId: string,
    setNumber: number,
    input: { weight?: number; reps?: number; unit: WeightUnit }
  ) => void;
  finishSession: () => { session: SessionLog; prs: PRResult[] } | null;
  abandonSession: () => void;
  activeQuickSession: SessionLog | null;
  startQuickSession: (session: DraftSession) => void;
  logQuickSet: (
    blockId: string,
    setNumber: number,
    input: { weight?: number; reps?: number; unit: WeightUnit }
  ) => void;
  finishQuickSession: () => { session: SessionLog; prs: PRResult[] } | null;
  abandonQuickSession: () => void;
  exportSaveFile: () => SlFitSaveFile;
  importSaveFile: (file: SlFitSaveFile) => Promise<void>;
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
  const [activeQuickSession, setActiveQuickSession] = useState<SessionLog | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionLog[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [s, o, m, p, sess, hist, quick] = await Promise.all([
          getSettings(),
          getOverrides(),
          getAppMeta(),
          getActiveProgram(),
          getActiveSession(),
          getSessionHistory(),
          getActiveQuickSession(),
        ]);
        if (!active) return;
        setSettings(s);
        setOverrides(o);
        setAppMeta(m);
        setActiveProgram(p);
        setActiveSession(sess);
        setSessionHistory(hist);
        setActiveQuickSession(quick);
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

  const adaptSession = useCallback((dayIndex: number, session: DraftSession) => {
    setActiveProgram((prev) => {
      if (!prev) return prev;
      const sessions = prev.sessions.map((s, i) => (i === dayIndex ? session : s));
      const next = { ...prev, sessions };
      void saveActiveProgram(next);
      return next;
    });
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

  const startQuickSession = useCallback((session: DraftSession) => {
    const log = buildQuickSessionLog(session);
    void saveActiveQuickSession(log);
    setActiveQuickSession(log);
  }, []);

  const logQuickSet = useCallback(
    (
      blockId: string,
      setNumber: number,
      input: { weight?: number; reps?: number; unit: WeightUnit }
    ) => {
      setActiveQuickSession((prev) => {
        if (!prev) return prev;
        const next = applySetLog(prev, blockId, setNumber, input);
        void saveActiveQuickSession(next);
        return next;
      });
    },
    []
  );

  const finishQuickSession = useCallback((): {
    session: SessionLog;
    prs: PRResult[];
  } | null => {
    if (!activeQuickSession) return null;
    const finalized = finalizeSession(activeQuickSession);
    const prs = computePRs(finalized, sessionHistory);
    void addSessionToHistory(finalized);
    void clearActiveQuickSession();
    setSessionHistory((prev) => [...prev, finalized]);
    setActiveQuickSession(null);
    return { session: finalized, prs };
  }, [activeQuickSession, sessionHistory]);

  const abandonQuickSession = useCallback(() => {
    void clearActiveQuickSession();
    setActiveQuickSession(null);
  }, []);

  const exportSaveFile = useCallback((): SlFitSaveFile => {
    return {
      app: 'SafariLab',
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      exportId: crypto.randomUUID(),
      localDeviceId: appMeta?.deviceId ?? '',
      settings,
      exerciseOverrides: overrides,
      activeProgram,
      activeSession,
      sessionHistory,
      migrationHistory: [],
    };
  }, [appMeta, settings, overrides, activeProgram, activeSession, sessionHistory]);

  const importSaveFile = useCallback(async (file: SlFitSaveFile) => {
    await saveSettings(file.settings);
    await replaceOverrides(file.exerciseOverrides);
    await replaceHistory(file.sessionHistory);
    if (file.activeProgram) await saveActiveProgram(file.activeProgram);
    else await clearActiveProgram();
    if (file.activeSession) await saveActiveSession(file.activeSession);
    else await clearActiveSession();

    setSettings(file.settings);
    setOverrides(file.exerciseOverrides);
    setSessionHistory(file.sessionHistory);
    setActiveProgram(file.activeProgram);
    setActiveSession(file.activeSession);
  }, []);

  const clearAll = useCallback(async () => {
    await clearAllData();
    setSettings(DEFAULT_SETTINGS);
    setOverrides([]);
    setActiveProgram(null);
    setActiveSession(null);
    setActiveQuickSession(null);
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
      adaptSession,
      startSession,
      logSet,
      finishSession,
      abandonSession,
      activeQuickSession,
      startQuickSession,
      logQuickSet,
      finishQuickSession,
      abandonQuickSession,
      exportSaveFile,
      importSaveFile,
      clearAll,
    }),
    [
      hydrated,
      settings,
      overrides,
      appMeta,
      activeProgram,
      activeSession,
      activeQuickSession,
      sessionHistory,
      blockedIds,
      favouriteIds,
      updateSettings,
      blockExercise,
      unblockExercise,
      toggleFavourite,
      lockProgram,
      endProgram,
      adaptSession,
      startSession,
      logSet,
      finishSession,
      abandonSession,
      startQuickSession,
      logQuickSet,
      finishQuickSession,
      abandonQuickSession,
      exportSaveFile,
      importSaveFile,
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
