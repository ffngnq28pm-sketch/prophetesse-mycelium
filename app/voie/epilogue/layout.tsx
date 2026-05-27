export const metadata = {
  title: "L'Épilogue Secret",
  description:
    "Tu es devenu·e Mycélium. Le monde se sauve à la condition que personne n'ait l'air de le sauver.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
