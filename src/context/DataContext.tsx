import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { Employee, Manager, ConstructionSite, AttendanceRecord, Document } from '../types';

interface DataContextType {
  employees: Employee[];
  managers: Manager[];
  sites: ConstructionSite[];
  attendance: AttendanceRecord[];
  documents: Document[];
  loading: boolean;
  refreshData: () => Promise<void>;
  
  // Mutations
  addEmployee: (emp: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, emp: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  addSite: (site: Partial<ConstructionSite>) => Promise<void>;
  updateSite: (id: string, site: Partial<ConstructionSite>) => Promise<void>;
  deleteSite: (id: string) => Promise<void>;
  
  addDocument: (doc: Partial<Document>) => Promise<void>;
  saveAttendanceBatch: (records: Partial<AttendanceRecord>[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [sites, setSites] = useState<ConstructionSite[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, manRes, siteRes, attRes, docRes] = await Promise.all([
        apiService.getEmployees(),
        apiService.getManagers(),
        apiService.getSites(),
        apiService.getAttendance(),
        apiService.getDocuments()
      ]);
      setEmployees(empRes);
      setManagers(manRes);
      setSites(siteRes);
      setAttendance(attRes);
      setDocuments(docRes);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addEmployee = async (emp: Partial<Employee>) => {
    await apiService.createEmployee(emp);
    await refreshData();
  };

  const updateEmployee = async (id: string, emp: Partial<Employee>) => {
    await apiService.updateEmployee(id, emp);
    await refreshData();
  };

  const deleteEmployee = async (id: string) => {
    await apiService.deleteEmployee(id);
    await refreshData();
  };

  const addSite = async (site: Partial<ConstructionSite>) => {
    await apiService.createSite(site);
    await refreshData();
  };

  const updateSite = async (id: string, site: Partial<ConstructionSite>) => {
    await apiService.updateSite(id, site);
    await refreshData();
  };

  const deleteSite = async (id: string) => {
    await apiService.deleteSite(id);
    await refreshData();
  };

  const addDocument = async (doc: Partial<Document>) => {
    await apiService.createDocument(doc);
    await refreshData();
  };

  const saveAttendanceBatch = async (records: Partial<AttendanceRecord>[]) => {
    // Current server helper only does 1 by 1 in this simple setup
    // But we can loop or add a batch endpoint. For now, 1 by 1 or sequential is fine for this demo.
    for (const record of records) {
      await apiService.saveAttendance(record);
    }
    await refreshData();
  };

  return (
    <DataContext.Provider value={{
      employees, managers, sites, attendance, documents, loading, refreshData,
      addEmployee, updateEmployee, deleteEmployee,
      addSite, updateSite, deleteSite,
      addDocument, saveAttendanceBatch
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
