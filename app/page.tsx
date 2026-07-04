import type { ComponentType } from 'react';
import { Badge, Card, Grid, LinkButton, Pill, Section, Shell } from '@/components/ui';
import {
  IconBarbell,
  IconCheck,
  IconCompass,
  IconDumbbell,
  IconProgress,
  IconShield,
  IconShuffle,
  IconTarget,
  type IconProps,
} from '@/components/brand/Icons';
import { AdSlot } from '@/components/ads/AdSlot';
import { Scene } from '@/components/media/Scene';
import { JsonLd } from '@/components/seo/JsonLd';
import { BRAND_EXPEDITION_LINE, BRAND_TAGLINE, COPY } from '@/lib/constants/brand';
import { DOCTRINE_STATEMENT } from '@/lib/constants/doctrine';
import { SITE_NAME, SITE_URL } from '@/lib/constants/site';
import styles from './home.module.css';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: DOCTRINE_STATEMENT,
    },
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
    },
    {
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: DOCTRINE_STATEMENT,
    },
  ],
};

const TRUST = [
  'No account required',
  'No workout uploads',
  'Adaptive training blocks',
  'Export your save file',
  'Works on mobile',
  'Offline after first load',
];

const FEATURES: { title: string; body: string; Icon: ComponentType<IconProps> }[] =
  [
    {
      title: 'Adaptive program generator',
      body: 'Build a 4–12 week plan from your goal, days, priority muscles and equipment. Deterministic and inspectable — no black box.',
      Icon: IconCompass,
    },
    {
      title: 'Gym-mode logging',
      body: 'A thumb-friendly set logger with last-time and best-ever chips, rest timer and plate calculator. Survives a refresh.',
      Icon: IconBarbell,
    },
    {
      title: 'Adapts to real life',
      body: 'Missed a session, sore, short on time or stuck on equipment? Safari Lab replans and explains every change in plain English.',
      Icon: IconShuffle,
    },
    {
      title: 'Your data, your device',
      body: 'Everything lives in your browser. Export a .slfit save file any time and import it on another device — you own it.',
      Icon: IconShield,
    },
    {
      title: 'Progress dashboard',
      body: 'Personal records, volume, adherence and strength trends. A command centre for your training, not a spreadsheet.',
      Icon: IconProgress,
    },
    {
      title: 'Exercise library',
      body: 'Searchable, filterable movements with form cues and smart substitutions when the rack is taken.',
      Icon: IconDumbbell,
    },
  ];

const STEPS: { n: string; title: string; body: string; Icon: ComponentType<IconProps> }[] = [
  {
    n: '01',
    title: 'Set your goals',
    body: 'Pick a goal, experience level, training days and the muscles you want to prioritise.',
    Icon: IconTarget,
  },
  {
    n: '02',
    title: 'Generate your plan',
    body: 'Get a balanced multi-week block. Review it, swap exercises, then lock it in.',
    Icon: IconShuffle,
  },
  {
    n: '03',
    title: 'Train and log',
    body: 'Open Today’s Safari at the gym. Log sets one-handed with rest timers and PR alerts.',
    Icon: IconBarbell,
  },
  {
    n: '04',
    title: 'Adapt and progress',
    body: 'Safari Lab recommends next loads and reshapes the plan around missed or hard sessions.',
    Icon: IconProgress,
  },
];

const EXPEDITION_POINTS = [
  'Never the same workout twice',
  'Balanced, recovery-safe programming',
  'Exercises you know and can progress',
  'Adapts around missed and hard sessions',
];

export default function HomePage() {
  return (
    <main>
      <JsonLd data={homeJsonLd} />
      {/* --- Hero --- */}
      <Shell>
        <Section className={styles.hero}>
          <div className={styles.heroCopy}>
            <Badge tone="gold">Free &middot; No account &middot; Local-first</Badge>
            <h1 className={styles.heroTitle}>
              Discover your next workout.
              <span className={styles.heroTitleAccent}> Start your Safari.</span>
            </h1>
            <p className={styles.heroSub}>
              Create a free adaptive gym program that tracks your progress and
              stays on your device. No sign-up, no uploads — just training.
            </p>
            <div className={styles.heroCtas}>
              <LinkButton href="/start" variant="primary">
                {COPY.startCta}
              </LinkButton>
              <LinkButton href="/start" variant="secondary">
                {COPY.loadSaveFile}
              </LinkButton>
            </div>
            <p className={styles.heroTagline}>{BRAND_TAGLINE}</p>
          </div>

          {/* Preview card over a placeholder brand scene (swap for a photo later) */}
          <div className={styles.heroPreview}>
            <Scene name="savanna" slot="home-hero" className={styles.heroScene} />
            <Card className={styles.previewCard}>
              <div className={styles.previewHead}>
                <span className={styles.previewLabel}>{COPY.todaysSafari}</span>
                <Badge tone="olive">Week 2 &middot; Day 3</Badge>
              </div>
              <div className={styles.previewRow}>
                <div>
                  <p className={styles.previewEx}>Barbell Hip Thrust</p>
                  <span className={styles.previewMeta}>4 sets &middot; 6–12 reps</span>
                </div>
                <Pill>100 kg</Pill>
              </div>
              <div className={styles.previewRow}>
                <div>
                  <p className={styles.previewEx}>Romanian Deadlift</p>
                  <span className={styles.previewMeta}>3 sets &middot; 8–12 reps</span>
                </div>
                <Pill>70 kg</Pill>
              </div>
              <div className={styles.previewRow}>
                <div>
                  <p className={styles.previewEx}>Seated Cable Row</p>
                  <span className={styles.previewMeta}>3 sets &middot; 10–15 reps</span>
                </div>
                <Pill>55 kg</Pill>
              </div>
              <div className={styles.previewFooter}>
                <Badge tone="gold">PR</Badge>
                <span className={styles.previewMeta}>Rest 2:00 &middot; last time 95 kg</span>
              </div>
            </Card>
          </div>
        </Section>

        {/* --- Trust strip --- */}
        <ul className={styles.trust}>
          {TRUST.map((t) => (
            <li key={t} className={styles.trustItem}>
              <span className={styles.trustTick} aria-hidden="true">
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>

        {/* --- Features --- */}
        <Section id="features">
          <h2 className={styles.sectionTitle}>A complete training system</h2>
          <p className={styles.sectionLede}>
            Everything you need to plan, train and progress — running entirely in
            your browser.
          </p>
          <Grid cols={3}>
            {FEATURES.map((f) => (
              <Card key={f.title} interactive>
                <span className={styles.featureIcon} aria-hidden="true">
                  <f.Icon size={24} />
                </span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* Ad allowed after the first feature band only (doctrine). */}
        <AdSlot />

        {/* --- How it works --- */}
        <Section id="how-it-works" tight>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <Grid cols={4}>
            {STEPS.map((s) => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepBadge} aria-hidden="true">
                  <s.Icon size={22} />
                </span>
                <span className={styles.stepNum}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.featureBody}>{s.body}</p>
              </div>
            ))}
          </Grid>
        </Section>

        {/* --- Expedition section (placeholder scene, swap for a photo later) --- */}
        <Section>
          <div className={styles.expedition}>
            <div className={styles.expeditionCopy}>
              <span className={styles.eyebrow}>Every workout is a new expedition</span>
              <h2 className={styles.sectionTitle}>{BRAND_EXPEDITION_LINE}</h2>
              <p className={styles.sectionLede}>
                From strength to hypertrophy, Safari Lab keeps your training
                challenging, balanced and progressing — session after session.
              </p>
              <ul className={styles.checklist}>
                {EXPEDITION_POINTS.map((p) => (
                  <li key={p}>
                    <span className={styles.checkIcon} aria-hidden="true">
                      <IconCheck size={16} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <Scene name="savanna" slot="home-expedition" className={styles.expeditionScene} />
          </div>
        </Section>

        {/* --- Quick Safari band --- */}
        <Section>
          <Card className={styles.band}>
            <div>
              <h2 className={styles.bandTitle}>Not ready for a full program?</h2>
              <p className={styles.bandBody}>
                Start a {COPY.quickSafari} — a one-off session built around your
                time, equipment and target muscles. Convert it to a program any
                time.
              </p>
            </div>
            <LinkButton href="/start" variant="primary">
              {COPY.quickSafari}
            </LinkButton>
          </Card>
        </Section>
      </Shell>
    </main>
  );
}
