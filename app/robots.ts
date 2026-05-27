import type { MetadataRoute } from "next";

const SITE_URL = "https://mycelium.shadowstepsociety.com";

// Pages internes / personnelles que l'on ne souhaite pas voir indexées.
// Cohérent avec les robots: { index: false } posés dans leurs layouts.
const DISALLOW = [
  "/parametres/",
  "/annales/",
  "/veilles/",
  "/voie/epilogue/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
