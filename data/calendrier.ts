export interface Fete {
  id: string;
  nom: string;
  mois: number;
  jour: number;
  jourFin?: number;
  moisFin?: number;
  description: string;
  rituel: string;
  type: "majeure" | "mineure" | "pelerinage" | "jeune";
}

export const calendrier: Fete[] = [
  {
    id: "chandeleur-mycelienne",
    nom: "La Chandeleur Mycélienne",
    mois: 2,
    jour: 2,
    type: "mineure",
    description:
      "Le compost reprend conscience. Les Vers de Terre se réveillent. Les premiers Perce-neige percent.",
    rituel:
      "Va voir ton composteur. Remue. Sens. Mets-y la première peau de banane de l'année avec une bénédiction.",
  },
  {
    id: "equinoxe-pollinisateur",
    nom: "L'Équinoxe du Pollinisateur",
    mois: 3,
    jour: 20,
    type: "majeure",
    description:
      "Lumière et nuit s'équilibrent. Les premiers Bourdons reines sortent d'hivernage. C'est la résurrection des Apoïdes.",
    rituel:
      "Observe pendant cinq minutes une fleur précoce (saule marsault, noisetier, perce-neige). Compte les visiteurs ailés.",
  },
  {
    id: "premier-pouillot",
    nom: "Le Premier Chant du Pouillot",
    mois: 3,
    jour: 21,
    type: "mineure",
    description:
      "Date approximative de l'arrivée du Pouillot véloce, premier migrateur de retour d'Afrique. Son chant 'tchif-tchaf' annonce officiellement le printemps.",
    rituel:
      "Sors avec attention. Écoute. Note la date exacte où tu l'entends pour la première fois. Compare d'une année sur l'autre.",
  },
  {
    id: "grande-floraison",
    nom: "La Grande Floraison",
    mois: 5,
    jour: 15,
    jourFin: 15,
    moisFin: 6,
    type: "majeure",
    description:
      "Période sacrée du 15 mai au 15 juin. C'est le pic de la floraison prairiale en Île-de-France et la fenêtre du protocole Vigie-Flore. Tonte interdite. Cueillette mesurée. Contemplation obligatoire.",
    rituel:
      "Pose un carré d'un mètre dans une prairie ou dans ton jardin non tondu. Compte les espèces. Reviens chaque semaine. Émerveille-toi.",
  },
  {
    id: "solstice-ete",
    nom: "Le Solstice des Ronces",
    mois: 6,
    jour: 21,
    type: "majeure",
    description:
      "Jour le plus long. Les Ronces commencent à former leurs premières mûres vertes. Les Hannetons chantent. Les Hérissons sont en pleine reproduction.",
    rituel:
      "Marche dans la nature à 4h du matin et reste jusqu'au lever du soleil. Tu n'oublieras jamais cette aube.",
  },
  {
    id: "jeune-aluminium",
    nom: "Le Jeûne d'Aluminium",
    mois: 7,
    jour: 1,
    jourFin: 7,
    type: "jeune",
    description:
      "Première semaine de juillet. Pas de dosette, pas de canette, pas de papier alu, pas de barquette alu. Sept jours de pénitence métallique.",
    rituel:
      "Recense chaque objet en aluminium que tu utilises habituellement. Trouve-leur un substitut pour la semaine. Tiens un carnet.",
  },
  {
    id: "nuit-chiropteres",
    nom: "La Nuit Internationale des Chiroptères",
    mois: 8,
    jour: 25,
    type: "majeure",
    description:
      "Dernier week-end d'août. Coïncide avec un événement réel. C'est la nuit où l'on sort pour saluer les chauves-souris en chasse.",
    rituel:
      "Va dans un parc ou un cimetière à la tombée de la nuit. Lève la tête. Compte les passages. Reste une heure. Ne parle pas.",
  },
  {
    id: "equinoxe-automne",
    nom: "L'Équinoxe des Compostiers",
    mois: 9,
    jour: 22,
    type: "majeure",
    description:
      "Lumière et nuit s'équilibrent à nouveau. Les feuilles commencent à tomber. C'est le moment de remuer son compost une dernière fois avant l'hiver.",
    rituel:
      "Aère ton compost. Ajoute des feuilles mortes en couches. Bénis-le pour l'année qui vient.",
  },
  {
    id: "pelerinage-cimetieres",
    nom: "Le Pèlerinage des Cimetières",
    mois: 11,
    jour: 1,
    type: "pelerinage",
    description:
      "Toussaint réinterprétée. La Prophétesse descend dans les cimetières d'Île-de-France et bénit les tombes envahies de Lierre. C'est la fête centrale de l'Ordre.",
    rituel:
      "Visite un cimetière. Marche entre les tombes. Note la biodiversité observée : Lichens, Mousses, Plantes pionnières, Pigeons, Écureuils. Plante mentalement un Romarin sur une tombe oubliée.",
  },
  {
    id: "saint-mycelium",
    nom: "La Saint-Mycélium",
    mois: 11,
    jour: 11,
    type: "mineure",
    description:
      "Fête patronale du Mycélium. À cette date, les premiers gels saisissent la terre, et le mycélium s'enfonce sous la surface, en attente.",
    rituel:
      "Trouve un champignon (en forêt, sur un tronc, sur une pelouse) et reste cinq minutes devant lui en silence. Remercie le réseau invisible.",
  },
  {
    id: "solstice-hiver",
    nom: "Le Solstice du Lichen",
    mois: 12,
    jour: 21,
    type: "majeure",
    description:
      "Nuit la plus longue. Le Lichen, lui, ne dort pas. Il photosynthétise dès qu'un rayon le frappe. C'est notre exemple de constance dans l'obscurité.",
    rituel:
      "Allume une bougie en cire d'abeille. Lis trois versets du Livre Sacré. Marche dehors cinq minutes dans le noir.",
  },
  {
    id: "veillee-graines",
    nom: "La Veillée des Graines",
    mois: 12,
    jour: 30,
    type: "mineure",
    description:
      "Avant-dernier jour de l'année. On range ses sachets de graines, on liste ce que l'on sèmera. C'est la préparation spirituelle du printemps.",
    rituel:
      "Trie tes graines. Note ce qui sera semé. Échange un sachet avec un voisin compostier.",
  },
];

export function getProchainFete(): Fete | null {
  const today = new Date();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const trie = [...calendrier].sort((a, b) => a.mois * 100 + a.jour - (b.mois * 100 + b.jour));
  for (const f of trie) {
    if (f.mois > m || (f.mois === m && f.jour >= d)) return f;
  }
  return trie[0] ?? null;
}
