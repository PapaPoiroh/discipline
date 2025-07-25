import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { Incident, Student, Sanction, Attachment, User } from '../types';
import VoiceRecorder from './VoiceRecorder';
import HandwritingCanvas from './HandwritingCanvas';
import AttachmentManager from './AttachmentManager';

interface IncidentFormProps {
  incident?: Incident;
  students: Student[];
  currentUser: User;
  onSave: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastModifiedBy'>) => void;
  onCancel: () => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ incident, students, currentUser, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: incident?.title || '',
    description: incident?.description || '',
    studentIds: incident?.studentIds || [],
    selectedClass: '',
    date: incident?.date ? new Date(incident.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    severity: incident?.severity || 'medium' as const,
    status: incident?.status || 'in_progress' as const,
    location: incident?.location || '',
    witnesses: incident?.witnesses || [''],
    notes: incident?.notes || '',
    handwrittenNotes: incident?.handwrittenNotes || '',
    attachments: incident?.attachments || [],
    sanctions: incident?.sanctions || []
  });

  const [newSanction, setNewSanction] = useState<Omit<Sanction, 'id'>>({
    type: 'oral_warning',
    description: '',
    date: new Date(),
    duration: undefined,
    applied: false
  });

  const availableClasses = [...new Set(students.map(s => s.class))].sort();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: new Date(formData.date),
      witnesses: formData.witnesses.filter(w => w.trim() !== ''),
      attachments: formData.attachments,
      sanctions: formData.sanctions
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleStudentToggle = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };

  const filteredStudents = formData.selectedClass 
    ? students.filter(s => s.class === formData.selectedClass)
    : students;

  const handleWitnessChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.map((w, i) => i === index ? value : w)
    }));
  };

  const addWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, '']
    }));
  };

  const removeWitness = (index: number) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter((_, i) => i !== index)
    }));
  };

  const handleSanctionChange = (field: string, value: any) => {
    setNewSanction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSanction = () => {
    if (newSanction.description.trim()) {
      const sanction: Sanction = {
        ...newSanction,
        id: Date.now().toString()
      };
      setFormData(prev => ({
        ...prev,
        sanctions: [...prev.sanctions, sanction]
      }));
      setNewSanction({
        type: 'oral_warning',
        description: '',
        date: new Date(),
        applied: false
      });
    }
  };

  const removeSanction = (sanctionId: string) => {
    setFormData(prev => ({
      ...prev,
      sanctions: prev.sanctions.filter(s => s.id !== sanctionId)
    }));
  };

  const handleNotesChange = (notes: string) => {
    setFormData(prev => ({
      ...prev,
      notes
    }));
  };

  const handleHandwritingChange = (dataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      handwrittenNotes: dataUrl
    }));
  };

  const handleAttachmentsChange = (attachments: Attachment[]) => {
    setFormData(prev => ({
      ...prev,
      attachments
    }));
  };

  const getSanctionTypeLabel = (type: string) => {
    const labels = {
      'oral_warning': 'Avertissement oral',
      'written_note': 'Mot dans le carnet',
      'detention': 'Retenue',
      'suspended_sanction': 'Sanction avec sursis',
      'temporary_exclusion': 'Exclusion temporaire',
      'permanent_exclusion': 'Exclusion définitive',
      'other': 'Autre'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {incident ? 'Modifier l\'incident' : 'Nouvel incident'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'incident
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtre par classe (optionnel)
              </label>
              <select
                value={formData.selectedClass}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedClass: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              >
                <option value="">Toutes les classes</option>
                {availableClasses.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Élève(s) concerné(s) *
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                {filteredStudents.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucun élève trouvé</p>
                ) : (
                  filteredStudents.map(student => (
                    <label key={student.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.studentIds.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-900">
                        {student.first_name} {student.last_name} - {student.class}
                      </span>
                    </label>
                  ))
                )}
              </div>
              {formData.studentIds.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Veuillez sélectionner au moins un élève</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="in_progress">En cours</option>
                <option value="resolved">Résolu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gravité
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Témoins
            </label>
            {formData.witnesses.map((witness, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={witness}
                  onChange={(e) => handleWitnessChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du témoin"
                />
                <button
                  type="button"
                  onClick={() => removeWitness(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addWitness}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Ajouter un témoin
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes détaillées
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Ajoutez des notes détaillées..."
            />
            <VoiceRecorder
              onTranscriptChange={handleNotesChange}
              existingText={formData.notes}
            />
          </div>

          <div>
            <AttachmentManager
              attachments={formData.attachments}
              onAttachmentsChange={handleAttachmentsChange}
            />
          </div>

          <div>
            <HandwritingCanvas
              onSave={handleHandwritingChange}
              initialData={formData.handwrittenNotes}
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sanctions</h3>
            
            {!currentUser.permissions.canSanction && (
              <p className="text-amber-600 text-sm mb-4 p-3 bg-amber-50 rounded-lg">
                Vous n'avez pas les permissions pour appliquer des sanctions. Seuls les administrateurs et chefs d'établissement peuvent le faire.
              </p>
            )}
            
            {formData.sanctions.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.sanctions.map(sanction => (
                  <div key={sanction.id} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                    <div>
                      <span className="font-medium text-red-800">
                        {getSanctionTypeLabel(sanction.type)}
                      </span>
                      {sanction.duration && (
                        <span className="text-red-600 ml-2">({sanction.duration} jours)</span>
                      )}
                      <p className="text-sm text-red-700">{sanction.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSanction(sanction.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentUser.permissions.canSanction && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-gray-900">Ajouter une sanction</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de sanction
                  </label>
                  <select
                    value={newSanction.type}
                    onChange={(e) => handleSanctionChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="oral_warning">Avertissement oral</option>
                    <option value="written_note">Mot dans le carnet</option>
                    <option value="detention">Retenue</option>
                    <option value="suspended_sanction">Sanction avec sursis</option>
                    <option value="temporary_exclusion">Exclusion temporaire</option>
                    <option value="permanent_exclusion">Exclusion définitive</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                {(newSanction.type === 'temporary_exclusion' || newSanction.type === 'detention') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée (jours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newSanction.duration || ''}
                      onChange={(e) => handleSanctionChange('duration', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {newSanction.type === 'temporary_exclusion' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type personnalisé
                  </label>
                  <input
                    type="text"
                    value={newSanction.customType || ''}
                    onChange={(e) => handleSanctionChange('customType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Précisez le type de sanction"
                  />
                </div>
              )}

              {newSanction.type === 'detention' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (heures)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newSanction.duration || ''}
                    onChange={(e) => handleSanctionChange('duration', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de la sanction
                </label>
                <textarea
                  value={newSanction.description}
                  onChange={(e) => handleSanctionChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Détails de la sanction..."
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSanction.applied}
                    onChange={(e) => handleSanctionChange('applied', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sanction appliquée</span>
                </label>
                
                <button
                  type="button"
                  onClick={addSanction}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Ajouter la sanction
                </button>
              </div>
            </div>
            )}
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
              disabled={formData.studentIds.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                formData.studentIds.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
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

export default IncidentForm;