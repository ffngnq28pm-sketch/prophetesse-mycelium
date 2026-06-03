// Le canon du jeu « Le Verbe du Jour ».
// Chaque `mot` fait EXACTEMENT 6 lettres A–Z, en MAJUSCULES, SANS accent.
// Chaque `revelation` est un court verset (ton Pratchett : sérieux dans la forme,
// tendre et joyeux dans le fond — on célèbre, on ne sermonne jamais).
// Plus le lexique est riche, plus le cycle avant répétition est long.

export interface EntreeVerbe {
  mot: string;
  revelation: string;
}

export const LEXIQUE: EntreeVerbe[] = [
  { mot: "NECTAR", revelation: "Première offrande de la création : un sucre donné sans reçu, que nul percepteur n'a jamais su imposer." },
  { mot: "POLLEN", revelation: "Courrier doré que le vent distribue sans connaître l'adresse — et qui arrive quand même." },
  { mot: "LICHEN", revelation: "Deux êtres ayant décidé de n'en faire qu'un, faute d'avoir trouvé mieux à faire de l'éternité." },
  { mot: "RACINE", revelation: "Elle médite la tête en bas depuis si longtemps qu'elle a fini par tenir le monde debout." },
  { mot: "GRAINE", revelation: "Un mausolée minuscule qui contient, plié serré, tout un printemps." },
  { mot: "ESSAIM", revelation: "Gouvernance sans chef, fondée sur une rumeur partagée. L'Ordre la recommande chaudement, sans grand succès." },
  { mot: "RUCHER", revelation: "Le seul édifice où l'on cotise en or et où personne ne réclame jamais le solde." },
  { mot: "MOUSSE", revelation: "Elle a compris avant nous tous que l'urgence est une invention très récente." },
  { mot: "SILLON", revelation: "Cicatrice consentie de la terre, par où entrera, l'an prochain, toute la lumière." },
  { mot: "ARGILE", revelation: "Patiente, elle attend des mains. Toute la théologie de la patience tient dans ce mot." },
  { mot: "ERABLE", revelation: "Il signe ses chèques en sirop — monnaie que l'Ordre tient pour plus sûre que l'or." },
  { mot: "ECORCE", revelation: "Armure qui respire. Preuve qu'on peut se protéger sans cesser d'échanger." },
  { mot: "RAMEAU", revelation: "Petite promesse de bois tendue vers le ciel, sans garantie, mais avec conviction." },
  { mot: "PETALE", revelation: "Publicité honnête : il annonce exactement ce qu'il offre, et ne survit pas à son mensonge." },
  { mot: "ORTIES", revelation: "Mal-aimées, donc saintes. Qui les touche apprend le respect plus vite que par tout sermon." },
  { mot: "TREFLE", revelation: "Trois feuilles pour la règle, une quatrième pour l'exception. L'Ordre vénère surtout l'exception." },
  { mot: "ROSEAU", revelation: "Il plie, donc il prie. Théologien souple, jamais rompu." },
  { mot: "MYCETE", revelation: "Il ne meurt pas, il déménage. La seule créature à avoir résolu la question du logement." },
  { mot: "SPORES", revelation: "Voyagent sans bagage ni billet. Saintes patronnes des optimistes et des courants d'air." },
  { mot: "AUBIER", revelation: "Le bois encore vivant sous le bois ancien : preuve que le passé porte le présent sans s'en plaindre." },
  { mot: "SUREAU", revelation: "L'arbre que les anciens consultaient avant de bâtir. Il ne répondait jamais, ce qui passait pour de la sagesse." },
  { mot: "LIERRE", revelation: "Il ne grimpe pas pour dominer, mais parce que la lumière est là-haut. Distinction subtile, à laquelle l'Ordre tient beaucoup." },
  { mot: "GENETS", revelation: "Or des terrains pauvres. Il fleurit là où rien d'autre n'a daigné s'installer, et n'en fait pas une affaire." },
  { mot: "VERGER", revelation: "Cathédrale dont les colonnes donnent des pommes. La seule où l'on encourage à goûter le mobilier." },
  { mot: "BOUTON", revelation: "Une promesse encore fermée. L'Ordre enseigne qu'on ne force jamais un bouton : il s'ouvre quand on a cessé de le regarder." },
  { mot: "CALICE", revelation: "Coupe que la fleur tend au ciel sans rien demander. Le pollinisateur, lui, y voit surtout une auberge." },
  { mot: "SEPALE", revelation: "Garde du corps discret du pétale. Il reste quand la beauté s'en va, et personne ne pense à le remercier." },
  { mot: "GUEPES", revelation: "Mal-aimées, donc proches de la sainteté. Elles pollinisent aussi, mais préfèrent qu'on l'ignore." },
  { mot: "FRELON", revelation: "Grand, bruyant, terrifiant et globalement inoffensif. L'Ordre lui trouve un air de famille avec ses propres sermons." },
  { mot: "COCONS", revelation: "Chambre close où l'on entre en rampant et d'où l'on ressort en volant. Le plus ancien tour de passe-passe du monde." },
  { mot: "RENARD", revelation: "Théologien du crépuscule. Il a compris que les meilleures vérités se cueillent à l'heure où l'on n'y voit plus très clair." },
  { mot: "MULOTS", revelation: "Architectes souterrains que nul cadastre ne recense. Ils labourent gratuitement et ne réclament jamais leur dû." },
  { mot: "PINSON", revelation: "Il chante avant de savoir s'il fera beau. L'Ordre tient ce détail pour le fondement de toute foi." },
  { mot: "LIMACE", revelation: "Lente, luisante, mal-aimée. Elle recycle la nuit ce que le jour a laissé tomber, sans jamais réclamer d'éloge." },
  { mot: "BRUMES", revelation: "Encens que la terre fabrique elle-même au petit matin, pour des matines auxquelles personne n'assiste." },
  { mot: "PAVOTS", revelation: "Ils s'ouvrent un matin, fanent le soir, et trouvent que c'est amplement suffisant pour une vie réussie." },
  { mot: "BLEUET", revelation: "Bleu obstiné des moissons. Il pousse entre les épis comme une pensée qui refuse de servir à quelque chose." },
  { mot: "SAPINS", revelation: "Ils gardent leur vert tout l'hiver, par entêtement plus que par vertu. L'Ordre respecte l'entêtement." },
  { mot: "CHARME", revelation: "Arbre dont le nom dit tout, et qui pourtant n'en fait jamais étalage. Modèle de discrétion végétale." },
  { mot: "SAULES", revelation: "Ils pleurent, dit-on. En réalité ils se penchent simplement pour mieux écouter la rivière." },
  { mot: "RESINE", revelation: "Larme d'arbre qui devient ambre, puis éternité. Preuve qu'une blessure bien gérée finit en bijou." },
  { mot: "MURIER", revelation: "Il tache les doigts de ceux qui se servent : c'est sa façon discrète de tenir les comptes." },
  { mot: "GOUSSE", revelation: "Coffre-fort végétal. À l'intérieur : des graines, et la patience de ne s'ouvrir qu'au bon moment." },
  { mot: "ETANGS", revelation: "Miroirs posés à plat où le ciel vient se relire. Les grenouilles en assurent la lecture à voix haute." },
  { mot: "MARAIS", revelation: "Terre qui n'a pas choisi entre l'eau et le sol, et que l'Ordre cite en exemple à tous les indécis." },
  { mot: "FRICHE", revelation: "Terrain qu'on a oublié de domestiquer, et qui en a profité pour devenir le plus vivant de tous." },
  { mot: "VIGNES", revelation: "Elles transforment la patience en grappe, et la grappe en oubli. L'Ordre approuve les deux étapes." },
  { mot: "ORMEAU", revelation: "Jeune orme qui ignore encore qu'il sera grand. C'est précisément ce qui le rend fréquentable." },
  { mot: "FRENES", revelation: "Bois dont on faisait les lances et les manches d'outils. Il a surtout survécu aux outils." },
  { mot: "ROSIER", revelation: "Il garde ses épines même en fleur, pour rappeler qu'on peut être beau sans cesser d'avoir des limites." },
];
