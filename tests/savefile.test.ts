import { describe, expect, it } from 'vitest';
import { parseSaveFile, validateSaveFile } from '@/lib/db/savefile';

const validRaw = {
  app: 'SafariLab',
  schemaVersion: '1.0.0',
  exportedAt: '2026-01-01T00:00:00.000Z',
  exportId: 'x',
  localDeviceId: 'd',
  settings: { unitSystem: 'metric', hapticsEnabled: true, soundEnabled: true, restTimerDefaultSeconds: 90, backupRemindersEnabled: true },
  exerciseOverrides: [],
  activeProgram: null,
  activeSession: null,
  sessionHistory: [],
  migrationHistory: [],
};

describe('save file validation', () => {
  it('accepts a valid save file', () => {
    const r = validateSaveFile(validRaw);
    expect(r.ok).toBe(true);
  });

  it('rejects a non-Safari-Lab file', () => {
    const r = validateSaveFile({ ...validRaw, app: 'SomethingElse' });
    expect(r.ok).toBe(false);
  });

  it('rejects an unsupported schema version', () => {
    const r = validateSaveFile({ ...validRaw, schemaVersion: '2.0.0' });
    expect(r.ok).toBe(false);
  });

  it('rejects a file missing settings', () => {
    const { settings: _s, ...noSettings } = validRaw;
    const r = validateSaveFile(noSettings);
    expect(r.ok).toBe(false);
  });

  it('rejects corrupt JSON on parse', () => {
    const r = parseSaveFile('{ not json');
    expect(r.ok).toBe(false);
  });

  it('round-trips a valid file through parse', () => {
    const r = parseSaveFile(JSON.stringify(validRaw));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.file.app).toBe('SafariLab');
  });

  it('normalises missing arrays to empty', () => {
    const { exerciseOverrides: _o, sessionHistory: _h, ...partial } = validRaw;
    const r = validateSaveFile(partial);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.file.exerciseOverrides).toEqual([]);
      expect(r.file.sessionHistory).toEqual([]);
    }
  });
});
