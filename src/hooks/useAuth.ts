// src/hooks/useAuth.ts
import { createContext, useContext } from 'react';
import { User } from '@/types'; // Vérifie que ce chemin correspond à ton projet

// ✅ Utilisateur mocké (admin)
const mockUser: User = {
  id: '00000000-0000-0000-0000-000000000001',
  first_Name: 'Admin',
  last_Name: 'Test',
  email: 'admin@test.com',
  role: 'admin',
  customRole: 'SuperAdmin',
  permissions: {
    canView: true,
    canCreate: true,
    canSanction: true,
    canAccessSettings: true,
    admin: true
  },
  createdAt: new Date(),
  lastLogin: new Date()
};

const AuthContext = createContext<{
  currentUser: User | null;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
}>({
  currentUser: mockUser,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);
