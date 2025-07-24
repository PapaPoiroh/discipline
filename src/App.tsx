import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, MapPin, AlertTriangle, Clock, CheckCircle, Paperclip, Users } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import IncidentForm from './components/IncidentForm';
import StudentForm from './components/StudentForm';
import ReportGenerator from './components/ReportGenerator';
import SchoolSettings from './components/SchoolSettings';
import UserManagement from './components/UserManagement';
import AdvancedFilters from './components/AdvancedFilters';
// import { useLocalStorage } from './hooks/useLocalStorage'; // supprimé
import { useAuth } from './hooks/useAuth';
import { Incident, Student, SchoolSettings as SchoolSettingsType, User } from './types';
// import {  getIncidents, createIncident, updateIncident, removeIncident, getUsers, createUser, updateUser, removeUser,} from './utils/dataProvider';

type ViewType = 'dashboard' | 'incidents' | 'students' | 'reports' | 'settings' | 'users';

function App() {
  const { user: currentUser, isAuthenticated, login } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettingsType>({
    schoolName: 'Mon Établissement',
    principalName: 'M. ESCOURROU',
    principalTitle: 'Adjoint de direction',
    address: ''
  });

  // Filtres avancés
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'resolved'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterClass, setFilterClass] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  
  // Modal states
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | undefined>();
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();

  // Authentification simple pour la démo
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Charger les données Supabase au montage
  useEffect(() => {
    getIncidents().then(setIncidents);
    getUsers().then(setUsers);
    // getStudents().then(setStudents); // à ajouter si table students
    // Charger schoolSettings si tu l'as aussi dans Supabase, sinon conserve local
  }, []);

  // Ajout d'un incident
  const handleAddIncident = async (incident: Incident) => {
    const newIncident = await createIncident(incident);
    setIncidents(prev => [newIncident, ...prev]);
  };

  // Mise à jour d'un incident
  const handleUpdateIncident = async (id: string, updates: Partial<Incident>) => {
    const updated = await updateIncident(id, updates);
    setIncidents(prev => prev.map(i => i.id === id ? updated : i));
  };

  // Suppression d'un incident
  const handleDeleteIncident = async (id: string) => {
    await removeIncident(id);
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  // Idem pour users, students...

  // Plus besoin de l'auto-save localStorage ni de l'init sample data

  // ...le reste du composant inchangé, adapte l'appel des props/fonctions de CRUD dans tes enfants

  return (
    // Ton JSX habituel
    <div>
      <Header />
      <Dashboard
        incidents={incidents}
        students={students}
        users={users}
        // ...
      />
      {/* ...autres composants */}
    </div>
  );
}

export default App;
