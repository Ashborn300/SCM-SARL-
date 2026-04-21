import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, 
  doc, query, getDocs, writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Employee, Manager, ConstructionSite, AttendanceRecord, Document as SCMDocument } from '../types';
import { migrateFromLocalToFirebase } from '../services/migrationService';

interface DataContextType {
  employees: Employee[];
  managers: Manager[];
  sites: ConstructionSite[];
  attendance: AttendanceRecord[];
  documents: SCMDocument[];
  loading: boolean;
  
  // Mutations
  addEmployee: (emp: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, emp: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  addSite: (site: Partial<ConstructionSite>) => Promise<void>;
  updateSite: (id: string, site: Partial<ConstructionSite>) => Promise<void>;
  deleteSite: (id: string) => Promise<void>;
  
  addDocument: (doc: Partial<SCMDocument>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  clearDocumentsHistory: (type: string) => Promise<void>;
  saveAttendanceBatch: (records: Partial<AttendanceRecord>[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [sites, setSites] = useState<ConstructionSite[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [documents, setDocuments] = useState<SCMDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous listeners if any
      unsubs.forEach(unsub => unsub());
      unsubs = [];

      if (user) {
        // ONLY start listeners if authenticated
        const unsubEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
          setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)));
        });

        const unsubManagers = onSnapshot(collection(db, 'managers'), (snapshot) => {
          setManagers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Manager)));
        });

        const unsubSites = onSnapshot(collection(db, 'sites'), (snapshot) => {
          setSites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConstructionSite)));
        });

        const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snapshot) => {
          setAttendance(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord)));
        });

        const unsubDocuments = onSnapshot(collection(db, 'documents'), (snapshot) => {
          setDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SCMDocument)));
          setLoading(false);
        });

        unsubs = [unsubEmployees, unsubManagers, unsubSites, unsubAttendance, unsubDocuments];

        // Migration check
        const checkInitialLoad = async () => {
          try {
            const snapshots = await Promise.all([
              getDocs(collection(db, 'employees')),
              getDocs(collection(db, 'managers')),
              getDocs(collection(db, 'sites')),
              getDocs(collection(db, 'attendance')),
              getDocs(collection(db, 'documents'))
            ]);
            
            const allEmpty = snapshots.every(s => s.empty);
            if (allEmpty) {
              const response = await fetch('/db.json');
              if (response.ok) {
                const localData = await response.json();
                await migrateFromLocalToFirebase(localData);
              }
            }
            setLoading(false);
          } catch (error) {
            console.error('Error fetching initial Firebase data:', error);
            setLoading(false);
          }
        };
        checkInitialLoad();
      } else {
        // Reset state when logged out
        setEmployees([]);
        setManagers([]);
        setSites([]);
        setAttendance([]);
        setDocuments([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const addEmployee = async (emp: Partial<Employee>) => {
    const docRef = await addDoc(collection(db, 'employees'), emp);
    await updateDoc(docRef, { id: docRef.id }); // Ensure ID is consistent
  };

  const updateEmployee = async (id: string, emp: Partial<Employee>) => {
    await updateDoc(doc(db, 'employees', id), emp);
  };

  const deleteEmployee = async (id: string) => {
    await deleteDoc(doc(db, 'employees', id));
  };

  const addSite = async (site: Partial<ConstructionSite>) => {
    const docRef = await addDoc(collection(db, 'sites'), site);
    await updateDoc(docRef, { id: docRef.id });
  };

  const updateSite = async (id: string, site: Partial<ConstructionSite>) => {
    await updateDoc(doc(db, 'sites', id), site);
  };

  const deleteSite = async (id: string) => {
    await deleteDoc(doc(db, 'sites', id));
  };

  const addDocument = async (docData: Partial<SCMDocument>) => {
    const docRef = await addDoc(collection(db, 'documents'), docData);
    await updateDoc(docRef, { id: docRef.id });
  };

  const deleteDocument = async (id: string) => {
    await deleteDoc(doc(db, 'documents', id));
  };

  const clearDocumentsHistory = async (type: string = 'all') => {
    const toolTypes = ['invoice', 'quote', 'receipt'];
    const snapshot = await getDocs(collection(db, 'documents'));
    const batch = writeBatch(db);
    
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (type === 'tools' && toolTypes.includes(data.type)) {
        batch.delete(docSnap.ref);
      } else if (type === 'all') {
        batch.delete(docSnap.ref);
      }
    });
    
    await batch.commit();
  };

  const saveAttendanceBatch = async (records: Partial<AttendanceRecord>[]) => {
    const batch = writeBatch(db);
    for (const record of records) {
      const docRef = doc(collection(db, 'attendance'));
      batch.set(docRef, { ...record, id: docRef.id });
    }
    await batch.commit();
  };

  return (
    <DataContext.Provider value={{
      employees, managers, sites, attendance, documents, loading,
      addEmployee, updateEmployee, deleteEmployee,
      addSite, updateSite, deleteSite,
      addDocument, deleteDocument, clearDocumentsHistory, saveAttendanceBatch
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
