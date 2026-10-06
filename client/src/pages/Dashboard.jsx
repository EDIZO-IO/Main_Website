import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FileText, Briefcase, Calendar, Clock, CheckCircle2, ChevronRight,
  User, PlusCircle, LayoutGrid, Bell, Settings, Edit3, Save, X,
  Phone, Mail, BadgeCheck, TrendingUp, Layers, ArrowRight, Eye
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TabBtn = ({ active, onClick, icon: Icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
      active
        ? 'bg-[#0B132B] dark:bg-white text-white dark:text-[#0B132B] shadow-lg'
        : 'bg-white dark:bg-[#0B132B] text-grey-medium dark:text-white/60 hover:text-grey-dark dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 border border-grey-silver dark:border-white/10'
    }`}
  >
    <Icon size={16} />
    {label}
    {badge > 0 && (
      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ icon: Icon, value, label, color, border }) => (
  <div className={`bg-white dark:bg-[#0B132B] p-6 rounded-3xl border ${border} shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center group cursor-default`}>
    <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mb-4 transition-colors`}>
      <Icon size={22} />
    </div>
    <h3 className="text-4xl font-display font-bold text-grey-dark dark:text-white mb-1">{value}</h3>
    <p className="text-xs font-bold text-grey-medium dark:text-white/60 uppercase tracking-wider">{label}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900',
    approved: 'bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900',
    completed: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900',
    rejected: 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900',
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${map[status] || map.pending}`}>
      {status}
    </span>
  );
};

const Pipeline = ({ status }) => {
  const stages = ['Submitted', 'Review', 'Decision'];
  const idx = status === 'pending' ? 1 : status === 'approved' || status === 'rejected' || status === 'completed' ? 2 : 0;
  const barColor = status === 'approved' || status === 'completed' ? 'bg-green-500' : status === 'rejected' ? 'bg-red-500' : 'bg-blue-500';
  const barWidth = idx === 0 ? 'w-0' : idx === 1 ? 'w-1/2' : 'w-full';

  return (
    <div className="mt-5 pt-5 border-t border-grey-silver dark:border-white/10">
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-grey-silver dark:bg-white/10 -translate-y-1/2 rounded-full" />
        <div className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-700 ${barColor} ${barWidth}`} />
        <div className="relative flex justify-between z-10">
          {stages.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-4 border-white dark:border-[#0B132B] shadow-sm ${i === 0 ? 'bg-orange' : i <= idx ? barColor : 'bg-grey-silver dark:bg-white/20'}`} />
              <span className="text-[10px] font-bold text-grey-medium dark:text-white/60 uppercase">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Profile Tab ---
const ProfileTab = ({ user, token }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name || '', phone: user.phone || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Update failed');
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0B132B] rounded-3xl border border-grey-silver dark:border-white/10 shadow-sm p-8 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white">My Profile</h2>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-grey-light dark:bg-[#060B13] hover:bg-orange/5 border border-grey-silver dark:border-white/10 hover:border-orange/30 rounded-xl text-sm font-bold text-grey-dark dark:text-white hover:text-orange transition-all">
            <Edit3 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-4 py-2.5 bg-grey-light dark:bg-[#060B13] border border-grey-silver dark:border-white/10 rounded-xl text-sm font-bold text-grey-medium dark:text-white/60 hover:bg-grey-silver dark:hover:bg-white/5 transition-all">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-5 py-2.5 bg-orange text-white rounded-xl text-sm font-bold hover:bg-orange-dark transition-all disabled:opacity-70">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-2xl text-green-700 dark:text-green-400 font-medium text-sm flex items-center gap-2">
          <CheckCircle2 size={18} /> Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-400 font-medium text-sm">{error}</div>
      )}

      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-white font-display font-bold text-3xl shadow-lg shadow-orange/20">
          {(form.name || user.name)?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-orange uppercase tracking-wider">{user.role} Account</span>
            <BadgeCheck size={16} className="text-orange" />
          </div>
          <p className="text-xl font-bold text-grey-dark dark:text-white">{form.name || user.name}</p>
          <p className="text-grey-medium dark:text-white/60 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-grey-medium dark:text-white/60 uppercase tracking-wider flex items-center gap-2"><User size={13} /> Full Name</label>
          {editing ? (
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-orange/30 focus:border-orange focus:outline-none text-grey-dark dark:text-white bg-white dark:bg-[#060B13] font-medium" />
          ) : (
            <p className="px-4 py-3 bg-grey-light dark:bg-[#060B13] rounded-xl text-grey-dark dark:text-white font-medium border border-grey-silver dark:border-white/10">{form.name || '—'}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-grey-medium dark:text-white/60 uppercase tracking-wider flex items-center gap-2"><Mail size={13} /> Email</label>
          <p className="px-4 py-3 bg-grey-light dark:bg-[#060B13] rounded-xl text-grey-dark dark:text-white font-medium text-sm border border-grey-silver dark:border-white/10">{user.email}</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-grey-medium dark:text-white/60 uppercase tracking-wider flex items-center gap-2"><Phone size={13} /> Phone</label>
          {editing ? (
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-xl border-2 border-orange/30 focus:border-orange focus:outline-none text-grey-dark dark:text-white bg-white dark:bg-[#060B13] font-medium" />
          ) : (
            <p className="px-4 py-3 bg-grey-light dark:bg-[#060B13] rounded-xl text-grey-dark dark:text-white font-medium border border-grey-silver dark:border-white/10">{form.phone || '—'}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-grey-medium dark:text-white/60 uppercase tracking-wider flex items-center gap-2"><Layers size={13} /> Account Type</label>
          <p className="px-4 py-3 bg-grey-light dark:bg-[#060B13] rounded-xl text-grey-dark dark:text-white font-medium capitalize border border-grey-silver dark:border-white/10">{user.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Dashboard ---
const Dashboard = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchAll = async () => {
      try {
        const [dashRes, notifRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/notifications`, { headers: { 'Authorization': `Bearer ${token}` } }).catch(() => null),
        ]);
        if (dashRes.ok) setData(await dashRes.json());
        if (notifRes && notifRes.ok) {
          const n = await notifRes.json();
          setNotifications(Array.isArray(n) ? n.filter(x => !x.read) : []);
        }
      } catch (e) {
        console.error('Dashboard fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#050B14]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  const isClient = user.role === 'client';
  const items = isClient ? (data?.requests || []) : (data?.applications || []);
  const total = items.length;
  const pending = items.filter(r => r.status === 'pending').length;
  const approved = items.filter(r => r.status === 'approved').length;
  const completed = items.filter(r => r.status === 'completed').length;

  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#F8F9FA] dark:bg-[#050B14] font-sans transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Welcome Banner */}
        <motion.div {...fadeIn} className="relative bg-[#070F26] rounded-[2.5rem] p-8 md:p-12 mb-8 overflow-hidden text-white shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange rounded-full mix-blend-screen filter blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center font-display font-bold text-2xl border border-white/15 backdrop-blur-md text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-orange uppercase tracking-wider">{user.role} Account</span>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Welcome back, {user.name}</h1>
              <p className="text-white/70 text-sm max-w-md">
                {isClient ? 'Manage your service requests and explore new project possibilities.' : 'Track your internship applications and grow your career.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {notifications.length > 0 && (
                <div className="relative">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                    <Bell size={20} className="text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                </div>
              )}
              <button onClick={() => setActiveTab('profile')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors text-sm flex items-center gap-2">
                <Settings size={16} /> Settings
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 flex-wrap mb-8">
          <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutGrid} label="Overview" />
          <TabBtn active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={isClient ? Briefcase : FileText} label={isClient ? 'My Requests' : 'My Applications'} badge={pending} />
          <TabBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile" />
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard icon={LayoutGrid} value={total} label={isClient ? 'Total Projects' : 'Total Apps'} color="bg-grey-light dark:bg-[#060B13] text-grey-medium dark:text-white/60 group-hover:bg-orange/10 group-hover:text-orange" border="border-grey-silver dark:border-white/10 hover:border-orange/20" />
                  <StatCard icon={Clock} value={pending} label="Pending" color="bg-blue-50 dark:bg-blue-950/60 text-blue-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/80" border="border-grey-silver dark:border-white/10 hover:border-blue-200" />
                  <StatCard icon={CheckCircle2} value={approved} label="Approved" color="bg-green-50 dark:bg-green-950/60 text-green-500 group-hover:bg-green-100 dark:group-hover:bg-green-900/80" border="border-grey-silver dark:border-white/10 hover:border-green-200" />
                  <StatCard icon={TrendingUp} value={completed} label="Completed" color="bg-purple-50 dark:bg-purple-950/60 text-purple-500 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/80" border="border-grey-silver dark:border-white/10 hover:border-purple-200" />
                </div>

                {/* Recent Activity Preview */}
                <div>
                  <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white dark:bg-[#0B132B] shadow-sm border border-grey-silver dark:border-white/10 rounded-full flex items-center justify-center">
                      {isClient ? <Briefcase size={15} className="text-orange" /> : <FileText size={15} className="text-orange" />}
                    </div>
                    Recent {isClient ? 'Requests' : 'Applications'}
                  </h2>
                  <div className="bg-white dark:bg-[#0B132B] rounded-3xl border border-grey-silver dark:border-white/10 shadow-sm overflow-hidden">
                    {items.length > 0 ? (
                      <div className="divide-y divide-grey-silver dark:divide-white/10">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.id} className="p-5 flex items-center justify-between hover:bg-grey-light/50 dark:hover:bg-white/5 transition-colors">
                            <div>
                              <p className="font-bold text-grey-dark dark:text-white text-sm mb-0.5">
                                {isClient ? `Project: ${(item.service_title || item.service_id || '').replace(/-/g, ' ')}` : `Role: ${item.internship_title || item.internship_id}`}
                              </p>
                              <p className="text-xs text-grey-medium dark:text-white/60 flex items-center gap-1">
                                <Calendar size={11} /> {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <StatusBadge status={item.status} />
                          </div>
                        ))}
                        {items.length > 3 && (
                          <button onClick={() => setActiveTab('activity')} className="w-full p-4 text-center text-sm font-bold text-orange hover:bg-orange/5 transition-colors flex items-center justify-center gap-1">
                            View all {items.length} items <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-grey-light dark:bg-[#060B13] rounded-full flex items-center justify-center mb-4">
                          <LayoutGrid size={24} className="text-grey-medium dark:text-white/40" />
                        </div>
                        <p className="text-grey-dark dark:text-white font-bold mb-1">No activity yet</p>
                        <p className="text-grey-medium dark:text-white/60 text-sm mb-4">Get started by {isClient ? 'submitting a service request' : 'applying for an internship'}.</p>
                        <Link
                          to={isClient ? '/services' : '/internships'}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange text-white rounded-xl text-sm font-bold hover:bg-orange-dark transition-colors"
                        >
                          <PlusCircle size={16} /> {isClient ? 'Browse Services' : 'Browse Internships'}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#0B132B] p-7 rounded-3xl border border-grey-silver dark:border-white/10 shadow-sm">
                  <h3 className="text-lg font-bold text-grey-dark dark:text-white mb-5">Quick Actions</h3>
                  <div className="space-y-3">
                    {isClient ? (
                      <Link to="/services" className="flex items-center justify-between p-4 bg-grey-light dark:bg-[#060B13] hover:bg-orange/5 border border-grey-silver dark:border-white/10 hover:border-orange/30 rounded-2xl transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white dark:bg-[#0B132B] rounded-full flex items-center justify-center shadow-sm text-orange group-hover:bg-orange group-hover:text-white transition-colors">
                            <PlusCircle size={17} />
                          </div>
                          <span className="font-bold text-grey-dark dark:text-white text-sm">New Service Request</span>
                        </div>
                        <ChevronRight size={15} className="text-grey-medium dark:text-white/50 group-hover:text-orange transition-colors" />
                      </Link>
                    ) : (
                      <Link to="/internships" className="flex items-center justify-between p-4 bg-grey-light dark:bg-[#060B13] hover:bg-orange/5 border border-grey-silver dark:border-white/10 hover:border-orange/30 rounded-2xl transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white dark:bg-[#0B132B] rounded-full flex items-center justify-center shadow-sm text-orange group-hover:bg-orange group-hover:text-white transition-colors">
                            <PlusCircle size={17} />
                          </div>
                          <span className="font-bold text-grey-dark dark:text-white text-sm">Browse Internships</span>
                        </div>
                        <ChevronRight size={15} className="text-grey-medium dark:text-white/50 group-hover:text-orange transition-colors" />
                      </Link>
                    )}
                    <button onClick={() => setActiveTab('activity')} className="w-full flex items-center justify-between p-4 bg-grey-light dark:bg-[#060B13] hover:bg-grey-silver dark:hover:bg-white/5 border border-grey-silver dark:border-white/10 rounded-2xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white dark:bg-[#0B132B] rounded-full flex items-center justify-center shadow-sm text-grey-medium dark:text-white/60">
                          <Eye size={17} />
                        </div>
                        <span className="font-bold text-grey-dark dark:text-white text-sm">View All Activity</span>
                      </div>
                      <ChevronRight size={15} className="text-grey-medium dark:text-white/50" />
                    </button>
                    <Link to="/contact" className="flex items-center justify-between p-4 bg-grey-light dark:bg-[#060B13] hover:bg-grey-silver dark:hover:bg-white/5 border border-grey-silver dark:border-white/10 rounded-2xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white dark:bg-[#0B132B] rounded-full flex items-center justify-center shadow-sm text-grey-medium dark:text-white/60">
                          <User size={17} />
                        </div>
                        <span className="font-bold text-grey-dark dark:text-white text-sm">Contact Support</span>
                      </div>
                      <ChevronRight size={15} className="text-grey-medium dark:text-white/50" />
                    </Link>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange to-orange-dark p-7 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-orange/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20" />
                  <h3 className="text-lg font-display font-bold mb-2 relative z-10">Need Help?</h3>
                  <p className="text-white/80 text-sm mb-5 relative z-10 leading-relaxed">
                    Our engineering and support team is always available to assist you.
                  </p>
                  <Link to="/contact" className="block w-full py-3 bg-white text-orange font-bold rounded-xl text-sm text-center hover:bg-grey-light transition-colors relative z-10">
                    Contact Support →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <motion.div key="activity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white">
                  {isClient ? 'Service Requests' : 'Internship Applications'}
                  <span className="ml-3 text-base font-bold text-grey-medium dark:text-white/60">({items.length})</span>
                </h2>
                <Link
                  to={isClient ? '/services' : '/internships'}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl text-sm font-bold hover:bg-orange-dark transition-all shadow-sm"
                >
                  <PlusCircle size={15} /> {isClient ? 'New Request' : 'Apply Now'}
                </Link>
              </div>

              <div className="bg-white dark:bg-[#0B132B] rounded-3xl border border-grey-silver dark:border-white/10 shadow-sm overflow-hidden">
                {items.length > 0 ? (
                  <div className="divide-y divide-grey-silver dark:divide-white/10">
                    {items.map((item) => (
                      <div key={item.id} className="p-6 hover:bg-grey-light/50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-bold text-grey-dark dark:text-white text-base mb-0.5">
                              {isClient
                                ? `Project: ${(item.service_title || item.service_id || '').replace(/-/g, ' ').toUpperCase()}`
                                : `Role: ${item.internship_title || item.internship_id}`}
                            </h3>
                            <p className="text-sm text-grey-medium dark:text-white/60 flex items-center gap-2">
                              <Calendar size={13} /> Submitted {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                        <Pipeline status={item.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-grey-light dark:bg-[#060B13] rounded-full flex items-center justify-center mb-5">
                      <LayoutGrid size={32} className="text-grey-medium dark:text-white/40" />
                    </div>
                    <p className="text-grey-dark dark:text-white font-bold text-lg mb-2">Nothing here yet</p>
                    <p className="text-grey-medium dark:text-white/60 text-sm mb-6">You haven't submitted any {isClient ? 'requests' : 'applications'} yet.</p>
                    <Link to={isClient ? '/services' : '/internships'} className="inline-flex items-center gap-2 px-7 py-3 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-all">
                      Get Started <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ProfileTab user={user} token={token} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
