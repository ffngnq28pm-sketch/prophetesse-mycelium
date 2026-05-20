import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-ocre-500/20 bg-parchemin-50/60 dark:bg-mousse-950/40">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="flex flex-col items-center gap-2 text-center font-serif text-sm text-mousse-700 dark:text-parchemin-200/80">
          <p className="italic">« Que la Sève soit avec toi. »</p>
          <p className="text-xs">Application liturgique de l'Ordre Mycélien · Amen-Compost</p>
          <Link href="/glossaire" className="text-xs italic text-ocre-700 hover:underline dark:text-ocre-400">
            Tu ne comprends pas un mot ? Le mycélium s'explique →
          </Link>
          <div className="ornement" />
          <div className="text-xs text-mousse-600 dark:text-parchemin-200/60">
            <p className="font-semibold">Charif Hachichi</p>
            <a
              href="mailto:Charif.Hachichi@icloud.com"
              className="text-ocre-600 hover:underline dark:text-ocre-400"
            >
              Charif.Hachichi@icloud.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
