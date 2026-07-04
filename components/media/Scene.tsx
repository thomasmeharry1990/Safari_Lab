import styles from './scene.module.css';

/**
 * Placeholder brand imagery (Stage: premium completion).
 *
 * These are self-contained SVG "scenes" that fill an image area premium-ly while
 * real photography is pending. Every instance is marked `data-image-slot` so the
 * intended photo (hero / expedition / etc.) can be dropped in later by swapping
 * the <Scene> for an <img>. Colours are the locked brand hex.
 */
export type SceneName = 'savanna' | 'gym' | 'topo';

export function Scene({
  name = 'savanna',
  slot,
  rounded = true,
  className,
}: {
  name?: SceneName;
  slot: string;
  rounded?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[styles.wrap, rounded ? styles.rounded : '', className]
        .filter(Boolean)
        .join(' ')}
      data-image-slot={slot}
      role="img"
      aria-label=""
      aria-hidden="true"
    >
      {name === 'savanna' ? <Savanna /> : name === 'gym' ? <Gym /> : <Topo />}
      <span className={styles.overlay} />
    </div>
  );
}

function Savanna() {
  return (
    <svg className={styles.svg} viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241a0d" />
          <stop offset="45%" stopColor="#1a130b" />
          <stop offset="100%" stopColor="#0d0b08" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0e2c4" />
          <stop offset="55%" stopColor="#d4a15a" />
          <stop offset="100%" stopColor="#d4a15a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#sky)" />
      <circle cx="760" cy="330" r="240" fill="url(#sun)" opacity="0.55" />
      <circle cx="760" cy="330" r="96" fill="#e6d6b8" opacity="0.9" />
      {/* mountain ranges */}
      <path d="M0 470 L220 360 L430 470 L640 380 L860 470 L1030 400 L1200 470 L1200 675 L0 675 Z" fill="#3c4130" />
      <path d="M0 520 L260 430 L520 520 L760 450 L1000 525 L1200 470 L1200 675 L0 675 Z" fill="#2b2f21" />
      <path d="M0 585 L1200 545 L1200 675 L0 675 Z" fill="#15140e" />
      {/* acacia tree silhouette */}
      <g fill="#100f0a">
        <path d="M250 585 L262 470 L274 585 Z" />
        <ellipse cx="263" cy="452" rx="86" ry="20" />
        <path d="M205 452 q58 -26 116 0" stroke="#100f0a" strokeWidth="4" fill="none" />
      </g>
      {/* birds */}
      <g stroke="#d4a15a" strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round">
        <path d="M520 210 q10 -9 20 0 q10 -9 20 0" />
        <path d="M600 240 q8 -7 16 0 q8 -7 16 0" />
        <path d="M470 250 q7 -6 14 0 q7 -6 14 0" />
      </g>
    </svg>
  );
}

function Gym() {
  return (
    <svg className={styles.svg} viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="glowA" cx="80%" cy="15%" r="60%">
          <stop offset="0%" stopColor="#d4a15a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d4a15a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowB" cx="10%" cy="90%" r="55%">
          <stop offset="0%" stopColor="#51563d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#51563d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="675" fill="#0f0d0a" />
      <rect width="1200" height="675" fill="url(#glowA)" />
      <rect width="1200" height="675" fill="url(#glowB)" />
      {/* barbell silhouette */}
      <g stroke="#d4a15a" strokeOpacity="0.45" strokeLinecap="round">
        <line x1="300" y1="340" x2="900" y2="340" strokeWidth="10" />
        <line x1="360" y1="300" x2="360" y2="380" strokeWidth="34" />
        <line x1="420" y1="290" x2="420" y2="390" strokeWidth="40" />
        <line x1="780" y1="290" x2="780" y2="390" strokeWidth="40" />
        <line x1="840" y1="300" x2="840" y2="380" strokeWidth="34" />
      </g>
    </svg>
  );
}

function Topo() {
  return (
    <svg className={styles.svg} viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
      <rect width="1200" height="400" fill="#12110c" />
      <g fill="none" stroke="#51563d" strokeOpacity="0.4" strokeWidth="2">
        <path d="M-50 120 C 200 60, 400 180, 650 110 S 1050 40, 1260 130" />
        <path d="M-50 180 C 220 120, 420 240, 680 170 S 1080 100, 1260 190" />
        <path d="M-50 250 C 240 190, 440 310, 700 240 S 1100 170, 1260 260" />
        <path d="M-50 320 C 260 260, 460 380, 720 310 S 1120 240, 1260 330" />
      </g>
      <g fill="#d4a15a" fillOpacity="0.5">
        <circle cx="300" cy="150" r="3" />
        <circle cx="820" cy="210" r="3" />
        <circle cx="560" cy="300" r="3" />
      </g>
    </svg>
  );
}
