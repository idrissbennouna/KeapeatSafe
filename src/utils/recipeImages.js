// Mapping d'images locales pour les recettes.
// Remplace les valeurs par vos propres images enregistrées depuis Google.
// Déposez vos fichiers dans `assets/images/recipes/` et mettez à jour les `require`.

// NOTE: Pour éviter des erreurs de bundling, les entrées ci-dessous
// pointent pour l'instant vers un placeholder existant (`assets/images/logo.png`).
// Une fois vos images ajoutées, changez simplement le chemin du require.

export const RECIPE_IMAGE_MAP = {
  pizza: require('../../assets/images/pizza.webp'),
  tacos: require('../../assets/images/tacos.jpg'),
  sushi: require('../../assets/images/sushi.jpg'),
  pasta: require('../../assets/images/pasta.png'),
  chicken: require('../../assets/images/chicken.avif'),
  salad: require('../../assets/images/salad.png'),
  soup: require('../../assets/images/soup.jpg'),
  beef: require('../../assets/images/beef.jpg'),
  rice: require('../../assets/images/rice.png'),
  grill: require('../../assets/images/grill.png'),
  seafood: require('../../assets/images/seafood.jpg'),
  moroccan: require('../../assets/images/moroccan.jpg'),
  oriental: require('../../assets/images/oriental.jpg'),
  sweets: require('../../assets/images/sweets.webp'),
  drinks: require('../../assets/images/drinks.png'),
  drink: require('../../assets/images/drinks.png'),
  icecream: require('../../assets/images/icecream.avif'),
  bakery: require('../../assets/images/bakery.jpg'),
  dessert: require('../../assets/images/dessert.png'),
  vegetarian: require('../../assets/images/vegetarian.jpg'),
  asian: require('../../assets/images/asian.jpg'),


};

// Mapping d'images par titre exact (à remplir si vous voulez cibler une recette précise)
// IMPORTANT: Les clés doivent être en minuscules car la fonction findImageByExactTitle convertit en minuscules
export const RECIPE_TITLE_IMAGE_MAP = {
  "hot'n spicy chicken tacos": require('../../assets/images/recipes/spicytacos.jpg'),
  "hot n spicy chicken tacos": require('../../assets/images/recipes/spicytacos.jpg'),
  "hot and spicy chicken tacos": require('../../assets/images/recipes/spicytacos.jpg'),
  "emerald pea pasta": require('../../assets/images/recipes/peapasta.jpg'),
  "salmon sushi": require('../../assets/images/recipes/salmon sushi.jpg'),
  "golden tofu wrap with warm asian slaw": require('../../assets/images/recipes/tofu.png'),
  "goan grilled fish": require('../../assets/images/recipes/fish.jpg'),
  "elegant and easy gourmet geflite fish pate": require('../../assets/images/recipes/fishpate.jpg'),
  "broccoli cheese soup": require('../../assets/images/recipes/brocolli.jpg'),
  "elegant chicken in sour cream": require('../../assets/images/recipes/chickens.jpg'),
  "ghouribi": require('../../assets/images/recipes/ghouribi.jpg'),
  "cauliflower": require('../../assets/images/recipes/cauliflower.jpg'),
  "chocolate butter sweets": require('../../assets/images/recipes/chocolat.jpg'),
  "mexican sunset": require('../../assets/images/recipes/cocktail.jpg'),
  "fresh mint ice cream with chocolate sauce": require('../../assets/images/recipes/icecream.jpg'),
  "empanada pastry (basic recipe)": require('../../assets/images/recipes/dessert.jpg'),
  "ella julia rhubarb dessert": require('../../assets/images/recipes/rhubarb.jpg'),
  "hoppin john (vegetarian)": require('../../assets/images/recipes/hoppin.jpg'),
  "electronic gourmet garlic and herb salade dr": require('../../assets/images/salad.png'),
  "electronic gourmet french onion soup": require('../../assets/images/soup.jpg'),
  "ellen's beef stew": require('../../assets/images/beef.jpg'),

  "elegant and easy white rice": require('../../assets/images/rice.png'),

};

// Helper pour trouver une image à partir d'un texte (titre/ingrédients)
export const findImageByText = (text) => {
  if (!text) return null;
  const lower = String(text).toLowerCase();
  for (const key of Object.keys(RECIPE_IMAGE_MAP)) {
    if (lower.includes(key)) {
      return RECIPE_IMAGE_MAP[key];
    }
  }
  return null;
};

export const findImageByExactTitle = (title) => {
  if (!title) return null;
  const key = String(title).toLowerCase().trim();
  return RECIPE_TITLE_IMAGE_MAP[key] || null;
};

// Mapping des recettes vers leurs catégories spécifiques
// Permet d'afficher certaines recettes dans des catégories même si elles ne matchent pas la recherche API
// IMPORTANT: Les recettes listées ici ne doivent apparaître QUE dans leur catégorie assignée
export const RECIPE_CATEGORY_MAP = {
  'healthy': [
    'electronic gourmet garlic and herb salade dr',
    'electronic gourmet french onion soup',
  ],
  'grills': [
    "ellen's beef stew",
  ],
  'asian': [
    'elegant and easy white rice',
  ],
  'seafood': [
    'elegant and easy gourmet geflite fish pate',
  ],
};

// Liste de toutes les recettes qui ont des catégories spécifiques assignées
// Utilisé pour filtrer ces recettes des résultats API dans d'autres catégories
export const getExcludedRecipesForCategory = (categoryKey) => {
  const excluded = [];
  Object.keys(RECIPE_CATEGORY_MAP).forEach((catKey) => {
    if (catKey !== categoryKey) {
      excluded.push(...RECIPE_CATEGORY_MAP[catKey]);
    }
  });
  return excluded.map(r => r.toLowerCase().trim());
};