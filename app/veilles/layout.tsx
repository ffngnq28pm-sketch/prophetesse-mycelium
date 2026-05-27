export const metadata = {
  title: "Les Veilles du Mycélium",
  description:
    "Après la Voie : une pratique contemplative par jour, sans fin, sans score. Vingt-et-une veilles tournent au fil de l'année.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
