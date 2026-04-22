import React, { useState } from 'react';
import Layout from './Layout';
import { 
  Building2, DollarSign, ClipboardCheck, 
  UserCircle2, MapPin, Calendar, Clock,
  ArrowRightCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';

const EmployeeDashboard: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const { sites, attendance } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const employee = user.details;

  const assignedSite = sites.find(s => s.id === employee.assignedSiteId);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header Info Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 -mr-16 -mt-16 rounded-full" />
        <div className="relative">
          <img src={employee.photo} className="w-32 h-32 rounded-xl object-cover ring-4 ring-slate-50 shadow-lg border border-slate-200" referrerPolicy="no-referrer" />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-6 h-6 rounded-full shadow-md" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{employee.fullName}</h2>
          <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">{employee.position}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
             <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
               <UserCircle2 size={14} />
               <span className="text-[10px] font-bold uppercase tracking-tight">ID: {employee.id}</span>
             </div>
             <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
               <MapPin size={14} />
               <span className="text-[10px] font-bold uppercase tracking-tight">{employee.address}</span>
             </div>
             <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
               <Calendar size={14} />
               <span className="text-[10px] font-bold uppercase tracking-tight">{employee.age} ans</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Site Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 sm:p-8 text-white shadow-[0_10px_40px_-15px_rgba(15,23,42,0.3)] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 pointer-events-none grayscale transition-opacity group-hover:opacity-20">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4">
                 <div className="space-y-1">
                   <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">Chantier Assigné</p>
                   <h3 className="text-2xl font-black tracking-tighter uppercase">{assignedSite?.name || 'Aucun chantier'}</h3>
                 </div>
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                   <Building2 size={20} />
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Localisation</p>
                    <p className="text-sm font-bold">{assignedSite?.location || 'N/A'}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Progression Site</p>
                    <p className="text-sm font-bold">{assignedSite?.advancement || 0}%</p>
                 </div>
              </div>

              <div className="flex items-center space-x-2 text-blue-400 group-hover:translate-x-1 transition-transform cursor-pointer font-bold text-xs uppercase tracking-wider">
                <span>Détails du projet</span>
                <ArrowRightCircle size={16} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
             <h4 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
               Historique de présence
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">30 Derniers Jours</span>
             </h4>
             <div className="space-y-3">
                {attendance.filter(a => a.employeeId === employee.id).slice(0, 5).map(record => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50/30 rounded-lg border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-white border border-slate-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
                         {record.date.split('-')[2]}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                           {new Date(record.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                         </p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                           {sites.find(s => s.id === record.siteId)?.name || 'N/A'}
                         </p>
                       </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm shadow-emerald-500/5 ${
                      record.status === 'present' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {record.status === 'present' ? 'Présent' : 'Absent'}
                    </span>
                  </div>
                ))}
                {attendance.filter(a => a.employeeId === employee.id).length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase italic">Aucun historique de présence disponible</div>
                )}
             </div>
          </div>
        </div>

        {/* Financial Side Column */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-8">
              <h4 className="font-bold text-slate-800">Ma Rémunération</h4>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Salaire Total</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">${employee.salaryTotal.toLocaleString()}</p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Reçu</p>
                      <p className="text-lg font-bold text-emerald-600">${employee.salaryPaid.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Solde</p>
                      <p className="text-lg font-bold text-red-500 px-2 py-0.5 bg-red-50 rounded-lg border border-red-100 items-center inline-block">${(employee.salaryTotal - employee.salaryPaid).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-blue-600 h-full shadow-lg shadow-blue-500/40" 
                      style={{ width: `${(employee.salaryPaid / employee.salaryTotal) * 100}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-center text-slate-400 mt-3 font-bold uppercase tracking-tight">
                    {Math.round((employee.salaryPaid / employee.salaryTotal) * 100)}% versé ce mois
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl flex items-center space-x-3 border border-blue-100">
                 <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                   <DollarSign size={18} />
                 </div>
                 <div>
                   <p className="text-[11px] font-bold text-blue-800">Prochain paiement</p>
                   <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">Le 01 Mai, 2024</p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h4 className="font-bold text-slate-800 mb-6">Événements récents</h4>
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                    <div className="w-px h-full bg-slate-100 min-h-[40px] mt-2" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Dernier pointage</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
                      {attendance.filter(a => a.employeeId === employee.id).length > 0 
                        ? new Date(Math.max(...attendance.filter(a => a.employeeId === employee.id).map(a => new Date(a.date).getTime()))).toLocaleDateString()
                        : 'Jamais'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                    <div className="w-px h-full bg-slate-100 min-h-[40px] mt-2" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Paiement reçu</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">${employee.salaryPaid.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Identifiant employé</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{employee.id}</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout 
      userRole="employee" 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={onLogout} 
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      user={user}
    >
      {activeTab === 'dashboard' ? renderDashboard() : <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest shadow-inner">Page {activeTab}</div>}
    </Layout>
  );
};

export default EmployeeDashboard;
