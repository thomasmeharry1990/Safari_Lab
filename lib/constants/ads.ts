/**
 * Safari Lab - ad configuration (Stage 14).
 *
 * Ads are GATED. ADS_ENABLED stays false until AdSense approval + legal review.
 * While false, every <AdSlot> renders nothing. The slots are still placed in the
 * layout so placement is reviewed now; flipping this flag (and later dropping in
 * a real ad unit) is all it takes to go live.
 *
 * DOCTRINE: never inside active set logging or beside gym controls; hidden when
 * offline; reserve height so a loading ad never shifts the page; no text that
 * asks users to click ads. The service worker never caches ad scripts/containers.
 */
export const ADS_ENABLED = false;

export const AD_LABEL = 'Advertisement';
