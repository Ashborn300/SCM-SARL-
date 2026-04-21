import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { UserRole } from './types';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import SharedSiteView from './components/SharedSiteView';
import { DataProvider, useData } from './context/DataContext';

const MainApp: React.FC = () => {
  const { employees, managers, loading: dataLoading } = useData();
  const [user, setUser] = useState<{ role: UserRole; id: string; details: any } | null>(null);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // ID-based role detection
        const detectRole = () => {
          const storedRole = localStorage.getItem('scm_user_role') as UserRole;
          const storedId = localStorage.getItem('scm_user_id');

          if (storedRole === 'admin' && storedId === 'SCM00123') {
            return { role: 'admin' as UserRole, id: 'SCM00123', details: { name: 'Administrateur SCM' } };
          }

          // Important: only try to match employees/managers if data is loaded
          if (!dataLoading) {
            if (storedRole === 'employee' && storedId) {
              const emp = employees.find(e => e.id === storedId);
              if (emp) return { role: 'employee' as UserRole, id: emp.id, details: emp };
            }

            if (storedRole === 'manager' && storedId) {
              const man = managers.find(m => m.id === storedId);
              if (man) return { role: 'manager' as UserRole, id: man.id, details: man };
            }
            
            // If data is loaded and we still have no match, sign out
            signOut(auth);
            return null;
          }
          
          // Data still loading, don't sign out yet
          return null;
        };

        const detected = detectRole();
        if (detected) {
          setUser(detected);
        } else {
          // If we have local storage but data is loading, don't clear user yet if it's admin
          // Actually, we don't need to do anything here, detected will be null and setUser(null)
          // except if it's admin it won't be null.
          setUser(detected);
        }
      } else {
        setUser(null);
        localStorage.removeItem('scm_user_role');
        localStorage.removeItem('scm_user_id');
      }
      setInitLoading(false);
    });

    return () => unsubscribe();
  }, [employees, managers, dataLoading]);

  const handleLogout = async () => {
    localStorage.removeItem('scm_user_role');
    localStorage.removeItem('scm_user_id');
    await signOut(auth);
    setUser(null);
  };

  // Check for shared view
  const searchParams = new URLSearchParams(window.location.search);
  const sharedSiteId = searchParams.get('siteId');
  const isShared = searchParams.get('shared') === 'true';

  if (sharedSiteId && isShared) {
    return <SharedSiteView siteId={sharedSiteId} />;
  }

  if (initLoading || (dataLoading && !user)) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Accès sécurisé en cours...</p>
    </div>
  );

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      {user.role === 'admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'employee' && <EmployeeDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'manager' && <ManagerDashboard user={user} onLogout={handleLogout} />}
    </>
  );
};

const App: React.FC = () => (
  <DataProvider>
    <MainApp />
  </DataProvider>
);

export default App;
