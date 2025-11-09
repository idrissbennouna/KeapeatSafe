import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { PlanningContext } from '../../context/PlanningContext';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const PlanningScreen = () => {
  const { mealPlan, selectedDay, setSelectedDay, loadMealPlan, resetPlanning } = useContext(PlanningContext);

  const meals = Array.isArray(mealPlan?.[selectedDay]) ? mealPlan[selectedDay] : [];

  return (
    <View style={[globalStyles.container]}>
      <Text style={globalStyles.title}>Planning alimentaire</Text>

      {/* Sélecteur de jour */}
      <View style={styles.daysRow}>
        {DAYS.map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setSelectedDay(d)}
            style={[styles.dayChip, selectedDay === d && styles.dayChipActive]}
          >
            <Text style={[styles.dayText, selectedDay === d && styles.dayTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des repas du jour */}
      <FlatList
        data={meals}
        keyExtractor={(item) => String(item.id || item.type)}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={globalStyles.subtitle}>{item.title || item.type}</Text>
            <Text style={globalStyles.text}>{item.calories ? `${item.calories} kcal` : 'Calories inconnues'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun repas planifié pour ce jour.</Text>}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={loadMealPlan} style={globalStyles.button}>
          <Text style={globalStyles.buttonText}>Recharger</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetPlanning} style={[globalStyles.button, { backgroundColor: colors.warning }]}> 
          <Text style={globalStyles.buttonText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: { color: colors.textPrimary, fontWeight: '500' },
  dayTextActive: { color: colors.white },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 12 },
});

export default PlanningScreen;