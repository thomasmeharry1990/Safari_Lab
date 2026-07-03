import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { BackupControls } from '@/components/data/BackupControls';
import { Panel, Section, Shell } from '@/components/ui';
import styles from './backup.module.css';

export const metadata: Metadata = {
  title: 'Backup & Save Files',
  description:
    'Export and import your Safari Lab .slfit save file. Your data stays on your device — a save file is how you move it or recover it.',
  robots: { index: false, follow: false },
};

export default function BackupPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Backup"
        title="Keep your training safe"
        lede="Your workouts live in this browser. A .slfit save file is how you back them up, move to another device, or recover after clearing your browser."
      />
      <Shell>
        <Section tight>
          <Panel className={styles.panel}>
            <h2 className={styles.h2}>Your save file</h2>
            <BackupControls />
          </Panel>

          <div className={styles.info}>
            <h2 className={styles.h2}>How it works</h2>
            <ul>
              <li>
                <strong>Export</strong> downloads a <code>.slfit</code> file — plain,
                readable JSON that belongs to you. Nothing is uploaded.
              </li>
              <li>
                <strong>Import</strong> reads a save file, shows you a preview, then
                restores your program, history and settings on this device.
              </li>
              <li>
                Because your data is local, clearing your browser or switching
                devices loses it unless you have a save file. Export one now and
                then keep it somewhere safe.
              </li>
            </ul>

            <h2 className={styles.h2}>If a file won’t import</h2>
            <p>
              Safari Lab checks every file before touching your data. If a file is
              corrupt, from a different app, or from a newer version, the import is
              declined with a clear message and nothing on this device changes.
            </p>
          </div>
        </Section>
      </Shell>
    </main>
  );
}
