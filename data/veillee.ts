// L'Épreuve de la Veillée — données des cinq sceaux + railleries des défunts.
// Étape 1 : seul le Sceau I (Cadran de Lichen) est ACTIF ; les autres sont des
// placeholders « à venir » (non bloquants). Le Portail s'adapte au nombre de
// sceaux actifs (comme le grade de l'Université s'adapte aux leçons publiées).

export interface Sceau {
  id: string;
  numero: string; // chiffre romain (I..V)
  titre: string;
  fond: string; // slug du fond de scène sous /banque/veillee/<fond>.webp
  actif: boolean; // false = « à venir » (étape ultérieure), non bloquant
  resume: string;
  defunt: string; // raillerie attachée au sceau
}

export const SCEAUX: Sceau[] = [
  {
    id: "cadran",
    numero: "I",
    titre: "Le Cadran de Lichen",
    fond: "cadran",
    actif: true,
    resume:
      "Un vieux cadran solaire de pierre, à demi mangé par le lichen. Au nord, la pierre est plus fraîche, plus ombragée — la mousse y prospère davantage. Repère la face la plus moussue, oriente l'aiguille vers ce nord, et lis le symbole qui n'apparaît qu'ainsi.",
    defunt:
      "Sieur Cendrillon ronchonne : « De mon temps, on grattait le lichen. Quelle idée de le laisser dire le nord… »",
  },
  {
    id: "horloge",
    numero: "II",
    titre: "L'Horloge Florale",
    fond: "parterre",
    actif: true,
    resume:
      "Un parterre de fleurs sauvages — certaines ouvertes, d'autres closes. L'horloge de Flore de Linné : lire l'heure de la nuit aux fleurs éveillées.",
    defunt: "Dame Précieuse s'offusque qu'on la fasse poireauter à une heure pareille.",
  },
  {
    id: "pollinisateurs",
    numero: "III",
    titre: "Chaque Fleur, son Pollinisateur",
    fond: "mur-fleurs",
    actif: true,
    resume:
      "Un mur de fleurs et, figés, leurs visiteurs. Relier chaque pollinisateur à sa fleur — le mutualisme a ses affinités.",
    defunt: "Petit Marcel trouve les papillons rigolos et propose une aide à moitié fausse.",
  },
  {
    id: "compost",
    numero: "IV",
    titre: "La Stratigraphie du Compost",
    fond: "strates",
    actif: true,
    resume:
      "Un bac de compost en coupe. Frais en haut, mûr en bas : ordonner les couches et y lire la saison.",
    defunt: "Une note de la Marcheuse : « Ce qui pourrit n'est pas perdu. C'est patient. »",
  },
  {
    id: "empreintes",
    numero: "V",
    titre: "Les Empreintes",
    fond: "empreintes",
    actif: true,
    resume:
      "Un sentier de boue, des empreintes nettes. Déduire quel passant nocturne est venu cette nuit.",
    defunt: "Les trois spectres parient sur l'animal. Tous se trompent.",
  },
];

export const SCEAUX_ACTIFS = SCEAUX.filter((s) => s.actif);

export function getSceau(id: string): Sceau | undefined {
  return SCEAUX.find((s) => s.id === id);
}

// Railleries génériques des défunts marris (jamais culpabilisantes) — affichées
// sur une mauvaise tentative, sans aucune pénalité.
export const RAILLERIES: string[] = [
  "Sieur Cendrillon, sans lever les yeux : « Non. Mais c'était joliment tenté. »",
  "Dame Précieuse soupire : « De mon vivant, on réfléchissait avant. »",
  "Petit Marcel, encourageant : « Presque ! Enfin… pas vraiment. Mais presque ! »",
  "Un courant d'air fait mine de rien. Ce n'était pas ça.",
  "Sieur Cendrillon : « La nature ne triche pas. Toi non plus, paraît-il. Recommence. »",
];

export function railleAuHasard(): string {
  return RAILLERIES[Math.floor(Math.random() * RAILLERIES.length)];
}
