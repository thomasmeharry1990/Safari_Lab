'use client';

import { useState } from 'react';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import { Button, Panel } from '@/components/ui';
import styles from './data.module.css';

export function DataControls() {
  const { hydrated, appMeta, overrides, blockedIds, favouriteIds, clearAll } =
    useLocalData();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cleared, setCleared] = useState(false);

  async function doClear() {
    setBusy(true);
    try {
      await clearAll();
      setCleared(true);
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Panel className={styles.panel}>
        <h2 className={styles.h2}>On this device</h2>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>Device ID</dt>
            <dd className={styles.mono}>
              {hydrated ? (appMeta?.deviceId ?? '—') : '…'}
            </dd>
          </div>
          <div className={styles.stat}>
            <dt>Exercise overrides</dt>
            <dd>{overrides.length}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Blocked</dt>
            <dd>{blockedIds.length}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Favourites</dt>
            <dd>{favouriteIds.length}</dd>
          </div>
        </dl>
      </Panel>

      <Panel className={styles.panel}>
        <h2 className={styles.h2}>Save files</h2>
        <p className={styles.note}>
          Exporting and importing <code>.slfit</code> save files arrives in an
          upcoming build stage. Your data already persists on this device between
          visits.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" disabled aria-disabled="true">
            Export save file
          </Button>
          <Button variant="secondary" disabled aria-disabled="true">
            Import save file
          </Button>
        </div>
      </Panel>

      <Panel className={styles.danger}>
        <h2 className={styles.h2}>Clear local data</h2>
        <p className={styles.note}>
          This permanently deletes everything Safari Lab has stored on this
          device — settings, blocked exercises and (later) your programs and
          history. This cannot be undone.
        </p>

        {cleared ? (
          <p className={styles.cleared}>All local data has been cleared.</p>
        ) : confirming ? (
          <div className={styles.confirm}>
            <span className={styles.confirmText}>
              Are you sure? This deletes everything on this device.
            </span>
            <div className={styles.actions}>
              <Button variant="primary" onClick={doClear} disabled={busy}>
                {busy ? 'Clearing…' : 'Yes, clear everything'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConfirming(false)}
                disabled={busy}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            Clear all local data
          </Button>
        )}
      </Panel>
    </div>
  );
}
