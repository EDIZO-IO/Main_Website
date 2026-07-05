import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FileText, Briefcase, Calendar, Clock, CheckCircle2, ChevronRight, User, PlusCircle, LayoutGrid } from 'lucide-react';

const Dashboard = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (response.ok) {
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange"></div>
      </div>
    );
  }

  const isClient = user.role === 'client';
  const totalItems = isClient ? data?.requests?.length || 0 : data?.applications?.length || 0;
  const pendingItems = isClient 
    ? data?.requests?.filter(r => r.status === 'pending').length || 0 
    : data?.applications?.filter(a => a.status === 'pending').length || 0;
  const approvedItems = isClient 
    ? data?.requests?.filter(r => r.status === 'approved').length || 0 
    : data?.applications?.filter(a => a.status === 'approved').length || 0;

  const items = isClient ? (data?.requests || []) : (data?.applications || []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#F8FAFC] font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Welcome Banner */}
        <motion.div {...fadeIn} className="relative bg-gradient-to-br from-grey-dark to-black rounded-[2.5rem] p-8 md:p-12 mb-10 overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl border border-white/20 backdrop-blur-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-orange uppercase tracking-wider">{user.role} Account</span>
                  <p className="text-white/70 text-sm">{user.email}</p>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Welcome back, {user.name}</h1>
              <p className="text-white/70 max-w-lg">
                {isClient ? 'Manage your active service requests and explore new project possibilities.' : 'Track your internship applications and prepare for your next career step.'}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl font-bold transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center text-orange mb-3">
                  <LayoutGrid size={20} />
                </div>
                <h3 className="text-3xl font-display font-bold text-grey-dark mb-1">{totalItems}</h3>
                <p className="text-xs font-bold text-grey-medium uppercase">Total {isClient ? 'Projects' : 'Apps'}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-3">
                  <Clock size={20} />
                </div>
                <h3 className="text-3xl font-display font-bold text-grey-dark mb-1">{pendingItems}</h3>
                <p className="text-xs font-bold text-grey-medium uppercase">Pending</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-3xl font-display font-bold text-grey-dark mb-1">{approvedItems}</h3>
                <p className="text-xs font-bold text-grey-medium uppercase">Approved</p>
              </div>
            </motion.div>

            {/* Tracker List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-grey-dark mb-6 flex items-center gap-2">
                {isClient ? <Briefcase className="text-orange"/> : <FileText className="text-orange"/>}
                Active {isClient ? 'Service Requests' : 'Applications'}
              </h2>
              
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {items.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-grey-dark mb-1">
                              {isClient ? `Project: ${item.service_id.replace('-', ' ').toUpperCase()}` : `Role: ${item.internship_id}`}
                            </h3>
                            <p className="text-sm text-grey-medium flex items-center gap-2">
                              <Calendar size={14} /> Submitted on {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.status === 'pending' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                            item.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' : 
                            'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        
                        {/* Status Pipeline Visualizer */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                            <div className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-500 ${
                              item.status === 'pending' ? 'w-1/2 bg-blue-500' :
                              item.status === 'approved' ? 'w-full bg-green-500' : 'w-full bg-red-500'
                            }`}></div>
                            
                            <div className="relative flex justify-between z-10">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-orange border-4 border-white shadow-sm"></div>
                                <span className="text-[10px] font-bold text-grey-dark uppercase">Submitted</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm ${item.status === 'pending' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                <span className="text-[10px] font-bold text-grey-dark uppercase">Review</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm ${item.status === 'approved' ? 'bg-green-500' : item.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                <span className="text-[10px] font-bold text-grey-dark uppercase">Decision</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <LayoutGrid size={24} className="text-gray-300" />
                    </div>
                    <p className="text-grey-dark font-bold mb-2">No active items found</p>
                    <p className="text-grey-medium text-sm">You haven't submitted any {isClient ? 'requests' : 'applications'} yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar: Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-grey-dark mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                {isClient ? (
                  <Link to="/services" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-orange/5 border border-gray-100 hover:border-orange/30 rounded-2xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-orange group-hover:bg-orange group-hover:text-white transition-colors">
                        <PlusCircle size={18} />
                      </div>
                      <span className="font-bold text-grey-dark">New Service Request</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-orange transition-colors" />
                  </Link>
                ) : (
                  <Link to="/internships" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-orange/5 border border-gray-100 hover:border-orange/30 rounded-2xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-orange group-hover:bg-orange group-hover:text-white transition-colors">
                        <PlusCircle size={18} />
                      </div>
                      <span className="font-bold text-grey-dark">Browse Internships</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-orange transition-colors" />
                  </Link>
                )}

                <Link to="/contact" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500">
                      <User size={18} />
                    </div>
                    <span className="font-bold text-grey-dark">Contact Support</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange to-orange-dark p-8 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-orange/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20" />
              <h3 className="text-xl font-display font-bold mb-3 relative z-10">Need Help?</h3>
              <p className="text-white/80 text-sm mb-6 relative z-10 leading-relaxed">
                Our support team is always available to help you with your projects or applications.
              </p>
              <button className="w-full py-3 bg-white text-orange font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors relative z-10">
                View FAQ
              </button>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
