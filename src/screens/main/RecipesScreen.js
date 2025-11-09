import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import { fetchRecipes } from '../../services/api/recipesAPI';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const RecipesScreen = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const q = String(query || '').trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchRecipes(q);
      setRecipes(Array.isArray(list) ? list : []);
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
    } catch (e) {
      setError(e?.message || 'Erreur de récupération des recettes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger une recherche par défaut pour afficher des résultats immédiatement
  useEffect(() => {
    const defaultQuery = 'chicken';
    setQuery(defaultQuery);
    handleSearchQuery(defaultQuery);
  }, [handleSearchQuery]);

  const renderItem = ({ item }) => {
    const title = item.title || item.name || 'Recette';
    const ingredients = item.ingredients || item.ingredientLines || [];
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{ingredients.length} ingrédient(s)</Text>
      </View>
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

      {loading && (
        <View style={styles.center}> 
          <ActivityIndicator size="small" />
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={recipes}
          keyExtractor={(item, index) => String(item.id || item.uri || item.title || index)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Aucune recette trouvée. Essaie un autre mot-clé 🍲</Text>}
        />
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
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { color: colors.textSecondary, marginTop: 4 },
});

export default RecipesScreen;