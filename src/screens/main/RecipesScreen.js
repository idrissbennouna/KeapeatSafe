import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, Image, Animated, PixelRatio, Dimensions } from 'react-native';
import { fetchRecipes } from '../../services/api/recipesAPI';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
 
import { 
  RECIPE_IMAGE_MAP, 
  getRecipeImage, 
  RECIPE_CATEGORY_MAP, 
  getExcludedRecipesForCategory, 
  getRecipeIngredients 
} from '../../utils/recipeImages';

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
    { key: 'asian', label: 'Asian', query: 'asian food', imageKey: 'asian' }, // Modifié pour être plus précis
    { key: 'chicken', label: 'Chicken', query: 'chicken', imageKey: 'chicken' },
    { key: 'grills', label: 'Grills', query: 'grill', imageKey: 'grill' },
    { key: 'healthy', label: 'Healthy', query: 'salad', imageKey: 'salad' },
    { key: 'seafood', label: 'Seafood & Fish', query: 'fish', imageKey: 'seafood' },
    { key: 'moroccan', label: 'Moroccan', query: 'moroccan', imageKey: 'moroccan' },
    { key: 'oriental', label: 'Oriental food', query: 'middle eastern food', imageKey: 'oriental' }, // Modifié pour être plus précis
    { key: 'sweets', label: 'Sweets', query: 'sweet', imageKey: 'sweets' },
    { key: 'drinks', label: 'Drinks', query: 'drink', imageKey: 'drinks' },
    { key: 'icecream', label: 'Ice Cream', query: 'ice cream', imageKey: 'icecream' },
    { key: 'bakery', label: 'Bakery & Pastry', query: 'pastry', imageKey: 'bakery' },
    { key: 'dessert', label: 'Dessert', query: 'dessert', imageKey: 'dessert' },
    { key: 'vegetarian', label: 'Vegetarian', query: 'vegetarian', imageKey: 'vegetarian' },
  ];
  const CATEGORY_EXCLUDES = {
    healthy: ["electronic gourmet's garlic and herb salad dr"],
    seafood: ["elegant and easy gourmet gefilte fish pate"],
    dessert: ["ella julia's rhubarb dessert"],
    vegetarian: ["hoppin' john (vegetarian)"],
  };

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

  

  const getCategoryImageSource = (imageKey) => {
    if (!imageKey) return null;
    const image = RECIPE_IMAGE_MAP[imageKey];
    return image || null;
  };

  const getImageDpSize = (source, desiredW, desiredH) => {
    try {
      const res = Image.resolveAssetSource(source) || {};
      const pr = PixelRatio.get();
      const maxW = Math.floor((res.width || desiredW) / pr);
      const maxH = Math.floor((res.height || desiredH) / pr);
      return { width: Math.min(desiredW, maxW), height: Math.min(desiredH, maxH) };
    } catch {
      return { width: desiredW, height: desiredH };
    }
  };

  const handleSelectCategory = async (cat) => {
    if (!cat) return;
    
    // Animation
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    
    setSelectedCategory(cat.key);
    setQuery('');
    setLoading(true);
    setError(null);

    // ÉTAPE 1 : Créer TOUJOURS les recettes spécifiques en premier (sans attendre l'API)
    const categorySpecificRecipes = RECIPE_CATEGORY_MAP[cat.key] || [];
    const specificRecipes = categorySpecificRecipes.map((recipeTitle) => {
      const storedIngredients = getRecipeIngredients(recipeTitle);
      // Log pour débogage si pas d'ingrédients trouvés
      if (!storedIngredients) {
        console.warn(`⚠️ Aucun ingrédient trouvé pour: "${recipeTitle}"`);
      }
      return {
        title: recipeTitle,
        name: recipeTitle,
        ingredients: storedIngredients || [],
        ingredientLines: storedIngredients || [],
        id: `cat-${cat.key}-${recipeTitle.replace(/\s+/g, '-')}-${Date.now()}`,
        servings: 4,
        instructions: [],
      };
    });

    // Afficher immédiatement les recettes spécifiques si elles existent (pour éviter page blanche)
    if (specificRecipes.length > 0) {
      setRecipes(specificRecipes);
    } else {
      setRecipes([]); // Vider si pas de recettes spécifiques
    }

    try {
      // ÉTAPE 2 : Récupérer les recettes de l'API en arrière-plan
      let apiRecipes = [];
      try {
        apiRecipes = await fetchRecipes(cat.query);
        if (!Array.isArray(apiRecipes)) apiRecipes = [];
      } catch (err) {
        console.warn('Erreur API (non bloquante):', err);
        apiRecipes = [];
      }

      // ÉTAPE 3 : Filtrer les recettes API pour éviter les doublons avec les spécifiques
      const excludedRecipes = getExcludedRecipesForCategory(cat.key) || [];
      const catExcludes = (CATEGORY_EXCLUDES[cat.key] || []).map(s => s.toLowerCase().trim());
      const filteredApiRecipes = apiRecipes.filter((item) => {
        const rawTitle = String(item.title || item.name || '').trim();
        const title = rawTitle.toLowerCase().trim();
        if (!title) return false;
        
        // Vérifier si cette recette est déjà dans les spécifiques
        const isInSpecific = categorySpecificRecipes.some(specificTitle => {
          const specificLower = specificTitle.toLowerCase().trim();
          return title === specificLower || title.includes(specificLower) || specificLower.includes(title);
        });
        if (isInSpecific) return false;
        
        // Vérifier si exclue
        const isExcludedNormalized = excludedRecipes.some(excluded => title === excluded || title.includes(excluded));
        const isUppercaseVariant = catExcludes.includes(title) && /[A-Z]/.test(rawTitle);
        const isExcluded = isExcludedNormalized || isUppercaseVariant;
        return !isExcluded;
      });

      // ÉTAPE 4 : Combiner spécifiques + API (spécifiques en premier)
      let allRecipes = [...specificRecipes, ...filteredApiRecipes];
      
      // Supprimer les doublons
      const uniqueRecipes = [];
      const seenTitles = new Set();
      
      allRecipes.forEach(item => {
        const t = String(item.title || item.name || '').toLowerCase().trim();
        if (t && !seenTitles.has(t)) {
          seenTitles.add(t);
          uniqueRecipes.push(item);
        }
      });

      // Mettre à jour avec toutes les recettes
      setRecipes(uniqueRecipes);
      
      // Log pour débogage
      console.log(`Catégorie ${cat.key}: ${specificRecipes.length} spécifiques, ${filteredApiRecipes.length} API, ${uniqueRecipes.length} total`);

    } catch (e) {
      console.error('Erreur lors de la sélection de catégorie:', e);
      // Si erreur mais qu'on a des recettes spécifiques, on les garde
      if (specificRecipes.length === 0) {
        setError('Impossible de charger cette catégorie. Veuillez réessayer.');
        setRecipes([]);
      } else {
        // Garder les recettes spécifiques même en cas d'erreur
        setRecipes(specificRecipes);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDefaults = async () => {
      setLoading(true);
      try {
        // Chargement initial simple
        const list = await fetchRecipes('pasta');
        setRecipes(Array.isArray(list) ? list : []);
      } catch (e) {
        setError('Erreur de chargement initial');
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
    
    const imageSource = getRecipeImage(item);
    
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9}
        onPress={() => setRecipes(prev => prev.map(r => r === item ? { ...r, _expanded: !r._expanded } : r))}
      >
        <View style={styles.cardImageWrap}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cardImage, { backgroundColor: colors.surfaceLight }]} />
          )}
          <View style={styles.cardOverlay}>
            <Text style={styles.cardTitleOverlay} numberOfLines={2}>{title}</Text>
          </View>
        </View>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardSub}>{ingredients.length} ingrédient(s)</Text>
        </View>
        {item._expanded && (
          <View style={{ marginTop: 8 }}>
            {ingredients.length === 0 ? (
              <Text style={styles.cardSub}>Ingrédients indisponibles.</Text>
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

      <View style={{ marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {CATEGORY_FILTERS.map((cat) => {
            const categoryImage = getCategoryImageSource(cat.imageKey);
            const chipDims = categoryImage ? getImageDpSize(categoryImage, 40, 40) : { width: 40, height: 40 };
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, selectedCategory === cat.key && styles.chipActive]}
                onPress={() => handleSelectCategory(cat)}
                activeOpacity={0.7}
              >
                {categoryImage && (
                  <Image source={categoryImage} style={[styles.chipImage, { width: chipDims.width, height: chipDims.height }]} resizeMode="cover" />
                )}
                <Text style={[styles.chipText, selectedCategory === cat.key && styles.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading && (
        <View style={styles.center}> 
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={recipes}
            keyExtractor={(item, index) => String(item.id || item.uri || index)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.empty}>
                  {selectedCategory 
                    ? `Aucune recette trouvée pour "${CATEGORY_FILTERS.find(c => c.key === selectedCategory)?.label || selectedCategory}". Essaie une autre catégorie 🍲`
                    : 'Aucune recette trouvée. Essaie un autre mot-clé ou sélectionne une catégorie 🍲'
                  }
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, height: 40, backgroundColor: colors.white },
  center: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  error: { color: colors.danger, marginBottom: 8, textAlign: 'center' },
  list: { gap: 8, paddingBottom: 20 },
  emptyContainer: { padding: 20, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', color: colors.textSecondary, fontSize: 14 },
  card: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, elevation: 2 },
  cardImageWrap: { borderRadius: 12, overflow: 'hidden', marginBottom: 8 },
  cardImage: { width: '100%', height: 220, backgroundColor: '#eee' },
  cardOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.35)' },
  cardTitleOverlay: { color: colors.white, fontSize: 20, fontWeight: '700' },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardSub: { color: colors.textSecondary, marginTop: 4, fontSize: 12 },
  ingredientItem: { color: colors.textPrimary, marginTop: 2, fontSize: 16, lineHeight: 22 },
  categoriesRow: { paddingHorizontal: 4, gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceLight, marginRight: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textPrimary, fontWeight: '500' },
  chipTextActive: { color: colors.white },
  chipImage: { width: 40, height: 40, borderRadius: 20 },
});

export default RecipesScreen;
