import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import { NutritionContext } from '../../context/NutritionContext';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { dailyCalories, macros } = useContext(NutritionContext) || {};

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={styles.appName}>KeapeatSafe</Text>
            <Text style={styles.appTag}>Nutrition & Recettes</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Tableau de bord</Text>
        <Text style={styles.heroSubtitle}>Bienvenue 👋</Text>
      </View>

      <View style={[globalStyles.card, styles.cardOverlay]}> 
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{Number(dailyCalories) || 0} kcal</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Prot</Text>
            <Text style={styles.statValue}>{macros?.protein || 0} g</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Gluc</Text>
            <Text style={styles.statValue}>{macros?.carbs || 0} g</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Lip</Text>
            <Text style={styles.statValue}>{macros?.fat || 0} g</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={globalStyles.subtitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={() => navigation.navigate('Recipes')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}><Ionicons name="restaurant" size={28} color={colors.white} /></View>
            <Text style={styles.actionTitle}>Recettes</Text>
            <Text style={styles.actionText}>Découvrir et chercher</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={() => navigation.navigate('Planning')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accent }]}><Ionicons name="calendar" size={28} color={colors.white} /></View>
            <Text style={styles.actionTitle}>Planning</Text>
            <Text style={styles.actionText}>Voir tes repas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}><Ionicons name="person" size={28} color={colors.white} /></View>
            <Text style={styles.actionTitle}>Profil</Text>
            <Text style={styles.actionText}>Tes infos et objectifs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundLight },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48, borderRadius: 12, marginRight: 8 },
  appName: { color: colors.white, fontSize: 18, fontWeight: '700' },
  appTag: { color: colors.white, opacity: 0.85 },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: '700', marginTop: 12 },
  heroSubtitle: { color: colors.white, opacity: 0.9, marginTop: 4 },
  cardOverlay: { marginHorizontal: 16, marginTop: -20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { color: colors.textSecondary },
  statValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  actionsSection: { paddingHorizontal: 16, marginTop: 16 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: colors.surfaceLight,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  actionText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
});

export default DashboardScreen;
