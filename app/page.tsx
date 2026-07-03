import type { Metadata } from 'next';
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  FieldRow,
  Grid,
  Panel,
  Pill,
  Section,
  Shell,
} from '@/components/ui';
import { BRAND_COLORS, BRAND_TAGLINE, COPY } from '@/lib/constants/brand';
import { APP_DISPLAY_NAME } from '@/lib/constants/doctrine';
import styles from './scaffold.module.css';

/**
 * STAGE 0.5 SCAFFOLD PREVIEW - not the real homepage.
 * This page exists only to demonstrate brand tokens and layout primitives.
 * It is replaced by the real marketing homepage in Stage 1. noindex.
 */
export const metadata: Metadata = {
  title: 'Design Scaffold Preview',
  robots: { index: false, follow: false },
};

const swatches: { key: keyof typeof BRAND_COLORS; label: string }[] = [
  { key: 'black', label: '--sl-black' },
  { key: 'surface', label: '--sl-surface' },
  { key: 'olive', label: '--sl-olive' },
  { key: 'mutedGold', label: '--sl-muted-gold' },
  { key: 'gold', label: '--sl-gold' },
  { key: 'copper', label: '--sl-copper' },
  { key: 'cream', label: '--sl-cream' },
];

export default function ScaffoldPreview() {
  return (
    <main>
      <Shell>
        <Section>
          <Badge tone="olive">Stage 0.5 &middot; Design scaffold</Badge>
          <h1 className={styles.title}>{APP_DISPLAY_NAME}</h1>
          <p className={styles.tagline}>{BRAND_TAGLINE}</p>
          <p className={styles.note}>
            Internal preview of brand tokens and layout primitives. This is not
            the homepage &mdash; the real <strong>{COPY.startCta}</strong>{' '}
            funnel is built in Stage 1.
          </p>
          <ButtonGroup>
            <Button variant="primary">{COPY.startCta}</Button>
            <Button variant="secondary">{COPY.loadSaveFile}</Button>
            <Button variant="ghost">{COPY.quickSafari}</Button>
          </ButtonGroup>
        </Section>

        <Section tight>
          <h2>Brand colours</h2>
          <Grid cols={7}>
            {swatches.map((s) => (
              <div key={s.key} className={styles.swatch}>
                <span
                  className={styles.swatchChip}
                  style={{ backgroundColor: BRAND_COLORS[s.key] }}
                  aria-hidden
                />
                <code className={styles.swatchLabel}>{s.label}</code>
              </div>
            ))}
          </Grid>
        </Section>

        <Section tight>
          <h2>Primitives</h2>
          <Grid cols={3}>
            <Card interactive>
              <h3>Card</h3>
              <p>
                Textured dark surface with a gold border. Hover lifts it. Used
                for feature cards, program cards and library results.
              </p>
              <ButtonGroup>
                <Pill>chest</Pill>
                <Pill>glutes</Pill>
                <Badge tone="gold">Priority</Badge>
              </ButtonGroup>
            </Card>

            <Panel>
              <h3>Panel</h3>
              <p>Quieter grouped surface for settings and sub-sections.</p>
              <FieldRow
                label="Workout duration"
                hint="Controls exercise count and rest."
                htmlFor="demo-duration"
              >
                <select id="demo-duration" defaultValue="60">
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="75">75+ minutes</option>
                </select>
              </FieldRow>
            </Panel>

            <Card>
              <h3>Status & tone</h3>
              <ButtonGroup>
                <Badge tone="gold">PR</Badge>
                <Badge tone="olive">Logged</Badge>
                <Badge tone="copper">Deload</Badge>
              </ButtonGroup>
              <p className={styles.spaced}>
                Copper carries warnings and intensity; gold carries wins and
                active state.
              </p>
            </Card>
          </Grid>
        </Section>
      </Shell>
    </main>
  );
}
