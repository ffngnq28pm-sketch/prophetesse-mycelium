// Optimise la banque visuelle : assets-sources/banque/<role>/* → public/banque/<role>/*.webp
// Export statique Next = optimiseur d'images désactivé → on pré-optimise nous-mêmes.
// Usage : npm run banque
//
// Idempotent : une sortie déjà à jour (mtime >= source) est sautée.
// Jamais d'agrandissement (withoutEnlargement). Ratio conservé. Nom de base conservé.

import sharp from "sharp";
import { promises as fs } from "node:fs";
import { dirname, basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const SRC_ROOT = join(ROOT, "assets-sources", "banque");
const OUT_ROOT = join(ROOT, "public", "banque");

// Réglages par rôle : largeur max + qualité WebP. (cf. docs/BANQUE-VISUELLE.md)
const ROLES = {
  heros: { maxW: 1920, quality: 72 },
  fonds: { maxW: 2000, quality: 72 }, // fonds d'écran ambiants (< 320 Ko visés)
  illustrations: { maxW: 1280, quality: 75 },
  textures: { maxW: 1280, quality: 68 },
  jeux: { maxW: 1024, quality: 72 }, // vignettes des cartes du hub (< 250 Ko visés)
  veillee: { maxW: 1920, quality: 74 }, // fonds de scène de L'Épreuve de la Veillée (< 400 Ko visés)
};

// Décors peints des jeux : mêmes règles, par acte. (cf. docs/PORT-TRAVERSEE.md)
// assets-sources/jeux/traversee/<acte>/couche-<n>-<v>.png → public/jeux/traversee/<acte>/*.webp
const JEUX = {
  "traversee/porche": { maxW: 1920, quality: 72 },
  "traversee/allees": { maxW: 1920, quality: 72 },
  "traversee/ascension": { maxW: 1920, quality: 72 },
  // Textures de re-skin de la couche de jeu : carrées 1024², tuilables (q74, < 250 Ko).
  "traversee/skin": { maxW: 1024, quality: 74, square: 1024 },
};

const EXT_IN = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff", ".avif"]);

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}
async function mtime(p) {
  try { return (await fs.stat(p)).mtimeMs; } catch { return 0; }
}
function ko(bytes) {
  return (bytes / 1024).toFixed(0) + " Ko";
}

// Compteurs partagés entre les deux passes (banque + jeux).
const stats = { total: 0, done: 0, skipped: 0, sumIn: 0, sumOut: 0 };

// Optimise un dossier source → dossier sortie selon une config (maxW, quality).
async function processDir(srcDir, outDir, label, cfg) {
  await ensureDir(srcDir);
  await ensureDir(outDir);
  let entries;
  try { entries = await fs.readdir(srcDir); } catch { entries = []; }
  const images = entries.filter((f) => EXT_IN.has(extname(f).toLowerCase()));
  if (images.length === 0) {
    console.log(`  ${label}/  — aucune source`);
    return;
  }
  console.log(`  ${label}/  (largeur ≤ ${cfg.maxW}, q${cfg.quality})`);

  for (const file of images) {
    stats.total++;
    const srcPath = join(srcDir, file);
    const outName = basename(file, extname(file)) + ".webp";
    const outPath = join(outDir, outName);

    // Idempotence : on saute si la sortie est plus récente que la source.
    if ((await mtime(outPath)) >= (await mtime(srcPath))) {
      stats.skipped++;
      console.log(`    · ${outName} — à jour, sauté`);
      continue;
    }

    const inSize = (await fs.stat(srcPath)).size;
    const img = sharp(srcPath, { failOn: "none" });
    const meta = await img.metadata();
    const srcW = meta.width || cfg.maxW;

    if (cfg.square) {
      // Texture carrée tuilable : recadrage cover en N×N (jamais d'upscale au-delà de la source).
      const side = Math.min(cfg.square, srcW, meta.height || cfg.square);
      await img.resize(side, side, { fit: "cover" }).webp({ quality: cfg.quality }).toFile(outPath);
    } else {
      const targetW = Math.min(cfg.maxW, srcW); // jamais d'upscale
      await img.resize({ width: targetW, withoutEnlargement: true }).webp({ quality: cfg.quality }).toFile(outPath);
    }

    const outStat = await fs.stat(outPath);
    const outMeta = await sharp(outPath).metadata();
    stats.sumIn += inSize; stats.sumOut += outStat.size; stats.done++;
    const warn = outStat.size > 400 * 1024 ? "  ⚠ > 400 Ko" : "";
    console.log(
      `    ✓ ${outName}  ${outMeta.width}×${outMeta.height}  ${ko(inSize)} → ${ko(outStat.size)}${warn}`
    );
  }
}

// Normalise les noms des fonds : les exports Midjourney ont des espaces + UUID,
// or Vercel build sur Linux est sensible à la casse → on renomme tout fichier
// non conforme en fond-NN.<ext> (minuscules, sans espace), en remplissant les
// numéros libres dans l'ordre alphabétique. Idempotent.
async function normaliserFonds() {
  const dir = join(SRC_ROOT, "fonds");
  await ensureDir(dir);
  let entries;
  try { entries = await fs.readdir(dir); } catch { return; }
  const imgs = entries.filter((f) => EXT_IN.has(extname(f).toLowerCase()));
  const conforme = (f) => /^fond-\d{2}\./i.test(f);
  const messy = imgs.filter((f) => !conforme(f)).sort();
  if (messy.length === 0) return;
  const used = new Set(
    imgs.filter(conforme).map((f) => parseInt(f.match(/^fond-(\d{2})/i)[1], 10))
  );
  let n = 1;
  for (const f of messy) {
    while (used.has(n)) n++;
    used.add(n);
    const target = `fond-${String(n).padStart(2, "0")}${extname(f).toLowerCase()}`;
    await fs.rename(join(dir, f), join(dir, target));
    console.log(`  renommé : ${f} → ${target}`);
    n++;
  }
}

async function run() {
  console.log("🍄 Optimisation des images (banque + décors de jeux)\n");

  await normaliserFonds();

  // —— Banque visuelle (par rôle) ——
  for (const [role, cfg] of Object.entries(ROLES)) {
    await processDir(join(SRC_ROOT, role), join(OUT_ROOT, role), role, cfg);
  }

  // —— Décors peints des jeux (par acte) ——
  const JEU_SRC = join(ROOT, "assets-sources", "jeux");
  const JEU_OUT = join(ROOT, "public", "jeux");
  for (const [rel, cfg] of Object.entries(JEUX)) {
    await processDir(join(JEU_SRC, rel), join(JEU_OUT, rel), `jeux/${rel}`, cfg);
  }

  console.log(
    `\n  Total : ${stats.total} · optimisées ${stats.done} · sautées ${stats.skipped}` +
    (stats.done ? ` · ${ko(stats.sumIn)} → ${ko(stats.sumOut)}` : "")
  );
}

run().catch((e) => {
  console.error("Échec de l'optimisation :", e);
  process.exit(1);
});
