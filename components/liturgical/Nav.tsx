"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown } from "lucide-react";
import { MereMycorhizeOverlay } from "@/components/liturgical/MereMycorhizeOverlay";

interface NavLink {
  href: string;
  label: string;
}
interface NavGroup {
  label: string;
  links: NavLink[];
}

const HOME: NavLink = { href: "/", label: "Sanctuaire" };
const JEUX: NavLink = { href: "/jeu", label: "Jeux" };
const PARAMS: NavLink = { href: "/parametres", label: "Paramètres" };

const GROUPS: NavGroup[] = [
  {
    label: "Pèlerinage",
    links: [
      { href: "/voie", label: "La Voie" },
      { href: "/rituels", label: "Rituels" },
      { href: "/confession", label: "Confession" },
      { href: "/calendrier", label: "Calendrier" },
    ],
  },
  {
    label: "Bibliothèque",
    links: [
      { href: "/livre", label: "Livre Sacré" },
      { href: "/hagiographie", label: "Hagiographie" },
      { href: "/almanach", label: "Almanach" },
      { href: "/glossaire", label: "Glossaire" },
      { href: "/sanctuaires", label: "Sanctuaires" },
    ],
  },
  {
    label: "Progrès",
    links: [
      { href: "/jardin", label: "Jardin" },
      { href: "/reliques", label: "Reliques" },
      { href: "/annales", label: "Annales" },
    ],
  },
];

// Easter egg : 7 clics sur le 🍄 du logo, dans une fenêtre de 5 secondes,
// font apparaître Mère Mycorhize. Une seule fois par session de navigateur.
const SECRET_CLICS_REQUIS = 7;
const SECRET_FENETRE_MS = 5_000;
const SECRET_FLAG = "mycelium_mere_mycorhize_vue";

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mereVisible, setMereVisible] = useState(false);
  const clicsRef = useRef(0);
  const dernierClicRef = useRef(0);

  // Tout se referme dès qu'on change de page.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const handleLogoClick = () => {
    if (typeof window === "undefined") return;
    // Déjà vue dans cette session : on laisse la navigation normale faire son office.
    if (window.sessionStorage?.getItem(SECRET_FLAG)) return;

    const maintenant = Date.now();
    if (maintenant - dernierClicRef.current > SECRET_FENETRE_MS) {
      clicsRef.current = 0;
    }
    clicsRef.current += 1;
    dernierClicRef.current = maintenant;

    if (clicsRef.current >= SECRET_CLICS_REQUIS) {
      clicsRef.current = 0;
      try {
        window.sessionStorage.setItem(SECRET_FLAG, "1");
      } catch {
        // Si sessionStorage est bloqué (mode privé strict), tant pis :
        // l'apparition restera reproductible, ce qui n'est pas un drame.
      }
      setMereVisible(true);
    }
  };

  const isActive = (href: string) => pathname === href;
  const groupActive = (g: NavGroup) => g.links.some((l) => pathname === l.href);

  return (
    <header className="sticky top-0 z-30 border-b border-ocre-500/30 bg-parchemin-50/85 backdrop-blur dark:border-ocre-500/20 dark:bg-mousse-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-serif"
          aria-label="Sanctuaire — Accueil"
          onClick={handleLogoClick}
        >
          <span className="text-2xl" aria-hidden>🍄</span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-wide text-mousse-800 dark:text-parchemin-100">
              Prophétesse-Mycélium
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ocre-600 dark:text-ocre-400">
              Ordo Mycelii
            </span>
          </div>
        </Link>

        {/* Navigation desktop : liens directs + menus regroupés */}
        <nav className="hidden items-center gap-1 lg:flex">
          <TopLink link={HOME} active={isActive(HOME.href)} />
          {GROUPS.map((g) => (
            <div key={g.label} className="relative">
              <button
                onClick={() => setOpenMenu((m) => (m === g.label ? null : g.label))}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-1.5 font-serif text-sm transition",
                  groupActive(g)
                    ? "bg-mousse-700 text-parchemin-50"
                    : "text-mousse-800 hover:bg-mousse-500/10 dark:text-parchemin-100"
                )}
                aria-haspopup="menu"
                aria-expanded={openMenu === g.label}
              >
                {g.label}
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", openMenu === g.label && "rotate-180")}
                />
              </button>
              {openMenu === g.label && (
                <div className="absolute left-0 top-full z-40 mt-1 min-w-[12rem] rounded-md border border-ocre-500/30 bg-parchemin-50 p-1 shadow-lg dark:bg-mousse-950">
                  {g.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className={cn(
                        "block rounded px-3 py-1.5 font-serif text-sm transition",
                        isActive(l.href)
                          ? "bg-mousse-700 text-parchemin-50"
                          : "text-mousse-800 hover:bg-mousse-500/10 dark:text-parchemin-100"
                      )}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <TopLink link={JEUX} active={isActive(JEUX.href)} />
          <TopLink link={PARAMS} active={isActive(PARAMS.href)} />
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-md p-2 text-mousse-800 hover:bg-mousse-500/10 lg:hidden dark:text-parchemin-100"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Voile de fermeture des menus déroulants */}
      {openMenu && (
        <div className="fixed inset-0 z-20" aria-hidden onClick={() => setOpenMenu(null)} />
      )}

      <AnimatePresence>
        {mereVisible && <MereMycorhizeOverlay onClose={() => setMereVisible(false)} />}
      </AnimatePresence>

      {/* Navigation mobile : sections regroupées */}
      {mobileOpen && (
        <nav className="border-t border-ocre-500/20 lg:hidden">
          <div className="mx-auto max-w-5xl space-y-3 p-3">
            <MobileLink link={HOME} active={isActive(HOME.href)} />
            {GROUPS.map((g) => (
              <div key={g.label}>
                <p className="px-1 pb-1 text-[10px] uppercase tracking-widest text-ocre-600 dark:text-ocre-400">
                  {g.label}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {g.links.map((l) => (
                    <MobileLink key={l.href} link={l} active={isActive(l.href)} />
                  ))}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-1">
              <MobileLink link={JEUX} active={isActive(JEUX.href)} />
              <MobileLink link={PARAMS} active={isActive(PARAMS.href)} />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function TopLink({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-1.5 font-serif text-sm transition",
        active
          ? "bg-mousse-700 text-parchemin-50"
          : "text-mousse-800 hover:bg-mousse-500/10 dark:text-parchemin-100"
      )}
    >
      {link.label}
    </Link>
  );
}

function MobileLink({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 font-serif text-sm transition",
        active
          ? "bg-mousse-700 text-parchemin-50"
          : "text-mousse-800 hover:bg-mousse-500/10 dark:text-parchemin-100"
      )}
    >
      {link.label}
    </Link>
  );
}
