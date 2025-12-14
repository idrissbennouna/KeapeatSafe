import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { NutritionContext } from '../../context/NutritionContext';
import Button from '../../components/common/Button';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';

const ProfileScreen = () => {
  const { user, logout, isLoading } = useContext(AuthContext);
  const { dailyCalories, macros } = useContext(NutritionContext);

  return (
    <View style={[globalStyles.container]}>
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Profil utilisateur</Text>
            <Text style={styles.heroSub}>{user?.name || 'Invité'}</Text>
            <Text style={styles.heroEmail}>{user?.email || '—'}</Text>
          </View>
        </View>
      </View>

      <View style={[globalStyles.card, styles.section]}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoRow}>
          <Ionicons name="id-card" size={20} color={colors.primary} />
          <Text style={styles.infoLabel}>Nom</Text>
          <Text style={styles.infoValue}>{user?.name || 'Invité'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={colors.primary} />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email || '—'}</Text>
        </View>
      </View>

      <View style={[globalStyles.card, styles.section]}>
        <Text style={styles.sectionTitle}>Objectifs quotidiens</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statChip, { backgroundColor: colors.surfaceLight }]}> 
            <Ionicons name="flame" size={18} color={colors.primary} />
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{Number(dailyCalories) || 0} kcal</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: colors.surfaceLight }]}> 
            <Ionicons name="fitness" size={18} color={colors.accent} />
            <Text style={styles.statLabel}>Protéines</Text>
            <Text style={styles.statValue}>{macros?.protein || 0} g</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: colors.surfaceLight }]}> 
            <Ionicons name="leaf" size={18} color={colors.secondary} />
            <Text style={styles.statLabel}>Glucides</Text>
            <Text style={styles.statValue}>{macros?.carbs || 0} g</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: colors.surfaceLight }]}> 
            <Ionicons name="egg" size={18} color={colors.warning} />
            <Text style={styles.statLabel}>Lipides</Text>
            <Text style={styles.statValue}>{macros?.fat || 0} g</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title={isLoading ? '...' : 'Se déconnecter'} onPress={logout} style={styles.logoutBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.primary, borderRadius: 16, padding: 16, marginBottom: 16 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: colors.white, fontSize: 18, fontWeight: '700' },
  heroSub: { color: colors.white, fontSize: 16, fontWeight: '600', marginTop: 2 },
  heroEmail: { color: colors.white, opacity: 0.9 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoLabel: { color: colors.textSecondary, fontWeight: '600', width: 80 },
  infoValue: { color: colors.textPrimary, fontWeight: '600', flex: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  statLabel: { color: colors.textSecondary, fontWeight: '600' },
  statValue: { color: colors.textPrimary, fontWeight: '700' },
  footer: { marginTop: 12 },
  logoutBtn: { backgroundColor: colors.danger, borderRadius: 12 },
});

export default ProfileScreen;
