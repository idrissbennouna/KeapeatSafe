import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { fetchRecipes } from '../../services/api/recipesAPI';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import { RECIPE_IMAGE_MAP, findImageByText, findImageByExactTitle, RECIPE_CATEGORY_MAP, getExcludedRecipesForCategory } from '../../utils/recipeImages';

const DEFAULT_CATEGORY_IMAGE = require('../../../assets/icon.png');

const RecipesScreen = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const CATEGORY_FILTERS = [
    { key: 'tacos', label: 'Tacos', query: 'tacos', imageKey: 'tacos' },
    { key: 'pizza', label: 'Pizza', query: 'pizza', imageKey: 'pizza' },
    { key: 'pasta', label: 'Pasta', query: 'pasta', imageKey: 'pasta' },
    { key: 'sushi', label: 'Sushi', query: 'sushi', imageKey: 'sushi' },
    { key: 'asian', label: 'Asian', query: 'asian', imageKey: 'asian' },
    { key: 'chicken', label: 'Chicken', query: 'chicken', imageKey: 'chicken' },
    { key: 'grills', label: 'Grills', query: 'grill', imageKey: 'grill' },
    { key: 'healthy', label: 'Healthy', query: 'healthy', imageKey: 'salad' },
    { key: 'seafood', label: 'Seafood & Fish', query: 'fish', imageKey: 'seafood' },
    { key: 'moroccan', label: 'Moroccan', query: 'moroccan', imageKey: 'moroccan' },
    { key: 'oriental', label: 'Oriental food', query: 'oriental', imageKey: 'oriental' },
    { key: 'sweets', label: 'Sweets', query: 'sweets', imageKey: 'sweets' },
    { key: 'drinks', label: 'Drinks', query: 'drink', imageKey: 'drinks' },
    { key: 'icecream', label: 'Ice Cream', query: 'ice cream', imageKey: 'icecream' },
    { key: 'bakery', label: 'Bakery & Pastry', query: 'pastry', imageKey: 'bakery' },
    { key: 'dessert', label: 'Dessert', query: 'dessert', imageKey: 'dessert' },
    { key: 'vegetarian', label: 'Vegetarian', query: 'vegetarian', imageKey: 'vegetarian' },
  ];

  const handleSearch = async () => {
    const q = String(query || '').trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchRecipes(q);
      setRecipes(Array.isArray(list) ? list : []);
      setSelectedCategory(null);
    } catch (e) {
      setError(e?.message || 'Erreur de récupération des recettes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchQuery = useCallback(async (q) => {
    const queryStr = String(q || '').trim();
    if (!queryStr) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchRecipes(queryStr);
      setRecipes(Array.isArray(list) ? list : []);
      setSelectedCategory(null);
    } catch (e) {
      setError(e?.message || 'Erreur de récupération des recettes');
    } finally {
      setLoading(false);
    }
  }, []);

  const normalizeIngredients = (rawIngredients) => {
    return Array.isArray(rawIngredients)
      ? rawIngredients
      : typeof rawIngredients === 'string'
        ? rawIngredients
            .split(/[\,\n•\-|]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
  };

  const matchesQuery = (item, q) => {
    const term = String(q || '').toLowerCase();
    if (!term) return true;
    const title = String(item.title || item.name || '').toLowerCase();
    const ingArr = normalizeIngredients(item.ingredients || item.ingredientLines || []);
    const inTitle = title.includes(term);
    const inIngredients = ingArr.some((ing) => String(ing).toLowerCase().includes(term));
    return inTitle || inIngredients;
  };

  const getRecipeImageSource = (item, categoryKey = null) => {
    // 1. D'abord vérifier si l'API fournit une image
    const uri = item?.image || item?.image_url || item?.thumbnail || item?.img;
    if (uri && typeof uri === 'string') {
      return { uri };
    }
    
    // 2. Chercher une image locale par titre exact
    const title = item?.title || item?.name || '';
    const exactMatch = findImageByExactTitle(title);
    if (exactMatch) {
      return exactMatch;
    }
    
    // 3. Chercher une image locale par titre (recherche partielle)
    const titleMatch = findImageByText(title);
    if (titleMatch) {
      return titleMatch;
    }
    
    // 4. Chercher dans les ingrédients
    const rawIngredients = item?.ingredients || item?.ingredientLines || [];
    const ingredients = normalizeIngredients(rawIngredients);
    const ingredientsText = Array.isArray(ingredients) ? ingredients.join(' ') : String(rawIngredients);
    const ingredientsMatch = findImageByText(ingredientsText);
    if (ingredientsMatch) {
      return ingredientsMatch;
    }
    
    // 5. Utiliser l'image de la catégorie comme fallback si disponible
    if (categoryKey) {
      const category = CATEGORY_FILTERS.find(c => c.key === categoryKey);
      if (category) {
        const categoryImage = getCategoryImageSource(category.imageKey);
        if (categoryImage) {
          return categoryImage;
        }
      }
    }
    
    // 6. Aucune image trouvée
    return null;
  };

  const getCategoryImageSource = (imageKey) => {
    if (!imageKey) return null;
    const image = RECIPE_IMAGE_MAP[imageKey];
    return image || null;
  };

  const handleSelectCategory = async (cat) => {
    if (!cat) return;
    
    // Animation de transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    setSelectedCategory(cat.key);
    setQuery('');
    setLoading(true);
    setError(null);
    try {
      // Récupérer les recettes de l'API pour cette catégorie
      const list = await fetchRecipes(cat.query);
      
      // Liste des recettes à exclure (celles qui sont assignées à d'autres catégories)
      const excludedRecipes = getExcludedRecipesForCategory(cat.key);
      
      // Filtrer les résultats de l'API pour exclure les recettes assignées à d'autres catégories
      const filtered = Array.isArray(list) ? list.filter((item) => {
        const title = String(item.title || item.name || '').toLowerCase().trim();
        // Vérifier si cette recette est assignée à une autre catégorie
        const isExcluded = excludedRecipes.some(excluded => {
          return title === excluded || title.includes(excluded) || excluded.includes(title);
        });
        // Ne garder que si elle matche la requête ET n'est pas exclue
        return matchesQuery(item, cat.query) && !isExcluded;
      }) : [];
      
      // Ajouter les recettes spécifiques de cette catégorie
      const categorySpecificRecipes = RECIPE_CATEGORY_MAP[cat.key] || [];
      const specificRecipesPromises = categorySpecificRecipes.map(async (recipeTitle) => {
        try {
          // Essayer plusieurs variantes de recherche
          const searchVariants = [
            recipeTitle,
            recipeTitle.replace(/'/g, ''),
            recipeTitle.replace(/'/g, ' '),
            recipeTitle.split(' ').slice(0, 3).join(' '), // Premiers mots
          ];
          
          for (const variant of searchVariants) {
            try {
              const searchResults = await fetchRecipes(variant);
              if (Array.isArray(searchResults) && searchResults.length > 0) {
                // Chercher une correspondance partielle ou exacte
                const match = searchResults.find((r) => {
                  const title = String(r.title || r.name || '').toLowerCase();
                  const searchTitle = recipeTitle.toLowerCase();
                  return title === searchTitle || 
                         title.includes(searchTitle) || 
                         searchTitle.includes(title.split(' ')[0]);
                });
                if (match) return match;
                // Si pas de match exact, prendre la première qui contient un mot clé
                const keyword = recipeTitle.toLowerCase().split(' ')[0];
                const keywordMatch = searchResults.find((r) => {
                  const title = String(r.title || r.name || '').toLowerCase();
                  return title.includes(keyword);
                });
                if (keywordMatch) return keywordMatch;
                return searchResults[0];
              }
            } catch (e) {
              continue;
            }
          }
        } catch (e) {
          // Continuer avec la prochaine variante
        }
        
        // Si aucune recherche ne fonctionne, créer un objet recette minimal avec les données du mapping
        return {
          title: recipeTitle,
          name: recipeTitle,
          ingredients: [],
          id: `category-${cat.key}-${recipeTitle.toLowerCase().replace(/\s+/g, '-')}`,
        };
      });
      
      const specificRecipes = (await Promise.all(specificRecipesPromises)).filter(Boolean);
      
      // Combiner les recettes de l'API avec les recettes spécifiques (éviter les doublons)
      const allRecipes = [...filtered];
      specificRecipes.forEach((specificRecipe) => {
        const title = String(specificRecipe.title || specificRecipe.name || '').toLowerCase();
        const isDuplicate = allRecipes.some(
          (r) => String(r.title || r.name || '').toLowerCase() === title
        );
        if (!isDuplicate) {
          allRecipes.push(specificRecipe);
        }
      });
      
      setRecipes(allRecipes);
    } catch (e) {
      setError(e?.message || 'Erreur de récupération des recettes');
    } finally {
      setLoading(false);
    }
  };

  // Charger plusieurs requêtes par défaut pour afficher une variété de recettes
  useEffect(() => {
    const defaults = ['salad', 'soup', 'beef', 'rice'];
    const loadDefaults = async () => {
      setLoading(true);
      setError(null);
      try {
        const batches = await Promise.all(
          defaults.map(q => fetchRecipes(q).catch(() => []))
        );
        const merged = batches.flat();
        setRecipes(merged);
        setQuery('');
      } catch (e) {
        setError(e?.message || 'Erreur de chargement des recettes');
      } finally {
        setLoading(false);
      }
    };
    loadDefaults();
  }, []);

  const renderItem = ({ item }) => {
    const title = item.title || item.name || 'Recette';
    const rawIngredients = item.ingredients || item.ingredientLines || [];
    const ingredients = normalizeIngredients(rawIngredients);
    const topIngredients = Array.isArray(ingredients) ? ingredients.slice(0, 10) : [];
    const imageSource = getRecipeImageSource(item, selectedCategory);
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}
        onPress={() => setRecipes(prev => prev.map(r => r === item ? { ...r, _expanded: !r._expanded } : r))}
      >
        <View style={styles.cardRow}>
          {imageSource ? (
            <Image source={imageSource} style={styles.cardThumb} resizeMode="cover" />
          ) : (
            <View style={[styles.cardThumb, { backgroundColor: colors.surfaceLight }]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSub}>{ingredients.length} ingrédient(s)</Text>
          </View>
        </View>
        {item._expanded && (
          <View style={{ marginTop: 8 }}>
            {ingredients.length === 0 ? (
              <Text style={styles.cardSub}>Ingrédients indisponibles pour cette recette.</Text>
            ) : (
              topIngredients.map((ing, idx) => (
                <Text key={idx} style={styles.ingredientItem}>• {String(ing)}</Text>
              ))
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[globalStyles.container]}>
      <Text style={globalStyles.title}>Recettes</Text>

      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher (ex: pasta, chicken)"
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <Button title="Chercher" onPress={handleSearch} />
      </View>

      {/* Filtres de catégories */}
      <View style={{ marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {CATEGORY_FILTERS.map((cat) => {
            const categoryImage = getCategoryImageSource(cat.imageKey);
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, selectedCategory === cat.key && styles.chipActive]}
                onPress={() => handleSelectCategory(cat)}
                activeOpacity={0.7}
              >
                {categoryImage ? (
                  <Image source={categoryImage} style={styles.chipImage} resizeMode="cover" />
                ) : null}
                <Text style={[styles.chipText, selectedCategory === cat.key && styles.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading && (
        <View style={styles.center}> 
          <ActivityIndicator size="small" />
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={recipes}
            keyExtractor={(item, index) => String(item.id || item.uri || item.title || index)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>Aucune recette trouvée. Essaie un autre mot-clé 🍲</Text>}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, height: 40, backgroundColor: colors.white },
  center: { alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.danger, marginBottom: 8 },
  list: { gap: 8 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 24 },
  card: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceLight },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardThumb: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.surfaceLight, marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { color: colors.textSecondary, marginTop: 4 },
  ingredientItem: { color: colors.textPrimary, marginTop: 2 },
  categoriesRow: { paddingHorizontal: 4, gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceLight, marginRight: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textPrimary, fontWeight: '500' },
  chipTextActive: { color: colors.white },
  chipImage: { width: 28, height: 28, borderRadius: 14, marginRight: 4 },
});

export default RecipesScreen;