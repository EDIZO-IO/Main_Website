import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const UsersView = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
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
    };
    fetchUsers();
  }, [token]);

  if (loading) return <div className="p-8">Loading Users...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">User Management</h1>
        <p className="text-gray-500">View all registered users across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-700 text-sm">User Details</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Role</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Joined Date</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length > 0 ? users.map(user => (
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      user.role === 'admin' || user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 
                      user.role === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14}/> {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-orange hover:underline text-sm font-bold">View Profile</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersView;
