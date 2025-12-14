import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import colors from '../../styles/colors';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.sub}>Welcome to your nutrition app</Text>
      <View style={{ marginTop: 16, width: '80%' }}>
        <Button title="Découvrir l’app" onPress={() => navigation.navigate('OnboardingAbout')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLight },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  sub: { marginTop: 8, color: colors.textSecondary },
});

export default WelcomeScreen;
