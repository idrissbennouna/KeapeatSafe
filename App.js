import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Import du navigateur principal
import AppNavigator from './src/navigation/AppNavigator';

// Import des contexts
import { AuthProvider } from './src/context/AuthContext';
import { NutritionProvider } from './src/context/NutritionContext';
import { PlanningProvider } from './src/context/PlanningContext';

export default function App() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "welcome to your Nutrition app 💪🥗";
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        clearInterval(interval);
        // Masquer le message après l'animation
        setTimeout(() => setShowWelcome(false), 1000);
      }
    }, 80); // Vitesse d'animation
    return () => clearInterval(interval);
  }, []);

  // Afficher le message de bienvenue temporairement
  if (showWelcome) {
    return (
      <View style={styles.container}>
        <Text style={styles.animatedText}>{displayedText}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Structure principale de l'application avec les providers
  return (
    <AuthProvider>
      <NutritionProvider>
        <PlanningProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </PlanningProvider>
      </NutritionProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Cochin', // Vous pouvez changer la police selon vos préférences
  },
});
