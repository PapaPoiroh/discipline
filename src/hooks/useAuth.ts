import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUser = async () => {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.user.id)
      .single();

    if (error || !data) {
      setUser(null);
      setIsAuthenticated(false);
    } else {
      setUser(data);
      setIsAuthenticated(true);
    }
  };

  fetchUser();
}, []);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        fetchUser();
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

