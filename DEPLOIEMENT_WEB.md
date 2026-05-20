# 🌐 Déploiement Web — Étapes pour Charif

Ce guide te mène de « le code est prêt » à « l'app est en ligne sur
`mycelium.shadowstepsociety.com` ». Compte ~25 minutes de manipulation,
plus 5 min à 24 h d'attente DNS.

## ✅ Côté code (déjà fait par Claude Code)

- `next.config.mjs` configuré en static export (`output: 'export'`)
- Build statique testé : `/out` génère 75 pages HTML
- `.gitignore` propre (node_modules, .next, out, .vercel, iOS Pods… ignorés)
- `README.md` accueillant
- `LICENSE` MIT en place
- `vercel.json` configuré
- Git initialisé, premier commit fait, branche `main`

Tu n'as plus qu'à suivre les étapes ci-dessous.

---

## 1. Pousser sur GitHub (~5 min)

### a. Créer le repo GitHub

1. Va sur https://github.com/new
2. **Repository name** : `prophetesse-mycelium`
3. Choisis **Public** (si tu veux le montrer) ou **Private** (sinon)
4. **NE COCHE PAS** « Add a README file », « Add .gitignore », ni « Choose a license » —
   on a déjà tout ça dans le repo local.
5. Clique **Create repository**

### b. Lier ton repo local au repo GitHub

GitHub affiche une page avec des commandes. Ignore-les, utilise celles-ci.
Dans ton terminal, dans le dossier `Prophétesse-Mycélium` :

```bash
git remote add origin https://github.com/TON_USERNAME/prophetesse-mycelium.git
git push -u origin main
```

Remplace `TON_USERNAME` par ton nom d'utilisateur GitHub.

> **Authentification** : GitHub n'accepte plus le mot de passe en ligne de commande.
> Si on te le demande, crée un *Personal Access Token* :
> GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
> → Generate new token → coche `repo` → copie le token et utilise-le comme mot de passe.
> (Ou installe GitHub CLI : `brew install gh` puis `gh auth login`.)

Une fois poussé, rafraîchis la page GitHub : ton code y est.

---

## 2. Déployer sur Vercel (~5 min)

1. Va sur https://vercel.com
2. **Sign Up** (ou Log In) — choisis **« Continue with GitHub »** pour lier les deux comptes
3. Clique **« Add New… »** → **« Project »**
4. Vercel affiche tes repos GitHub. Trouve **`prophetesse-mycelium`**, clique **Import**
5. Écran de configuration — tout est déjà détecté correctement :
   - **Framework Preset** : Next.js
   - **Root Directory** : `./`
   - **Build Command** : `npm run build`
   - **Output Directory** : `out`
   - Pas de variable d'environnement à ajouter (l'app n'en utilise aucune)
6. Clique **Deploy**
7. Attends 60–90 secondes
8. Vercel te donne une URL du type `prophetesse-mycelium-xxxx.vercel.app`.
   **Ouvre-la** : ton app doit s'afficher (écran d'onboarding « Bienvenue »).

Si le site marche : passe à l'étape 3. Si erreur : voir « Dépannage » en bas.

---

## 3. Lier `mycelium.shadowstepsociety.com` (~15 min + attente DNS)

### a. Dans Vercel

1. Dashboard du projet → **Settings** → **Domains**
2. Tape `mycelium.shadowstepsociety.com` dans le champ → **Add**
3. Vercel affiche la configuration DNS à créer. Pour un sous-domaine, c'est un
   enregistrement **CNAME** pointant vers **`cname.vercel-dns.com`**.
   **Note exactement ce que Vercel affiche** (la cible peut varier légèrement).

### b. Chez OVH

1. Connecte-toi sur https://www.ovh.com/manager/
2. **Web Cloud** → **Noms de domaine** → clique sur `shadowstepsociety.com`
3. Onglet **Zone DNS**
4. **Ajouter une entrée**
5. Type : **CNAME**
6. **Sous-domaine** : `mycelium` (juste ce mot)
7. **Cible** : `cname.vercel-dns.com.` — **avec le point final**
   (ou la valeur exacte donnée par Vercel)
8. TTL : laisse par défaut
9. Valide, puis confirme les modifications de la zone

### c. Attendre la propagation DNS

- Généralement **5–30 minutes**, parfois jusqu'à 24 h
- Vérifie sur https://dnschecker.org/ en tapant `mycelium.shadowstepsociety.com`
  et en choisissant le type **CNAME**
- Dès que c'est propagé, Vercel détecte automatiquement, valide le domaine,
  et émet un certificat HTTPS gratuit

### d. En ligne 🎉

Va sur `https://mycelium.shadowstepsociety.com`. L'app est publique.

---

## 4. Le workflow de mise à jour

À chaque modification du code (par toi ou par Claude Code) :

```bash
git add .
git commit -m "Description de ce qui change"
git push
```

Vercel détecte le push sur `main`, rebuild et redéploie en 60–90 secondes.
Aucune action manuelle. Chaque commit te donne aussi une *preview URL* unique.

---

## 5. Bonus — d'autres apps sous ShadowStepSociety

Chaque future app peut avoir son sous-domaine gratuit :
`jeux.shadowstepsociety.com`, `carnet.shadowstepsociety.com`, etc.

Même procédé : repo GitHub → import Vercel → un CNAME chez OVH.

Tu peux aussi faire pointer le domaine racine `shadowstepsociety.com` vers une
page d'accueil « hub » — chez OVH, ce sera un enregistrement de type **A** ou
**ALIAS** vers les IP de Vercel (Vercel te les indiquera).

---

## Dépannage

| Problème | Solution |
|---|---|
| Build échoue sur Vercel | Vérifie que `npm run build` passe en local. Regarde les logs Vercel. |
| Page blanche après déploiement | Vérifie que l'Output Directory est bien `out`. |
| `git push` refusé (auth) | Utilise un Personal Access Token ou GitHub CLI (`gh auth login`). |
| DNS pas propagé après 1 h | Revérifie le CNAME chez OVH (sous-domaine = `mycelium`, point final sur la cible). |
| HTTPS « non sécurisé » | Patiente : Vercel émet le certificat automatiquement après validation DNS. |

---

*Que la Sève soit avec toi. Amen-Compost.* 🍄
