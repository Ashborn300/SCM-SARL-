import React, { useState } from 'react';
import Layout from './Layout';
import { 
  Building2, Users, ClipboardCheck, 
  Search, CheckCircle2, XCircle, Info,
  Save, AlertCircle, History, HardHat,
  MapPin, Calendar, ArrowRightCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';

const ManagerDashboard: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const { employees, sites, saveAttendanceBatch } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const manager = user.details;
  const site = sites.find(s => s.id === manager.assignedSiteId);
  const siteEmployees = employees.filter(e => e.assignedSiteId === site?.id);

  const attendanceRecords = useData().attendance;
  const siteAttendance = attendanceRecords.filter(a => a.siteId === site?.id);
  const today = new Date().toISOString().split('T')[0];
  const presentToday = siteAttendance.filter(a => a.date === today && a.status === 'present').length;
  
  const monthlyRate = siteEmployees.length > 0 ? Math.round((siteAttendance.filter(a => a.status === 'present').length / (siteAttendance.length || 1)) * 100) : 0;

  const handleToggle = (id: string, state: boolean) => {
    setAttendance(prev => ({ ...prev, [id]: state }));
  };

  const handleRemarkChange = (id: string, text: string) => {
    setRemarks(prev => ({ ...prev, [id]: text }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const records = siteEmployees.map(emp => ({
        employeeId: emp.id,
        siteId: site?.id || '',
        date: new Date().toISOString().split('T')[0],
        status: attendance[emp.id] !== false ? 'present' : 'absent',
        remarks: remarks[emp.id] || ''
      }));
      
      await saveAttendanceBatch(records);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Site Summary Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 -mr-16 -mt-16 rounded-full" />
        <div className="relative">
          <img src={manager.photo} className="w-32 h-32 rounded-xl object-cover ring-4 ring-slate-50 shadow-lg border border-slate-200" referrerPolicy="no-referrer" />
          <div className="absolute -bottom-1 -right-1 bg-blue-600 border-2 border-white w-7 h-7 rounded-full shadow-md flex items-center justify-center">
             <HardHat size={12} className="text-white" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{manager.fullName}</h2>
          <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">Chef de Chantier • {site?.name || 'Aucun chantier'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
             <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
               <MapPin size={14} />
               <span className="text-[10px] font-bold uppercase tracking-tight">{site?.location || 'N/A'}</span>
             </div>
             <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
               <Users size={14} />
               <span className="text-[10px] font-bold uppercase tracking-tight">{siteEmployees.length} Travailleurs</span>
             </div>
             <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
               <Calendar size={14} />
               <span className="text-[10px] font-bold uppercase tracking-tight">{site?.advancement}% Progrès</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-indigo-900 rounded-xl p-8 text-white shadow-[0_10px_40px_-15px_rgba(49,46,129,0.3)] relative overflow-hidden h-full flex flex-col group">
          <div className="absolute top-0 right-0 p-8 text-white/5 rotate-12 transition-transform group-hover:scale-110">
            <Building2 size={120} />
          </div>
          <div className="relative z-10 space-y-8 flex-1 flex flex-col">
            <div className="space-y-1">
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Détails du Chantier</p>
              <h3 className="text-2xl font-black tracking-tighter uppercase">{site?.name}</h3>
            </div>
            <p className="text-indigo-100/80 leading-relaxed text-sm max-w-md flex-1">{site?.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Code</p>
                <p className="text-sm font-bold">{site?.code}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Status</p>
                <p className="text-sm font-bold uppercase tracking-wider">{site?.status === 'ongoing' ? 'En Cours' : 'Terminé'}</p>
              </div>
            </div>
            <button className="flex items-center justify-center space-x-2 bg-white text-indigo-900 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-100 active:scale-95 transition-all shadow-xl shadow-indigo-900/40 uppercase text-xs tracking-widest w-full">
              <span>Voir le planning complet</span>
              <ArrowRightCircle size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
           <div>
              <h4 className="font-bold text-slate-800 mb-8 flex items-center justify-between">
                Statistiques Travailleurs
                <Info size={16} className="text-slate-300" />
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Assignés</p>
                    <p className="text-4xl font-black text-slate-800 tracking-tighter">{siteEmployees.length}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Actifs</p>
                    <p className="text-4xl font-black text-blue-600 tracking-tighter">{presentToday}</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-12 pt-8 border-t border-slate-100">
             <div className="flex justify-between items-center mb-3">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Taux de présence mensuel</p>
               <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{monthlyRate > 80 ? 'Performance Élevée' : 'Performance Moyenne'}</p>
             </div>
             <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                <div 
                  className="h-full bg-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-1000" 
                  style={{ width: `${monthlyRate}%` }}
                />
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h4 className="font-bold text-slate-800">Pointage Journalier</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Date: <span className="text-blue-600">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
           <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-50 text-slate-600 px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition font-bold text-[10px] uppercase tracking-wider">
             <History size={14} />
             <span>Historique</span>
           </button>
           <button 
            disabled={saving}
            onClick={saveAttendance}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm ${
              saving ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 border border-blue-700 active:scale-95'
            }`}
           >
             <Save size={14} />
             <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
           </button>
        </div>
      </div>

      {showConfirmation && (
         <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-between border border-emerald-700"
         >
            <div className="flex items-center space-x-3">
               <CheckCircle2 size={20} />
               <span className="font-bold uppercase text-xs tracking-wider">Présences enregistrées avec succès</span>
            </div>
            <button onClick={() => setShowConfirmation(false)} className="hover:bg-white/10 p-1 rounded-lg transition">
              <XCircle size={18} />
            </button>
         </motion.div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
         <div className="overflow-x-auto elegant-scrollbar">
           <table className="w-full text-left border-collapse min-w-[700px]">
             <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
               <tr className="border-b border-slate-200">
                 <th className="px-6 py-4">Travailleur</th>
                 <th className="px-6 py-4">Status Présence</th>
                 <th className="px-6 py-4">Remarque journalière</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {siteEmployees.map(emp => (
                 <tr key={emp.id} className={`hover:bg-slate-50/50 transition-colors ${attendance[emp.id] === false ? 'bg-red-50/30' : ''}`}>
                   <td className="px-6 py-4">
                     <div className="flex items-center space-x-3">
                       <img src={emp.photo} className="w-10 h-10 rounded-lg object-cover ring-2 ring-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                       <div>
                         <p className="text-sm font-bold text-slate-800">{emp.fullName}</p>
                         <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5 tracking-tight">{emp.position}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex items-center space-x-2">
                       <button 
                        onClick={() => handleToggle(emp.id, true)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                         attendance[emp.id] !== false 
                           ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm shadow-emerald-500/20' 
                           : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                        }`}
                       >
                         <CheckCircle2 size={14} />
                         <span>Présent</span>
                       </button>
                       <button 
                        onClick={() => handleToggle(emp.id, false)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                         attendance[emp.id] === false 
                           ? 'bg-red-600 text-white border-red-700 shadow-sm shadow-red-500/20' 
                           : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-red-300 hover:text-red-600'
                        }`}
                       >
                         <XCircle size={14} />
                         <span>Absent</span>
                       </button>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="relative max-w-xs">
                        <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                          type="text" 
                          placeholder="Note journalière..."
                          value={remarks[emp.id] || ''}
                          onChange={(e) => handleRemarkChange(emp.id, e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition"
                        />
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'attendance': return renderAttendance();
      case 'sites': return renderDashboard();
      case 'profile': return <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest shadow-inner">Page de Profil Manager</div>;
      default: return renderDashboard();
    }
  };

  return (
    <Layout 
      userRole="manager" 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={onLogout} 
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      user={user}
    >
      {renderContent()}
    </Layout>
  );
};

export default ManagerDashboard;
