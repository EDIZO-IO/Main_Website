import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {  Lock, Mail, ArrowRight } from 'lucide-react';
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
      // Assuming backend is running on port 5000
      const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Access denied. Admin only.');
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
    <div className="min-h-screen pt-32 pb-24 bg-grey-light flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="premium-card max-w-md mx-auto p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mx-auto mb-4">
              <img src={logoImg} alt="EDIZO Logo" className="h-14 w-auto object-contain" />
              <img src={nameImg} alt="EDIZO" className="h-8 w-auto object-contain mt-2" />
            </div>
            <h1 className="text-3xl font-display font-bold text-grey-dark mb-2">Welcome Back</h1>
            <p className="text-grey-medium">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-grey-dark">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-grey-light focus:border-orange focus:outline-none transition-colors bg-grey-light focus:bg-white text-grey-dark" 
                  placeholder="john@example.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-grey-dark">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-grey-light focus:border-orange focus:outline-none transition-colors bg-grey-light focus:bg-white text-grey-dark" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition-all shadow-[0_8px_20px_rgba(255,106,61,0.3)] hover:shadow-[0_8px_25px_rgba(255,106,61,0.4)] hover:-translate-y-1 mt-8 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
