/**
 * Safari Lab - Brand tokens (canonical values from v1.2 Section 1.3).
 *
 * The CSS custom properties in styles/tokens.css are the single source of truth
 * for styling. These TS mirrors exist for places that need brand values in
 * logic (canvas/SVG charts, meta theme-color, tests). Keep the two in sync.
 */

/** Locked brand colours. Do not hard-code these hex values anywhere else. */
export const BRAND_COLORS = {
  black: '#111111', // Primary background, nav, hero surface
  olive: '#51563D', // Muted accent panels, muscle tags, secondary headings
  mutedGold: '#8A845F', // Low-emphasis separators, map pattern lines
  cream: '#E6D6B8', // Text on dark, soft premium foreground
  gold: '#D4A15A', // Primary CTA, active states, stat highlights
  copper: '#B76B2E', // Warnings, intensity, error highlights
  surface: '#171512', // Cards and panels on dark background
  border: 'rgba(212, 161, 90, 0.34)', // Card border, active outlines
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;

/** Brand energy line. NOT a supplement/product claim. */
export const BRAND_TAGLINE = 'Built for the wild. Made for the strong.' as const;

/**
 * Copy tokens - consistent expedition language across empty states and CTAs.
 * Bible Section 1.2 (copy tokens) + Section 14 (empty states & microcopy).
 */
export const COPY = {
  startCta: 'Start Your Safari',
  loadSaveFile: 'Load Save File',
  todaysSafari: "Today's Safari",
  expeditionLog: 'Expedition Log',
  noExpeditionInProgress: 'No expedition in progress',
  saveYourSafari: 'Save your Safari',
  quickSafari: 'Quick Safari',
} as const;
