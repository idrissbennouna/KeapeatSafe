import Constants from 'expo-constants';

const API_NINJAS_KEY = Constants.expoConfig?.extra?.API_NINJAS_KEY;

// Recipes API utilities
// But: récupérer des recettes selon un mot-clé/ingrédient, obtenir des détails,
// et filtrer selon des critères (végétarien, sans gluten, etc.).

/**
 * Cherche des recettes par mot-clé/ingrédient
 * options.provider: 'apiNinjas' | 'edamam'
 * options.apiKey / options.appId / options.appKey
 */
export const fetchRecipes = async (query, options = {}) => {
  const q = String(query || '').trim();
  if (!q) throw new Error('Requête de recherche manquante');

  const provider = options.provider || 'apiNinjas';
  const apiKey = options.apiKey || API_NINJAS_KEY;
  let url = '';
  const headers = {};

  if (provider === 'apiNinjas') {
    if (!apiKey) throw new Error('API key manquante pour API Ninjas');
    url = `https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(q)}`;
    headers['X-Api-Key'] = apiKey;
  } else if (provider === 'edamam') {
    if (!options.appId || !options.appKey) throw new Error('Identifiants Edamam manquants');
    url = `https://api.edamam.com/search?q=${encodeURIComponent(q)}&app_id=${options.appId}&app_key=${options.appKey}`;
  } else {
    throw new Error(`Provider inconnu: ${provider}`);
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Échec API recettes (${res.status}): ${text}`);
  }
  const data = await res.json();

  // Normalisation simple: API Ninjas retourne directement un tableau, Edamam utilise hits
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data.hits)
      ? data.hits.map(h => ({
          id: h.recipe.uri,
          title: h.recipe.label,
          ingredients: h.recipe.ingredientLines,
          image: h.recipe.image,
          calories: h.recipe.calories,
          dietLabels: h.recipe.dietLabels,
          healthLabels: h.recipe.healthLabels,
        }))
      : [];

  return list;
};

/**
 * Obtient les détails d’une recette (selon provider)
 * Pour API Ninjas: les items sont déjà détaillés; pour Edamam: l’URI sert d’identifiant.
 */
export const getRecipeDetails = async (idOrRecipe, options = {}) => {
  if (!idOrRecipe) throw new Error('Identifiant/recette manquant');
  const provider = options.provider || 'apiNinjas';

  // API Ninjas: l’élément est déjà complet
  if (provider === 'apiNinjas') {
    return typeof idOrRecipe === 'object' ? idOrRecipe : { id: idOrRecipe };
  }

  // Edamam: refaire une recherche par URI (simple fallback)
  if (provider === 'edamam') {
    if (!options.appId || !options.appKey) throw new Error('Identifiants Edamam manquants');
    const uri = encodeURIComponent(String(idOrRecipe));
    const url = `https://api.edamam.com/search?r=${uri}&app_id=${options.appId}&app_key=${options.appKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Échec détails recette (${res.status})`);
    const data = await res.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
  }

  throw new Error(`Provider inconnu: ${provider}`);
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