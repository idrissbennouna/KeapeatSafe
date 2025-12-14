import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { NutritionContext } from '../../context/NutritionContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import colors from '../../styles/colors';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register, isLoading } = useContext(AuthContext);
  const { updateNutritionData, dailyCalories, macros, bmi } = useContext(NutritionContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activity, setActivity] = useState('');
  const genders = ['homme', 'femme'];
  const activities = ['sédentaire', 'léger', 'modéré', 'actif', 'très_actif'];

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password || !confirm) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const prefs = {
        activity: String(activity || '').trim(),
        weightKg: Number(weight) || 0,
        heightCm: Number(height) || 0,
        ageYears: Number(age) || 0,
        gender: String(gender || '').trim(),
        favoriteCategories: [],
        onboardingComplete: false,
      };
      await register(name, email, password, prefs);
      const g = prefs.gender || '';
      const a = prefs.activity || '';
      await updateNutritionData(Number(weight) || 0, Number(height) || 0, Number(age) || 0, g, a);
      
    } catch (e) {
      setError(e.message || "Échec de l’inscription");
    }
  };

  const handlePreview = async () => {
    setError('');
    try {
      const g = String(gender || '').trim();
      const a = String(activity || '').trim();
      await updateNutritionData(Number(weight) || 0, Number(height) || 0, Number(age) || 0, g, a);
    } catch (e) {
      setError(e.message || 'Échec du calcul');
    }
  };

  const canSubmit = Boolean(
    name && email && password && confirm && password === confirm && weight && height && age && gender && activity
  );

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>
        <View style={styles.form}>
        <Input label="Nom complet" placeholder="Jean Dupont" value={name} onChangeText={setName} />
        <Input label="Email" placeholder="exemple@mail.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Mot de passe" placeholder="••••••" value={password} onChangeText={setPassword} secureTextEntry />
        <Input label="Confirmer" placeholder="••••••" value={confirm} onChangeText={setConfirm} secureTextEntry />
        <Input label="Poids (kg)" placeholder="70" value={weight} onChangeText={setWeight} keyboardType="numeric" />
        <Input label="Taille (cm)" placeholder="175" value={height} onChangeText={setHeight} keyboardType="numeric" />
        <Input label="Âge (années)" placeholder="30" value={age} onChangeText={setAge} keyboardType="numeric" />
        <Text style={styles.sectionLabel}>Genre</Text>
        <View style={styles.rowWrap}>
          {genders.map((g) => (
            <TouchableOpacity key={g} style={[styles.chip, gender === g && styles.chipActive]} onPress={() => setGender(g)}>
              <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionLabel}>Activité</Text>
        <View style={styles.rowWrap}>
          {activities.map((opt) => (
            <TouchableOpacity key={opt} style={[styles.chip, activity === opt && styles.chipActive]} onPress={() => setActivity(opt)}>
              <Text style={[styles.chipText, activity === opt && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actionsRow}>
          <Button title="Prévisualiser objectifs" onPress={handlePreview} />
        </View>
        <View style={styles.previewBox}>
          <Text style={styles.previewText}>{dailyCalories ? `${dailyCalories} kcal/jour` : ''}</Text>
          <Text style={styles.previewText}>{macros ? `Prot ${macros.protein || 0}g • Gluc ${macros.carbs || 0}g • Lip ${macros.fat || 0}g` : ''}</Text>
          <Text style={styles.previewText}>{bmi?.value ? `IMC ${bmi.value} (${bmi?.interpretation || ''})` : ''}</Text>
        </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Valider l’inscription" onPress={handleRegister} disabled={!canSubmit} loading={isLoading} style={styles.ctaBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundLight },
  scroll: { flex: 1, backgroundColor: colors.backgroundLight },
  container: { padding: 16, paddingBottom: 96, backgroundColor: colors.backgroundLight },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 12, color: colors.textPrimary },
  form: { gap: 12 },
  error: { color: '#d32f2f', marginBottom: 8 },
  link: { marginTop: 16, textAlign: 'center', color: '#1976d2', fontWeight: '500' },
  sectionLabel: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceLight },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textPrimary, fontWeight: '500' },
  chipTextActive: { color: colors.white },
  actionsRow: { marginTop: 4 },
  previewBox: { paddingVertical: 8, gap: 4 },
  previewText: { textAlign: 'center', color: colors.textSecondary },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.backgroundLight, padding: 12 },
  ctaBtn: { width: '100%' },
});

export default RegisterScreen;
