export interface Totem {
  id: string;
  nom: string;
  embleme: string;
  description: string;
  vertu: string;
  bonus: string;
  recit: string;
}

export const totems: Totem[] = [
  {
    id: "herisson",
    nom: "Le Hérisson",
    embleme: "🦔",
    description:
      "Solitaire, nocturne, têtu. Le Hérisson traverse les jardins par les passages bas, dévore limaces et escargots, et hiberne sous une couche de feuilles mortes.",
    vertu: "Constance",
    bonus: "+5% de Graines de Grâce sur les rituels du soir.",
    recit:
      "Frère Hérisson, qui fut boulanger avant d'entrer dans l'Ordre, raconte qu'il a connu un Hérisson nommé Édouard. Édouard traversait chaque nuit la même haie pour rejoindre la même soucoupe d'eau, posée par le même retraité, qu'Édouard n'a jamais salué. Trois ans durant. Et un soir Édouard n'est plus venu. Le retraité a continué à poser la soucoupe pendant cinq mois, par habitude. Et c'est cela, dit Frère Hérisson, la définition exacte de la constance : continuer après que l'objet du geste a disparu.",
  },
  {
    id: "halicte",
    nom: "L'Halicte",
    embleme: "🐝",
    description:
      "Petite abeille sauvage solitaire, l'Halicte niche dans le sol nu. Elle pollinise discrètement sans miel, sans ruche, sans publicité. Elle est l'ouvrière oubliée des prairies.",
    vertu: "Discrétion",
    bonus: "+5% de Graines pour les rituels accomplis avant 8h.",
    recit:
      "Sœur Halicte enseigne que l'Halicte ne demande pas la permission. Elle ne tient pas de réunion d'information préalable. Elle creuse son trou, elle pond, elle pollinise, elle meurt — et tout cela en trois mois. À l'échelle de l'Ordre, c'est l'équivalent d'une carrière complète, ministérielle comprise. La différence est que personne ne lui a remis de médaille, ce dont l'Halicte se serait, de toute façon, profondément moquée.",
  },
  {
    id: "pigeon",
    nom: "Le Pigeon Ramier",
    embleme: "🕊",
    description:
      "Plus grand que son cousin urbain, le Pigeon ramier (ou Palombe) niche dans les arbres des cimetières et des parcs. Symbole de réconciliation entre ville et campagne.",
    vertu: "Persévérance",
    bonus: "Un Verset bonus chaque matin.",
    recit:
      "On a longtemps moqué le Pigeon. On l'a dit sale, gris, sans génie. C'est, observe Mère Mycorhize, ce qu'on dit aussi des gens qui prennent le métro à 6h45 pour aller faire des choses qu'on n'aime pas. Le Pigeon est, comme eux, simplement quelqu'un qui continue. Sans drame. Sans bouquet. Il niche dans une corniche du périphérique, il élève deux petits, il vit dix ans, et il ne fait pas plus de bruit qu'il n'en faut.",
  },
  {
    id: "mycelium",
    nom: "Le Mycélium",
    embleme: "🍄",
    description:
      "Réseau souterrain de filaments, le Mycélium est le système nerveux de la forêt. Il connecte, redistribue, communique sans bruit. Il est le totem ultime de l'Ordre.",
    vertu: "Humilité",
    bonus: "+10% sur les Graines de Confession.",
    recit:
      "On ne célèbre pas le Mycélium parce que le Mycélium ne fait rien de remarquable, sinon tout. Il transporte le sucre d'un arbre à l'autre, il signale les attaques d'insectes, il redistribue l'azote — et personne ne lui a jamais demandé son avis sur quoi que ce soit. Sœur Mycélium, à qui on a un jour demandé pourquoi elle avait choisi ce totem, a répondu : « Parce que c'est le seul totem qui ne se vexe pas qu'on l'oublie. » Puis elle a oublié la question elle-même, ce qu'elle a considéré comme une réussite.",
  },
  {
    id: "ver-terre",
    nom: "Le Ver de Terre",
    embleme: "〰",
    description:
      "Lombric anonyme et essentiel. Il digère le sol, l'aère, le fertilise. Sans lui, l'agriculture est morte. Avec lui, tout repousse.",
    vertu: "Lenteur",
    bonus: "+5% sur tous les rituels liés au compost.",
    recit:
      "Le Ver de Terre ingère chaque jour son propre poids de terre. C'est, traduit à l'échelle humaine, l'équivalent de manger soixante kilos de salade quotidiens — exploit que même les plus sincères des végétariens auraient du mal à tenir. Le Ver ne se vante pas. Il ne tient pas de blog. Il ne réclame pas de subvention. Il digère, simplement, et il rend tout en compost. Frère Théodule, qui prétend avoir surpris des élections municipales chez les Vers, n'a jamais pu produire de bulletin — mais il maintient sa version.",
  },
  {
    id: "chiroptere",
    nom: "Le Chiroptère",
    embleme: "🦇",
    description:
      "Mammifère volant aux ailes membranées. La Pipistrelle commune mange 3 000 moustiques par nuit. La Sérotine commune patrouille les cimetières. Elles sont nos sœurs nocturnes.",
    vertu: "Service Silencieux",
    bonus: "+10% de Graines pour les rituels accomplis après 21h.",
    recit:
      "On a peur des chauves-souris parce qu'on a peur de tout ce qui sort la nuit sans demander l'autorisation. Or la Pipistrelle commune débarrasse un jardin de trois mille moustiques par nuit, ce qui est, d'après le calcul des disciples qui tiennent ce genre de registres, l'équivalent de trois cents euros d'insecticide non acheté. Elles ne facturent rien. Elles ne réclament pas même une mention sur la facture d'EDF. Elles travaillent, et au matin elles dorment la tête en bas dans une fente que personne ne soupçonne.",
  },
  {
    id: "lichen",
    nom: "Le Lichen",
    embleme: "✺",
    description:
      "Symbiose entre un champignon et une algue. Le Lichen colonise les pierres tombales, les troncs, les murs nus. Il croît d'un millimètre par an et peut vivre cent ans.",
    vertu: "Patience",
    bonus: "+1 Graine permanente par jour de connexion consécutif.",
    recit:
      "Frère Lichen, qui photographie les Lichens du cimetière de Pantin depuis vingt-deux ans, soutient que les Lichens parlent — mais très lentement. Une phrase complète prend, selon ses estimations, environ huit décennies. Comme il n'a pas le temps d'attendre, il a pris le parti d'écrire à leur place. Ses notes, qu'il refuse de publier, comptent à ce jour quatre-vingt-douze petits carnets. Il en commencera un quatre-vingt-treizième s'il vit assez longtemps, ce qu'il considère probable, parce que les Lichens, eux, sont d'accord.",
  },
];

export function getTotem(id: string): Totem | undefined {
  return totems.find((t) => t.id === id);
}
