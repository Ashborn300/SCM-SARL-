import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Users, HardHat, Building2, 
  LogOut, Menu, X, ChevronRight, UserCircle2,
  ClipboardCheck, DollarSign, FileText, BarChart3, Wrench
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userRole: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-bold tracking-tight ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    }`}
  >
    <div className="flex-shrink-0">
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    </div>
    {!collapsed && <span className="whitespace-nowrap">{label}</span>}
  </button>
);

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  userRole, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  sidebarOpen, 
  setSidebarOpen,
  user
}) => {
  const isAdmin = userRole === 'admin';

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'employee', 'manager'] },
    { id: 'employees', label: 'Employés', icon: Users, roles: ['admin'] },
    { id: 'managers', label: 'Chefs de Chantier', icon: HardHat, roles: ['admin'] },
    { id: 'sites', label: 'Chantiers', icon: Building2, roles: ['admin', 'manager'] },
    { id: 'attendance', label: 'Présences', icon: ClipboardCheck, roles: ['admin', 'manager'] },
    { id: 'salaries', label: 'Salaires & Finances', icon: DollarSign, roles: ['admin'] },
    { id: 'documents', label: 'Documents', icon: FileText, roles: ['admin'] },
    { id: 'reports', label: 'Rapports', icon: BarChart3, roles: ['admin'] },
    { id: 'tools', label: 'Outils', icon: Wrench, roles: ['admin'] },
    { id: 'profile', label: 'Profil', icon: UserCircle2, roles: ['admin', 'employee', 'manager'] },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden font-sans text-slate-800">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transition-transform duration-300 md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
                S
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">S.C.M SARL</h1>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Construction Management</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white hover:bg-white/10 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {menuItems.filter(item => item.roles.includes(userRole)).map(item => (
              <SidebarItem 
                key={item.id} 
                icon={item.icon} 
                label={item.label} 
                active={activeTab === item.id} 
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }} 
              />
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">
                {user.details.name?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-white">{user.details.fullName || 'Admin SCM'}</p>
                <p className="text-xs text-slate-500 uppercase">ID: {user.id}</p>
              </div>
            </div>

            <button 
              onClick={onLogout} 
              className="flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-white transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800">
              {menuItems.find(i => i.id === activeTab)?.label || activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hidden sm:block">
              {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            {isAdmin && activeTab === 'sites' && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                + Nouveau Chantier
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
