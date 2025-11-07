// Calcule les calories quotidiennes recommandées via Mifflin-St Jeor
// weight (kg), height (cm), age (années), gender ("homme"|"femme"|"male"|"female"), activityLevel

export function calculateCalories(weight, height, age, gender, activityLevel) {
  // 0️⃣ Validation minimale
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);
  if (![w, h, a].every((n) => Number.isFinite(n) && n > 0)) {
    throw new Error("Paramètres invalides pour calculateCalories");
  }

  const g = String(gender || "").toLowerCase();
  const isMale = ["male", "m", "homme", "h"].includes(g);
  const isFemale = ["female", "f", "femme"].includes(g);
  if (!isMale && !isFemale) {
    throw new Error("Genre invalide: utilisez 'homme'/'femme' ou 'male'/'female'");
  }

  // 1️⃣ Calcul du métabolisme de base (BMR) — Formule de Mifflin-St Jeor
  // Homme: BMR = 10*w + 6.25*h − 5*a + 5
  // Femme: BMR = 10*w + 6.25*h − 5*a − 161
  const bmr = isMale
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;

  // 2️⃣ Application du facteur d’activité
  const level = String(activityLevel || "sédentaire").toLowerCase();
  const activityMap = {
    // sédentaire / faible
    "sedentaire": 1.2,
    "sédentaire": 1.2,
    "faible": 1.2,
    // léger
    "leger": 1.375,
    "léger": 1.375,
    "light": 1.375,
    // modéré
    "modere": 1.55,
    "modéré": 1.55,
    "moderate": 1.55,
    // intense / actif
    "actif": 1.725,
    "active": 1.725,
    "intense": 1.725,
    // très actif
    "tres_actif": 1.9,
    "très_actif": 1.9,
    "very_active": 1.9,
    "sportif": 1.9,
  };
  const factor = activityMap[level] ?? 1.2;

  // 3️⃣ Retour du total
  return Math.round(bmr * factor);
}