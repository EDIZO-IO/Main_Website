import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, Mail, ArrowRight, Briefcase } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'client'
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
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      login(data.token, data.user);
      navigate('/dashboard');
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
            <div className="w-16 h-16 bg-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange">
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-display font-bold text-grey-dark mb-2">Create Account</h1>
            <p className="text-grey-medium">Join Edizo to request services or apply for internships</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === 'user' ? 'border-orange bg-orange/5 text-orange font-bold' : 'border-grey-light bg-grey-light text-grey-medium hover:bg-white'}`}
              >
                <User size={18} /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === 'client' ? 'border-orange bg-orange/5 text-orange font-bold' : 'border-grey-light bg-grey-light text-grey-medium hover:bg-white'}`}
              >
                <Briefcase size={18} /> Client
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-grey-dark">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-grey-light focus:border-orange focus:outline-none transition-colors bg-grey-light focus:bg-white text-grey-dark" 
                  placeholder="John Doe" 
                />
              </div>
            </div>

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
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-center text-grey-medium mt-8">
            Already have an account? <Link to="/login" className="text-orange font-bold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
