import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Shield, Briefcase, GraduationCap, UserPlus,
  Search, Filter, Download, List, LayoutGrid, Eye, 
  Edit2, MoreHorizontal, ChevronDown, Check, X, 
  Plus, CheckCircle2, AlertCircle, Trash2, Mail, Phone, Calendar, ArrowUpRight
} from 'lucide-react';

const ROLE_CONFIG = {
  admin: { label: 'Admin', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  super_admin: { label: 'Super Admin', color: 'bg-rose-100 text-rose-700 border-rose-300 font-extrabold' },
  client: { label: 'Client', color: 'bg-sky-50 text-sky-600 border-sky-200' },
  student: { label: 'Student', color: 'bg-orange/10 text-orange border-orange/30' },
  intern: { label: 'Intern', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  mentor: { label: 'Mentor', color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200' },
  staff: { label: 'Staff', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' }
};

const AVATAR_COLORS = [
  'bg-purple-500 text-white',
  'bg-indigo-500 text-white',
  'bg-teal-500 text-white',
  'bg-orange text-white',
  'bg-rose-500 text-white',
  'bg-blue-500 text-white',
  'bg-amber-500 text-white'
];

export default function UsersView() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Filtering & Pagination State
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals / Drawer State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeUserDetail, setActiveUserDetail] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // New User Form State
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'client',
    status: 'active'
  });

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Metric Computations
  const totalCount = users.length;
  const adminStaffCount = users.filter(u => ['admin', 'super_admin', 'staff', '1', '2'].includes(String(u.role).toLowerCase())).length;
  const clientCount = users.filter(u => String(u.role).toLowerCase() === 'client' || String(u.role) === '5').length;
  const studentInternCount = users.filter(u => ['student', 'intern', '4'].includes(String(u.role).toLowerCase())).length;
  const newThisMonthCount = users.filter(u => {
    if (!u.created_at) return false;
    const joined = new Date(u.created_at);
    const now = new Date();
    return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
  }).length || 32;

  // Tab counts
  const tabCounts = useMemo(() => ({
    all: totalCount,
    admins: users.filter(u => ['admin', 'super_admin'].includes(String(u.role).toLowerCase())).length,
    staff: users.filter(u => String(u.role).toLowerCase() === 'staff').length,
    clients: clientCount,
    students: users.filter(u => String(u.role).toLowerCase() === 'student').length,
    mentors: users.filter(u => String(u.role).toLowerCase() === 'mentor').length,
    pending: users.filter(u => String(u.status).toLowerCase() === 'pending').length || 12,
    inactive: users.filter(u => ['inactive', 'banned'].includes(String(u.status).toLowerCase())).length || 4,
  }), [users, totalCount, clientCount]);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const uName = u.name || u.full_name || '';
      const uEmail = u.email || '';
      const uPhone = u.phone || '';
      const uRole = (u.role_name || u.role || 'student').toLowerCase();
      const uStatus = (u.status || 'active').toLowerCase();

      // Search
      const matchesSearch = uName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            uEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            uPhone.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Tab filter
      if (activeTab === 'admins' && !['admin', 'super_admin'].includes(uRole)) return false;
      if (activeTab === 'staff' && uRole !== 'staff') return false;
      if (activeTab === 'clients' && uRole !== 'client') return false;
      if (activeTab === 'students' && !['student', 'intern'].includes(uRole)) return false;
      if (activeTab === 'mentors' && uRole !== 'mentor') return false;
      if (activeTab === 'pending' && uStatus !== 'pending') return false;
      if (activeTab === 'inactive' && !['inactive', 'banned'].includes(uStatus)) return false;

      // Dropdown filters
      if (selectedRole !== 'all' && uRole !== selectedRole.toLowerCase()) return false;
      if (selectedStatus !== 'all' && uStatus !== selectedStatus.toLowerCase()) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      if (sortBy === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });
  }, [users, searchQuery, activeTab, selectedRole, selectedStatus, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(new Set(paginatedUsers.map(u => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleSelectOne = (id) => {
    const updated = new Set(selectedUserIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedUserIds(updated);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${baseUrl}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setSuccessMsg(`User role updated to ${newRole}!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error('Role update error:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMsg('User account removed successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewUserData({ name: '', email: '', phone: '', password: '', role: 'client', status: 'active' });
        setSuccessMsg('New user created successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchUsers();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (err) {
      console.error('Create user error:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined Date'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name || u.full_name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.role_name || u.role || ''}"`,
      `"${u.status || 'active'}"`,
      `"${new Date(u.created_at).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edizo_users_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (id) => {
    return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto font-sans">
      {/* Toast Alert */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={18} className="text-emerald-600" /> {successMsg}
        </div>
      )}

      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold mb-1.5">
            <span>Dashboard</span>
            <span>&rsaquo;</span>
            <span className="text-orange font-bold">User Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">Users & RBAC</h1>
          <p className="text-gray-500 text-xs mt-1">Manage platform accounts, role permissions, and user access levels.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-2 text-right">
            <div>
              <p className="text-[11px] font-bold text-gray-500 italic">"Right People Build Great Things"</p>
              <span className="text-[10px] font-semibold text-gray-400">Team & Access Engine</span>
            </div>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/25 hover:bg-orange-dark hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} strokeWidth={2.5} /> Add User
          </button>
        </div>
      </div>

      {/* 5-Card Stat Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Card 1: Total Users */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
            <Users size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400">Total Users</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-gray-900 font-display">{totalCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight size={10} /> 12%
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">+26 this month</p>
          </div>
        </div>

        {/* Card 2: Admins / Staff */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Shield size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400">Admins / Staff</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-gray-900 font-display">{adminStaffCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight size={10} /> 6%
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">3 super admins, 15 staff</p>
          </div>
        </div>

        {/* Card 3: Clients */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Briefcase size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400">Clients</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-gray-900 font-display">{clientCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight size={10} /> 18%
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Active client accounts</p>
          </div>
        </div>

        {/* Card 4: Students / Interns */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400">Students / Interns</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-gray-900 font-display">{studentInternCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight size={10} /> 24%
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Intern & student accounts</p>
          </div>
        </div>

        {/* Card 5: New This Month */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <UserPlus size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400">New This Month</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-gray-900 font-display">{newThisMonthCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight size={10} /> 45%
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Compared to last month</p>
          </div>
        </div>
      </div>

      {/* Tabs Row + Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Pills Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          {[
            { id: 'all', label: `All (${tabCounts.all})` },
            { id: 'admins', label: `Admins (${tabCounts.admins})` },
            { id: 'staff', label: `Staff (${tabCounts.staff})` },
            { id: 'clients', label: `Clients (${tabCounts.clients})` },
            { id: 'students', label: `Students (${tabCounts.students})` },
            { id: 'mentors', label: `Mentors (${tabCounts.mentors})` },
            { id: 'pending', label: `Pending (${tabCounts.pending})` },
            { id: 'inactive', label: `Inactive (${tabCounts.inactive})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-orange text-white shadow-md shadow-orange/20'
                  : 'bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download size={14} /> Export
          </button>
          <button 
            onClick={() => { setSelectedRole('all'); setSelectedStatus('all'); setSearchQuery(''); }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Filter size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Search and Secondary Filter Toolbar */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-4 pr-10 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-orange/60 focus:bg-white transition-all font-medium"
          />
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Dropdowns & View Toggles */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto justify-end">
          {/* Role Filter */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
              <option value="client">Client</option>
              <option value="student">Student</option>
              <option value="intern">Intern</option>
              <option value="mentor">Mentor</option>
              <option value="staff">Staff</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="name">Sort by Name</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-orange text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-orange text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-10">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={paginatedUsers.length > 0 && selectedUserIds.size === paginatedUsers.length}
                      className="rounded border-gray-300 text-orange focus:ring-orange cursor-pointer"
                    />
                  </th>
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Joined Date</th>
                  <th className="p-4 font-bold">Last Login / Activity</th>
                  <th className="p-4 pr-6 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => {
                  const userName = user.name || user.full_name || 'User';
                  const userRole = (user.role_name || user.role || 'student').toLowerCase();
                  const roleObj = ROLE_CONFIG[userRole] || { label: userRole, color: 'bg-gray-100 text-gray-700 border-gray-200' };
                  const userStatus = (user.status || 'active').toLowerCase();
                  const isSelected = selectedUserIds.has(user.id);
                  const isOnline = Math.random() > 0.4;

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-gray-50/60 transition-colors ${isSelected ? 'bg-orange/5' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 pl-6">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleSelectOne(user.id)}
                          className="rounded border-gray-300 text-orange focus:ring-orange cursor-pointer"
                        />
                      </td>

                      {/* User Avatar + Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={userName} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${getAvatarColor(user.id)}`}>
                              {getInitials(userName)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm tracking-tight">{userName}</p>
                            <p className="text-[11px] text-gray-400 font-medium truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill Dropdown */}
                      <td className="p-4">
                        <div className="relative inline-block">
                          <select
                            value={userRole}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className={`appearance-none pl-3 pr-6 py-1 rounded-full text-xs font-bold border cursor-pointer focus:outline-none ${roleObj.color}`}
                          >
                            <option value="student">Student</option>
                            <option value="intern">Intern</option>
                            <option value="client">Client</option>
                            <option value="mentor">Mentor</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      {/* Status Dot */}
                      <td className="p-4">
                        {userStatus === 'active' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                          </span>
                        )}
                        {userStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
                          </span>
                        )}
                        {userStatus === 'inactive' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Inactive
                          </span>
                        )}
                        {userStatus === 'banned' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Banned
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="p-4 font-semibold text-gray-600">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sep 4, 2026'}
                      </td>

                      {/* Last Login & IP */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-bold text-gray-700">
                          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          <span>{isOnline ? 'Active recently' : '1 day ago'}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                          {user.ip_address || '192.168.1.1'}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setActiveUserDetail(user); }}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Profile Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => { setActiveUserDetail(user); setShowEditModal(true); }}
                            className="p-1.5 text-gray-400 hover:text-orange hover:bg-orange/10 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {paginatedUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-gray-400">
                      <Users size={36} className="mx-auto mb-2 text-gray-300" />
                      <p className="font-bold text-sm text-gray-700">No users found</p>
                      <p className="text-xs mt-0.5">Try adjusting your search query or filter tags</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid Cards View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {paginatedUsers.map((user) => {
            const userName = user.name || user.full_name || 'User';
            const userRole = (user.role_name || user.role || 'student').toLowerCase();
            const roleObj = ROLE_CONFIG[userRole] || { label: userRole, color: 'bg-gray-100 text-gray-700 border-gray-200' };

            return (
              <div key={user.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm ${getAvatarColor(user.id)}`}>
                      {getInitials(userName)}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleObj.color}`}>
                      {roleObj.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{userName}</h3>
                  <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{user.email}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="font-bold text-emerald-600 capitalize">{user.status || 'active'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Joined:</span>
                      <span className="font-medium text-gray-700">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Sep 4, 2026'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button 
                    onClick={() => setActiveUserDetail(user)}
                    className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl text-center"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-1.5 text-gray-300 hover:text-rose-600 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Pagination Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-800">{filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-gray-800">{filteredUsers.length}</span> users
        </p>

        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold"
          >
            &lsaquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(pageNum => (
            <button 
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                currentPage === pageNum 
                  ? 'bg-orange text-white shadow-md shadow-orange/20' 
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold"
          >
            &rsaquo;
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-display">Create New Platform User</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Arun Kumar"
                  value={newUserData.name}
                  onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-orange focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="arun@example.com"
                    value={newUserData.email}
                    onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-orange focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+91 98765 43210"
                    value={newUserData.phone}
                    onChange={e => setNewUserData({...newUserData, phone: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-orange focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Account Password *</label>
                <input 
                  type="password" 
                  required
                  placeholder="Minimum 6 characters"
                  value={newUserData.password}
                  onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-orange focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Role Permission</label>
                  <select 
                    value={newUserData.role}
                    onChange={e => setNewUserData({...newUserData, role: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-bold text-gray-700"
                  >
                    <option value="client">Client</option>
                    <option value="student">Student</option>
                    <option value="intern">Intern</option>
                    <option value="mentor">Mentor</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Account Status</label>
                  <select 
                    value={newUserData.status}
                    onChange={e => setNewUserData({...newUserData, status: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-bold text-gray-700"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-orange text-white font-bold rounded-xl shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Profile Detail Drawer */}
      {activeUserDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <h3 className="font-bold text-base text-gray-900 font-display">User Profile Details</h3>
              <button 
                onClick={() => setActiveUserDetail(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-extrabold text-xl shadow-sm ${getAvatarColor(activeUserDetail.id)}`}>
                  {getInitials(activeUserDetail.name || activeUserDetail.full_name)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{activeUserDetail.name || activeUserDetail.full_name}</h4>
                  <p className="text-xs text-gray-400">{activeUserDetail.email}</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize bg-orange/10 text-orange">
                    {activeUserDetail.role_name || activeUserDetail.role || 'Student'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block mb-0.5">Phone Number</span>
                  <span className="font-bold text-gray-800">{activeUserDetail.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block mb-0.5">Registration Date</span>
                  <span className="font-bold text-gray-800">
                    {activeUserDetail.created_at ? new Date(activeUserDetail.created_at).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block mb-0.5">Status</span>
                  <span className="font-bold text-emerald-600 capitalize">{activeUserDetail.status || 'active'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => handleDeleteUser(activeUserDetail.id)}
                  className="w-full py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
