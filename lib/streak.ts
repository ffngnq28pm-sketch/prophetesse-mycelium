// Calcul du streak de rituels : jours consécutifs avec au moins un office accompli.
// Tout est dérivé de rituelsParJour — rien de nouveau n'est stocké.

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export interface StreakInfo {
  actuel: number; // jours consécutifs jusqu'à aujourd'hui (ou hier si aujourd'hui pas encore fait)
  record: number; // plus longue série jamais atteinte
  aujourdhuiFait: boolean;
}

export function computeStreak(rituelsParJour: Record<string, Record<string, boolean>>): StreakInfo {
  const jourFait = (key: string) => Object.values(rituelsParJour[key] ?? {}).some(Boolean);

  // Record : plus longue série consécutive parmi toutes les dates accomplies.
  const faits = Object.keys(rituelsParJour).filter(jourFait).sort();
  let record = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of faits) {
    const d = new Date(k + "T00:00:00");
    if (prev && Math.round((d.getTime() - prev.getTime()) / 86400000) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > record) record = run;
    prev = d;
  }

  // Streak actuel : on remonte depuis aujourd'hui (ou hier si rien fait aujourd'hui).
  const today = new Date();
  const aujourdhuiFait = jourFait(dayKey(today));
  let actuel = 0;
  const cursor = new Date(today);
  if (!aujourdhuiFait) cursor.setDate(cursor.getDate() - 1);
  while (jourFait(dayKey(cursor))) {
    actuel += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { actuel, record: Math.max(record, actuel), aujourdhuiFait };
}

// Jalon liturgique atteint pour une série donnée.
export function streakJalon(n: number): string | null {
  if (n >= 100) return "Mycélium Centenaire";
  if (n >= 30) return "Racine Profonde";
  if (n >= 14) return "Quinzaine Sacrée";
  if (n >= 7) return "Semaine Enracinée";
  if (n >= 3) return "Jeune Pousse";
  return null;
}
