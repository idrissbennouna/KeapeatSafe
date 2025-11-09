// User Data DB utilities (AsyncStorage)
// But: stocker les données utilisateur localement (profil, objectifs, préférences)

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'USER_DATA';

export const saveUserData = async (user) => {
  if (!user || typeof user !== 'object') throw new Error('Données utilisateur invalides');
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  return true;
};

export const getUserData = async () => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearUserData = async () => {
  await AsyncStorage.removeItem(USER_KEY);
  return true;
};

export default {
  saveUserData,
  getUserData,
  clearUserData,
};