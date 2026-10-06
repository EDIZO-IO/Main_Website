import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, GraduationCap, Briefcase, Activity, Calendar, UserPlus, 
  FileText, ArrowUpRight, CheckCircle2, Layers, TrendingUp, Clock, 
  Headphones, MessageSquare, ArrowRight, Check, Sparkles, AlertCircle,
  FolderPlus, Send, Settings, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [activity, setActivity] = useState([]);
  const [whatsappStatus, setWhatsappStatus] = useState({ connected: false, info: null });
  const [timeRange, setTimeRange] = useState('30');
  const [hoveredDateIdx, setHoveredDateIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsRes, activityRes, waRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/dashboard-analytics`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }),
        fetch(`${baseUrl}/api/admin/recent-activity`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }),
        fetch(`${baseUrl}/api/whatsapp/status`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).catch(() => ({ ok: false }))
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setData(analyticsData);
      }
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivity(Array.isArray(activityData) ? activityData : []);
      }
      if (waRes && waRes.ok) {
        const waData = await waRes.json();
        setWhatsappStatus(waData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Compute Time Series Dates for dynamic multi-line chart
  const chartDays = useMemo(() => {
    const count = parseInt(timeRange, 10);
    const days = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ key, label, fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
    }
    return days;
  }, [timeRange]);

  const seriesData = useMemo(() => {
    if (!data?.timeSeries) return { reqs: [], apps: [], users: [], projs: [] };
    
    const reqMap = new Map((data.timeSeries.requests || []).map(r => [r.day_key, r.count]));
    const appMap = new Map((data.timeSeries.applications || []).map(r => [r.day_key, r.count]));
    const userMap = new Map((data.timeSeries.users || []).map(r => [r.day_key, r.count]));
    const projMap = new Map((data.timeSeries.projects || []).map(r => [r.day_key, r.count]));

    return {
      reqs: chartDays.map(d => reqMap.get(d.key) || 0),
      apps: chartDays.map(d => appMap.get(d.key) || 0),
      users: chartDays.map(d => userMap.get(d.key) || 0),
      projs: chartDays.map(d => projMap.get(d.key) || 0)
    };
  }, [data, chartDays]);

  // Calculate SVG polyline coordinates
  const chartHeight = 160;
  const chartWidth = 600;
  const maxVal = useMemo(() => {
    const all = [...seriesData.reqs, ...seriesData.apps, ...seriesData.users, ...seriesData.projs];
    const m = Math.max(...all, 5);
    return Math.ceil(m * 1.25);
  }, [seriesData]);

  const getPointsString = (values) => {
    if (!values.length) return '';
    return values.map((val, idx) => {
      const x = (idx / (values.length - 1 || 1)) * chartWidth;
      const y = chartHeight - (val / maxVal) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    }).join(' ');
  };

  // User Distribution Donut computations
  const totalUsersCount = data?.kpi?.total_users || 0;
  const distributionColors = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#6366F1'];
  
  const distributionSegments = useMemo(() => {
    const list = data?.distribution || [];
    if (!list.length || totalUsersCount === 0) return [];
    
    let cumulative = 0;
    return list.map((item, idx) => {
      const percent = totalUsersCount > 0 ? (item.count / totalUsersCount) * 100 : 0;
      const strokeDasharray = `${percent} ${100 - percent}`;
      const strokeDashoffset = -cumulative;
      cumulative += percent;
      return {
        name: item.role_name,
        count: item.count,
        percent: Math.round(percent),
        color: distributionColors[idx % distributionColors.length],
        strokeDasharray,
        strokeDashoffset
      };
    });
  }, [data, totalUsersCount]);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const formatCurrency = (val) => {
    if (!val || val === 0) return '₹0';
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val}`;
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'recently';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading && !data) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange/20 border-t-orange rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Connecting to live database analytics...</p>
      </div>
    );
  }

  const kpi = data?.kpi || {
    total_users: 0,
    users_this_month: 0,
    total_applications: 0,
    apps_this_month: 0,
    total_requests: 0,
    requests_this_month: 0,
    active_projects: 0,
    projects_this_month: 0,
    revenue_this_month: 0,
    invoices_count: 0
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-gray-800">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Greeting */}
        <div className="lg:col-span-5">
          <p className="text-sm font-semibold text-gray-500 mb-1">Good Morning,</p>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Welcome Back! <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with EDIZO today.</p>
        </div>

        {/* Center: Motivational Quote */}
        <div className="lg:col-span-3 text-center lg:text-left hidden md:block">
          <div className="inline-block relative px-4 py-2 border-l-2 border-orange/40 bg-orange/5 rounded-r-xl">
            <p className="font-serif italic text-gray-700 text-sm font-medium">
              “Build better. Deliver faster. Grow together.”
            </p>
            <div className="w-12 h-0.5 bg-orange/60 mt-1 rounded-full"></div>
          </div>
        </div>

        {/* Right: Action Promo Banner */}
        <div className="lg:col-span-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 p-4 rounded-2xl border border-orange-200/60 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-sm font-black text-gray-900">Turn Ideas Into Digital Products</h4>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Web • Mobile • AI • Automation</p>
            <Link 
              to="/proposals" 
              className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 bg-orange hover:bg-orange-dark text-white rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Start a Project <ArrowRight size={12} />
            </Link>
          </div>
          <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center text-orange shrink-0 relative z-10">
            <Sparkles size={28} />
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-600 bg-emerald-50">
              <ArrowUpRight size={12} /> {kpi.users_this_month > 0 ? `+${Math.round((kpi.users_this_month / (kpi.total_users || 1)) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{kpi.total_users}</h3>
            <p className="text-[11px] text-gray-500 mt-1">+{kpi.users_this_month} this month</p>
          </div>
          {/* Mini Sparkline */}
          <div className="mt-2 h-6 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d="M0 20 Q 25 15, 50 18 T 100 6" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Internship Applications */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-600 bg-emerald-50">
              <ArrowUpRight size={12} /> {kpi.apps_this_month > 0 ? `+${Math.round((kpi.apps_this_month / (kpi.total_applications || 1)) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Internship Apps</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{kpi.total_applications}</h3>
            <p className="text-[11px] text-gray-500 mt-1">+{kpi.apps_this_month} this month</p>
          </div>
          <div className="mt-2 h-6 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d="M0 22 Q 30 18, 60 10 T 100 4" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Service Requests */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-600 bg-emerald-50">
              <ArrowUpRight size={12} /> {kpi.requests_this_month > 0 ? `+${Math.round((kpi.requests_this_month / (kpi.total_requests || 1)) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Requests</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{kpi.total_requests}</h3>
            <p className="text-[11px] text-gray-500 mt-1">+{kpi.requests_this_month} this month</p>
          </div>
          <div className="mt-2 h-6 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d="M0 18 Q 35 22, 65 12 T 100 8" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-600 bg-emerald-50">
              <ArrowUpRight size={12} /> +{kpi.projects_this_month}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Projects</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{kpi.active_projects}</h3>
            <p className="text-[11px] text-gray-500 mt-1">+{kpi.projects_this_month} this month</p>
          </div>
          <div className="mt-2 h-6 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d="M0 20 Q 20 10, 50 14 T 100 5" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Revenue This Month */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-600 bg-emerald-50">
              <ArrowUpRight size={12} /> Live
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue This Month</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{formatCurrency(kpi.revenue_this_month)}</h3>
            <p className="text-[11px] text-gray-500 mt-1">from {kpi.invoices_count} invoices</p>
          </div>
          <div className="mt-2 h-6 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d="M0 22 Q 40 18, 70 8 T 100 6" fill="none" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* Second Row: Multi-line Chart + Donut Distribution + Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart: Lead & Project Overview (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-gray-900">Lead & Project Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time dynamic submissions timeline</p>
            </div>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Overview Time Range Filter"
              className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            >
              <option value="30">Last 30 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="7">Last 7 Days</option>
            </select>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
            <div className="flex items-center gap-1.5 font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Service Requests
            </div>
            <div className="flex items-center gap-1.5 font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Applications
            </div>
            <div className="flex items-center gap-1.5 font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-orange"></span> New Users
            </div>
            <div className="flex items-center gap-1.5 font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Projects
            </div>
          </div>

          {/* SVG Multi-Line Chart Container */}
          <div className="relative w-full h-44 mt-2">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#F3F4F6" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight * 0.50} x2={chartWidth} y2={chartHeight * 0.50} stroke="#F3F4F6" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#F3F4F6" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight - 1} x2={chartWidth} y2={chartHeight - 1} stroke="#E5E7EB" />

              {/* Data Series Polylines */}
              <polyline fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={getPointsString(seriesData.reqs)} />
              <polyline fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={getPointsString(seriesData.apps)} />
              <polyline fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={getPointsString(seriesData.users)} />
              <polyline fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={getPointsString(seriesData.projs)} />

              {/* Interaction Hover Line */}
              {hoveredDateIdx !== null && (
                <line 
                  x1={(hoveredDateIdx / (chartDays.length - 1 || 1)) * chartWidth} 
                  y1="0" 
                  x2={(hoveredDateIdx / (chartDays.length - 1 || 1)) * chartWidth} 
                  y2={chartHeight} 
                  stroke="#9CA3AF" 
                  strokeDasharray="2 2" 
                />
              )}
            </svg>

            {/* Hover Target Overlay Columns */}
            <div className="absolute inset-0 flex">
              {chartDays.map((day, idx) => (
                <div 
                  key={day.key} 
                  className="flex-1 h-full cursor-pointer group"
                  onMouseEnter={() => setHoveredDateIdx(idx)}
                  onMouseLeave={() => setHoveredDateIdx(null)}
                />
              ))}
            </div>

            {/* Interactive Tooltip Card */}
            {hoveredDateIdx !== null && (
              <div 
                className="absolute z-30 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-xl text-xs space-y-1 min-w-[150px] pointer-events-none transform -translate-x-1/2 -top-12"
                style={{ 
                  left: `${(hoveredDateIdx / (chartDays.length - 1 || 1)) * 100}%` 
                }}
              >
                <div className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-1">
                  {chartDays[hoveredDateIdx]?.fullDate}
                </div>
                <div className="flex justify-between items-center text-blue-600 font-semibold">
                  <span>Requests:</span> <span>{seriesData.reqs[hoveredDateIdx]}</span>
                </div>
                <div className="flex justify-between items-center text-purple-600 font-semibold">
                  <span>Applications:</span> <span>{seriesData.apps[hoveredDateIdx]}</span>
                </div>
                <div className="flex justify-between items-center text-orange font-semibold">
                  <span>New Users:</span> <span>{seriesData.users[hoveredDateIdx]}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600 font-semibold">
                  <span>Projects:</span> <span>{seriesData.projs[hoveredDateIdx]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom X-Axis labels */}
          <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium">
            <span>{chartDays[0]?.label}</span>
            <span>{chartDays[Math.floor(chartDays.length / 4)]?.label}</span>
            <span>{chartDays[Math.floor(chartDays.length / 2)]?.label}</span>
            <span>{chartDays[Math.floor(chartDays.length * 0.75)]?.label}</span>
            <span>{chartDays[chartDays.length - 1]?.label}</span>
          </div>
        </div>

        {/* Center: User Distribution Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-gray-900">User Distribution</h3>
            <p className="text-xs text-gray-400 mt-0.5">Live database role segmentation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-3">
            {/* SVG Donut */}
            <div className="sm:col-span-5 flex justify-center">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.91549430918954" fill="none" stroke="#F3F4F6" strokeWidth="4.5" />
                  {distributionSegments.map((seg, i) => (
                    <circle 
                      key={i}
                      cx="18" 
                      cy="18" 
                      r="15.91549430918954" 
                      fill="none" 
                      stroke={seg.color} 
                      strokeWidth="4.5"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-gray-900 leading-tight">{totalUsersCount}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Total Users</span>
                </div>
              </div>
            </div>

            {/* Role Breakdown List */}
            <div className="sm:col-span-7 space-y-2">
              {distributionSegments.length > 0 ? distributionSegments.map((seg, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }}></span>
                    <span className="text-gray-700 font-semibold truncate capitalize">{seg.name}</span>
                  </div>
                  <div className="text-gray-500 font-bold shrink-0 ml-2">
                    {seg.count} <span className="text-gray-400 font-normal text-[10px]">({seg.percent}%)</span>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-gray-400 italic">No user role data available.</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">RBAC Status</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck size={14} /> Synchronized
            </span>
          </div>
        </div>

        {/* Right: Today's Tasks (3 Cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-gray-900">Today's Tasks</h3>
            <Link to="/tasks" className="text-xs font-bold text-orange hover:underline">View All</Link>
          </div>

          <div className="space-y-3 my-auto">
            {data?.todayTasks && data.todayTasks.length > 0 ? (
              data.todayTasks.map((task) => {
                const isDone = completedTasks.has(task.id) || task.status === 'completed';
                return (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                      isDone ? 'bg-emerald-50/40 text-gray-400 line-through' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <button 
                      aria-label={`Toggle task: ${task.title}`}
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-orange'
                      }`}
                    >
                      {isDone && <Check size={10} strokeWidth={3} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{task.title}</p>
                      <span className="text-[10px] text-gray-400">
                        {task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-400">
                <CheckCircle2 size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-xs">No pending tasks today</p>
                <Link to="/tasks" className="text-[11px] text-orange font-bold hover:underline mt-1 inline-block">+ Add Task</Link>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <Link to="/tasks" className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors">
              Manage Sprint Board <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* Third Row: Status Counters & Announcement Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* WhatsApp Status Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <Link to="/whatsapp" className="w-7 h-7 rounded-full bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 flex items-center justify-center transition-colors">
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <span>WhatsApp Status</span>
              <span className={`w-2 h-2 rounded-full ${whatsappStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            </div>
            <p className="text-xs font-semibold text-gray-600 mt-1">
              {whatsappStatus.connected ? 'Connected' : 'Scanner Ready'}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {whatsappStatus.info?.wid?.user ? `+${whatsappStatus.info.wid.user}` : 'Auto-replies active'}
            </p>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-xl font-black text-gray-900">{data?.statusCounters?.pending_followups || 0}</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-900">Pending Follow-ups</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Leads to contact</p>
            <Link to="/crm" className="text-xs font-bold text-orange hover:underline inline-flex items-center gap-1 mt-2">
              View Leads <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <span className="text-xl font-black text-gray-900">{data?.statusCounters?.pending_approvals || 0}</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-900">Pending Approvals</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Internship applications</p>
            <Link to="/applications" className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1 mt-2">
              Review Now <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Headphones size={20} />
            </div>
            <span className="text-xl font-black text-gray-900">{data?.statusCounters?.open_tickets || 0}</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-900">Support Tickets</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Open inquiries</p>
            <Link to="/tickets" className="text-xs font-bold text-pink-600 hover:underline inline-flex items-center gap-1 mt-2">
              View Tickets <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Announcements Widget */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-gray-900">Announcements</h4>
            <span className="text-[10px] font-bold text-orange">Live</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-bold text-gray-900 text-[11px]">System Live V2</p>
              <p className="text-[10px] text-gray-500 mt-0.5">All modules synchronized with MySQL.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Fourth Row: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 Cols): Recent Activity Feed */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-gray-900">Recent Activity</h3>
            <Link to="/users" className="text-xs font-bold text-orange hover:underline">View All</Link>
          </div>

          <div className="divide-y divide-gray-100">
            {activity.length > 0 ? (
              activity.map((item, index) => (
                <div key={index} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      item.type === 'user' ? 'bg-orange/10 text-orange' :
                      item.type === 'application' ? 'bg-purple-100 text-purple-600' :
                      item.type === 'request' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                    }`}>
                      {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-800 truncate">
                        <span className="font-bold text-gray-900">{item.name || 'Anonymous'}</span>
                        {item.type === 'user' && ' joined as a new user'}
                        {item.type === 'application' && ' submitted an internship application'}
                        {item.type === 'request' && ' requested a custom service'}
                        {item.type === 'ticket' && ` raised ticket: ${item.target || 'Support'}`}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{getRelativeTime(item.created_at)}</p>
                    </div>
                  </div>
                  
                  <span className="px-2 py-0.5 bg-orange/10 text-orange font-bold text-[10px] rounded-full shrink-0">
                    New
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                No recent activity logged in the system.
              </div>
            )}
          </div>
        </div>

        {/* Right (5 Cols): Quick Actions */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-black text-gray-900">Quick Actions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Instant operational shortcuts</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
            
            <Link 
              to="/users" 
              className="p-3.5 bg-gray-50 hover:bg-orange/5 hover:border-orange/30 border border-gray-200/70 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-orange/10 group-hover:text-orange flex items-center justify-center transition-colors mb-2">
                <UserPlus size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800">Add New User</span>
            </Link>

            <Link 
              to="/projects" 
              className="p-3.5 bg-gray-50 hover:bg-orange/5 hover:border-orange/30 border border-gray-200/70 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-orange/10 group-hover:text-orange flex items-center justify-center transition-colors mb-2">
                <FolderPlus size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800">Create Project</span>
            </Link>

            <Link 
              to="/whatsapp" 
              className="p-3.5 bg-gray-50 hover:bg-orange/5 hover:border-orange/30 border border-gray-200/70 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-orange/10 group-hover:text-orange flex items-center justify-center transition-colors mb-2">
                <Send size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800">WhatsApp Msg</span>
            </Link>

            <Link 
              to="/proposals" 
              className="p-3.5 bg-gray-50 hover:bg-orange/5 hover:border-orange/30 border border-gray-200/70 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-orange/10 group-hover:text-orange flex items-center justify-center transition-colors mb-2">
                <FileText size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800">Generate Proposal</span>
            </Link>

            <Link 
              to="/applications" 
              className="p-3.5 bg-gray-50 hover:bg-orange/5 hover:border-orange/30 border border-gray-200/70 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center mb-2">
                <GraduationCap size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800">Applications</span>
            </Link>

            <Link 
              to="/services" 
              className="p-3.5 bg-gray-50 hover:bg-orange/5 hover:border-orange/30 border border-gray-200/70 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-orange/10 group-hover:text-orange flex items-center justify-center transition-colors mb-2">
                <Briefcase size={18} />
              </div>
              <span className="text-xs font-bold text-gray-800">Manage Services</span>
            </Link>

          </div>

          <div className="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><Activity size={14} className="text-orange" /> Real-time sync active</span>
            <button 
              onClick={fetchDashboard} 
              className="font-bold text-orange hover:underline cursor-pointer"
            >
              Refresh Data
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverview;
