// Calcule l’IMC et fournit une interprétation (maigre, normal, surpoids, obésité)
// weight (kg), height (m ou cm)

export function calculateBMI(weight, height) {
  // 0️⃣ Validation
  const w = Number(weight);
  let h = Number(height);
  if (![w, h].every((n) => Number.isFinite(n) && n > 0)) {
    throw new Error("Paramètres invalides pour calculateBMI");
  }

  // 1️⃣ BMI = poids (kg) / (taille (m))²
  // Si height > 3, on suppose des cm et on convertit en m
  const meters = h > 3 ? h / 100 : h;
  const bmiRaw = w / (meters * meters);
  const bmi = Number(bmiRaw.toFixed(1));

  // 2️⃣ Déterminer la catégorie correspondante (WHO)
  let category = "normal";
  if (bmi < 18.5) category = "maigre";
  else if (bmi >= 18.5 && bmi < 25) category = "normal";
  else if (bmi >= 25 && bmi < 30) category = "surpoids";
  else category = "obésité";

  // 3️⃣ Retourner { bmi, category }
  return { bmi, category };
}