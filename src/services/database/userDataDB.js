// User Data DB utilities (AsyncStorage)
// But: stocker les données utilisateur localement (profil, objectifs, préférences)

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'USER_DATA';
const USERS_KEY = 'USERS_DB';
const CURRENT_KEY = 'CURRENT_USER_EMAIL';

const loadUsers = async () => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  let map = raw ? JSON.parse(raw) : {};
  if (!map || typeof map !== 'object') map = {};
  const oldRaw = await AsyncStorage.getItem(USER_KEY);
  if (oldRaw) {
    try {
      const old = JSON.parse(oldRaw);
      const e = String(old?.email || '').trim().toLowerCase();
      if (e && !map[e]) {
        map[e] = old;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(map));
      }
    } catch {}
  }
  return map;
};

const saveUsers = async (map) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(map || {}));
};

export const saveUserData = async (user) => {
  if (!user || typeof user !== 'object') throw new Error('Données utilisateur invalides');
  const email = String(user.email || '').trim().toLowerCase();
  if (!email) throw new Error('Email manquant');
  const map = await loadUsers();
  map[email] = user;
  await saveUsers(map);
  await AsyncStorage.setItem(CURRENT_KEY, email);
  return true;
};

export const getUserData = async () => {
  const current = await AsyncStorage.getItem(CURRENT_KEY);
  const map = await loadUsers();
  const email = String(current || '').trim().toLowerCase();
  if (email && map[email]) return map[email];
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearUserData = async () => {
  await AsyncStorage.removeItem(CURRENT_KEY);
  return true;
};

export const getUserByEmail = async (email) => {
  const e = String(email || '').trim().toLowerCase();
  if (!e) return null;
  const map = await loadUsers();
  if (map[e]) return map[e];
  const u = await getUserData();
  if (u && String(u.email || '').trim().toLowerCase() === e) return u;
  return null;
};

export const updateUserPassword = async (email, passwordHash) => {
  const e = String(email || '').trim().toLowerCase();
  const map = await loadUsers();
  const u = map[e] || null;
  if (!u) throw new Error('Utilisateur introuvable');
  map[e] = { ...u, passwordHash };
  await saveUsers(map);
  const current = await AsyncStorage.getItem(CURRENT_KEY);
  if (String(current || '').trim().toLowerCase() === e) {
    await AsyncStorage.setItem(CURRENT_KEY, e);
  }
  return true;
};

export const saveResetToken = async (email, token) => {
  const key = `RESET_CODE:${String(email || '').trim().toLowerCase()}`;
  await AsyncStorage.setItem(key, String(token));
  return true;
};

export const getResetToken = async (email) => {
  const key = `RESET_CODE:${String(email || '').trim().toLowerCase()}`;
  const val = await AsyncStorage.getItem(key);
  return val || null;
};

export const clearResetToken = async (email) => {
  const key = `RESET_CODE:${String(email || '').trim().toLowerCase()}`;
  await AsyncStorage.removeItem(key);
  return true;
};

export default {
  saveUserData,
  getUserData,
  clearUserData,
  getUserByEmail,
  updateUserPassword,
  saveResetToken,
  getResetToken,
  clearResetToken,
};
