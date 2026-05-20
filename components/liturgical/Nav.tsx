"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Sanctuaire" },
  { href: "/voie", label: "La Voie" },
  { href: "/jardin", label: "Jardin" },
  { href: "/livre", label: "Livre Sacré" },
  { href: "/rituels", label: "Rituels" },
  { href: "/confession", label: "Confession" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/sanctuaires", label: "Sanctuaires" },
  { href: "/jeu", label: "Jeux" },
  { href: "/glossaire", label: "Glossaire" },
  { href: "/parametres", label: "Paramètres" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-ocre-500/30 bg-parchemin-50/85 backdrop-blur dark:border-ocre-500/20 dark:bg-mousse-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3 font-serif">
          <span className="text-2xl">🍄</span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-wide text-mousse-800 dark:text-parchemin-100">
              Prophétesse-Mycélium
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ocre-600 dark:text-ocre-400">
              Ordo Mycelii
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-1.5 font-serif text-sm transition",
                pathname === l.href
                  ? "bg-mousse-700 text-parchemin-50"
                  : "text-mousse-800 hover:bg-mousse-500/10 dark:text-parchemin-100"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-mousse-800 hover:bg-mousse-500/10 lg:hidden dark:text-parchemin-100"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-ocre-500/20 lg:hidden">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-1 p-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 font-serif text-sm transition",
                  pathname === l.href
                    ? "bg-mousse-700 text-parchemin-50"
                    : "text-mousse-800 hover:bg-mousse-500/10 dark:text-parchemin-100"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
