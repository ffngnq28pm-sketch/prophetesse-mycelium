// Les Veilles — contenu d'après-Voie. Une fois les neuf chapitres franchis, le
// pèlerinage n'a plus d'objectifs : il a des veilles. Une par jour, sans fin.

export interface Veille {
  id: string;
  titre: string;
  texte: string;
}

export const VEILLES: Veille[] = [
  {
    id: "fenetre",
    titre: "La Veille de la Fenêtre",
    texte: "Ouvre une fenêtre. Tiens-toi devant une minute, sans téléphone, sans but précis. C'est ainsi, dit-on, que s'apaise le Léger Embarras Métaphysique du Mardi.",
  },
  {
    id: "cafe-lent",
    titre: "La Veille du Café Lent",
    texte: "Prépare un café au filtre. Regarde l'eau traverser le marc sans rien faire d'autre. Le marc rejoindra ensuite le compost : rien ne se perd.",
  },
  {
    id: "pas-compte",
    titre: "La Veille du Pas Compté",
    texte: "En marchant aujourd'hui, repère une plante qui pousse dans une fissure du bitume. Salue-la mentalement. Puis continue ton chemin.",
  },
  {
    id: "sept-secondes",
    titre: "La Veille des Sept Secondes",
    texte: "Avant de répondre à quelqu'un, aujourd'hui, laisse passer sept secondes une seule fois. Observe ce que ce silence change.",
  },
  {
    id: "arbre-choisi",
    titre: "La Veille de l'Arbre Choisi",
    texte: "Choisis un arbre sur l'un de tes trajets. C'est désormais ton arbre. Tu n'as rien à en faire : il te suffit de savoir qu'il est là.",
  },
  {
    id: "compost-interieur",
    titre: "La Veille du Compost Intérieur",
    texte: "Pense à une vieille rancune. Décide qu'elle peut, comme toute matière, devenir terre. Laisse-la composter en paix.",
  },
  {
    id: "insecte-gracie",
    titre: "La Veille de l'Insecte Gracié",
    texte: "Le prochain insecte que tu croises chez toi, fais-le sortir plutôt que de l'écraser. Sans cérémonie, mais sans hâte.",
  },
  {
    id: "lumiere-eteinte",
    titre: "La Veille de la Lumière Éteinte",
    texte: "Ce soir, éteins une lumière extérieure ou inutile. Les Chiroptères, dit-on, remarquent ce genre de choses.",
  },
  {
    id: "nom-appris",
    titre: "La Veille du Nom Appris",
    texte: "Apprends le nom d'une plante que tu vois souvent sans le connaître. Un seul nom suffit pour aujourd'hui.",
  },
  {
    id: "chose-reparee",
    titre: "La Veille de la Chose Réparée",
    texte: "Répare une petite chose au lieu de la remplacer. Même réparée de travers, c'est une forme de prière.",
  },
  {
    id: "eau-regardee",
    titre: "La Veille de l'Eau Regardée",
    texte: "En te lavant les mains, regarde l'eau une fois vraiment. Pense à son voyage. Referme le robinet un peu plus tôt que d'habitude.",
  },
  {
    id: "ciel-leve",
    titre: "La Veille du Ciel Levé",
    texte: "Lève les yeux vers le ciel une fois aujourd'hui, sans raison, sans en faire de photo.",
  },
  {
    id: "trognon-rendu",
    titre: "La Veille du Trognon Rendu",
    texte: "Le prochain trognon, épluchure ou marc de café : ne le jette pas au hasard. Rends-le à la terre, ou garde-le pour elle.",
  },
  {
    id: "lenteur-choisie",
    titre: "La Veille de la Lenteur Choisie",
    texte: "Fais une tâche ordinaire deux fois plus lentement que d'habitude. Constate que le monde ne s'écroule pas pour autant.",
  },
  {
    id: "voisin-salue",
    titre: "La Veille du Voisin Salué",
    texte: "Salue aujourd'hui quelqu'un que tu salues rarement. Le mycélium est aussi un réseau de personnes.",
  },
  {
    id: "bruit-ecoute",
    titre: "La Veille du Bruit Écouté",
    texte: "Ferme les yeux trente secondes et compte les sons que tu entends, sans en juger aucun. Il y en a toujours plus qu'on ne croit.",
  },
  {
    id: "graine-lancee",
    titre: "La Veille de la Graine Lancée",
    texte: "Si tu as une graine, une fleur fanée ou un fruit oublié, confie-le à un coin de terre. Et ne reviens pas vérifier.",
  },
  {
    id: "carre-non-fauche",
    titre: "La Veille du Carré Non Fauché",
    texte: "Laisse, quelque part, un petit espace en désordre — un coin de balcon, de jardin, ou de tête. La friche est sainte.",
  },
  {
    id: "gratitude-breve",
    titre: "La Veille de la Gratitude Brève",
    texte: "Remercie en silence une chose non-humaine qui t'a servi aujourd'hui : un outil, un arbre, la lumière du jour.",
  },
  {
    id: "pardon-aux-pigeons",
    titre: "La Veille du Pardon aux Pigeons",
    texte: "Les Pigeons existent. Aujourd'hui, ne leur en veux pas. C'est tout. C'est déjà beaucoup.",
  },
  {
    id: "page-refermee",
    titre: "La Veille de la Page Refermée",
    texte: "Ferme cette application plus tôt que prévu, et va dehors. La dernière veille consiste à ne plus avoir besoin des veilles.",
  },
];

// Veille du jour : déterministe, tourne sur toute l'année.
export function getVeilleDuJour(d: Date = new Date()): Veille {
  const start = new Date(d.getFullYear(), 0, 0);
  const jour = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return VEILLES[jour % VEILLES.length];
}
