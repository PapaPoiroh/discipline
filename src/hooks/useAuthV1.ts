import { useState, useEffect } from 'react';
import { User } from '../types';
// import { useLocalStorage } from './useLocalStorage'; // supprimé
import { signIn, signOut, signUp, getCurrentUser, } from '../../authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id' | 'created_at'>) => Promise<boolean>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getCurrentUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setIsAuthenticated(!!data?.user);
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedUser = await signIn(email, password);
      setUser(loggedUser);
      setIsAuthenticated(!!loggedUser);
      return true;
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: Omit<User, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const newUser = await signUp(userData.email, userData.password);
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register
  };
};
