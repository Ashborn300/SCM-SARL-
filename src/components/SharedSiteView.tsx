import React, { useEffect, useState } from 'react';
import { 
  Building2, MapPin, Calendar, Users, 
  HardHat, CheckCircle2, Circle, Clock,
  ArrowLeft, Camera, LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ConstructionSite, Employee, Manager } from '../types';

const SharedSiteView: React.FC<{ siteId: string }> = ({ siteId }) => {
  const [site, setSite] = useState<ConstructionSite | null>(null);
  const [manager, setManager] = useState<Manager | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const siteDoc = await getDoc(doc(db, 'sites', siteId));
        if (siteDoc.exists()) {
          const siteData = { id: siteDoc.id, ...siteDoc.data() } as ConstructionSite;
          setSite(siteData);

          // Fetch Manager
          if (siteData.managerId) {
            const managerDoc = await getDoc(doc(db, 'managers', siteData.managerId));
            if (managerDoc.exists()) {
              setManager({ id: managerDoc.id, ...managerDoc.data() } as Manager);
            }
          }

          // Fetch Employees
          if (siteData.employeeIds && siteData.employeeIds.length > 0) {
            const empPromises = siteData.employeeIds.map(id => getDoc(doc(db, 'employees', id)));
            const empDocs = await Promise.all(empPromises);
            const empData = empDocs
              .filter(d => d.exists())
              .map(d => ({ id: d.id, ...d.data() } as Employee));
            setEmployees(empData);
          }
        }
      } catch (error) {
        console.error("Error fetching shared site:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Chargement du Chantier...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <LayoutDashboard size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Chantier introuvable</h1>
          <p className="text-slate-500 text-sm italic">Désolé, ce lien de partage semble invalide ou le chantier n'existe plus.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      {/* Header */}
      <div className="bg-[#0F172A] text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-4">
            <Building2 size={14} />
            <span>Portail Client S.C.M SARL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{site.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <MapPin size={16} />
              <span>{site.location}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Calendar size={16} />
              <span>Fin prévue : {site.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 space-y-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 relative flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * site.advancement) / 100}
                className="text-blue-600 transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-2xl font-black text-slate-800">{site.advancement}%</span>
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-800">Avancement Global</h2>
            <p className="text-slate-500 text-sm italic leading-relaxed">
              {site.description || "Suivez en temps réel l'évolution de votre projet de construction géré par S.C.M SARL."}
            </p>
          </div>
          <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 font-bold uppercase tracking-widest text-xs">
            {site.status === 'ongoing' ? 'En Cours' : site.status === 'finished' ? 'Terminé' : 'Suspendu'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Flow/Personnel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Steps Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center space-x-3">
                <Clock className="text-blue-600" />
                <span>Étapes du Chantier</span>
              </h3>
              <div className="space-y-6">
                {(site.steps || []).length > 0 ? (
                  site.steps?.map((step, idx) => (
                    <div key={step.id} className="flex gap-4 relative group">
                      {idx !== (site.steps?.length || 0) - 1 && (
                        <div className="absolute left-3.5 top-8 w-0.5 h-10 bg-slate-100 group-hover:bg-blue-100 transition-colors" />
                      )}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                        step.completed ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {step.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <div className="pt-0.5">
                        <p className={`text-sm font-bold ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                          {step.completed ? 'Finalisée' : 'En attente'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm italic py-4">Aucune étape définie pour le moment.</p>
                )}
              </div>
            </div>

            {/* Photos Gallery */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center space-x-3">
                <Camera className="text-indigo-600" />
                <span>Galerie Photos</span>
              </h3>
              {(site.photos || []).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono italic">
                  {site.photos?.map((photo, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      <img 
                        src={photo} 
                        alt={`Chantier ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <Camera className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Aucune photo disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Personnel */}
          <div className="space-y-8">
            {/* Manager Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] -mr-16 -mt-16" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center space-x-2">
                <HardHat size={14} className="text-blue-500" />
                <span>Chef de Chantier</span>
              </h3>
              {manager ? (
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-lg">
                    <img 
                      src={manager.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${manager.name}`} 
                      alt={manager.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">{manager.fullName}</h4>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Directeur Technique</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">Non assigné</p>
              )}
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center space-x-2">
                <Users size={14} className="text-blue-600" />
                <span>Équipe assignée</span>
              </h3>
              <div className="space-y-6">
                {employees.length > 0 ? (
                  employees.map(emp => (
                    <div key={emp.id} className="flex items-center space-x-4 group">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                        <img 
                          src={emp.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} 
                          alt={emp.fullName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 tracking-tight">{emp.fullName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{emp.position}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs italic">Aucun employé assigné.</p>
                )}
              </div>
            </div>
            
            {/* Footer Branding */}
            <div className="text-center pt-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">S.C.M SARL Management</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4 leading-relaxed">
                Expertise en construction & génie civil à Kinshasa et sur toute la RDC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedSiteView;
