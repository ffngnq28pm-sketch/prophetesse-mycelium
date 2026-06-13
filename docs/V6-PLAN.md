# Plan V6 — Refonte qualité des 5 jeux + hub illustré

> Phase 0 du mandat V6. Diagnostics au regard de la barre de qualité
> (lisibilité, game feel, courbe, rejouabilité, mobile, accessibilité, univers).

## Segments de routes réels (pour les illustrations)

| Jeu | Route | Fichier d'illustration attendu |
|---|---|---|
| La Chute du Compost | `/jeu/compost` | `public/jeux/compost.png` |
| La Chasse aux Pollinisateurs | `/jeu/pac-marcheuse` | `public/jeux/pac-marcheuse.png` |
| La Nuit des Empreintes | `/jeu/nuit-des-empreintes` | `public/jeux/nuit-des-empreintes.png` |
| Le Sentier des Spores | `/jeu/traversee` | `public/jeux/traversee.png` |
| Le Verbe du Jour | `/jeu/verbe` | `public/jeux/verbe.png` |

## Diagnostics

### Le Sentier des Spores (`/jeu/traversee`)
- **Ce qui marche** : moteur propre (pas fixe 1/120 s, coyote/buffer, caméra lerp),
  décor parallaxe soigné, respawn bienveillant, filet qui convertit.
- **Ce qui est faible** : niveau court (~5 600 u) et plat — un seul vocabulaire
  (sauter/attraper), pas de checkpoints visibles, pas de score persisté global,
  gravité symétrique (saut flottant), fin sèche.
- **Top 3 impact/effort** : ① niveau ×2,5 en 3 actes avec plateformes mobiles,
  friables, champignons-tremplins, ronces et lanternes-checkpoints ;
  ② gravité asymétrique + look-ahead caméra ; ③ spores dorées optionnelles +
  score final composite persisté + final avec envol de papillons.

### La Chasse aux Pollinisateurs (`/jeu/pac-marcheuse`)
- **Ce qui marche** : 4 IA différenciées, 5 niveaux à vitesse croissante,
  café = renversement (power pellet), input buffering aux intersections (queued),
  swipe mobile + pavé.
- **Ce qui est faible** : rendu daté (murs plats, fantômes simples, sprite 22 px),
  pas de trails ni particules, IA « anticipateur » trop simple, aucun screenshake.
- **Top 3 impact/effort** : ① refonte graphique canvas (fantômes spectraux avec
  voile ondulant, halos, yeux expressifs ; Marcheuse plus fine ; murs = haies
  moussues avec volume ; vignette + grain) ; ② juice (trail de la Marcheuse,
  particules de capture, flash sobre) ; ③ IA resserrée (anticipation vectorielle,
  coupeur) + accélération douce intra-niveau.

### La Chute du Compost (`/jeu/compost`)
- **Ce qui marche** : mécanique catégories compost/recyclé/maudit originale,
  ghost piece avec verdict coloré, réserve (hold), marge d'état des rangées,
  burst de ligne sainte.
- **Ce qui est faible** : pas d'animation d'effacement de ligne, pas de pause
  clavier, burst ignore prefers-reduced-motion, tuiles plates.
- **Top 3 impact/effort** : ① animation d'effacement + relief des tuiles ;
  ② pause (P) + reduced-motion partout ; ③ écran de fin avec verset (déjà là)
  enrichi du meilleur score.

### La Nuit des Empreintes (`/jeu/nuit-des-empreintes`)
- **Ce qui marche** : logique démineur saine (première sonde sûre, flood),
  3 nuits progressives, bilan par nuit, jugements Pratchett.
- **Ce qui est faible** : interaction mobile pénible (toggle sonder/marquer),
  pas d'accord (chord) sur les chiffres, couleurs des chiffres vives (hors DA),
  ambiance nocturne sommaire.
- **Top 3 impact/effort** : ① appui long = marquer (mobile) + chord sur chiffre
  satisfait ; ② palette nocturne sourde (taupe/parchemin, halos) ; ③ compteur de
  chats restants + feedback de sonde.

### Le Verbe du Jour (`/jeu/verbe`)
- **Ce qui marche** : logique pure testée, anti-flicker, partage sans spoiler en
  pastilles sourdes, série, clavier AZERTY complet.
- **Ce qui est faible** : lexique à 51 mots (cible 60+), pas de panneau de
  statistiques (répartition des essais), stats dérivables mais non affichées.
- **Top 3 impact/effort** : ① lexique étendu à 65+ avec révélations neuves ;
  ② panneau stats (parties, % victoires, séries, barres de répartition) ;
  ③ micro-confort (déjà bon — conserver).

## Ordre d'exécution

A (hub illustré) → B (Sentier des Spores) → C (Pac-Marcheuse) → D (Compost)
→ E (Empreintes) → F (Verbe) → G (passe transversale).

Un commit par phase, validations à chaque fois : `npx tsc --noEmit` exit 0,
`npm run build` OK, audit nominatif = 0 sur le code ajouté.

## Choix assumés (notés d'avance)

- Les jeux ne sont PAS réécrits de zéro : moteurs sains, on étend et on polit.
- « Olivia » subsiste comme identifiant interne (types, noms de fichiers) :
  aucune occurrence visible dans l'UI des jeux ; renommage de fichiers jugé
  risqué pour un gain nul à l'écran.
- Le mot « mémoire » apparaît dans des textes liturgiques préexistants au sens
  de « souvenir » (Annales, versets) — hors périmètre des jeux, conservé.
- Variation quotidienne : déjà naturelle au Verbe ; pour Pac, les 5 cimetières
  font office de variété ; pour le Compost, ajout jugé non prioritaire face au
  polish (noté hors périmètre).
