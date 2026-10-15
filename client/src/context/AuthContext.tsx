import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser } from '../types';
import { api, getStoredToken, getStoredUser, removeStoredToken } from '../services/api';

interface AuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  adminUser: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          const user = await api.getAdminProfile();
          setAdminUser(user);
          setIsAuthenticated(true);
        } catch (e) {
          console.warn('Session expired or invalid:', e);
          removeStoredToken();
          setAdminUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setAdminUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.adminLogin(email, password);
    setAdminUser(res.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeStoredToken();
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
