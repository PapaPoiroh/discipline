import React from 'react';
import { AlertTriangle, Clock, CheckCircle, TrendingUp, Users, Calendar } from 'lucide-react';
import { Incident, Student, User } from '../types';

interface DashboardProps {
  incidents: Incident[];
  students: Student[];
  users: User[];
  currentUser: User;
  onIncidentClick: (incident: Incident) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ incidents, students, users, currentUser, onIncidentClick }) => {
  const inProgressIncidents = incidents.filter(i => i.status === 'in_progress');
  
  // Trier par gravité (high > medium > low) puis par date (plus ancien en premier)
  const prioritizedIncidents = inProgressIncidents.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const getStudentNames = (studentIds: string[]) => {
    return studentIds.map(id => {
      const student = students.find(s => s.id === id);
      return student ? `${student.firstName} ${student.lastName}` : 'Inconnu';
    }).join(', ');
  };

  const getCreatorName = (createdBy: string) => {
    const creator = users.find(u => u.id === createdBy);
    return creator ? `${creator.firstName} ${creator.lastName}` : 'Inconnu';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyenne';
      case 'high': return 'Élevée';
      default: return severity;
    }
  };

  const getDaysAgo = (date: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: incidents.length,
    inProgress: inProgressIncidents.length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    high: incidents.filter(i => i.severity === 'high').length
  };

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bonjour {currentUser.firstName} {currentUser.lastName}
        </h1>
        <p className="text-blue-100">
          Tableau de bord - Gestion disciplinaire
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total incidents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Résolus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gravité élevée</p>
              <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents prioritaires */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Incidents en cours - Priorisés par gravité et ancienneté
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Les plus graves et anciens en premier pour organiser votre journée
          </p>
        </div>

        <div className="p-6">
          {prioritizedIncidents.length > 0 ? (
            <div className="space-y-4">
              {prioritizedIncidents.slice(0, 10).map(incident => (
                <div 
                  key={incident.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onIncidentClick(incident)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                          {getSeverityLabel(incident.severity)}
                        </div>
                        <span className="text-xs text-gray-500">
                          il y a {getDaysAgo(incident.date)} jour(s)
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{getStudentNames(incident.studentIds)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(incident.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Créé par {getCreatorName(incident.createdBy)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm">{incident.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-300" />
              <p>Aucun incident en cours - Excellente nouvelle !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;