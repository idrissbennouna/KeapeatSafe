import Constants from 'expo-constants';

const API_NINJAS_KEY = Constants.expoConfig?.extra?.API_NINJAS_KEY;

// Nutrition API utilities
// But: récupérer les infos nutritionnelles d'un ingrédient et
// calculer les calories totales d'un ensemble d'ingrédients.

/**
 * Récupère les infos nutritionnelles pour une requête donnée.
 * Par défaut, utilise API Ninjas: https://api.api-ninjas.com/v1/nutrition
 * Exemple de requête: "banane 100g"
 */
export const fetchNutritionData = async (query, options = {}) => {
  const q = String(query || '').trim();
  if (!q) throw new Error('Requête nutrition manquante');

  const provider = options.provider || 'apiNinjas';

  if (provider === 'apiNinjas') {
    const apiKey = options.apiKey || API_NINJAS_KEY;
    if (!apiKey) throw new Error('API key manquante pour API Ninjas');

    const url = `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(q)}`;
    const headers = { 'X-Api-Key': apiKey };

    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Échec API nutrition (${res.status}): ${text}`);
    }
    const data = await res.json();
    // API Ninjas retourne un tableau de résultats
    return Array.isArray(data) ? data : [];
  }

  throw new Error(`Provider nutrition inconnu: ${provider}`);
};

/**
 * Calcule les calories totales pour une liste d'ingrédients.
 * Chaque élément doit idéalement contenir { name, quantity_g }.
 * Utilise fetchNutritionData avec une requête "<name> <quantity_g>g".
 */
export const calculateTotalCalories = async (ingredients = [], options = {}) => {
  if (!Array.isArray(ingredients)) throw new Error('Liste d’ingrédients invalide');
  let total = 0;

  for (const ing of ingredients) {
    const name = String(ing?.name || ing?.title || '').trim();
    const qty = Number(ing?.quantity_g || ing?.qty_g || ing?.quantity || 100);
    if (!name) continue;
    try {
      const results = await fetchNutritionData(`${name} ${qty}g`, options);
      const first = Array.isArray(results) && results.length ? results[0] : null;
      const calories = Number(first?.calories || 0);
      total += isNaN(calories) ? 0 : calories;
    } catch (e) {
      // En cas d’échec pour un ingrédient, ignorer et continuer
      // Optionnel: logger e.message
    }
  }

  return Math.max(0, Math.round(total));
};

export default {
  fetchNutritionData,
  calculateTotalCalories,
};