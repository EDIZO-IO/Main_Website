import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Calendar, Search, Shield, Trash2, CheckCircle2, UserCheck } from 'lucide-react';

const UsersView = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setSuccessMsg('User role updated!');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMsg('User deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || String(u.role).toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="p-8">Loading Users...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-gray-500 mb-1">Dashboard &rsaquo; <span className="text-orange font-medium">User Management</span></div>
          <h1 className="text-4xl font-bold text-gray-900 font-display">Users & RBAC</h1>
          <p className="text-gray-500 text-sm mt-1">Manage platform accounts, role permissions, and user access levels.</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-3 font-medium">
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      {/* Metric Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Users</p>
          <h3 className="text-3xl font-bold font-display text-gray-900">{users.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Admins / Staff</p>
          <h3 className="text-3xl font-bold font-display text-purple-600">
            {users.filter(u => ['admin', 'super_admin', 'staff', '1', '2'].includes(String(u.role).toLowerCase())).length}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Clients</p>
          <h3 className="text-3xl font-bold font-display text-blue-600">
            {users.filter(u => String(u.role).toLowerCase() === 'client' || String(u.role) === '5').length}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Students / Interns</p>
          <h3 className="text-3xl font-bold font-display text-orange">
            {users.filter(u => String(u.role).toLowerCase() === 'student' || String(u.role) === '4').length}
          </h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'admin', 'client', 'student', 'mentor', 'staff'].map(role => (
            <button 
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${roleFilter === role ? 'bg-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="p-4">User Details</th>
              <th className="p-4">Role Permission</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <select 
                    value={user.role} 
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-xs font-bold bg-gray-50 focus:outline-none focus:border-orange cursor-pointer"
                  >
                    <option value="student">Student / Intern</option>
                    <option value="client">Client</option>
                    <option value="mentor">Mentor</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar size={14} className="text-gray-400" /> {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No users found matching filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersView;
