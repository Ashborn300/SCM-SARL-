import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HardHat, Lock, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (id: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onLogin(id);
    } catch (err: any) {
      setError(err.message);
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

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Matricule d'Accès</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-sm bg-slate-50 shadow-inner"
                placeholder="Ex: SCM00123"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] uppercase text-xs tracking-widest"
          >
            Se Connecter au Portail
          </button>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Comptes de Démo
            </p>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 group cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setId('SCM00123')}>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Admin</span>
                <span className="text-[10px] font-mono text-blue-600 font-bold group-hover:scale-110 transition-transform">SCM00123</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 group cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setId('SCM-M001')}>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Manager</span>
                <span className="text-[10px] font-mono text-blue-600 font-bold group-hover:scale-110 transition-transform">SCM-M001</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 group cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setId('SCM-E001')}>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Employé</span>
                <span className="text-[10px] font-mono text-blue-600 font-bold group-hover:scale-110 transition-transform">SCM-E001</span>
              </div>
            </div>
          </div>
        </form>
        
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
