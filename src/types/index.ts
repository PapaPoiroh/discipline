export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  class: string;
  level?: string;
  birthDate?: string;
  parentContact?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin'|'educator'|'teacher'|'principal'|'other';
  custom_role?: string;
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canSanction: boolean;
    canAccessSettings: boolean;
    admin?: boolean;
    [key: string]: boolean;
  };
  created_at: string;
  last_login?: string;
}


export interface Incident {
  id: string;
  title: string;
  description: string;
  studentIds: string[]; // Plusieurs élèves possibles
  date: Date;
  severity: 'low' | 'medium' | 'high';
  status: 'in_progress' | 'resolved'; // Suppression du statut "open"
  location: string;
  witnesses: string[];
  notes: string;
  handwrittenNotes?: string;
  attachments: Attachment[];
  sanctions: Sanction[];
  created_at: Date;
  updatedAt: Date;
  createdBy: string; // ID de l'utilisateur créateur
  lastModifiedBy: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadedAt: Date;
}

export interface Sanction {
  id: string;
  type: 'oral_warning' | 'written_note' | 'detention' | 'suspended_sanction' | 'temporary_exclusion' | 'permanent_exclusion' | 'other';
  description: string;
  date: Date;
  duration?: number;
  customType?: string;
  applied: boolean;
  appliedBy?: string; // ID de l'utilisateur qui a appliqué la sanction
}

export interface SchoolSettings {
  schoolName: string;
  schoolLogo?: string;
  principalName: string;
  principalTitle: string;
  address: string;
  allowedDomains?: string[]; // Domaines email autorisés pour l'inscription
}

export interface SavedReport {
  id: string;
  title: string;
  type: 'single' | 'summary';
  content: string;
  created_at: Date;
  createdBy: string;
  incidentIds?: string[];
}

export interface DashboardStats {
  totalIncidents: number;
  inProgressIncidents: number;
  resolvedIncidents: number;
  highSeverityIncidents: number;
  incidentsByClass: { [className: string]: number };
  recentIncidents: Incident[];
}
