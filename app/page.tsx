import { Badge, Card, Grid, LinkButton, Pill, Section, Shell } from '@/components/ui';
import { BRAND_TAGLINE, COPY } from '@/lib/constants/brand';
import styles from './home.module.css';

const TRUST = [
  'No account required',
  'No workout uploads',
  'Adaptive training blocks',
  'Export your save file',
  'Works on mobile',
  'Offline after first load',
];

const FEATURES: { title: string; body: string }[] = [
  {
    title: 'Adaptive program generator',
    body: 'Build a 4–12 week plan from your goal, days, priority muscles and equipment. Deterministic and inspectable — no black box.',
  },
  {
    title: 'Gym-mode logging',
    body: 'A thumb-friendly set logger with last-time and best-ever chips, rest timer and plate calculator. Survives a refresh.',
  },
  {
    title: 'Adapts to real life',
    body: 'Missed a session, sore, short on time or stuck on equipment? Safari Lab replans and explains every change in plain English.',
  },
  {
    title: 'Your data, your device',
    body: 'Everything lives in your browser. Export a .slfit save file any time and import it on another device — you own it.',
  },
  {
    title: 'Progress dashboard',
    body: 'Personal records, volume, adherence and strength trends. A command centre for your training, not a spreadsheet.',
  },
  {
    title: 'Exercise library',
    body: 'Searchable, filterable movements with form cues and smart substitutions when the rack is taken.',
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'Set your goals',
    body: 'Pick a goal, experience level, training days and the muscles you want to prioritise.',
  },
  {
    n: '02',
    title: 'Generate your plan',
    body: 'Get a balanced multi-week block. Review it, swap exercises, then lock it in.',
  },
  {
    n: '03',
    title: 'Train and log',
    body: 'Open Today’s Safari at the gym. Log sets one-handed with rest timers and PR alerts.',
  },
  {
    n: '04',
    title: 'Adapt and progress',
    body: 'Safari Lab recommends next loads and reshapes the plan around missed or hard sessions.',
  },
];

export default function HomePage() {
  return (
    <main>
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

          {/* Preview card - illustrative, not a real session */}
          <div className={styles.heroPreview} aria-hidden="true">
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
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* --- How it works --- */}
        <Section id="how-it-works" tight>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <Grid cols={4}>
            {STEPS.map((s) => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.featureBody}>{s.body}</p>
              </div>
            ))}
          </Grid>
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
