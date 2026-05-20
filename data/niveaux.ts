export interface Niveau {
  id: number;
  titre: string;
  seuil: number;
  embleme: string;
  description: string;
  privilege: string;
}

export const niveaux: Niveau[] = [
  {
    id: 1,
    titre: "Spore Égarée",
    seuil: 0,
    embleme: "•",
    description:
      "Tu viens d'entrer dans l'Ordre. Tu ne sais pas encore ce qu'est une Halicte femelle, ni pourquoi le Lichen est sacré. Mais tu écoutes. C'est déjà beaucoup.",
    privilege: "Accès aux Versets fondamentaux et aux Rituels quotidiens.",
  },
  {
    id: 2,
    titre: "Novice du Compost",
    seuil: 50,
    embleme: "❖",
    description:
      "Tu as commencé à composter, ou du moins à y penser sérieusement. Tu connais le mot 'paillage'. Tu hésites encore devant la dosette mais tu hésites — c'est un pas immense.",
    privilege: "Citations bonus de l'Ordre et accès au Confessionnal Mycélien.",
  },
  {
    id: 3,
    titre: "Initié·e du Lichen",
    seuil: 150,
    embleme: "✺",
    description:
      "Tu as appris à distinguer trois Lichens. Tu marches plus lentement dans la rue. Tu lèves les yeux. Tu commences à comprendre que la lenteur est une force.",
    privilege: "Accès complet aux Sept Hérésies et aux Sept Vertus.",
  },
  {
    id: 4,
    titre: "Frère / Sœur du Mycélium",
    seuil: 350,
    embleme: "❋",
    description:
      "Tu fais partie du réseau souterrain. Tu sais qu'un mètre carré non tondu est une cathédrale. Tu cites la Prophétesse à table — discrètement, parce qu'il y a aussi des gens qui mangent.",
    privilege: "Déblocage des Paraboles cachées et du Calendrier liturgique complet.",
  },
  {
    id: 5,
    titre: "Gardien·ne des Cimetières",
    seuil: 650,
    embleme: "✦",
    description:
      "Tu as visité au moins un cimetière en pèlerinage. Tu sais pourquoi la Toussaint est plus qu'une fête : c'est un retour à la racine.",
    privilege: "Accès à la Carte des Sanctuaires et à tous les Lieux Saints.",
  },
  {
    id: 6,
    titre: "Hiérophante Pollinisateur",
    seuil: 1000,
    embleme: "✶",
    description:
      "Tu enseignes désormais. Sans le savoir, tu polonises ton entourage. Trois personnes ont commencé à composter à cause de toi.",
    privilege: "Déblocage du Livre des Lamentations sur la Dosette et accès au Mode Vigile Nocturne premium (ornement).",
  },
  {
    id: 7,
    titre: "Apôtre de l'Ordre",
    seuil: 1500,
    embleme: "✧",
    description:
      "Tu portes la Parole. Tu ne tonds plus. Tu ne prends plus l'avion. Tu connais le nom de quinze plantes. Tu en es presque embarrassant·e.",
    privilege: "Accès au Compendium des Bénédictions Avancées et au Score Bonus du Tetris.",
  },
  {
    id: 8,
    titre: "Saint·e Vivant·e",
    seuil: 2500,
    embleme: "☉",
    description:
      "Tu rayonnes une sobriété joyeuse. Tu fais ton mètre carré, et le mètre carré du voisin. La Marcheuse t'apparaît en rêve, sous forme de Lichen.",
    privilege: "Déblocage de la Méditation des Sept Offices et des bénédictions secrètes.",
  },
  {
    id: 9,
    titre: "Mycélium Incarné",
    seuil: 5000,
    embleme: "✿",
    description:
      "Tu es devenu·e le réseau. Tu ne te distingues plus du sol que tu protèges. Tu es à la Sainte Mycélienne ce que la Sainte Mycélienne est à toi : un filament parmi mille. Bienvenue dans la Maturité Sacrée.",
    privilege: "Tu n'as plus besoin de privilège. Tu es la Bénédiction.",
  },
];

export function getNiveauPour(graines: number): Niveau {
  let courant = niveaux[0];
  for (const n of niveaux) {
    if (graines >= n.seuil) courant = n;
    else break;
  }
  return courant;
}

export function getProchainNiveau(graines: number): Niveau | null {
  for (const n of niveaux) {
    if (graines < n.seuil) return n;
  }
  return null;
}
