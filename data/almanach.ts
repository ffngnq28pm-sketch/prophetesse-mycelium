export type RareteFaune = "commune" | "frequente" | "rare";

export interface Faune {
  id: string;
  nom: string;
  nomLatin: string;
  embleme: string;
  groupe: "pollinisateur" | "auxiliaire";
  rarete: RareteFaune;
  silhouette: string;
  role: string;
  lore: string;
  couleur: string;
}

export const FAUNE: Faune[] = [
  {
    id: "halicte",
    nom: "Halicte",
    nomLatin: "Halictus sp.",
    embleme: "🐝",
    groupe: "pollinisateur",
    rarete: "commune",
    silhouette:
      "Petite abeille solitaire, fine, aux reflets dorés. Creuse son nid dans la terre nue, sans ruche et sans reine.",
    role: "Pollinisatrice sauvage. Une seule femelle visite des centaines de fleurs par jour — sans miel, sans colonie, sans reconnaissance.",
    lore: "L'insecte préféré de l'Ordre, et de Sœur Halicte en particulier. Recensée par dizaines dans les carrés non fauchés des cimetières. La confondre avec une mouche est, selon Sœur Compost, « une erreur pardonnable mais triste ».",
    couleur: "#e3b341",
  },
  {
    id: "bourdon",
    nom: "Bourdon terrestre",
    nomLatin: "Bombus terrestris",
    embleme: "🍯",
    groupe: "pollinisateur",
    rarete: "rare",
    silhouette:
      "Gros, rond, velu, rayé de noir et de jaune. Vole par temps froid et par bruine, quand les autres renoncent.",
    role: "Pollinisateur par vibration : il fait littéralement trembler la fleur pour en libérer le pollen. Indispensable à la tomate.",
    lore: "Rare dans la Chasse aux Pollinisateurs — le recenser vaut donc une fierté discrète. On ne convoque pas un bourdon : il s'invite. Et il ne signe jamais la feuille de présence.",
    couleur: "#f5d23b",
  },
  {
    id: "azure",
    nom: "Azuré commun",
    nomLatin: "Polyommatus icarus",
    embleme: "🦋",
    groupe: "pollinisateur",
    rarete: "frequente",
    silhouette:
      "Petit papillon bleu vif chez le mâle, brun discret chez la femelle. Se pose ailes mi-ouvertes au soleil.",
    role: "Pollinisateur léger. Sa chenille dépend des légumineuses sauvages : trèfle, luzerne, lotier.",
    lore: "Plante de la luzerne lupuline et du trèfle blanc, et l'Azuré viendra. C'est une transaction honnête — un gîte pour la chenille, une visite pour la fleur.",
    couleur: "#9ec3e7",
  },
  {
    id: "syrphe",
    nom: "Syrphe ceinturé",
    nomLatin: "Episyrphus balteatus",
    embleme: "🪰",
    groupe: "pollinisateur",
    rarete: "commune",
    silhouette:
      "Déguisé en guêpe — rayé jaune et noir — mais parfaitement inoffensif. Fait du surplace en vol, immobile dans l'air.",
    role: "Double agent du jardin : adulte, il pollinise ; larve, il dévore les pucerons par centaines.",
    lore: "La « mouche » que tu poursuis au filet n'en est pas tout à fait une. Frère Théodule soutient qu'elle imite la guêpe « par modestie, pour ne pas se vanter de sa gentillesse ». Personne ne l'a contredit.",
    couleur: "#c9b24a",
  },
  {
    id: "cimbicide",
    nom: "Cimbicide",
    nomLatin: "Cimbex sp.",
    embleme: "🐛",
    groupe: "pollinisateur",
    rarete: "rare",
    silhouette:
      "Insecte trapu, orangé, aux antennes en massue. Ni abeille ni mouche : un hyménoptère à scie, à part.",
    role: "Pollinisateur d'appoint. Sa larve, semblable à une chenille, recycle patiemment le feuillage tombé.",
    lore: "Le grand mal-aimé du recensement : on le confond avec tout. L'Ordre le défend par principe — « ce qui n'a pas de nom clair a d'autant plus besoin d'être compté ».",
    couleur: "#e88a3c",
  },
  {
    id: "ver-de-terre",
    nom: "Ver de terre",
    nomLatin: "Lumbricus terrestris",
    embleme: "🪱",
    groupe: "auxiliaire",
    rarete: "commune",
    silhouette: "Anneau de chair rose, sans yeux, sans hâte. Travaille sous la surface, à l'abri de tout mérite.",
    role: "Laboure, aère, draine, fertilise. Un hectare peut en abriter une tonne — la plus grande charrue du monde est invisible.",
    lore: "Vénéré entre tous. Frère Théodule affirme qu'ils votent lors d'élections souterraines biannuelles ; on ne le contredit pas. Trahir le Ver de Terre — composter des dosettes, par exemple — reste, au Tetris du Compost, une faute lourde.",
    couleur: "#b9805a",
  },
  {
    id: "herisson",
    nom: "Hérisson d'Europe",
    nomLatin: "Erinaceus europaeus",
    embleme: "🦔",
    groupe: "auxiliaire",
    rarete: "frequente",
    silhouette: "Boule de cinq mille piquants, museau humide, démarche d'horloge. Sort à la nuit tombée.",
    role: "Régule limaces et insectes. A besoin de circuler : une haie continue, un trou de treize centimètres sous la clôture.",
    lore: "Frère Hérisson, boulanger, perça un passage sous chaque haie de son quartier. L'Évangile qui porte ce nom enseigne la lenteur : « Bienheureux les lents, car ils héritent du compost. »",
    couleur: "#8a6b4a",
  },
  {
    id: "chiroptere",
    nom: "Pipistrelle commune",
    nomLatin: "Pipistrellus pipistrellus",
    embleme: "🦇",
    groupe: "auxiliaire",
    rarete: "frequente",
    silhouette: "Plus petite que le pouce, repliée dans le noir le jour. Chasse au sonar dès le crépuscule.",
    role: "Avale jusqu'à trois mille moustiques par nuit. Régulateur nocturne, gratuit et silencieux.",
    lore: "La Discrétion du Chiroptère est l'une des Sept Vertus. Son ennemi est l'Éclairage Nocturne Continu, l'une des Sept Hérésies. Éteins ton jardin la nuit, et il dansera pour toi.",
    couleur: "#5a6478",
  },
  {
    id: "coccinelle",
    nom: "Coccinelle à sept points",
    nomLatin: "Coccinella septempunctata",
    embleme: "🐞",
    groupe: "auxiliaire",
    rarete: "commune",
    silhouette: "Dôme rouge laqué, sept points noirs. L'enfance entière sait la reconnaître.",
    role: "Prédatrice de pucerons, adulte comme larve. Une seule en consomme plusieurs milliers au cours de sa vie.",
    lore: "Sept points : l'Ordre y voit, sans preuve mais avec conviction, un écho aux Sept Vertus. L'achillée et la bourrache l'attirent. Ne jamais traiter chimiquement un jardin qu'elle habite.",
    couleur: "#c0392b",
  },
];
