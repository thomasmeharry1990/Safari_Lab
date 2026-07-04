'use client';

/**
 * Safari Lab - multi-tab coordination (Package 8, v1.4 Bible Section 8.3).
 *
 * A single BroadcastChannel gives every open tab two things:
 *   1. Data sync - when one tab mutates local data it posts `mutation`; the other
 *      tabs re-hydrate from IndexedDB so a second tab can never save over fresh
 *      data it hadn't seen. This is the correctness win of the "active-tab lock".
 *   2. Presence - tabs heartbeat every few seconds; `otherTabsOpen` self-heals
 *      when a tab closes (its heartbeats simply stop). Used to warn the athlete
 *      that Safari Lab is open elsewhere while they log a live session.
 *
 * Browser-only and defensive: on the server, or where BroadcastChannel is
 * unavailable, everything degrades to a no-op single-tab experience.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { TAB_LOCK_CHANNEL } from '@/lib/constants/db';

type TabMessage =
  | { type: 'mutation'; from: string }
  | { type: 'heartbeat'; from: string; at: number }
  | { type: 'bye'; from: string };

const PRESENCE_TTL_MS = 7000;
const HEARTBEAT_MS = 3000;

export function useTabSync(onRemoteMutation: () => void) {
  const onMutationRef = useRef(onRemoteMutation);
  onMutationRef.current = onRemoteMutation;

  const channelRef = useRef<BroadcastChannel | null>(null);
  const tabIdRef = useRef<string>('');
  const presenceRef = useRef<Map<string, number>>(new Map());
  const [otherTabsOpen, setOtherTabsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
      return;
    }
    const tabId = crypto.randomUUID();
    tabIdRef.current = tabId;
    const channel = new BroadcastChannel(TAB_LOCK_CHANNEL);
    channelRef.current = channel;

    const recompute = () => {
      const now = Date.now();
      let open = false;
      for (const [id, at] of presenceRef.current) {
        if (now - at >= PRESENCE_TTL_MS) {
          presenceRef.current.delete(id);
        } else if (id !== tabId) {
          open = true;
        }
      }
      setOtherTabsOpen(open);
    };

    channel.onmessage = (event: MessageEvent<TabMessage>) => {
      const msg = event.data;
      if (!msg || msg.from === tabId) return;
      if (msg.type === 'mutation') {
        onMutationRef.current();
      } else if (msg.type === 'heartbeat') {
        presenceRef.current.set(msg.from, msg.at);
        recompute();
      } else if (msg.type === 'bye') {
        presenceRef.current.delete(msg.from);
        recompute();
      }
    };

    const beat = () => {
      channel.postMessage({ type: 'heartbeat', from: tabId, at: Date.now() });
      recompute();
    };
    beat();
    const interval = setInterval(beat, HEARTBEAT_MS);

    const sayBye = () => channel.postMessage({ type: 'bye', from: tabId });
    window.addEventListener('pagehide', sayBye);

    return () => {
      clearInterval(interval);
      window.removeEventListener('pagehide', sayBye);
      sayBye();
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const broadcastMutation = useCallback(() => {
    channelRef.current?.postMessage({
      type: 'mutation',
      from: tabIdRef.current,
    });
  }, []);

  return { broadcastMutation, otherTabsOpen };
}
