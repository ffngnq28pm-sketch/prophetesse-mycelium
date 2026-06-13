# 🍄 Banque visuelle — manifeste de référence

Système d'images réutilisable de Prophétesse-Mycélium. Le **chrome** (typo, boutons,
palette parchemin/mousse/ocre, casquette rouge) reste sobre ; ce sont les **images**,
**traitées** (grade chaud, légère désaturation, jamais de néon), qui apportent l'atmosphère.

Export statique Next = optimiseur d'images désactivé → **toutes les images sont
pré-optimisées** en WebP via `npm run banque`. Une image absente ne casse jamais une
page : repli parchemin automatique (`onError`).

---

## Les 4 rôles

| Rôle | Dossier servi | Usage | Largeur max · qualité | Budget poids |
|---|---|---|---|---|
| **heros** | `public/banque/heros/` | Plein cadre, fort impact (1 par page majeure) | 1920 · q72 | < 400 Ko |
| **fonds** | `public/banque/fonds/` | Ambiance derrière du contenu (reçoit un voile) | 1600 · q70 | < 250 Ko |
| **illustrations** | `public/banque/illustrations/` | Figures encadrées, inline ou en tête de carte | 1280 · q75 | < 400 Ko |
| **textures** | `public/banque/textures/` | Lavis subtils en superposition (brume, papier, spores) | 1280 · q68 | < 250 Ko |

### Nommage
`role-sujet[-variante].webp`, **minuscules, sans accent, sans terme interdit** :
aucun nom de famille réel, aucun employeur, aucune mention administrative ou
professionnelle hors-univers — y compris dans les noms de fichiers ET les textes `alt`.
Tout reste dans la fiction de l'Ordre Vert.

Exemples : `hero-accueil.webp`, `fond-glossaire.webp`, `illu-marcheuse-filet.webp`,
`texture-brume.webp`. Variantes pour tirage aléatoire : `-a`, `-b`, … (au choix du composant appelant).

---

## Ajouter une image (3 étapes)

1. **Déposer la source brute** (PNG/JPG lourd, export Midjourney) dans
   `assets-sources/banque/<role>/` — *non versionné* (`.gitignore`).
2. **Optimiser** : `npm run banque`
   → écrit `public/banque/<role>/<nom>.webp` (idempotent : ne refait pas une sortie à jour).
3. **Utiliser** le composant adéquat (ci-dessous). Une ligne suffit.

---

## Composants

### `<Illustration>` — image de contenu encadrée
```tsx
import { Illustration } from "@/components/banque/Illustration";

<Illustration
  src="illu-marcheuse-filet.webp"   // sous /banque/illustrations/
  alt="Une marcheuse au filet à papillons dans un cimetière reverdi de mousse"
  legende="La Marcheuse, figure tutélaire de l'Ordre Vert."
  ratio="3/2"        // "3/2" | "2/3" | "1/1" — réserve la hauteur (anti-CLS)
  priorite={false}   // true = eager (au-dessus de la flottaison)
/>
```

### `<Fond>` — calque d'ambiance derrière du contenu
```tsx
import { Fond } from "@/components/banque/Fond";

<Fond
  src="heros/hero-accueil.webp"  // sous /banque/ (heros/, fonds/…)
  variante="hero"                // "hero" | "section" | "voile" | "texture"
  position="center 30%"          // object-position
>
  <h1>Mon titre par-dessus</h1>
</Fond>
```

**Variantes de `<Fond>`** :
- `hero` — plein cadre, voile dégradé sombre **en bas** (le titre repose dessus), image *eager*.
- `section` — voile parchemin modéré sur toute la surface (lisibilité), *lazy*.
- `voile` — voile **fort** + image désaturée/assombrie (texte dense par-dessus), *lazy*.
- `texture` — pas de voile ; l'image en `mix-blend-mode: soft-light`, opacité ~0.15 (lavis), *lazy*.

---

## Traitement commun (cohérence)

Centralisé dans `components/banque/tokens.ts` (un seul endroit à régler) :
grade chaud + légère désaturation sur l'image (`gradeFilter`), calque ocre soft-light
(`ocreOverlay`), grain SVG statique subtil (`grainOpacity`), vignette douce (`vignette`),
coins arrondis (`radius`). Le grain est **statique** (pas d'animation) → sûr vis-à-vis de
`prefers-reduced-motion`.

---

## Colonne vertébrale de style (à coller en tête de chaque génération Midjourney)

> `painterly Ghibli Makoto Shinkai background art, regreened cemetery world of the
> Mycelian Order, muted golden palette, soft warm atmosphere, mist and floating spores,
> hand-painted, no text`

Rappels : **pas de personnage réel, pas de néon, pas de texte incrusté**, lumière chaude
cohérente d'une image à l'autre. Les 4 variantes d'une même grille partagent palette et
lumière (cohérence inter-couches). Une variante qui jure : on ne la dépose pas.

Cadres conseillés : **heros / fonds** en paysage large (~16:9 à 21:9) ;
**illustrations** en `3/2` ou portrait `2/3` ; **textures** sans sujet net (lavis, brume).
