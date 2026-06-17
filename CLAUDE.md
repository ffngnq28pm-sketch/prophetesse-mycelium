# Contexte utilisateur

> Généré depuis l'analyse des 9 projets de `~/Documents/Claude/`.
> Les règles de travail transverses (mode caveman, choix modèles) restent
> dans `~/.claude/CLAUDE.md`.

## Identité de marque

Source unique de vérité : **`brand.md`** (racine). Ne pas dupliquer la charte ici.

- Avant toute tâche touchant un **nom, un texte public, une UI, un visuel, un
  README ou de la copy** : lire `brand.md` et appliquer la charte.
- **Idée clé** : « un financier qui transforme l'aride en vivant — et qui le
  signe. » Tout livrable visible doit pouvoir s'y rattacher. Sinon, ne pas le produire.
- **Visuels** : respecter la palette et la règle de lumière de `brand.md`
  (froid sombre = le mort ; lumière chaude dorée = le vivant qui en sort).
- **Texte** : ton sobre et direct, zéro mot-buzz, tension avant résolution.
- En cas de conflit, **l'idée clé tranche**.

## Abonnements & comptes actifs

- **Apple Developer Program** — payé, actif. Team ID `8BDCCST69F`.
  Compte de build/submit : `Charif_Hachichi@hotmail.fr`.
- **App Store Connect** — Paid Apps Agreement signé, banque Boursorama,
  statut fiscal France : particulier (BNC non-pro, pas de SIRET).
  App `Charif` en ligne (ASC App ID `6769341844`, bundle `com.charif.spiritual`)
  avec 3 in-app purchases configurés (2,99 €/mois, 19,99 €/an, 79,99 € lifetime).
- **Expo / EAS** — compte `charif759491`. 6 apps liées (projectId présents).
- **GitHub** — compte `ffngnq28pm-sketch`. 7 dépôts.
- **Netlify** — 3 sites hébergés : Dharma, Emunah, Sophia/Olivia.
- **Railway** — héberge QCM PCO 2026 (Express + Vite).
- **Vercel** — héberge Prophétesse-Mycélium (Next.js static export).
- **RevenueCat** — prévu pour les achats in-app, clé API pas encore intégrée.
- **Domaine** — `shadowstepsociety.com` (sous-domaine `mycelium.` prévu).

## Environnement de développement

- macOS (Apple Silicon).
- Node 24.15 via **nvm**, npm 11. Pas de pnpm/yarn/bun.
- CLI installés : `eas-cli`, `@expo/cli`, `netlify-cli`, `gh`, `ngrok`.
- Homebrew : `cocoapods`, `fastlane`, `gh`, `ruby`, `terminal-notifier`.
- IDE : VS Code.
- Pas de CLI Vercel ni Railway — déploiement de ces deux via Git/UI.

## Stack par défaut

### App mobile (le cas le plus fréquent)
- Expo SDK 54, New Architecture activée.
- Expo Router v6, React Native 0.81, React 19.
- TypeScript strict.
- `react-native-purchases` (RevenueCat) pour les achats.
- Icônes : `lucide-react-native`. Polices : `@expo-google-fonts`.
- Build et publication : EAS Build → EAS Submit (iOS).

### App web
Préférence par défaut — **challengeable au cas par cas**, ne pas l'appliquer aveuglément.

- **App web interactive** (jeux, dashboards, état dynamique/temps réel, formulaires
  riches) : **React (Next.js App Router) + TypeScript + Tailwind**, avec les composants
  **shadcn/ui** copiés dans le projet via `npx shadcn@latest add` — jamais une lib de
  composants importée (Material UI, Bootstrap…).
  Pourquoi : accessible dès le départ (Radix), entièrement restylable (le code source
  vit dans le projet), zéro dépendance lourde à maintenir, quasi-standard prévisible.
- **Site essentiellement statique** (landing, vitrine de quelques sections sans vraie
  interactivité) : HTML/CSS simple ou setup minimal. React + shadcn = sur-ingénierie ici.
  En cas de doute sur la nature du projet → me poser la question avant de choisir la stack.
- **Tailwind CSS** (pas de CSS Modules). Zustand pour l'état global, Framer Motion
  pour les animations.
- **Style** : toujours partir d'un design system explicite avant de coder l'UI
  (palette en hex nommés, typo display + corps, élément signature) plutôt que des
  défauts génériques. Mobile-first quand l'app cible le téléphone.

## Workflows établis

- Git : branche `main`, commits conventionnels (`feat:`/`fix:`/`chore:`),
  messages souvent en français.
- iOS : `eas build` puis `eas submit` avec le compte `Charif_Hachichi@hotmail.fr`.
- Web : Netlify (export web des apps Expo), Vercel (Next.js), Railway (QCM).
- Structure type d'un projet Expo :
  `app/ components/ context/ data/ hooks/ lib/ services/ types/`.
- Suppression de fichiers : toujours `trash`, jamais `rm -rf`.
- Apps spirituelles déclinées par tradition : Charif (islam), Dharma
  (bouddhisme), Emunah (judaïsme), Olivia (christianisme).

## Choix déjà tranchés

- Apple Developer = `Charif_Hachichi@hotmail.fr` (les `eas.json` de CharifV3
  et NourV2 contenant `icloud.com` sont obsolètes).
- Contact public par défaut des apps (in-app, DSA Trader, support) =
  `Shadowstepsociety@gmail.com`.
- Email de signature des livrables web pro = `Charif.Hachichi@Egis-Group.com`.
- Le projet `Sophia` est rebrandé vers **Olivia** (nom d'app + bundle
  `com.charif.olivia`). Choix assumé : le slug Expo et le repo GitHub
  restent `sophia-christian-wisdom` — ne pas proposer de les renommer.
- Conventions de code : zéro `any`, zéro `ts-ignore`, pas de `console.log`
  hors `__DEV__`, guards plateforme (`if (Platform.OS === 'web') return;`).

## Règles pour Claude

- Ne pas proposer d'alternatives aux outils/services déjà listés ci-dessus,
  sauf demande explicite.
- Aller directement aux solutions compatibles avec ce setup.
- Si une nouvelle techno est strictement nécessaire, le signaler clairement
  plutôt que de présenter un arbre de décision.

---

# Règles Claude Code

## Suppression de fichiers

Toujours utiliser `trash` à la place de `rm -rf` pour déplacer les fichiers vers la Corbeille macOS au lieu de les supprimer définitivement.

```bash
# À éviter
rm -rf mon-dossier/

# À utiliser
trash mon-dossier/
```

Si `trash` n'est pas installé : `brew install trash`

## Signature des travaux

Toujours signer les livrables avec la signature suivante, de manière élégante et adaptée au contexte (footer d'application web, bas de document, etc.) :

**Nom :** Charif Hachichi  
**Email :** Charif.Hachichi@Egis-Group.com  
**Photo :** Utiliser la photo de profil fournie par l'utilisateur (style LinkedIn, portrait professionnel)

### Signature HTML (pour les applications web)
```html
<footer class="signature">
  <img src="/photo-profil.jpg" alt="Charif Hachichi" />
  <div>
    <strong>Charif Hachichi</strong>
    <a href="mailto:Charif.Hachichi@Egis-Group.com">Charif.Hachichi@Egis-Group.com</a>
  </div>
</footer>
```

### Signature texte (pour les documents)
```
─────────────────────────────
Charif Hachichi
Charif.Hachichi@Egis-Group.com
─────────────────────────────
```

> Note : pour inclure la photo, l'utilisateur doit fournir le fichier image (LinkedIn ou autre).
