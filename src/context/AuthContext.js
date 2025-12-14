import React, { createContext, useState, useEffect, useCallback } from 'react';
import { saveUserData, getUserData, clearUserData } from '../services/database/userDataDB';
import { verifyLogin, hashPassword, requestPasswordReset as apiRequestPasswordReset, resetPassword as apiResetPassword } from '../services/api/authAPI';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultPreferences = { diet: '', favoriteCategories: [], allergies: [], activity: '', weightKg: 0, heightCm: 0, ageYears: 0, gender: '', onboardingComplete: false };

  const login = useCallback(async (email, password, preferences = {}) => {
    setIsLoading(true);
    try {
      const verified = await verifyLogin(email, password);
      const prefs = { ...defaultPreferences, ...(verified?.preferences || {}), ...(preferences || {}) };
      if (typeof prefs.onboardingComplete === 'undefined') {
        prefs.onboardingComplete = true;
      }
      const newUser = { ...verified, preferences: prefs };
      setUser(newUser);
      await saveUserData(newUser).catch(() => {});
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, preferences = {}) => {
    setIsLoading(true);
    const n = String(name || '').trim();
    const e = String(email || '').trim();
    const p = String(password || '');
    if (!n || !e || !p || p.length < 6) {
      setIsLoading(false);
      throw new Error("Informations d’inscription invalides");
    }
    const h = await hashPassword(p);
    const newUser = { name: n, email: e, passwordHash: h, preferences: { ...defaultPreferences, ...(preferences || {}) } };
    setUser(newUser);
    await saveUserData(newUser).catch(() => {});
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await clearUserData().catch(() => {});
  }, []);

  useEffect(() => {
    getUserData()
      .then((u) => {
        if (u) {
          const normalized = { ...u, preferences: { ...defaultPreferences, ...(u.preferences || {}) } };
          if (typeof normalized.preferences.onboardingComplete === 'undefined') {
            normalized.preferences.onboardingComplete = true;
          }
          setUser(normalized);
        }
      })
      .catch(() => {});
  }, []);

  const updatePreferences = useCallback(async (prefs = {}) => {
    setUser((prev) => {
      const next = { ...(prev || {}), preferences: { ...defaultPreferences, ...(prev?.preferences || {}), ...(prefs || {}) } };
      saveUserData(next).catch(() => {});
      return next;
    });
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    const code = await apiRequestPasswordReset(email);
    return code;
  }, []);

  const resetPassword = useCallback(async (email, token, newPassword) => {
    const ok = await apiResetPassword(email, token, newPassword);
    if (ok) {
      const u = await getUserData().catch(() => null);
      if (u) setUser(u);
    }
    return ok;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updatePreferences, requestPasswordReset, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
