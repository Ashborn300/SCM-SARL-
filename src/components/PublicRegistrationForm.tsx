import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HardHat, Camera, Upload, CheckCircle2, 
  ArrowLeft, User, MapPin, Phone, Mail, 
  Calendar, Briefcase, Hash, Info
} from 'lucide-react';
import { signInAnonymously } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const PublicRegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    admissionDate: '',
    birthDate: '',
    matricule: '',
    age: '',
    gender: 'M',
    address: '',
    phone: '',
    email: '',
    position: '',
    photo: '',
    serviceCardPhoto: ''
  });

  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const cardPhotoRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'serviceCardPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) {
      setError('Le nom complet est obligatoire');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Ensure minimal auth to talk to Firestore if rules require it
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      // 2. Use a temporary ID for the registration document
      // The admin will then assign the official matricule (ID) later
      // We'll use a random string as the temporary document ID
      const tempId = `REG-${Math.floor(100000 + Math.random() * 900000)}`;

      const employeeData = {
        ...formData,
        id: tempId,
        matricule: '', // Left empty as requested, admin must fill this
        name: formData.fullName.split(' ')[0],
        age: parseInt(formData.age) || 0,
        salaryTotal: 0,
        salaryPaid: 0,
        assignedSiteId: '',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      // 3. Save to Firestore
      await setDoc(doc(db, 'employees', tempId), employeeData);
      
      setSubmitted(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white max-w-md w-full rounded-2xl p-10 text-center shadow-xl border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Inscription Réussie !</h2>
          <p className="text-slate-500 mb-8 border-b border-slate-100 pb-8">
            Vos informations ont été enregistrées avec succès. 
            <br /><br />
            <span className="font-bold text-blue-600">Note Importante :</span> Votre matricule doit maintenant être validé par l'administration. 
            Vous ne pourrez vous connecter qu'une fois que votre matricule officiel vous aura été communiqué.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-slate-900 border border-slate-800 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition active:scale-[0.98] uppercase tracking-widest text-xs"
          >
            Fermer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="grid grid-cols-8 gap-4 rotate-12 -translate-x-20">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-white rounded-lg"></div>
            ))}
          </div>
        </div>
        
        <div className="max-w-xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20 rotate-3">
            <HardHat size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">S.C.M SARL</h1>
          <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px]">Formulaire d'Inscription du Personnel</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto -mt-10 px-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 pt-8 pb-4 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                <div className="w-8 h-[2px] bg-slate-100"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
               Étape {step} sur 2
             </span>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold uppercase flex items-center space-x-3">
                <Info size={16} />
                <span>{error}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                       <User size={14} />
                       <span>Identité & Contact</span>
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom Complet <span className="text-red-500">*</span></label>
                      <input 
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm font-bold text-slate-700"
                        placeholder="Ex: Jean Mukendi"
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date de Naissance</label>
                        <input 
                          type="date"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm font-bold text-slate-700"
                          value={formData.birthDate}
                          onChange={e => setFormData({...formData, birthDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Âge (Années)</label>
                        <input 
                          type="number"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm font-bold text-slate-700"
                          placeholder="Ex: 28"
                          value={formData.age}
                          onChange={e => setFormData({...formData, age: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Genre</label>
                        <select 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm font-bold text-slate-700"
                          value={formData.gender}
                          onChange={e => setFormData({...formData, gender: e.target.value})}
                        >
                          <option value="M">Masculin</option>
                          <option value="F">Féminin</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Téléphone</label>
                        <input 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm font-bold text-slate-700"
                          placeholder="+243 ..."
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adresse Physique</label>
                      <input 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm font-bold text-slate-700"
                        placeholder="Quartier, Commune, Ville"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 active:scale-[0.98] uppercase tracking-widest text-xs"
                  >
                    Suivant: Photos & Profil
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Photo de Profil</label>
                       <div 
                         className="w-32 h-32 rounded-3xl border-4 border-slate-50 bg-slate-100 overflow-hidden relative cursor-pointer group shadow-xl"
                         onClick={() => profilePhotoRef.current?.click()}
                       >
                         {formData.photo ? (
                           <img src={formData.photo} alt="Profil" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition">
                             <Camera size={32} />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Upload size={20} className="text-white" />
                         </div>
                       </div>
                       <input type="file" ref={profilePhotoRef} className="hidden" accept="image/*" onChange={e => handlePhotoUpload(e, 'photo')} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Poste / Métier</label>
                      <input 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm font-bold text-slate-700"
                        placeholder="Ex: Maçon"
                        value={formData.position}
                        onChange={e => setFormData({...formData, position: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Carte de Service (Scan/Photo)</label>
                       <div 
                         className="w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 transition group overflow-hidden"
                         onClick={() => cardPhotoRef.current?.click()}
                       >
                         {formData.serviceCardPhoto ? (
                            <img src={formData.serviceCardPhoto} alt="Carte" className="w-full h-full object-cover" />
                         ) : (
                           <>
                             <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 mb-2 transition">
                               <Upload size={20} />
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase">Importer la carte</span>
                           </>
                         )}
                       </div>
                       <input type="file" ref={cardPhotoRef} className="hidden" accept="image/*" onChange={e => handlePhotoUpload(e, 'serviceCardPhoto')} />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-none p-5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-slate-900 border border-slate-800 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition shadow-xl shadow-slate-900/20 active:scale-[0.98] uppercase tracking-widest text-xs flex items-center justify-center space-x-3"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>Finaliser Inscription</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          S.C.M SARL | Système d'Enregistrement Sécurisé
        </p>
      </div>
    </div>
  );
};

export default PublicRegistrationForm;
