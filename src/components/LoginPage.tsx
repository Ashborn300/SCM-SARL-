import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HardHat, AlertCircle, User, Lock } from 'lucide-react';
import { signInAnonymously } from 'firebase/auth';
import { getDoc, doc, query, collection, where, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useData } from '../context/DataContext';

export const LoginPage: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const [matricule, setMatricule] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { triggerDataLoad } = useData();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricule.trim()) return;

    setLoading(true);
    setError('');

    try {
      const cleanMatricule = matricule.trim().toUpperCase();
      
      // Always sign in first so we are authenticated for Firestore checks
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      // Helper to check a specific collection concurrently
      const checkRole = async (colName: string) => {
        let outputData = null;
        try {
          // Fire doc get and both queries all at once
          const qId = query(collection(db, colName), where('id', '==', cleanMatricule));
          const qMat = query(collection(db, colName), where('matricule', '==', cleanMatricule));
          
          const [docRefSnap, snapId, snapMat] = await Promise.all([
            getDoc(doc(db, colName, cleanMatricule)),
            getDocs(qId),
            getDocs(qMat)
          ]);
          
          if (docRefSnap.exists()) {
            outputData = { id: docRefSnap.id, ...docRefSnap.data() };
          } else if (!snapId.empty) {
            outputData = { id: snapId.docs[0].id, ...snapId.docs[0].data() };
          } else if (!snapMat.empty) {
            outputData = { id: snapMat.docs[0].id, ...snapMat.docs[0].data() };
          }
        } catch (e) {
          console.error(`Error checking ${colName}:`, e);
        }
        return outputData;
      };

      // Launch all 3 checks in parallel to massively speed up login ⚡️
      let [adminData, empData, manData] = await Promise.all([
        checkRole('admins'),
        checkRole('employees'),
        checkRole('managers')
      ]);

      // Bootstrap absolute default admin if it doesn't exist yet
      if (!adminData && cleanMatricule === 'SCM00123') {
        const defaultAdmin = {
          id: 'SCM00123',
          matricule: 'SCM00123',
          name: 'Administrateur',
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'admins', 'SCM00123'), defaultAdmin);
        adminData = defaultAdmin;
      }

      if (adminData) {
        localStorage.setItem('scm_user_role', 'admin');
        localStorage.setItem('scm_user_id', adminData.id);
        triggerDataLoad();
        if (onLoginSuccess) onLoginSuccess();
        return;
      }

      if (empData) {
        localStorage.setItem('scm_user_role', 'employee');
        localStorage.setItem('scm_user_id', empData.id);
        triggerDataLoad();
        if (onLoginSuccess) onLoginSuccess();
        return;
      }

      if (manData) {
        localStorage.setItem('scm_user_role', 'manager');
        localStorage.setItem('scm_user_id', manData.id);
        triggerDataLoad();
        if (onLoginSuccess) onLoginSuccess();
        return;
      }

      setError("Matricule non reconnu dans le système.");
      // Note: we stay signed in anonymously, but our local role/id aren't set
      // so App.tsx will keep us on LoginPage.
    } catch (err: any) {
      setError("Connexion impossible. Vérifiez votre accès.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-xl shadow-[0_20px_50px_-15px_rgba(30,41,59,0.1)] overflow-hidden border border-slate-200"
      >
        <div className="bg-slate-900 p-8 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="grid grid-cols-6 gap-2 rotate-12 -translate-x-12 -translate-y-12">
               {Array.from({ length: 24 }).map((_, i) => (
                 <div key={i} className="w-12 h-12 bg-white/20 rounded"></div>
               ))}
            </div>
          </div>
          <div className="relative z-10">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50">
              <HardHat size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase">S.C.M SARL</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Management de Construction</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-slate-800">Portail Sécurisé</h2>
            <p className="text-xs text-slate-500">Saisissez votre matricule ou identifiant admin pour continuer.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center space-x-2 text-[11px] font-bold uppercase border border-red-100"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matricule / Identifiant</label>
              <div className="relative">
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value.toUpperCase())}
                  placeholder="EX: SCM-E001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 uppercase"
                />
                <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !matricule.trim()}
              className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] text-xs tracking-widest uppercase disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  <span>Se Connecter</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 font-medium">
              L'accès est restreint au personnel autorisé de S.C.M SARL.
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-200">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            Système Sécurisé © {new Date().getFullYear()} S.C.M SARL
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
