import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const Stack = createStackNavigator();

const AppNavigator = () => {
  // Récupération de l'état d'authentification depuis le contexte
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
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