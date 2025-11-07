// Répartit les calories en macronutriments selon un ratio par défaut
// Par défaut: Protéines 30%, Glucides 50%, Lipides 20%

export function calculateMacros(totalCalories, ratio = { protein: 0.3, carbs: 0.5, fat: 0.2 }) {
  // 0️⃣ Validation
  const cals = Number(totalCalories);
  if (!Number.isFinite(cals) || cals <= 0) {
    throw new Error("totalCalories invalide pour calculateMacros");
  }

  // 1️⃣ Appliquer les pourcentages
  const proteinCalories = cals * (ratio.protein ?? 0.3);
  const carbsCalories = cals * (ratio.carbs ?? 0.5);
  const fatCalories = cals * (ratio.fat ?? 0.2);

  // 2️⃣ Convertir en grammes (prot 4 kcal/g, glucides 4 kcal/g, lipides 9 kcal/g)
  const protein = Math.round(proteinCalories / 4);
  const carbs = Math.round(carbsCalories / 4);
  const fat = Math.round(fatCalories / 9);

  // 3️⃣ Retourner l’objet { protein, carbs, fat }
  return { protein, carbs, fat };
}