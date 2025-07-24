import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Mail, Shield, Eye, PenTool, Gavel } from 'lucide-react';
import { User } from '../types';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onUserCreate: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  onUserUpdate: (userId: string, userData: Partial<User>) => void;
  onUserDelete: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  currentUser, 
  onUserCreate, 
  onUserUpdate, 
  onUserDelete 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'educator' as User['role'],
    customRole: '',
    permissions: {
      canView: true,
      canCreate: false,
      canSanction: false,
      canAccessSettings: false
    }
  });

  const functionLabels = {
    admin: 'Administrateur',
    principal: 'Chef d\'établissement',
    educator: 'Éducateur de vie scolaire',
    teacher: 'Professeur',
    other: 'Autre'
  };

  const defaultPermissions = {
    admin: { canView: true, canCreate: true, canSanction: true, canAccessSettings: true },
    principal: { canView: true, canCreate: true, canSanction: true, canAccessSettings: false },
    educator: { canView: true, canCreate: true, canSanction: false, canAccessSettings: false },
    teacher: { canView: true, canCreate: true, canSanction: false, canAccessSettings: false },
    other: { canView: true, canCreate: false, canSanction: false, canAccessSettings: false }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      ...formData,
      customRole: formData.role === 'other' ? formData.customRole : undefined
    };

    if (editingUser) {
      onUserUpdate(editingUser.id, userData);
    } else {
      onUserCreate(userData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'educator',
      customRole: '',
      permissions: {
        canView: true,
        canCreate: false,
        canSanction: false,
        canAccessSettings: false
      }
    });
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      customRole: user.customRole || '',
      permissions: user.permissions
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleRoleChange = (role: User['role']) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: role !== 'other' ? defaultPermissions[role] : prev.permissions
    }));
  };

  const handlePermissionChange = (permission: keyof User['permissions'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [permission]: value }
    }));
  };

  const sendInvitation = (user: User) => {
    const subject = 'Invitation - Application de gestion disciplinaire';
    const body = `Bonjour ${user.firstName} ${user.lastName},

Vous avez été invité(e) à rejoindre l'application de gestion disciplinaire de notre établissement.

Votre fonction : ${user.customRole || functionLabels[user.role]}
Email de connexion : ${user.email}

Cordialement,
${currentUser.firstName} ${currentUser.lastName}`;

    const mailtoLink = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Inviter un utilisateur</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingUser ? 'Modifier l\'utilisateur' : 'Inviter un nouvel utilisateur'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonction
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value as User['role'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="educator">Éducateur de vie scolaire</option>
                <option value="teacher">Professeur</option>
                <option value="principal">Chef d'établissement</option>
                <option value="admin">Administrateur</option>
                <option value="other">Autre</option>
              </select>
            </div>

            {formData.role === 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonction personnalisée
                </label>
                <input
                  type="text"
                  value={formData.customRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, customRole: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Précisez la fonction"
                />
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3">Permissions :</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canView}
                    onChange={(e) => handlePermissionChange('canView', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Eye className="h-4 w-4" />
                  <span>Consulter les incidents</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canCreate}
                    onChange={(e) => handlePermissionChange('canCreate', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                    <PenTool className="h-4 w-4" />
                    <span>Créer des incidents</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canSanction}
                    onChange={(e) => handlePermissionChange('canSanction', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                    <Gavel className="h-4 w-4" />
                    <span>Appliquer des sanctions</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canAccessSettings}
                    onChange={(e) => handlePermissionChange('canAccessSettings', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                    <Shield className="h-4 w-4" />
                    <span>Accéder aux paramètres</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Modifier' : 'Inviter'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {user.customRole || functionLabels[user.role]}
                </span>
                {user.id === currentUser.id && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Vous
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                {user.permissions.canView && <span>👁️ Consultation</span>}
                {user.permissions.canCreate && <span>✏️ Création</span>}
                {user.permissions.canSanction && <span>⚖️ Sanctions</span>}
                {user.permissions.canAccessSettings && <span>⚙️ Paramètres</span>}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => sendInvitation(user)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Envoyer invitation"
              >
                <Mail className="h-4 w-4" />
              </button>
              {user.id !== currentUser.id && (
                <>
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                        onUserDelete(user.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;