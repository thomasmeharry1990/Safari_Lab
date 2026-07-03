'use client';

import { useRef, useState } from 'react';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import {
  parseSaveFile,
  serializeSaveFile,
  summariseSaveFile,
  type SaveFileSummary,
  type SlFitSaveFile,
} from '@/lib/db/savefile';
import { Button } from '@/components/ui';
import styles from './backup.module.css';

export function BackupControls() {
  const { hydrated, exportSaveFile, importSaveFile } = useLocalData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ file: SlFitSaveFile; summary: SaveFileSummary } | null>(null);
  const [imported, setImported] = useState(false);
  const [busy, setBusy] = useState(false);

  function download() {
    const file = exportSaveFile();
    const blob = new Blob([serializeSaveFile(file)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safari-lab-${file.exportedAt.slice(0, 10)}.slfit`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setImported(false);
    setPending(null);
    const input = e.target;
    const file = input.files?.[0];
    input.value = ''; // allow re-selecting the same file
    if (!file) return;
    const text = await file.text();
    const result = parseSaveFile(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPending({ file: result.file, summary: summariseSaveFile(result.file) });
  }

  async function confirmImport() {
    if (!pending) return;
    setBusy(true);
    try {
      await importSaveFile(pending.file);
      setImported(true);
      setPending(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={download} disabled={!hydrated}>
          Export save file
        </Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          Import save file
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".slfit,application/json"
          onChange={onFile}
          className={styles.hiddenInput}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {imported ? (
        <p className={styles.success}>
          Save file imported — your programs, history and settings are restored.
        </p>
      ) : null}

      {pending ? (
        <div className={styles.preview}>
          <h3 className={styles.previewTitle}>Import preview</h3>
          <dl className={styles.summary}>
            <div>
              <dt>Program</dt>
              <dd>{pending.summary.programName ?? 'None'}</dd>
            </div>
            <div>
              <dt>Completed sessions</dt>
              <dd>{pending.summary.completedSessions}</dd>
            </div>
            <div>
              <dt>Exercise overrides</dt>
              <dd>{pending.summary.overrides}</dd>
            </div>
            <div>
              <dt>Exported</dt>
              <dd>
                {pending.summary.exportedAt
                  ? new Date(pending.summary.exportedAt).toLocaleString()
                  : '—'}
              </dd>
            </div>
          </dl>
          <p className={styles.warn}>
            Importing replaces everything currently on this device. Export a backup
            first if you want to keep it.
          </p>
          <div className={styles.actions}>
            <Button variant="primary" onClick={confirmImport} disabled={busy}>
              {busy ? 'Importing…' : 'Import & replace'}
            </Button>
            <Button variant="ghost" onClick={() => setPending(null)} disabled={busy}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
