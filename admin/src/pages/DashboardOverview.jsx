import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, GraduationCap, Briefcase, Activity, Calendar, UserPlus, FileText, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ users: 0, applications: 0, requests: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const [statsRes, activityRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/admin/recent-activity`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      
      setStats(statsData || {});
      setActivity(Array.isArray(activityData) ? activityData : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back. Here is what's happening today.</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
          <Activity size={16} className="text-orange" /> Refresh Data
        </button>
      </div>
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-orange/30 transition-colors group relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange/5 rounded-full blur-xl group-hover:bg-orange/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-orange/10 rounded-2xl text-orange"><Users size={24} /></div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full"><ArrowUpRight size={14}/> 12%</span>
          </div>
          <h3 className="text-4xl font-display font-bold text-gray-900 mb-1">{stats.users}</h3>
          <p className="text-sm text-gray-500 font-bold tracking-wider uppercase">Total Users</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-500/30 transition-colors group relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500"><GraduationCap size={24} /></div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full"><ArrowUpRight size={14}/> 8%</span>
          </div>
          <h3 className="text-4xl font-display font-bold text-gray-900 mb-1">{stats.applications}</h3>
          <p className="text-sm text-gray-500 font-bold tracking-wider uppercase">Applications</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-purple-500/30 transition-colors group relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-600"><Briefcase size={24} /></div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full"><ArrowUpRight size={14}/> 24%</span>
          </div>
          <h3 className="text-4xl font-display font-bold text-gray-900 mb-1">{stats.requests}</h3>
          <p className="text-sm text-gray-500 font-bold tracking-wider uppercase">Service Requests</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: Recent Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Activity size={20} className="text-orange" /> Recent Activity</h2>
              <Link to="/users" className="text-sm font-bold text-orange hover:underline">View All</Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {activity.length > 0 ? activity.map((item, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-xl shrink-0 ${
                    item.type === 'user' ? 'bg-orange/10 text-orange' :
                    item.type === 'application' ? 'bg-blue-100 text-blue-500' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {item.type === 'user' && <UserPlus size={18} />}
                    {item.type === 'application' && <FileText size={18} />}
                    {item.type === 'request' && <Briefcase size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      <span className="font-bold">{item.name}</span>
                      {item.type === 'user' && ' registered a new account.'}
                      {item.type === 'application' && ` submitted an application for ${item.target}.`}
                      {item.type === 'request' && ` requested the service ${item.target}.`}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12}/> {new Date(item.created_at).toLocaleString()}</span>
                      {item.status && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'pending' ? 'bg-orange/10 text-orange' : 
                          item.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-500">No recent activity found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: System Health & Actions */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><CheckCircle2 size={20} className="text-green-500" /> Platform Health</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                  <span>Student Engagement</span>
                  <span>78%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[78%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                  <span>Client Conversion</span>
                  <span>42%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[42%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                  <span>Application Processing</span>
                  <span>95%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[95%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1A2E35] to-[#122328] p-8 rounded-[2rem] text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange rounded-full blur-[50px] opacity-20"></div>
            <h3 className="text-xl font-display font-bold mb-2">Quick Actions</h3>
            <p className="text-gray-400 text-sm mb-6">Need to jump straight into tasks?</p>
            
            <div className="space-y-3 relative z-10">
              <Link to="/internships/new" className="block w-full py-3 bg-white/10 hover:bg-white/20 text-center rounded-xl font-bold transition-colors text-sm">
                + Create Internship
              </Link>
              <Link to="/applications" className="block w-full py-3 bg-orange text-center rounded-xl font-bold hover:bg-orange-dark transition-colors text-sm">
                Review Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
