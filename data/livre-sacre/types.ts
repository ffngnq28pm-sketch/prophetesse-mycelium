export interface Note {
  id: number;
  texte: string;
}

export interface Chapitre {
  id: string;
  titre: string;
  ouverture?: string;
  texte: string; // peut contenir des marqueurs [^1], [^2], etc.
  notes?: Note[];
}

export interface Livre {
  id: string;
  numero: number;
  titre: string;
  sousTitre: string;
  introduction: string;
  chapitres: Chapitre[];
}
