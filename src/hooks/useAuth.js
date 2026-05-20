import { useState, useEffect, useContext, createContext } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser || storedUser === 'undefined') return null;
    try {
      return JSON.parse(storedUser);
    } catch { return null; }
  };

  const [user, setUser] = useState(getUserFromStorage());
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getUserFromStorage());

  // Listen to storage events (for manual reloads from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = getUserFromStorage();
      setUser(storedUser);
      setIsAuthenticated(!!storedUser);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen to custom 'userLoggedIn' event (for same‑tab login)
  useEffect(() => {
    const handleCustomLogin = () => {
      const storedUser = getUserFromStorage();
      setUser(storedUser);
      setIsAuthenticated(!!storedUser);
    };
    window.addEventListener('userLoggedIn', handleCustomLogin);
    return () => window.removeEventListener('userLoggedIn', handleCustomLogin);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('userLoggedOut')); // optional
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = () => {
    const storedUser = getUserFromStorage();
    setUser(storedUser);
    setIsAuthenticated(!!storedUser);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};