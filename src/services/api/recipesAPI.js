import Constants from 'expo-constants';

const API_NINJAS_KEY = Constants.expoConfig?.extra?.API_NINJAS_KEY;

// Recipes API utilities
// But: récupérer des recettes selon un mot-clé/ingrédient, obtenir des détails,
// et filtrer selon des critères (végétarien, sans gluten, etc.).

/**
 * Cherche des recettes par mot-clé/ingrédient
 * Provider unique: API Ninjas
 * options.apiKey: clé API Ninjas
 */
export const fetchRecipes = async (query, options = {}) => {
  const q = String(query || '').trim();
  if (!q) throw new Error('Requête de recherche manquante');

  const apiKey = options.apiKey || API_NINJAS_KEY;
  let url = '';
  const headers = {};

  if (!apiKey) throw new Error('API key manquante pour API Ninjas');
  url = `https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(q)}`;
  headers['X-Api-Key'] = apiKey;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Échec API recettes (${res.status}): ${text}`);
  }
  const data = await res.json();

  // API Ninjas retourne directement un tableau
  const list = Array.isArray(data) ? data : [];

  return list;
};

/**
 * Obtient les détails d’une recette (API Ninjas)
 * Les items retournés par API Ninjas sont déjà complets.
 */
export const getRecipeDetails = async (idOrRecipe, options = {}) => {
  if (!idOrRecipe) throw new Error('Identifiant/recette manquant');
  // API Ninjas: l’élément est déjà complet ou identifiable
  return typeof idOrRecipe === 'object' ? idOrRecipe : { id: idOrRecipe };
};

/**
 * Filtre des recettes selon un type: 'vegetarian' | 'vegan' | 'gluten_free'
 */
export const filterRecipes = (recipes = [], filterType) => {
  const type = String(filterType || '').toLowerCase();
  if (!type) return recipes;

  const hasLabel = (recipe, labels) => {
    const all = [
      ...(recipe.dietLabels || []),
      ...(recipe.healthLabels || []),
      ...(recipe.labels || []),
    ].map(x => String(x).toLowerCase());
    return labels.every(l => all.includes(l));
  };

  if (type === 'vegetarian') {
    return recipes.filter(r => hasLabel(r, ['vegetarian']) || r.isVegetarian === true);
  }
  if (type === 'vegan') {
    return recipes.filter(r => hasLabel(r, ['vegan']) || r.isVegan === true);
  }
  if (type === 'gluten_free') {
    return recipes.filter(r => hasLabel(r, ['gluten-free']) || r.isGlutenFree === true);
  }
  return recipes;
};

export default {
  fetchRecipes,
  getRecipeDetails,
  filterRecipes,
};