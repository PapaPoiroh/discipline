import React, { useState } from 'react';
import { Save, Upload, X, FileSpreadsheet } from 'lucide-react';
import { SchoolSettings as SchoolSettingsType, Student } from '../types';
import * as XLSX from 'xlsx';

interface SchoolSettingsProps {
  settings: SchoolSettingsType;
  onSave: (settings: SchoolSettingsType) => void;
  students: Student[];
  onBulkImportStudents: (students: Omit<Student, 'id'>[]) => void;
}

const SchoolSettings: React.FC<SchoolSettingsProps> = ({ settings, onSave, students, onBulkImportStudents }) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData(prev => ({
        ...prev,
        schoolLogo: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      schoolLogo: undefined
    }));
  };

  const handleStudentImport = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const studentsData: Omit<Student, 'id'>[] = jsonData.map((row: any) => ({
          firstName: row['Prénom'] || row['prenom'] || row['firstName'] || '',
          lastName: row['Nom'] || row['nom'] || row['lastName'] || '',
          class: row['Classe'] || row['classe'] || row['class'] || '',
          level: row['Niveau'] || row['niveau'] || row['level'] || '',
          email: row['Email'] || row['email'] || '',
          birthDate: row['Date de naissance'] || row['birthDate'] || '',
          parentContact: row['Contact parent'] || row['parentContact'] || ''
        })).filter(student => student.firstName && student.lastName);

        if (studentsData.length > 0) {
          onBulkImportStudents(studentsData);
          alert(`${studentsData.length} élève(s) importé(s) avec succès !`);
        } else {
          alert('Aucun élève valide trouvé dans le fichier.');
        }
      } catch (error) {
        alert('Erreur lors de l\'import du fichier. Vérifiez le format Excel.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres de l'établissement</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'établissement
            </label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de l'établissement
            </label>
            {formData.schoolLogo ? (
              <div className="flex items-center space-x-4">
                <img 
                  src={formData.schoolLogo} 
                  alt="Logo" 
                  className="h-16 w-16 object-contain border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du responsable
              </label>
              <input
                type="text"
                name="principalName"
                value={formData.principalName}
                onChange={handleChange}
                placeholder="M. ESCOURROU"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre/Poste
              </label>
              <input
                type="text"
                name="principalTitle"
                value={formData.principalTitle}
                onChange={handleChange}
                placeholder="Adjoint de direction"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse de l'établissement
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Import des élèves</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Import en masse via fichier Excel</h3>
            <p className="text-sm text-blue-700 mb-4">
              Le fichier Excel doit contenir les colonnes : <strong>Nom, Prénom, Classe</strong><br/>
              Colonnes optionnelles : Niveau, Email, Date de naissance, Contact parent
            </p>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Choisir un fichier Excel</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleStudentImport}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">
                {students.length} élève(s) actuellement dans la base
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSettings;