import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      login(data.token, data.user);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#F8F9FA] dark:bg-[#050B14] flex items-center justify-center relative overflow-hidden transition-colors duration-500">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10 translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {/* Social proof pill */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-orange/60 to-orange border-2 border-white dark:border-[#0B132B] flex items-center justify-center text-white text-[10px] font-bold">{String.fromCharCode(64+i)}</div>
              ))}
            </div>
            <span className="text-sm font-medium text-grey-medium dark:text-white/60 flex items-center gap-1.5">
              <Users size={14} className="text-orange" />
              Join <strong className="text-grey-dark dark:text-white">5,000+</strong> professionals on EDIZO
            </span>
          </div>

          <div className="bg-white dark:bg-[#0B132B] p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden border border-grey-silver dark:border-white/10 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange">
                <LogIn size={32} />
              </div>
              <h1 className="text-3xl font-display font-bold text-grey-dark dark:text-white mb-2">Welcome Back</h1>
              <p className="text-grey-medium dark:text-white/60">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium text-center border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-grey-dark dark:text-white">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium dark:text-white/50" size={20} />
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-grey-silver dark:border-white/10 focus:border-orange focus:outline-none transition-colors bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-grey-dark dark:text-white">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-orange hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium dark:text-white/50" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-grey-silver dark:border-white/10 focus:border-orange focus:outline-none transition-colors bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-medium dark:text-white/50 hover:text-orange transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="login-submit"
                disabled={isLoading}
                className="w-full py-4 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition-all shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5 mt-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-grey-medium dark:text-white/60">
              <ShieldCheck size={14} className="text-green-500" />
              Secured with 256-bit SSL encryption
            </div>

            <p className="text-center text-grey-medium dark:text-white/60 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange font-bold hover:underline">Register here</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
