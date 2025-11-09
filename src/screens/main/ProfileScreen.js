import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      <Text style={globalStyles.title}>Profil utilisateur 👤</Text>

      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Informations</Text>
        <Text style={globalStyles.text}>Nom: {user?.name || 'Invité'}</Text>
        <Text style={globalStyles.text}>Email: {user?.email || '—'}</Text>
      </View>

      <View style={[globalStyles.card, { marginTop: 12 }]}> 
        <Text style={globalStyles.subtitle}>Objectifs quotidiens</Text>
        <Text style={globalStyles.text}>Calories: {Number(dailyCalories) || 0} kcal</Text>
        <Text style={globalStyles.text}>Protéines: {macros?.protein || 0} g</Text>
        <Text style={globalStyles.text}>Glucides: {macros?.carbs || 0} g</Text>
        <Text style={globalStyles.text}>Lipides: {macros?.fat || 0} g</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Button title={isLoading ? '...' : 'Se déconnecter'} onPress={logout} style={{ backgroundColor: colors.danger }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProfileScreen;