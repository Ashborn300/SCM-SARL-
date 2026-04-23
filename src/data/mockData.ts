import { Employee, Manager, ConstructionSite, AttendanceRecord, Document } from '../types';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'SCM-E001',
    name: 'Jean',
    fullName: 'Jean Dupont',
    admissionDate: '2024-01-10',
    birthDate: '1990-05-15',
    age: 34,
    address: 'Kalamu, Kinshasa',
    gender: 'M',
    phone: '+243 81 000 0001',
    email: 'jean.dupont@scm.com',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    serviceCardPhoto: '',
    position: 'Maçon',
    salaryTotal: 1200,
    salaryPaid: 850,
    assignedSiteId: 'SITE-001',
    status: 'active'
  },
  {
    id: 'SCM-E002',
    name: 'Marie',
    fullName: 'Marie Kalala',
    admissionDate: '2024-02-15',
    birthDate: '1996-08-20',
    age: 28,
    address: 'Gombe, Kinshasa',
    gender: 'F',
    phone: '+243 81 000 0002',
    email: 'marie.kalala@scm.com',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    serviceCardPhoto: '',
    position: 'Électricienne',
    salaryTotal: 1500,
    salaryPaid: 1500,
    assignedSiteId: 'SITE-002',
    status: 'active'
  },
  {
    id: 'SCM-E003',
    name: 'Pierre',
    fullName: 'Pierre Malu',
    admissionDate: '2023-11-20',
    birthDate: '1982-03-10',
    age: 42,
    address: 'Limete, Kinshasa',
    gender: 'M',
    phone: '+243 81 000 0003',
    email: 'pierre.malu@scm.com',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    serviceCardPhoto: '',
    position: 'Charpentier',
    salaryTotal: 1100,
    salaryPaid: 400,
    assignedSiteId: 'SITE-001',
    status: 'active'
  }
];

export const MOCK_MANAGERS: Manager[] = [
  {
    id: 'SCM-M001',
    name: 'Robert',
    fullName: 'Robert Nkolo',
    age: 45,
    address: 'Ngaliema, Kinshasa',
    gender: 'M',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    phone: '+243 81 234 5678',
    assignedSiteId: 'SITE-001',
    status: 'active'
  },
  {
    id: 'SCM-M002',
    name: 'Alice',
    fullName: 'Alice Mbombo',
    age: 38,
    address: 'Bandal, Kinshasa',
    gender: 'F',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    phone: '+243 82 987 6543',
    assignedSiteId: 'SITE-002',
    status: 'active'
  }
];

export const MOCK_SITES: ConstructionSite[] = [
  {
    id: 'SITE-001',
    code: 'VILLA-HZ',
    name: 'Villa Horizon',
    location: 'Ma Campagne, Kinshasa',
    description: 'Construction d\'une villa de luxe avec piscine.',
    startDate: '2024-01-15',
    endDate: '2024-12-20',
    budget: 250000,
    status: 'ongoing',
    managerId: 'SCM-M001',
    employeeIds: ['SCM-E001', 'SCM-E003'],
    advancement: 45
  },
  {
    id: 'SITE-002',
    code: 'IMMO-SKY',
    name: 'Immeuble Sky',
    location: 'Gombe, Kinshasa',
    description: 'Immeuble de bureaux de 10 étages.',
    startDate: '2023-08-01',
    endDate: '2025-02-15',
    budget: 1200000,
    status: 'ongoing',
    managerId: 'SCM-M002',
    employeeIds: ['SCM-E002'],
    advancement: 65
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', date: '2024-04-20', siteId: 'SITE-001', employeeId: 'SCM-E001', present: true },
  { id: 'att-2', date: '2024-04-20', siteId: 'SITE-001', employeeId: 'SCM-E003', present: true },
  { id: 'att-3', date: '2024-04-20', siteId: 'SITE-002', employeeId: 'SCM-E002', present: true },
  { id: 'att-4', date: '2024-04-21', siteId: 'SITE-001', employeeId: 'SCM-E001', present: true },
];

export const MOCK_DOCS: Document[] = [
  { id: 'DOC-001', type: 'invoice', title: 'Facture Ciment - Villa Horizon', date: '2024-04-10', amount: 5400, clientName: 'M. Kashama', status: 'final' },
  { id: 'DOC-002', type: 'quote', title: 'Devis Électricité - Immeuble Sky', date: '2024-04-15', amount: 15600, clientName: 'SCM Private', status: 'draft' },
  { id: 'DOC-003', type: 'receipt', title: 'Reçu Acompte - Jean Dupont', date: '2024-04-18', amount: 800, clientName: 'Jean Dupont', status: 'final' },
];
