import type { Livre } from "./types";
import { paraboles } from "../paraboles";

// Notes ajoutées par parabole (par id). Chaque parabole en a au moins une.
const NOTES_PAR_PARABOLE: Record<number, { id: number; texte: string }[]> = {
  1: [
    { id: 1, texte: "Le Pissenlit, dont le nom savant Taraxacum officinale dit déjà beaucoup, est l'une des plantes les plus utiles connues de l'humanité, et accessoirement l'une des plus systématiquement détestées. C'est une contradiction qui devrait nous donner à réfléchir sur notre rapport à l'utilité — mais on tond avant d'avoir réfléchi." },
    { id: 2, texte: "Il existe, dans certaines campagnes du Berry, une expression : « Tirer la barbe du Pissenlit. » Cela signifie souffler sur les akènes mûrs pour les disperser. Les enfants le font instinctivement. Les adultes ont tendance à juger ce geste enfantin. C'est dommage : c'est l'un des rares gestes spirituels gratuits qui restent à la portée de tous." },
  ],
  2: [
    { id: 1, texte: "Le robot tondeur est, dans la grande typologie des inventions humaines, l'équivalent moderne du tonneau à mer de l'Antiquité : une chose qu'on a inventée parce qu'on pouvait, sans s'être demandé si on devait. Il y a, sur ce point, une grande quantité de littérature philosophique qui n'a jamais été lue par les ingénieurs en question." },
  ],
  3: [
    { id: 1, texte: "Le marc de café est, après le compost lui-même, le meilleur amendement gratuit du jardinier urbain. Il acidifie légèrement le sol, ce qui plaît aux hortensias, aux fraisiers, aux rhododendrons. Toute cafetière à filtre est donc, vue d'un certain angle, un atelier de production de fertilisant déguisé. Vu d'un autre angle, c'est une simple cafetière. Mais voilà, les bons angles sont rares." },
    { id: 2, texte: "L'amertume du café fait, paraît-il, partie de son caractère. Les baristas savent qu'un bon café n'est pas un café sucré : c'est un café équilibré. Le cadet de la parabole l'a compris, peut-être sans le savoir. Ce sont souvent les gens qui boivent leur café amer qui se révèlent, à l'examen, les plus capables d'accueillir le réel sans le déguiser." },
  ],
  4: [
    { id: 1, texte: "La Chauve-souris du récit était probablement une Pipistrelle commune, l'espèce la plus susceptible de s'installer derrière un volet en milieu urbain. Elle ne pèse que 5 grammes. C'est moins lourd qu'un timbre-poste, et plus utile que la plupart des décisions municipales." },
  ],
  5: [
    { id: 1, texte: "L'Orchis bouc, l'Orchis morio, l'Ophrys abeille — il y a en France une bonne quarantaine d'orchidées sauvages, dont la plupart sont protégées par la loi. Cela ne les protège pas systématiquement contre les engins d'entretien des bords de route, qui sont, eux, protégés par le règlement intérieur et le bon sens administratif (deux protections qui se contredisent rarement, malheureusement)." },
  ],
  6: [
    { id: 1, texte: "Il y a en France environ 1 000 espèces d'abeilles sauvages — pas 700, comme indiqué dans la parabole, parce que la science avance. Mais 700 ou 1 000, le point demeure : l'« abeille » dont parle l'enfant n'existe pas. Ce qu'on appelle « l'abeille » est, en réalité, une famille immense, qu'on a réduite à son représentant le plus commercial." },
    { id: 2, texte: "Le maire de la parabole n'est pas méchant. Il est ignorant. Et l'ignorance d'un maire est, à l'échelle d'une commune, une force géophysique. Elle peut tracer des autoroutes, abattre des arbres centenaires, traiter au glyphosate des trottoirs entiers — et tout cela en bonne foi, avec des dossiers à l'appui. C'est, sur la liste des choses tristes, un classement très élevé." },
  ],
  7: [
    { id: 1, texte: "Le jet d'eau du trottoir est, dans la grande topographie des comportements urbains, l'équivalent du Coton-Tige : il a l'air anodin, il fait pourtant des dégâts qu'on n'imagine pas. Toute personne possédant un Karcher devrait, par décence, suivre une formation préalable. On ne donne pas une telle machine à quelqu'un qui n'a pas appris à respecter la mousse de pierre." },
  ],
  8: [
    { id: 1, texte: "La Mouche du récit était probablement une Mouche bleue, Calliphora vomitoria, dont le nom latin ne fait pas dans la dentelle. Elle pollinise pourtant certaines fleurs précoces, et elle nettoie ce que personne d'autre n'a envie de nettoyer. C'est l'équivalent volant du commissaire-priseur : on l'aime peu, on l'estime mal, on a quand même besoin d'elle pour boucler la succession." },
    { id: 2, texte: "Le parfum du Tilleul en fleurs, en juin, est l'une des choses qui rendent supportables les villes françaises. Il dure environ trois semaines. Pendant ces trois semaines, marcher en ville devient une activité contemplative. Après, on retourne au gris. C'est une des rares justices saisonnières qui nous restent." },
  ],
  9: [
    { id: 1, texte: "Le chrysanthème en pot noir est, statistiquement, le bouquet le moins romantique jamais offert. Il est offert par défaut, sans choix, sans imagination. Et pourtant, c'est lui qui couvre la moitié des tombes de France à la Toussaint. Quelque chose ne va pas dans cette équation, mais on n'a pas le temps d'y réfléchir : on doit aller acheter d'autres chrysanthèmes en pot noir." },
  ],
  10: [
    { id: 1, texte: "Les LED blanches 5000K émettent un spectre lumineux particulièrement riche en bleu, qui est précisément la fréquence à laquelle les insectes sont les plus sensibles. C'est, du point de vue de l'évolution, un piège-éclair conçu sur mesure. On ne pouvait, techniquement, pas faire pire pour les insectes nocturnes. Et c'est exactement ce qu'on a fait, en bonne foi, en pensant moderniser." },
  ],
  11: [
    { id: 1, texte: "Une friche urbaine de 3 000 m², en banlieue parisienne, abrite en moyenne 80 à 120 espèces de plantes, 12 à 18 espèces d'oiseaux, 3 à 7 espèces de mammifères. Elle n'a pas demandé à exister. Personne ne l'a aménagée. Elle ne rapporte rien à personne. Et précisément à cause de cela, elle est plus riche que n'importe quel parc municipal soigné." },
    { id: 2, texte: "Le parking du récit, après la disparition de la friche, fut effectivement utilisé. Pendant deux ans. Puis le supermarché ferma. Le parking devint un parking abandonné. La friche, elle, mit 30 ans à se reconstituer ailleurs. C'est, du point de vue de l'efficience économique, un excellent rappel que la nature joue sur des échelles de temps qui nous échappent." },
  ],
  12: [
    { id: 1, texte: "La tomate de janvier sous serre chauffée émet environ 5 fois plus de CO2 par kilo que la tomate de septembre en pleine terre. Elle contient également moins de vitamines, moins d'antioxydants, moins de goût. C'est, sur le plan métaphysique, une tomate qui ne sait pas qu'elle est une tomate. On comprend qu'elle ait du mal à se faire reconnaître par le palais." },
  ],
  13: [
    { id: 1, texte: "Le grelot pour chat, vendu en animalerie pour environ 3 euros, est l'une des inventions les plus efficaces de la conservation pratique. Trois euros. Trois minutes pour l'installer. Et un sauvetage de 30 à 50 oiseaux par an. Le ratio coût-bénéfice est, sur le plan écologique, l'équivalent du dividende de la guerre civile au Vermont : exceptionnellement favorable." },
  ],
  14: [
    { id: 1, texte: "Le Roitelet huppé pèse environ 5 grammes. C'est le plus petit oiseau d'Europe. Son nid contient 7 à 10 œufs, qu'il faut maintenir à 36-37 °C en permanence. Toute interruption de couvaison de plus de 15 minutes est fatale aux embryons. Le drone, en passant à 4 mètres au-dessus, a déclenché précisément cette interruption. Personne ne sera puni pour ce crime. C'est l'une des grandes catégories juridiques manquantes du XXIᵉ siècle : le délit d'inadvertance massive." },
  ],
};

export const livreIV: Livre = {
  id: "paraboles",
  numero: 4,
  titre: "Livre IV — Les Paraboles Mycéliennes",
  sousTitre: "Quatorze histoires courtes pour ceux qui ont des oreilles, et quelques notes pour ceux qui ont du temps",
  introduction:
    "La Prophétesse n'enseignait pas par théorèmes ni par décrets. Elle racontait. Voici quatorze paraboles, transmises par ses disciples, recueillies dans les marges de carnets de jardiniers, dans les conversations de cantine d'école, dans les chuchotements de fin de réunion de copropriété. Chacune se médite. Chacune se rumine. Chacune se redécouvre en hiver, quand on a le temps de regarder par la fenêtre et que les oiseaux ne sont plus là pour distraire.",
  chapitres: paraboles.map((p, i) => ({
    id: `parabole-${p.id}`,
    titre: `Chapitre ${i + 1} — ${p.titre}`,
    ouverture: `« ${p.morale} »`,
    texte: p.texte + "\n\nMorale[^" + (NOTES_PAR_PARABOLE[p.id]?.[0]?.id ?? 1) + "] : " + p.morale,
    notes: NOTES_PAR_PARABOLE[p.id] ?? [
      { id: 1, texte: "Cette parabole n'a, étrangement, pas attiré de note de bas de page. Cela arrive. Toutes les paraboles ne suscitent pas immédiatement le commentaire ; certaines préfèrent rester sobres. L'Ordre respecte ce silence." },
    ],
  })),
};
