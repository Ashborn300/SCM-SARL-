import React, { useState } from 'react';
import Layout from './Layout';
import { 
  Users, Building2, HardHat, DollarSign, 
  ClipboardCheck, TrendingUp, Plus, Search, 
  MoreVertical, Download, Filter, FileText,
  AlertTriangle, CheckCircle2, Clock, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { useData } from '../context/DataContext';

const StatCard = ({ title, value, trend, trendColor, subValue, progress }: any) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      {trend && <span className={`text-xs font-bold ${trendColor || 'text-slate-500'}`}>{trend}</span>}
    </div>
    {progress !== undefined ? (
      <div className="h-[6px] bg-slate-200 rounded-full overflow-hidden mt-3">
        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    ) : (
      <p className="text-[11px] text-slate-400 mt-2">{subValue}</p>
    )}
  </div>
);

const AdminDashboard: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const { 
    employees, sites, managers, attendance, documents, loading,
    addEmployee, updateEmployee, deleteEmployee,
    addSite, updateSite, deleteSite,
    addDocument
  } = useData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isAddingSite, setIsAddingSite] = useState(false);

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Employés Totaux" 
          value={employees.length} 
          trend="+8% ↑" 
          trendColor="text-green-500"
          subValue="Dont 12 recrutés ce mois"
        />
        <StatCard 
          title="Chantiers Actifs" 
          value={sites.filter(s => s.status === 'ongoing').length.toString().padStart(2, '0')} 
          trend="Normal"
          trendColor="text-blue-500"
          subValue="3 en phase de finition"
        />
        <StatCard 
          title="Présence Jour" 
          value="118" 
          trend="95%"
          trendColor="text-emerald-500"
          progress={95}
        />
        <StatCard 
          title="Salaires Restants" 
          value={`$${(employees.reduce((acc, emp) => acc + (emp.salaryTotal - emp.salaryPaid), 0) / 1000).toFixed(1)}k`} 
          trend="A payer"
          trendColor="text-amber-500"
          subValue="Échéance : 5 jours"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sites Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-bold text-slate-800">Chantiers Prioritaires</h4>
            <button className="text-blue-600 text-xs font-semibold hover:underline" onClick={() => setActiveTab('sites')}>Voir tout</button>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Nom du Projet</th>
                  <th className="px-6 py-3">Localisation</th>
                  <th className="px-6 py-3">Avancement</th>
                  <th className="px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-600">
                {sites.map(site => (
                  <tr key={site.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{site.name}</p>
                      <p className="text-xs text-slate-400">CODE: {site.code}</p>
                    </td>
                    <td className="px-6 py-4">{site.location}</td>
                    <td className="px-6 py-4 w-40">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{site.advancement}%</span>
                        <div className="h-[6px] bg-slate-100 flex-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${site.advancement > 90 ? 'bg-emerald-500' : site.advancement < 50 ? 'bg-amber-500' : 'bg-blue-600'}`} 
                            style={{ width: `${site.advancement}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase ${
                        site.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {site.status === 'ongoing' ? 'En Cours' : 'Finition'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <h4 className="font-bold text-slate-800 mb-4">Documents Récents</h4>
          <div className="space-y-4 flex-1">
            {documents.slice(0, 3).map(doc => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-xs ${
                  doc.type === 'invoice' ? 'bg-red-100 text-red-600' : doc.type === 'quote' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {doc.type === 'invoice' ? 'PDF' : doc.type === 'quote' ? 'DOC' : 'XLS'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{doc.title}</p>
                  <p className="text-[10px] text-slate-500 tracking-tight">Généré le {doc.date}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">📥</button>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-slate-900 rounded-lg p-4 text-white">
            <p className="text-xs font-bold mb-1">Statut Système</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <p className="text-[10px] text-slate-400">Serveur SCM Connecté & Sécurisé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Employees Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-bold text-slate-800">Derniers Employés Affectés</h4>
          <button className="text-blue-600 text-xs font-semibold hover:underline" onClick={() => setActiveTab('employees')}>Gérer les employés</button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                <th className="px-6 py-3">Nom & Matricule</th>
                <th className="px-6 py-3">Poste</th>
                <th className="px-6 py-3">Chantier</th>
                <th className="px-6 py-3 text-right">Salaire Payé</th>
                <th className="px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600">
              {employees.slice(0, 5).map(emp => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={emp.photo} className="w-10 h-10 rounded-lg object-cover border border-slate-100" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-slate-800">{emp.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 px-2 py-1 rounded text-[11px] font-bold text-slate-500 uppercase tracking-tight">{emp.position}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-600 font-semibold">{sites.find(s => s.id === emp.assignedSiteId)?.name || 'Non assigné'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-800">${emp.salaryPaid.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Sur ${emp.salaryTotal.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">Actif</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition text-sm" placeholder="Rechercher par nom ou matricule..." />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-3 rounded-xl hover:bg-slate-50 transition font-bold text-sm shadow-sm">
            <Filter size={18} />
            <span>Filtres</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-bold text-sm shadow-sm">
            <Plus size={18} />
            <span>Nouvel Employé</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600" onClick={() => deleteEmployee(emp.id)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img src={emp.photo} className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm" referrerPolicy="no-referrer" />
                <div className={`absolute -bottom-1 -right-1 border-2 border-white w-4 h-4 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>
              
              <h4 className="text-lg font-bold text-slate-800 mb-0.5">{emp.fullName}</h4>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">{emp.position}</p>
              
              <div className="grid grid-cols-2 gap-4 w-full mb-6 py-4 border-y border-slate-50">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Âge</p>
                  <p className="text-sm font-bold text-slate-700">{emp.age} ans</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Matricule</p>
                  <p className="text-sm font-bold text-slate-700">{emp.id}</p>
                </div>
              </div>

              <div className="w-full space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium font-bold uppercase tracking-tighter">Chantier</span>
                  <span className="text-slate-800 font-bold">{sites.find(s => s.id === emp.assignedSiteId)?.name || 'Non assigné'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium font-bold uppercase tracking-tighter">Salaire</span>
                  <span className="text-slate-800 font-bold">${emp.salaryTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full">
                <button className="flex-1 bg-blue-50 text-blue-700 py-2.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition">Détails</button>
                <button className="flex-1 bg-slate-50 text-slate-700 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition">Modifier</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSites = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-slate-800 self-start md:self-center">Gestion des Chantiers</h3>
        <button className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-bold text-sm shadow-sm">
          <Plus size={18} />
          <span>Ajouter un Chantier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sites.map(site => (
          <div key={site.id} className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">{site.name}</h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center">
                    <Building2 size={12} className="mr-1 text-blue-600" />
                    Localisation: {site.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    site.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {site.status === 'ongoing' ? 'En Cours' : 'Terminé'}
                  </span>
                  <button onClick={() => deleteSite(site.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Avancement du Projet</span>
                  <span className="text-xs font-bold text-blue-600">{site.advancement}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${site.advancement}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${site.status === 'ongoing' ? 'bg-blue-600' : 'bg-emerald-500'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-2">
                <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Chef</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{managers.find(m => m.assignedSiteId === site.id)?.fullName || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Staff</p>
                  <p className="text-xs font-bold text-slate-800">{employees.filter(e => e.assignedSiteId === site.id).length} Ouvriers</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Code</p>
                  <p className="text-xs font-bold text-slate-800">{site.code}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white flex items-center justify-between">
              <div className="flex -space-x-2">
                {employees.filter(e => e.assignedSiteId === site.id).slice(0, 4).map(emp => (
                  <img key={emp.id} src={emp.photo} className="w-8 h-8 rounded-full border-2 border-white object-cover" title={emp.fullName} referrerPolicy="no-referrer" />
                ))}
                {employees.filter(e => e.assignedSiteId === site.id).length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                    +{employees.filter(e => e.assignedSiteId === site.id).length - 4}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition">Détails</button>
                <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition">Modifier</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1">Sélectionner Chantier</label>
            <select className="w-full bg-slate-50 border border-slate-100 text-sm font-bold rounded-xl px-4 py-3 text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500">
              <option value="all">Tous les chantiers</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="w-full md:w-48">
             <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1">Date</label>
             <input type="date" className="w-full bg-slate-50 border border-slate-100 text-sm font-bold rounded-xl px-4 py-3 text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500" defaultValue="2024-04-21" />
          </div>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-bold text-sm shadow-sm">
          <Download size={18} />
          <span>Exporter Rapport</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 text-sm">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h4 className="font-bold text-slate-800 mb-6 flex justify-between">
              Résumé du jour
              <span className="text-[10px] text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-50 rounded">21 Avril 2024</span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center space-x-3 text-emerald-700 font-bold">
                  <CheckCircle2 size={24} />
                  <span>Présents</span>
                </div>
                <span className="text-2xl font-black text-emerald-700 tracking-tighter">114</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center space-x-3 text-red-700 font-bold">
                  <X size={24} />
                  <span>Absents</span>
                </div>
                <span className="text-2xl font-black text-red-700 tracking-tighter">08</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center space-x-3 text-amber-700 font-bold">
                  <Clock size={24} />
                  <span>Retards</span>
                </div>
                <span className="text-2xl font-black text-amber-700 tracking-tighter">02</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6">Graphique de présence</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Lun', p: 110 }, { name: 'Mar', p: 115 }, { name: 'Mer', p: 108 }, 
                  { name: 'Jeu', p: 112 }, { name: 'Ven', p: 114 }, { name: 'Sam', p: 98 }
                ]}>
                  <Bar dataKey="p" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-bold text-slate-800">Cahier de Présence</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" placeholder="Chercher un employé..." />
            </div>
          </div>
           <div className="overflow-x-auto no-scrollbar flex-1">
             <table className="w-full text-left border-collapse min-w-[500px]">
               <thead>
                 <tr className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                   <th className="px-6 py-4">Travailleur</th>
                   <th className="px-6 py-4">Chantier</th>
                   <th className="px-6 py-4 text-center">Status</th>
                   <th className="px-6 py-4">Action</th>
                 </tr>
               </thead>
               <tbody className="text-sm text-slate-600">
                 {employees.map(emp => (
                   <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                     <td className="px-6 py-4 flex items-center space-x-3">
                       <img src={emp.photo} className="w-10 h-10 rounded-lg object-cover border border-slate-100" referrerPolicy="no-referrer" />
                       <div>
                         <p className="font-bold text-slate-800">{emp.fullName}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {emp.id}</p>
                       </div>
                     </td>
                     <td className="px-6 py-4 font-semibold text-slate-700">
                       {sites.find(s => s.id === emp.assignedSiteId)?.name || 'N/A'}
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex justify-center">
                         <span className="flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase border border-emerald-100 shadow-sm shadow-emerald-500/5">
                           <CheckCircle2 size={12} />
                           <span>Présent</span>
                         </span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <button className="text-slate-400 hover:text-blue-600 transition-colors"><MoreVertical size={18} /></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );

  const renderSalaries = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-slate-900 p-8 rounded-xl text-white shadow-[0_10px_40px_-15px_rgba(15,23,42,0.3)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="relative z-10 space-y-3">
          <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">Masse salariale totale dûe</p>
          <h2 className="text-5xl font-black tracking-tighter">
            ${(employees.reduce((acc, emp) => acc + emp.salaryTotal, 0)).toLocaleString()}.<span className="text-blue-400">00</span>
          </h2>
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <Users size={14} />
            <span>Basé sur {employees.length} employés actifs ce mois</span>
          </div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 min-w-[200px]">
             <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Déjà Payé</p>
             <p className="text-2xl font-bold text-emerald-400 tracking-tight">$8,250</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 min-w-[200px]">
             <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Reste à Payer</p>
             <p className="text-2xl font-bold text-amber-400 tracking-tight">$6,250</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center">
           <h4 className="font-bold text-slate-800">Détails des Paies</h4>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" placeholder="Chercher un employé..." />
           </div>
         </div>
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
               <th className="px-6 py-4">Employé</th>
               <th className="px-6 py-4">Salaire Mensuel</th>
                           <th className="px-6 py-4">Balance</th>
               <th className="px-6 py-4">Action</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {employees.map(emp => (
               <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4 flex items-center space-x-3">
                   <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 uppercase">{emp.fullName.substring(0,2)}</div>
                   <div>
                     <p className="text-sm font-bold text-slate-800">{emp.fullName}</p>
                     <p className="text-[10px] text-slate-400 font-bold">{emp.position}</p>
                   </div>
                 </td>
                 <td className="px-6 py-4 font-bold text-slate-700">${emp.salaryTotal.toLocaleString()}</td>
                 <td className="px-6 py-4 text-emerald-600 font-bold">${emp.salaryPaid.toLocaleString()}</td>
                 <td className="px-6 py-4 font-black text-red-500">${(emp.salaryTotal - emp.salaryPaid).toLocaleString()}</td>
                 <td className="px-6 py-4">
                   <button 
                     className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-blue-700"
                     onClick={() => updateEmployee(emp.id, { salaryPaid: emp.salaryTotal })}
                   >
                     Payer Reste
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Nouvelle Facture', icon: FileText, color: 'bg-blue-600' },
          { label: 'Nouveau Devis', icon: TrendingUp, color: 'bg-indigo-600' },
          { label: 'Nouveau Reçu', icon: DollarSign, color: 'bg-emerald-600' },
          { label: 'Fiche Employé', icon: Users, color: 'bg-amber-600' },
        ].map((btn, i) => (
          <button key={i} className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-all group overflow-hidden relative">
            <div className={`p-4 rounded-xl ${btn.color} text-white mb-3 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform relative z-10`}>
              <btn.icon size={24} />
            </div>
            <span className="text-xs font-bold text-slate-700 relative z-10 uppercase tracking-tight">{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
           <div>
             <h4 className="font-bold text-slate-800">Gestion des Documents</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Archive numérique S.C.M SARL</p>
           </div>
           <div className="flex space-x-2">
             <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400"><Search size={18} /></button>
             <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400"><Filter size={18} /></button>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
           {documents.map(doc => (
             <div key={doc.id} className="p-6 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer group flex flex-col justify-between h-60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
               <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-lg ${doc.type === 'invoice' ? 'bg-blue-100 text-blue-600' : doc.type === 'quote' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded mb-2 uppercase tracking-tighter shadow-sm">Archive</span>
                    <Download size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
               </div>
               <div>
                  <h4 className="font-bold text-slate-800 mb-1 text-sm group-hover:text-blue-600 transition-colors leading-tight uppercase tracking-tight">{doc.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{doc.id} • {doc.date}</p>
               </div>
               <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5 tracking-tighter">Bénéficiaire</p>
                    <p className="text-xs font-bold text-slate-700">{doc.clientName}</p>
                  </div>
                  <p className="text-xl font-black text-slate-800 tracking-tighter">${doc.amount?.toLocaleString()}</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Rapport des Présences', progress: 98, color: 'bg-emerald-500', icon: ClipboardCheck },
            { label: 'Rapport des Salaires', progress: 75, color: 'bg-blue-600', icon: DollarSign },
            { label: 'Acompte Chantiers', progress: 42, color: 'bg-amber-500', icon: Building2 },
          ].map((rep, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-6">
               <div className="flex justify-between items-center">
                 <div className={`p-4 rounded-xl ${rep.color} text-white shadow-lg shadow-current/20`}>
                    <rep.icon size={24} />
                 </div>
                 <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><MoreVertical size={20} /></button>
               </div>
               <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base leading-tight uppercase tracking-tight">{rep.label}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mise à jour: Aujourd'hui</p>
               </div>
               <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    <span>Performance</span>
                    <span className="text-slate-800">{rep.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className={`${rep.color} h-full transition-all duration-1000`} style={{ width: `${rep.progress}%` }} />
                  </div>
               </div>
               <button className="w-full py-3 bg-slate-50 text-slate-600 text-xs font-bold uppercase rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">Générer Rapport PDF</button>
            </div>
          ))}
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-bold text-slate-800">Activités Récentes Globales</h4>
            <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 tracking-wider">Temps Réel</span>
          </div>
          <div className="space-y-6">
             {[
               { icon: Users, text: 'Nouvel employé ajouté: Karim Mansour', time: 'Il y a 5 min', color: 'text-blue-600', bg: 'bg-blue-50' },
               { icon: CheckCircle2, text: 'Présences validées pour Chantier Villa Horizon', time: 'Il y a 1 heure', color: 'text-emerald-600', bg: 'bg-emerald-50' },
               { icon: DollarSign, text: 'Paiement effectué: $800 à Pierre Malu', time: 'Il y a 3 heures', color: 'text-amber-600', bg: 'bg-amber-50' },
               { icon: FileText, text: 'Devis généré pour Immeuble Sky (#QS-002)', time: 'Hier', color: 'text-indigo-600', bg: 'bg-indigo-50' },
             ].map((act, i) => (
               <div key={i} className="flex items-center space-x-4 group cursor-pointer">
                  <div className={`p-3 rounded-xl ${act.bg} ${act.color} group-hover:scale-110 transition-transform shadow-sm`}>
                    <act.icon size={18} />
                  </div>
                  <div className="flex-1 pb-4 group-last:pb-0 group-last:border-none">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{act.text}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{act.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'employees': return renderEmployees();
      case 'sites': return renderSites();
      case 'attendance': return renderAttendance();
      case 'salaries': return renderSalaries();
      case 'documents': return renderDocs();
      case 'reports': return renderReports();
      case 'profile': return <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest shadow-inner">Page de Profil Administrateur</div>;
      default: return renderDashboard();
    }
  };

  return (
    <Layout 
      userRole="admin" 
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

export default AdminDashboard;
