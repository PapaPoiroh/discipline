import React from 'react';
import { Search, Filter, Calendar, Users, GraduationCap } from 'lucide-react';

interface AdvancedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: 'all' | 'in_progress' | 'resolved';
  onStatusChange: (value: 'all' | 'in_progress' | 'resolved') => void;
  filterSeverity: 'all' | 'low' | 'medium' | 'high';
  onSeverityChange: (value: 'all' | 'low' | 'medium' | 'high') => void;
  filterClass: string;
  onClassChange: (value: string) => void;
  filterDateStart: string;
  onDateStartChange: (value: string) => void;
  filterDateEnd: string;
  onDateEndChange: (value: string) => void;
  availableClasses: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterSeverity,
  onSeverityChange,
  filterClass,
  onClassChange,
  filterDateStart,
  onDateStartChange,
  filterDateEnd,
  onDateEndChange,
  availableClasses
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">Filtres de recherche</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recherche textuelle */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recherche par mot-clé
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Titre d'incident, nom d'élève..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtre par classe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="inline h-4 w-4 mr-1" />
            Classe
          </label>
          <select
            value={filterClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les classes</option>
            {availableClasses.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </div>

        {/* Filtre par statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
          </select>
        </div>

        {/* Filtre par gravité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gravité
          </label>
          <select
            value={filterSeverity}
            onChange={(e) => onSeverityChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les gravités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
        </div>

        {/* Filtre par période */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Période
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Du</label>
              <input
                type="date"
                value={filterDateStart}
                onChange={(e) => onDateStartChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Au</label>
              <input
                type="date"
                value={filterDateEnd}
                onChange={(e) => onDateEndChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;