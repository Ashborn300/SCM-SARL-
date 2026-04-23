export type UserRole = 'admin' | 'employee' | 'manager';

export interface Employee {
  id: string; // Matricule
  name: string;
  fullName: string;
  admissionDate: string;
  birthDate: string;
  age: number;
  address: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  photo: string;
  serviceCardPhoto: string;
  position: string;
  salaryTotal: number;
  salaryPaid: number;
  assignedSiteId?: string;
  status: 'active' | 'inactive';
}

export interface Manager {
  id: string; // Matricule
  name: string;
  fullName: string;
  age: number;
  address: string;
  gender: 'M' | 'F';
  photo: string;
  phone: string;
  assignedSiteId?: string;
  status: 'active' | 'inactive';
}

export interface ConstructionSite {
  id: string;
  code: string;
  name: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'ongoing' | 'finished' | 'suspended';
  managerId: string;
  employeeIds: string[];
  advancement: number; // 0 to 100
  photos?: string[]; // Array of base64 photos
  steps?: { id: string; label: string; completed: boolean }[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  siteId: string;
  employeeId: string;
  status: 'present' | 'absent';
  remarks?: string;
  present?: boolean; // Kept for backwards compatibility
}

export interface SiteReport {
  id: string;
  siteId: string;
  date: string;
  dailyRemark: string;
  managerId: string;
}

export interface Document {
  id: string;
  type: 'invoice' | 'quote' | 'receipt' | 'employee_sheet' | 'report';
  title: string;
  date: string;
  amount?: number;
  clientName?: string;
  status: 'draft' | 'final';
  pdfBase64?: string;
  docModel?: any;
}
