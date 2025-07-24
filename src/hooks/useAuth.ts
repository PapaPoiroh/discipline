import { useState, useEffect } from 'react';
import { User } from '../types';
import { signIn, signOut, signUp, getFullUser } from '../../authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getFullUser().then((fullUser) => {
      setUser(fullUser);
      setIsAuthenticated(!!fullUser);
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signIn(email, password);
      const fullUser = await getFullUser();
      setUser(fullUser);
      setIsAuthenticated(!!fullUser);
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

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      await signUp(userData.email, userData.password);
      const fullUser = await getFullUser();
      setUser(fullUser);
      setIsAuthenticated(!!fullUser);
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
    register,
  };
};
