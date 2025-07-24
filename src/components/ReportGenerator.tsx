import React, { useState } from 'react';
import { FileText, Download, Mail, Calendar, User, AlertTriangle, FileDown } from 'lucide-react';
import { Incident, Student, SchoolSettings, User as UserType } from '../types';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
  incidents: Incident[];
  students: Student[];
  schoolSettings: SchoolSettings;
  users: UserType[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ incidents, students, schoolSettings, users }) => {
  const [selectedIncident, setSelectedIncident] = useState<string>('');
  const [reportType, setReportType] = useState<'single' | 'summary'>('single');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
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

  const getStudentInfo = (studentIds: string[]) => {
    return studentIds.map(id => students.find(s => s.id === id)).filter(Boolean);
  };

  const generateSingleReport = (incident: Incident) => {
    const studentsInfo = getStudentInfo(incident.studentIds);
    const sanctionsText = incident.sanctions.map(sanction => {
      const typeLabel = {
        'oral_warning': 'Avertissement oral',
        'written_note': 'Mot dans le carnet',
        'detention': 'Retenue',
        'suspended_sanction': 'Sanction avec sursis',
        'temporary_exclusion': 'Exclusion temporaire',
        'permanent_exclusion': 'Exclusion définitive',
        'other': sanction.customType || 'Autre'
      }[sanction.type];
      
      return `- ${typeLabel}${sanction.duration ? ` (${sanction.duration} jours)` : ''} - ${sanction.description}`;
    }).join('\n');

    const studentsText = studentsInfo.map(student => 
      `Nom et prénom : ${student?.firstName} ${student?.lastName}
Classe : ${student?.class}
${student?.level ? `Niveau : ${student.level}` : ''}
${student?.email ? `Email : ${student.email}` : ''}
${student?.parentContact ? `Contact parent : ${student.parentContact}` : ''}`
    ).join('\n\n');
    return `
                    RAPPORT D'INCIDENT DISCIPLINAIRE

${schoolSettings.address}


INFORMATIONS GÉNÉRALES

Titre de l'incident : ${incident.title}
Date : ${new Date(incident.date).toLocaleDateString('fr-FR')}
Lieu : ${incident.location}
Gravité : ${incident.severity === 'low' ? 'Faible' : incident.severity === 'medium' ? 'Moyenne' : 'Élevée'}
Statut : ${incident.status === 'in_progress' ? 'En cours' : 'Résolu'}
Créé par : ${getCreatorName(incident.createdBy)}

ÉLÈVE(S) CONCERNÉ(S)

${studentsText}


DESCRIPTION DE L'INCIDENT

${incident.description}


TÉMOINS

${incident.witnesses.length > 0 ? incident.witnesses.map(w => `- ${w}`).join('\n') : 'Aucun témoin'}


NOTES DÉTAILLÉES

${incident.notes || 'Aucune note'}


PIÈCES JOINTES

${incident.attachments && incident.attachments.length > 0 
  ? incident.attachments.map(a => `- ${a.name} (${a.type})`).join('\n')
  : 'Aucune pièce jointe'}


SANCTIONS APPLIQUÉES

${sanctionsText || 'Aucune sanction'}



Fait le ${new Date().toLocaleDateString('fr-FR')}

${schoolSettings.principalName}
${schoolSettings.principalTitle}
    `;
  };

  const generateSummaryReport = () => {
    const filteredIncidents = incidents.filter(incident => {
      if (!dateRange.start || !dateRange.end) return true;
      const incidentDate = new Date(incident.date);
      return incidentDate >= new Date(dateRange.start) && incidentDate <= new Date(dateRange.end);
    });

    const stats = {
      total: filteredIncidents.length,
      inProgress: filteredIncidents.filter(i => i.status === 'in_progress').length,
      resolved: filteredIncidents.filter(i => i.status === 'resolved').length,
      high: filteredIncidents.filter(i => i.severity === 'high').length,
      medium: filteredIncidents.filter(i => i.severity === 'medium').length,
      low: filteredIncidents.filter(i => i.severity === 'low').length
    };

    const incidentsList = filteredIncidents.map(incident => {
      return `- ${incident.title} - ${getStudentNames(incident.studentIds)} (${new Date(incident.date).toLocaleDateString('fr-FR')}) - Créé par ${getCreatorName(incident.createdBy)}`;
    }).join('\n');

    return `
                    RAPPORT DE SYNTHÈSE DES INCIDENTS DISCIPLINAIRES

${schoolSettings.address}


PÉRIODE D'ANALYSE

Du ${dateRange.start ? new Date(dateRange.start).toLocaleDateString('fr-FR') : 'début'} au ${dateRange.end ? new Date(dateRange.end).toLocaleDateString('fr-FR') : 'fin'}


STATISTIQUES GÉNÉRALES

Total des incidents : ${stats.total}


RÉPARTITION PAR STATUT

En cours : ${stats.inProgress}
Résolus : ${stats.resolved}


RÉPARTITION PAR GRAVITÉ

Élevée : ${stats.high}
Moyenne : ${stats.medium}
Faible : ${stats.low}


LISTE DES INCIDENTS

${incidentsList || 'Aucun incident'}



Fait le ${new Date().toLocaleDateString('fr-FR')}

${schoolSettings.principalName}
${schoolSettings.principalTitle}
    `;
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    
    // Configuration de la police Poppins (simulation avec Helvetica)
    pdf.setFont('helvetica');
    pdf.setFontSize(11);
    
    let content = '';
    let filename = '';

    if (reportType === 'single' && selectedIncident) {
      const incident = incidents.find(i => i.id === selectedIncident);
      if (incident) {
        content = generateSingleReport(incident);
        filename = `rapport_incident_${incident.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      }
    } else if (reportType === 'summary') {
      content = generateSummaryReport();
      filename = `rapport_synthese_${new Date().toISOString().split('T')[0]}.pdf`;
    }

    if (content) {
      // Add logo if available
      if (schoolSettings.schoolLogo) {
        try {
          pdf.addImage(schoolSettings.schoolLogo, 'PNG', 10, 10, 30, 30);
        } catch (error) {
          console.warn('Could not add logo to PDF');
        }
      }

      // Add content
      const lines = content.split('\n').map(line => {
        // Supprimer les lignes séparatrices
        if (line.trim() === '' || line.includes('---') || line.includes('===')) {
          return '';
        }
        return line;
      }).filter(line => line !== '');
      
      let yPosition = schoolSettings.schoolLogo ? 50 : 20;
      
      lines.forEach(line => {
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Gestion des titres en gras
        if (line.includes('RAPPORT D\'INCIDENT') || 
            line.includes('INFORMATIONS GÉNÉRALES') ||
            line.includes('ÉLÈVE(S) CONCERNÉ(S)') ||
            line.includes('DESCRIPTION DE L\'INCIDENT') ||
            line.includes('TÉMOINS') ||
            line.includes('NOTES DÉTAILLÉES') ||
            line.includes('PIÈCES JOINTES') ||
            line.includes('SANCTIONS APPLIQUÉES') ||
            line.includes('STATISTIQUES GÉNÉRALES') ||
            line.includes('RÉPARTITION PAR STATUT') ||
            line.includes('RÉPARTITION PAR GRAVITÉ') ||
            line.includes('LISTE DES INCIDENTS')) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(line, 10, yPosition);
          pdf.setFont('helvetica', 'normal');
        } else {
          pdf.text(line, 10, yPosition);
        }
        yPosition += 6;
      });

      pdf.save(filename);
    }
  };

  const handleDownload = () => {
    let content = '';
    let filename = '';

    if (reportType === 'single' && selectedIncident) {
      const incident = incidents.find(i => i.id === selectedIncident);
      if (incident) {
        content = generateSingleReport(incident);
        filename = `rapport_incident_${incident.id}_${new Date().toISOString().split('T')[0]}.txt`;
      }
    } else if (reportType === 'summary') {
      content = generateSummaryReport();
      filename = `rapport_synthese_${new Date().toISOString().split('T')[0]}.txt`;
    }

    if (content) {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleEmail = () => {
    let content = '';
    let subject = '';

    if (reportType === 'single' && selectedIncident) {
      const incident = incidents.find(i => i.id === selectedIncident);
      if (incident) {
        content = generateSingleReport(incident);
        subject = `Rapport d'incident - ${incident.title}`;
      }
    } else if (reportType === 'summary') {
      content = generateSummaryReport();
      subject = 'Rapport de synthèse des incidents';
    }

    if (content) {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
      window.open(mailtoLink);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Générateur de Rapports</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de rapport
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="reportType"
                value="single"
                checked={reportType === 'single'}
                onChange={(e) => setReportType(e.target.value as 'single' | 'summary')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Rapport individuel</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="reportType"
                value="summary"
                checked={reportType === 'summary'}
                onChange={(e) => setReportType(e.target.value as 'single' | 'summary')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Rapport de synthèse</span>
            </label>
          </div>
        </div>

        {reportType === 'single' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un incident
            </label>
            <select
              value={selectedIncident}
              onChange={(e) => setSelectedIncident(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choisir un incident</option>
              {incidents.map(incident => (
                <option key={incident.id} value={incident.id}>
                  {incident.title} - {getStudentNames(incident.studentIds)} ({new Date(incident.date).toLocaleDateString('fr-FR')})
                </option>
              ))}
            </select>
          </div>
        )}

        {reportType === 'summary' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période (optionnel)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Du</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Au</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleDownload}
            disabled={reportType === 'single' && !selectedIncident}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger (TXT)</span>
          </button>
          <button
            onClick={generatePDF}
            disabled={reportType === 'single' && !selectedIncident}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <FileDown className="h-4 w-4" />
            <span>Télécharger (PDF)</span>
          </button>
          <button
            onClick={handleEmail}
            disabled={reportType === 'single' && !selectedIncident}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Envoyer par email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;