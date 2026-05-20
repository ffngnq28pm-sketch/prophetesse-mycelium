import type { Livre } from "./types";
import { calendrier } from "../calendrier";

const NOTES_PAR_FETE: Record<string, { id: number; texte: string }[]> = {
  "chandeleur-mycelienne": [
    { id: 1, texte: "Le 2 février est, par une coïncidence amusante, la même date que la Chandeleur catholique. Il a fallu choisir entre se disputer le calendrier ou cohabiter. L'Ordre a choisi la cohabitation. Si vous faites des crêpes ce jour-là, ne les mangez pas toutes : laissez-en une au coin du compost. C'est une offrande pratique." },
    { id: 2, texte: "Les premiers Perce-neige percent effectivement vers cette date dans le Bassin parisien. Ils ne se concertent pas. Ils ont juste un thermomètre interne mieux calibré que la plupart des stations Météo France." },
  ],
  "equinoxe-pollinisateur": [
    { id: 1, texte: "Le Bourdon terrestre reine sort d'hivernage entre le 10 et le 25 mars selon les années. C'est la première grande pollinisatrice de l'année. Si vous croisez un gros bourdon noir et jaune en mars, soyez-lui poli : elle a 50 ouvrières à mettre au monde dans les semaines qui viennent." },
  ],
  "premier-pouillot": [
    { id: 1, texte: "Le « tchif-tchaf » du Pouillot véloce est un chant si simple qu'on l'entend sans s'en apercevoir. La plupart des Parisiens ont déjà entendu un Pouillot véloce sans savoir qu'ils avaient entendu un Pouillot véloce. C'est un échec collectif d'apprentissage." },
  ],
  "grande-floraison": [
    { id: 1, texte: "Le protocole Vigie-Flore, animé par le Muséum national d'Histoire naturelle, demande aux participants de relever les espèces présentes sur 8 quadrats de 1 m² entre le 15 mai et le 15 juin. C'est devenu, pour beaucoup de disciples de l'Ordre, un sacrement biannuel. On le pratique deux dimanches : l'un fin mai, l'autre mi-juin." },
    { id: 2, texte: "Tondre pendant la Grande Floraison est, dans la jurisprudence informelle de l'Ordre, l'équivalent de chanter à un enterrement. Techniquement légal, métaphysiquement obscène." },
  ],
  "solstice-ete": [
    { id: 1, texte: "Les Hannetons chantent à 6h53 précises uniquement dans les bonnes années — c'est-à-dire celles où il n'a pas fait trop sec en avril. Pour les autres années, l'horaire varie. Frère Théodule conseille d'arriver à 6h30 et d'attendre, ce qui, statistiquement, vaut mieux que de regretter à 7h00." },
  ],
  "jeune-aluminium": [
    { id: 1, texte: "Le Jeûne d'aluminium est observé chaque année par environ 12 000 disciples de l'Ordre (estimation interne, non vérifiée). Pendant cette semaine, les ventes de café filtre augmentent de 0,3 % dans certains supermarchés franciliens. Personne n'a fait le lien officiellement, mais le lien existe." },
  ],
  "nuit-chiropteres": [
    { id: 1, texte: "La Nuit Internationale des Chauves-Souris est un événement réel, organisé chaque dernier samedi d'août depuis 1997 par l'organisation européenne EUROBATS. L'Ordre Mycélien la reconnaît comme fête majeure. Cela ne change rien à l'organisation mondiale, mais ça fait plaisir aux Chiroptères." },
    { id: 2, texte: "Le silence pendant l'observation n'est pas une recommandation : c'est une obligation. Les Chiroptères en chasse s'orientent par écholocation, c'est-à-dire en émettant des ultrasons et en écoutant les échos. Toute conversation humaine bruyante interfère avec leur travail. Une heure de silence est, par ailleurs, une bénédiction pour celui qui la pratique." },
  ],
  "equinoxe-automne": [
    { id: 1, texte: "L'aération du compost est, dans la routine du jardinier mycélien, l'équivalent du contrôle technique de la voiture : on n'y pense pas, mais quand on ne le fait pas, le compost s'asphyxie et sent mauvais. L'opération prend 5 minutes avec une fourche à compost. Elle évite 365 jours de regrets." },
  ],
  "pelerinage-cimetieres": [
    { id: 1, texte: "Le Pèlerinage des Cimetières est la fête centrale de l'Ordre. Elle a remplacé, pour les disciples, la commémoration des morts par la commémoration des vivants qui poussent sur les morts. C'est, théologiquement, un déplacement considérable. C'est, pratiquement, la même chose qu'apporter un pot de plante au lieu d'un pot de chrysanthèmes." },
    { id: 2, texte: "Le Romarin, planté sur une tombe, ne demande presque rien : du soleil, un sol drainant, et qu'on l'oublie. C'est, sur la liste des plantes funéraires, la candidate idéale : elle survit aux gardiens distraits, elle parfume au passage, et elle nourrit les abeilles. Si la grand-mère de la parabole avait pu lui parler, elle l'aurait remerciée." },
  ],
  "saint-mycelium": [
    { id: 1, texte: "Le 11 novembre est, dans le calendrier civil français, le jour de l'Armistice. L'Ordre n'a pas voulu lui voler la vedette. La Saint-Mycélium se célèbre donc dans la discrétion, en milieu d'après-midi, après les cérémonies officielles. C'est plus discret, plus mycélien, plus exact." },
  ],
  "solstice-hiver": [
    { id: 1, texte: "Le Lichen photosynthétise dès que la température dépasse −5 °C et qu'un rayon de lumière l'atteint. Au solstice d'hiver, il est probablement le seul organisme végétal actif visible dans Paris. C'est, en théologie de l'Ordre, le « Veilleur d'Hiver »." },
  ],
  "veillee-graines": [
    { id: 1, texte: "L'échange de graines entre voisins est, dans la grande tradition paysanne, l'un des derniers commerces sans monnaie. On donne, on reçoit, on plante. La récolte est l'éventuelle monnaie de retour. Mais souvent on oublie de la rendre, et personne ne s'en plaint, parce que la générosité a déjà eu lieu." },
  ],
};

const MOIS = ["", "premier", "deuxième", "troisième", "quatrième", "cinquième", "sixième", "septième", "huitième", "neuvième", "dixième", "onzième", "douzième"];

export const livreVI: Livre = {
  id: "calendrier",
  numero: 6,
  titre: "Livre VI — Le Calendrier Liturgique",
  sousTitre: "Des douze fêtes principales de l'Ordre Mycélien, et de l'art de ne pas en oublier la moitié",
  introduction:
    "Voici les douze fêtes principales du calendrier de l'Ordre Mycélien, dans l'ordre de leur survenue dans l'année. Chacune a son rituel propre, sa raison écologique, son verset de référence. Le disciple est invité à les inscrire dans son agenda personnel et à les célébrer en pleine conscience. Quant aux fêtes oubliées, elles ne nous en tiennent pas rigueur : elles reviennent l'année d'après, sans rancune.",
  chapitres: calendrier.map((f, i) => ({
    id: f.id,
    titre: `Chapitre ${i + 1} — ${f.nom}`,
    ouverture: `« Au ${f.jour}${f.jour === 1 ? "er" : ""} jour du ${MOIS[f.mois]} mois. »`,
    texte: `${f.description}

Rituel[^1] : ${f.rituel}

Cette fête est de niveau ${f.type === "majeure" ? "majeur" : f.type === "pelerinage" ? "pèlerinage" : f.type === "jeune" ? "jeûne" : "mineur"} dans le calendrier de l'Ordre. Le disciple consciencieux la note dans son agenda dès la première année, et il y revient chaque cycle.

La Prophétesse disait : « Le calendrier liturgique n'est pas un emploi du temps. C'est une partition. Tu n'as pas à tout jouer parfaitement. Tu as à reconnaître la mélodie. »`,
    notes: NOTES_PAR_FETE[f.id] ?? [
      { id: 1, texte: "Cette fête n'a pas encore attiré de note de bas de page documentée. Cela arrive aux fêtes les plus discrètes. Elles s'observent en silence, sans glose. C'est, peut-être, la meilleure manière." },
    ],
  })),
};
