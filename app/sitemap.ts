import type { MetadataRoute } from "next";
import { livres } from "@/data/livre-sacre";

const SITE_URL = "https://mycelium.shadowstepsociety.com";

// Pages publiques indexables. Les pages personnelles (parametres, annales, etc.)
// portent `robots: { index: false }` et sont exclues du sitemap.
const ROUTES_STATIQUES = [
  "/",
  "/bienvenue/",
  "/voie/",
  "/rituels/",
  "/confession/",
  "/calendrier/",
  "/jardin/",
  "/jeu/",
  "/jeu/compost/",
  "/jeu/pac-marcheuse/",
  "/jeu/nuit-des-empreintes/",
  "/jeu/traversee/",
  "/sanctuaires/",
  "/livre/",
  "/almanach/",
  "/hagiographie/",
  "/glossaire/",
  "/progression/",
  "/reliques/",
  "/colophon/",
  "/confidentialite/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = ROUTES_STATIQUES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1.0 : 0.7,
  }));

  // Chapitres du Livre Sacré (≈ 50 pages dynamiques générées en static export).
  const livreEntries: MetadataRoute.Sitemap = [];
  for (const livre of livres) {
    livreEntries.push({
      url: `${SITE_URL}/livre/${livre.id}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    });
    for (const chapitre of livre.chapitres) {
      livreEntries.push({
        url: `${SITE_URL}/livre/${livre.id}/${chapitre.id}/`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      });
    }
  }

  return [...staticEntries, ...livreEntries];
}
