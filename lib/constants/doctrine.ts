/**
 * Safari Lab - Non-Server Doctrine (canonical guardrails)
 *
 * Source of truth: v1.4 Conflict-Free Build Bible, Control Page + Section 0.
 * These constants exist so the doctrine is inspectable in code and can be
 * asserted in tests. They are NOT feature flags to be flipped on later - they
 * describe permanent product law. If a future change needs one of these to be
 * false, that change is out of scope for Safari Lab.
 *
 * Authority order when specs conflict: v1.4 > v1.3 > v1.2 > (legacy) v1.1 > v1.0.
 */

export const APP_NAME = 'SafariLab' as const;
export const APP_DISPLAY_NAME = 'Safari Lab' as const;

/**
 * Locked, non-negotiable product rules. Every value here is intentional.
 * See the "Reason / Claude Code implication" column of Bible Section 0.
 */
export const DOCTRINE = {
  /** Static frontend only. All program logic runs in the browser. */
  hostingModel: 'static-frontend-only',
  /** No login, no password reset, no user table, no server auth. */
  allowUserAccounts: false,
  /** Save to IndexedDB and export/import .slfit files. Never upload user data. */
  workoutDataLocation: 'local-only',
  /** Adaptive replanning must be deterministic, inspectable and testable. */
  adaptationEngine: 'local-rules-engine',
  /** No server AI dependency. Rule-based first; any future AI stays local/optional. */
  serverAiAllowed: false,
  /** Ads allowed, but never inside active set logging or beside gym controls. */
  adsAllowed: true,
  adsAllowedInGymMode: false,
  /** Do not create fake shop/products or imply supplements exist. */
  fakeProductClaimsAllowed: false,
  /** Self-host fonts. No Google Fonts / external font CDN calls. */
  externalFontCdnAllowed: false,
  /** Root save file semver string from day one. */
  saveSchemaVersioning: 'semver-string',
  /** Service worker caches the app shell only - never ad scripts/consent/containers. */
  serviceWorkerCaches: 'app-shell-only',
} as const;

/**
 * Server features that must never appear in this codebase. Used as a checklist
 * for reviews and (later) as grep targets in a doctrine test.
 */
export const FORBIDDEN_SERVER_FEATURES = [
  'api-routes',
  'server-actions',
  'runtime-server-dependencies',
  'authentication',
  'password-reset',
  'server-side-database',
  'subscriptions',
  'checkout',
  'product-purchasing',
  'user-workout-data-upload',
  'server-side-ai',
  'external-font-cdn',
] as const;

export type ForbiddenServerFeature = (typeof FORBIDDEN_SERVER_FEATURES)[number];

/** Human-readable one-line summary for docs, about page and reviews. */
export const DOCTRINE_STATEMENT =
  'Safari Lab is a free, non-server, local-first, privacy-friendly, mobile-first adaptive workout website. No accounts, no cloud databases, no subscriptions, no server-side workout storage, no user uploads, no server-side AI.';
