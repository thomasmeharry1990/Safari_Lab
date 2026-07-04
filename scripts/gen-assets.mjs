/**
 * Safari Lab - rasterize brand SVGs to PNG icons + OG image.
 * Run: node scripts/gen-assets.mjs  (or `npm run assets`)
 * Regenerate whenever public/icon.svg or public/og.svg change.
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const icon = readFileSync(join(pub, 'icon.svg'));
const og = readFileSync(join(pub, 'og.svg'));

const jobs = [
  [icon, 192, 192, 'icon-192.png'],
  [icon, 512, 512, 'icon-512.png'],
  [icon, 180, 180, 'apple-touch-icon.png'],
  [og, 1200, 630, 'og.png'],
];

for (const [buf, w, h, name] of jobs) {
  await sharp(buf, { density: 384 })
    .resize(w, h, { fit: 'contain', background: { r: 17, g: 17, b: 17, alpha: 1 } })
    .png()
    .toFile(join(pub, name));
  console.log('wrote', name);
}
