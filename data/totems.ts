export interface Totem {
  id: string;
  nom: string;
  embleme: string;
  description: string;
  vertu: string;
  bonus: string;
}

export const totems: Totem[] = [
  {
    id: "herisson",
    nom: "Le Hérisson",
    embleme: "🦔",
    description:
      "Solitaire, nocturne, têtu. Le Hérisson traverse les jardins par les passages bas, dévore limaces et escargots, et hiberne sous une couche de feuilles mortes.",
    vertu: "Constance",
    bonus: "Tu obtiens +5% de Graines de Grâce sur les rituels du soir.",
  },
  {
    id: "halicte",
    nom: "L'Halicte",
    embleme: "🐝",
    description:
      "Petite abeille sauvage solitaire, l'Halicte niche dans le sol nu. Elle pollinise discrètement sans miel, sans ruche, sans publicité. Elle est l'ouvrière oubliée des prairies.",
    vertu: "Discrétion",
    bonus: "Tu obtiens +5% de Graines pour les rituels accomplis avant 8h.",
  },
  {
    id: "pigeon",
    nom: "Le Pigeon Ramier",
    embleme: "🕊",
    description:
      "Plus grand que son cousin urbain, le Pigeon ramier (ou Palombe) niche dans les arbres des cimetières et des parcs. Symbole de réconciliation entre ville et campagne.",
    vertu: "Persévérance",
    bonus: "Tu obtiens un Verset bonus chaque matin.",
  },
  {
    id: "mycelium",
    nom: "Le Mycélium",
    embleme: "🍄",
    description:
      "Réseau souterrain de filaments, le Mycélium est le système nerveux de la forêt. Il connecte, redistribue, communique sans bruit. Il est le totem ultime de l'Ordre.",
    vertu: "Humilité",
    bonus: "Tu obtiens +10% sur les Graines de Confession.",
  },
  {
    id: "ver-terre",
    nom: "Le Ver de Terre",
    embleme: "〰",
    description:
      "Lombric anonyme et essentiel. Il digère le sol, l'aère, le fertilise. Sans lui, l'agriculture est morte. Avec lui, tout repousse.",
    vertu: "Lenteur",
    bonus: "Tu obtiens +5% sur tous les rituels liés au compost.",
  },
  {
    id: "chiroptere",
    nom: "Le Chiroptère",
    embleme: "🦇",
    description:
      "Mammifère volant aux ailes membranées. La Pipistrelle commune mange 3 000 moustiques par nuit. La Sérotine commune patrouille les cimetières. Elles sont nos sœurs nocturnes.",
    vertu: "Service Silencieux",
    bonus: "Tu obtiens +10% de Graines pour les rituels accomplis après 21h.",
  },
  {
    id: "lichen",
    nom: "Le Lichen",
    embleme: "✺",
    description:
      "Symbiose entre un champignon et une algue. Le Lichen colonise les pierres tombales, les troncs, les murs nus. Il croît d'un millimètre par an et peut vivre cent ans.",
    vertu: "Patience",
    bonus: "Tu obtiens +1 Graine permanente par jour de connexion consécutif.",
  },
];

export function getTotem(id: string): Totem | undefined {
  return totems.find((t) => t.id === id);
}
