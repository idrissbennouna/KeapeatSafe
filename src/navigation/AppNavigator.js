import React, { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import des écrans d'onboarding
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import GoalsScreen from '../screens/onboarding/GoalsScreen';

// Import des écrans d'authentification
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Import des navigateurs
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';

// Import du contexte d'authentification
import { AuthContext } from '../context/AuthContext';
import { lightTheme, darkTheme } from '../styles/themes';
import colors from '../styles/colors';

const Stack = createStackNavigator();

const AppNavigator = () => {
  // Récupération de l'état d'authentification depuis le contexte
  const { user } = useContext(AuthContext);
  const scheme = useColorScheme();

  // Adapter notre thème custom au thème attendu par React Navigation
  const baseTheme = scheme === 'dark' ? darkTheme : lightTheme;
  const navBase = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    // Conserver les propriétés attendues par React Navigation (fonts, animation, etc.)
    ...navBase,
    colors: {
      ...navBase.colors,
      primary: colors.primary,
      background: baseTheme.background,
      card: baseTheme.card?.background || baseTheme.surface,
      text: baseTheme.text,
      border: baseTheme.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: baseTheme.background },
        }}
      >
        {!user ? (
          // Utilisateur non connecté - affichage de l'authentification
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // Utilisateur connecté - affichage de l'application principale
          <Stack.Screen name="AppTabs" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;