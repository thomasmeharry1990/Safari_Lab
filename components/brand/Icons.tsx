/**
 * Safari Lab - icon set (Stage 2 brand UI).
 *
 * Thin-line stroke icons matching the supplied brand guide. All use
 * currentColor and are aria-hidden by default (decorative). Pass a `title` to
 * make an icon meaningful to assistive tech.
 *
 * viewBox 24x24, stroke 1.75, round caps/joins - keep new icons consistent.
 */
import type { ReactNode } from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  title?: string;
}

function Svg({
  size = 22,
  className,
  title,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconCompass(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="16.5 7.5 13.5 13.5 7.5 16.5 10.5 10.5" />
    </Svg>
  );
}

export function IconBarbell(p: IconProps) {
  return (
    <Svg {...p}>
      <line x1="2.5" y1="12" x2="21.5" y2="12" />
      <line x1="6" y1="8.5" x2="6" y2="15.5" />
      <line x1="9" y1="7" x2="9" y2="17" />
      <line x1="15" y1="7" x2="15" y2="17" />
      <line x1="18" y1="8.5" x2="18" y2="15.5" />
    </Svg>
  );
}

export function IconDumbbell(p: IconProps) {
  return (
    <Svg {...p}>
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="6" y1="8" x2="6" y2="16" />
      <line x1="9" y1="9.5" x2="9" y2="14.5" />
      <line x1="15" y1="9.5" x2="15" y2="14.5" />
      <line x1="18" y1="8" x2="18" y2="16" />
    </Svg>
  );
}

export function IconShuffle(p: IconProps) {
  return (
    <Svg {...p}>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </Svg>
  );
}

export function IconTarget(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="1.5" />
    </Svg>
  );
}

export function IconProgress(p: IconProps) {
  return (
    <Svg {...p}>
      <line x1="4" y1="20" x2="20" y2="20" />
      <line x1="7" y1="20" x2="7" y2="14" />
      <line x1="12" y1="20" x2="12" y2="9" />
      <line x1="17" y1="20" x2="17" y2="4" />
    </Svg>
  );
}

export function IconFlame(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 2.5c2.5 3 4.5 5.2 4.5 8.5a4.5 4.5 0 0 1-9 0c0-1.3.5-2.4 1.3-3.3-.2 1.6.6 2.6 1.5 2.7.9.1 1.4-.7 1.1-1.9-.5-2 .1-4 .6-6z" />
    </Svg>
  );
}

export function IconStopwatch(p: IconProps) {
  return (
    <Svg {...p}>
      <line x1="10" y1="2.5" x2="14" y2="2.5" />
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <circle cx="12" cy="13.5" r="8" />
      <line x1="12" y1="13.5" x2="12" y2="9.5" />
    </Svg>
  );
}

export function IconCardio(p: IconProps) {
  return (
    <Svg {...p}>
      <polyline points="2 12 7 12 9.5 18 14.5 6 17 12 22 12" />
    </Svg>
  );
}

export function IconShield(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 22s7.5-3.8 7.5-9.5V5.2L12 2.3 4.5 5.2v7.3C4.5 18.2 12 22 12 22z" />
      <polyline points="9 12 11 14 15 9.5" />
    </Svg>
  );
}

export function IconDownload(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20 15v4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 19v-4" />
      <polyline points="7.5 10.5 12 15 16.5 10.5" />
      <line x1="12" y1="15" x2="12" y2="3.5" />
    </Svg>
  );
}

export function IconMountains(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="7.5" cy="7" r="2" />
      <path d="M2.5 20 L9 10 L13 15.5 L16 11 L21.5 20 Z" />
    </Svg>
  );
}

export function IconMobile(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </Svg>
  );
}

export function IconOffline(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <line x1="12" y1="19.5" x2="12" y2="19.5" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </Svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <Svg {...p}>
      <polyline points="4 12.5 9.5 18 20 6" />
    </Svg>
  );
}
