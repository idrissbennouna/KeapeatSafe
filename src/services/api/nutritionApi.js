import Constants from 'expo-constants';

const API_NINJAS_KEY = Constants.expoConfig?.extra?.API_NINJAS_KEY;

// Nutrition API utilities
// But: récupérer les informations nutritionnelles d’un aliment, calculer les calories d’un plat,
// et convertir des unités utiles (g, kcal, etc.).

/**
 * Normalise une réponse d’API nutritionnelle (API Ninjas / Edamam)
 */
const normalizeNutrition = (raw) => {
  if (!raw) return null;
  // API Ninjas retourne un tableau d’items
  const item = Array.isArray(raw) ? raw[0] : raw;
  const calories = item.calories ?? item.ENERC_KCAL ?? 0;
  const protein_g = item.protein_g ?? item.PROCNT ?? 0;
  const fat_g = item.fat_total_g ?? item.FAT ?? 0;
  const carbs_g = item.carbohydrate_total_g ?? item.CHOCDF ?? 0;
  return { calories, protein_g, fat_g, carbs_g, raw: item };
};

/**
 * Récupère les informations nutritionnelles pour un aliment.
 * options.provider: 'apiNinjas' | 'edamam'
 * options.apiKey / options.appId / options.appKey: identifiants API
 */
export const fetchNutritionData = async (food, options = {}) => {
  const query = String(food || '').trim();
  if (!query) throw new Error('Aliment manquant');

  const provider = options.provider || 'apiNinjas';
  const apiKey = options.apiKey || API_NINJAS_KEY;

  let url = '';
  const headers = {};

  if (provider === 'apiNinjas') {
    if (!apiKey) {
      throw new Error('API key manquante pour API Ninjas');
    }
    url = `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;
    headers['X-Api-Key'] = apiKey;
  } else if (provider === 'edamam') {
    if (!options.appId || !options.appKey) {
      throw new Error('Identifiants Edamam manquants (appId/appKey)');
    }
    // Edamam Nutrition Data API (quantité par ingrédient via ingr param)
    url = `https://api.edamam.com/api/nutrition-data?app_id=${options.appId}&app_key=${options.appKey}&ingr=${encodeURIComponent(query)}`;
  } else {
    throw new Error(`Provider inconnu: ${provider}`);
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Échec API nutrition (${res.status}): ${text}`);
  }
  const data = await res.json();
  return normalizeNutrition(data);
};

/**
 * Calcule les calories totales d’un plat à partir des ingrédients.
 * meal: Array<{ name: string, quantity_g?: number, nutrition?: { calories?: number, calories_per_100g?: number } }>
 * S'il manque les infos calories, tente une récupération via fetchNutritionData (options nécessaires).
 */
export const calculateTotalCalories = async (meal = [], options = {}) => {
  if (!Array.isArray(meal) || meal.length === 0) return 0;

  let total = 0;
  for (const ing of meal) {
    const qty = Number(ing.quantity_g || 0);
    let calories = 0;

    if (ing.nutrition?.calories_per_100g) {
      calories = (qty / 100) * Number(ing.nutrition.calories_per_100g);
    } else if (ing.nutrition?.calories) {
      // calories déjà normalisées pour la quantité indiquée
      calories = Number(ing.nutrition.calories);
    } else if (ing.name) {
      // Tentative de récupération via API pour 100g
      const info = await fetchNutritionData(`${ing.name} 100g`, options).catch(() => null);
      if (info?.calories) {
        calories = (qty / 100) * info.calories;
      }
    }

    total += isFinite(calories) ? calories : 0;
  }
  return Math.round(total);
};

/**
 * Convertit des unités: g<->kg, mg->g, kcal<->cal
 */
export const convertUnits = (value, from, to) => {
  const v = Number(value);
  if (!isFinite(v)) throw new Error('Valeur invalide');
  const f = String(from || '').toLowerCase();
  const t = String(to || '').toLowerCase();

  if (f === t) return v;

  // Masse
  if (f === 'g' && t === 'kg') return v / 1000;
  if (f === 'kg' && t === 'g') return v * 1000;
  if (f === 'mg' && t === 'g') return v / 1000;
  if (f === 'g' && t === 'mg') return v * 1000;

  // Énergie
  if (f === 'kcal' && t === 'cal') return v * 1000;
  if (f === 'cal' && t === 'kcal') return v / 1000;

  throw new Error(`Conversion non supportée: ${from} -> ${to}`);
};

export default {
  fetchNutritionData,
  calculateTotalCalories,
  convertUnits,
};