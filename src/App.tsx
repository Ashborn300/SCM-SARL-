import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { UserRole } from './types';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import SharedSiteView from './components/SharedSiteView';
import PublicRegistrationForm from './components/PublicRegistrationForm';
import { DataProvider, useData } from './context/DataContext';

const MainApp: React.FC = () => {
  const { employees, managers, loading: dataLoading } = useData();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setInitLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const user = React.useMemo(() => {
    if (!firebaseUser) return null;

    const storedRole = localStorage.getItem('scm_user_role') as UserRole;
    const storedId = localStorage.getItem('scm_user_id');

    if (storedRole === 'admin' && storedId) {
      return { role: 'admin' as UserRole, id: storedId, details: { name: 'Administrateur SCM' } };
    }

    if (!dataLoading) {
      if (storedRole === 'employee' && storedId) {
        const emp = employees.find(e => e.id === storedId);
        if (emp) return { role: 'employee' as UserRole, id: emp.id, details: emp };
      }
      if (storedRole === 'manager' && storedId) {
        const man = managers.find(m => m.id === storedId);
        if (man) return { role: 'manager' as UserRole, id: man.id, details: man };
      }
    }
    return null;
  }, [firebaseUser, employees, managers, dataLoading, authVersion]);

  // Handle invalid sessions
  useEffect(() => {
    if (!dataLoading && firebaseUser && !user && localStorage.getItem('scm_user_role')) {
      const storedRole = localStorage.getItem('scm_user_role');
      // If we have a role in storage but can't find a matching user after data is loaded,
      // it means the session is invalid (e.g. employee was deleted or ID changed).
      if (storedRole !== 'admin') {
        signOut(auth);
        localStorage.removeItem('scm_user_role');
        localStorage.removeItem('scm_user_id');
      }
    }
  }, [user, dataLoading, firebaseUser]);

  const handleLogout = async () => {
    localStorage.removeItem('scm_user_role');
    localStorage.removeItem('scm_user_id');
    setAuthVersion(v => v + 1);
    await signOut(auth);
  };

  // Check for shared view or public registration
  const searchParams = new URLSearchParams(window.location.search);
  const sharedSiteId = searchParams.get('siteId');
  const isShared = searchParams.get('shared') === 'true';
  const isRegistering = searchParams.get('register') === 'true';

  if (sharedSiteId && isShared) {
    return <SharedSiteView siteId={sharedSiteId} />;
  }

  if (isRegistering) {
    return <PublicRegistrationForm />;
  }

  if (initLoading || (dataLoading && !user)) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Accès sécurisé en cours...</p>
    </div>
  );

  if (!user && !localStorage.getItem('scm_user_role')) {
    return <LoginPage onLoginSuccess={() => setAuthVersion(v => v + 1)} />;
  }

  // If there's a user role but no user object yet, the data context is still busy downloading
  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Préparation de votre espace...</p>
      </div>
    );
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
