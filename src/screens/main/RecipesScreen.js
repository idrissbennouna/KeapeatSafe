import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecipesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Voici les recettes 🍲</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  text: { fontSize: 20, fontWeight: '600', textAlign: 'center' },
});

export default RecipesScreen;