'use client';

import { useEffect } from 'react';

/**
 * Registers the app-shell service worker after load. A waiting (updated) worker
 * is deliberately left to activate only when all tabs close, so an update never
 * takes over during an active gym session.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* offline support is progressive - ignore registration failures */
      });
    };
    if (document.readyState === 'complete') register();
    else {
      window.addEventListener('load', register, { once: true });
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return null;
}
