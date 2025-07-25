import { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../supabaseClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as unknown as User);
        setIsAuthenticated(true);
      }
    });
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as unknown as User);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
    setUser(data.user as unknown as User);
    setIsAuthenticated(true);
    return true;
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) return false;
    setUser(data.user as unknown as User);
    setIsAuthenticated(true);
    return true;
  };

  return { user, isAuthenticated, login, logout, register };
};
