import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/edizo_logo.png';
import nameImg from '../assets/edizo-name.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role !== 'admin' && data.user.role !== 'super_admin' && data.user.role_id !== 1 && data.user.role_id !== 2) {
        throw new Error('Access denied. Administrator privileges required.');
      }

      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl space-y-6"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mx-auto mb-4">
              <img src={logoImg} alt="EDIZO" className="h-12 w-auto object-contain" />
              <img src={nameImg} alt="EDIZO" className="h-7 w-auto object-contain mt-1" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Console</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">Sign in with authorized administrator credentials</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-xs font-bold text-center border border-red-100 animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700">Administrator Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange focus:bg-white transition-all" 
                  placeholder="admin@edizo.in" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange focus:bg-white transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-orange hover:bg-orange-dark text-white font-bold rounded-xl shadow-lg shadow-orange/20 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-70 mt-6 cursor-pointer"
            >
              {isLoading ? 'Verifying Authorization...' : 'Sign In to Dashboard'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          <div className="border-t border-gray-100 pt-4 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <ShieldCheck size={14} /> 256-Bit SSL Encrypted Admin Portal
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
