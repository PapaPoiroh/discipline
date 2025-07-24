import React, { useState } from 'react';
import { X, Save, User, Upload } from 'lucide-react';
import { Student } from '../types';
import * as XLSX from 'xlsx';

interface StudentFormProps {
  student?: Student;
  onSave: (student: Omit<Student, 'id'>) => void;
  onBulkImport: (students: Omit<Student, 'id'>[]) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onBulkImport, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    class: student?.class || '',
    level: student?.level || '',
    birthDate: student?.birthDate || '',
    parentContact: student?.parentContact || ''
  });

  const [showImport, setShowImport] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const students: Omit<Student, 'id'>[] = jsonData.map((row: any) => ({
          firstName: row['Prénom'] || row['prenom'] || row['firstName'] || '',
          lastName: row['Nom'] || row['nom'] || row['lastName'] || '',
          class: row['Classe'] || row['classe'] || row['class'] || '',
          level: row['Niveau'] || row['niveau'] || row['level'] || '',
          email: row['Email'] || row['email'] || '',
          birthDate: row['Date de naissance'] || row['birthDate'] || '',
          parentContact: row['Contact parent'] || row['parentContact'] || ''
        })).filter(student => student.firstName && student.lastName);

        onBulkImport(students);
        setShowImport(false);
      } catch (error) {
        alert('Erreur lors de l\'import du fichier. Vérifiez le format Excel.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {student ? 'Modifier l\'élève' : 'Nouvel élève'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {!student && (
              <button
                onClick={() => setShowImport(!showImport)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Import Excel</span>
              </button>
            )}
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {showImport && (
          <div className="p-6 bg-green-50 border-b border-green-200">
            <h3 className="text-lg font-medium text-green-800 mb-3">Import Excel</h3>
            <p className="text-sm text-green-700 mb-4">
              Le fichier Excel doit contenir les colonnes : Nom, Prénom, Classe (optionnel: Niveau, Email, Date de naissance, Contact parent)
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileImport}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe *
              </label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                placeholder="ex: 6ème A, 2nde B..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="6ème">6ème</option>
                <option value="5ème">5ème</option>
                <option value="4ème">4ème</option>
                <option value="3ème">3ème</option>
                <option value="2nde">2nde</option>
                <option value="1ère">1ère</option>
                <option value="Terminale">Terminale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact parent
              </label>
              <input
                type="text"
                name="parentContact"
                value={formData.parentContact}
                onChange={handleChange}
                placeholder="Téléphone ou email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;