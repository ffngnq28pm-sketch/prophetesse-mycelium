export const metadata = {
  title: "Les Annales",
  description:
    "La mémoire chiffrée du pèlerinage. On garde une trace administrative non par méfiance, mais parce qu'un chiffre, parfois, console.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
