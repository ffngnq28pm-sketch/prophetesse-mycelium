// Génère l'image de partage social (1200x630) à partir d'un SVG.
// Usage: node scripts/generate-og-image.mjs

import sharp from "sharp";
import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const OUT = `${ROOT}/public/og-image.png`;

const W = 1200;
const H = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stop-color="#3a562f"/>
      <stop offset="60%" stop-color="#293a22"/>
      <stop offset="100%" stop-color="#13200f"/>
    </radialGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c9a227" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#c9a227" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="myc" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f1d56c"/>
      <stop offset="100%" stop-color="#a07810"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.8  0 0 0 0 0.6  0 0 0 0.05 0"/>
    </filter>
  </defs>

  <!-- Fond -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
  <ellipse cx="${W / 2}" cy="${H / 2}" rx="${W / 2}" ry="${H / 2}" fill="url(#halo)"/>

  <!-- Cadre intérieur ocre -->
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}"
    fill="none" stroke="#c9a227" stroke-width="2" stroke-opacity="0.45"/>
  <rect x="50" y="50" width="${W - 100}" height="${H - 100}"
    fill="none" stroke="#c9a227" stroke-width="0.8" stroke-opacity="0.30"/>

  <!-- Petite mention liturgique -->
  <text x="${W / 2}" y="135" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="22" letter-spacing="11" fill="#d4a747" opacity="0.95">ORDO MYCELII</text>

  <!-- Champignon (mycélium) en haut -->
  <g transform="translate(${W / 2} 230)">
    <path d="M -90 -10 Q -90 -100 0 -100 Q 90 -100 90 -10 L 90 -5 Q 0 15 -90 -5 Z"
      fill="url(#myc)" stroke="#5a3e08" stroke-width="3"/>
    <circle cx="-38" cy="-60" r="10" fill="#fff7e0" stroke="#5a3e08" stroke-width="1.5"/>
    <circle cx="22" cy="-72" r="13" fill="#fff7e0" stroke="#5a3e08" stroke-width="1.5"/>
    <circle cx="48" cy="-40" r="8" fill="#fff7e0" stroke="#5a3e08" stroke-width="1.5"/>
    <path d="M -28 -10 L -22 60 Q 0 70 22 60 L 28 -10 Z"
      fill="#f3e2b0" stroke="#5a3e08" stroke-width="3"/>
    <g stroke="#e8d486" stroke-width="1.6" fill="none" opacity="0.9">
      <path d="M -22 65 Q -55 95 -90 110"/>
      <path d="M -8 70 Q -25 105 -45 135"/>
      <path d="M 8 70 Q 25 105 45 135"/>
      <path d="M 22 65 Q 55 95 90 110"/>
    </g>
    <g fill="#f1d56c">
      <circle cx="-90" cy="110" r="3"/>
      <circle cx="-45" cy="135" r="3"/>
      <circle cx="45" cy="135" r="3"/>
      <circle cx="90" cy="110" r="3"/>
    </g>
  </g>

  <!-- Ornement liturgique au-dessus du titre -->
  <g transform="translate(${W / 2} 410)" stroke="#c9a227" stroke-width="1.2" fill="none" opacity="0.8">
    <line x1="-260" y1="0" x2="-30" y2="0"/>
    <line x1="30" y1="0" x2="260" y2="0"/>
    <circle cx="0" cy="0" r="6"/>
    <circle cx="0" cy="0" r="2" fill="#c9a227"/>
    <path d="M -22 0 Q -12 -10 0 0"/>
    <path d="M -22 0 Q -12 10 0 0"/>
    <path d="M 0 0 Q 12 -10 22 0"/>
    <path d="M 0 0 Q 12 10 22 0"/>
  </g>

  <!-- Titre -->
  <text x="${W / 2}" y="478" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="68" font-weight="600" fill="#f4ecd2">Prophétesse-Mycélium</text>

  <!-- Sous-titre -->
  <text x="${W / 2}" y="525" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="26" font-style="italic" fill="#ead7a3" opacity="0.85">L'Ordre Vert · Une application liturgique</text>

  <!-- Tagline bas -->
  <text x="${W / 2}" y="580" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="18" letter-spacing="6" fill="#c9a227" opacity="0.75">QUE  LA  SÈVE  SOIT  AVEC  TOI</text>
</svg>`;

async function generate() {
  const buffer = await sharp(Buffer.from(svg)).png({ quality: 92 }).toBuffer();
  await fs.writeFile(OUT, buffer);
  const { size } = await fs.stat(OUT);
  console.log(`✓ ${OUT} (${W}×${H}, ${(size / 1024).toFixed(1)} kB)`);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
