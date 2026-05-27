# 🍄 PLAN — Prophétesse-Mycélium

## Approche
Solo autonome. Décisions tranchées. Contenu d'abord, code après.

## Étapes

1. **Setup Next.js 14** — App Router, TS strict, Tailwind, package.json clean
2. **Design system** — palette mousse/terre/or, typo Cormorant + Inter, classes Tailwind custom
3. **Contenu liturgique** — 15 000+ mots, ne pas bâcler :
   - 80+ versets
   - 60+ citations d'Olivia
   - 12+ paraboles
   - 25+ péchés écologiques + pénitences
   - 7 hérésies détaillées
   - 7 vertus détaillées
   - 12+ fêtes liturgiques
   - 9 niveaux progression
   - 7 totems
   - Livres I à VI du Livre d'Olivia
4. **State global** — Zustand + persistance localStorage (graines, niveaux, rituels cochés, historique confessions, nom de baptême, totem)
5. **Composants UI** — Card, Button, Badge, Input, Switch (sans dépendance shadcn CLI)
6. **Pages**
   - Sanctuaire (accueil) — verset du jour, citation, niveau, accès rapide
   - Livre d'Olivia — navigation livres/chapitres
   - Rituels (Sept Offices) — checklist quotidienne, graines
   - Progression — Échelle du Mycélium
   - Confessionnal — sélection péché → pénitence → bénédiction
   - Calendrier — 12 fêtes, mise en avant prochaine
   - Sanctuaires — carte SVG cimetières d'Île-de-France
   - Paramètres — nom de baptême, totem, thème, reset
7. **Tetris du Compost** — vrai Tetris jouable, pièces = déchets, zones de tri, score
8. **Polissage** — animations Framer Motion, états vides, transitions
9. **Build** — `npm run build` propre

## Stack
- Next.js 14 (App Router)
- TypeScript strict
- Tailwind CSS
- Zustand + persist
- Framer Motion
- Lucide React
- Google Fonts (next/font) : Cormorant Garamond + Inter

## Règles d'écriture
- Fanatisme JOYEUX, jamais culpabilisant
- Ton mi-sérieux mi-absurde
- Vocabulaire liturgique riche : "Béni soit", "En vérité", "Frère & Sœur en Mycélium", "Que la Sève soit avec toi"
- Pas de moralisme lourd
- Pas de marques réelles attaquées
