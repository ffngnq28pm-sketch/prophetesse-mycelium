// Génère les icônes PNG depuis public/icon-source.svg
// Usage: node scripts/generate-icons.mjs

import sharp from "sharp";
import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const SRC = `${ROOT}/public/icon-source.svg`;
const OUT_DIR = `${ROOT}/public/icons`;

const TARGETS = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-1024.png", size: 1024 },
  { name: "icon-maskable-512.png", size: 512, pad: 64 }, // safe-zone padding for maskable
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
  // Splash iPhone 14/15 portrait (1170x2532 / 1179x2556)
  { name: "splash-1170x2532.png", w: 1170, h: 2532, bg: "#3a562f" },
  { name: "splash-1179x2556.png", w: 1179, h: 2556, bg: "#3a562f" },
];

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function generate() {
  await ensureDir(OUT_DIR);
  const svgBuffer = await fs.readFile(SRC);

  for (const t of TARGETS) {
    const out = `${OUT_DIR}/${t.name}`;
    if (t.w && t.h) {
      // Splash centered
      const iconSize = Math.min(t.w, t.h) * 0.45;
      const iconBuf = await sharp(svgBuffer)
        .resize(Math.round(iconSize), Math.round(iconSize))
        .png()
        .toBuffer();
      const bg = t.bg ?? "#3a562f";
      await sharp({
        create: {
          width: t.w,
          height: t.h,
          channels: 4,
          background: bg,
        },
      })
        .composite([
          {
            input: iconBuf,
            top: Math.round((t.h - iconSize) / 2),
            left: Math.round((t.w - iconSize) / 2),
          },
        ])
        .png()
        .toFile(out);
      console.log(`✓ ${t.name} (${t.w}x${t.h})`);
      continue;
    }

    const size = t.size;
    if (t.pad) {
      const inner = size - t.pad * 2;
      const iconBuf = await sharp(svgBuffer).resize(inner, inner).png().toBuffer();
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: "#293a22",
        },
      })
        .composite([{ input: iconBuf, top: t.pad, left: t.pad }])
        .png()
        .toFile(out);
    } else {
      await sharp(svgBuffer).resize(size, size).png().toFile(out);
    }
    console.log(`✓ ${t.name} (${size}x${size})`);
  }
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
