import { createContext, useContext } from 'react';
import { User } from '@/types'; // Assure-toi que l'interface User est bien importée

// 🔐 Utilisateur "mocké" — ADMIN
const mockUser: User = {
  id: '1',
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

// Simule le contexte d'authentification
const AuthContext = createContext({
  currentUser: mockUser, // ✅ valeur par défaut = user en dur
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {}
});

export const useAuth = () => useContext(AuthContext);