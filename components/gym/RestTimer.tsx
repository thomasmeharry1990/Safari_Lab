'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './gym.module.css';

function beep() {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.start();
    setTimeout(() => {
      osc.stop();
      void ctx.close();
    }, 180);
  } catch {
    // ignore audio failures
  }
}

function fmt(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

/**
 * Sticky rest countdown. Re-starts whenever `timerId` changes. Fires an optional
 * beep + haptic when it hits zero. Not persisted - purely ephemeral.
 */
export function RestTimer({
  timerId,
  seconds,
  soundEnabled,
  hapticsEnabled,
  onDismiss,
}: {
  timerId: number;
  seconds: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onDismiss: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const targetRef = useRef(0);
  const firedRef = useRef(false);

  useEffect(() => {
    targetRef.current = Date.now() + seconds * 1000;
    firedRef.current = false;
    setRemaining(seconds);
    const iv = setInterval(() => {
      const rem = Math.round((targetRef.current - Date.now()) / 1000);
      setRemaining(rem);
      if (rem <= 0 && !firedRef.current) {
        firedRef.current = true;
        if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(200);
        }
        if (soundEnabled) beep();
        clearInterval(iv);
      }
    }, 250);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerId]);

  const done = remaining <= 0;

  function addTime(s: number) {
    targetRef.current += s * 1000;
    setRemaining((r) => r + s);
    firedRef.current = false;
  }

  return (
    <div className={done ? styles.restBarDone : styles.restBar} role="timer" aria-live="off">
      <span className={styles.restLabel}>
        {done ? 'Rest done — go!' : `Rest ${fmt(remaining)}`}
      </span>
      <div className={styles.restActions}>
        {!done ? (
          <button type="button" className={styles.restBtn} onClick={() => addTime(15)}>
            +15s
          </button>
        ) : null}
        <button type="button" className={styles.restBtn} onClick={onDismiss}>
          {done ? 'Dismiss' : 'Skip'}
        </button>
      </div>
    </div>
  );
}
