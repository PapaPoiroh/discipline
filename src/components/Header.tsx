import React from 'react';
import { GraduationCap, Users, FileText, Settings, BarChart3, UserCheck, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentView: 'dashboard' | 'incidents' | 'students' | 'reports' | 'settings' | 'users';
  onViewChange: (view: 'dashboard' | 'incidents' | 'students' | 'reports' | 'settings' | 'users') => void;
  schoolLogo?: string;
  schoolName?: string;
  currentUser: User;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, schoolLogo, schoolName, currentUser }) => {
  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'incidents', label: 'Incidents', icon: GraduationCap },
    { id: 'students', label: 'Élèves', icon: Users },
    { id: 'reports', label: 'Rapports', icon: FileText },
    ...(currentUser.permissions.canAccessSettings ? [
      { id: 'settings', label: 'Paramètres', icon: Settings },
      { id: 'users', label: 'Utilisateurs', icon: UserCheck }
    ] : [])
  ].filter(Boolean);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" style={{ 
      background: 'linear-gradient(90deg, #1569ae 0%, #e3177c 25%, #92c024 50%, #fbbc23 75%, #1569ae 100%)',
      backgroundSize: '400% 100%'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            {schoolLogo ? (
              <img src={schoolLogo} alt="Logo" className="h-12 w-12 object-contain" />
            ) : (
              <GraduationCap className="h-8 w-8 text-white" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">Gestion Disciplinaire</h1>
              {schoolName && <p className="text-sm text-white opacity-90">{schoolName}</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === id
                      ? 'bg-white bg-opacity-20 text-white font-medium'
                      : 'text-white opacity-80 hover:opacity-100 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            
            <div className="flex items-center space-x-3 text-white">
              <div className="text-right">
                <p className="text-sm font-medium">{currentuser.first_Name} {currentuser.last_Name}</p>
                <p className="text-xs opacity-80">{
                  currentUser.role === 'admin' ? 'Administrateur' :
                  currentUser.role === 'principal' ? 'Chef d\'établissement' :
                  currentUser.role === 'educator' ? 'Éducateur' : 'Professeur'
                }</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;