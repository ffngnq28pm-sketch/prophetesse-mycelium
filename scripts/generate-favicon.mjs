// Génère public/favicon.ico (multi-tailles, PNG embarqué).
// Usage: node scripts/generate-favicon.mjs

import sharp from "sharp";
import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const SRC = `${ROOT}/public/icon-source.svg`;
const OUT = `${ROOT}/public/favicon.ico`;

const SIZES = [16, 32, 48];

async function generate() {
  const svgBuffer = await fs.readFile(SRC);
  const pngs = await Promise.all(
    SIZES.map((size) =>
      sharp(svgBuffer).resize(size, size).png({ compressionLevel: 9 }).toBuffer()
    )
  );

  // ICONDIR : 6 octets
  // reserved(2)=0  type(2)=1 (ICO)  count(2)=N
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(SIZES.length, 4);

  // ICONDIRENTRY : 16 octets par image
  const entries = Buffer.alloc(16 * SIZES.length);
  let dataOffset = 6 + 16 * SIZES.length;

  pngs.forEach((png, i) => {
    const base = 16 * i;
    const sz = SIZES[i];
    entries.writeUInt8(sz === 256 ? 0 : sz, base + 0);     // width (0 = 256)
    entries.writeUInt8(sz === 256 ? 0 : sz, base + 1);     // height
    entries.writeUInt8(0, base + 2);                        // color palette
    entries.writeUInt8(0, base + 3);                        // reserved
    entries.writeUInt16LE(1, base + 4);                     // color planes
    entries.writeUInt16LE(32, base + 6);                    // bits per pixel
    entries.writeUInt32LE(png.length, base + 8);            // size in bytes
    entries.writeUInt32LE(dataOffset, base + 12);           // offset
    dataOffset += png.length;
  });

  const ico = Buffer.concat([header, entries, ...pngs]);
  await fs.writeFile(OUT, ico);
  const { size } = await fs.stat(OUT);
  console.log(`✓ ${OUT} (${SIZES.join("/")}, ${(size / 1024).toFixed(1)} kB)`);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
