import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/PageIntro';
import { Prose } from '@/components/content/Prose';
import { BRAND_TAGLINE } from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Safari Lab is a free, local-first adaptive workout planner. Here is the idea behind it.',
};

export default function AboutPage() {
  return (
    <main>
      <PageIntro
        eyebrow="About"
        title="A training system that respects you"
        lede={BRAND_TAGLINE}
      />
      <Prose>
        <h2>The idea</h2>
        <p>
          Most workout apps want an account, a subscription and your data. Safari
          Lab takes the opposite approach: a serious, adaptive training system
          that is free, runs entirely in your browser and keeps your data on your
          device. No sign-up, no cloud, no catch.
        </p>

        <h2>What makes it different</h2>
        <ul>
          <li>
            <strong>Adaptive, not random.</strong> Programs are generated from
            your goals and reshape themselves around missed sessions, soreness,
            short time and unavailable equipment — and every change is explained.
          </li>
          <li>
            <strong>Local-first.</strong> Your history lives in your browser and
            travels with a save file you own.
          </li>
          <li>
            <strong>Built for the gym floor.</strong> Gym mode is designed for
            one-handed logging on a phone, and works offline once loaded.
          </li>
        </ul>

        <h2>Honest by design</h2>
        <p>
          Safari Lab is a workout planner and tracker. It is not a shop, and it
          does not sell supplements or make health claims. The brand&rsquo;s
          expedition styling is there to make training feel like an adventure —
          nothing more.
        </p>

        <h2>Still growing</h2>
        <p>
          Safari Lab is being built in the open, stage by stage. Features arrive
          steadily, and the local-first promise never changes.
        </p>
      </Prose>
    </main>
  );
}
