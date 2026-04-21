import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import { DataProvider, useData } from './context/DataContext';

const MainApp: React.FC = () => {
  const { employees, managers, loading: dataLoading } = useData();
  const [user, setUser] = useState<{ role: UserRole; id: string; details: any } | null>(null);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('scm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setInitLoading(false);
  }, []);

  const handleLogin = (id: string) => {
    let loggedUser: { role: UserRole; id: string; details: any } | null = null;

    if (id === 'SCM00123') {
      loggedUser = { role: 'admin', id: 'admin', details: { name: 'Admin' } };
    } else {
      const employee = employees.find(e => e.id === id);
      if (employee) {
        loggedUser = { role: 'employee', id: employee.id, details: employee };
      } else {
        const manager = managers.find(m => m.id === id);
        if (manager) {
          loggedUser = { role: 'manager', id: manager.id, details: manager };
        }
      }
    }

    if (loggedUser) {
      setUser(loggedUser);
      localStorage.setItem('scm_user', JSON.stringify(loggedUser));
    } else {
      throw new Error('Identifiant invalide');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scm_user');
  };

  if (initLoading || (dataLoading && !user)) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Accès en cours...</p>
    </div>
  );

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
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
