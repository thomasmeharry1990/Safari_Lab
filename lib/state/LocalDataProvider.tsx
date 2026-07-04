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
  useRef,
  useState,
} from 'react';
import type { ExerciseOverride, UserSettings } from '@/lib/models/save-file';
import type { SessionLog } from '@/lib/models/session';
import type { ExpeditionLog, ExpeditionLogTag, ExpeditionMood } from '@/lib/models/expedition';
import { EXPEDITION_FREE_TEXT_MAX } from '@/lib/models/expedition';
import type { CompletedProgram } from '@/lib/models/completed-program';
import type { ActiveProgram, DraftProgram, DraftSession } from '@/lib/engine/types';
import {
  applySetLog,
  buildCompletedProgram,
  buildQuickSessionLog,
  buildSessionLog,
  computePRs,
  deloadSessions,
  finalizeSession,
  generateProgram,
  isFinalSession,
  toActiveProgram,
  type PRResult,
  type WeightUnit,
} from '@/lib/engine';
import { useTabSync } from './useTabSync';
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
  getCompletedPrograms,
  getOverrides,
  getSessionHistory,
  getSettings,
  addCompletedProgram,
  putOverride,
  replaceCompletedPrograms,
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
  completedPrograms: CompletedProgram[];
  blockedIds: string[];
  favouriteIds: string[];
  /** True while Safari Lab is also open in another browser tab. */
  otherTabsOpen: boolean;
  updateSettings: (patch: Partial<UserSettings>) => void;
  blockExercise: (exerciseId: string) => void;
  unblockExercise: (exerciseId: string) => void;
  toggleFavourite: (exerciseId: string) => void;
  lockProgram: (draft: DraftProgram) => ActiveProgram;
  endProgram: () => void;
  /** Build + lock a fresh block from a completed program's original brief. */
  startNextBlock: (completed: CompletedProgram) => void;
  adaptSession: (dayIndex: number, session: DraftSession) => void;
  startDeload: () => void;
  endDeload: () => void;
  startSession: (dayIndex: number) => void;
  logSet: (
    blockId: string,
    setNumber: number,
    input: { weight?: number; reps?: number; rpe?: number; unit: WeightUnit }
  ) => void;
  finishSession: () => {
    session: SessionLog;
    prs: PRResult[];
    completedProgram?: CompletedProgram;
  } | null;
  abandonSession: () => void;
  activeQuickSession: SessionLog | null;
  startQuickSession: (session: DraftSession) => void;
  logQuickSet: (
    blockId: string,
    setNumber: number,
    input: { weight?: number; reps?: number; rpe?: number; unit: WeightUnit }
  ) => void;
  finishQuickSession: () => { session: SessionLog; prs: PRResult[] } | null;
  abandonQuickSession: () => void;
  attachExpeditionLog: (
    sessionId: string,
    data: { mood?: ExpeditionMood; tags: ExpeditionLogTag[]; freeText: string }
  ) => void;
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
  const [completedPrograms, setCompletedPrograms] = useState<CompletedProgram[]>([]);

  /**
   * Read every store into state. Used on mount and again whenever another tab
   * signals a mutation. `remoteApplyRef` marks the resulting state changes as
   * remote so the broadcasting effect doesn't echo them back and loop.
   */
  const remoteApplyRef = useRef(false);
  const hydrateAll = useCallback(async (markHydrated: boolean, remote = false) => {
    try {
      const [s, o, m, p, sess, hist, quick, completed] = await Promise.all([
        getSettings(),
        getOverrides(),
        getAppMeta(),
        getActiveProgram(),
        getActiveSession(),
        getSessionHistory(),
        getActiveQuickSession(),
        getCompletedPrograms(),
      ]);
      if (remote) remoteApplyRef.current = true;
      setSettings(s);
      setOverrides(o);
      setAppMeta(m);
      setActiveProgram(p);
      setActiveSession(sess);
      setSessionHistory(hist);
      setActiveQuickSession(quick);
      setCompletedPrograms(completed);
    } catch {
      // IndexedDB unavailable (private mode, blocked) - stay on defaults.
    } finally {
      if (markHydrated) setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void hydrateAll(true);
  }, [hydrateAll]);

  const { broadcastMutation, otherTabsOpen } = useTabSync(
    useCallback(() => {
      void hydrateAll(false, true);
    }, [hydrateAll])
  );

  // Tell other tabs whenever local data changes, so they re-hydrate and never
  // save over data they hadn't seen. Skip changes we just applied FROM a remote
  // signal (guarded by remoteApplyRef) so tabs don't ping-pong.
  useEffect(() => {
    if (!hydrated) return;
    if (remoteApplyRef.current) {
      remoteApplyRef.current = false;
      return;
    }
    broadcastMutation();
  }, [
    hydrated,
    settings,
    overrides,
    activeProgram,
    activeSession,
    activeQuickSession,
    sessionHistory,
    completedPrograms,
    broadcastMutation,
  ]);

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

  const startNextBlock = useCallback((completed: CompletedProgram) => {
    const draft = generateProgram(completed.input);
    const program = toActiveProgram(draft, new Date().toISOString());
    void saveActiveProgram(program);
    void clearActiveSession();
    setActiveProgram(program);
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

  const startDeload = useCallback(() => {
    setActiveProgram((prev) => {
      if (!prev || prev.deload?.active) return prev;
      const next: ActiveProgram = {
        ...prev,
        sessions: deloadSessions(prev.sessions),
        deload: { active: true, original: prev.sessions },
      };
      void saveActiveProgram(next);
      return next;
    });
  }, []);

  const endDeload = useCallback(() => {
    setActiveProgram((prev) => {
      if (!prev?.deload?.active) return prev;
      const { deload: _d, ...rest } = prev;
      const next: ActiveProgram = { ...rest, sessions: prev.deload.original };
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
      input: { weight?: number; reps?: number; rpe?: number; unit: WeightUnit }
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
    completedProgram?: CompletedProgram;
  } | null => {
    if (!activeSession) return null;
    const finalized = finalizeSession(activeSession);
    const prs = computePRs(finalized, sessionHistory);
    const fullHistory = [...sessionHistory, finalized];

    void addSessionToHistory(finalized);
    void clearActiveSession();
    setSessionHistory(fullHistory);
    setActiveSession(null);

    let completedProgram: CompletedProgram | undefined;

    if (activeProgram) {
      if (isFinalSession(activeProgram)) {
        // Final session of the final week - retire the program into a block report.
        const unit: WeightUnit = settings.unitSystem === 'imperial' ? 'lb' : 'kg';
        completedProgram = buildCompletedProgram(
          activeProgram,
          fullHistory,
          unit,
          new Date().toISOString(),
          crypto.randomUUID()
        );
        void addCompletedProgram(completedProgram);
        void clearActiveProgram();
        setCompletedPrograms((prev) => [...prev, completedProgram!]);
        setActiveProgram(null);
      } else {
        // Advance the program to the next day / week.
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
    }

    return { session: finalized, prs, completedProgram };
  }, [activeSession, sessionHistory, activeProgram, settings.unitSystem]);

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
      input: { weight?: number; reps?: number; rpe?: number; unit: WeightUnit }
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

  const attachExpeditionLog = useCallback(
    (
      sessionId: string,
      data: { mood?: ExpeditionMood; tags: ExpeditionLogTag[]; freeText: string }
    ) => {
      setSessionHistory((prev) => {
        const target = prev.find((s) => s.id === sessionId);
        if (!target) return prev;
        const log: ExpeditionLog = {
          id: crypto.randomUUID(),
          sessionLogId: sessionId,
          createdAt: new Date().toISOString(),
          mood: data.mood,
          tags: data.tags,
          freeText: data.freeText.slice(0, EXPEDITION_FREE_TEXT_MAX),
          maxLength: 500,
        };
        const updated: SessionLog = {
          ...target,
          expeditionLog: log,
          expeditionLogId: log.id,
        };
        void addSessionToHistory(updated);
        return prev.map((s) => (s.id === sessionId ? updated : s));
      });
    },
    []
  );

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
      completedPrograms,
      migrationHistory: [],
    };
  }, [
    appMeta,
    settings,
    overrides,
    activeProgram,
    activeSession,
    sessionHistory,
    completedPrograms,
  ]);

  const importSaveFile = useCallback(async (file: SlFitSaveFile) => {
    await saveSettings(file.settings);
    await replaceOverrides(file.exerciseOverrides);
    await replaceHistory(file.sessionHistory);
    await replaceCompletedPrograms(file.completedPrograms ?? []);
    if (file.activeProgram) await saveActiveProgram(file.activeProgram);
    else await clearActiveProgram();
    if (file.activeSession) await saveActiveSession(file.activeSession);
    else await clearActiveSession();

    setSettings(file.settings);
    setOverrides(file.exerciseOverrides);
    setSessionHistory(file.sessionHistory);
    setCompletedPrograms(file.completedPrograms ?? []);
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
    setCompletedPrograms([]);
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
      completedPrograms,
      blockedIds,
      favouriteIds,
      otherTabsOpen,
      updateSettings,
      blockExercise,
      unblockExercise,
      toggleFavourite,
      lockProgram,
      endProgram,
      startNextBlock,
      adaptSession,
      startDeload,
      endDeload,
      startSession,
      logSet,
      finishSession,
      abandonSession,
      activeQuickSession,
      startQuickSession,
      logQuickSet,
      finishQuickSession,
      abandonQuickSession,
      attachExpeditionLog,
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
      completedPrograms,
      blockedIds,
      favouriteIds,
      otherTabsOpen,
      updateSettings,
      blockExercise,
      unblockExercise,
      toggleFavourite,
      lockProgram,
      endProgram,
      startNextBlock,
      adaptSession,
      startDeload,
      endDeload,
      startSession,
      logSet,
      finishSession,
      abandonSession,
      startQuickSession,
      logQuickSet,
      finishQuickSession,
      abandonQuickSession,
      attachExpeditionLog,
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
