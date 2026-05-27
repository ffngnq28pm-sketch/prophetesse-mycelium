import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-ocre-500/20 bg-parchemin-50/60 dark:bg-mousse-950/40">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="flex flex-col items-center gap-3 text-center font-serif text-sm text-mousse-700 dark:text-parchemin-200/80">
          <p className="italic">« Que la Sève soit avec toi. »</p>
          <div className="ornement" aria-hidden />
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs italic">
            <Link href="/glossaire" className="text-ocre-700 hover:underline dark:text-ocre-400">
              Glossaire
            </Link>
            <span aria-hidden className="text-ocre-500/40">·</span>
            <Link href="/colophon" className="text-ocre-700 hover:underline dark:text-ocre-400">
              Colophon
            </Link>
            <span aria-hidden className="text-ocre-500/40">·</span>
            <Link href="/confidentialite" className="text-ocre-700 hover:underline dark:text-ocre-400">
              Confidentialité
            </Link>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.3em] text-mousse-600/70 dark:text-parchemin-200/50">
            Amen-Compost
          </p>
        </div>
      </div>
    </footer>
  );
}
