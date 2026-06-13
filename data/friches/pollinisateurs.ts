import type { Faculte } from "./index";

// Faculté 2 — Les Pollinisateurs. Même ton sobre et sincère que la faculté 1 :
// écologie réelle, nuances dites (ex. le « 75 % des cultures », la ruche qui ne
// « sauve » pas les abeilles sauvages).
export const pollinisateurs: Faculte = {
  id: "pollinisateurs",
  titre: "Les Pollinisateurs",
  resume:
    "Sans elles et eux, pas de fruits, pas de graines, et des prairies muettes. Mais aider les pollinisateurs demande de savoir qui ils sont vraiment — au-delà de l'abeille qu'on croit connaître.",
  lecons: [
    {
      id: "2-1",
      titre: "Qui pollinise, vraiment ?",
      epigraphe: "On croit connaître l'abeille. On ignore ses mille cousines.",
      corps: [
        "Polliniser, c'est transporter le pollen d'une fleur (organe mâle) jusqu'au pistil d'une autre (organe femelle) : sans ce transport, pas de fécondation, donc pas de graine ni de fruit. Certaines plantes confient ce travail au vent — c'est le cas des graminées et de beaucoup d'arbres. Mais une immense partie des plantes à fleurs dépend d'animaux pour le faire, en les attirant avec du nectar et des couleurs.",
        "Et c'est là qu'il faut corriger une idée reçue. Quand on dit « les abeilles », on pense à l'abeille domestique, celle des ruches. Or elle n'est qu'une seule espèce parmi des milliers de pollinisateurs. À côté d'elle travaillent des centaines d'espèces d'abeilles sauvages (souvent solitaires, sans ruche), des bourdons, des syrphes (ces mouches déguisées en guêpes), des papillons, des coléoptères, et sous d'autres climats des oiseaux ou des chauves-souris. Beaucoup de ces sauvages sont des pollinisateurs plus efficaces que l'abeille domestique sur certaines fleurs.",
        "À retenir : la pollinisation animale repose sur une foule d'espèces diverses ; l'abeille des ruches n'en est qu'une, et pas toujours la plus importante.",
      ],
      quiz: [
        {
          q: "Polliniser, c'est :",
          options: [
            "arroser les fleurs",
            "transporter le pollen d'une fleur à l'autre",
            "tailler les plantes",
          ],
          correct: 1,
          explication:
            "Ce transport permet la fécondation, donc la formation des graines et des fruits.",
        },
        {
          q: "« Les abeilles », ce sont :",
          options: [
            "une seule espèce, l'abeille des ruches",
            "des milliers d'espèces, dont beaucoup d'abeilles sauvages solitaires",
            "uniquement les bourdons",
          ],
          correct: 1,
          explication:
            "L'abeille domestique n'est qu'une espèce ; l'essentiel du peuple pollinisateur est sauvage et très divers.",
        },
        {
          q: "Parmi ces animaux, lequel est aussi un pollinisateur courant ?",
          options: ["le syrphe (une mouche)", "la fourmi charpentière", "le ver de terre"],
          correct: 0,
          explication:
            "Les syrphes, papillons, coléoptères et bien d'autres pollinisent, pas seulement les abeilles.",
        },
      ],
    },
    {
      id: "2-2",
      titre: "Pourquoi ça compte (sans exagérer)",
      epigraphe: "Ce n'est pas la fin du monde qui est en jeu. C'est sa richesse.",
      corps: [
        "La grande majorité des plantes à fleurs sauvages ont besoin des pollinisateurs pour se reproduire : sans eux, des prairies entières finiraient par se taire. Côté nourriture, on cite souvent qu'environ trois quarts des types de cultures dans le monde profitent, à des degrés divers, d'une pollinisation animale — fruits, légumes, oléagineux, fruits à coque, café, cacao.",
        "Mais soyons exacts, car c'est ici qu'on entend beaucoup d'exagérations. Les denrées qui nous nourrissent en volume — blé, riz, maïs — sont surtout pollinisées par le vent ou se fécondent seules. Donc non, la disparition des pollinisateurs ne signifierait pas une famine immédiate de l'humanité. En revanche, elle nous priverait de l'essentiel de la diversité de notre assiette (et des vitamines qui vont avec), ferait s'effondrer des pans entiers d'écosystèmes sauvages, et fragiliserait toute la chaîne du vivant qui en dépend. C'est considérable — sans avoir besoin d'être apocalyptique pour l'être.",
        "Le déclin des pollinisateurs, lui, est bien réel et documenté : usage des pesticides, perte et fragmentation des habitats, monocultures sans fleurs, maladies. Plusieurs causes qui se combinent.",
        "À retenir : les pollinisateurs sont vitaux pour la biodiversité et la diversité alimentaire — inutile de prétendre qu'on mourrait tous sans eux pour mesurer ce qu'on perdrait.",
      ],
      quiz: [
        {
          q: "Sans pollinisateurs, l'humanité mourrait-elle aussitôt de faim ?",
          options: [
            "oui, plus rien ne pousserait",
            "non, car blé/riz/maïs ne dépendent pas d'eux — mais on perdrait énormément en diversité",
            "non, car les pollinisateurs ne servent à rien",
          ],
          correct: 1,
          explication:
            "Les céréales de base sont surtout pollinisées par le vent ou autogames ; le vrai enjeu est la diversité alimentaire et les écosystèmes.",
        },
        {
          q: "Le chiffre « environ 75 % des cultures » désigne :",
          options: [
            "la part de notre alimentation en poids",
            "la part des types de cultures qui profitent d'une pollinisation animale, à des degrés divers",
            "la part des abeilles domestiques",
          ],
          correct: 1,
          explication:
            "« Profitent à des degrés divers » ≠ « en dépendent totalement » ≠ « 75 % de notre nourriture en volume ».",
        },
        {
          q: "Le déclin des pollinisateurs est :",
          options: [
            "un mythe sans preuve",
            "réel et documenté, avec plusieurs causes combinées",
            "dû à une seule cause unique",
          ],
          correct: 1,
          explication: "Pesticides, perte d'habitat, monocultures et maladies se cumulent.",
        },
      ],
    },
    {
      id: "2-3",
      titre: "Les gestes qui aident (et ceux qui trompent)",
      epigraphe: "Aider, c'est d'abord ne pas nuire.",
      corps: [
        "Le plus utile est étonnamment simple : des fleurs, partout, longtemps. Privilégie des espèces locales et mellifères, avec des floraisons qui se relaient du début du printemps à l'automne, pour qu'il y ait toujours à manger. Méfie-toi des variétés horticoles très doubles et stériles, jolies mais vides de nectar.",
        "Ensuite, laisse vivre : ne tonds pas tout, garde des zones fleuries, un coin en friche — c'est exactement l'esprit de l'Ordre, « laisser un coin de jardin en friche ». Bannis les pesticides et insecticides, qui touchent les auxiliaires autant que les nuisibles. Offre enfin le gîte : beaucoup d'abeilles sauvages nichent dans le sol nu, le bois mort ou les tiges creuses — autant de micro-habitats à préserver. Les « hôtels à insectes » peuvent aider, à condition d'être bien conçus et entretenus, sinon ils deviennent des nids à parasites.",
        "Et un contresens fréquent, qu'il faut dire clairement : installer une ruche d'abeilles domestiques n'est pas « sauver les abeilles ». Cette espèce-là n'est pas en voie de disparition, et une ruche vient au contraire concurrencer les pollinisateurs sauvages pour le nectar du voisinage. Le vrai geste pour le vivant, ce n'est pas une ruche : ce sont des fleurs, des habitats, et zéro poison.",
        "À retenir : fleurs locales étalées dans l'année + habitats préservés + aucun pesticide. Une ruche domestique ne sauve pas les pollinisateurs sauvages — elle peut même leur nuire.",
      ],
      quiz: [
        {
          q: "Le geste le plus utile pour les pollinisateurs :",
          options: [
            "des fleurs locales et mellifères, en floraison étalée sur l'année",
            "tondre la pelouse très court",
            "traiter le jardin aux insecticides",
          ],
          correct: 0,
          explication:
            "Nourriture disponible longtemps = base de tout ; tondre ras et traiter détruit au contraire les ressources.",
        },
        {
          q: "Installer une ruche d'abeilles domestiques, pour « sauver les abeilles » :",
          options: [
            "est le meilleur geste possible",
            "est un contresens : elle concurrence les pollinisateurs sauvages",
            "n'a aucun effet",
          ],
          correct: 1,
          explication:
            "L'abeille domestique n'est pas menacée ; une ruche pompe le nectar local au détriment des espèces sauvages.",
        },
        {
          q: "Un « hôtel à insectes » :",
          options: [
            "aide toujours, quel que soit son état",
            "aide s'il est bien conçu et entretenu, sinon devient un nid à parasites",
            "est inutile dans tous les cas",
          ],
          correct: 1,
          explication:
            "Mal fait ou jamais nettoyé, il concentre maladies et parasites — le bois mort et les tiges creuses naturels sont souvent plus sûrs.",
        },
      ],
    },
  ],
};
