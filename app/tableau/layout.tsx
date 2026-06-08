import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Sanctuaire",
  description:
    "Le tableau de bord du disciple : chapitre en cours, offices du jour, Jardin et prochaine fête.",
  // Tableau de bord personnel : pas d'indexation.
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
