export type Saison = "printemps" | "ete" | "automne" | "hiver";

export interface OfficeRituel {
  id: string;
  nom: string;
  heure: string;
  embleme: string;
  geste: string;
  benediction: string;
  graines: number;
  /**
   * Variantes saisonnières du geste. Si absentes, on retombe sur le geste générique.
   * Un disciple ordinaire n'a pas le même rapport au compost en janvier qu'en juin.
   */
  variantes?: Partial<Record<Saison, string>>;
}

export const offices: OfficeRituel[] = [
  {
    id: "matines",
    nom: "Matines",
    heure: "Avant 8h",
    embleme: "✷",
    geste: "Saluer le premier oiseau entendu — silencieusement, en s'arrêtant trois secondes.",
    benediction:
      "Que le chant matinal te lave de la nuit. Que tu retiennes une seule note, et qu'elle te suive tout le jour.",
    graines: 5,
    variantes: {
      printemps:
        "Saluer le premier oiseau entendu — il est fort probable que ce soit une Mésange charbonnière ou un Rougegorge. S'arrêter trois secondes. Tenter, pour soi seul, d'identifier l'espèce.",
      ete:
        "Saluer le premier oiseau entendu, qui chante désormais avant 5h30 — ce qui n'oblige pas à se lever à 5h30, mais permet de pardonner aux merles d'avoir trop d'enthousiasme.",
      automne:
        "Saluer le premier oiseau entendu, en sachant que les migrateurs sont partis et que ceux qui restent ont, par définition, plus de courage que toi.",
      hiver:
        "Saluer le premier oiseau entendu — il sera rare, il sera bref, il sera essentiel. S'arrêter cinq secondes (deux de plus qu'en été : c'est la prime à la rareté).",
    },
  },
  {
    id: "laudes",
    nom: "Laudes",
    heure: "8h — 10h",
    embleme: "❂",
    geste:
      "Boire un verre d'eau du robinet en pleine conscience, en remerciant les nappes phréatiques.",
    benediction: "Que cette eau te rappelle ta dette envers le sol qui filtre.",
    graines: 3,
    variantes: {
      ete:
        "Boire un verre d'eau du robinet — fraîche, idéalement de la veille au frigo — en remerciant la nappe phréatique qui, malgré les sécheresses successives, continue à tenir bon. Lui souhaiter intérieurement bon courage pour août.",
      hiver:
        "Boire un verre d'eau du robinet, tempérée, en pensant à toutes les nappes qui se rechargent en silence pendant que la ville fait des choses sans rapport. Remercier la pluie de novembre, même s'il a plu sur un imperméable qui était neuf.",
    },
  },
  {
    id: "tierce",
    nom: "Tierce",
    heure: "10h — 12h",
    embleme: "✸",
    geste:
      "Ne pas céder à la tentation de la Dosette. Si tu veux du café, mouds-le, infuse-le, attends-le.",
    benediction:
      "Que ta lenteur sacrée fasse honte au métal sans âme. Que le moulin chante pour toi.",
    graines: 7,
    variantes: {
      hiver:
        "Ne pas céder à la tentation de la Dosette, même quand tes mains sont froides et que la patience est, statistiquement, à son étiage annuel. Faire le café à la main. Souffler dans la tasse comme on souffle sur une braise.",
      ete:
        "Ne pas céder à la tentation de la Dosette. En été, faire un café froid en infusion lente (12 heures, mouture grossière, eau filtrée). C'est plus long qu'un café chaud, ce qui est, dans la théologie de l'Ordre, un argument en sa faveur.",
    },
  },
  {
    id: "sexte",
    nom: "Sexte",
    heure: "12h — 14h",
    embleme: "☀",
    geste:
      "Manger un repas végétal ou à dominante végétale. Compter les légumes dans l'assiette.",
    benediction:
      "Que ton ventre devienne un compost vivant, et que les pollinisateurs te reconnaissent à l'odeur.",
    graines: 6,
    variantes: {
      printemps:
        "Manger un repas où figure au moins une plante de la saison nouvelle : Asperge, Radis, jeunes pousses, Roquette. Lui dire merci à voix basse avant la première bouchée. Personne ne te regarde.",
      ete:
        "Manger une tomate de saison à 17h, encore tiède du soleil, avec un peu de sel et trois feuilles de Basilic. Si tu n'as pas de tomate, manger ce que tu as. La tomate est un idéal, pas une obligation.",
      automne:
        "Manger une soupe. Toute soupe convient, à condition qu'elle ait été faite par quelqu'un (toi, idéalement) et qu'elle contienne au moins quatre légumes. Manger sans téléphone.",
      hiver:
        "Manger un légume-racine : Carotte, Panais, Topinambour, Betterave. Honorer ce qui a poussé sous terre pendant que tu pensais à autre chose.",
    },
  },
  {
    id: "none",
    nom: "None",
    heure: "14h — 17h",
    embleme: "☼",
    geste:
      "Marcher dix minutes sans regarder l'écran. Observer un être vivant non-humain en chemin.",
    benediction:
      "Que tes pieds t'apprennent ce que tes pouces t'ont fait oublier. Que tu reconnaisses un Plantain.",
    graines: 5,
    variantes: {
      printemps:
        "Marcher dix minutes sans téléphone. Repérer une plante en floraison qui n'y était pas la semaine dernière. Tenter de la nommer. Ne pas tricher en utilisant Pl@ntNet — tricher est permis dimanche.",
      ete:
        "Marcher dix minutes à l'ombre, sans téléphone. Compter les passages d'Halictes ou de Bourdons sur les fleurs de bord de trottoir. Renoncer après trois si tu fonds.",
      hiver:
        "Marcher dix minutes, emmitouflé, sans téléphone. Repérer un Lichen sur un mur. Y rester immobile trente secondes. Songer que lui aussi vit dehors en janvier, et qu'il ne s'en plaint pas.",
    },
  },
  {
    id: "vepres",
    nom: "Vêpres",
    heure: "17h — 20h",
    embleme: "✺",
    geste:
      "Observer un être vivant non-humain pendant une minute pleine. Plante, insecte, oiseau, mousse — peu importe.",
    benediction:
      "Que ce vivant te le rende un jour. Tu ne sauras pas comment, mais il te le rendra.",
    graines: 7,
    variantes: {
      ete:
        "Observer un être vivant pendant une minute pleine. En été, viser un Bourdon, un Syrphe, une fleur visitée — la matière ne manque pas. Une minute, c'est plus long qu'on ne croit ; c'est le miracle.",
      automne:
        "Observer une feuille qui tombe, suivre sa trajectoire jusqu'au sol, puis rester dix secondes devant elle une fois posée. C'est moins facile qu'il n'y paraît.",
      hiver:
        "Observer une trace sur la neige, une empreinte dans la boue, une silhouette à travers une branche nue. Une minute. L'hiver est l'art de voir ce qui reste quand tout le reste s'est tu.",
    },
  },
  {
    id: "complies",
    nom: "Complies",
    heure: "Avant le coucher",
    embleme: "☾",
    geste:
      "Éteindre toutes les lumières inutiles. Préférer la pénombre. Dormir tôt si possible.",
    benediction:
      "Que la nuit te reprenne dans ses voiles. Que les Chiroptères passent en paix au-dessus de toi.",
    graines: 5,
    variantes: {
      ete:
        "Éteindre toutes les lumières extérieures avant 22h. Sortir un instant, lever la tête, repérer un passage de Chiroptère. Il y en aura un : tu n'es pas seul·e à veiller la nuit.",
      hiver:
        "Éteindre toutes les lumières inutiles. Préférer la pénombre. Dormir tôt — l'hiver te le pardonne, l'hiver te le demande. Treize heures de sommeil ne sont pas de la paresse, ce sont une politesse rendue au cycle.",
    },
  },
];

const MOIS_SAISON: Record<number, Saison> = {
  1: "hiver", 2: "hiver", 12: "hiver",
  3: "printemps", 4: "printemps", 5: "printemps",
  6: "ete", 7: "ete", 8: "ete",
  9: "automne", 10: "automne", 11: "automne",
};

export function saisonCourante(date: Date = new Date()): Saison {
  return MOIS_SAISON[date.getMonth() + 1] ?? "printemps";
}

export const LABEL_SAISON: Record<Saison, string> = {
  printemps: "Variante du printemps",
  ete: "Variante d'été",
  automne: "Variante d'automne",
  hiver: "Variante d'hiver",
};

/** Renvoie le geste à pratiquer aujourd'hui, en utilisant la variante saisonnière si elle existe. */
export function gesteDuJour(office: OfficeRituel, date: Date = new Date()): {
  texte: string;
  saison: Saison;
  estSaisonnier: boolean;
} {
  const saison = saisonCourante(date);
  const variante = office.variantes?.[saison];
  return {
    texte: variante ?? office.geste,
    saison,
    estSaisonnier: Boolean(variante),
  };
}
