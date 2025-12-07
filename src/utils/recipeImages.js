// Mapping d'images locales pour les recettes.
// Remplace les valeurs par vos propres images enregistrées depuis Google.
// Déposez vos fichiers dans `assets/images/recipes/` et mettez à jour les `require`.

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
  "electronic gourmet garlic and herb salade dr": require('../../assets/images/recipes/cu.webp'),
  "electronic gourmet french onion soup": require('../../assets/images/recipes/fren.webp'),
  "ellen's beef stew": require('../../assets/images/recipes/beef-stew.webp'),
  "elegant and easy white rice": require('../../assets/images/recipes/buttered-rice-main.webp'),
  "elegant fondue chocolate(sweet)":require('../../assets/images/recipes/fo.webp'),
};

// Liste des mots-clés de catégories à éviter dans la recherche par texte
// pour ne pas utiliser les images génériques de catégories à la place d'images spécifiques
const CATEGORY_KEYWORDS = ['moroccan', 'oriental', 'sweets', 'drinks', 'drink', 'bakery', 'dessert', 'vegetarian', 'asian'];

// Helper pour trouver une image à partir d'un texte (titre/ingrédients)
// Évite d'utiliser les images de catégories génériques si possible
export const findImageByText = (text, excludeCategoryKeywords = false) => {
  if (!text) return null;
  const lower = String(text).toLowerCase().trim();
  
  // Si excludeCategoryKeywords est true, éviter de retourner une image de catégorie
  // sauf si le texte correspond exactement au nom de la catégorie
  if (excludeCategoryKeywords) {
    // D'abord chercher des correspondances non-catégories
    for (const key of Object.keys(RECIPE_IMAGE_MAP)) {
      if (!CATEGORY_KEYWORDS.includes(key) && lower.includes(key)) {
        return RECIPE_IMAGE_MAP[key];
      }
    }
    // Ensuite seulement les catégories si le texte correspond exactement
    for (const key of CATEGORY_KEYWORDS) {
      if (RECIPE_IMAGE_MAP[key] && (lower === key || lower === `${key} food`)) {
        return RECIPE_IMAGE_MAP[key];
      }
    }
  } else {
    // Recherche normale
    for (const key of Object.keys(RECIPE_IMAGE_MAP)) {
      if (lower.includes(key)) {
        return RECIPE_IMAGE_MAP[key];
      }
    }
  }
  return null;
};

export const findImageByExactTitle = (title) => {
  if (!title) return null;
  const key = String(title).toLowerCase().trim();
  return RECIPE_TITLE_IMAGE_MAP[key] || null;
};

// Fonction principale pour obtenir l'image d'une recette
// PRIORITÉ : 1) Titre exact, 2) Recherche dans titre (sans catégories), 3) Ingrédients, 4) Image par défaut
export const getRecipeImage = (recipe) => {
  if (!recipe) return require('../../assets/icon.png');
  
  // 1. PRIORITÉ MAXIMALE : Chercher par titre exact dans RECIPE_TITLE_IMAGE_MAP
  const exactTitleImage = findImageByExactTitle(recipe.title);
  if (exactTitleImage) return exactTitleImage;
  
  // 2. Chercher dans le titre avec exclusion des mots-clés de catégories
  const titleImage = findImageByText(recipe.title, true);
  if (titleImage) return titleImage;
  
  // 3. Chercher dans les ingrédients avec exclusion des catégories
  // Gérer le cas où ingredients peut être un tableau ou une chaîne
  let ingredientsText = '';
  if (Array.isArray(recipe.ingredients)) {
    ingredientsText = recipe.ingredients.join(' ');
  } else if (Array.isArray(recipe.ingredientLines)) {
    ingredientsText = recipe.ingredientLines.join(' ');
  } else if (typeof recipe.ingredients === 'string') {
    ingredientsText = recipe.ingredients;
  } else if (typeof recipe.ingredientLines === 'string') {
    ingredientsText = recipe.ingredientLines;
  }
  const ingredientImage = findImageByText(ingredientsText, true);
  if (ingredientImage) return ingredientImage;
  
  // 4. Image par défaut en dernier recours
  return require('../../assets/icon.png');
};

// Mapping des ingrédients pour les recettes spécifiques
// Permet d'ajouter des ingrédients manuels pour les recettes qui n'ont pas de données complètes depuis l'API
export const RECIPE_INGREDIENTS_MAP = {
  "electronic gourmet garlic and herb salade dr": [
    "Lettuce",
    "Garlic cloves",
    "Fresh herbs (parsley, basil, oregano)",
    "Olive oil",
    "Lemon juice",
    "Salt",
    "Black pepper",
    "Cherry tomatoes",
    "Red onion",
    "Cucumber"
  ],
  "electronic gourmet french onion soup": [
    "Yellow onions",
    "Butter",
    "Beef broth",
    "White wine",
    "Thyme",
    "Bay leaf",
    "Salt",
    "Black pepper",
    "Baguette",
    "Gruyère cheese"
  ],
  "hot'n spicy chicken tacos": [
    "Chicken breast",
    "Tortillas",
    "Red chili powder",
    "Curry powder",
    "Ground cumin",
    "Garlic",
    "White onion",
    "Lettuce",
    "Tomatoes",
    "Cheese",
    "Sour cream"
  ],
  "emerald pea pasta": [
    "Pasta",
    "Fresh peas",
    "Olive oil",
    "Garlic",
    "Parmesan cheese",
    "Lemon zest",
    "Fresh mint",
    "Salt",
    "Black pepper"
  ],
  "salmon sushi": [
    "Sushi rice",
    "Fresh salmon",
    "Nori (seaweed)",
    "Rice vinegar",
    "Sugar",
    "Salt",
    "Soy sauce",
    "Wasabi",
    "Pickled ginger"
  ],
  "golden tofu wrap with warm asian slaw": [
    "Firm tofu",
    "Tortillas or wraps",
    "Cabbage",
    "Carrots",
    "Red bell pepper",
    "Soy sauce",
    "Sesame oil",
    "Rice vinegar",
    "Ginger",
    "Garlic",
    "Sesame seeds"
  ],
  "goan grilled fish": [
    "Whole fish",
    "Turmeric",
    "Red chili powder",
    "Coriander powder",
    "Cumin",
    "Garlic",
    "Ginger",
    "Lemon juice",
    "Salt",
    "Banana leaves"
  ],
  "elegant and easy gourmet geflite fish pate": [
    "White fish fillets",
    "Onions",
    "Eggs",
    "Matzo meal",
    "Carrots",
    "Salt",
    "Pepper",
    "Sugar",
    "Fish stock"
  ],
  "elegant chicken in sour cream": [
    "Chicken pieces",
    "Sour cream",
    "Butter",
    "Onions",
    "Mushrooms",
    "White wine",
    "Flour",
    "Paprika",
    "Salt",
    "Pepper"
  ],
  "ghouribi": [
    "All-purpose flour",
    "Butter",
    "Sugar",
    "Vanilla extract",
    "Orange blossom water",
    "Sesame seeds",
    "Baking powder",
    "Salt"
  ],
  "chocolate butter sweets": [
    "Butter",
    "Powdered sugar",
    "Cocoa powder",
    "Vanilla extract",
    "All-purpose flour",
    "Salt"
  ],
  "mexican sunset": [
    "Tequila",
    "Orange juice",
    "Grenadine",
    "Lime juice",
    "Ice",
    "Orange slice (for garnish)"
  ],
  "fresh mint ice cream with chocolate sauce": [
    "Heavy cream",
    "Whole milk",
    "Sugar",
    "Fresh mint leaves",
    "Egg yolks",
    "Dark chocolate",
    "Vanilla extract"
  ],
  "empanada pastry (basic recipe)": [
    "All-purpose flour",
    "Butter",
    "Salt",
    "Water",
    "Egg",
    "Filling of choice (meat, cheese, vegetables)"
  ],
  "ella julia rhubarb dessert": [
    "Rhubarb",
    "Sugar",
    "Flour",
    "Butter",
    "Eggs",
    "Vanilla extract",
    "Whipped cream"
  ],
  "hoppin john (vegetarian)": [
    "Black-eyed peas",
    "Rice",
    "Onions",
    "Bell peppers",
    "Celery",
    "Garlic",
    "Vegetable broth",
    "Thyme",
    "Bay leaves",
    "Salt",
    "Pepper"
  ],
  "cauliflower": [
    "Cauliflower",
    "Olive oil",
    "Garlic",
    "Lemon juice",
    "Parmesan cheese",
    "Breadcrumbs",
    "Salt",
    "Pepper",
    "Fresh herbs"
  ],
  "elegant and easy white rice": [
    "White rice",
    "Water",
    "Butter",
    "Salt"
  ],
  "ellen's beef stew": [
    "Beef chuck",
    "Onions",
    "Carrots",
    "Potatoes",
    "Beef broth",
    "Tomato paste",
    "Worcestershire sauce",
    "Bay leaves",
    "Thyme",
    "Salt",
    "Pepper"
  ],
  "broccoli cheese soup": [
    "Broccoli",
    "Cheddar cheese",
    "Onions",
    "Garlic",
    "Chicken or vegetable broth",
    "Heavy cream",
    "Butter",
    "Flour",
    "Salt",
    "Pepper",
    "Nutmeg"
  ],
};

// Helper pour obtenir les ingrédients d'une recette spécifique
export const getRecipeIngredients = (title) => {
  if (!title) return null;
  const titleStr = String(title).trim();
  const titleLower = titleStr.toLowerCase();
  
  // Essayer la correspondance exacte (sensible à la casse)
  if (RECIPE_INGREDIENTS_MAP[titleStr]) {
    return RECIPE_INGREDIENTS_MAP[titleStr];
  }
  
  // Essayer en minuscules
  if (RECIPE_INGREDIENTS_MAP[titleLower]) {
    return RECIPE_INGREDIENTS_MAP[titleLower];
  }
  
  // Recherche dans toutes les clés (normalisées)
  for (const mapKey in RECIPE_INGREDIENTS_MAP) {
    const mapKeyLower = mapKey.toLowerCase().trim();
    const titleLowerTrimmed = titleLower.trim();
    
    // Correspondance exacte après normalisation
    if (mapKeyLower === titleLowerTrimmed) {
      return RECIPE_INGREDIENTS_MAP[mapKey];
    }
    
    // Correspondance partielle (si le titre contient la clé ou vice versa)
    if (mapKeyLower.includes(titleLowerTrimmed) || titleLowerTrimmed.includes(mapKeyLower)) {
      // Vérifier que c'est une correspondance significative (au moins 5 caractères)
      const minLength = Math.min(mapKeyLower.length, titleLowerTrimmed.length);
      if (minLength >= 5) {
        return RECIPE_INGREDIENTS_MAP[mapKey];
      }
    }
  }
  
  return null;
};

// Mapping des recettes vers leurs catégories spécifiques
// Permet d'afficher certaines recettes dans des catégories même si elles ne matchent pas la recherche API
// IMPORTANT: Les recettes listées ici ne doivent apparaître QUE dans leur catégorie assignée
export const RECIPE_CATEGORY_MAP = {
  'tacos': [
    "hot'n spicy chicken tacos",
  ],
  'pizza': [
    // Les pizzas sont généralement bien couvertes par l'API, mais on peut ajouter des recettes spécifiques si besoin
  ],
  'pasta': [
    'emerald pea pasta',
    
  ],
  'sushi': [
    'salmon sushi',
  ],
  'asian': [
    'elegant and easy white rice',
    'salmon sushi',
    'golden tofu wrap with warm asian slaw',
  ],
  'chicken': [
    'elegant chicken in sour cream',
    "hot'n spicy chicken tacos",
  ],
  'grills': [
    "ellen's beef stew",
    'goan grilled fish',
  ],
  'healthy': [
    'electronic gourmet garlic and herb salade dr',
    'electronic gourmet french onion soup',
    'broccoli cheese soup',
  ],
  'seafood': [
    'elegant and easy gourmet geflite fish pate',
    'goan grilled fish',
    'salmon sushi',
  ],
  'moroccan': [
    'ghouribi',
     
  ],
  'oriental': [
    'golden tofu wrap with warm asian slaw',
   
  ],
  'sweets': [
    'chocolate butter sweets',
    'ella julia rhubarb dessert',
  ],
  'drinks': [
    'mexican sunset',
  ],
  'icecream': [
    'fresh mint ice cream with chocolate sauce',
  ],
  'bakery': [
    'empanada pastry (basic recipe)',
    'ghouribi',
  ],
  'dessert': [
    'fresh mint ice cream with chocolate sauce',
    'empanada pastry (basic recipe)',
    'ella julia rhubarb dessert',
    'chocolate butter sweets',
  ],
  'vegetarian': [
    'hoppin john (vegetarian)',
    'golden tofu wrap with warm asian slaw',
    'cauliflower',
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