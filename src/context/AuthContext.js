import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    const e = String(email || '').trim();
    const p = String(password || '');
    if (!e || !p || p.length < 6) {
      setIsLoading(false);
      throw new Error('Identifiants invalides');
    }
    // Simule un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email: e, name: e.split('@')[0] || 'Utilisateur' });
    setIsLoading(false);
    return true;
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    const n = String(name || '').trim();
    const e = String(email || '').trim();
    const p = String(password || '');
    if (!n || !e || !p || p.length < 6) {
      setIsLoading(false);
      throw new Error("Informations d’inscription invalides");
    }
    // Simule un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ name: n, email: e });
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};