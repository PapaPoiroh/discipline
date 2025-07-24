import { useState, useEffect } from 'react';
import { User } from '../types';
import { signIn, signOut, signUp, getCurrentUser } from '../../authService';
import { supabase } from '../../supabaseClient'; // vérifie ce chemin

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
}

// Fonction pour récupérer les détails du user depuis la table "users"
const fetchUserDetails = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users') // nom de ta table
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return null;
  return data as User;
};

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getCurrentUser().then(async ({ data }) => {
      const supabaseUser = data?.user;
      if (supabaseUser) {
        const fullUser = await fetchUserDetails(supabaseUser.email);
        setUser(fullUser);
        setIsAuthenticated(!!fullUser);
      }
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedUser = await signIn(email, password);
      if (!loggedUser) return false;

      const fullUser = await fetchUserDetails(email);
      if (fullUser) {
        setUser(fullUser);
        setIsAuthenticated(true);
        return true;
      }

      return false;
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
      const newUser = await signUp(userData.email, userData.password);

      if (newUser) {
        // Tu peux aussi ici ajouter les infos personnalisées dans ta table `users`
        await supabase.from('users').insert([
          {
            ...userData,
            createdAt: new Date(),
          }
        ]);

        const fullUser = await fetchUserDetails(userData.email);
        setUser(fullUser);
        setIsAuthenticated(true);
        return true;
      }

      return false;
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
