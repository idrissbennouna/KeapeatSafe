import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

// Écrans d'authentification
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  // Certaines versions/environnements peuvent ne pas exposer TransitionPresets.
  // On applique le preset iOS uniquement s'il est disponible pour éviter un crash au chargement.
  const slidePreset = TransitionPresets?.SlideFromRightIOS || {};
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' },
        // Transition douce entre Login et Register (slide from right) si disponible
        ...slidePreset,
        // Optionnel: style de carte pour un léger fondu
        // animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
