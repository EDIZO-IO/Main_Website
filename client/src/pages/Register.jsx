import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, Mail, ArrowRight, Briefcase, Eye, EyeOff, ShieldCheck, Users, CheckCircle2, AlertCircle } from 'lucide-react';

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
  if (score === 3) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordMatch = confirmPassword && password === confirmPassword;
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordMismatch) { setError('Passwords do not match'); return; }
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
    <div className="min-h-screen pt-32 pb-24 bg-[#F8F9FA] dark:bg-[#050B14] flex items-center justify-center relative overflow-hidden transition-colors duration-500">
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
                <UserPlus size={32} />
              </div>
              <h1 className="text-3xl font-display font-bold text-grey-dark dark:text-white mb-2">Create Account</h1>
              <p className="text-grey-medium dark:text-white/60">Join Edizo to request services or apply for internships</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium text-center border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selector */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === 'user' ? 'border-orange bg-orange/10 text-orange font-bold' : 'border-grey-silver dark:border-white/10 bg-grey-light dark:bg-[#060B13] text-grey-medium dark:text-white/70 hover:bg-white dark:hover:bg-white/5'}`}
                >
                  <User size={18} /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === 'client' ? 'border-orange bg-orange/10 text-orange font-bold' : 'border-grey-silver dark:border-white/10 bg-grey-light dark:bg-[#060B13] text-grey-medium dark:text-white/70 hover:bg-white dark:hover:bg-white/5'}`}
                >
                  <Briefcase size={18} /> Client
                </button>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-grey-dark dark:text-white">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium dark:text-white/50" size={20} />
                  <input
                    type="text"
                    id="register-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-grey-silver dark:border-white/10 focus:border-orange focus:outline-none transition-colors bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-grey-dark dark:text-white">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium dark:text-white/50" size={20} />
                  <input
                    type="email"
                    id="register-email"
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
                <label className="text-sm font-bold text-grey-dark dark:text-white">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium dark:text-white/50" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="register-password"
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

                {/* Strength Meter */}
                {password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1.5">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-grey-silver dark:bg-white/10'}`} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-grey-medium dark:text-white/60">Password strength</span>
                      <span className={`font-bold ${strength.score <= 1 ? 'text-red-500' : strength.score === 2 ? 'text-yellow-600' : strength.score === 3 ? 'text-blue-500' : 'text-green-500'}`}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-grey-dark dark:text-white">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium dark:text-white/50" size={20} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="register-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none transition-colors bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white ${
                      passwordMismatch ? 'border-red-400 focus:border-red-400' : passwordMatch ? 'border-green-400 focus:border-green-400' : 'border-grey-silver dark:border-white/10 focus:border-orange'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-medium dark:text-white/50 hover:text-orange transition-colors"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {/* Match indicator */}
                  {confirmPassword && (
                    <div className={`absolute right-12 top-1/2 -translate-y-1/2 ${passwordMatch ? 'text-green-500' : 'text-red-500'}`}>
                      {passwordMatch ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                  )}
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                id="register-submit"
                disabled={isLoading || !!passwordMismatch}
                className="w-full py-4 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition-all shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5 mt-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-grey-medium dark:text-white/60">
              <ShieldCheck size={14} className="text-green-500" />
              Your data is protected under DPDP Act 2023
            </div>

            <p className="text-center text-grey-medium dark:text-white/60 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-orange font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
