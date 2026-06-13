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
  fonds: { maxW: 1600, quality: 70 },
  illustrations: { maxW: 1280, quality: 75 },
  textures: { maxW: 1280, quality: 68 },
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

async function run() {
  // Garantit l'existence des dossiers (sources + sorties) pour chaque rôle.
  for (const role of Object.keys(ROLES)) {
    await ensureDir(join(SRC_ROOT, role));
    await ensureDir(join(OUT_ROOT, role));
  }

  let total = 0, done = 0, skipped = 0, sumIn = 0, sumOut = 0;
  console.log("🍄 Optimisation de la banque visuelle\n");

  for (const [role, cfg] of Object.entries(ROLES)) {
    const srcDir = join(SRC_ROOT, role);
    let entries;
    try { entries = await fs.readdir(srcDir); } catch { entries = []; }
    const images = entries.filter((f) => EXT_IN.has(extname(f).toLowerCase()));
    if (images.length === 0) {
      console.log(`  ${role}/  — aucune source`);
      continue;
    }
    console.log(`  ${role}/  (largeur ≤ ${cfg.maxW}, q${cfg.quality})`);

    for (const file of images) {
      total++;
      const srcPath = join(srcDir, file);
      const outName = basename(file, extname(file)) + ".webp";
      const outPath = join(OUT_ROOT, role, outName);

      // Idempotence : on saute si la sortie est plus récente que la source.
      if ((await mtime(outPath)) >= (await mtime(srcPath))) {
        skipped++;
        console.log(`    · ${outName} — à jour, sauté`);
        continue;
      }

      const inSize = (await fs.stat(srcPath)).size;
      const img = sharp(srcPath, { failOn: "none" });
      const meta = await img.metadata();
      const targetW = Math.min(cfg.maxW, meta.width || cfg.maxW); // jamais d'upscale

      await img
        .resize({ width: targetW, withoutEnlargement: true })
        .webp({ quality: cfg.quality })
        .toFile(outPath);

      const outStat = await fs.stat(outPath);
      const outMeta = await sharp(outPath).metadata();
      sumIn += inSize; sumOut += outStat.size; done++;
      const warn = outStat.size > 400 * 1024 ? "  ⚠ > 400 Ko" : "";
      console.log(
        `    ✓ ${outName}  ${outMeta.width}×${outMeta.height}  ${ko(inSize)} → ${ko(outStat.size)}${warn}`
      );
    }
  }

  console.log(
    `\n  Total : ${total} · optimisées ${done} · sautées ${skipped}` +
    (done ? ` · ${ko(sumIn)} → ${ko(sumOut)}` : "")
  );
}

run().catch((e) => {
  console.error("Échec de l'optimisation :", e);
  process.exit(1);
});
