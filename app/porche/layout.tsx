import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prophétesse-Mycélium · L'Ordre Vert",
  description:
    "Le porche de l'Ordre Mycélien. Un ordre pour les lents, les patients, et ceux qui laissent un coin de jardin en friche.",
  openGraph: {
    title: "Prophétesse-Mycélium · L'Ordre Vert",
    description:
      "Un ordre pour les lents, les patients, et ceux qui laissent un coin de jardin en friche.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prophétesse-Mycélium — L'Ordre Vert",
      },
    ],
  },
  // Route de prévisualisation : non indexée tant qu'elle n'est pas la home.
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
