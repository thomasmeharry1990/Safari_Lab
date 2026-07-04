'use client';

import { useState } from 'react';
import { useLocalData } from '@/lib/state/LocalDataProvider';
import {
  EXPEDITION_FREE_TEXT_MAX,
  type ExpeditionLogTag,
  type ExpeditionMood,
} from '@/lib/models/expedition';
import { Button } from '@/components/ui';
import styles from './gym.module.css';

const MOODS: { value: ExpeditionMood; label: string; emoji: string }[] = [
  { value: 'strong', label: 'Strong', emoji: '💪' },
  { value: 'energised', label: 'Energised', emoji: '⚡' },
  { value: 'normal', label: 'Normal', emoji: '🙂' },
  { value: 'tired', label: 'Tired', emoji: '😮‍💨' },
  { value: 'sore', label: 'Sore', emoji: '🩹' },
  { value: 'stressed', label: 'Stressed', emoji: '😣' },
];

const TAGS: { value: ExpeditionLogTag; label: string }[] = [
  { value: 'felt-easy', label: 'Felt easy' },
  { value: 'felt-hard', label: 'Felt hard' },
  { value: 'great-pump', label: 'Great pump' },
  { value: 'technique-focus', label: 'Technique focus' },
  { value: 'PR', label: 'PR' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'low-energy', label: 'Low energy' },
  { value: 'missed-sleep', label: 'Missed sleep' },
  { value: 'busy-gym', label: 'Busy gym' },
  { value: 'pain-note', label: 'Pain note' },
  { value: 'deload', label: 'Deload' },
];

export function ExpeditionLogForm({ sessionId }: { sessionId: string }) {
  const { attachExpeditionLog } = useLocalData();
  const [mood, setMood] = useState<ExpeditionMood | undefined>();
  const [tags, setTags] = useState<ExpeditionLogTag[]>([]);
  const [freeText, setFreeText] = useState('');
  const [saved, setSaved] = useState(false);

  function toggleTag(t: ExpeditionLogTag) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function save() {
    attachExpeditionLog(sessionId, { mood, tags, freeText: freeText.trim() });
    setSaved(true);
  }

  if (saved) {
    return (
      <div className={styles.expedSaved}>
        <span className={styles.expedSavedMark}>✓</span> Expedition log saved to your
        history.
      </div>
    );
  }

  return (
    <div className={styles.exped}>
      <h3 className={styles.expedTitle}>Log this expedition</h3>
      <p className={styles.expedHint}>
        How did it feel? Optional — a quick note now makes your history far more
        useful later.
      </p>

      <div className={styles.expedGroup}>
        <span className={styles.expedLabel}>Mood</span>
        <div className={styles.expedChips}>
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              className={mood === m.value ? styles.expedChipOn : styles.expedChip}
              onClick={() => setMood((cur) => (cur === m.value ? undefined : m.value))}
              aria-pressed={mood === m.value}
            >
              <span aria-hidden>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.expedGroup}>
        <span className={styles.expedLabel}>Tags</span>
        <div className={styles.expedChips}>
          {TAGS.map((t) => (
            <button
              key={t.value}
              type="button"
              className={tags.includes(t.value) ? styles.expedChipOn : styles.expedChip}
              onClick={() => toggleTag(t.value)}
              aria-pressed={tags.includes(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.expedGroup}>
        <label className={styles.expedLabel} htmlFor="exped-note">
          Notes
        </label>
        <textarea
          id="exped-note"
          className={styles.expedText}
          value={freeText}
          maxLength={EXPEDITION_FREE_TEXT_MAX}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Anything worth remembering — how the weights moved, niggles, wins…"
          rows={3}
        />
        <span className={styles.expedCount}>
          {freeText.length}/{EXPEDITION_FREE_TEXT_MAX}
        </span>
      </div>

      <div className={styles.expedActions}>
        <Button variant="secondary" onClick={save}>
          Save log
        </Button>
      </div>
    </div>
  );
}
