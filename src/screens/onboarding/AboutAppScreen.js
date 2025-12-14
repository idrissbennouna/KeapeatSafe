import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import colors from '../../styles/colors';
import { AuthContext } from '../../context/AuthContext';

const Feature = ({ icon, title, text, color }) => (
  <View style={styles.feature}>
    <View style={[styles.featureIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={22} color={colors.white} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  </View>
);

const AboutAppScreen = () => {
  const navigation = useNavigation();
  const { updatePreferences } = useContext(AuthContext);

  const handleEnterApp = async () => {
    await updatePreferences({ onboardingComplete: true });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="nutrition" size={24} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>À propos de KeapeatSafe</Text>
        <Text style={styles.heroSub}>Nutrition intelligente, recettes inspirantes, objectifs atteignables</Text>
      </View>

      <View style={styles.content}>
        <Feature icon="flame" title="Calories & Macros" text="Calculs personnalisés selon ton profil et activité." color={colors.primary} />
        <Feature icon="restaurant" title="Recettes de qualité" text="Par catégories, images claires et mode carte large." color={colors.accent} />
        <Feature icon="calendar" title="Planning malin" text="Plan hebdo simple avec rechargement et réinitialisation." color={colors.secondary} />
        <Feature icon="shield-checkmark" title="Ton suivi" text="Objectifs visuels et cartes stylées sur le tableau de bord." color={colors.warning} />

        <View style={{ marginTop: 18 }}>
          <Button title="Accéder à l’app" onPress={handleEnterApp} />
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
    paddingTop: 40,
    paddingBottom: 36,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  heroBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: '800' },
  heroSub: { color: colors.white, opacity: 0.9, marginTop: 6, textAlign: 'center' },
  content: { padding: 16 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceLight, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  featureIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  featureText: { color: colors.textSecondary, marginTop: 2 },
});

export default AboutAppScreen;
